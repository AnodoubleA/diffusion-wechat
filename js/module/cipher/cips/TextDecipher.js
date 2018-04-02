import AbstractTextCipher from "./AbstractTextCipher";
import AlgorithmBuilder from "../AlgorithmBuilder";
import KeyBuilder from "../KeyBuilder";
import InfoHandlerBuilder from "../InfoHandlerBuilder";
import IdentityError from "../../core/IdentityError";
import Utils from "../../utils/utils";
import SerialSegmentDecipher from "../segments/SerialSegmentDecipher";

export default class TextDecipher extends AbstractTextCipher {

    worker = new SerialSegmentDecipher();


    init(cipherInfo, algorithmInfo) {
        this.cipherInfo = cipherInfo;
        this.algorithmInfo = algorithmInfo;
    }

    reinit(cipherInfo, algorithmInfo) {
        if (!this.algorithm || this.algorithmCode !== cipherInfo.algorithm) {
            this.algorithm = AlgorithmBuilder.make(cipherInfo);
        }
        this.algorithm.init(algorithmInfo);

        if (!this.key || this.levelCode !== cipherInfo.level) {
            this.key = KeyBuilder.make(cipherInfo);
        }
        this.key.init(cipherInfo, algorithmInfo);

        super.init(cipherInfo, algorithmInfo);
        this.worker.init({ algorithm: this.algorithm, padding: this.padding, key: this.key, info: algorithmInfo });
    }

    run(buf, offset, length) {
        offset = offset || 0;
        length = length || (buf.length - offset);

        let infoLen = InfoHandlerBuilder.read(buf, 0, this.cipherInfo);
        let N = this.cipherInfo.group;
        if (N & (N - 1)) {
            throw new Error("无效分组长度，必须是2的N次方（N为正整数）：" + N);
        }
        if (this.cipherInfo.diff > N) {
            throw new Error("信息填充有误，或许是数据已被破坏，填充量：" + this.cipherInfo.diff);
        }

        let fill = this.padding.compute(N);
        Utils.computeAlgorithmInfo(N, 1, this.algorithmInfo);
        let len = Math.ceil((length - infoLen) / N) * N;
        this.reinit(this.cipherInfo, this.algorithmInfo);
        let out = new Uint8Array(len);

        this.worker.run2(buf.buffer, offset + infoLen, out.buffer, 0, length - infoLen);
        let size = len - Math.ceil((length - infoLen) / N) * fill - this.cipherInfo.diff;
        return { data: out.buffer, size: size };
    }
}