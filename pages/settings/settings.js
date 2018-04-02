// pages/settings/settings.js
import Lookup from '../../js/config/lookup.js';
import Config from '../../js/config/config.js';
import Help from '../../js/config/help.js';
import { CIPHER_DEFAULT } from '../../js/config/config.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        timeover: CIPHER_DEFAULT.KEY_TIMEOVER,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let timeover = Config.get("key.timeover", 10);
        this.setData({ timeover: timeover });
    },

    onTouchEvent(event) {
        Lookup.notification.notify({ name: "page.event", attachment: event });
    },

    onTimeoverBlur(event) {
        this.setData({ timeover: parseInt(event.detail.value) });
        Config.set("key.timeover", this.data.timeover);
        Lookup.notification.notify({ name: "key.timeover.change", attachment: this.data.timeover });
    },

    gopage(event) {
        wx.navigateTo({
            url: event.currentTarget.dataset.url,
        })
    },
    showHelp(event) {
        Lookup.notification.notify({ name: "page.help", attachment: event.currentTarget.dataset.key });
    }
})