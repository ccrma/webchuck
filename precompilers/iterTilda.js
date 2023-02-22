let parsed = ""
let flag = true
async function main(){
  parsed = ""
  let pyodide = await loadPyodide();
  pyodide.globals.set("data", chuckEditor.getValue());
  pyodide.runPython(`
import js
import random

ids = []
global lastItem
lastItem = 0
global functions
functions = ""
global partialText
partialText = ""
global final
final = data

comments = ["//iter~","// iter~", "// iter ~", "//iter ~", "/* iter ~", "/* iter ~" , "/*iter ~", "/* iter~", "/*iter~","//iter(","// iter(", "// iter (", "//iter (", "/* iter (", "/* iter (" , "/*iter (", "/* iter(", "/*iter("]
global searchFor
searchFor = ["iter ~","iter~"]

def prevScan(toScan):
    return toScan.find("iter~")

def scanMul(text):
    for word in searchFor:
        if text.find(word) > 0:
            return text.find(word)
    return -1

def scanMulWord(text):
    for word in searchFor:
        if text.find(word) > 0:
            return len(word)
    return -1

def removeComments():
    global final
    for c in comments:
        while final.find(c) > 0:
            x = final.find(c)
            text = final[x:]
            y = text.find(";")
            partial = final[:x]
            partial += final[x+y+1:]
            final = partial  
    return final


def scanRegionInit(toScan): 
    try:
        #x = toScan.find("iter~")
        x = scanMul(toScan)
        text = toScan[:x]
        text += """
        /*iterator scan region start*/
        """
        text += toScan[x:]
        return text
    except: 
        return data

def scanRegionClose(toScan):
    x = toScan.rindex("iter")
    partialText = toScan[x:]
    y = partialText.find(";")
    finalText = toScan[:x+y+1]
    wrapingCheck = partialText[y+1:].split()
    if wrapingCheck[0] == "}":
        finalText += "}"
        wrapingCheck.pop(0)
    finalText += "/*iterator scan region close*/"
    for token in wrapingCheck:
        finalText += token
    #finalText += toScan[x+y+1:]
    return finalText

def finalScan(toScan):
    x = toScan.find("/*iterator scan region close*/")
    text = toScan[:x]
    text += "/*iterator scan region close*/ /*functions defs*/"
    text += functions
    text += "/*functions defs*/"
    text += toScan[x+30:]
    return text

def scan(toScan):
    #x = toScan.find("iter~")
    x = scanMul(toScan)
    finalChuck = toScan[:x]
    wordL = scanMulWord(toScan)+1
    parseParam = toScan[x+wordL:]
    y = parseParam.find(";")
    parseParamFinal = parseParam[:y-1]
    finalScan = parseParamFinal.split(",")
    temp = "__"
    temp += str(random.randint(10000000, 99999999))
    ids.append(temp)
    try:
        global functions
        functions += """
fun void {id}(){specialO}
    while(true){specialO}
        for (int i; i < {val2}.size(); i++){specialO}
        \tspork~{val1}({val2}[i]);
    {specialC}
    {val3} => now;
{specialC}
{specialC}
        """.format(val1 = finalScan[0], val2 = finalScan[1], val3 = finalScan[2], specialO = '{', specialC = '}', id = temp)
        finalChuck += """spork~{id}();""".format(id = temp)
    except:
        print("OG ChucK code")
    finalChuck += toScan[x+7+y:]
    #if prevScan(finalChuck) > 0:
    if scanMul(finalChuck) > 0:
        global lastItem
        #lastItem = prevScan(finalChuck)
        lastItem = scanMul(finalChuck)
        scan(finalChuck)
    else:
        global partialText
        partialText = finalChuck


cleanTxt = removeComments()

#if cleanTxt.find("iter~") > 0:
if scanMul(cleanTxt) > 0:
    scan(scanRegionClose(scanRegionInit(cleanTxt)))
    parsed = finalScan(partialText)
    js.parsed = parsed
    print(parsed)
  `)
parsed = pyodide.globals.get("parsed")
return parsed
}