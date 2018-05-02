var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionlist: [],
    bankid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({bankid:options.id})
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
    this.getquestion()
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

  //根据题库id查询题目
  getquestion: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据题库id查询题目：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/user_choiceQuestion/selectChoiceQuestionByBankQuestionId.action',
      method: 'get',
      data: {
        value: that.data.bankid
      },
      success: function (res) {
        console.log(res.data.list)
        that.setData({
          questionlist: res.data.list
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
      }
    })

  },

//修改题目按钮
  questionmodify_click: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../questionmodify/questionmodify?id=' + id
    })
  },


  //删除

  delete_click: function (e) {
    var that = this

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '',
          })
          console.log('用户点击确定')
          console.log(e)
          var questionid = e.currentTarget.dataset.id

          console.log("删除：" + app.d.hostUrl)
          console.log(app.appData.userinfo.username)
          wx.request({
            url: app.d.hostUrl + '/user_choiceQuestion/deleteById.action',
            method: 'get',
            data: {
              id: questionid
            },
            success: function (res) {
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)

              console.log(res)
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 800,
              })
            },
            complete: function (res) {
              setTimeout(function () {
                that.getquestion()
              }, 800)

            }
          })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })





  },




})