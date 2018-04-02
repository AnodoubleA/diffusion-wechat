// pages/session/session.js
const icons = {"text":"font","image":"image"};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        messages: [{ where: "from",type:"text", data: [], time: new Date() }, { where: "to", data: [], time: new Date() },],
        icons:icons,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
})