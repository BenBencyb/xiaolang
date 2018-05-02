//index.js
var app = getApp()

var WxSearch = require('../../wxSearchView/wxSearchView.js');

Page({
  data: {
    banklist: []

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
    // do your job here
    // 跳转
    // wx.navigateTo({
    //   url: '../index/index?searchValue=' + value
    // })
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

  //搜索题库
  searchbank: function (searchvalue) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("搜索题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/user_bankQuestion/simpleselectBankQuestion.action',
      method: 'get',
      data: {
        value: searchvalue
      },
      success: function (res) {
        console.log("题库数据：")
        console.log(res.data.data)
        that.setData({ banklist: res.data.data })
        console.log("本地banklist：")
        console.log(that.data.banklist)

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
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