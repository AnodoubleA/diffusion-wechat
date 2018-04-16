import AbstractSegment from "./AbstractSetment"

export default class SerialSegmentDecipher extends AbstractSegment {

	run1(IN, inf, length) {
		let algorithm = this.algorithm;
		let key = this.key;
		let L = this.info.L;
		let N = this.info.N;
		let round = length >> L >> 3;
		let remainder = length >> L & 7;
		for (let i = 0; i < round; i++) {
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
		}
		for (let i = 0; i < remainder; i++) {
			algorithm.enc(new Uint8Array(IN, inf, N), key.update());
			inf += N;
		}
		return length;
	}

	run2(IN, inf, OUT, ouf, length) {
		let algorithm = this.algorithm;
		let key = this.key;
		let N = this.info.N, L = this.info.L;
		let H = N - this.fill, F = N;
		let round = length >> L >> 2;
		let remainder = length >> L & 3;
		let buf;
		for (let i = 0; i < round; i++) {
			buf = new Uint8Array(IN, inf, N);
			algorithm.dec(buf, key.update());
			new Uint8Array(OUT, ouf, N).set(buf);
			inf += F;
			ouf += H;

			buf = new Uint8Array(IN, inf, N);
			algorithm.dec(buf, key.update());
			new Uint8Array(OUT, ouf, N).set(buf);
			inf += F;
			ouf += H;

			buf = new Uint8Array(IN, inf, N);
			algorithm.dec(buf, key.update());
			new Uint8Array(OUT, ouf, N).set(buf);
			inf += F;
			ouf += H;

			buf = new Uint8Array(IN, inf, N);
			algorithm.dec(buf, key.update());
			new Uint8Array(OUT, ouf, N).set(buf);
			inf += F;
			ouf += H;

		}
		for (let i = 0; i < remainder; i++) {
			buf = new Uint8Array(IN, inf, N);
			algorithm.dec(buf, key.update());
			new Uint8Array(OUT, ouf, N).set(buf);
			inf += F;
			ouf += H;
		}
		return Math.ceil(1.0 * length / F) * H;
	}
}