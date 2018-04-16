import Command from "../module/command/Command";
import TextEncipher from "../module/cipher/cips/TextEncipher";
import Utils from "../module/utils/utils";
import { ENC_BOX } from "../module/cipher/algorithms/box";

let cipher = new TextEncipher();

export default class TextEncipherCommand extends Command {

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
        let algorithmInfo = Utils.computeAlgorithmInfo(this.cipherInfo.group, 1);
        algorithmInfo.BOX = ENC_BOX;
        this.cipherInfo.log = algorithmInfo.L;
        cipher.init(this.cipherInfo, algorithmInfo);
        let output = cipher.run(this.input);
        this.success.call(this, output);
    }
}