import levels from "./keys/levels";

var map = new Map();

for (let i = 0; i < levels.length; i++) {
    let a = levels[i];
    let Class = require(a.class);
    map.set(a.id, new Class.default(a));
}

export default class KeyBuilder {

    static make(option) {
        let level = option.level;
        if (!level) {
            option.level = level = levels[0].id;
        }
        let factory = map.get(level);
        if (factory == null) {
            throw new Error("不支持的密匙级别：" + level);
        }
        return factory.make(option);
    }
}