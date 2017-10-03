let {Query} = require('../Query');
let fs = require('fs')
let vm = require('vm');

function includeTerms() {
    let path = '../public/js/terms-list.js';
    let code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}

includeTerms()

let query = new Query();
let queries = [];
let results = {};
let counter = 0;
let terms2 = [];
for (var index = 0; index < 10; index++) {
    terms2.push(terms[index])
    
}
terms.forEach((t) => {
    let query = new Query();
    query.get(t);
    counter ++;
    console.log(counter);
    
    query.on('data', (data) => {
        results[t] = data;
        counter --;
        console.log(counter);
        if (!counter) {
            save();
        }
    });
})

let fileName = './appDB.js'
function save() {
    fs.exists(fileName, (exist) => {
        if (exist) {
            fs.unlinkSync(fileName);
        }
        let content = 'var db = ' + JSON.stringify(results);
        fs.appendFile(fileName, content, (error) => {
            if(error) console.log(error);
            else console.log('done');
        });
    });
}