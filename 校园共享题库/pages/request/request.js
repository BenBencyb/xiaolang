var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 授权用户信息
  login(res) { // 需要一个参数来额外接收用户数据
    var that = this
    console.log(res.detail.userInfo)
    if (res.detail.userInfo) {
      console.log("同意授权")
      app.appData.userinfo.userimg = res.detail.userInfo.avatarUrl
      app.appData.userinfo.nickName = res.detail.userInfo.nickName
      console.log(app.appData.userinfo.userimg)
      console.log(app.appData.userinfo.nickName)
      that.addUser()
    }
    else {
      console.log("拒绝授权")
    }
  },

  //不授权
  noquest: function (options) {
    var that = this
    that.addUser()
  },

  // 添加用户
  addUser: function () {
    var that = this
    console.log("请求网址" + app.d.hostUrl)
    console.log("执行注册方法......")
    wx.request({
      url: app.d.hostUrl + '/user/info',
      method: 'post',
      data: {
        password: "12345678",
        icon: app.appData.userinfo.userimg,
        nickname: app.appData.userinfo.nickName,
        wxid: app.appData.openid
      },
      complete: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          console.log("注册成功")
          //跳转回首页    
          app.appData.userinfo.username = res.data.data.id
          console.log('跳转回首页')
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        else{
          wx.showToast({
            title: '发生错误',
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
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