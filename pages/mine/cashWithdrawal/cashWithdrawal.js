// pages/mine/cashWithdrawal/cashWithdrawal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: '',
    winHeight: "",//窗口高度
    currentTab: 0,
    scrollLeft: 0,
    nav: [
      { name: '支付宝' },
      { name: '微信支付' },
    ],
    showModal:0,
    realname:'',
    tel:'',
    alipay:'',
    wechat:'',
    money:'',
    wechatShow:1,
    withdraw_type:1,
    withdraw_money:'',
    fee:'',
    haveImg:true,
    withdraw_img:'../../../images/withdraw_img.png',
    withdraw_img01:''
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    //console.log(cur)
    if (this.data.currentTaB == cur) { 
      return false; 
    }else {
      this.setData({
        currentTab: cur
      })
    }
    if(cur==1){
      this.setData({
        wechatShow:0,
        withdraw_type:2
      })
    }else{
      this.setData({
        wechatShow: 1,
        withdraw_type: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var URL = app.globalData.URL;
    that.setData({
      URL: URL,
    })
    var openid = wx.getStorageSync('openid');
    //console.log(openid)
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 700;
        that.setData({
          winHeight: calc,
        });
      }
    });
    // 显示加载图标
    wx.showLoading();
    //获取提现信息
    wx.request({
      url: URL + '/api.php?m=my.withdraw',
      data: { openid: openid },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.errno == 0) {
          that.setData({
            money: res.data.rst.amount,
            realname: res.data.rst.real_name,
            tel: res.data.rst.real_phone,
          })
          if (res.data.rst.withdraw_img !='undefined'){
            that.setData({
              haveImg:false
            })
          }
          if (res.data.rst.withdraw_type==1){
            that.setData({
              alipay: res.data.rst.account_number,
              currentTab: 0,
              wechatShow: 1,
            })
          }else if (res.data.rst.withdraw_type == 2){
            that.setData({
              wechat: res.data.rst.account_number,
              currentTab:1,
              wechatShow: 2,
              withdraw_img01: res.data.rst.withdraw_img
            })
          }
        }
      }
    });
    //获取手续费
    wx.request({
      url: URL + '/api.php?m=get.base',
      data: {  },
      method: 'POST',
        header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        that.setData({
          fee: res.data.rst.poundage
        })
      }
    })
  },//提现金额
  money:function(e){
    //console.log(e)
    var that = this
    var money = e.detail.value;
    that.setData({
      withdraw_money: money
    })
  },//信息提交成功弹框
  sure: function (e) {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var uuid = wx.getStorageSync('uuid');
    var withdraw_money = that.data.withdraw_money;
    var real_name = that.data.realname;
    var real_phone = that.data.tel;
    var withdraw_type = that.data.withdraw_type;
    if (withdraw_type == 1) {
      var account_number = that.data.alipay;
    } else {
      var account_number = that.data.wechat;
    }
    if (real_name == '' || real_phone == '' || account_number==''){
      wx.showToast({
        title: '请输入您的信息',
        icon: 'none',
        duration: 2000
      })
    } else if (withdraw_money == ''){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
    } else if (withdraw_money < 10) {
      wx.showToast({
        title: '提现金额不能少于10元',
        icon: 'none',
        duration: 2000
      })
    }else{
      
      wx.showModal({
        title: '免责声明',
        content: '1.请确保您填写的信息正确\r\n2.如您所填写信息错误请更改\r\n3.如信息错误造成提现失败本平台不负任何责任',
        success(res) {
          if (res.confirm) {
            // 显示加载图标
            wx.showLoading();
            //提交提现账户
            wx.request({
              url: URL + '/api.php?m=my.save_withdraw',
              data: {
                memberid: memberid,
                uuid: uuid,
                withdraw_money: withdraw_money
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
                    showModal: 1
                  });
                  if (getCurrentPages().length != 0) {
                    //刷新当前页面的数据
                    getCurrentPages()[getCurrentPages().length - 1].onLoad()
                  }
                }
                if (res.data.errno == 1) {
                  wx.showToast({
                    title: '余额不足！',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if (res.data.errno == 3) {
                  wx.showToast({
                    title: '提现申请失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },//关闭弹框
  close:function(){
    var that = this;
    that.setData({
      showModal:0,
      withdraw_money:''
    })
  },//收款码上传
  withdrawImg: function () {
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
              withdraw_img01: URL + imgurl.url,
              haveImg:false
            })
            //console.log(that.data.avatar)
          },
          fail: function (res) {
            //console.log('上传失败');
          }
        })
      }
    })
  },
  //提交表单
  submitForm(e) {
    var that = this;
    var URL = app.globalData.URL;
    var openid = wx.getStorageSync('openid');
    var withdraw_type = that.data.withdraw_type;
    var real_name = e.detail.value.realname;
    var real_phone = e.detail.value.tel;
    if (withdraw_type == 1) {
      var account_number = e.detail.value.alipay;
    } else {
      var account_number = e.detail.value.wechat;
      var withdraw_img = that.data.withdraw_img01;
    }
    if (real_name==''){
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none',
        duration: 2000
      })
    } else if (real_phone == '' || !(/^1[3456789]\d{9}$/.test(real_phone)) || real_phone.length < 11){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (account_number == ''){
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration: 2000
      })
    } else if (withdraw_img == '') {
      wx.showToast({
        title: '请上传收款二维码',
        icon: 'none',
        duration: 2000
      })
    }else{
      console.log(111)
      // 显示加载图标
      wx.showLoading();
      //提交提现账户
      wx.request({
        url: URL + '/api.php?m=my.save_member',
        data: { 
          openid: openid,
          real_name: real_name,
          real_phone: real_phone,
          account_number: account_number,
          withdraw_type: withdraw_type,
          withdraw_img: withdraw_img
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading();
          if(res.data.errno==0){
            wx.showToast({
              title: '信息保存成功',
              icon: 'none',
              duration: 2000
            });
            if (getCurrentPages().length != 0) {
              //刷新当前页面的数据
              getCurrentPages()[getCurrentPages().length - 1].onLoad()
            }
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