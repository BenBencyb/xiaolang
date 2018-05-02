var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    password: null,
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

  },

  // 登录按钮
  loginclick: function () {
    console.log("尝试登录......")
    console.log(this.data.username)
    console.log(this.data.password)
    this.login()
  },

  // 转到注册界面
  registerclick: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  goindexclick:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  usernameInput: function (event) {
    this.setData({ username: event.detail.value })
  },

  passwordInput: function (event) {
    this.setData({ password: event.detail.value })
  },

  //登录方法
  login: function () {
    var that=this
    console.log("请求网址"+app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_user/login.action',
      method: 'post',
      data: {
        id: this.data.username,
        password: this.data.password
      },
      complete: function (res) {
        console.log(res)
        if(res.data.status==1){

          console.log("登录成功")
          app.appData.userinfo = { username: that.data.username, password: that.data.password }
          console.log("当前登录的用户：" + app.appData.userinfo.username)
          wx.switchTab({
            url: '/pages/user/user'
          })

        }
        else{
          console.log("登录失败")
          wx.showModal({
            confirmColor: "#55C5AC",
            title: '提示',
            content: '用户名或密码错误',
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        }
      }
    })
  }


})