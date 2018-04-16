import InfoHandlerFactory from "../InfoHandlerFactory";

export default class SeriesInfoHandlerFactory extends InfoHandlerFactory {
	next = null;

	constructor(next) {
		super();
		this.next = next;
	}


	get length() {
		return 32;
	}
}