import { ALGORITHMS } from "../module/cipher/consts.java"

export const CIPHER_LIMIT = {
    MIN_GROUP_BIT: 1024,
    MAX_GROUP_BIT: 524288,
    MIN_KEY_LENGTH: 30,
    MAX_CYCLE: 0xFF,
}

export const CIPHER_DEFAULT = {
    ALGORITHM: ALGORITHMS.DC140713,
    GROUP: 2048,
    LEVEL: 2,
    CYCLE: 1,
    FORMAT: "text",
    KEY_TIMEOVER: 10
};


export const LEVEL = {
    VALUES: [{ label: "级别2（流密匙）", value: 2 }, { label: "级别1（固定密匙）", value: 1 }],
    MAP: { "2": 0, "1": 1 }
}

export default class Config {

    static get(key, def) {
        try {
            let value = wx.getStorageSync(key);
            if (value == null || isNaN(value)) {
                return def;
            }
            if (String.is(value) && String.isBlank(value)) {
                return def;
            }
            return value;
        } catch (error) {
            return def;
        }
    }

    static set(key, data) {
        try {
            wx.setStorageSync(key, data)
        } catch (error) {

        }
    }

    static CACHE = new Map();
}

