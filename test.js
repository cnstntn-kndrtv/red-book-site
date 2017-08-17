var ldf = require('ldf-client');
var N3 = require('N3');
var fs = require('fs');
let fileName = './public/js/terms-list.js';

ldf.Logger.setLevel('error');

var fragmentsClient = new ldf.FragmentsClient('http://localhost:3001/redbook');

let term;
term = 'разлад';
// term = 'прозорливый';
// term = 'мыла';
// term = 'бить баклуши';
// term = 'бить';


let q = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX lexinfo: <http://www.lexinfo.net/ontology/2.0/lexinfo#>
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
 
SELECT ?id ?meaning ?usage ?partOfSpeech ?canonicalForm
WHERE {
    ?id a ontolex:LexicalEntry ;
        ontolex:writtenRep "${term}"@ru ;
    OPTIONAL {
        ?id ontolex:canonicalForm ?canonicalForm .
    }
    OPTIONAL {
        ?id ontolex:partOfSpeech ?partOfSpeech .
    }
    OPTIONAL {
        ?id ontolex:sense ?senseId .
        ?senseId ontolex:reference ?referenceId .
        ?referenceId rdf:value ?meaning .
    }
    OPTIONAL {
        ?id ontolex:sense ?senseId .
        ?senseId ontolex:usage ?usageId .
        ?usageId rdf:value ?usage .
    }
    
}`;

let r = new ldf.SparqlIterator(q, { fragmentsClient: fragmentsClient });
let n = 0;
let results = {};

function getLiteral(l) {
    return (l) ? N3.Util.getLiteralValue(l) : null;
}

function getPosTag(tag) {
    return tag.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '');
}

r.on('data', (res) => {
    let id = res['?id'];
    let meaning = getLiteral(res['?meaning']);
    let usage = getLiteral(res['?usage']);
    let partOfSpeech = getPosTag(res['?partOfSpeech']);
    let canonicalForm = res['?canonicalForm'];
    if(!results.hasOwnProperty(id)){
        results[id] = {
            meanings: {},
            partOfSpeech: null,
            canonicalForm: null,
        }
    }
    if(!results[id].meanings.hasOwnProperty(meaning)){
        results[id].meanings[meaning] = [];
    }
    if(usage){
        results[id].meanings[meaning].push(usage);
    }
    if(!results[id].partOfSpeech) results[id].partOfSpeech = partOfSpeech;
    if(!results[id].canonicalForm) results[id].canonicalForm = canonicalForm;
});

r.on('end', () => {
    console.log('-----------------')
    console.log(JSON.stringify(results));
});