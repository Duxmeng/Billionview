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

  },//提现
  pay:function(){
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var uuid = wx.getStorageSync('uuid');
    var money= that.data.valuenull;
    if (money == '' || money == 0) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      wx.request({
        url: URL + '/api.php?m=account.balanceWithdraw',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          uuid: uuid,
          memberid: memberid,
          money: money
        },
        success: function (res) {
          console.log(res.data);
          if(res.data.errno==0){
            var sysSn = res.data.rst.sysSn;
            console.log(sysSn);
            wx.request({
              url: URL + '/api.php?m=account.wxpayToAccount',
              data: {
                memberid: memberid,
                uuid:uuid,
                sysSn:sysSn
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                console.log(res)
                if(res.data.errno==0){

                }
                if (res.data.errno == 1) {
                  wx.showToast({
                    title: '请联系管理员',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -200) {
                  wx.showToast({
                    title: '请跟管理员联系',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -300) {
                  wx.showToast({
                    title: '订单异常',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -400) {
                  wx.showToast({
                    title: '收款账号异常',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -500) {
                  wx.showToast({
                    title: '订单状态异常',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -600) {
                  wx.showToast({
                    title: '提现金额不符',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -700) {
                  wx.showToast({
                    title: '用户余额不足',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == -999) {
                  wx.showToast({
                    title: '用户余额账户异常',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
          if (res.data.errno == -3){
            wx.showToast({
              title: '余额不足',
              icon:'none',
              duration:2000
            })
          }
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