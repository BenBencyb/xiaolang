var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banklist: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    

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
    this.getbank()
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
      this.getbank()
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

  //根据上传用户的id查询所属题库
  getbank: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据上传用户的id查询所属题库：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/selectById.action',
      method: 'get',
      data: {
        value: app.appData.userinfo.username
      },
      success: function (res) {
        console.log(res.data.list)
        that.setData({
          banklist: res.data.list
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
      }
    })

  },

  //修改信息
  bankmodify_click: function (e) {
    var bankintro = e.currentTarget.dataset.intro
    var banktitle = e.currentTarget.dataset.title
    var banktype = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../bankmodify/bankmodify?bankintro=' + bankintro + '&banktitle=' + banktitle + '&banktype=' + banktype + '&id=' + id
    })
  },

  //管理题目
  questionmanage_click: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../questionmanage/questionmanage?id=' + id
    })
  },

  //删除
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
          var bankid = e.currentTarget.dataset.id

          console.log("删除：" + app.d.hostUrl)
          console.log(app.appData.userinfo.username)
          wx.request({
            url: app.d.hostUrl + '/user_bankQuestion/deleteByPrimaryKey.action',
            method: 'get',
            data: {
              id: bankid
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
                that.getbank()
              }, 800)

            }
          })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })





  },




})