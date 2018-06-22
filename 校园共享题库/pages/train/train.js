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
    modeid: 0,
    username: null,
    hiddenName: true,
    reporthidden: true,
    reportmessage: "",
    comment: "",
    commentlist: [],
    comment_page: 1,
    comment_size: 0,
    focus: false,
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

    timeoutflag: 0,//超时标志
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
      this.popp();
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

    animationPlus.rotateZ(144).step();


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

    if (this.data.questionlist.rating == 0) {
      console.log("得" + key + "分")
      this.setData({
        key: key
      })
    }
    else {
      wx.showToast({
        title: '你已经评过了',
        icon: 'none',
        duration: 750
      })
    }
  },

  // 确定评分
  mark_click: function () {
    var that = this

    if (that.data.questionlist.rating == 0 && that.data.key != 0) {
      that.hideModal()
      console.log(that.data.key)
      console.log("用户id：" + app.appData.userinfo.username)
      wx.request({
        url: app.d.hostUrl + '/rating/addRating',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "post",
        data: {
          userId: app.appData.userinfo.username,
          questionId: that.data.questionlist.id,
          bankId: that.data.questionlist.bankId,
          starLevel: that.data.key
        },
        success: function (res) {
          var ratingState = "questionlist.rating";
          var list_ratingState = "allquestion[" + that.data.index + "].rating"
          console.log(res)
          that.setData({
            [ratingState]: that.data.key,
            [list_ratingState]: that.data.key
          });
          wx.showToast({
            title: '评分成功',
            icon: 'success',
            duration: 1000
          })
          console.log('评分成功')
        }
      })
    }
    else if (that.data.key == 0) {
      wx.showToast({
        title: '评分至少为一星',
        icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.questionlist.rating != 0) {
      that.hideModal()
    }

  },

  // 显示遮罩层  
  showModal: function () {
    this.setData({
      key: this.data.questionlist.rating,
    })
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
    this.takeback();
    this.setData({
      isPopping: true
    })
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
    if (this.data.reporthidden == false) {
      this.setData({
        reporthidden: true
      });
    }
    if (this.data.hiddenName == false) {
      this.setData({
        hiddenName: true
      });
    }
  },

  //收藏按钮
  collect_click: function (e) {
    var that = this
    var method = "post"
    var condition = e.currentTarget.dataset.condition
    if (condition == 0) {
      method = "post"
    }
    if (condition == 1) {
      method = "delete"
    }
    wx.request({
      url: app.d.hostUrl + '/favorite/info',
      method: method,
      data: {
        userId: app.appData.userinfo.username,
        questionId: that.data.questionlist.id,
        bankId: that.data.questionlist.bankId,
      },
      success: function (res) {
        var favoriteState = "questionlist.favoriteState";
        var list_favoriteState = "allquestion[" + that.data.index + "].favoriteState"
        if (condition == 0) {
          that.setData({
            [favoriteState]: "已收藏",
            [list_favoriteState]: "已收藏"
          });
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1000
          })
          console.log('收藏成功')
        }
        else {
          that.setData({
            [favoriteState]: "未收藏",
            [list_favoriteState]: "未收藏"
          });
          wx.showToast({
            title: '取消收藏成功',
            icon: 'success',
            duration: 1000
          })
          console.log('取消收藏成功')
        }

      }
    })



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

  //选择答案时改变颜色
  changeColor: function (e) {
    // console.log(e)
    var that = this
    if (that.data.condition == 0 && that.data.modeid == 0) {
      that.setData({
        letterid: e.currentTarget.dataset.id
      });
      console.log(that.data.letterid)
      that.data.allquestion[that.data.index].useranswer = e.currentTarget.dataset.id
      console.log("存入all：" + that.data.allquestion[that.data.index].useranswer)
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.bankid)
    console.log(options.bankname)
    this.setData({
      bankid: options.bankid,
      bankname: options.bankname,
      username: app.appData.userinfo.username
    })
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
    var that = this
    if (that.data.clickcheckid == 1) {
      console.log('触底')


      var b1 = []
      var page = 1

      that.setData({ comment_page: that.data.comment_page + 1 }, () => {
        console.log('页数增加到' + that.data.comment_page)

      })
      page = that.data.comment_page
      wx.request({
        url: app.d.hostUrl + '/comment/getComment',
        method: 'get',
        data: {
          questionId: that.data.questionlist.id,
          page: page,
          size: 10
        },
        success: function (res) {
          console.log("新申请的评论数据：")
          console.log(res)
          //console.log("总页数" + res.data.data.pages)
          if (res.data.code == 0) {
            if (that.data.comment_page <= res.data.data.pages) {//当前页数小于等于总页数
              b1 = res.data.data.rows//给b1赋值新申请的数据
              console.log("b1：")
              console.log(b1)
              that.setData({ commentlist: that.data.commentlist.concat(b1) }, () => {
                wx.hideLoading()
                console.log("本地评论增加成功")
              })
            }
            else {
              that.setData({ comment_page: res.data.data.pages }, () => {
                wx.hideLoading()
                console.log('没有新评论')
                wx.showToast({
                  title: '没有更多评论了~',
                  icon: 'none',
                  duration: 1000
                })
              })
            }
          }


        }
      })
    }

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
    console.log(app.appData.userinfo.username)
    console.log(that.data.bankid)
    console.log("查询题目信息" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/choice/info/way/bank',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username,
        id: that.data.bankid
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({ questionlist: res.data.data[0], allquestion: res.data.data })

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  // 查看答案
  checkanswer_click: function () {
    var that = this
    that.getcomment()//获取评论
    var istrue = 1
    var answer = that.data.letterid
    that.setData({ condition: 1, clickcheckid: 1 })//用户已答题，不可再点击

    that.data.allquestion[that.data.index].answerstatus = 1    //用户已答题，答题状态设为1
    console.log(that.data.allquestion[that.data.index].answerstatus)

    console.log("答案：" + that.data.questionlist.answer)
    console.log("当前选择：" + that.data.letterid)

    if ((that.data.letterid != that.data.questionlist.answer)) {//答案错误
      istrue = 0
      that.setData({
        errorid: that.data.letterid,
      });
    }

    if (that.data.letterid != '') {
      console.log("已选答案")
      //console.log(app.appData.userinfo.username)
      //添加答题记录
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
      that.setData({
        questionlist: that.data.allquestion[that.data.index],
        comment_page: 1
      }, () => {
        that.getcomment()
      })
      if (that.data.modeid == 0) {
        that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
      }
      that.setData({ hiddenName: true })
      that.setData({ focus: false })
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
      that.setData({
        questionlist: that.data.allquestion[that.data.index],
        comment_page: 1
      }, () => {
        that.getcomment()
      })
      if (that.data.modeid == 0) {
        that.setData({ condition: 0, clickcheckid: 0, letterid: '', errorid: '' })
      }
      that.setData({ hiddenName: true })
      that.setData({ focus: false })
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

  //点击评论按钮
  bindButtonTap: function () {
    if (this.data.clickcheckid == 1) {
      if (this.data.hiddenName == true) {
        this.setData({
          hiddenName: !this.data.hiddenName
        }, () => {
          this.setData({
            focus: true
          })
        })
      }
      else {
        this.setData({
          focus: false
        }, () => {
          this.setData({
            hiddenName: !this.data.hiddenName
          })
        })
      }

    }

  },

  // 输入评论内容
  commentInput: function (event) {
    this.setData({ comment: event.detail.value })
  },

  // 获取token
  get_token: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/wechat/token',
      method: 'get',

      success: function (res) {
        console.log(res.data.data.token)
        that.comment_test(res.data.data.token)
      },
      complete: function (res) {
      }
    })
  },

  // 微信文本检测接口
  comment_test: function (token) {
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + token,
      method: 'post',
      data: {
        content: that.data.comment
      },
      success: function (res) {
        console.log(res)
        if (res.data.errcode == 40001) {
          console.log("发生错误")
          
          that.setData({ timeoutflag: that.data.timeoutflag +1 },()=>{
            if (that.data.timeoutflag >= 5) {
              console.log("连接超时")
              wx.showToast({
                title: '连接超时',
                icon: 'none',
                duration: 1500
              })
              that.setData({ timeoutflag: 1 })
            }
            else{
              that.comment_test(token)
            }
          })
          
        }
        if (res.data.errcode == 0) {
          console.log("内容正常")
          that.addcomment()
        }
        if (res.data.errcode == 87014) {
          console.log("内容含有违法违规内容")
          wx.showToast({
            title: '内容含有违法违规内容',
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete: function (res) {

      }
    })
  },

  // 添加评论
  addcomment: function () {
    var that = this

    console.log(app.appData.userinfo.username)
    console.log("添加评论" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/comment/addComment',
      method: 'post',
      data: {
        userId: app.appData.userinfo.username,
        questionId: that.data.questionlist.id,
        bankId: that.data.bankid,
        content: that.data.comment
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({ focus: false, hiddenName: true })
          that.getcomment()
          wx.showToast({
            title: '发表成功',
            icon: 'none',
            duration: 2000
          })

        }
        else {
          wx.showToast({
            title: '发生错误',
            icon: 'none',
            duration: 2000
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
      }
    })

  },

  //获取评论
  getcomment: function () {
    var that = this
    console.log(app.appData.userinfo.username)
    console.log("获取评论" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/comment/getComment',
      method: 'get',
      data: {
        questionId: that.data.questionlist.id,
        page: 1,
        size: 10
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            commentlist: res.data.data.rows,
            comment_size: res.data.data.total
          })

        }
        else {
          that.setData({ commentlist: [], comment_size: 0 })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
      }
    })

  },

  // 删除评论
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
          var id = e.currentTarget.dataset.id
          console.log("要删除的评论id：" + id)
          console.log(app.appData.userinfo.username)
          wx.request({
            url: app.d.hostUrl + '/comment/updateComment',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'put',
            data: {
              id: id
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
                that.getcomment()
              }, 800)

            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  // 改变模式
  changemode: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.modeid)
    if (e.currentTarget.dataset.modeid == 1) {
      that.setData({
        clickcheckid: 1
      });
    }
    else {
      if (!that.data.questionlist.answerstatus)
        that.setData({
          clickcheckid: 0
        });
    }
    that.setData({
      modeid: e.currentTarget.dataset.modeid
    });
    console.log("模式id：" + that.data.modeid)
  },

  // 点击报错按钮
  reporterrors: function () {
    this.setData({
      reporthidden: !this.data.reporthidden
    })
  },

  // 输入报错内容
  report_error_Input: function (event) {
    this.setData({ reportmessage: event.detail.value })
  },

  //确定报错按钮
  report_error_click: function () {
    var that = this
    wx.request({
      url: app.d.hostUrl + '/message/addMessage',
      method: 'post',
      data: {
        questionId: that.data.questionlist.id,
        bankId: that.data.questionlist.bankId,
        sender: app.appData.userinfo.username,
        message: that.data.reportmessage
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
          })
          that.setData({
            reporthidden: !that.data.reporthidden
          })
        }
        else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1500,
          })
        }
      }
    })
  }

})