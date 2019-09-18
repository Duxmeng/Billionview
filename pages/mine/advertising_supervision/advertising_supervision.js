// pages/mine/mycollect/mycollect.js
const app = getApp();
// var URL = app.globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度
    currentTab: 0,
    scrollLeft: 0,
    status:1,
    userfo:[],
    URL:app.globalData.URL,
    proList: [],
    jobList: [],
    demand: [],
    col: 'collect',
    tyt: 'xm',
    empty: 1,//内容为不为空
    nav: [
      { classname: '待审核', ttype: 'xm' },
      { classname: '已通过', ttype: 'zj' },
      { classname: '未通过', ttype: 'fw' },
      { classname: '已上线', ttype: 'zw' },
      { classname: '已下线', ttype: 'xq' }
    ],
    adli:[],
    passlist:[],
    nopasslist: [],
    onlinelist: [],
    Offlinelist: [],
    refreshing: false,//是否在刷新
    page: 1,
  },//点击进入详情页
  clickDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`,
    })
  },
  //点击发布跳转页面 
  release:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `/pages/advertising/advertising_detail/advertising_detail?id=${id}&&status=${2}`,
    })
  },//详情页返回触发事件
  changeData: function () {
    //this.onLoad();
  },//发布上线
  send:function(e){
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var page = that.data.page;
    var id = e.currentTarget.dataset.id;
    // 显示加载图标
    wx.showLoading();
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_status',
      data: {
        id: id,
        status: 4
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        if (res.data.errno == 0) {
          wx.switchTab({
            url: '/pages/index/index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        } else if (res.data.errno == 2){
          wx.showToast({
            title: '账户余额不足，请及时充值',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },//下线
  outline:function(e){
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var page = that.data.page;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定下线吗？',
      success(res) {
        if (res.confirm) {
          // 显示加载图标
          wx.showLoading();
          //获取列表信息
          wx.request({
            url: URL + '/api.php?m=dynamic.ad_status',
            data: {
              id: id,
              status: 5
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              if (res.data.errno == 0) {
                wx.request({
                  url: URL + '/api.php?m=dynamic.ad_list',
                  data: {
                    memberid: memberid,
                    page: page,
                    status: 4
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.errno == 0) {
                      that.setData({
                        onlinelist: res.data.rst
                      });
                      wx.hideLoading();
                    }
                    if (that.data.onlinelist.length == 0) {
                      that.setData({
                        empty: 0
                      })
                    }
                  }
                })
              } else if (res.data.errno == 2) {
                wx.showToast({
                  title: '账户余额不足，请及时充值',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },//已下线发布按钮
  outSend:function(e){
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var page = that.data.page;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定发布广告吗？',
      success(res) {
        if (res.confirm) {
          // 显示加载图标
          wx.showLoading();
          wx.request({
            url: URL + '/api.php?m=dynamic.ad_status',
            data: {
              id: id,
              status: 4
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              //console.log(res)
              if (res.data.errno == 0) {
                wx.request({
                  url: URL + '/api.php?m=dynamic.ad_list',
                  data: {
                    memberid: memberid,
                    page: page,
                    status: 5
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    //console.log(res)
                    if (res.data.errno == 0) {
                      that.setData({
                        Offlinelist: res.data.rst
                      });
                      wx.hideLoading();
                    }
                    if (that.data.Offlinelist.length == 0) {
                      that.setData({
                        empty: 0
                      })
                    }
                  }
                })
              } else if (res.data.errno == 2) {
                wx.showToast({
                  title: '账户余额不足，请及时充值',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //点击充值跳转页面
  Recharge:function(){
    wx.navigateTo({
      url: '/pages/mine/Mywallet/Mywallet'
    })
  },
  //点击浏览跳转页面
  browsego:function(e){
    var id = e.currentTarget.dataset.id;
    //console.log(id)
    wx.navigateTo({
      url: `/pages/browseuser/browseuser?id=${id}`,
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    // 显示加载图标
    wx.showLoading();
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    var that = this;
    var tyt = this.data.nav[e.detail.current].ttype;
    if (tyt == 'fw') {
      this.setData({
        col: 'collectservice'
      })
    } else {
      this.setData({
        col: 'collect'
      })
    }
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var page = that.data.page;
    var status = parseInt(e.detail.current) + 1;
    //获取列表信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 4,
        status: status
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.errno == 0) {
          that.setData({
            passlist: res.data.rst,
            nopasslist:res.data.rst,
            onlinelist:res.data.rst,
            Offlinelist:res.data.rst,
            status: parseInt(e.detail.current) + 1,
          });
          wx.hideLoading();
        }
        if (res.data.rst.length == 0) {
          that.setData({
            empty: 0
          })
        }else{
          that.setData({
            empty: 1
          })
        }
      }
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    // 显示加载图标
    wx.showLoading();
    var cur = e.currentTarget.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var page = that.data.page;
    var status = parseInt(e.currentTarget.dataset.current) + 1;
    //获取列表信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        page: 1,
        pagesize: 4,
        status: status
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            adli: res.data.rst,
            passlist: res.data.rst,
            nopasslist: res.data.rst,
            onlinelist: res.data.rst,
            Offlinelist: res.data.rst,
            status: status,
          });
          wx.hideLoading();
        }
        if (res.data.rst.length == 0) {
          that.setData({
            empty: 0
          })
        } else {
          that.setData({
            empty: 1
          })
        }
      }
    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 显示加载图标
    wx.showLoading();
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 374;
        that.setData({
          winHeight: calc,
        });
      }
    });
    var that = this;
    var URL = app.globalData.URL;
    var openid = wx.getStorageSync('openid');
    var memberid = wx.getStorageSync('memberid')
    var page = that.data.page;
    var status = that.data.status;
    console.log(status)
    //获取用户信息
    wx.request({
      url: URL + '/api.php?m=my.detail',
      data: { openid: openid },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        if (res.data.errno == 0) {
          that.setData({
            userfo: res.data.rst
          })
        }
      }
    })
    //获取列表信息
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        page: page,
        pagesize: 4,
        status: status
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.errno == 0) {
          that.setData({
            adli:res.data.rst
          });
          wx.hideLoading();
        }
        if (that.data.adli.length == 0) {
          that.setData({
            empty:0
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
    wx.reLaunch({
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
  * 下拉动作
  */
  upper: function () {
    wx.showLoading();
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var status = that.data.status;
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        page:1,
        status: status
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideLoading();
        that.setData({
          adli: res.data.rst,
          passlist: res.data.rst,
          nopasslist: res.data.rst,
          onlinelist: res.data.rst,
          Offlinelist: res.data.rst,
          refreshing: false,
          pagesize: 4,
        })
        wx.showToast({
          title: '已更新到最新数据',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        
      }
    })
  },
  /**
   * 上拉加载更多
   */
  lower: function () {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid')
    var status = that.data.status;
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    wx.showLoading();
    // console.log(that.data.page + 1)
    wx.request({
      url: URL + '/api.php?m=dynamic.ad_list',
      data: {
        memberid: memberid,
        status: status,
        pagesize:4,
        page: that.data.page += 1
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(that.data.page)
        // console.log(res.data.rst)
        //   console.log(that.data.nopasslist)
        //   console.log(that.data.adli.concat(res.data.rst)) 
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
              adli: that.data.adli.concat(res.data.rst),
              passlist: that.data.passlist.concat(res.data.rst),
              nopasslist: that.data.nopasslist.concat(res.data.rst),
              onlinelist: that.data.onlinelist.concat(res.data.rst),
              Offlinelist: that.data.Offlinelist.concat(res.data.rst),
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
  onShareAppMessage: function (res) {
    var that = this;
    // return {
    //   title: '',
    //   path: '/pages/login/login',
    //   success: function (res) {
    //     wx.showToast({
    //       title: '分享成功',
    //       icon: 'none',
    //       duration: 1000
    //     })
    //   },
    //   fail: function (res) {
    //     wx.showToast({
    //       title: '分享失败',
    //       icon: 'none',
    //       duration: 1000
    //     })
    //   }
    // }
  }
})