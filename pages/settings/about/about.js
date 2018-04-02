// pages/settings/about/about.js

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    onCopy() {
        wx.setClipboardData({
            data: 'https://baike.baidu.com/item/%E6%89%A9%E6%95%A3%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95/20189852',
            success() {
                wx.showToast({ title: 'OK',icon:'none'});
            }
        });
    }
})