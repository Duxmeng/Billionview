// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userfo:[],
    URL:''
  },
  //点击广告管理跳转页面
  manage:function(){
    wx.navigateTo({
      url: '/pages/mine/advertising_supervision/advertising_supervision'
    })
  },
  //点击我的钱包跳转页面
  mywallet:function(){
    wx.navigateTo({
      url: '/pages/mine/Mywallet/Mywallet'
    })
  },//点击跳转修改资料页
  mydata:function(){
    wx.navigateTo({
      url: '/pages/mine/data/data',
    })
  },
  click:function(){
    wx.navigateTo({
      url: '/pages/mine/data/data',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var URL = app.globalData.URL;
    that.setData({
      URL: URL
    })
    var openid = wx.getStorageSync('openid');
    // 显示加载图标
    wx.showLoading()
    //console.log(openid)
    //获取用户信息
    wx.request({
      url: URL + '/api.php?m=my.detail',
      data: {openid: openid},
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        wx.hideLoading();
        if(res.data.errno==0){
          that.setData({
            userfo:res.data.rst
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  video:function(){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)

        that.setData({
          src:res.tempFilePath
        })
      }
    })
  }
})