//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    this.getusermess();
    this.getopenid();
    setTimeout(function () {
      
    }, 5000)
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
    userinfo: null,
    userInfo: {},
    openid:null
  },

  d:{
  //hostUrl:'http://localhost:8080/online_test'

  hostUrl: 'https://test.myzqu.cn'
  },


  getusermess: function () {
    var that = this
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        console.log("app.js获取用户微信基本信息：")
        console.log(res.userInfo)  
        that.appData.userInfo = res.userInfo   
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },


  //获取微信openid
  getopenid: function () {
    //获取临时登录凭证
    var that=this
    wx.login({
      success: function (res) {
        if (res.code) {

          //发起网络请求
          wx.request({
            url: that.d.hostUrl + '/wx_app/onLogin.action',
            data: {
              code: res.code
            },
            complete: function (res) {
              that.appData.openid = res.data.openid
              console.log('获得微信openid:' + that.appData.openid)
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
      url: that.d.hostUrl + '/user_user/searchUser.action',
      method: 'post',
      data: {
         wxid:that.appData.openid
      },
      complete: function (res) {
       console.log("search user方法：")
       console.log(res.data)
       if(res.data.status==1){
         console.log("该微信用户已注册")
         that.appData.userinfo = { username: res.data.user.id, password: null }
         console.log("当前登录用户："+that.appData.userinfo.username)
        //  that.search_no();
       }
       
      }
    })

  }

  



})
