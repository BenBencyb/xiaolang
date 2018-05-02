var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banktypename: "5",
    banklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console.log(options.typename)
    that.setData({
      banktypename: options.typename
    })
    console.log("当前选择的类别：" + that.data.banktypename)
    that.getbanklist_by_type()
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

  //根据类别查题库
  getbanklist_by_type: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据类别查题库" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/selectByType.action',
      method: 'get',
      data: {
        value: that.data.banktypename
      },
      success: function (res) {
        console.log("某个类别的题库数据：")
        console.log(res.data.list)
        that.setData({ banklist: res.data.list })
        console.log("本地banklist：")
        console.log(that.data.banklist)
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
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
           
            
          }
        }
      })
    }
    else{
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