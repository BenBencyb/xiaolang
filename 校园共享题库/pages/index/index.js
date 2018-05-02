var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    searchValue: '',
    userInfo: {},
    banklist: [],
    hotbanklist: [],
    banktype: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanklist();
    // this.getbanklist_hot();
    // this.getbanktype();
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        console.log("设备像素比" + res.pixelRatio)
        that.setData({
          winWidth: res.windowWidth * res.pixelRatio,
          winHeight: res.windowHeight * res.pixelRatio
        });
        
      }
    });

  },

  bindChange: function (e) {

    var that = this;
    console.log(e.detail.current)
    var select = e.detail.current
    if (select == 0) {
      that.getbanklist();

    }
    if (select == 1) {
      that.getbanklist_hot();
    }
    if (select == 2) {
      that.getbanktype();
    }


    that.setData({ currentTab: e.detail.current });

  },

  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  wxSearchTab: function () {
    wx.navigateTo({
      url: '../search/search'
    })
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
    // this.getbanklist();
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

  // 请求全部题库数据
  getbanklist: function () {
    var that = this
   
    console.log("请求全部题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/selectBankQuestion.action',
      method: 'post',
      data: {

      },
      success: function (res) {
        console.log("题库数据：")
        console.log(res.data.data)
        that.setData({ banklist: res.data.data })
        console.log("本地banklist：")
        console.log(that.data.banklist)
      
        console.log(that.data.banklist.length * 185)
        if (that.data.banklist.length * 185>that.data.winHeight)
        {
          that.setData({
            // winHeight: that.data.banklist.length*160
            winHeight: 185 * that.data.banklist.length
          });
        }
        wx.stopPullDownRefresh()
        
      }
    })

  },

  //请求热门题库
  getbanklist_hot: function () {
    var that = this
    console.log("请求热门题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/selectBytime.action',
      method: 'post',
      data: {

      },
      complete: function (res) {
        console.log("热门题库数据：")
        console.log(res.data.list)
        that.setData({ hotbanklist: res.data.list })
        console.log("本地hotbanklist：")
        console.log(that.data.hotbanklist)
        console.log(that.data.banklist.length * 185)
        if (that.data.banklist.length * 185 > that.data.winHeight) {
          that.setData({
            // winHeight: that.data.banklist.length*160
            winHeight: 185 * that.data.banklist.length
          });
        }
        wx.stopPullDownRefresh()
      }
    })

  },

  //选择类别
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //查看类别
  getbanktype: function () {
    var that = this
    console.log("请求题库类别数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankType/selectBankTypeAll.action',
      method: 'post',
      data: {

      },
      complete: function (res) {
        console.log("题库类别数据：")
        console.log(res.data.data)
        that.setData({ banktype: res.data.data })
        console.log("本地banktype：")
        console.log(that.data.banktype)
        console.log("题库数量：")
        console.log(that.data.banktype.length * 80)
        if (that.data.banktype.length * 80 > that.data.winHeight) {
          that.setData({
            // winHeight: that.data.banklist.length*160
            winHeight: 80 * that.data.banktype.length
          });
        }
       
        wx.stopPullDownRefresh()
      }
    })

  },

  // 按类别查找
  searchtype: function (e) {
    // var da = e.detail.value;
    // console.log(e.currentTarget.dataset.text)
    var typename = e.currentTarget.dataset.text
    // console.log(typename)
    // this.setData({
    //   username: qu
    // }),
    wx.navigateTo({
      url: '../searchtype/searchtype?typename=' + typename
    })
  },

  // 做题
  gotrain: function (e) {
    if (app.appData.userinfo == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({
              url: '../login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
    else{
      var bankid = e.currentTarget.dataset.text
      var bankname = e.currentTarget.dataset.title
      console.log("题库id：" + bankid)
      console.log("题库名称：" + bankname)
      wx.navigateTo({
        url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
      })
    }
  }

})