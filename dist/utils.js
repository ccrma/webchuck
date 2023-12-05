import DeferredPromise from "./DeferredPromise";
function readAsync(url, onload, onerror) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
        if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
            onload(xhr.response);
        }
        else {
            onerror();
        }
    };
    xhr.onerror = onerror;
    xhr.send(null);
}
export function asyncLoadFile(url, onload, onerror) {
    readAsync(url, (arrayBuffer) => {
        // TODO: do we need Uint8Array here?
        onload(new Uint8Array(arrayBuffer));
    }, () => {
        if (onerror) {
            onerror();
        }
        else {
            throw new Error(`Loading data file ${url} failed.`);
        }
    });
}
export async function preloadFiles(filenamesToPreload) {
    const promises = filenamesToPreload.map((filenameToPreload) => new Promise((resolve, _reject) => {
        asyncLoadFile(filenameToPreload.serverFilename, (byteArray) => {
            resolve({
                filename: filenameToPreload.virtualFilename,
                data: byteArray,
            });
        }, () => {
            console.error(`Error fetching file: ${filenameToPreload.serverFilename}`);
        });
    }));
    return await Promise.all(promises);
}
export async function loadWasm(whereIsChuck) {
    return await new Promise((resolve, reject) => {
        asyncLoadFile(whereIsChuck + "webchuck.wasm", resolve, reject);
    });
}
const textFileExtensions = ["ck", "txt", "csv", "json", "xml", "html", "js"];
export function isPlaintextFile(filename) {
    const ext = filename.split(".").pop();
    return textFileExtensions.includes(ext);
}
export const defer = () => new DeferredPromise();
