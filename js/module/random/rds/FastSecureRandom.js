import SecureRandom from "./SecureRandom";

export default class FastSecureRandom extends SecureRandom {
    static UPDATE_INTERVAL = 1024;
    count = 0;

    constructor(factory, engine) {
        super(factory, engine);
        this.update();
    }

    seed(seed, offset, length) {
        this.engine.seed(seed, offset, length);
    }

    next(accept, offset, length) {
        if (this.count++ > FastSecureRandom.UPDATE_INTERVAL) {
            this.count = 0;
            this.update();
        }
        this.engine.next(accept, offset, length);
    }

    rand() {
        return this.engine.rand();
    }

    update() {
        this.factory.pull(this.seeds, 0, this.seeds.length);
        this.engine.seed(this.seeds, 0, this.seeds.length);
    }
}