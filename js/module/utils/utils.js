
import GBK from "../encoding/gbk.js"

export default class Utils {
    static compare(src, srcIndex, dest, destIndex, length) {
        let end = srcIndex + length;
        for (let i = srcIndex; i < end; i++) {
            if (src[i] !== dest[destIndex + i]) {
                return false;
            }
        }
        return true;
    }

    static computeAlgorithmInfo(N, e, option) {
        let lg = Math.log2(N);
        option = option || {};
        option.N = N;
        option.L = lg;
        option.R = lg + (e || 0);
        return option;
    }

    static s2b(text, encoding) {
        return GBK.encode(text);
    }

    static b2s(buf, offset, length, encoding) {
        if (isNaN(offset)) {
            encoding = offset;
            offset = 0;
            length = buf.length;
        }
        return GBK.decode(new Uint8Array(buf, offset, length));
    }


    static roundOf(value) {
        
        return 1 << Math.floor(Math.log2(value));
    }
}