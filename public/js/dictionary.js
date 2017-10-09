var searchInput = document.querySelector('#searchInput');
searchInput.oninput = () => addFuzzySearchResults(searchInput.value);

var searchForm = document.querySelector('#searchForm');
searchForm.onsubmit = (e) => {
    e.preventDefault();
    searchInDictionary(searchInput.value);
}

var searchButton = document.querySelector('#searchButton');
searchButton.onclick = () => searchInDictionary(searchInput.value);

var searchDropdown = document.querySelector('#searchDropdown');

var resultsContainer = document.querySelector('#results');
resultsContainer.hidden = true;

function firstToUpperCase(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function searchInDictionary(term) {
    console.log('searchInDictionary', term)
    term = term.toLowerCase();
    if(terms.includes(term)) {
        loader.hidden = false;
        searchDropdown.hidden = true;
        socket.emit('query', term);
        socket.on('data', (data) => {
            loader.hidden = true;
            createResultsView(term, data);
        })
    }
}

var loader = document.querySelector('#loader');
loader.hidden = true;

function createResultsView(term, res){
    let results = document.createElement('div');
    let word = document.createElement('div');
    for (var posVariant in res) {
        if (res.hasOwnProperty(posVariant)) {
            var r = res[posVariant];
            word.innerText = firstToUpperCase(term);
            let div = document.createElement('div');
            let hr = document.createElement('hr');
            // morphology
            let morph = document.createElement('p');
            morph.setAttribute('class', 'morphology');
            morph.innerHTML = '<b>Часть речи: </b>';
            let morphProperties = document.createTextNode(r.partOfSpeech);
            morph.appendChild(morphProperties);
            let meaningsContainer = document.createElement('div');
            // meanings
            for (var meaning in r.meanings) {
                if (r.meanings.hasOwnProperty(meaning)) {
                    // meaning
                    let meaningHeader = document.createElement('div');
                    meaningHeader.setAttribute('class', 'header');
                    meaningHeader.innerText = 'Значение:';
                    let meaningP = document.createElement('p');
                    meaningP.setAttribute('class', 'meaning');
                    // examples
                    let examplesHeader = document.createElement('div');
                    examplesHeader.setAttribute('class', 'header');
                    let examplesUl = document.createElement('ul');
                    let examples = r.meanings[meaning];
                    meaningP.innerText = meaning;
                    if(examples.length > 0) {
                        examplesHeader.innerText = (examples.length == 1) ? 'Пример употребления:' : 'Примеры употребления:';
                        examples.forEach((example) => {
                            let li = document.createElement('li');
                            let p = document.createElement('p');
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
}

function getBiGrams(string) {
    let s = string.toLowerCase();
    let v = new Array(s.length - 1);
    for (let i = 0, l = v.length; i < l; i++) {
        v[i] = s.slice(i, i + 2);
    }
    return v;
}

function stringSimilarity(str1, str2) {
    if (str1.length > 0 && str2.length > 0) {
        let pairs1 = getBiGrams(str1);
        let pairs2 = getBiGrams(str2);
        let union = pairs1.length + pairs2.length;
        let hitCount = 0;
        pairs1.forEach((x) => {
            pairs2.forEach((y) => {
                if (x == y) hitCount++;
            })
        });
        if (hitCount > 0) return ((hitCount * 2) / union);
    }
    return 0;
}

function fuzzySearch(query) {
    let maxResults = 5;
    let minRelevance = 0.3;
    let relevances = [];
    let results = [];
    terms.forEach((s) => {
        let r = {string: s, relevance: stringSimilarity(query, s)};
        relevances.push(r);
    });
    relevances.sort((a, b) => {
        return b.relevance - a.relevance;
    });
    let i = 0;
    while (maxResults) {
        let r = relevances[i];
        if(r.relevance > 0 && r.relevance > minRelevance) results.push(r.string);
        i++;
        maxResults--;
    }
    return results;
}

var dropdownNavIndex;
function addFuzzySearchResults(query) {
    searchDropdown.innerHTML = '';
    let results = fuzzySearch(query);
    if (results.length > 0) {
        abcContainer.hidden = true;
        searchDropdown.hidden = false;
        let ul = document.createElement('ul');
        ul.setAttribute('id', 'searchDropdownResults')
        results.forEach((r) => {
            let li = document.createElement('li');
            li.innerText = r;
            ul.appendChild(li);
            li.onclick = () => {
                searchInput.value = r;
                toggleLiClass(ul.childNodes, li, 'searchDropdownHover');
            }
        })
        searchDropdown.appendChild(ul);
        dropdownNavIndex = -1;
    }
    else abcContainer.hidden = false;
}

searchInput.onkeyup = (e) => {
    e.preventDefault();
    if(e.keyCode == 40) { navigateOnDropdown(1) }
    if(e.keyCode == 38) { navigateOnDropdown(-1) }
    if(e.keyCode == 27) { searchInput.value = '' }
}

function navigateOnDropdown(diff) {
    dropdownNavIndex += diff;
    let ul = document.querySelector('#searchDropdownResults');
    let results, resultsLength;
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
    ul.forEach((li) => {
        if (li.nodeName == 'LI') {
            li.removeAttribute('class', className);
        }
    });
    activeLi.setAttribute('class', className);
}

function createAbcButtons() {
    let buttons = [
        { label: 'А'},
        { label: 'Б'},
        { label: 'В'},
        { label: 'Г'},
        { label: 'Д'},
        { label: 'Е-Ё'},
        { label: 'Ж'},
        { label: 'З'},
        { label: 'И-Й'},
        { label: 'К'},
        { label: 'Л'},
        { label: 'М'},
        { label: 'Н'},
        { label: 'О'},
        { label: 'П'},
        { label: 'Р'},
        { label: 'С'},
        { label: 'Т'},
        { label: 'У-Я'},
    ];
    let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    let abcButtonsUl = document.createElement('ul');
    buttons.forEach((button) => {
        button.words = [];
        let letters = [];
        if(button.label.indexOf('-') > 0) {
            let l = button.label.split('-');
            let firstIndex = alphabet.indexOf(l[0].toLocaleLowerCase());
            let lastIndex = alphabet.indexOf(l[1].toLocaleLowerCase());
            let range = alphabet.slice(firstIndex, lastIndex + 1);
            letters = range.split('');
        }
        else letters.push(button.label);
        terms.forEach((term) => {
            term = term.toLowerCase();
            let termTail = term.slice(1);
            let termFirstLetter = term[0];
            letters.forEach((letter) => {
                if (termFirstLetter == letter.toLowerCase()) {
                    button.words.push(termFirstLetter.toUpperCase() + termTail);
                }
            })
        });
        let li = document.createElement('li');
        let btn = document.createElement('button');
        if(button.words.length) {
            btn.setAttribute('class', 'btn btn-simple');
        }
        else {
            btn.setAttribute('class', 'empty btn btn-simple');
        }
        btn.onclick = () => changeAbcWords(button);
        btn.innerText = button.label;
        li.appendChild(btn);
        button.element = li;
        abcButtonsUl.appendChild(li);
    });
    abcButtons.appendChild(abcButtonsUl);
}

function changeAbcWords(button) {
    abcWordsContainer.innerHTML = '';
    let wordsUl = document.createElement('ul');
    if (button.words.length) {
        let lettersUl = document.querySelector('#abc-letters');
        toggleLiClass(lettersUl.childNodes[0].childNodes, button.element, 'active');
        button.words.forEach((word) => {
            let li = document.createElement('li');
            let btn = document.createElement('a');
            btn.setAttribute('class', 'btn btn-simple');
            btn.innerText = word;
            btn.onclick = () => {
                searchInput.value = word;
                searchInput.focus();
                searchInDictionary(word);
            };
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

var socket = io({transports: ['websocket']});

socket.on('error', (e) => {
    console.log(e);
})

socket.on('queryFromUrl', (data) => {
    console.log('query from url', data.term);
    searchInput.value = data.term;
    createResultsView(data.term, data.data);
})