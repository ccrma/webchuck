let parsed = ""
let flag = true
async function main(){
    console.log("in main function");
    parsed = ""
    code = chuckEditor.getValue()
    result = processCode(code)
    console.log(result)
    parsed = result // why?
    return result
}

function processCode(code) {
    code = removeComments(code);
    code = replaceIter(code);
    return code;
}

function replaceIter(code) {
    // store all function definitions here
    functions = ""

    // take "iter~(...)" and expand it out into valid chuck code
    function expandIter(match, func, array, dur, offset, string, groups) {
        text = "\n/* iterator translation start */\n"

        // generate uid for the function that's replacing iter~
        uid = "__" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) 

        // spork the iter~ function
        text += `
spork~ ${uid}();
`
        text += "/* iterator translation end */\n"

        // functions can't be defined outside of the global scope,
        // so save defintions for later so they can be appended to the
        // entire chuck file.
        functions += `
fun void ${uid}() {
    while(true){
        for (int i; i < ${array}.size(); i++){
            spork~ ${func}(${array}[i]);
        }
        ${dur} => now;
    }
}
`
        return text;
    }

    // match iter regex
    // NOTE: this does not work with arbitrary code,
    // because chuck is not a regular language it can have things
    // like arbitrarily-depthed parentheses and extra commas that will
    // screw things up, but hey it's an experimental feature
    const iter_regex = /iter\~\((.*),(.*),(.*)\)\s*;/g

    // replace all instances of iter~(...) with the real chuck equivalent
    code = code.replace(iter_regex, expandIter)
    
    // append all function definitions to the code
    code = code + functions;
    return code;
}


// Taken from https://stackoverflow.com/questions/37051797/remove-comments-from-string-with-javascript-using-javascript
function removeComments(string){
    //Takes a string of code, not an actual function.
    return string.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'').trim();//Strip comments
}
