import none from "js/module/utils/extends.js";
import message from "js/module/format/message.js";
import Lookup from 'js/config/lookup.js';
import Config from 'js/config/config.js';
import HELP from 'js/config/help.js';
import RandomPointSeedSource from 'js/views/RandomPointSeedSource.js';
import { CIPHER_DEFAULT } from 'js/config/config.js';

const source = new RandomPointSeedSource();

Lookup.seedSourceFactory.register(source);

Lookup.notification.addNotifier("page.event", function (event) {
    source.handleEvent(event.attachment)
});


Lookup.notification.addNotifier("command.error", function (event) {
    let attachment = event.attachment;
    wx.showModal({
        title: '错误',
        content: attachment.message || attachment.name,
        showCancel: false
    });
});


Lookup.notification.addNotifier("page.help", function (event) {
    let content = HELP[event.attachment];
    if (content) {
        wx.showModal({
            title: '帮助',
            content: content,
            showCancel: false
        })
    }
});

App({
    onLaunch: function () {

    },
    onShow() {
        let timeover = Config.get("key.timeover", CIPHER_DEFAULT.KEY_TIMEOVER);
        let time = Config.CACHE.get("app.hide.time");
        if (time != null && Date.now() - time > timeover * 60000) {
            Lookup.notification.notify({ name: "key.timeover" });
        }
    },
    onHide() {
        Config.CACHE.set("app.hide.time", Date.now());
    }
});
