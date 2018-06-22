//index.js
var app = getApp()

var WxSearch = require('../../wxSearchView/wxSearchView.js');

Page({
  data: {
    banklist: [],
    page:1,
    condition:0
  },

  // 搜索栏
  onLoad: function () {
    var that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      [],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 搜索回调函数  
  mySearchFunction: function (value) {
    var that = this
    
    console.log(value)
    that.searchbank(value)

  },

  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    console.log("返回按钮");
    // 跳转
    wx.switchTab({
      url: '../index/index'
    })
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
      url: app.d.hostUrl + '/questionBank/info/way/title',
      method: 'get',
      data: {
        title: that.data.wxSearchData.value,
        page: that.data.page,
        size: 8
      },
      success: function (res) {
        console.log("新申请的题库数据：")
        console.log(res)
        //console.log("总页数" + res.data.data.pages)
        if (res.data.data){
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
        }
        

        wx.stopPullDownRefresh()

      }
    })

  },

  //搜索题库
  searchbank: function (searchvalue) {
    var that = this
    that.setData({ condition: 1 })
    wx.showLoading({
      title: '加载中',
    })
    console.log("搜索题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/way/title',
      method: 'get',
      data: {
        title: searchvalue,
        page:1,
        size:8
      },
      success: function (res) {
        console.log("题库数据：")
        console.log(res)
        if (res.data.data){
          that.setData({ banklist: res.data.data.rows })
          console.log("本地banklist：")
          console.log(that.data.banklist)
        }
        else{
          that.setData({ banklist: [] })
        }
       
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
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
           
          }
        }
      })
    }else{
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