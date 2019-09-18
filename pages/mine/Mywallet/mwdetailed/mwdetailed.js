// pages/mine/Mywallet/mwdetailed/mwdetailed.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0,
    scrollLeft: 0,
    nav: [
      { name: '充值明细' },
      { name: '收入明细' },
      { name: '支出明细' },
      { name: '提现明细' },
    ],
    list: [],
    refreshing: false,//是否在刷新
    page: 1,
    empty:0,
    type: 1,
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    // 显示加载图标
    wx.showLoading();
    this.setData({
      currentTab: e.detail.current
    });
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var page = that.data.page;
    var type = parseInt(e.detail.current) + 1;
    wx.request({
      url: URL + '/api.php?m=get.detail',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 7,
        type: type
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.errno == 0) {
          that.setData({
            list: res.data.rst,
            empty: 1,
            type: type
          })
        }
        if(res.data.rst.length == 0){
          that.setData({
            empty: 0
          })
        }
      }
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    // 显示加载图标
    wx.showLoading();
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var page = that.data.page;
    var type = parseInt(e.target.dataset.current) + 1;
    wx.request({
      url: URL + '/api.php?m=get.detail',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 10,
        type: type
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            list: res.data.rst,
            empty: 1,
            type: type
          })
          wx.hideLoading();
        } 
        if (res.data.rst.length == 0) {
          that.setData({
            empty: 0
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 105;
        that.setData({
          winHeight: calc,
        });
      }
    });
    wx.showLoading();
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var page = that.data.page;
    var type = that.data.type;
    //获取明细信息
    wx.request({
      url: URL + '/api.php?m=get.detail',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 10,
        type:type
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            list:res.data.rst,
            empty:1
          })
          wx.hideLoading();
        }
        if (res.data.rst.length == 0) {
          that.setData({
            empty: 0
          })
        }
      }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
   
  /*** 下拉动作*/
  upper: function () {
    wx.showLoading();
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var type = that.data.type;
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    wx.request({
      url: URL + '/api.php?m=get.detail',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 7,
        type: type
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.rst)
        if(res.data.errno==0){
          // 隐藏导航栏加载框
          wx.hideLoading();
          that.setData({
            list: res.data.rst,
            refreshing: false,
            pagesize: 7,
          })
          wx.showToast({
            title: '已更新到最新数据',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },/*** 上拉加载更多*/
  lower: function () {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var type = that.data.type;
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    wx.showLoading();
    // console.log(that.data.page + 1)
    wx.request({
      url: URL + '/api.php?m=get.detail',
      data: {
        memberid: memberid,
        type: type,
        pagesize: 7,
        page: that.data.page += 1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        // 隐藏导航栏加载框
        wx.hideLoading();
        if (res.data.rst == 0) {
          wx.showToast({
            title: '已加载全部',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        } else {
          that.setData({
            list: that.data.list.concat(res.data.rst),
          })
        }
        that.setData({
          refreshing: false
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})