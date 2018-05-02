var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: "",
    email: "",
    phone: "",
    height: "0rpx",
    fontsize: "0rpx"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ nickname: options.nickname ,email:options.email,phone:options.phone})
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
  //输入昵称
  nickname_Input:function(event){
    this.setData({ nickname: event.detail.value })
  },

  //输入邮箱
  email_Input: function (event) {
    this.setData({ email: event.detail.value })
  },

  //输入手机号码
  phone_Input: function (event) {
    this.setData({ phone: event.detail.value })
  },

  //修改资料
  modify_click: function () {
    var that = this
    var regLowerCase = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$', 'g');
    var rsLowerCase = regLowerCase.exec(that.data.email);
    var regLowerCase2 = new RegExp('0?(13|14|15|18)[0-9]{9}', 'i');
    var rsLowerCase2 = regLowerCase2.exec(that.data.phone);
    console.log("手机验证："+rsLowerCase2)
    console.log(that.data.phone.length)
    if (that.data.nickname.length>20){
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '昵称应小于等于20位字符',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      })
    }
    else if ((rsLowerCase == null) && (that.data.email != '')){
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '邮箱格式错误',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      })
    }
    else if ((rsLowerCase2 == null) || (that.data.phone != '' && that.data.phone.length !=11) ){
      console.log(that.data.phone.length)
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '手机号码格式错误',
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
    wx.showLoading({
      title: '',
    })
    console.log("修改资料：" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_user/updateUser.action',
      method: 'post',
      data: {
        id: app.appData.userinfo.username,
        nickname:that.data.nickname,
        email:that.data.email,
        phone:that.data.phone
      },
      success:function(res){
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000,
          complete: function (res) {
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          }
        })
      },
      complete: function (res) {       
        console.log(res)
      }
    })
    }
  },
  
})