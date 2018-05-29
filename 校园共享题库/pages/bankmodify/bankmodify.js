var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    banktype: [],
    topindex: 0,
    index: 0,
    banktypename: '计算机考级',
    bankname: '',
    bankintro: '',
    oldbanktitle: '',
    oldbankintro: '',
    oldbanktype: '',
    objectMultiArray: [[], []]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    console.log(options.banktitle)
    console.log(options.bankintro)
    this.setData({ oldbanktitle: options.banktitle, oldbankintro: options.bankintro, oldbanktype: options.banktype, id: options.id, bankname: options.banktitle, bankintro: options.bankintro })

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
    
    this.setData({
      banktypename: this.data.banktype[this.data.topindex].lowerCategories[this.data.index].name
    })
    console.log(this.data.banktypename)
  },

  // 某一列选择器改变内容
  bindColumnChange: function (e) {
    var that = this
    console.log(e)
    console.log('第' + e.detail.column + '列改成第' + e.detail.value + '个')
    var topobjectMultiArray = "objectMultiArray[0]"
    var objectMultiArray = "objectMultiArray[1]"
    if (e.detail.column == 0) {
      that.setData({ [objectMultiArray]: that.data.banktype[e.detail.value].lowerCategories })
      that.setData({ topindex: e.detail.value, index: 0 })
    }
    if (e.detail.column == 1) {
      that.setData({ index: e.detail.value })
    }

  },

  //查看类别
  getbanktype: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("请求题库类别数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/category/list',
      method: 'get',
      success: function (res) {
        console.log("题库类别数据：")
        console.log(res.data.data[0].lowerCategories)
        that.setData({ banktype: res.data.data[0].lowerCategories })

        var objectMultiArray = "objectMultiArray[0]"
        var objectMultiArray2 = "objectMultiArray[1]"
        that.setData({ [objectMultiArray]: that.data.banktype })
        that.setData({ [objectMultiArray2]: that.data.banktype[0].lowerCategories })

        for (var i = 0; i < that.data.banktype.length; i++) {
          for (var j = 0; j < that.data.banktype[i].lowerCategories.length; j++){
            if (that.data.banktype[i].lowerCategories[j].name == that.data.oldbanktype) {
              console.log("找到相同type")
              that.setData({ topindex: i, index:j, banktypename: that.data.banktype[i].lowerCategories[j].name })
            }
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
    console.log("要修改的题库id"+that.data.id)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'put',
      data: {
        id: that.data.id,
        title: that.data.bankname,
        intro: that.data.bankintro,
        categoryName: that.data.banktypename,
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


})