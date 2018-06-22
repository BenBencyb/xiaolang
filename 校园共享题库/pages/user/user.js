
var app = getApp();
var interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: null,
    username: null,
    nickname: null,
    allRecord: null,
    faultRecord: null,
    point: null,
    signstatus: "签到"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.search_no()
    this.search_point()
    this.check_sign_status()
    console.log(app.appData.userinfo.userimg)
    if (app.appData.userinfo.userimg == null) {
      app.appData.userinfo.userimg = "../images/default.png"
    }
    if (!app.appData.userinfo.nickName) {
      app.appData.userinfo.nickName = "注册用户"
    }

    if (app.appData.userinfo != null) {
      this.setData({
        username: app.appData.userinfo.username,
        nickname: app.appData.userinfo.nickName,
        userimg: app.appData.userinfo.userimg
      })
    } else {
      console.log("没有用户名")
      wx.redirectTo({
        url: '../login/login',
      })
    }

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
    this.check_sign_status()
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
    this.search_no()
    this.search_point()
    this.check_sign_status()
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

  // 查询用户 答错的题目数量，总答题数目
  search_no: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("查询用户id：" + app.appData.userinfo.username + "\n网址：" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/answerSheet/count/' + app.appData.userinfo.username,
      method: 'get',
      success: function (res) {
        console.log("查询用户错题总答题数量：")
        //console.log("接收到的数据")
        console.log(res)
        that.setData({ allRecord: res.data.data.all, faultRecord: res.data.data.error })
        console.log("本地数据：")
        console.log("已做题：" + that.data.allRecord)
        console.log("错题：" + that.data.faultRecord)
        wx.stopPullDownRefresh()
        var time = 0;
        interval = setInterval(function () {
          console.log("加载中")
          time = time + 1
          if (that.data.allRecord != null && that.data.faultRecord != null) {
            console.log("加载完毕")
            wx.hideLoading()
            clearInterval(interval); // 清除setInterval
          }
          if (time == 20) {
            clearInterval(interval);// 清除setInterval
            wx.showToast({
              title: '服务器错误',
              icon: 'none',
              duration: 1500
            })
          }
        }, 50);
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 1000)
      }
    })

  },


  // 查询用户积分
  search_point: function () {
    var that = this
    wx.request({
      url: app.d.hostUrl + '/user/points',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'get',
      data: {
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        console.log("查询用户积分：")
        console.log(res)
        that.setData({ point: res.data.data })
        console.log("本地数据：")
        console.log("积分：" + that.data.point)
        wx.stopPullDownRefresh()

      }
    })

  },


  //签到按钮
  signon_click: function () {
    var that = this
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/attendance/sign',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: {
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 4006) {
          console.log("已签到")
          wx.showToast({
            title: '你今天已经签过了',
            icon: 'none',
            duration: 1000
          })
        }
        else if (res.data.code == 0) {
          console.log("签到成功")
          wx.showToast({
            title: '签到成功\n积分+5',
            icon: 'none',
            duration: 1500
          })
          that.setData({ signstatus: "已签到" })
        }
        else {
          wx.showToast({
            title: '发生错误',
            icon: 'none',
            duration: 1500
          })
        }

      }
    })
  },

  // 检查用户是否已签到
  check_sign_status: function () {
    var that = this
    wx.request({
      url: app.d.hostUrl + '/attendance/state',
      method: 'get',
      data: {
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 4008) {
          console.log("用户未签到")
          that.setData({ signstatus: "签到" })
        }
        if (res.data.code == 0) {
          console.log("用户已签到")
          that.setData({ signstatus: "已签到" })
        }

        // console.log("积分：" + that.data.point)
        // wx.stopPullDownRefresh()

      }
    })

  },
  //跳转到题目收藏
  collect_click: function () {
    wx.navigateTo({
      url: '../collect/collect'
    })
  },

  //跳转到做题记录
  history_click: function () {
    wx.navigateTo({
      url: '../trainhistory/trainhistory'
    })
  },

  //跳转到个人资料
  userdata_click: function () {
    wx.navigateTo({
      url: '../userdata/userdata'
    })
  },

  //跳转到题库管理
  bankmanage_click: function () {
    wx.navigateTo({
      url: '../bankmanage/bankmanage'
    })
  },

  //跳转到错题记录
  errorquestion_click: function () {
    wx.navigateTo({
      url: '../errorquestion/errorquestion'
    })
  },

  //跳转到评论管理
  commentmanage_click: function () {
    wx.navigateTo({
      url: '../comment/comment'
    })
  },

  //跳转到积分记录
  point_click: function () {
    wx.navigateTo({
      url: '../point/point'
    })
  },

  //跳转到用户反馈
  checkreport_click: function () {
    wx.navigateTo({
      url: '../checkreport/checkreport'
    })
  },

  //跳转到购买记录
  checkbuy_click: function () {
    wx.navigateTo({
      url: '../checkbuy/checkbuy'
    })
  },

  //跳转到帮助文档
  help_click: function () {
    wx.navigateTo({
      url: '../help/help'
    })
  }
})