import SeriesInfoHandlerFactory from "../SeriesInfoHandlerFactory";
import Utils from "../../../utils/utils";

let map = new Map();

map.set(1, require("./DC3_14TextInfoHandler_V1").default);

export default class DC3_14TextInfoHandlerFactory extends SeriesInfoHandlerFactory {
    static HEADER = [68, 67, 51, 46, 49, 52];	// DC3.14

    constructor(next) {
        super(next);
    }

    write(buf, offset, info) {
        let header = DC3_14TextInfoHandlerFactory.HEADER;
        let length = header.length;
        let version = info.version || 1;
        let Class = map.get(version);
        let handler = new Class();
        buf.set(DC3_14TextInfoHandlerFactory.HEADER, offset);
        handler.write(buf, offset + length, info);
    }

    read(buf, offset, info) {
        let header = DC3_14TextInfoHandlerFactory.HEADER;
        let length = header.length;
        if (!Utils.compare(buf, offset, header, 0, length)) {
            if (this.next) {
                return this.next.read(buf, offset, info);
            }
            throw new Error("不支持的信息头，或许不是本系列软件加密的，亦或者本软件版本较低！");
        }
        let version = buf[offset + length];
        let Class = map.get(version);
        if (Class == null) throw new Error("在DC3.14系列，不支持该信息头版本号{}，或许是本软件版本较低！".format(version));
        let handler = new Class();
        return handler.read(buf, offset + length + 1, info) + length;
    }
}