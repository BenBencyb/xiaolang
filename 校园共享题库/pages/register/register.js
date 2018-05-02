var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    password: null,
    passwordconfirm: null,
    height: "0rpx",
    fontsize: "0rpx"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getusermess()
    
    this.getopenid()
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

  //注册按钮
  register_click: function () {

    if (this.data.username == null || this.data.password == null || this.data.passwordconfirm == null)     {
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '用户名或密码不能为空',
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
      if (this.data.username.length > 20){
        wx.showModal({
          confirmColor: "#55C5AC",
          title: '提示',
          content: '用户名应小于等于20位字符',
          showCancel: false,
          confirmText: '知道了',
          success: function (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
            }
          }
        })
      }
      else{
        var regLowerCase = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$', 'g');
        var rsLowerCase = regLowerCase.exec(this.data.password);
        console.log("匹配结果："+rsLowerCase)
        if (rsLowerCase==null) {
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
          console.log("密码与确认密码一致")
          console.log("注册中......")
          console.log("账号为" + this.data.username)
          console.log("密码为" + this.data.password)
          this.addUser()
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
    }
  },

  // 输入账号
  username_Input: function (event) {
    this.setData({ username: event.detail.value })
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

  // 添加用户
  addUser: function () {
    var that=this
    console.log("请求网址"+app.d.hostUrl)
    console.log("执行注册方法......")
    wx.request({
      url: app.d.hostUrl + '/user_user/addUser.action',
      method: 'post',
      data: {
        id: that.data.username,
        password: that.data.password,
        icon: app.appData.userInfo.avatarUrl,
        nickname: app.appData.userInfo.nickName,
        wxid: app.appData.openid
      },
      complete: function (res) {
        console.log(res)
        if(res.data.status==1){
          console.log("注册成功")
          //跳转回首页
          wx.showModal({
            confirmColor: "#55C5AC",
            title: '提示',
            content: '注册成功',
            showCancel: false,
            confirmText: '返回首页',
            success: function (res) {
              if (res.confirm) {
                app.appData.userinfo = { username: that.data.username, password: null }
                console.log('用户点击确定')
                wx.switchTab({
                  url: '/pages/index/index'
                })
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          })

        }
        else{
          console.log('注册失败')
          wx.showModal({
            confirmColor: "#55C5AC",
            title: '提示',
            content: '注册失败',
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              } 
            }
          })
        }
      }
    })
  },

  getopenid: function () {
    //获取临时登录凭证
    wx.login({
      success: function (res) {
        if (res.code) {
          
          //发起网络请求
          wx.request({
            url: app.d.hostUrl + '/wx_app/onLogin.action',
            data: {
              code: res.code
            },
            complete: function (res) {
              app.appData.openid = res.data.openid
            }
          })
        } else {
          console.log('获取code失败！' + res.errMsg)
        }
      }
    });
  },

//获取用户微信基本信息
  getusermess: function () {
    var that = this
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        console.log("获取用户微信基本信息：")
        console.log(res.userInfo)
        app.appData.userInfo = res.userInfo
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },


})