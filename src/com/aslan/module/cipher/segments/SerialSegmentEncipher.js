import AbstractSegment from "./AbstractSetment"

export default class SerialSegmentEncipher extends AbstractSegment {

	run1(IN, offset, length) {
		let algorithm = this.algorithm;
		let key = this.key;
		let L = this.info.L;
		let N = this.info.N;
		let round = (length >> L) >> 3;
		let remainder = (length >> L) & 7;
		for (let i = 0; i < round; i++) {
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
		}
		for (let i = 0; i < remainder; i++) {
			algorithm.enc(new Uint8Array(IN, offset, N), key.update());
			offset += N;
		}
		return length;
	}

	run2(IN, inf, OUT, ouf, length) {
		let algorithm = this.algorithm;
		let padding = this.padding;
		let key = this.key;
		let N = this.info.N, fill = this.fill;
		let H = N - fill, F = N;
		let round = Math.floor(length / H) >> 2;
		let remainder = Math.floor(length / H) & 3;
		let buf;
		for (let i = 0; i < round; i++) {
			buf = new Uint8Array(OUT, ouf, N);
			buf.set(new Uint8Array(IN, inf, H));
			padding.padding(buf, H, fill);
			algorithm.enc(buf, key.update());
			inf += H;
			ouf += F;

			buf = new Uint8Array(OUT, ouf, N);
			buf.set(new Uint8Array(IN, inf, H));
			padding.padding(buf, H, fill);
			algorithm.enc(buf, key.update());
			inf += H;
			ouf += F;

			buf = new Uint8Array(OUT, ouf, N);
			buf.set(new Uint8Array(IN, inf, H));
			padding.padding(buf, H, fill);
			algorithm.enc(buf, key.update());
			inf += H;
			ouf += F;

			buf = new Uint8Array(OUT, ouf, N);
			buf.set(new Uint8Array(IN, inf, H));
			padding.padding(buf, H, fill);
			algorithm.enc(buf, key.update());
			inf += H;
			ouf += F;
		}
		for (let i = 0; i < remainder; i++) {
			buf = new Uint8Array(OUT, ouf, N);
			buf.set(new Uint8Array(IN, inf, H));
			padding.padding(buf, H, fill);
			algorithm.enc(buf, key.update());
			inf += H;
			ouf += F;
		}
		let lost = length % H;
		if (lost > 0) {
			buf = new Uint8Array(OUT, ouf, N);
			buf.set(new Uint8Array(IN, inf, lost));
			padding.padding(buf, lost, F - lost);
			algorithm.enc(buf, key.update());
		}
		return Math.ceil(1.0 * length / H) * F;
	}
}