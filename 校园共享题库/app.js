//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    // this.getusermess();
    that.getopenid();
    // setTimeout(function () {

    // }, 5000)
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    //this.search_user();
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },

  appData: {
    userinfo: { userimg: null, nickName: null, username: null }, //用户id、昵称、头像
    userInfo: {},//用户头像
    openid: null,//用户微信id
    winHeight: 0//首页高度
  },

  d: {
    hostUrl: 'http://localhost:8080/'

    // hostUrl: 'https://sib.myzqu.cn'
  },


  // getusermess: function () {
  //   var that = this
  //   wx.getUserInfo({
  //     success: res => {
  //       // 可以将 res 发送给后台解码出 unionId
  //       console.log("app.js获取用户微信基本信息：")
  //       console.log(res.userInfo)
  //       that.appData.userInfo = res.userInfo
  //     },
  //     fail: function (res) {
  //       console.log(res)
  //       //that.getusermess()
  //     }
  //   })
  // },


  //获取微信openid
  getopenid: function () {
    //获取临时登录凭证
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.d.hostUrl + '/wechat/openid',
            data: {
              code: res.code
            },
            complete: function (res) {
              that.appData.openid = res.data.data.openid
              console.log("获得openid：" + that.appData.openid)
              that.search_user();

            }
          })
        } else {
          console.log('获取code失败！' + res.errMsg)
        }
      }
    });
  },


  //根据微信id查询用户
  search_user: function () {
    var that = this
    console.log("根据微信id查询用户是否注册" + that.d.hostUrl)
    wx.request({
      url: that.d.hostUrl + '/user/info/wxid',
      method: 'get',
      data: {
        wxid: that.appData.openid
      },
      complete: function (res) {
        console.log("根据微信id查询用户成功：")
        console.log(res.data)
        if (res.data.code == 0) {
          console.log("该微信用户已注册")
          //将用户id和昵称存在app
          that.appData.userinfo = {
            username: res.data.data.id, nickName: res.data.data.nickname,
            userimg: res.data.data.icon
          }
          console.log("当前登录用户：" + that.appData.userinfo.username)
          console.log("当前登录用户昵称：" + that.appData.userinfo.nickName)
          console.log("当前登录用户头像：" + that.appData.userinfo.userimg)
        }
        else{
          console.log("该微信用户没有注册")
          wx.redirectTo({
            url: '../request/request',
          })
        }

      }
    })

  },


//注册
register: function () {
  var that = this
  console.log("根据微信id查询用户是否注册" + that.d.hostUrl)
  wx.request({
    url: that.d.hostUrl + '/user/info/wxid',
    method: 'get',
    data: {
      wxid: that.appData.openid
    },
    complete: function (res) {
      console.log("注册成功：")
      console.log(res)
      // if (res.data.code == 0) {
      //   console.log("该微信用户已注册")
      //   //将用户id和昵称存在app
      //   that.appData.userinfo = {
      //     username: res.data.data.id, nickname: res.data.data.nickname
      //   }
      //   console.log("当前登录用户：" + that.appData.userinfo.username)
      //   console.log("当前登录用户昵称：" + that.appData.userinfo.nickname)
      // }
      // else {
      //   console.log("该微信用户没有注册")
      // }

    }
  })
}


})
