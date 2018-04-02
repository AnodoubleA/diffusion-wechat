// pages/settings/key/key.js
import { CIPHER_DEFAULT, CIPHER_LIMIT, LEVEL } from '../../../js/config/config.js';
import Config from '../../../js/config/config.js';
import Lookup from '../../../js/config/lookup.js';
import Utils from '../../../js/module/utils/utils.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        levels: LEVEL.VALUES,
        gourp: 0,
        level: 0,
        cycle: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = {
            group: Config.get("cipher.group", CIPHER_DEFAULT.GROUP),
            level: LEVEL.MAP[Config.get("cipher.level", CIPHER_DEFAULT.LEVEL)],
            cycle: Config.get("cipher.cycle", CIPHER_DEFAULT.CYCLE),
        };
        this.setData(data);
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    onKeySizeBlur(event) {
        let value = null;
        let input = value = parseInt(event.detail.value);
        
        if (isNaN(input)) value = CIPHER_DEFAULT.GROUP;
        value = value < CIPHER_LIMIT.MIN_GROUP_BIT ? CIPHER_LIMIT.MIN_GROUP_BIT : value;
        value = value > CIPHER_LIMIT.MAX_GROUP_BIT ? CIPHER_LIMIT.MAX_GROUP_BIT : value;
        if (value & (value - 1)) value = Utils.roundOf(value);

        if (value !== input) {
            this.setData({ group: value });
        }
        Config.set("cipher.group", value);
    },
    onCycleBlur(event) {
        let value = event.detail.value || CIPHER_DEFAULT.CYCLE;
        Config.set("cipher.cycle", value);
    },
    onLevelChange(event) {
        this.setData({ level: event.detail.value });
        Config.set("cipher.level", LEVEL.VALUES[this.data.level].value);
    },
    showHelp(event) {
        Lookup.notification.notify({ name: "page.help", attachment: event.currentTarget.dataset.key });
    }
});

function showModal(title, content, showCancel) {
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel
    });
    return false;
}