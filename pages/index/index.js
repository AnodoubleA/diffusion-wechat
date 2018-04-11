//index.js
//获取应用实例
import Config from "../../js/config/config.js"
const app = getApp()

Page({
    data: {
        show: false
    },
    onLoad() {
        let accept = Config.get("accept", false);
        if (accept) this.toIndex();
        else this.setData({ show: true });
    },
    onReject() {
        wx.showModal({
            title: '温馨提示',
            content: '由于您拒绝同意本协议，因此您将无法使用本APP的任何服务，若要继续使用，请务必同意本协议！',
            showCancel: false
        })
    },
    onAccept() {
        let self = this;
        wx.showModal({
            title: '您确定同意吗？',
            cancelText: "不同意",
            confirmText: "同意",
            success(res) {
                if (res.confirm) {
                    Config.set("accept", true);
                    self.toIndex();
                }
            }
        })
    },
    toIndex() {
        wx.switchTab({
            url: "/pages/cipher/cipher"
        });
    }
});