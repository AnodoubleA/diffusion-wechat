import Algorithm from "../Algorithm.java";

class AbstractAlgorithm extends Algorithm {

	N = null;
	R = null;
	H = null;
	BOX = null;

	init(option) {
		this.BOX = option.BOX;
		this.N = option.N;
		this.R = option.R;
		this.H = this.N >> 1;
	}
}

export default AbstractAlgorithm;
