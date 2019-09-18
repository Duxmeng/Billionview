// pages/recharge/recharge.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valuenull:0
  },
  //实时监控input的值
  watchPassWord: function (event){
    //console.log(event.detail.value)
    // if (event.detail.value != ''){
    //   this.setData({
    //     valuenull: 1
    //   });
    // }else{
    //   this.setData({
    //     valuenull: 0
    //   });
    // }
    this.setData({
      valuenull: event.detail.value
    })
  },
  //点击图片清除金额
  clearnum:function(e){
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },//充值
  pay:function(){
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var uuid = wx.getStorageSync('uuid');
    var openid = wx.getStorageSync('openid');
    var total_fee= that.data.valuenull;
    console.log(total_fee)
    if (total_fee == '' || total_fee == 0){
      wx.showToast({
        title: '请输入金额',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }else{
      wx.request({
        url: URL + '/api.php?m=wxxcxpay.wxxcx',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          openid: openid,
          total_fee: total_fee,
          body: '测试',
          uuid: uuid,
          memberid: memberid
        },
        success: function (res) {
          console.log(res.data);
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log(res);
              // wx.showToast({
              //   title: '支付成功',
              //   icon: 'success',
              //   duration: 3000
              // });

              wx.redirectTo({
                url: '/pages/mine/Mywallet/Mywallet'
              })
            },
            'fail': function (res) {
              console.log(res)
              wx.showToast({
                title: '充值失败',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            },
            'complete': function (res) {
              // wx.showToast({
              //   title: 'aaa',
              //   icon: 'none',
              //   duration: 1000,
              //   mask: true
              // })
            }
          });
        },
        fail: function (res) {
          console.log(res.data)
        }
      }); 
    }
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

  }
})