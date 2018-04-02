import Lookup from "../../../config/lookup";
import Random from "../../random/Random";
import Padding from "../Padding";
import FastSecureRandom from "../../random/rds/FastSecureRandom";

export default class RandomBlockPadding extends Padding {
    random = null;

    constructor(random) {
        super();
        if (!(random instanceof Random)) {
            random = new FastSecureRandom(Lookup.seedSourceFactory);
        }
        this.random = random;
    }

    compute(N) {
        return Math.log2(N);
    }

    padding(v, offset, count) {
        this.random.next(v, offset, count);
    }
}