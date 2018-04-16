var table = new Int8Array([
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    -1, -1, -1, -1, -1, -1, -1,
    10, 11, 12, 13, 14, 15,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    10, 11, 12, 13, 14, 15]);

function h2b(hex) {
    hex = hex.replace(/\s+/g, '');
    var length = hex.length;
    if (length & 1) throw new Error("长度不正确，字符必须成对！");
    var buf = new Uint8Array(length >>> 1);
    for (var i = 0, j = 0; i < length; i += 2, j++) {
        var h = table[hex.charCodeAt(i)];
        var l = table[hex.charCodeAt(i + 1)];
        if (h < 0 || isNaN(h)) {
            throw new Error("无效字符：'{}'".format(hex.charAt(i)));
        }
        if (l < 0 || isNaN(l)) {
            throw new Error("无效字符：'{}'".format(hex.charAt(i + 1)));
        }
        buf[j] = h << 4 | l;
    }
    return buf;
}

function b2h(hex) {
    var buf = [];
    var length = hex.length;
    for (var i = 0; i < length; i++) {
        var h = hex[i] >> 4 & 0xF, l = hex[i] & 0xF;
        buf.push(h.toString(16) + l.toString(16));
    }
    return buf.join(' ');
}

export default {
    h2b: h2b,
    b2h: b2h
}