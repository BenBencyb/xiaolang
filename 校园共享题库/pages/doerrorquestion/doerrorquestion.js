var app = getApp()

var time = 0;//滑动持续时间
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;//判断是否可以滑动

let animationShowHeight = 300;

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

    // 遮罩层变量
    animationData: "",
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,

    // 评分变量
    stars: [0, 1, 2, 3, 4],//评分数值数组
    normalSrc: '../images/score.png',//空心星星图片路径
    selectedSrc: '../images/fullstar.png',//选中星星图片路径
    key: 0,//评分
  },

  //点击星星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },

  // 确定评分
  mark_click: function () {
    this.hideModal()
  },

  imageLoad: function (e) {
    this.setData({ imageHeight: e.detail.height, imageWidth: e.detail.width });
  },

  showModal: function () {
    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 5)
  },

  hideModal: function () {
    // 隐藏遮罩层  
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  // 触摸开始事件
  touchStart: function (e) {
    console.log("滑动事件");
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {//不断执行time累加，0.1秒+1
      time++;
    }, 100);
  },

  // 触摸结束事件
  touchEnd: function (e) {
    console.log("滑动事件");
    var touchMove = e.changedTouches[0].pageX;
    // 如果手指向左滑动距离超过40、时间少于1秒而且允许滑动标志为true，向右滑动   
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
      this.nextquestion_click()
      flag_hd = true;    //进入下一题之后，可以再次执行滑动切换页面代码
    }
    // 如果手指向右滑动距离超过40、时间少于1秒而且允许滑动标志为true，向左滑动
    if (touchMove - touchDot >= 40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向左滑动");
      this.lastquestion_click()
      flag_hd = true;    //进入上一题之后，可以再次执行滑动切换页面代码 
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  //分享按钮
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '小狼题库',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

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
    this.setData({ questionid: options.id, bankname: options.bankname })
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
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
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
  },

  //请求错题记录
  get_error_question: function () {
    var that = this
    console.log("请求错题记录" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/answerSheet/list/' + app.appData.userinfo.username + '/fault',
      method: 'get',

      complete: function (res) {
        console.log(res.data.data)
        that.setData({ errorquestionlist: res.data.data })
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
    else {
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
    else {
      that.setData({ index: that.data.index - 1 + 2 })
      console.log("下一题id:" + that.data.errorquestionlist[that.data.index].questionId)
      that.setData({ questionid: that.data.errorquestionlist[that.data.index].questionId })

      that.getquestion()

      that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
    }
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


})