import {TextCipher} from "../TextCipher";
import RandomBlockPadding from "../paddings/RandomBlockPadding";

export default class AbstractTextCipher extends TextCipher {
	padding = new RandomBlockPadding();
	key = null;
	algorithm = null;
	algorithmInfo = null;
	cipherInfo = null;

	algorithmCode = 0;
	levelCode = 0;

	init(cipherInfo, algorithmInfo) {
		this.cipherInfo = cipherInfo;
		this.algorithmInfo = algorithmInfo;
		this.algorithmCode = cipherInfo.algorithm;
		this.levelCode = cipherInfo.level;
	}
}