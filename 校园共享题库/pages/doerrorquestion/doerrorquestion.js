var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    bankname: '',
    questionid: 0,
    //allquestion: [],
    questionlist: {},
    errorquestionlist: [],
    letterid: '',
    errorid: 'E',
    condition: 0,
    clickcheckid: 0,
  },

  changeColor: function (e) {
    // console.log(e)
    var that = this
    if (that.data.condition == 0) {
      that.setData({
        letterid: e.currentTarget.dataset.id
      });
    }
    console.log(that.data.letterid)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.get_error_question()
    this.setData({ questionid: options.id })
    this.setData({ index: options.sort })
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

  },

  //根据题目id查看题目详情
  getquestion: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("查看题目详情" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_choiceQuestion/selectChoiceQuestion.action',
      method: 'get',
      data: {
        id: that.data.questionid
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({ questionlist: res.data.data })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
  },

  // 查看答案
  checkanswer_click: function () {
    var that = this
    var istrue = 1
    var answer = that.data.letterid
    that.setData({ condition: 1, clickcheckid: 1 })
    console.log("答案：" + that.data.questionlist.answer)
    console.log("当前选择：" + that.data.letterid)

    if ((that.data.letterid != that.data.questionlist.answer)) {
      console.log('不正确')
      istrue = 0
      that.setData({
        errorid: that.data.letterid,
      });
      that.setData({ letterid: that.data.questionlist.answer })

    }
    else {
      console.log('正确')
    }
    if (that.data.letterid != '') {
      wx.request({
        url: app.d.hostUrl + '/user_answerSheet/addRecord.action',
        method: 'post',
        data: {
          userId: app.appData.userinfo.username,
          questionId: that.data.questionlist.id,
          bankId: that.data.questionlist.bankId,
          answer: answer,
          istrue: istrue
        },
        complete: function (res) {
          console.log(res)
        }
      })
    }
  },

  //请求错题记录
  get_error_question: function () {
    var that = this
    console.log("请求错题记录" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_answerSheet/selectFaultRecord.action',
      method: 'post',
      data: {
        id: app.appData.userinfo.username,
      },
      complete: function (res) {
        console.log(res.data.list)
        that.setData({ errorquestionlist: res.data.list })
      }
    })

  },
  // 上一题
  lastquestion_click: function () {
    var that = this
    if (that.data.index == 0) {
      wx.showToast({
        title: '当前是第一题',
        icon: 'none',
        duration: 2000
      })
    }
    else
    {
      that.setData({ index: that.data.index - 2 + 1 })
      console.log("上一题id:" + that.data.errorquestionlist[that.data.index].questionId)
      that.setData({ questionid: that.data.errorquestionlist[that.data.index].questionId })

      that.getquestion()

      that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
    }

  },

  // 下一题
  nextquestion_click: function () {
    var that = this
    if (that.data.index == that.data.errorquestionlist.length - 1) {
      wx.showToast({
        title: '已经是最后一题',
        icon: 'none',
        duration: 2000
      })
    }
    else
    {
    that.setData({ index: that.data.index - 1 + 2 })
    console.log("下一题id:" + that.data.errorquestionlist[that.data.index].questionId)
    that.setData({ questionid: that.data.errorquestionlist[that.data.index].questionId })

    that.getquestion()

    that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
    }
  },

  

})