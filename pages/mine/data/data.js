// pages/mine/data/data.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: '',
    avatar:'',
    nickname:'',
    remark:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var URL = app.globalData.URL;
    that.setData({
      URL: URL
    })
    var openid = wx.getStorageSync('openid');
    console.log(openid)
    //获取用户信息
    wx.request({
      url: URL + '/api.php?m=my.detail',
      data: { openid: openid },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.errno == 0) {
          that.setData({
            avatar: res.data.rst.avatar,
            nickname: res.data.rst.nickname,
            remark: res.data.rst.remark
          })
        }
      }
    })
  },//头像上传
  head: function () {
    var URL = app.globalData.URL;
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.setStorageSync('Img', res.tempFilePaths);
        wx.uploadFile({
          url: URL + '/kindeditor/php/uploadApi.php?mode=1',
          filePath: tempFilePaths[0],
          name: 'imgFile',
          header: { "Content-Type": "multipart/form-data" },
          success: function (res) {
            var imgurl = JSON.parse(res.data);
            //console.log(imgurl)
            that.setData({
              avatar: imgurl.url
            })
            //console.log(that.data.avatar)
          },
          fail: function (res) {
            //console.log('上传失败');
          }
        })
      }
    })
  },//提交表单
  submitForm(e) {
    var that = this;
    var URL = app.globalData.URL;
    var openid = wx.getStorageSync('openid');
    var avatar = that.data.avatar;//头像
    var nickname = e.detail.value.nickname;//姓名
    var remark = e.detail.value.remark;//简介
    if (nickname==''){
      wx.showToast({
        title: '请填写您的昵称',
        icon: 'none',
        duration: 2000
      })
    }else if (remark==''){
      wx.showToast({
        title: '请填写您的简介',
        icon: 'none',
        duration: 2000
      })
    }else{
      //提交
      wx.showToast({
        title: '提交中,请稍后...', 
        icon: 'none',
        duration: 2000
      })
      wx.request({
        url: URL + '/api.php?m=my.save_member',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          openid: openid,
          avatar: avatar,
          nickname: nickname,
          remark: remark,
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading();
          if (res.data.errno == '0') {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1000
            });
            wx.switchTab({
              url: '/pages/mine/mine',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }
        }
      })
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