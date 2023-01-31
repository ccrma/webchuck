//----------------------------------------------------------
// File to read moreExamples.json to build paths to examples
//----------------------------------------------------------
let moreExamples;

fetch('moreExamples.json')
    .then(response => response.json())
    .then(data => {
        moreExamples = data;
    });

let path = ["examples"];


// Go use the path to make a query for the examples in moreExamples.json
// and build the links to the examples
function buildExamples() {
    let examples = moreExamples;
    for (let i = 0; i < path.length; i++) {
        examples = examples[path[i]];
    }
    return examples;
}





