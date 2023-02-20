# Script to convert Chuck examples directory to JSON of paths
import os
import json

# TODO: Mini Audicle examples path here
chuckExamplesPath= "YOUR_PATH_TO_CHUCK_EXAMPLES!!!"
outputJSONFile = "../examples/moreExamples.json"

# Exclude directories
excludeDirs = ["book"]

# IMPORTANT: Words to exclude from examples, features not yet supported in WebChucK
excludeFileWords = ["OscIn", "OscOut", "Hid", "HidMsg", "MidiIn", "MidiOut", "MidiMsg", "MidiFileIn", "ConsoleInput"]
excludeFileWords += ["SndBuf", "SndBuf2"] # excluding these because we aren't retrieving data files
# add a space to the end of each word to match Object classes
excludeFileWords = [word + " " for word in excludeFileWords]
excludeFileWords += ["SerialIO", "Serial"]

# Examples Dictionary
examplesDict = {}
fileCount = 0
dirCount = 0

def filterChuckExample(fileText):
    # Filter out examples that have certain disabled features
    for word in excludeFileWords:
        if word in fileText:
            return False

    return True
    
if __name__ == "__main__":

    # Get all files in directory
    for (root, dirs, file) in os.walk(chuckExamplesPath):
        # Root, pop off the folder name
        parentDir = root.split("/")[-1]
        # exclude directories 
        dirs[:] = [d for d in dirs if d not in excludeDirs]

        # Process files in directory
        for f in file:
            if (f.endswith(".ck")):
                # read the file
                with open(os.path.join(root, f), "r") as exampleFile:
                    chuckExample = exampleFile.read()

                    if (filterChuckExample(chuckExample)):
                        if (parentDir in examplesDict):
                            examplesDict[parentDir].append(f)
                        else:
                            examplesDict[parentDir] = [f]

                        fileCount += 1

    # add ai folder
    #examplesDict["ai"] = ["features", "genre-classify", "hmm", "knn", "pca", "svm", "word2vec"]
    #dirCount += 7

    # folder with no chuck files, only subfolders
    examplesDict["ai"] = []

    # Get all subdirectories
    for (root, dirs, file) in os.walk(chuckExamplesPath):
        # Root, pop off the folder name
        parentDir = root.split("/")[-1]
        # exclude directories 
        dirs[:] = [d for d in dirs if d not in excludeDirs]

        # add directories
        for d in dirs:
            if (d in examplesDict):
                examplesDict[parentDir].append(d)
                dirCount += 1



    print("Chuck examples converted:", fileCount)
    print("Chuck subfolders added:", dirCount)

    # dict to json
    examplesJSON = json.dumps(examplesDict, indent = 4)

    # Write to file
    with open(outputJSONFile, "w") as outfile:
        outfile.write(examplesJSON)
        print("JSON file written to:", outputJSONFile)
