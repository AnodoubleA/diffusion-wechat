import AbstractTextCipher from "./AbstractTextCipher";
import AlgorithmBuilder from "../AlgorithmBuilder";
import KeyBuilder from "../KeyBuilder";
import SerialSegmentEncipher from "../segments/SerialSegmentEncipher";
import InfoHandlerBuilder from "../InfoHandlerBuilder";

export default class TextEncipher extends AbstractTextCipher {

	worker = new SerialSegmentEncipher();

	init(cipherInfo, algorithmInfo) {
		if (!this.algorithm || this.algorithmCode !== cipherInfo.algorithm) {
			this.algorithm = AlgorithmBuilder.make(cipherInfo);
		}
		this.algorithm.init(algorithmInfo);

		if (!this.key || this.levelCode !== cipherInfo.level) {
			this.key = KeyBuilder.make(cipherInfo);
		}
		this.key.init(cipherInfo, algorithmInfo);

		super.init(cipherInfo, algorithmInfo);
		this.worker.init({algorithm: this.algorithm, padding: this.padding, key: this.key, info: algorithmInfo});
	}

	run(buf, offset, length) {
		offset = offset || 0;
		length = length || (buf.length - offset);

		let handler = InfoHandlerBuilder.getHandler(this.cipherInfo);
		let infoLen = handler.length;

		let N = this.algorithmInfo.N;
		let real = N - this.padding.compute(N);
		let remainder = length % real;
		this.cipherInfo.diff = remainder === 0 ? 0 : (real - remainder);
		let size = Math.ceil(1.0 * length / real) * N + infoLen;
		let out = new Uint8Array(size);

		handler.write(out, 0, this.cipherInfo);
		this.worker.run2(buf.buffer, offset, out.buffer, infoLen, length);

		return {data: out.buffer, size: size};
	}
}