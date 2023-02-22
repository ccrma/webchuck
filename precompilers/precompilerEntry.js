var precompilersTilda = document.getElementById("iterTildaButton")
var precompilersChuck = document.getElementById("chuckAsUsual")
var valueTIlda = "Prototype: iter~"
var valueChuck = "Chuck - as usual"
let precompilerMode = 0


function SetPrecompilerMode(val){

    

    precompilerMode = val;
    if(val === 0){
        theChuck.runCode('<<< "Chuck" >>>;')
        precompilersChuck.innerText = valueChuck + " ✔️"
        precompilersTilda.innerText = valueTIlda
    }
    if(val === 1){
        theChuck.runCode('<<< "Prototype: iter~ \nPlease note that this is an experimental feature and is currently not supported in the base language. (feel free to modify!)" >>>;')
        precompilersTilda.innerText = valueTIlda + " ✔️"
        precompilersChuck.innerText = valueChuck
    }
}

