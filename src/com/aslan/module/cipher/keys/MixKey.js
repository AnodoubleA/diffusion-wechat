import AbstractKey from "./AbstractKey";
import {S1} from "./box";
import {S2} from "./box";

export default class MixKey extends AbstractKey {

	N = 0;
	R = 0;
	H = 0;
	K = null;

	// for mix
	_N = 0;
	_R = 0;
	_H = 0;
	_P = 0;

	init(cipherInfo, algorithmInfo) {
		super.init(cipherInfo, algorithmInfo);
		this.N = algorithmInfo.N;
		this.R = algorithmInfo.R;
		this.H = this.N >> 1;
		if (this._N !== this.R) {
			this.alloc(algorithmInfo);
		}
	}

	update() {
		return this.K;
	}

	alloc(algorithmInfo) {
		this._N = algorithmInfo.R;
		this._R = Math.ceil(Math.log2(algorithmInfo.R));
		this._P = 1 << this._R;
		this._H = this._N >> 1;
		this._R++;
		let T = new Array(this.R);
		for (let i = 0; i < this._N; i++) {
			T[i] = new Uint8Array(this.N);
		}
		this.K = T;
	}

	init_key(key) {
		let length = key.length;
		let index = 0, x = 0;
		for (let i = 0; i < this.R; i++) {
			for (let j = 0; j < this.N; j++) {
				let v = (x < length ? key[x] : index++ & 0xFF);
				this.K[i][j] = x & 1 ? S1[v] : S2[v];
				x++;
			}
		}
	}

	update_key() {
		let _P = this._P, _H = this._H, _N = this._N, _R = this._R;
		let x = 0, X = _P >> 1;
		for (let i = 1; i <= _R; i++) {
			for (let y = _H; y < _N; y++) {
				this.mix(this.K[x], this.K[y]);
				x = ++x === _H ? 0 : x;
			}
			x = X >> i;
		}
		return this.K;
	}

	mix(U, V) {
		let X = this.N, R = this.R, N = this.N;
		let x = 0, n = N - 1;
		for (let i = 1; i <= R; i++) {
			for (let y = 0; y < N;) {
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
				U[y] = S1[U[y] ^ V[y]] ^ S2[V[x]];
				V[x] = S2[V[x] ^ U[x]] ^ S1[U[y]];
				x = ++x & n, y++;
			}
			x = X >> i;
		}
	}
}