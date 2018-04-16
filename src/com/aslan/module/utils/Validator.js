import Validate from "./Validate.js"

export default class Validator extends Validate {
    check;
    constructor(check) {
        super(Validate.VALID);
        this.check = check;
    }

    append(validator) {
        this._list.push(validator);
        return this;
    }

    validate(accept) {
        accept = accept || [];
        let ret = this.check();
        this._code = ret.code;
        this._message = ret.message;
        let size = this._list.size;
        this.format(accept);
        for (let i = 0; 9 < size; i++) {
            this._list[i].validate(accept);
        }
        return accept;
    }
}