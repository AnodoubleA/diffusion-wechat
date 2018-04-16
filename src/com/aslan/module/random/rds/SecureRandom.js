import Random from "../Random";
import RandomEngine from "../RandomEngine";
import SeedFactory from "../SeedFactory";
import DARandomEngine from "../engines/DARandomEngine";

export default class SecureRandom extends Random {
	engine = null;
	factory = null;
	seeds = null;

	constructor(factory, engine) {
		super();
        
		if (!(factory instanceof SeedFactory)) {
			throw new Error("Seed factory is null");
		}
		factory.init();
		this.factory = factory;

		if (!(engine instanceof RandomEngine)) {
			engine = new DARandomEngine();
		}
		this.engine = engine;
		this.seeds = new Uint8Array(engine.needSeed);
	}

	seed(seed, offset, length) {
		this.engine.seed(seed, offset, length);
	}

	next(accept, offset, length) {
		this.factory.pull(this.seeds, 0, this.seeds.length);
		this.engine.seed(this.seeds, 0, this.seeds.length);
		this.engine.next(accept, offset, length);
	}

	rand() {
		return this.engine.rand();
	}
}