// pages/details/details.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    URL:app.globalData.URL,
    infor:[],
    palyy:1,
    notice_num:'0.1',
    animationData: {},
    refreshing: false,//是否在刷新
    pre_id:'',
    nextId:'',
    price:0,
    imgs:[],
    ty: 0,
    index:''
  },//轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },/**
     * 开始触摸
     * @param e
     */
  onTouchStart: function (e) {
    console.log(e)
    let tp = e.changedTouches[0]; //记录手指位置
    this.setData({
      ty: tp.y
    })
    console.log(this.data.ty)
  },
  /**
   * 手指离开
   * @param e
   */
  onTouchEnd: function (e) {
    //console.log('手指离开')
    let ty = this.data.ty;
    let tp = e.changedTouches[0]; //手指结束时位置
    if (tp.y - ty < - 100) {  //向下滚动
      console.log('向下滚动')
      var that = this;
      var URL = app.globalData.URL;
      var memberid = wx.getStorageSync('memberid');
      var id = that.data.nextId;
      var index = that.data.index;
      if(id!=0){
        // 显示加载图标
        wx.showLoading()
        wx.showNavigationBarLoading();
        //获取列表信息
        wx.request({
          url: URL + '/api.php?m=dynamic.ad_detail',
          data: {
            memberid: memberid,
            id: id,
            index: index
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            //console.log(res)
            // 隐藏加载
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
            if (res.data.errno == 0) {
              that.setData({
                infor: res.data.rst,
                nextId: res.data.rst.next_id,
                pre_id: res.data.rst.pre_id,
              })
              //console.log(that.data.nextId)
            }
          }
        })
      }else{
        wx.showToast({
          title: '没有更多广告了',
          icon: 'none',
          duration: 2000
        })
      }
      
    } else if (tp.y - ty > 100) { //向上滚动
      console.log('向上滚动')
      var that = this;
      var URL = app.globalData.URL;
      var memberid = wx.getStorageSync('memberid');
      var id = that.data.pre_id;
      var index = that.data.index;
      console.log(id)
      if(id!=0){
        // 显示加载图标
        wx.showLoading()
        wx.showNavigationBarLoading();
        //获取列表信息
        wx.request({
          url: URL + '/api.php?m=dynamic.ad_detail',
          data: {
            memberid: memberid,
            id: id,
            index: index
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            //console.log(res)
            // 隐藏加载
            wx.hideNavigationBarLoading();
            wx.hideLoading();
            if (res.data.errno == 0) {
              that.setData({
                infor: res.data.rst,
                nextId: res.data.rst.next_id,
                pre_id: res.data.rst.pre_id,
              })
              //console.log(that.data.nextId)

            }
          }
        })
      }else{
        wx.showToast({
          title: '没有最新广告了',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var id = options.id;
    var index = options.index;
    console.log(index)
    wx.showLoading()
    wx.showNavigationBarLoading();
    //获取详情信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_detail',
      data: {
        memberid: memberid,
        id: id,
        index: index
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.errno == 0) {
          that.setData({
            infor: res.data.rst,
            nextId: res.data.rst.next_id,
            pre_id: res.data.rst.pre_id,
            index: index
          })
          if (res.data.rst.price!=0){
            that.setData({
              price: 1
            })
            // setTimeout(function () {
            //   that.setData({
            //     price: 1
            //   })
            // }, 5000);
          }
          //console.log(that.data.nextId)
        }
      }
    })
  },
  changeParentData: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.changeData();//触发父页面中的方法
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player');
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  //点击播放
  bindPlay() {
    var videoContext = wx.createVideoContext('player') //这里对应的视频id
    videoContext.play();
    this.setData({
      palyy: 1
    })
    // this.ctx.play({
    //   success: res => {
        
    //   },
    //   fail: res => {
    //     this.setData({
    //       palyy: 1
    //     })
    //   }
    // })
  },
  //点击暂停
  bindStop() {
    var videoContext = wx.createVideoContext('player') //这里对应的视频id
    videoContext.pause();
    console.log(videoContext)
    this.setData({
      palyy: 2
    })
    // this.ctx.stop({
    //   success: res => {  
    //   },
    //   fail: res => {
    //     this.setData({
    //       palyy: 2
    //     })
    //   }
    // })
  },
  //一键复制
  copyTBL: function (e){
    var link = e.currentTarget.dataset.link;
    //console.log(link)
    wx.showModal({
      title: '查看详情',
      content: '链接已复制，粘贴到浏览器浏览详情',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: link,
            success(res) {
              wx.showToast({
                title: '链接复制成功',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { 
    
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
    this.changeParentData()
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