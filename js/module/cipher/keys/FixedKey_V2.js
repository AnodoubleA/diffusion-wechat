import MixKey from "./MixKey";
import {Levels} from "./levels";

export default class FixedKey extends MixKey {

	init(cipherInfo, algorithmInfo) {
		super.init(cipherInfo, algorithmInfo);
		this.init_key(cipherInfo.key);
		this.update_key();
		this.update_key();
		this.update_key();
	}

	get level() {
		return Levels.LEVEL_1;
	}

	get version() {
		return 2;
	}
}