window.onload = function () {
    var hostName ='http://rusredbook.ru';

    var yandex_api_key = "bd06af90-5a4a-46cd-b30e-858aa999acc4";
    var recognizer, timer;
    window.ya.speechkit.settings.apikey = yandex_api_key;
    recognizer = new ya.speechkit.SpeechRecognition();

    var searchInput = document.querySelector('#searchInput');
    searchInput.oninput = function () { addFuzzySearchResults(searchInput.value) };

    var searchForm = document.querySelector('#searchForm');
    searchForm.onsubmit = function (e) {
        e.preventDefault();
        searchInDictionary(searchInput.value);
    }

    var searchButton = document.querySelector('#searchButton');
    searchButton.onclick = function () { searchInDictionary(searchInput.value) };

    $("#voiceSearch").on("click", function () {
        recognizer.start({
            initCallback: function () {
                timer = setTimeout("recognizer.stop()", 2000);
            },
            dataCallback: function (result, finish) {
                if (result && finish) {
                    result = (result.charAt(0).toUpperCase() + result.substr(1)).trim();
                    clearTimeout(timer);
                    recognizer.stop();
                    searchInput.value = result;

                    $(searchForm).submit();

                }
            },
            errorCallback: function (err) {
                alert(JSON.stringify(err));
            },
            utteranceSilence: 50
        });
    });

    var searchDropdown = document.querySelector('#searchDropdown');

    var resultsContainer = document.querySelector('#results');
    resultsContainer.hidden = true;
    
    function firstToUpperCase(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

    function searchInDictionary(term) {
        console.log('searchInDictionary', term)
        term = term.toLowerCase();
        if (terms.includes(term)) {
            loader.hidden = false;
            searchDropdown.hidden = true;
            socket.emit('query', term);
            socket.on('data', function (data) {
                loader.hidden = true;
                createResultsView(term, data);
            })
        }
    }

    var loader = document.querySelector('#loader');
    loader.hidden = true;

    function createResultsView(term, res) {
        var results = document.createElement('div');
        var word = document.createElement('div');
        for (var posVariant in res) {
            if (res.hasOwnProperty(posVariant)) {
                var r = res[posVariant];
                word.innerText = firstToUpperCase(term);
                var div = document.createElement('div');
                var hr = document.createElement('hr');
                // morphology
                var morph = document.createElement('p');
                morph.setAttribute('class', 'morphology');
                morph.innerHTML = '<b>Часть речи: </b>';
                var morphProperties = document.createTextNode(r.partOfSpeech);
                morph.appendChild(morphProperties);
                var meaningsContainer = document.createElement('div');
                // meanings
                for (var meaning in r.meanings) {
                    if (r.meanings.hasOwnProperty(meaning)) {
                        // meaning
                        var meaningHeader = document.createElement('div');
                        meaningHeader.setAttribute('class', 'header');
                        meaningHeader.innerText = 'Значение:';
                        var meaningP = document.createElement('p');
                        meaningP.setAttribute('class', 'meaning');
                        // examples
                        var examplesHeader = document.createElement('div');
                        examplesHeader.setAttribute('class', 'header');
                        var examplesUl = document.createElement('ul');
                        var examples = r.meanings[meaning];
                        meaningP.innerText = meaning;
                        if (examples.length > 0) {
                            examplesHeader.innerText = (examples.length == 1) ? 'Пример употребления:' : 'Примеры употребления:';
                            examples.forEach(function (example) {
                                var li = document.createElement('li');
                                var p = document.createElement('p');
                                p.setAttribute('class', 'example');
                                p.innerText = example;
                                li.appendChild(p);
                                examplesUl.appendChild(li);
                            })
                        }
                        meaningsContainer.appendChild(meaningHeader);
                        meaningsContainer.appendChild(meaningP);
                        meaningsContainer.appendChild(examplesHeader);
                        meaningsContainer.appendChild(examplesUl);
                    }
                }

                div.appendChild(hr);
                div.appendChild(morph);
                div.appendChild(meaningsContainer);
                results.appendChild(div);

            }
        }
        resultsContainer.innerHTML = '';
        resultsContainer.hidden = false;
        resultsContainer.appendChild(word);
        resultsContainer.appendChild(results);

        var shareLink = document.createElement('a');
        shareLink.innerText = 'Поделиться';
        shareLink.setAttribute('href', createQueryUrl(term));
        shareLink.setAttribute('target', '_blank');
        shareLink.setAttribute('class', 'btn btn-danger pull-right');
        resultsContainer.appendChild(shareLink);
    }

    function getBiGrams(string) {
        var s = string.toLowerCase();
        var v = new Array(s.length - 1);
        for (var i = 0, l = v.length; i < l; i++) {
            v[i] = s.slice(i, i + 2);
        }
        return v;
    }

    function stringSimilarity(str1, str2) {
        if (str1.length > 0 && str2.length > 0) {
            var pairs1 = getBiGrams(str1);
            var pairs2 = getBiGrams(str2);
            var union = pairs1.length + pairs2.length;
            var hitCount = 0;
            pairs1.forEach(function (x) {
                pairs2.forEach(function (y) {
                    if (x == y) hitCount++;
                })
            });
            if (hitCount > 0) return ((hitCount * 2) / union);
        }
        return 0;
    }

    function fuzzySearch(query) {
        var maxResults = 5;
        var minRelevance = 0.3;
        var relevances = [];
        var results = [];
        terms.forEach(function (s) {
            var r = { string: s, relevance: stringSimilarity(query, s) };
            relevances.push(r);
        });
        relevances.sort(function (a, b) {
            return b.relevance - a.relevance;
        });
        var i = 0;
        while (maxResults) {
            var r = relevances[i];
            if (r.relevance > 0 && r.relevance > minRelevance) results.push(r.string);
            i++;
            maxResults--;
        }
        return results;
    }

    var dropdownNavIndex;
    function addFuzzySearchResults(query) {
        searchDropdown.innerHTML = '';
        var results = fuzzySearch(query);
        if (results.length > 0) {
            abcContainer.hidden = true;
            searchDropdown.hidden = false;
            var ul = document.createElement('ul');
            ul.setAttribute('id', 'searchDropdownResults')
            results.forEach(function (r) {
                var li = document.createElement('li');
                li.innerText = r;
                ul.appendChild(li);
                li.onclick = function () {
                    searchInput.value = r;
                    toggleLiClass(ul.childNodes, li, 'searchDropdownHover');
                }
            })
            searchDropdown.appendChild(ul);
            dropdownNavIndex = -1;
        }
        else abcContainer.hidden = false;
    }

    searchInput.onkeyup = function (e) {
        e.preventDefault();
        if (e.keyCode == 40) { navigateOnDropdown(1) }
        if (e.keyCode == 38) { navigateOnDropdown(-1) }
        if (e.keyCode == 27) { searchInput.value = '' }
    }

    function navigateOnDropdown(diff) {
        dropdownNavIndex += diff;
        var ul = document.querySelector('#searchDropdownResults');
        var results, resultsLength;
        if (ul) {
            results = ul.querySelectorAll('li');
            resultsLength = results.length;
        }
        if (resultsLength > 0 && searchDropdown.hidden == false) {
            if (dropdownNavIndex >= resultsLength) dropdownNavIndex = 0;
            if (dropdownNavIndex < 0) dropdownNavIndex = resultsLength - 1;
            toggleLiClass(results, results[dropdownNavIndex], 'searchDropdownHover');
            searchInput.value = results[dropdownNavIndex].innerText;
        }
    }

    function toggleLiClass(ul, activeLi, className) {
        ul.forEach(function (li) {
            if (li.nodeName == 'LI') {
                li.removeAttribute('class', className);
            }
        });
        activeLi.setAttribute('class', className);
    }

    function createAbcButtons() {
        var buttons = [
            { label: 'А' },
            { label: 'Б' },
            { label: 'В' },
            { label: 'Г' },
            { label: 'Д' },
            { label: 'Е-Ё' },
            { label: 'Ж' },
            { label: 'З' },
            { label: 'И-Й' },
            { label: 'К' },
            { label: 'Л' },
            { label: 'М' },
            { label: 'Н' },
            { label: 'О' },
            { label: 'П' },
            { label: 'Р' },
            { label: 'С' },
            { label: 'Т' },
            { label: 'У-Я' },
        ];
        var alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        var abcButtonsUl = document.createElement('ul');
        buttons.forEach(function (button) {
            button.words = [];
            var letters = [];
            if (button.label.indexOf('-') > 0) {
                var l = button.label.split('-');
                var firstIndex = alphabet.indexOf(l[0].toLocaleLowerCase());
                var lastIndex = alphabet.indexOf(l[1].toLocaleLowerCase());
                var range = alphabet.slice(firstIndex, lastIndex + 1);
                letters = range.split('');
            }
            else letters.push(button.label);
            terms.forEach(function (term) {
                term = term.toLowerCase();
                var termTail = term.slice(1);
                var termFirstLetter = term[0];
                letters.forEach(function (letter) {
                    if (termFirstLetter == letter.toLowerCase()) {
                        button.words.push(termFirstLetter.toUpperCase() + termTail);
                    }
                })
            });
            var li = document.createElement('li');
            var btn = document.createElement('button');
            if (button.words.length) {
                btn.setAttribute('class', 'btn btn-simple');
            }
            else {
                btn.setAttribute('class', 'empty btn btn-simple');
            }
            btn.onclick = function () { changeAbcWords(button) };
            btn.innerText = button.label;
            li.appendChild(btn);
            button.element = li;
            abcButtonsUl.appendChild(li);
        });
        abcButtons.appendChild(abcButtonsUl);
    }

    function createQueryUrl(term) {
        var baseUrl = hostName + '/dictionary?q='
        var term = escape('"' + term + '"');
        var url = encodeURI(baseUrl + term);
        return url;
    }

    var isModernBrowser = (bowser.webkit || bowser.blink || bowser.gecko);
    // var isModernBrowser = (bowser.webkit);

    function changeAbcWords(button) {
        abcWordsContainer.innerHTML = '';
        var wordsUl = document.createElement('ul');
        if (button.words.length) {
            var lettersUl = document.querySelector('#abc-letters');
            toggleLiClass(lettersUl.childNodes[0].childNodes, button.element, 'active');
            button.words.forEach(function (word) {
                var li = document.createElement('li');
                var btn = document.createElement('a');
                btn.setAttribute('class', 'btn btn-simple');
                btn.innerText = word;

                if (isModernBrowser) {
                    btn.onclick = function () {
                        searchInput.value = word;
                        // searchInput.focus();
                        searchInDictionary(word);
                    }
                }
                else {
                    btn.setAttribute('href', createQueryUrl(word));
                }

                
                li.appendChild(btn);
                wordsUl.appendChild(li);
            });
        }
        if (wordsUl.childElementCount > 0) {
            abcWordsContainer.appendChild(wordsUl);
            abcWordsContainer.hidden = false;
        } else {
            abcWordsContainer.hidden = true;
        }
    }

    var abcContainer = document.querySelector('#abc');
    var abcButtons = document.createElement('div');
    abcButtons.setAttribute('id', 'abc-letters');
    var abcWordsContainer = document.createElement('div');
    abcWordsContainer.setAttribute('id', 'abc-words');
    abcWordsContainer.hidden = true;
    abcContainer.appendChild(abcButtons);
    abcContainer.appendChild(abcWordsContainer);
    createAbcButtons();

    var socket = io({ transports: ['websocket'] });

    socket.on('error', function (e) {
        console.log(e);
    })

    if (Object.keys(request.data).length > 0) {
        searchInput.value = request.query;
        createResultsView(request.query, request.data);
    }
}
