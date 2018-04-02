import GBK from './gbk.js'

/**
 * Parse float value to int vlaue.
 * @param number float value
 * @returns {number} int value
 */
function I(number) {
    return Math.floor(number);
}

/**
 * Defined int of '='.
 * @type {number}
 */
const EQUAL = 61;
const IN_EQUAL = 254;

/**
 * The class to be encode to base64
 */
export class Encoder {
    newline;	// byte[]
    linemax;	// int
    isURL;		//boolean
    doPadding;	//boolean

    constructor(isURL, newline, linemax, doPadding) {
        this.isURL = isURL;
        this.newline = newline;
        this.linemax = linemax;
        this.doPadding = doPadding;
    }

	/**
	 * This array is a lookup table that translates 6-bit positive integer
	 * index values into their "Base64 Alphabet" equivalents as specified
	 * in "Table 1: The Base64 Alphabet" of RFC 2045 (and RFC 4648).
	 */
    static toBase64 = new Uint8Array([
        0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d,
        0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
        0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d,
        0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
        0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f]);

	/**
	 * It's the lookup table for "URL and Filename safe Base64" as specified
	 * in Table 2 of the RFC 4648, with the '+' and '/' changed to '-' and
	 * '_'. This table is used when BASE64_URL is specified.
	 */
    static toBase64URL = new Uint8Array([
        0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d,
        0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
        0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d,
        0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
        0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2d, 0x5f,]);

    static MIMELINEMAX = 76;
    static CRLF = [13, 10];

    static RFC4648 = new Encoder(false, null, -1, true);
    static RFC4648_URLSAFE = new Encoder(true, null, -1, true);
    static RFC2045 = new Encoder(false, Encoder.CRLF, Encoder.MIMELINEMAX, true);

    outLength(length) {
        let len = 0;
        if (this.doPadding) {
            len = 4 * I((length + 2) / 3);
        } else {
            let n = length % 3;
            len = 4 * I(length / 3) + (n === 0 ? 0 : n + 1);
        }
        if (this.linemax > 0)                                  // line separators
            len += I((len - 1) / this.linemax) * this.newline.length;
        return len;
    }

	/**
	 * Encodes all bytes from the specified byte array into a newly-allocated
	 * byte array using the {@link Base64} encoding scheme. The returned byte
	 * array is of the length of the resulting bytes.
	 *
	 * @param   src {Uint8Array}
	 *          the byte array to encode
	 * @param   offset {Number}
	 *          the byte array offset
	 * @param   length {Number}
	 *          the byte array length
	 * @return  {Uint8Array} A newly-allocated byte array containing the resulting
	 *          encoded bytes.
	 */
    encode1(src, offset, length) {
        offset = offset || 0;
        length = length || (src.length - offset);
        let dst = new Uint8Array(this.outLength(length));
        let ret = this.encode(src, offset, offset + length, dst, 0);
        if (ret < dst.length) {
            let buf = new Uint8Array(ret);
            buf.set(new Uint8Array(dst.buffer, 0, ret));
            return buf;
        }
        return dst;
    }

	/**
	 * Encodes all bytes from the specified byte array using the
	 * {@link Base64} encoding scheme, writing the resulting bytes to the
	 * given output byte array, starting at offset 0.
	 *
	 * <p> It is the responsibility of the invoker of this method to make
	 * sure the output byte array {@code dst} has enough space for encoding
	 * all bytes from the input byte array. No bytes will be written to the
	 * output byte array if the output byte array is not big enough.
	 *
	 * @param   src {Uint8Array}
	 *          the byte array to encode
	 * @param   dst {Uint8Array}
	 *          the output byte array
	 * @return  {Number} The number of bytes written to the output byte array
	 *
	 * @throws  IllegalArgumentException if {@code dst} does not have enough
	 *          space for encoding all input bytes.
	 */
    encode2(src, dst) {
        let len = this.outLength(src.length);         // dst array size
        if (dst.length < len)
            throw new Error(
                "Output byte array is too small for encoding all input bytes");
        return this.encode(src, 0, src.length, dst, 0);
    }


	/**
	 * Encode a text.
	 *
	 * @param text {String}
	 *            The text who be encode.
	 * @param encoding {String}
	 *            The text encoding.
	 * @returns {Uint8Array}
	 */
    encode3(text, encoding) {
        let encoder = new TextEncoder(encoding || "UTF-8");
        let codes = encoder.encode(text);
        return this.encode1(codes, 0, codes.length);
    }


	/**
	 *    Do encoding.
	 *
	 * @param src {Uint8Array}
	 *            The src who be encoding.
	 * @param start {Number}
	 *                The src start index
	 * @param end {Number}
	 *                The src end index
	 * @param dst {Uint8Array}
	 *                The output array buffer
	 * @param index {Number}
	 *            The output array start index
	 * @returns {Number} The number of bytes written to the output byte array
	 */
    encode(src, start, end, dst, index) {
        let linemax = this.linemax, newline = this.newline;
        let base64 = this.isURL ? Encoder.toBase64URL : Encoder.toBase64;
        let sp = start;
        let slen = I((end - start) / 3) * 3;
        let sl = start + slen;
        if (linemax > 0 && slen > I(linemax / 4) * 3)
            slen = I(linemax / 4) * 3;
        let dp = 0;
        while (sp < sl) {
            let sl0 = Math.min(sp + slen, sl);
            for (let sp0 = sp, dp0 = index; sp0 < sl0;) {
                let bits = (src[sp0++] & 0xff) << 16 |
                    (src[sp0++] & 0xff) << 8 |
                    (src[sp0++] & 0xff);
                dst[dp0++] = base64[(bits >>> 18) & 0x3f];
                dst[dp0++] = base64[(bits >>> 12) & 0x3f];
                dst[dp0++] = base64[(bits >>> 6) & 0x3f];
                dst[dp0++] = base64[bits & 0x3f];
            }
            let dlen = (sl0 - sp) / 3 * 4;
            dp += dlen;
            sp = sl0;
            if (dlen === linemax && sp < end) {
                for (let b in newline) {
                    dst[dp++] = b;
                }
            }
        }
        if (sp < end) {               // 1 or 2 leftover bytes
            let b0 = src[sp++] & 0xff;
            dst[dp++] = base64[b0 >> 2];
            if (sp === end) {
                dst[dp++] = base64[(b0 << 4) & 0x3f];
                if (this.doPadding) {
                    dst[dp++] = EQUAL;
                    dst[dp++] = EQUAL;
                }
            } else {
                let b1 = src[sp++] & 0xff;
                dst[dp++] = base64[(b0 << 4) & 0x3f | (b1 >> 4)];
                dst[dp++] = base64[(b1 << 2) & 0x3f];
                if (this.doPadding) {
                    dst[dp++] = EQUAL;
                }
            }
        }
        return dp;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Decode array.
 * @type {Uint8Array}
 */
const fromBase64 = new Uint8Array(256);

for (let i = 0; i < Encoder.toBase64.length; i++) {
    fromBase64[Encoder.toBase64[i]] = i;
}
fromBase64[EQUAL] = IN_EQUAL;	//=

/**
 * Decode array for url.
 * @type {Uint8Array}
 */
const fromBase64URL = new Uint8Array(256);

for (let i = 0; i < Encoder.toBase64URL.length; i++) {
    fromBase64URL[Encoder.toBase64URL[i]] = i;
}
fromBase64URL[EQUAL] = IN_EQUAL;	//=

/**
 * The class for decode base64.
 */
export class Decoder {
    isURL;
    isMIME;

    static RFC4648 = new Decoder(false, false);
    static RFC4648_URLSAFE = new Decoder(true, false);
    static RFC2045 = new Decoder(false, true);

    constructor(isURL, isMIME) {
        this.isURL = isURL;
        this.isMIME = isMIME;
    }


	/**
	 * Compute output length.
	 *
	 * @param src {Uint8Array}
	 * @param offset {Number}
	 * @param length {Number}
	 * @returns {number}
	 */
    outLength(src, offset, length) {
        let base64 = this.isURL ? fromBase64URL : fromBase64;
        let sp = offset, sl = length - offset;
        let paddings = 0;
        let len = sl - sp;
        if (len === 0) return 0;
        if (len < 2) {
            if (this.isMIME && base64[0] === -1) return 0;
            throw new Error("Input byte[] should at least have 2 bytes for base64 bytes");
        }
        if (this.isMIME) {
            // scan all bytes to fill out all non-alphabet. a performance
            // trade-off of pre-scan or Arrays.copyOf
            let n = 0;
            while (sp < sl) {
                let b = src[sp++] & 0xff;
                if (b === EQUAL) {
                    len -= (sl - sp + 1);
                    break;
                }
                if ((b = base64[b]) === -1)
                    n++;
            }
            len -= n;
        } else {
            if (src[sl - 1] === EQUAL) {
                paddings++;
                if (src[sl - 2] === EQUAL)
                    paddings++;
            }
        }
        if (paddings === 0 && (len & 0x3) !== 0)
            paddings = 4 - (len & 0x3);
        return 3 * I((len + 3) / 4) - paddings;
    }


	/**
	 * Decodes all bytes from the input byte array using the {@link Base64}
	 * encoding scheme, writing the results into a newly-allocated output
	 * byte array. The returned byte array is of the length of the resulting
	 * bytes.
	 *
	 * @param   src {Uint8Array}
	 *          the byte array to decode
	 *
	 * @param   offset {Number}
	 *          the src start index
	 *
	 * @param   length {Number}
	 *          the byte array length to decode
	 *
	 * @return  {Uint8Array}
	 *            A newly-allocated byte array containing the decoded bytes.
	 *
	 * @throws  IllegalArgumentException
	 *          if {@code src} is not in valid Base64 scheme
	 */
    decode1(src, offset, length) {
        offset = offset || 0;
        length = length || (src.length - offset);
        let dst = new Uint8Array(this.outLength(src, offset, length));
        let ret = this.decode(src, offset, offset + length, dst, 0);
        if (ret < dst.length) {
            let buf = new Uint8Array(ret);
            buf.set(new Uint8Array(dst.buffer, 0, ret), 0);
            return buf;
        }
        return dst;
    }


	/**
	 * Decodes all bytes from the input byte array using the {@link Base64}
	 * encoding scheme, writing the results into the given output byte array,
	 * starting at offset 0.
	 *
	 * <p> It is the responsibility of the invoker of this method to make
	 * sure the output byte array {@code dst} has enough space for decoding
	 * all bytes from the input byte array. No bytes will be be written to
	 * the output byte array if the output byte array is not big enough.
	 *
	 * <p> If the input byte array is not in valid Base64 encoding scheme
	 * then some bytes may have been written to the output byte array before
	 * IllegalargumentException is thrown.
	 *
	 * @param   src {Uint8Array}
	 *          the byte array to decode
	 *
	 * @param   dst {Uint8Array}
	 *          the output byte array
	 *
	 * @return  {Number} The number of bytes written to the output byte array
	 *
	 * @throws  IllegalArgumentException
	 *          if {@code src} is not in valid Base64 scheme, or {@code dst}
	 *          does not have enough space for decoding all input bytes.
	 */
    decode2(src, dst) {
        let len = this.outLength(src, 0, src.length);
        if (dst.length < len)
            throw new Error(
                "Output byte array is too small for decoding all input bytes");
        return this.decode(src, 0, src.length, dst, 0);
    }

	/**
	 * Decodes a Base64 encoded String into a newly-allocated byte array
	 * using the {@link Base64} encoding scheme.
	 *
	 * <p> An invocation of this method has exactly the same effect as invoking
	 * {@code decode(src.getBytes(StandardCharsets.ISO_8859_1))}
	 *
	 * @param   text
	 *          the string to decode
	 *
	 * @return  {Uint8Array} A newly-allocated byte array containing the decoded bytes.
	 *
	 * @throws  IllegalArgumentException
	 *          if {@code src} is not in valid Base64 scheme
	 */
    decode3(text) {
        if (!Decoder.is(text)) throw new Error("无效的base64字符串！");
        let codes = GBK.encode(text);
        return this.decode1(codes);
    }


	/**
	 * Do decoding.
	 *
	 * @param src {Uint8Array}
	 *            The src who be encoding.
	 * @param start {Number}
	 *                The src start index
	 * @param end {Number}
	 *                The src end index
	 * @param dst {Uint8Array}
	 *                The output array buffer
	 * @param index {Number}
	 *            The output array start index
	 * @returns {Number} The number of bytes written to the output byte array
	 */
    decode(src, start, end, dst, index) {
        let isMIME = this.isMIME;
        let base64 = this.isURL ? fromBase64URL : fromBase64;
        let sp = start, sl = end, dp = index;
        let bits = 0;
        let shiftto = 18;       // pos of first byte of 4-byte atom
        while (sp < sl) {
            let b = src[sp++] & 0xff;
            if ((b = base64[b]) > 127) {	//TODO watch this.
                if (b === IN_EQUAL) {    // padding byte EQUAL
                    // =     shiftto==18 unnecessary padding
                    // x=    shiftto==12 a dangling single x
                    // x     to be handled together with non-padding case
                    // xx=   shiftto==6&&sp==sl missing last =
                    // xx=y  shiftto==6 last is not =
                    if (shiftto === 6 && (sp === sl || src[sp++] !== EQUAL) ||
                        shiftto === 18) {
                        throw new Error(
                            "Input byte array has wrong 4-byte ending unit");
                    }
                    break;
                }
                if (isMIME) continue;    // skip if for rfc2045
                else throw new Error("Illegal base64 character: " + src[sp - 1].toString(16));
            }
            bits |= (b << shiftto);
            shiftto -= 6;
            if (shiftto < 0) {
                dst[dp++] = (bits >> 16);
                dst[dp++] = (bits >> 8);
                dst[dp++] = (bits);
                shiftto = 18;
                bits = 0;
            }
        }
        // reached end of byte array or hit padding EQUAL characters.
        if (shiftto === 6) {
            dst[dp++] = (bits >> 16);
        } else if (shiftto === 0) {
            dst[dp++] = (bits >> 16);
            dst[dp++] = (bits >> 8);
        } else if (shiftto === 12) {
            // dangling single "x", incorrectly encoded.
            throw new Error("Last unit does not have enough valid bits");
        }
        // anything left is invalid, if is not MIME.
        // if MIME, ignore all non-base64 character
        while (sp < sl) {
            if (isMIME && base64[src[sp++]] < 0)
                continue;
            throw new Error("Input byte array has incorrect ending byte at " + sp);
        }
        return dp;
    }

    static is(base64) {

        return /^(\w*\d*[+=/]*)*$/.test(base64);        
    }
}

export default class Base64 {
    static get Encoder() {
        return Encoder.RFC4648;
    }

    static get UrlEncoder() {
        return Encoder.RFC4648_URLSAFE;
    }

    static get MimeEncoder() {
        return Encoder.RFC2045;
    }

    static get Decoder() {
        return Decoder.RFC4648;
    }

    static get UrlDecoder() {
        return Decoder.RFC4648_URLSAFE;
    }

    static get MimeDecoder() {
        return Decoder.RFC2045;
    }
}
