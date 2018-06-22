var app = getApp()

let animationShowHeight = 300;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //index: 0,
    bankname: '',
    questionid: 0,
    allquestion: [],
    questionlist: {},
    letterid: '',
    errorid: 'E',
    condition: 0,
    clickcheckid: 0,


  },

  //跳到题库做题
  jump_to_bank: function (e) {
    var bankid = e.currentTarget.dataset.bankid
    var bankname = this.data.bankname
    console.log("题库id：" + bankid)
    console.log("题库名称：" + bankname)
    wx.navigateTo({
      url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
    })
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
    console.log(options.questionid)
    console.log(options.bankname)
    console.log(options.title)
    if (options.title == "收藏") {
      wx.setNavigationBarTitle({
        title: "查看收藏题目"
      })
    }
    if (options.title == "查看") {
      wx.setNavigationBarTitle({
        title: "查看题目"
      })
    }
    this.setData({ questionid: options.questionid, bankname: options.bankname })
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
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
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
      url: app.d.hostUrl + '/choice/info/way/id',
      method: 'get',
      data: {
        id: that.data.questionid
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({ questionlist: res.data.data })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
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
        url: app.d.hostUrl + '/answerSheet/recode',
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


})