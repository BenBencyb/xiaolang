var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionlist: []
  },

  //根据用户id查询收藏题目
  getquestion: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据用户id查询收藏题目：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/favorite/info/way/user',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        console.log(res)
        that.setData({
          questionlist: res.data.data.rows
        })

      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getquestion()
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

  }
})