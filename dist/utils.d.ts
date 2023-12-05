import DeferredPromise from "./DeferredPromise";
export interface Filename {
    serverFilename: string;
    virtualFilename: string;
}
export interface File {
    filename: string;
    data: ArrayBuffer;
}
export declare function asyncLoadFile(url: string, onload: (buffer: ArrayBuffer) => void, onerror: () => void): void;
export declare function preloadFiles(filenamesToPreload: Filename[]): Promise<File[]>;
export declare function loadWasm(whereIsChuck: string): Promise<ArrayBuffer>;
export declare function isPlaintextFile(filename: string): boolean;
export declare const defer: () => DeferredPromise<any>;
