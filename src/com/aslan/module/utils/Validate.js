export default class Validate {
    static VALID = 1;
    static INVALID = 2;
    static WARNING = 4;
    static WARNING_HIGH = 8;


    _list = [];
    _message = null;
    _code = 0;

    constructor(code, message) {
        this._message = message;
        this._code = code || Validate.VALID;
    }

    get message() {
        return this._message;
    }

    get code() {
        let size = this._list.length;
        if (size === 0) return this._code;
        let code = this._code;
        for (var i = 0; i < size; i++) {
            code |= this._list[i].code;
        }
        return code;
    }

    append(code, message) {
        this._list.push(new Validate(code, message));
        return this;
    }

    format(accept) {
        switch (this._code) {
            case Validate.INVALID:
                accept.push("错误: " + this.message);
                break;
            case Validate.WARNING:
                accept.push("警告: " + this.message);
                break;
            case Validate.WARNING_HEIGH:
                accept.push("慎重警告: " + this.message);
                break;
        }
        return accept;
    }

    collect(accept) {
        accept = accept || [];
        let code = this.code;
        if (code > Validate.VALID) {
            let size = this._list.length;
            if (size === 0) return this.format(accept);

            for (let i = 0; i < size; i++) {
                this._list[i].format(accept);
            }
        }
        return accept;
    }
};
const colors = {};
colors[Validate.INVALID] = { text: "red" };
colors[Validate.WARNING] = { text: "#FEC000" };
colors[Validate.WARNING_HIGH] = { text: "#fff", bg: "red" };