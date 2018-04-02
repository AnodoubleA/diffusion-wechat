import Command from "../module/command/Command";
import TextDecipher from "../module/cipher/cips/TextDecipher";
import { DEC_BOX } from "../module/cipher/algorithms/box";

let cipher = new TextDecipher();

export default class TextDecipherCommand extends Command {

    cipherInfo;
    input;
    success;

	/**
	 *
	 * @param {Object} cipherInfo
	 * @param {Uint8Array} input
	 */
    constructor(cipherInfo, input, success) {
        super();
        this.cipherInfo = cipherInfo;
        this.input = input;
        this.success = success;
    }

    execute() {
        let algorithmInfo = {};
        algorithmInfo.BOX = DEC_BOX;
        this.cipherInfo.log = algorithmInfo.R;
        cipher.init(this.cipherInfo, algorithmInfo);
        let output = cipher.run(this.input);
        this.success.call(this, output);
    }
}