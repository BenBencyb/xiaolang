var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    questionlist: []
  },

  //根据用户id查询积分记录
  getquestion: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据用户id查询积分记录" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/points/info',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username,
        page:1,
        size:8
      },
      success: function (res) {
        console.log(res)
        if(res.data.data){
          that.setData({
            questionlist: res.data.data.rows
          })
        }
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
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
    var that = this
    var b1 = [];
    console.log("触底")
    that.setData({ page: that.data.page + 1 }, () => {
      console.log('页数增加1')
    })
    wx.request({
      url: app.d.hostUrl + '/points/info',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username,
        page: that.data.page,
        size: 8
      },
      success: function (res) {
        console.log("新申请的题库数据：")
        console.log(res.data.data.rows)
        console.log("总页数" + res.data.data.pages)

        if (that.data.page <= res.data.data.pages) {//当前页数小于等于总页数
          b1 = res.data.data.rows//给b1赋值新申请的数据
          console.log("b1：")
          console.log(b1)
          that.setData({ questionlist: that.data.questionlist.concat(b1) }, () => {
            console.log("本地题库增加成功")
          })
        }
        else {
          that.setData({ page: res.data.data.pages }, () => {
            console.log('没有新数据')
          })
        }

        wx.stopPullDownRefresh()

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})