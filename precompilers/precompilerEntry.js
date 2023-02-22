const precompilersTilda = document.getElementById("iterTildaButton")
const precompilersChuck = document.getElementById("chuckAsUsual")
// Prototype Mode Strings
const valueTilda = "iter~"
const valueChuck = "Chuck (standard)"

const checkMark = ` <i class="icon icon-check"></i>`

let precompilerMode = 0

function SetPrecompilerMode(val)
{
    precompilerMode = val;

    if (val === 0)
    {
        chuckPrint("ChucK: standard language mode");
        precompilersChuck.innerHTML = valueChuck + checkMark;
        precompilersTilda.innerHTML = valueTilda;
    }
    if (val === 1)
    {
        chuckPrint("Enabling prototype: [iter ~]...")
        chuckPrint("Please note this is an experimental feature and is currently not supported in the base language. (Feel free to modify.) Have fun!");
        precompilersTilda.innerHTML = valueTilda + checkMark;
        precompilersChuck.innerHTML = valueChuck;
    }
}
