var app = getApp()
var interval = "";//周期执行函数的对象
var time = 0;//滑动时间
var touchDot = 0;//触摸时的原点
var flag_hd = true;//判定是否可以滑动

let animationShowHeight = 300;//动画偏移高度

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
    clickcheckid: 0,

    collect_flag: 0,

    // 遮罩层变量
    animationData: "",//动画数据
    showModalStatus: false,//遮罩层显示状态

    // 评分变量
    stars: [0, 1, 2, 3, 4],//评分数值数组
    normalSrc: '../images/score.png',//空心星星图片路径
    selectedSrc: '../images/fullstar.png',//选中星星图片路径
    key: 0,//评分

    isPopping: false,//是否已经弹出  
    animPlus: {},//旋转动画  
  },

  //点击弹出  
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画  
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画  
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
    // wx.navigateTo({
    //   url: '../upload/upload'
    // })
  },

  //弹出动画  
  popp: function () {
    //plus顺时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })

    animationPlus.rotateZ(180).scale(1.2).step();


    this.setData({
      animPlus: animationPlus.export(),
    })
  },
  //收回动画  
  takeback: function () {
    //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })

    animationPlus.rotateZ(0).step();

    this.setData({
      animPlus: animationPlus.export(),

    })
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

  // 显示遮罩层  
  showModal: function () {
    //创建一个动画实例animation。调用实例的方法来描述动画。
    var animation = wx.createAnimation({
      duration: 500,         //动画持续时间500ms
      timingFunction: "ease",//动画以低速开始，然后加快，在结束前变慢
      delay: 0               //动画延迟时间0ms
    })
    this.animation = animation
    //调用动画操作方法后要调用 step() 来表示一组动画完成
    animation.translateY(animationShowHeight).step()// 	在Y轴向上偏移300
    this.setData({
      //通过动画实例的export方法导出动画数据传递给组件的animation属性。
      animationData: animation.export(),
      showModalStatus: true  //显示遮罩层
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },

  // 隐藏遮罩层  
  hideModal: function () {
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
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
      this.nextquestion_click()
      flag_hd = true;    //进入下一题之后，可以再次执行滑动切换页面代码
    }
    // 向右滑动   
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

  //收藏按钮
  collect_click: function () {
    var that = this
    var collect_flag = that.data.collect_flag == 0 ? 1 : 0
    that.setData({
      collect_flag: collect_flag
    });
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

    that.data.allquestion[that.data.index].useranswer = e.currentTarget.dataset.id

    console.log("存入all：" + that.data.allquestion[that.data.index].useranswer)
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

        interval = setInterval(function () {
          console.log("加载中")
          if (res.data.list.length == that.data.allquestion.length) {
            console.log("加载完毕")
            wx.hideLoading()
            clearInterval(interval); // 清除setInterval
          }
        }, 1);
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 1000)
      }
    })

  },

  // 查看答案
  checkanswer_click: function () {
    var that = this
    var istrue = 1
    var answer = that.data.letterid
    that.setData({ condition: 1, clickcheckid: 1 })//用户已答题，不可再点击

    that.data.allquestion[that.data.index].answerstatus = 1    //用户已答题，答题状态设为1
    console.log(that.data.allquestion[that.data.index].answerstatus)

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

      if (that.data.questionlist.useranswer != null) {//用户已选择

        that.setData({ letterid: that.data.questionlist.useranswer })//设置选择的选项

        if (that.data.questionlist.answerstatus == 1) {//用户已答题
          that.setData({ condition: 1, clickcheckid: 1 })//用户已答题，不可再点击

          if (that.data.questionlist.useranswer != that.data.questionlist.answer) {//用户答错了
            that.setData({ letterid: that.data.questionlist.answer, errorid: that.data.questionlist.useranswer })
          }
         
        }

      }
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

      if (that.data.questionlist.useranswer != null) {//用户已选择

        that.setData({ letterid: that.data.questionlist.useranswer })//设置选择的选项

        if (that.data.questionlist.answerstatus == 1) {//用户已答题
          that.setData({ condition: 1, clickcheckid: 1 })//用户已答题，不可再点击

          if (that.data.questionlist.useranswer != that.data.questionlist.answer) {//用户答错了
            that.setData({ letterid: that.data.questionlist.answer, errorid: that.data.questionlist.useranswer })
          }

        }
        
      }
    }
  },




})