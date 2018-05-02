var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banktype: [],
    index: 0,
    banktypename: '计算机考级',
    bankname:'',
    bankintro:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            wx.switchTab({
              url: '../upload/upload',
            })
          }
        }
      })
    } else 
    { 
      this.getbanktype()
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


  banknameInput: function (event) {
    this.setData({ bankname: event.detail.value })
  },

  bankintroInput: function (event) {
    this.setData({ bankintro: event.detail.value })
  },

  // 选择器改变内容
  bindPickerChange: function (e) {
    // var that = this
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.setData({
      banktypename: this.data.banktype[this.data.index].name
    })

  },

  //查看类别
  getbanktype: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("请求题库类别数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankType/selectBankTypeAll.action',
      method: 'post',
      data: {
      },
      complete: function (res) {
        console.log("题库类别数据：")
        console.log(res.data.data)
        that.setData({ banktype: res.data.data })
        console.log("本地banktype：")
        console.log(that.data.banktype)
        that.setData({ banktypename: that.data.banktype[0].name })
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //创建题库
  createclick: function () {
    var that = this
    if (that.data.bankname == '' || that.data.bankintro == '') {
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '题库名称或题库简介不能为空',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })

    }
    else{
      wx.showLoading({
        title: '',
      })
      console.log("创建题库：" + app.d.hostUrl)
      console.log(app.appData.userinfo.username)
      console.log(that.data.banktypename)
      wx.request({
        url: app.d.hostUrl + '/user_bankQuestion/addBankQuestion.action',
        method: 'post',
        data: {
          title: that.data.bankname,
          intro: that.data.bankintro,
          userId: app.appData.userinfo.username,
          bankType: that.data.banktypename
        },
        success:function(res){
          setTimeout(function () {
            wx.hideLoading()
          }, 1000) 
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 800,
          })
        },
        complete: function (res) {
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)         
          console.log(res)
        }
      })
    }
  }


})