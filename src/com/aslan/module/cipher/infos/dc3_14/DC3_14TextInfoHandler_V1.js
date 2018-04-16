import InfoHandler from "../../InfoHandler";
import {CIPHER_OPTION} from "../../consts";

export default class DC3_14TextInfoHandler extends InfoHandler {

	read(buf, offset, info) {
		//@formatter:off
		info.options &= ~CIPHER_OPTION.PADDING;          //subtracting padding
		info.log        = buf[offset++];
		info.diff       = buf[offset++] << 8;
		info.diff      |= buf[offset++];
		info.algorithmV = buf[offset++];  // version
		info.algorithm  = buf[offset++];
		info.levelV     = buf[offset++];  // version
		info.level      = buf[offset++];
		info.cycle      = buf[offset++];
		let  pad        = buf[offset++] & 0x1;
		info.options   |= pad ? CIPHER_OPTION.PADDING : 0;
		info.group      = 1 << info.log;
		//@formatter:on
        return this.length;
	}

	write(buf, offset, info) {
		buf[offset++] = this.version;
		buf[offset++] = info.log;
		buf[offset++] = info.diff >> 8 & 0xFF;
		buf[offset++] = info.diff >> 0 & 0xFF;
		buf[offset++] = info.algorithmV ;
		buf[offset++] = info.algorithm;
		buf[offset++] = info.levelV;
		buf[offset++] = info.level;
		buf[offset++] = info.cycle;
		buf[offset] = info.options & CIPHER_OPTION.PADDING;
		return this.length;
	}

	get length() {
		return 26;
	}

	get version() {
		return 1;
	}
}