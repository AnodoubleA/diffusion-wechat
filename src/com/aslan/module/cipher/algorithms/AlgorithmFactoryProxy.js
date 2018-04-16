import AlgorithmFactory from "../AlgorithmFactory.java";

export default class AlgorithmFactoryProxy extends AlgorithmFactory {
    algorithm;
    constructor(algorithm) {
        super();
        this.algorithm = algorithm;
    }

    make(option) {
        let version = option.algorithmV || this.algorithm.version[0].id;
        let find = this.algorithm.version.find(e => e.id === version);
        if (find == null) {
            throw new Error("不支持的加密算法版本({@name})：{1}".format(this.algorithm, version));
        }
        let Class = require(find.class);
        option.algorithmV = version;
        return new Class.default();
    }
}