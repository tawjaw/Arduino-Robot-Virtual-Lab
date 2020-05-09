"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function zeroPad(value, length) {
    let sval = value.toString();
    while (sval.length < length) {
        sval = '0' + sval;
    }
    return sval;
}
function formatTime(seconds) {
    const ms = Math.floor(seconds * 1000) % 1000;
    const secs = Math.floor(seconds % 60);
    const mins = Math.floor(seconds / 60);
    return `${zeroPad(mins, 2)}:${zeroPad(secs, 2)}.${zeroPad(ms, 3)}`;
}
exports.formatTime = formatTime;
function getMilliSecconds(seconds) {
    const ms = Math.floor(seconds * 10000) % 10000;
    return ms / 10;
}
exports.getMilliSecconds = getMilliSecconds;
function getMicroSeconds(seconds) {
    return Math.floor(seconds * 1000000) % 1000000;
}
exports.getMicroSeconds = getMicroSeconds;
