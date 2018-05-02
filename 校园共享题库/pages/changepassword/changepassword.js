var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldpassword: null,
    password: null,
    passwordconfirm: null,
    height: "0rpx",
    fontsize: "0rpx"
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

  //修改按钮
  modify_click: function () {

    if (this.data.oldpassword == null || this.data.password == null || this.data.passwordconfirm == null) {
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '密码不能为空',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })

    }
   
      else {
        var regLowerCase = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$', 'g');
        var rsLowerCase = regLowerCase.exec(this.data.password);
        console.log("匹配结果：" + rsLowerCase)
        if (rsLowerCase == null) {
          wx.showModal({
            confirmColor: "#55C5AC",
            title: '提示',
            content: '密码应大于等于6位字符并小于等于15位字符，而且必须包含数字和英文字母',
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        }
        else
          if (this.data.password == this.data.passwordconfirm) {
            console.log("新密码与确认密码一致")
            console.log("注册中......")
            console.log("账号为" + this.data.username)
            console.log("密码为" + this.data.password)
            this.modify()
          }
          else {
            wx.showModal({
              confirmColor: "#55C5AC",
              title: '提示',
              content: '两次密码输入不一致',
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
          }
      }
    
  },

  // 输入账号
  oldpassword_Input: function (event) {
    this.setData({ oldpassword: event.detail.value })
  },

  // 输入密码
  password_Input: function (event) {
    this.setData({ password: event.detail.value })
    if ((this.data.password != this.data.passwordconfirm) && (this.data.passwordconfirm != null)) {
      console.log("不一致")
      console.log(this.data.hide)
      this.setData({ height: "90rpx" })
      this.setData({ fontsize: "35rpx" })
    }
    else {
      this.setData({ height: "0rpx" })
      this.setData({ fontsize: "0rpx" })
    }
  },

  // 输入确认密码
  password_confirm_Input: function (event) {
    this.setData({ passwordconfirm: event.detail.value })
    if (this.data.password != this.data.passwordconfirm) {
      console.log("不一致")
      console.log(this.data.hide)
      this.setData({ height: "90rpx" })
      this.setData({ fontsize: "35rpx" })

    }
    else {
      this.setData({ height: "0rpx" })
      this.setData({ fontsize: "0rpx" })
    }
  },

  //修改密码
  modify: function () {
    var that = this
    console.log(app.appData.userinfo.username)
    console.log("请求网址" + app.d.hostUrl)
    console.log("执行修改密码方法......")
    wx.request({
      url: app.d.hostUrl + '/user_user/updatePassword.action',
      method: 'get',
      data: {
        id: app.appData.userinfo.username,
        password: that.data.oldpassword,
        updatePassword: that.data.password
      },
      complete: function (res) {
           console.log(res)
      }
    })
  },

  

})