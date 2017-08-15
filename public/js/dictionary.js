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

function searchInDictionary(term) {
    searchDropdown.hidden = true;
    let fakeResults = [
            {
                meaning: `значение слова ${term} #1`,
                examples: [
                    `example 1 ${term}`,
                    `example 2 ${term}`,
                ]
            },
            {
                meaning: `значение слова ${term} это слово обозначает что-то что-то...`,
                examples: [
                    `example 1 ${term}`,
                    `example 2 ${term}`,
                    `example 3 ${term}`,
                ]
            },
            {
                meaning: `значение слова ${term} #1`,
                examples: [
                    `example 1 ${term}`,
                    `example 2 ${term}`,
                ]
            },
            {
                meaning: `значение слова ${term} это слово обозначает что-то что-то...`,
                examples: [
                    `example 1 ${term}`,
                    `example 2 ${term}`,
                    `example 3 ${term}`,
                ]
            },
        ]
    let results = document.createElement('div');
    let word = document.createElement('div');
    fakeResults.forEach((r) => {
        word.innerText = term;
        let div = document.createElement('div');
        let hr = document.createElement('hr');
        // morphology
        let morph = document.createElement('p')
        morph.setAttribute('class', 'morphology');
        morph.innerHTML = '<b>Морфологические свойства: </b>';
        let morphProperties = document.createTextNode('noun animate etc');
        morph.appendChild(morphProperties);
        // meaning
        let meaningHeader = document.createElement('div');
        meaningHeader.setAttribute('class', 'header');
        meaningHeader.innerText = 'Значение:';
        let meaning = document.createElement('p');
        meaning.setAttribute('class', 'meaning');
        meaning.innerText = r.meaning;
        // examples
        let examplesHeader = document.createElement('div');
        examplesHeader.setAttribute('class', 'header');
        examplesHeader.innerText = 'Примеры употребления:';
        let examplesUl = document.createElement('ul');
        r.examples.forEach((example) => {
            let li = document.createElement('li');
            let p = document.createElement('p');
            p.setAttribute('class', 'example');
            p.innerText = example;
            li.appendChild(p);
            examplesUl.appendChild(li);
        });
        div.appendChild(hr);
        div.appendChild(morph);
        div.appendChild(meaningHeader);
        div.appendChild(meaning);
        div.appendChild(examplesHeader);
        div.appendChild(examplesUl);

        results.appendChild(div);
    })
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
        abc.hidden = true;
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
    else abc.hidden = false;
}

searchInput.onkeyup = (e) => {
    e.preventDefault();
    if(e.keyCode == 40) { navigateOnDropdown(1) }
    if(e.keyCode == 38) { navigateOnDropdown(-1) }
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
        if (li.nodeName == 'LI') li.removeAttribute('class', className);
    });
    activeLi.setAttribute('class', className);
}

var abc = document.querySelector('#abc');
var abcWordsContainer = document.querySelector('#abc-words');
abcWordsContainer.hidden = true;

function changeAbcWords(that) {
    let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    let buttonText = that.innerText.toLowerCase();
    let lettersUl = document.querySelector('#abc-letters');
    toggleLiClass(lettersUl.childNodes, that.parentNode, 'active');
    let letters = [];
    if(buttonText.indexOf('-') > 0) {
        let l = buttonText.split('-');
        let firstIndex = alphabet.indexOf(l[0]);
        let lastIndex = alphabet.indexOf(l[1]);
        let range = alphabet.slice(firstIndex, lastIndex + 1);
        letters = range.split('');
    }
    else letters.push(buttonText);
    abcWordsContainer.innerHTML = '';
    let wordsUl = document.createElement('ul');
    terms.forEach((term) => {
        term = term.toLowerCase();
        let termTail = term.slice(1);
        let termFirstLetter = term[0];
        letters.forEach((letter) => {
            if (termFirstLetter == letter) {
                let li = document.createElement('li');
                let btn = document.createElement('a');
                btn.setAttribute('class', 'btn btn-simple');
                btn.innerText = termFirstLetter.toUpperCase() + termTail;
                btn.onclick = () => {
                    searchInput.value = term;
                    searchInput.focus();
                };
                li.appendChild(btn);
                wordsUl.appendChild(li);
            }
        })
    });
    if (wordsUl.childElementCount > 0) {
        abcWordsContainer.appendChild(wordsUl);
        abcWordsContainer.hidden = false;
    } else {
        abcWordsContainer.hidden = true;
    }
}