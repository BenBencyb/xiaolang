var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banktypename: "5",
    banklist: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      banktypename: options.typename
    })
    console.log("当前选择的类别：" + that.data.banktypename)
    that.getbanklist_by_type()
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
    var that = this
    var b1 = [];
    console.log("触底")
    that.setData({ page: that.data.page + 1 }, () => {
      console.log('页数增加1')
    })
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/way/type',
      method: 'get',
      data: {
        name: that.data.banktypename,
        page: that.data.page,
        size: 8
      },
      success: function (res) {
        console.log("新申请的题库数据：")
        console.log(res.data.data.rows)
        console.log("总页数" + res.data.data.pages)

        if (that.data.page <= res.data.data.pages) {//当前页数小于等于总页数
          b1 = res.data.data.rows//给b1赋值新申请的数据
          console.log("b1：")
          console.log(b1)
          that.setData({ banklist: that.data.banklist.concat(b1) }, () => {
            console.log("本地题库增加成功")
          })
        }
        else {
          that.setData({ page: res.data.data.pages }, () => {
            console.log('没有新数据')
          })
        }

        wx.stopPullDownRefresh()

      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //根据类别查题库
  getbanklist_by_type: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据类别查题库" + app.d.hostUrl)
    console.log(that.data.banktypename)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/way/type',
      method: 'get',
      data: {
        name: that.data.banktypename,
        page: 1,
        size: 8
      },
      success: function (res) {
        console.log("某个类别的题库数据：")
        console.log(res.data.data.rows)
        that.setData({ banklist: res.data.data.rows })
        console.log("本地banklist：")
        console.log(that.data.banklist)
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    })
  },

  //查询是否已经购买该题库
  checkbuystatus: function (e) {
    var that = this
    var value = e.currentTarget.dataset.value
    var bankid = e.currentTarget.dataset.text
    var count = e.currentTarget.dataset.count

    if (count == 0) {
      wx.showToast({
        title: '该题库暂无题目',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      console.log("需要积分：" + value)
      if (value == 0) {
        that.gotrain(e)
      }
      else {
        wx.request({
          url: app.d.hostUrl + '/buy/info',
          method: 'get',
          data: {
            userId: app.appData.userinfo.username,
            bankId: bankid
          },
          complete: function (res) {
            console.log(res)
            if (res.data.code == 14000) {
              console.log("查询不到购买记录")
              that.buybank(e)
            }
            if (res.data.code == 0) {
              console.log("已经购买")
              that.gotrain(e)
            }
            if (res.data.code == 2005) {
              console.log("该题库是自己的")
              that.gotrain(e)
            }

          }
        })
      }
    }
    
  },

  // 购买题库
  buybank: function (e) {
    var that = this
    var value = e.currentTarget.dataset.value
    var bankid = e.currentTarget.dataset.text
    console.log(value)
    console.log(bankid)
    wx.showModal({
      title: '提示',
      content: '购买该题库需要' + value + "积分，是否购买？",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.d.hostUrl + '/buy/info',
            method: 'post',
            data: {
              user: app.appData.userinfo.username,
              bank: bankid
            },
            complete: function (res) {
              console.log(res)
              if (res.data.code == 0) {
                console.log("购买成功")
                that.gotrain(e)
              }
              if (res.data.code == 8003) {
                console.log("用户积分不够")
                wx.showToast({
                  title: '你的积分不足',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    })


  },

  // 做题
  gotrain: function (e) {
    var bankid = e.currentTarget.dataset.text
    var bankname = e.currentTarget.dataset.title
    console.log("题库id：" + bankid)
    console.log("题库名称：" + bankname)
    wx.navigateTo({
      url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
    })

  }


})