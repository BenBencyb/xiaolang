var app = getApp()

var interval = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorquestionlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

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
    this.get_error_question()
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
  //请求错题记录
  get_error_question: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("请求错题记录" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/answerSheet/list/' + app.appData.userinfo.username +'/fault',
      method: 'get',
      complete: function (res) {
        console.log(res)
        if (res.data.data){
          that.setData({ errorquestionlist: res.data.data })
        }
        // console.log(that.data.errorquestionlist[that.data.errorquestionlist.length-1]) 
         setTimeout(function () {
            console.log("加载完毕")
            wx.hideLoading()
         }, 800)
      }
    })

  },

  // 做题
  gotrain: function (e) {
    var id = e.currentTarget.dataset.id
    var sheetid = e.currentTarget.dataset.sheetid
    var sort = e.currentTarget.dataset.sort-1
    console.log("题库id：" + id)
    console.log("错题专用id：" + sort)
    console.log("记录id：" + sheetid)
    wx.navigateTo({
      url: '../doerrorquestion/doerrorquestion?id=' + id + "&sort=" + sort
    })
  }



})