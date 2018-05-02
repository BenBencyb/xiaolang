var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    banktype: [],
    index: 0,
    banktypename: '计算机考级',
    bankname: '',
    bankintro: '',
    oldbanktitle:'',
    oldbankintro:'',
    oldbanktype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options)
    console.log(options.banktitle)
    console.log(options.bankintro)
    this.setData({ oldbanktitle: options.banktitle, oldbankintro: options.bankintro, oldbanktype: options.banktype, id: options.id, bankname: options.banktitle, bankintro: options.bankintro})
  
    this.getbanktype()
  
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
      success: function (res) {
        console.log("题库类别数据：")
        console.log(res.data.data)
        that.setData({ banktype: res.data.data })
        console.log("本地banktype：")
        console.log(that.data.banktype)
        console.log(that.data.banktype.length)
        for (var i = 0; i < that.data.banktype.length; i++) {
          console.log("进入循环")
          if (that.data.banktype[i].name == that.data.oldbanktype) {
            console.log("找到相同type")
            that.setData({ index: i, banktypename: that.data.banktype[i].name})
          }
        }

        wx.stopPullDownRefresh()

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //修改题库信息
  modify_click: function () {
    wx.showLoading({
      title: '',
    })
    var that = this
    console.log("修改：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/selectUpdateById.action',
      method: 'post',
      data: {
        id: that.data.id,
        title: that.data.bankname,
        intro: that.data.bankintro,
        bankType: that.data.banktypename,
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000) 
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000,
          complete:function (res){
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


})