var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    userimg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.search_no()
    this.setData({ userimg: app.appData.userInfo.avatarUrl })
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

  // 查询用户功能     用户答错的题目数量，总答题数目
  search_no: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("查询用户" + app.appData.userinfo.username + "信息" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_user/getUser.action',
      method: 'post',
      data: {
        id: app.appData.userinfo.username
      },
      success: function (res) {
        console.log("search_no方法：")
        console.log("接收到的数据")
        console.log(res.data.user)
        that.setData({ user: res.data.user })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })

  },

  //修改资料按钮
  gomodify_click: function () {
    var that=this
    var nickname = that.data.user.nickname
    var email = that.data.user.email
    var phone = that.data.user.phone
    wx.navigateTo({
      url: '../userdatamodify/userdatamodify?nickname=' + nickname + '&email=' + email + '&phone=' + phone
    })
  },

  //修改密码按钮
  changepassword_click:function(){
    wx.navigateTo({
      url: '../changepassword/changepassword'
    })
  }


})