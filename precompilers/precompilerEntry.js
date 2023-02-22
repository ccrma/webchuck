var precompilersTilda = document.getElementById("iterTildaButton")
var precompilersChuck = document.getElementById("chuckAsUsual")
var valueTIlda = "Prototype: iter~"
var valueChuck = "Chuck - as usual"
let precompilerMode = 0


function SetPrecompilerMode(val) {

    precompilerMode = val;

    if(val === 0){
        theChuck.runCode('<<< "Chuck: standard language mode", "" >>>;')
        precompilersChuck.innerText = valueChuck + " ✔️"
        precompilersTilda.innerText = valueTIlda
    }
    if(val === 1){
        theChuck.runCode('<<< "enabling prototype mode: [iter ~]...\nPlease note this is an experimental feature and is currently not supported in the base language. (Feel free to modify.) Have fun!", "" >>>;')
        precompilersTilda.innerText = valueTIlda + " ✔️"
        precompilersChuck.innerText = valueChuck
    }
}
