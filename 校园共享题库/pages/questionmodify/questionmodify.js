var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: 1,
    questionid: 0,
    questionlist: [],
    answerarray: ['A', 'B', 'C', 'D'],
    index: 0,
    bankindex: 0,
    questionbank_id: '',
    answer: 'A',
    question: '',
    choice_A: '',
    choice_B: '',
    choice_C: '',
    choice_D: '',
    analysis: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ questionid: options.id })
    this.getquestion()
    this.getbank()
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

  question_Input: function (event) {
    this.setData({ question: event.detail.value })
  },

  choiceA_Input: function (event) {
    this.setData({ choice_A: event.detail.value })
  },

  choiceB_Input: function (event) {
    this.setData({ choice_B: event.detail.value })
  },

  choiceC_Input: function (event) {
    this.setData({ choice_C: event.detail.value })
  },

  choiceD_Input: function (event) {
    this.setData({ choice_D: event.detail.value })
  },

  analysis_Input: function (event) {
    this.setData({ analysis: event.detail.value })
  },

  // 答案选择器改变内容
  bindPickerChange: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.setData({
      answer: this.data.answerarray[this.data.index]
    })
  },

  // 所属题库选择器改变内容
  bindPickerChange_bank: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bankindex: e.detail.value
    })
    console.log(this.data.banklist[this.data.bankindex])
    this.setData({
      questionbank_id: this.data.banklist[this.data.bankindex].id
    })
  },

  //根据题目id查看题目详情
  getquestion: function () {
    var that = this
    console.log("查看题目详情" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/choice/info/way/id',
      method: 'get',
      data: {
        id: that.data.questionid
      },
      complete: function (res) {
        console.log(res.data.data)
        that.setData({
          questionlist: res.data.data,
          question: res.data.data.question,
          choice_A: res.data.data.choiceA,
          choice_B: res.data.data.choiceB,
          choice_C: res.data.data.choiceC,
          choice_D: res.data.data.choiceD,
          answer: res.data.data.answer,
          analysis: res.data.data.analysis
        })
        if(res.data.data.answer=='A')
        {
          that.setData({index:0})
        }
        if (res.data.data.answer == 'B') {
          that.setData({ index: 1 })
        }
        if (res.data.data.answer == 'C') {
          that.setData({ index: 2 })
        }
        if (res.data.data.answer == 'D') {
          that.setData({ index: 3 })
        }
      }
    })
  },

  //根据上传用户的id查询所属题库
  getbank: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据上传用户的id查询所属题库：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/way/user',
      method: 'get',
      data: {
        id: app.appData.userinfo.username,
        page: 1,
        size: that.data.max
      },
      success: function (res) {
        console.log(res.data.data.total)

        if (res.data.data.total > that.data.max){
          that.setData({
            max: res.data.data.total
          })
          that.getbank()
        }
        else{
          that.setData({
            banklist: res.data.data.rows,
          },()=>{
            that.setData({
              questionbank_id: that.data.banklist[0].id
            })
            for (var i = 0; i < that.data.banklist.length; i++) {
              console.log("进入循环")
              if (that.data.banklist[i].id == that.data.questionlist.bankId) {
                console.log("找到相同type")
                that.setData({ bankindex: i, questionbank_id: that.data.banklist[i].id })
              }
            }
          })
        }
          
      },
      complete: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //修改题目
  uploadclick: function () {
    var that = this
    if (that.data.question == '' || that.data.choice_A == '' || that.data.choice_B == '' || that.data.choice_C == '' || that.data.choice_D == '') {
      wx.showModal({
        confirmColor: "#55C5AC",
        title: '提示',
        content: '题目或选项不能为空',
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })

    }
    else {
      wx.showLoading({
        title: '',
      })
      console.log("修改题目：" + app.d.hostUrl)
      console.log(app.appData.userinfo.username)
      wx.request({
        url: app.d.hostUrl + '/choice/info',
        
        method: 'put',
        data: {
          id: that.data.questionid,
          question: that.data.question,
          choiceA: that.data.choice_A,
          choiceB: that.data.choice_B,
          choiceC: that.data.choice_C,
          choiceD: that.data.choice_D,
          answer: that.data.answer,
          analysis: that.data.analysis,
          bankId: that.data.questionbank_id
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
  }


})