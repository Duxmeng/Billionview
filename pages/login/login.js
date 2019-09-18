const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },
  bindInfo: function (res) {
    var that = this;
    var URL = app.globalData.URL;
    //console.log(res)
    if (res.detail.userInfo) {
      var imgurl = res.detail.userInfo.avatarUrl;
      var nickname = res.detail.userInfo.nickName;
      wx.login({
        success: function (res) {
          var that = this;
          console.log(res.code)
          if (res.code) {
            //发起网络请求
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              url: URL + '/api.php?m=login.authorLogin',
              data: {
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success: function (response) {
                console.log(response.data)
                wx.setStorageSync('openid', response.data.rst.openid);
                //wx.setStorageSync('openid', response.data.openid);
                wx.request({
                  url: URL + '/api.php?m=login.wxOauth',
                  data: {
                    openid: response.data.rst.openid,
                    avatar: imgurl,
                    nickname: nickname
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    console.log(res)
                    wx.setStorageSync('memberid', res.data.rst.memberid);
                    wx.setStorageSync('uuid', res.data.rst.uuid);
                    wx.navigateTo({
                      url: '/pages/mine/Mywallet/Mywallet',
                    })
                    // wx.switchTab({
                    //   url: '/pages/mine/mine'
                    // })
                  }
                })
              },
            })
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1500
            })
          }
        }
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

})
