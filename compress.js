const zlib = require("zlib");

function compressObject(obj) {
    const payload = Buffer.from(JSON.stringify(obj));
    console.log('Compressed length - ',payload.length);
    try {
        return zlib.deflateSync(payload);
    } catch (e) {
        throw new Error(e);
    }
}

function decompressBuffer(compressedBuffer) {
    const payload = compressedBuffer;
    try {
        return zlib.inflateSync(payload);
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = {
    compressObject,
    decompressBuffer
}