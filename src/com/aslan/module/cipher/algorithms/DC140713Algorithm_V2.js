import AbstractAlgorithm from "./AbstractAlgorithm";
import {ALGORITHMS} from "../consts";

class DC140713Algorithm extends AbstractAlgorithm {

	enc(M, KK) {
		let R = this.R;
		let N = this.N;
		let BOX = this.BOX;
		let x = 0, h = this.H - 1, hh = this.H >> 1, X = this.H;
		for (let i = 1; i <= R; i++) {
			let K = KK[i - 1];
			for (let y = this.H; y < N;) {
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
				M[y] = BOX[M[x] ^ M[y]] ^ K[y];
				M[x] = BOX[M[x] ^ M[y]] ^ K[x];
				x = (++x) & h, y++;
			}
			x = X >> i || (hh + 1);
		}
	}

	dec(C, KK) {
		let R = this.R;
		let N = this.N;
		let BOX = this.BOX;
		let x = (this.H >> 1) + 1, v = R - 1, h = this.H - 1;
		for (let i = 0; i < R; i++) {
			let K = KK[v--];
			for (let y = this.H; y < N;) {
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
				C[x] = BOX[C[x] ^ K[x]] ^ C[y];
				C[y] = BOX[C[y] ^ K[y]] ^ C[x];
				x = (++x) & h, y++;
			}
			x = (1 << i) & h;
		}
	}

	get identity() {
		return ALGORITHMS.DC140713;
	}

	get version() {
		return 2;
	}

}

export default DC140713Algorithm;
