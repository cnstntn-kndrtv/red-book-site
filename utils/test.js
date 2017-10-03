var ldf = require('ldf-client');
var N3 = require('N3');
var fs = require('fs');
let fileName = './public/js/terms-list.js';

ldf.Logger.setLevel('error');

var fragmentsClient = new ldf.FragmentsClient('http://ldf.kloud.one/redbook');
let term = 'чествовать';
term = 'Аховый';

let q = 
`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX lexinfo: <http://www.lexinfo.net/ontology/2.0/lexinfo#>
    PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
    PREFIX dc: <http://purl.org/dc/terms#>

    SELECT ?id ?meaning ?usage ?partOfSpeech ?canonicalForm
    WHERE {
        ?id a ontolex:LexicalEntry ;
            ontolex:writtenRep "${term}"@ru .
        OPTIONAL {
            ?id ontolex:canonicalForm ?canonicalForm .
        }
        OPTIONAL {
            ?id lexinfo:partOfSpeech ?partOfSpeech .
        }
        OPTIONAL {
            ?id dc:sense ?senseId .
            ?senseId ontolex:reference ?referenceId .
            ?referenceId rdf:value ?meaning .
        }
        OPTIONAL {
            ?id dc:sense ?senseId .
            ?senseId ontolex:usage ?usageId .
            ?usageId rdf:value ?usage .
        }
    }
`

let r = new ldf.SparqlIterator(q, { fragmentsClient: fragmentsClient });
let n = 0;
let results = new Set;

function getLiteral(l) {
    return (l) ? N3.Util.getLiteralValue(l) : null;
}

r.on('data', (data) => {
    console.log(data)
    // results.add( getLiteral( data['?wr'] ).toLowerCase() );
});

r.on('end', () => {
    console.log(results);
});