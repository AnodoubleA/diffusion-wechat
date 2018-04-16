import AbstractAlgorithm from "./AbstractAlgorithm";
import {ALGORITHMS} from "../consts";

export default class DC314Algorithm extends AbstractAlgorithm {

	enc(M, K) {
		let R = this.R;
		let N = this.N;
		let BOX = this.BOX;
		let x = 0, h = this.H - 1, X = this.H;
		for (let i = 1; i <= R; i++) {
			let U = K[i - 1];
			let V = K[R - i];
			for (let y = this.H; y < N;) {
				M[y] = BOX[M[x] ^ M[y] ^ U[x]] ^ U[y];
				M[x] = BOX[M[x] ^ M[y] ^ V[y]] ^ V[x];
				x = (++x) & h, y++;
			}
			x = X >> i;
		}
	}

	dec(C, K) {
		let R = this.R;
		let N = this.N;
		let BOX = this.BOX;
		let x = 0, v = R - 1, h = this.H - 1;
		for (let i = 0; i < R; i++, v--) {
			let V = K[i];
			let U = K[v];
			for (let y = this.H; y < N;) {
				C[x] = BOX[C[x] ^ V[y]] ^ C[y] ^ V[x];
				C[y] = BOX[C[y] ^ U[y]] ^ C[x] ^ U[y];
			}
			x = (1 << i) & h;
		}
	}

	get identity() {
		return ALGORITHMS.DC314;
	}

	get version() {
		return 1;
	}

}