var app = getApp()

var interval = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historylist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_error_question()

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

  //请求做题记录
  get_error_question: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("请求做题记录" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/answerSheet/list/' + app.appData.userinfo.username,
      method: 'get',
      complete: function (res) {
        //console.log(res.data.data)
        if (res.data.data) {
          that.setData({ historylist: res.data.data })
        }
        setTimeout(function () {
          console.log("加载完毕")
          wx.hideLoading()
        }, 800)
      }
    })

  },

  //查看历史记录
  look_click: function (e) {
    var id = e.currentTarget.dataset.id
    var bankname = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../lookhistoryquestion/lookhistoryquestion?questionid=' + id + "&bankname=" + bankname
    })
  }


})