var ldf = require('ldf-client');
var N3 = require('n3');

class MyEventEmitter {
    on(type, cb) {
        this['_on' + type] = this['_on' + type] || [];
        this['_on' + type].push(cb);
    }
    emit(type, args) {
        this['_on' + type] && this['_on' + type].forEach((cb) => cb(args));
    }
}

class Query extends MyEventEmitter {
    constructor() {
        super();
        ldf.Logger.setLevel('info');
    }

    get(term) {
        term = term.toLowerCase();
        let fragmentsClient = new ldf.FragmentsClient('http://ldf.kloud.one/redbook');
        let q = 
        `
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
                
            }
        `;
        let r;
        try {
            r = new ldf.SparqlIterator(q, { fragmentsClient: fragmentsClient });
        }
        catch (error) {
            this.emit('error', error);
        }
        if (r) {
            let results = {};
            
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
                if(!results[id].meanings.hasOwnProperty(meaning) && meaning != null){
                    results[id].meanings[meaning] = [];
                }
                if(usage){
                    results[id].meanings[meaning].push(usage);
                }
                if(!results[id].partOfSpeech) results[id].partOfSpeech = partOfSpeech;
                if(!results[id].canonicalForm) results[id].canonicalForm = canonicalForm;
            });
    
            r.on('end', () => {
                this.emit('data', results);
            });
        }

    }
}

function getLiteral(l) {
    return (l) ? N3.Util.getLiteralValue(l) : null;
}

function getPosTag(tag) {
    let posTag = null;
    if(tag) posTag = tag.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '');
    return posTag;
}


module.exports.Query = Query;
