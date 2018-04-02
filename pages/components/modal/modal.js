// pages/components/modal.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        title: null,
        content: null,
        showConfirm: true,
        showCancel: true,
        confirmText: "确定",
        cancelText: "取消",
        confirmType: "primary",
        top: 0,
        zIndex: 200,
        callback: null,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        open(option, callback) {
            this.setData({
                title: option.title, content: option.content,
                showConfirm: !(option.showConfirm === false),
                showCancel: !(option.showCancel === false),
                confirmText: option.confirmText || "确定",
                confirmType: option.confirmType || "primary",
                cancelText: option.cancelText || "取消",
                zIndex: option.zIndex || 200, callback: callback,
                show: true,
            });
            let self = this;
            var query = wx.createSelectorQuery()
            var ret = query.in(self).select('#modal-root').boundingClientRect(function (res) {
                self.setData({ top: "calc(50vh - {}px)".format(res.height / 2) });
            }).exec();
        },
        onCancel() {
            this.close(0);
        },
        onConfirm() {
            this.close(1);
        },
        close(button) {
            this.setData({ show: false });
            let callback = this.data.callback;
            if (callback instanceof Function) {
                callback.call(this, button);
            }
        }
    }
})
