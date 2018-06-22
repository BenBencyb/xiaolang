var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionlist: []
  },

  //根据用户id查询收藏题目
  getquestion: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据用户id查询收藏题目：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/favorite/info/way/user',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        console.log(res)
        if (res.data.data)
        that.setData({
          questionlist: res.data.data.rows
        })

      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //取消收藏按钮
  delete_click: function (e) {
    var that = this
    var bankId = e.currentTarget.dataset.bankid
    var questionId = e.currentTarget.dataset.questionid

    wx.showModal({
      title: '提示',
      content: '是否确定取消收藏？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log(bankId)
          console.log(questionId)
          wx.request({
            url: app.d.hostUrl + '/favorite/info',
            method: "delete",
            data: {
              userId: app.appData.userinfo.username,
              questionId: questionId,
              bankId: bankId,
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'success',
                  duration: 800
                })
                setTimeout(function () {
                  that.getquestion()
                }, 800)
              }

            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  //查看题目
  look_click: function (e) {
    var id = e.currentTarget.dataset.id
    var bankname = e.currentTarget.dataset.name
    var title = "收藏"
    wx.navigateTo({
      url: '../lookhistoryquestion/lookhistoryquestion?questionid=' + id + "&bankname=" + bankname + "&title=" + title
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getquestion()
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