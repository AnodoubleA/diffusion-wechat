import SeriesInfoHandlerFactory from "../SeriesInfoHandlerFactory";
import Utils from "../../../utils/utils";
import DC3_14TextInfoHandlerFactory from "./DC3_14TextInfoHandlerFactory";

let map = new Map();

map.set(1, require("./DC3_14TextInfoHandler_V1").default);

export default class DC3_14FileInfoHandlerFactory extends SeriesInfoHandlerFactory {
	static HEADER = [52, 49, 46, 51, 67, 68];	// DC3.14

	constructor(next) {
		super(next);
	}

	write(buf, offset, info) {
		let header = DC3_14FileInfoHandlerFactory.HEADER;
		let length = header.length;
		let version = info.version || 1;
		let Class = map.get(version);
		let handler = new Class();
		buf.set(DC3_14TextInfoHandlerFactory.HEADER, offset);
		handler.write(buf, offset + length, info);
	}

	read(buf, offset, info) {
		let header = DC3_14FileInfoHandlerFactory.HEADER;
		let length = header.length;
		if (!Utils.compare(buf, offset, header, 0, length)) {
			if (this.next) {
				return this.next.read(buf, offset, info);
			}
			throw new Error("unknown header");
		}
		let version = buf[offset + length];
		let Class = map.get(version);
		let handler = new Class();
		handler.read(buf, offset + length, info);
	}
}