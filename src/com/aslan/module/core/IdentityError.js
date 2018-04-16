export default class IdentityError extends Error {
	identity = null;

	constructor(id) {
		super();
		this.identity = id;
	}

	get id() {
		return this.identity;
	}
}