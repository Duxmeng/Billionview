// pages/mine/Mywallet/Mywallet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infor:[]
  },
  //点击明细跳转页面
  wadetailed:function(){
    wx.navigateTo({
      url: '/pages/mine/Mywallet/mwdetailed/mwdetailed'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 显示加载图标
    wx.showLoading();
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    //获取个人账户信息
    wx.request({
      url: URL + '/api.php?m=get.all_detail',
      data: {
        memberid: memberid,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.errno == 0) {
          that.setData({
            infor:res.data.rst
          })
        }
      }
    })
  },//充值
  pay:function(){
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },//提现
  manage:function(){
    wx.navigateTo({
      url: '/pages/mine/cashWithdrawal/cashWithdrawal',
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
    wx.switchTab({
      url: '/pages/mine/mine'
    })
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

  }
})