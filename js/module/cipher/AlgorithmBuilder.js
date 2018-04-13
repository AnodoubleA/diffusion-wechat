import algorithms from "./algorithms/algorithms.js"


var map = new Map();

for (let i = 0; i < algorithms.length; i++) {
	let a = algorithms[i];
	let Class = require(a.class);
	map.set(a.id, new Class.default(a));
}

export default class AlgorithmBuilder {
	static make(option) {
		let algorithm = option.algorithm;
		if (!algorithm) {
			option.algorithm = algorithm = algorithms[0].id;
		}
		let factory = map.get(algorithm);
		if (factory == null) {
			throw new Error("不支持的加密算法：" + algorithm);
		}
		return factory.make(option);
	}
}
