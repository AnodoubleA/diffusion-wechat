import SeedSource from "../module/random/SeedSource";

export default class RandomPointSeedSource extends SeedSource {
    static DEFAULT_BUFFER_SIZE = 1024 * 1024;
    buffer = null;
    N = 0;
    n = 0;
    index = 0;
    half = 0;
    cap = 0;

    constructor() {
        super();
        this.init(RandomPointSeedSource.DEFAULT_BUFFER_SIZE);
    }

    init(size) {
        this.N = size;
        this.n = size - 1;
        this.half = size >> 1;
        this.buffer = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            this.buffer[i] = Math.floor(Math.random() * 0xFF) & 0xFF;
        }
        this.cap = size;
    }

    handleEvent(event) {
        let time = Date.now();
        let a = time >> 16 & 0xFF;
        let b = time >> 8 & 0xFF;
        let c = time >> 0 & 0xFF;
        let d = a * b * c;
        let x = (event.offsetX << 8 | event.clientX) ^ d;
        let y = (event.offsetY << 8 | event.clientY) ^ ~d;
        this.set(x);
        this.set(y);
    }


    set(v) {
        this.buffer[this.index++] = this.buffer[this.half--] ^ v & 0xFF;
        this.index &= this.n;
        this.half &= this.n;
    }

    pull(accept, offset, length) {
        let min = 0, remainder = length;
        while (remainder > 0) {
            min = Math.min(remainder, this.cap);
            accept.set(new Uint8Array(this.buffer.buffer, 0, min), offset);
            offset += min;
            remainder -= min;
        }
        return length;
    }

    get reliability() {
        return 0.9;
    }

    get capacity() {
        return this.N;
    }
}