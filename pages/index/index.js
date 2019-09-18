//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nocontent:0,
    imgWidth: 0, 
    imgHeight: 0,
    page:1,
    URL:app.globalData.URL,
    note: []
  },//发布广告
  send:function(){
    wx.navigateTo({
      url: '/pages/advertising/advertising_detail/advertising_detail',
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },//点击进入详情页
  clickDetail:function(e){
    var id = e.currentTarget.dataset.id;
    //console.log(id)
    wx.navigateTo({
      url: `/pages/details/details?id=${id}&&index=${1}`,
    }) 
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 显示加载图标
    wx.showLoading();
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    //获取列表信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: { 
        memberid: memberid,
        page: 1,
        pagesize: 8
       },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        wx.hideLoading();
        if (res.data.errno == 0) {
          that.setData({
            note:res.data.rst,
          })
        }
        if(res.data.rst.length!=0){
          that.setData({
            nocontent: 1
          })        
        }
      }
    })
  },//详情页返回触发事件
  changeData: function () {
    this.onLoad();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    // 显示加载图标
    wx.showNavigationBarLoading();
    //获取列表信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 8
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        if (res.data.errno == 0) {
          wx.showToast({
            title: '已更新到最新内容',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          that.setData({
            note: res.data.rst,
            page:1
          })
        }
        if (res.data.rst.length != 0) {
          that.setData({
            nocontent: 1
          })
        }
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    //console.log(that.data.page)
    // 显示加载图标
    wx.showLoading();
    //获取列表信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        page: that.data.page += 1,
        pagesize:8
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        wx.hideLoading();
        if (res.data.rst == 0) {
          wx.showToast({
            title: '已加载全部',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }else {
          that.setData({
            note: that.data.note.concat(res.data.rst),
          })
        }
        if (res.data.rst.length != 0) {
          that.setData({
            nocontent: 1
          })
        }
      }
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '看广告',
      path: '/pages/login/login',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
