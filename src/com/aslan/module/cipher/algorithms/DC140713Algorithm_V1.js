import AbstractAlgorithm from "./AbstractAlgorithm";
import {ALGORITHMS} from "../consts";

export default class DC140713Algorithm extends AbstractAlgorithm {

	enc(M, K) {
		let BOX = this.BOX;
		let R = this.R;
		let N = this.N;
		let x = 0, v = R, h = this.H - 1, X = this.H;
		for (let i = 1; i <= R; i++) {
			let U = K[i - 1];
			let V = K[--v];
			for (let y = this.H; y < N;) {
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
				M[y] = BOX[M[y] ^ U[y]] ^ M[x];
				M[x] = BOX[M[x] ^ V[x]] ^ M[y];
				x = (++x) & h, y++;
			}
			x = X >> i;
		}
	}

	dec(C, K) {
		let BOX = this.BOX;
		let R = this.R;
		let N = this.N;
		let x = 0, v = R - 1, h = this.H - 1;
		for (let i = 0; i < R; i++ , v--) {
			let V = K[i];
			let U = K[v];
			for (let y = this.H; y < N;) {
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ C[y]] ^ V[x];
				C[y] = BOX[C[x] ^ C[y]] ^ U[y];
				x = (++x) & h, y++;
			}
			x = (1 << i) & h;
		}
	}

	get identity() {
		return ALGORITHMS.DC140713;
	}

	get version() {
		return 1;
	}

}