import KeyFactory from "../KeyFactory.js";

export default class KeyFactoryProxy extends KeyFactory {
    level;
    constructor(level) {
        super();
        this.level = level;
    }

    make(option) {
        let version = option.levelV || this.level.version[0].id;
        let find = this.level.version.find(e => e.id === version);
        if (find == null) {
            throw new Error("不支持的密匙算法版本({@name})：{}".format(this.levelV, version));
        }
        let Class = require(find.class);
        option.levelV = version;
        return new Class.default();
    }
}