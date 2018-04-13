import MixKey from "./MixKey";
import {S1} from "./box";
import {S2} from "./box";

export default class StreamKey extends MixKey {
	indices = null;

	init(cipherInfo, algorithmInfo) {
		super.init(cipherInfo, algorithmInfo);
		this.init_key(cipherInfo.key);
		this.update_key();
		this.update_key();
	}

	update() {
		let indices = this.indices;
		let R = this.R, H = this.H, N = this.N;
		let x = 0, v = R - 1, h = H - 1;
		for (let i = 0; i < R; i++, v--) {
			x = indices[i] & h;
			let U = this.K[i];
			let V = this.K[v];
			for (let y = H; y < N;) {
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
				U[y] = (S1[(U[y] ^ V[y])] ^ U[x]);
				U[x] = (S2[(U[x] ^ V[x])] ^ U[y]);
				x = (++x) & h, y++;
			}
			indices[i] = (indices[i] << 1);
			indices[i] = (indices[i]) > H ? 1 : indices[i];
		}
		return this.K;
	}

	alloc(algorithmInfo) {
		super.alloc(algorithmInfo);
		this.indices = new Uint32Array(algorithmInfo.R);
	}

	init_key(key) {
		super.init_key(key);
		this.init_indices(this.R, this.N);
	}

	init_indices(round, N) {
		this.indices[0] = N;
		for (let i = 1; i <= this.R; i++) {
			this.indices[i] = 1 << i - 1;
		}
	}

	get version() {
		return 1;
	}

}