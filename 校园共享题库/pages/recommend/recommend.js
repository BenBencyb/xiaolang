var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banklist: [],
    userimg: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanklist();
    this.setData({ userimg: app.appData.userInfo.avatarUrl })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getbanklist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 请求全部题库数据
  getbanklist: function () {
    var that = this

    console.log("请求全部题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/selectBankQuestion.action',
      method: 'post',
      data: {

      },
      success: function (res) {
        console.log("题库数据：")
        console.log(res.data.data)
        that.setData({ banklist: res.data.data })
        console.log("本地banklist：")
        console.log(that.data.banklist)

        console.log(that.data.banklist.length * 185)
        if (that.data.banklist.length * 185 > that.data.winHeight) {
          that.setData({
            // winHeight: that.data.banklist.length*160
            winHeight: 185 * that.data.banklist.length
          });
        }
        wx.stopPullDownRefresh()

      }
    })

  },

  // 做题
  gotrain: function (e) {
    if (app.appData.userinfo == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({
              url: '../login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
    else {
      var bankid = e.currentTarget.dataset.text
      var bankname = e.currentTarget.dataset.title
      console.log("题库id：" + bankid)
      console.log("题库名称：" + bankname)
      wx.navigateTo({
        url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
      })
    }
  },

  // 做题
  gotrain: function (e) {
    if (app.appData.userinfo == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({
              url: '../login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
    else {
      var bankid = e.currentTarget.dataset.text
      var bankname = e.currentTarget.dataset.title
      console.log("题库id：" + bankid)
      console.log("题库名称：" + bankname)
      wx.navigateTo({
        url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
      })
    }
  }


})