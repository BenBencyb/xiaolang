var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionlist: []
  },

  //根据用户id查询评论
  getcomment: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据用户id查询评论" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/comment/getUserComment',

      method: 'get',
      data: {
        userId: app.appData.userinfo.username
      },
      success: function (res) {
        console.log(res)
        if(res.data.data)
        that.setData({
          questionlist: res.data.data.rows
        })

      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //查看题目
  look_click: function (e) {
    var id = e.currentTarget.dataset.id
    var bankname = e.currentTarget.dataset.name
    var title = "查看"
    wx.navigateTo({
      url: '../lookhistoryquestion/lookhistoryquestion?questionid=' + id + "&bankname=" + bankname + "&title=" + title
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

  // 获取token
  get_token: function (options) {
    var that = this
    wx.request({
      url: app.d.hostUrl + '/wechat/token',
      method: 'get',

      success: function (res) {
        console.log(res.data.data.token)
        that.comment_test(res.data.data.token)
        // that.setData({
        //   questionlist: res.data.data.rows
        // })

      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    })
  },

  // 微信文本检测接口
  comment_test: function (token) {
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + token,
      method: 'post',
      data: {
        content: "呵呵"
      },
      success: function (res) {
        console.log(res)
        if(res.data.errcode==0){
          console.log("内容正常")
        }
        if (res.data.errcode == 87014) {
          console.log("内容含有违法违规内容")
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
    this.getcomment()
    this.get_token()
    // this.comment_test()
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

  }
})