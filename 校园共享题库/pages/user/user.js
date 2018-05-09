
var app = getApp();

var interval="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: null,
    username: null,
    allRecord: null,
    faultRecord: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.search_no();
    if (app.appData.userinfo != null) {
      this.setData({ username: app.appData.userinfo.username })
      this.setData({ userimg: app.appData.userInfo.avatarUrl })

    } else {
      console.log("没有用户名")
      wx.redirectTo({
        url: '../login/login',
      })
    }

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
    this.search_no()
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

  // 查询用户功能     用户答错的题目数量，总答题数目
  search_no: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("查询用户" + app.appData.userinfo.username + "信息" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_user/getUser.action',
      method: 'post',
      data: {
        id: app.appData.userinfo.username
      },
      success: function (res) {
        console.log("search_no方法：")
        console.log("接收到的数据")
        console.log(res.data)
        that.setData({ allRecord: res.data.all, faultRecord: res.data.fault })
        // that.data.user = res.data.user
        console.log("本地数据：")
        console.log("已做题：" + that.data.allRecord)
        console.log("错题：" + that.data.faultRecord)
        wx.stopPullDownRefresh()

        interval = setInterval(function () {
          console.log("加载中")
          if (that.data.allRecord != null && that.data.faultRecord != null) {
            console.log("加载完毕")
            wx.hideLoading()
            clearInterval(interval); // 清除setInterval
          }
        }, 1);

        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 1000)
      }
    })

  },

  //跳转到做题记录
  history_click: function () {
    wx.navigateTo({
      url: '../trainhistory/trainhistory'
    })
  },

  //跳转到个人资料
  userdata_click: function () {
    wx.navigateTo({
      url: '../userdata/userdata'
    })
  },

  //跳转到题库管理
  bankmanage_click: function () {
    wx.navigateTo({
      url: '../bankmanage/bankmanage'
    })
  },

  //跳转到错题记录
  errorquestion_click: function () {
    wx.navigateTo({
      url: '../errorquestion/errorquestion'
    })
  }

})