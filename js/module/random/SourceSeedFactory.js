import SeedFactory from "./SeedFactory";

export default class SourceSeedFactory extends SeedFactory {
	static UPDATE_TIME = 5 * 60 * 1000;
	static BUFFER_SIZE = 1024 * 1024;
	sources = new Array();
	seeds = null;
	N = 0;
	index = 0;
	cap = 0;

	constructor() {
		super();
	}

	init() {
	}

	register(source) {
		this.sources.push(source);
		this.sources.sort(function (a, b) {
			return a.reliability - b.reliability;
		})
	}

	pull(accept, offset, length) {
		let size = this.sources.length, remainder = length;
		if (size === 0) throw new Error("Seed not provide");
		while (remainder > 0) {
			for (let i = 0; i < size; i++) {
				let source = this.sources[i];
				let got = source.pull(accept, offset, remainder);
				remainder -= got;
				offset += got;
				if (remainder <= 0) break;
			}
		}
	}
}