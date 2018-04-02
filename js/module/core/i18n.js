export default class Internationalization {

    def = null;
    lang = null;
    constructor(def, lang) {
        this.def = def;
        this.lang = lang;
    }

    $(key) {
        let value = this.lang[key];
        if (value == null) {
            if (def !== null) {
                value = def.$[key];
            }
        }
        return value;
    }
}