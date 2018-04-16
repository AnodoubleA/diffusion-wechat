import RandomEngine from "../RandomEngine";
import {S1, S2} from "../box";

export default class DARandomEngine extends RandomEngine {
	static DEFAULT_BUF_SIZE = 128;
	N = 0;
	H = 0;
	R = 0;
	D = null;	//Seed array
	B = null;	//Buffer array
	seedIndex = 0;
	index = 0;

	constructor() {
		super();
		this.init(DARandomEngine.DEFAULT_BUF_SIZE);
	}

	init(size) {
		this.N = size;
		this.B = new Uint8Array(size);
		this.D = new Uint8Array(size);
		this.H = this.N >> 1;
		this.R = Math.log2(size);
	}

	seed(seed, offset, length) {
		let min = 0, remainder = Math.min(length, this.N), n = this.N - 1;
		while (remainder > 0) {
			min = Math.min(remainder, this.N - this.seedIndex);
			this.D.set(new Uint8Array(seed.buffer, offset, min), this.seedIndex);
			offset += min;
			remainder -= min;
			this.seedIndex = (this.seedIndex + min) & n;
		}
		this.update();
	}

	next(accept, offset, length) {
		let min = 0, remainder = length;
		while (remainder > 0) {
			min = Math.min(remainder, this.N);
			accept.set(new Uint8Array(this.B.buffer, 0, min), offset);
			offset += min;
			remainder -= min;
			this.update();
		}
		return length;
	}

	rand() {
		let value = this.B[this.index++];
		if (this.index >= this.N) {
			this.index = 0;
			this.update();
		}
		return value;
	}

	get needSeed() {
		return this.N;
	}


	update() {
		let R = this.R, H = this.H, N = this.N;
		let B = this.B, D = this.D;
		let x = 0, r = R - 1, h = H - 1;
		for (let i = 0; i < r; i++) {
			for (let y = H; y < N;) {
				B[y] = S1[(B[y] ^ D[y])] ^ B[x];
				B[x] = S2[(B[x] ^ D[x])] ^ B[y];
				x = (++x) & h, y++;
				B[y] = S1[(B[y] ^ D[y])] ^ B[x];
				B[x] = S2[(B[x] ^ D[x])] ^ B[y];
				x = (++x) & h, y++;
				B[y] = S1[(B[y] ^ D[y])] ^ B[x];
				B[x] = S2[(B[x] ^ D[x])] ^ B[y];
				x = (++x) & h, y++;
				B[y] = S1[(B[y] ^ D[y])] ^ B[x];
				B[x] = S2[(B[x] ^ D[x])] ^ B[y];
				x = (++x) & h, y++;
			}
			x = H >> i;
		}
	}
}