import MixKey from "./MixKey";

export default class FixedKey extends MixKey {

	init(cipherInfo, algorithmInfo) {
		super.init(cipherInfo, algorithmInfo);
		this.init_key(cipherInfo.key);
		this.update_key();
		this.update_key();
		this.update_key();
	}

	get version() {
		return 1;
	}
}