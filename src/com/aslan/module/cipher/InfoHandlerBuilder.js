import DC3_14TextInfoHandlerFactory from "./infos/dc3_14/DC3_14TextInfoHandlerFactory";
import DC3_14FileInfoHandlerFactory from "./infos/dc3_14/DC3_14FileInfoHandlerFactory";
import {HEADER} from "./infos";
import {CIPHER_OPTION, TYPE_MASK} from "./consts";

let map = new Map();
map.set(HEADER.DC3_14 + CIPHER_OPTION.TEXT, DC3_14TextInfoHandlerFactory);
map.set(HEADER.DC3_14 + CIPHER_OPTION.FILE, DC3_14FileInfoHandlerFactory);

let textLink = new DC3_14TextInfoHandlerFactory();
let fileLink = new DC3_14FileInfoHandlerFactory();

export default class InfoHandlerBuilder {

	static getHandler(info) {
		let Class = map.get(info.series || HEADER.DC3_14 + (info.options & TYPE_MASK));
		return new Class();
	}

	static read(buf, offset, info) {
		if (info.options & CIPHER_OPTION.TEXT) {
			return textLink.read(buf, offset, info);
		}
		return fileLink.read(buf, offset, info);
	}
}