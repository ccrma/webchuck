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
export async function loadWasm() {
    return await new Promise((resolve, reject) => {
        asyncLoadFile("https://chuck.stanford.edu/webchuck/src/webchuck.wasm", resolve, reject);
    });
}
export async function loadWasmURL(url) {
    return await new Promise((resolve, reject) => {
        asyncLoadFile(url, resolve, reject);
    });
}
export const defer = () => new DeferredPromise();
