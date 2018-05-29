var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    banklist: [],
    isPopping: false,//是否已经弹出  
    animPlus: {},//旋转动画  
  },

  //点击弹出  
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画  
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画  
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
    wx.navigateTo({
      url: '../upload/upload'
    })
  },  

  //弹出动画  
  popp: function () {
    //plus顺时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    
    animationPlus.rotateZ(180).step();
    
   
    this.setData({
      animPlus: animationPlus.export(),
    })
  },
  //收回动画  
  takeback: function () {
    //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
   
    animationPlus.rotateZ(0).step();
    
    this.setData({
      animPlus: animationPlus.export(),
     
    })
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
    var that = this
    var b1 = [];
    console.log("触底")
    that.setData({ page: that.data.page + 1 }, () => {
      console.log('页数增加1')
    })
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/way/user',
      method: 'get',
      data: {
        id: app.appData.userinfo.username,
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

  //根据上传用户的id查询所属题库
  getbank: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log("根据上传用户的id查询所属题库：" + app.d.hostUrl)
    console.log(app.appData.userinfo.username)
    wx.request({
      url: app.d.hostUrl + '/questionBank/info/way/user',
      method: 'get',
      data: {
        id: app.appData.userinfo.username,
        page:1,
        size:8
      },
      success: function (res) {
        console.log(res)
        that.setData({
          banklist: res.data.data.rows
        })
        
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
        setTimeout(function () {
          wx.hideLoading()
        }, 400)
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
          console.log("要删除的题库id：" + bankid)

          console.log("删除：" + app.d.hostUrl)
          console.log(app.appData.userinfo.username)
          wx.request({
            url: app.d.hostUrl + '/questionBank/info/' + bankid,
           
            method: 'delete',
           
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