var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemHeight: 0,//系统窗口高度
    winHeight: 0,//首页页面高度
    // tab切换  
    currentTab: 0,// 切换页面
    searchValue: '',//搜索内容
    banklist: [],//精选题库数据
    banklist_page: 1,//精选题库页数
    hotbanklist: [],//热门题库数据
    hotbanklist_page: 1,//热门题库页数
    banktype: [],//题库分类数据
    index: 0,
    alltypelist: [],//一级类别
    typelist: {},//二级类别
    typeindex: 0//当前一级类别序号
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
        console.log(res)
        console.log("系统窗口高度" + res.windowHeight)
        that.setData({
          SystemHeight: res.windowHeight
        });

      }
    });

  },

  // 切换页面
  bindChange: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var that = this;
    console.log(e.detail.current)
    that.setData({ currentTab: e.detail.current });

    var select = e.detail.current
    if (select == 0) {
      if (that.data.banklist_page == 1){
        that.getbanklist();
      }
      that.setheight()   
    }
    if (select == 1) {
      if (that.data.hotbanklist_page == 1) {
        that.getbanklist_hot();
      }
      that.setheight() 
    }
    if (select == 2) {
      that.getbanktype();
    }
    
  },

  // 改变标签头
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
    var that = this
    var b1 = []
    var condition = "star_level"
    var page = 1
    console.log("触底")
    if (that.data.currentTab == 0) {//当前为精选页面
      that.setData({ banklist_page: that.data.banklist_page + 1 }, () => {
        console.log('页数增加1')
      })
      condition = "star_level"
      page = that.data.banklist_page
    }
    if (that.data.currentTab == 1) {//当前为热门页面
      that.setData({ hotbanklist_page: that.data.hotbanklist_page + 1 }, () => {
        console.log('页数增加1')
      })
      condition = "frequency"
      page = that.data.hotbanklist_page
    }

    wx.request({
      url: app.d.hostUrl + '/questionBank/info/sort',
      method: 'get',
      data: {
        condition: condition,
        page: page,
        size: 8
      },
      success: function (res) {
        console.log("新申请的题库数据：")
        console.log(res.data.data.rows)
        console.log("总页数" + res.data.data.pages)

        if (that.data.currentTab == 0) {//当前为精选页面
          if (that.data.banklist_page <= res.data.data.pages) {//当前页数小于等于总页数
            b1 = res.data.data.rows//给b1赋值新申请的数据
            console.log("b1：")
            console.log(b1)
            that.setData({ banklist: that.data.banklist.concat(b1) }, () => {
              console.log("本地精选题库增加成功")
              that.setheight()
            })
          }
          else {
            that.setData({ banklist_page: res.data.data.pages }, () => {
              console.log('精选题库没有新数据')
            })
          }
        }

        if (that.data.currentTab == 1) {//当前为热门页面
          if (that.data.hotbanklist_page <= res.data.data.pages) {//当前页数小于等于总页数
            b1 = res.data.data.rows//给b1赋值新申请的数据
            console.log("b1：")
            console.log(b1)
            that.setData({ hotbanklist: that.data.hotbanklist.concat(b1) }, () => {
              console.log("本地热门题库增加成功")
              that.setheight()
            })
          }
          else {
            that.setData({ hotbanklist_page: res.data.data.pages }, () => {
              console.log('热门题库没有新数据')
            })
          }
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

  // 请求全部题库数据
  getbanklist: function () {
    var that = this
    console.log("请求第一页精选题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/sort',
      method: 'get',
      data: {
        condition: "star_level",
        page: 1,
        size: 8
      },
      success: function (res) {
        console.log("题库数据：")
        console.log(res.data.data.rows)
        that.setData({ banklist: res.data.data.rows })
        console.log("本地banklist：")
        console.log(that.data.banklist)
        var time = 0
        var int = setInterval(function () {
          time = time + 1
          console.log("循环执行..")
          if (app.appData.winHeight != 0) clearInterval(int)
          that.setheight()

          if (time == 100) {
            clearInterval(int);// 清除setInterval
            wx.showToast({
              title: '请求超时',
              icon: 'none',
              duration: 1500
            })
          }
        }, 50) //循环时间 

        wx.stopPullDownRefresh()
      }
    })
  },

  //请求热门题库
  getbanklist_hot: function () {
    var that = this
    console.log("请求第一页热门题库数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/sort',
      method: 'get',
      data: {
        condition: "frequency",
        page: 1,
        size: 8
      },
      complete: function (res) {
        console.log("热门题库数据：")
        console.log(res.data.data.rows)
        that.setData({ hotbanklist: res.data.data.rows })
        console.log("本地hotbanklist：")
        console.log(that.data.hotbanklist)

        var int = setInterval(function () {
          console.log("外循环执行..")
          that.setheight()
          if (app.appData.winHeight > that.data.SystemHeight) clearInterval(int)
        }, 10) //循环时间 

        wx.stopPullDownRefresh()
      }
    })

  },

  //查看类别
  getbanktype: function () {
    var that = this
    console.log("请求题库类别数据" + app.d.hostUrl)
    wx.request({
      url: app.d.hostUrl + '/category/list',
      method: 'get',

      complete: function (res) {
        console.log("题库类别数据：")
        console.log(res.data.data[0].lowerCategories)
        that.setData({ alltypelist: res.data.data[0].lowerCategories })
        that.setData({
          typelist: that.data.alltypelist[0]
        });
        console.log("本地alltypelist：")
        console.log(that.data.alltypelist)
        //设置高度
        that.setData({
          winHeight: that.data.SystemHeight
        });

        wx.stopPullDownRefresh()
      }
    })

  },

  //改变一级类别
  changetype: function (e) {
    var typeid = e.currentTarget.dataset.id
    console.log(typeid)
    this.setData({
      typelist: this.data.alltypelist[typeid],
      typeindex: typeid
    });
  },

  // 按类别查找
  searchtype: function (e) {
    var typename = e.currentTarget.dataset.text

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
    else {
      var bankid = e.currentTarget.dataset.text
      var bankname = e.currentTarget.dataset.title
      console.log("题库id：" + bankid)
      console.log("题库名称：" + bankname)
      wx.navigateTo({
        url: '../train/train?bankid=' + bankid + '&bankname=' + bankname
      })
    }
  },

  //设置显示题库部分的高度
  setheight: function () {
    //创建节点选择器  
    var that = this
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#search_view').boundingClientRect()
    query.select('#tab_view').boundingClientRect()
    query.select('#bankview').boundingClientRect()
    query.select('#view11').boundingClientRect()
    query.exec(function (res) {
      // console.log(res);
      //取高度
      if (res[2]){

        console.log("搜索框高度：" + res[0].height + "px");
        console.log("tab标签高度：" + res[1].height + "px");
        console.log("单个题库高度：" + res[2].height + "px");
        console.log("阴影高度：" + res[3].height + "px");

        if (that.data.currentTab == 0) {//切换到精选页面
          console.log(res[0].height + res[1].height + res[3].height + res[2].height * that.data.banklist.length + 30)
          app.appData.winHeight = res[0].height + res[1].height + res[3].height + res[2].height * that.data.banklist.length + 30
        }
        if (that.data.currentTab == 1) {//切换到热门页面
          console.log(res[0].height + res[1].height + res[3].height + res[2].height * that.data.hotbanklist.length + 30)
          app.appData.winHeight = res[0].height + res[1].height + res[3].height + res[2].height * that.data.hotbanklist.length + 30
        }
        if (that.data.currentTab == 2) {//切换到分类页面
          console.log(that.data.SystemHeight)
          app.appData.winHeight = that.data.SystemHeight
        }
      }

      that.setData({
        winHeight: app.appData.winHeight
      }, () => {
        console.log('本地高度设置为app的winheight')
        console.log("现在app的winheight：" + app.appData.winHeight)
        console.log("现在winheight：" + that.data.winHeight)
        that.setData({
          winHeight: app.appData.winHeight
        })
      });
      
    })

    


  }

})