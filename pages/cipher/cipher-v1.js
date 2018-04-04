// pages/cipher/cipher.js
import { CIPHER_OPTION, ALGORITHMS } from '../../js/module/cipher/consts.js'
import { CIPHER_LIMIT } from '../../js/config/config.js'
import Config from '../../js/config/config.js';
import Lookup from '../../js/config/lookup.js';
import Utils from '../../js/module/utils/utils.js'
import Validate from '../../js/module/utils/Validate.js'
import Base64 from '../../js/module/encoding/Base64.js';

import TextEncipherCommand from '../../js/cmds/TextEncipherCommand.js';
import TextDecipherCommand from '../../js/cmds/TextDecipherCommand.js';

Page({
    data: {
        hidden: false,
        key: null,
        input: "",
        inbuf: "",
        output: "",
        outbuf: ""
    },
    onLoad() {
        this.keyeditor = this.selectComponent("#keyeditor");
        let self = this;
        Lookup.notification.addNotifier("key.timeover", function (event) {
            self.onClean();
        });
        let first = Config.get("use.first", true);
        if (first) {
            Lookup.notification.notify({ name: "page.help", attachment: "use.first" });
            Config.set("use.first", false);
        }
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Cipher content 
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    onTouchEvent(event) {
        Lookup.notification.notify({ name: "page.event", attachment: event });
    },
    onInputBlur(event) {
        this.data.input = event.detail.value;
    },
    onTxtClean(event) {
        let cipher = {};
        cipher[event.currentTarget.dataset.field] = "";
        this.setData(cipher);
    },
    onPaste() {
        let self = this;
        wx.getClipboardData({
            success(ret) {
                self.setData({ input: ret.data });
            }
        });
    },
    onCopy() {
        let data = this.data.output;
        if (String.notEmpty(data)) {
            wx.setClipboardData({
                data: data,
                success() {
                    showToast("OK", 700);
                },
                fail() {
                    showToast("复制失败！");
                }
            });
        }
    },
    onEncipher(event) {
        let key = this.data.key;
        if (key == null || key.data.isEmpty) {
            return showToast("请先设置密码");
        }
        if (String.isEmpty(this.data.input)) {
            return showToast("请输入消息！");
        }
        let min = CIPHER_LIMIT.MIN_KEY_LENGTH;
        let self = this;
        if (key.data.length < min) {
            let option = {
                title: '警告',
                content: "密码太短了，最好大于{}！".format(min),
                confirmText: '忽略警告',
                confirmColor: '#ff5511',
                success: function (res) {
                    if (res.confirm) doEncipher(self, key);
                }
            };
            return wx.showModal(option);
        }
        doEncipher(self, key);
    },
    onDecipher(event) {
        let key = this.data.key;
        if (key == null || key.data.isEmpty) {
            return showToast("请先设置密码");
        }
        if (String.isEmpty(this.data.input)) {
            return showToast("请输入密文！");
        }
        try {
            let output = Base64.Decoder.decode3(this.data.input);
            doDecipher(this, key, output);
        } catch (error) {
            showModal("错误", error.message, false);
        }
    },
    onKey(event) {
        this.data.inbuf = this.data.input;
        this.data.outbuf = this.data.output;
        this.setData({ hidden: true, input: null, output: null });
        let self = this;
        this.keyeditor.open(this.data.key, function (button, key) {
            let data = { hidden: false, input: "...", output: "..." };
            if (button) data.key = key;
            self.setData(data);
            setTimeout(() => {
                self.setData({ input: self.data.inbuf, output: self.data.outbuf });
                self.data.inbuf = self.data.outbuf = null;
            }, 70);
        });
    },
    onClean() {
        this.setData({ key: null, input: "", output: "" });
        this.keyeditor.clear();
    }
});

function doEncipher(self, key) {
    let cipherInfo = {
        options: CIPHER_OPTION.ENCIPHER | CIPHER_OPTION.TEXT,
        group: key.group >> 3,
        algorithm: ALGORITHMS.DC140713,
        level: key.level,
        key: key.data,
    };
    self.setData({ output: "加密中..." });
    let cmd = new TextEncipherCommand(cipherInfo, Utils.s2b(self.data.input), function (output) {
        let buf = new Uint8Array(output.data, 0, output.size);
        self.setData({ output: wx.arrayBufferToBase64(buf) });
    });
    Lookup.invoker.invoke(cmd);
}

function doDecipher(self, key, output) {
    let cipherInfo = {
        options: CIPHER_OPTION.DECIPHER | CIPHER_OPTION.TEXT,
        key: key.data,
    };
    self.setData({ output: "解密中..." });
    let cmd = new TextDecipherCommand(cipherInfo, new Uint8Array(output), function (output) {
        self.setData({ output: Utils.b2s(output.data, 0, output.size) });
    });
    Lookup.invoker.invoke(cmd);
}


function showToast(info, time) {
    wx.showToast({
        title: info,
        duration: time || 1500,
        icon: 'none'
    });
    return false;
};

function showModal(title, info, showCancel) {
    wx.showModal({
        title: title,
        content: info,
        showCancel: showCancel
    });
    return false;
}