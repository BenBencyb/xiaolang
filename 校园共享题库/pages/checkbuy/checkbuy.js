var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionlist: []
  },

  //根据用户id查询购买记录
  getbuyrecord: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据用户id查询购买记录" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/buy/record',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username,
      },
      success: function (res) {
        console.log(res)
        if (res.data.data)
          that.setData({
            questionlist: res.data.data
          })

      },
      complete: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //查看题目
  look_click: function (e) {
    var id = e.currentTarget.dataset.id
    var bankname = e.currentTarget.dataset.name
    var title = 1
    wx.navigateTo({
      url: '../lookhistoryquestion/lookhistoryquestion?questionid=' + id + "&bankname=" + bankname + "&title=" + title
    })
  },

  //跳到题库做题
  jump_to_bank: function (e) {
    var bankid = e.currentTarget.dataset.bankid
    var bankname = e.currentTarget.dataset.bankname
    console.log("题库id：" + bankid)
    console.log("题库名称：" + bankname)
    wx.navigateTo({
      url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbuyrecord()
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