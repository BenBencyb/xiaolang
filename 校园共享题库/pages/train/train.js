var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    bankname: '',
    bankid: 0,
    allquestion: [],
    questionlist: {},
    letterid: '',
    errorid: 'E',
    condition: 0,
    clickcheckid: 0
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
    console.log(options.bankid)
    console.log(options.bankname)
    this.setData({ bankid: options.bankid, bankname: options.bankname })
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

  // 根据题库id查询题目
  getquestion: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("查询题目信息" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_choiceQuestion/selectAllChoiceById.action',
      method: 'get',
      data: {
        value: that.data.bankid
      },
      success: function (res) {
        console.log(res.data.list)
        that.setData({ questionlist: res.data.list[0], allquestion: res.data.list })
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
      istrue = 0
      that.setData({
        errorid: that.data.letterid,
      }); 
    }

    if (that.data.letterid != '') {
      console.log("已选答案")
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
    if ((that.data.letterid != that.data.questionlist.answer)) {
      console.log('不正确')
      that.setData({ letterid: that.data.questionlist.answer })

    }
    else {
      console.log('正确')
    }

    


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
    else {
      that.setData({ index: that.data.index - 1 })
      that.setData({ questionlist: that.data.allquestion[that.data.index] })
      that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
    }
  },

  // 下一题
  nextquestion_click: function () {
    var that = this
    if (that.data.index == that.data.allquestion.length - 1) {
      wx.showToast({
        title: '已经是最后一题',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      that.setData({ index: that.data.index + 1 })
      that.setData({ questionlist: that.data.allquestion[that.data.index] })
      that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
    }
  },




})