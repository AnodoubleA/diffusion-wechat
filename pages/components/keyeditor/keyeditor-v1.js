// pages/keyeditor/keyeditor.js
import Utils from "../../../js/module/utils/utils.js";
import Validate from "../../../js/module/utils/Validate.js";
import Lookup from "../../../js/config/lookup.js";
import Base64 from "../../../js/module/encoding/Base64.js";
import Hex from "../../../js/module/encoding/hex.js";
import Config from "../../../js/config/config.js";
import { CIPHER_LIMIT, CIPHER_DEFAULT, LEVEL } from "../../../js/config/config.js";

const OK = 1, CANCEL = 0;
const formats = {
    "text": function (text) {
        return Utils.s2b(text);
    },
    "base64": function (text) {
        return Base64.Decoder.decode3(text);
    },
    "hex": function (text) {
        return Hex.h2b(text);
    }
};

Component({

    data: {
        show: false,
        callback: null,
        levels: LEVEL.VALUES,
        algorithm: 0,
        level: LEVEL.MAP[CIPHER_DEFAULT.LEVEL],
        cycle: CIPHER_DEFAULT.CYCLE,
        group: CIPHER_DEFAULT.GROUP,
        format: CIPHER_DEFAULT.FORMAT,
        key: "",
    },
    ready() {
        let data = {
            group: Config.get("cipher.group", CIPHER_DEFAULT.GROUP),
            level: LEVEL.MAP[Config.get("cipher.level", CIPHER_DEFAULT.LEVEL)],
        };
        this.setData(data);
    },
    methods: {
        onSubmit(event) {
            let key = null;
            try {
                key = pack(event.detail.value);
            } catch (error) {
                return showModal('错误', error.message, false);
            }
            this.close(OK, key);
        },
        onReset() {
            this.setData({
                algorithm: 0,
                level: LEVEL.MAP[CIPHER_DEFAULT.LEVEL],
                cycle: CIPHER_DEFAULT.CYCLE,
                group: CIPHER_DEFAULT.GROUP,
                format: CIPHER_DEFAULT.FORMAT,
                key: ""
            });
        },
        onGroupBlur(event) {
            let value = null;
            let input = value = parseInt(event.detail.value);

            if (isNaN(input)) value = CIPHER_DEFAULT.GROUP;
            value = value < CIPHER_LIMIT.MIN_GROUP_BIT ? CIPHER_LIMIT.MIN_GROUP_BIT : value;
            value = value > CIPHER_LIMIT.MAX_GROUP_BIT ? CIPHER_LIMIT.MAX_GROUP_BIT : value;
            if (value & (value - 1)) value = Utils.roundOf(value);

            if (value !== input) {
                this.setData({ group: value });
            }
        },
        onCancel() {
            this.close(CANCEL);
        },
        onKeyClean() {
            this.setData({ key: "" });
        },
        onKeyPaste() {
            let self = this;
            wx.getClipboardData({
                success(ret) {
                    self.setData({ key: ret.data });
                }
            });
        },
        onLevelChange(event) {
            this.setData({ level: event.detail.value });
        },
        // ------------------------------------------------------------------------------------------------
        open(key, callback) {
            this.data.callback = callback;
            let data = { show: true };
            if (key) {
                data.group = key.group || this.data.group;
                data.level = LEVEL.MAP[key.level] || this.data.level;
                data.cycle = key.cycle || this.data.cycle;
                data.format = key.format || this.data.format;
            };
            this.setData(data);
        },
        close() {
            this.setData({ show: false });
            let callback = this.data.callback;
            if (callback instanceof Function) {
                callback.apply(this, arguments);
            }
        },
        getKey() {
            return this.data.pack;
        },
        showHelp(event) {
            Lookup.notification.notify({ name: "page.help", attachment: event.currentTarget.dataset.key });
        },
        clear() {
            this.onReset();
        }
    }
});


function pack(data) {
    if (String.isEmpty(data.key)) {
        throw new Error("请输入密码！");
    }
    let ret = {
        algorithm: data.algorithm,
        level: LEVEL.VALUES[parseInt(data.level)].value,
        group: parseInt(data.group),
        data: decodeKey(data.key, data.format),
        format: data.format
    };
    return ret;
}

function decodeKey(text, format) {
    return formats[format](text);
}

function showModal(title, content, showCancel) {
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel
    });
}