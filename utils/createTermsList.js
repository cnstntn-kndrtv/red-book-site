var ldf = require('ldf-client');
var N3 = require('N3');
var fs = require('fs');

ldf.Logger.setLevel('error');

var fragmentsClient = new ldf.FragmentsClient('http://ldf.kloud.one/redbook');

let q = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX lexinfo: <http://www.lexinfo.net/ontology/2.0/lexinfo#>
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
 
SELECT ?wr
WHERE {
    ?id a ontolex:LexicalEntry ;
        ontolex:writtenRep ?wr .
}`;

let r = new ldf.SparqlIterator(q, { fragmentsClient: fragmentsClient });
let n = 0;
let results = new Set;

function getLiteral(l) {
    return (l) ? N3.Util.getLiteralValue(l) : null;
}

r.on('data', (data) => {
    results.add( getLiteral( data['?wr'] ) );
    console.log('.');
});


let fileName = '../public/js/terms-list.js';
r.on('end', () => {
    fs.exists(fileName, (exist) => {
        if (exist) {
            fs.unlinkSync(fileName);
        }
        results = Array.from(results);
        let content = 'var terms = ' + JSON.stringify(results);
        fs.appendFile(fileName, content, (error) => {
            if(error) console.log(error);
            else console.log('done');
        });
    });
});