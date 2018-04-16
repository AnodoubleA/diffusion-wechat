import Config from "./config.js";

export default class Lookup {

    static _invoker = null;
    static get invoker() {
        if (Lookup._invoker === null) {
            let Class = require('../module/command/ImmediateInvoker');
            Lookup._invoker = new Class.default();
        }
        return Lookup._invoker;
    };

    static _notification = null;
    static get notification() {
        if (Lookup._notification === null) {
            let Class = require('../module/notify/HashClassifyNotification');
            Lookup._notification = new Class.default();
        }
        return Lookup._notification;
    };

    static _seedSourceFactory = null;
    static get seedSourceFactory() {
        if (Lookup._seedSourceFactory === null) {
            let Class = require('../module/random/SourceSeedFactory');
            Lookup._seedSourceFactory = new Class.default();
        }
        return Lookup._seedSourceFactory;
    };
}


