// pages/advertising/advertising_detail/advertising_detail.js
let app = getApp();
// let wechat = require("../../utils/wechat");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgaddress:0,
    address:'添加位置',
    openImg:'',
    coverImg:'../../../images/cover_img.png',
    adImg:'../../../images/ad.png',
    advideo:'',
    tempImagePath: "", // 拍照的临时图片地址
    tempThumbPath: "", // 录制视频的临时缩略图地址
    tempVideoPath: "", // 录制视频的临时视频地址
    title:'',
    txtHeight: 0,
    realtitle: '',
    content:'',
    realcontent:'',
    link:'',
    reallink:'',
    dispp:"1",
    resource_type:'0',
    choose_ad:true,
    id:1,
    items:[
      { name: '图片',checked:true},
      { name: '视频'},
    ],
    times:[],
    currentItem:'5',
    checkValue:'图片',
    checkTimeValue:'5s',
    status:1,
    id:'',
    imgList:[],
    imgad:false,
    fee:''
  }, 
  textAreaLineChange(e) {
    this.setData({ txtHeight: e.detail.height })
  },
  txtInput(e) {
    this.setData({ 
      title: e.detail.value,
      realtitle: e.detail.value 
    })
  },
  txtconInput(e) {
    this.setData({
      content: e.detail.value,
      realcontent: e.detail.value
    })
  },
  txtlinkInput(e) {
    this.setData({
      link: e.detail.value,
      reallink: e.detail.value
    })
  },
  tagChoose: function (e) {
    //console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    //设置当前样式
    that.setData({
      'currentItem': id
    })
  },
  radio: function (e) {
    var index = e.currentTarget.dataset.index;//获取当前点击的下标
    var items = this.data.items;//选项集合
    if (items[index].checked) return;//如果点击的当前已选中则返回
    items.forEach(item => {
      item.checked = false
    })
    items[index].checked = true;//改变当前选中的checked值
    this.setData({
      items: items
    });
  },
  radioChange: function (e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },
  // radiotimeChange: function (e) {
  //   console.log(e)
  //   var checkTimeValue = e.detail.value;
  //   this.setData({
  //     checkTimeValue: checkTimeValue
  //   });
  // },
  camera:function(){
    //console.log(1)
  },
  //弹框打开
  openalert:function(e){
    if (this.data.dispp != 1) {
      // 将换行符转换为wxml可识别的换行元素 <br/>
      const realtitle = this.data.realtitle.replace(/\n/g, '<br/>');
      this.setData({ realtitle });
      const realcontent = this.data.realcontent.replace(/\n/g, '<br/>');
      this.setData({ realcontent });
      const reallink = this.data.reallink.replace(/\n/g, '<br/>');
      this.setData({ reallink });
    }
    this.setData({ dispp: 2 })
  },
  //弹框关闭
  cloalert:function(){
    this.setData({
      dispp: 1,
    });
  },//上传封面图
  cover:function(){
    var URL = app.globalData.URL;
    var oss = app.globalData.oss;
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
          url: URL + '/kindeditor/php/uploadApi.php?mode=2',
          filePath: tempFilePaths[0],
          name: 'imgFile',
          header: { "Content-Type": "multipart/form-data" },
          success: function (res) {
            var imgurl = JSON.parse(res.data);
            //console.log(imgurl)
            that.setData({
              imgaddress:1,
              openImg: oss + imgurl.url
            })
          },
          fail: function (res) {
            //console.log('上传失败');
          }
        })
      }
    })
  },//上传多张广告图片
  uploadImg:function(){
    var URL = app.globalData.URL;
    var oss = app.globalData.oss;
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
          url: URL + '/kindeditor/php/uploadApi.php?mode=2',
          filePath: tempFilePaths[0],
          name: 'imgFile',
          header: { "Content-Type": "multipart/form-data" },
          success: function (res) {
            console.log(res.data)
            var imgurl = JSON.parse(res.data);
            console.log(imgurl)
            that.setData({
              imgList: that.data.imgList.concat(oss + imgurl.url),
            })
            console.log(that.data.imgList)
            that.setData({
              dispp: 1,
              resource_type: 1,
              opacity: 0,
            });
            if (that.data.imgList.length==3){
              that.setData({
                imgad:false
              });
            }
          },
          fail: function (res) {
            //console.log('上传失败');
          }
        })
      }
    })
  },
  //点击对勾的时候
  yes:function(e){
    var URL = app.globalData.URL;
    var oss = app.globalData.oss;
    var that = this;
    var timenum = that.data.currentItem;
    // console.log(that.data.checkValue)
    // console.log(that.data.checkTimeValue)
    if (that.data.checkValue=='图片'){
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          //console.log(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          wx.setStorageSync('Img', res.tempFilePaths);
          wx.uploadFile({
            url: URL + '/kindeditor/php/uploadApi.php?mode=2',
            filePath: tempFilePaths[0],
            name: 'imgFile',
            header: { "Content-Type": "multipart/form-data" },
            success: function (res) {
              var imgurl = JSON.parse(res.data);
              //console.log(imgurl)
              that.setData({
                imgList: that.data.imgList.concat(oss + imgurl.url),
              })
              that.setData({
                dispp: 1,
                resource_type:1,
                choose_ad:false,
                imgad:true
              });
              //console.log(that.data.adImg)
            },
            fail: function (res) {
              //console.log('上传失败');
            }
          })
        }
      })
    }else{
      var time = that.data.checkTimeValue;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: time,
        camera: 'back',
        success(res) {
          if (res.duration > timenum){
            wx.showModal({
              title: '提示',
              content: '您上传的视频时长大于您选择的时长，请重新上传',
              showCancel:false,
              success: function (res) {
                // if (res.confirm) {
                //   console.log('用户点击确定')
                // }
              }
            })
          }else{
            var tempFilePath = res.tempFilePath;
            that.setData({
              advideo: tempFilePath
            })
            var src = that.data.advideo;
            wx.uploadFile({
              url: URL + '/kindeditor/php/uploadApi.php?dir=media&mode=2',
              filePath: src,
              name: 'imgFile',
              method: 'POST',
              header: { "Content-Type": "multipart/form-data" },
              success: function (res) {
                //console.log(res)
                var imgurl = JSON.parse(res.data);
                //console.log(imgurl)
                if (imgurl.errno == 0) {
                  that.setData({
                    advideo: oss + imgurl.url
                  })
                  that.setData({
                    dispp: 1,
                    resource_type: 2,
                    choose_ad: false
                  });
                }
               
                //console.log(that.data.advideo)
                
                if (imgurl.errno == 1) {
                  wx.showToast({
                    title: imgurl.errmsg,
                    icon: 'none',
                    duration: 2000
                  });
                }
                //console.log(that.data.advideo)
              },
              fail: function (res) {
                //console.log('上传失败');
              }
            })
          } 
        }
      })
    }
  },//提交表单
  submitForm(e) {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var uuid = wx.getStorageSync('uuid');
    var title = e.detail.value.title;//标题
    var content = e.detail.value.content;//内容
    var link = e.detail.value.link;//链接
    var coverImg = that.data.openImg;//封面图
    var adImg = that.data.adImg;//广告图
    var advideo = that.data.advideo;//广告视频
    var address = that.data.address;//地址
    var fee_scale = that.data.currentItem;//时间
    //var linkcode = /^(http(s)?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    var linkcode = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if (that.data.resource_type == 1){
      var imgs = that.data.imgList;
      var resource_type = that.data.resource_type;
    }else{
      var resource = that.data.advideo;
      var resource_type = that.data.resource_type;
    }
    if (that.data.status == 1){
      var info_url = '/api.php?m=publish';
      var data = { memberid: memberid, uuid: uuid, type: 'ad', title: title, content: content, http: link, thumb: coverImg, imgs:imgs,resource: resource, fee_scale: fee_scale, resource_type: resource_type,address: address}
    }else{
      var info_url = '/api.php?m=publish.edit_ad';
      var id = that.data.id;
      var data = { id: id, title: title, content: content, http: link, thumb: coverImg, resource: resource, fee_scale: fee_scale, imgs: imgs, resource_type: resource_type, address: address }
    }
    if (title == '') {
      wx.showToast({
        title: '请填写标题',
        icon: 'none',
        duration: 2000
      })
    } else if (content == '') {
      wx.showToast({
        title: '请填写内容',
        icon: 'none',
        duration: 2000
      })
    } else if (link != '' && linkcode.test(link) == false){
      wx.showToast({
        title: '您输入的链接格式不正确，请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else if (coverImg==''){
      wx.showToast({
        title: '请上传封面图',
        icon: 'none',
        duration: 2000
      })
    } else if (resource==''){
      wx.showToast({
        title: '请上传广告',
        icon: 'none',
        duration: 2000
      })
    }else if (address =='添加位置'){
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
    }else{
      console.log(data)
      // 显示加载图标
      wx.showLoading({
        title: '提交中，请稍后',
      })
      wx.request({
        url: URL + info_url,
        data: data,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          
          wx.hideLoading();
          if (res.data.errno == '0') {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1000
            });
            wx.navigateTo({
              url: '/pages/mine/advertising_supervision/advertising_supervision',
            })
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1000
            });
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var URL = app.globalData.URL;
    var memberid = wx.getStorageSync('memberid');
    var resource_type = that.data.resource_type;
    var status = that.data.status;
    if (options.status== 2) {
      var id = options.id;
      that.setData({
        id: id,
        status: 2
      })
      //获取已有信息
      wx.request({
        url: URL + '/api.php?m=dynamic.ad_detail',
        data: {
          memberid: memberid,
          id: id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          if (res.data.errno == 0) {
            that.setData({
              title: res.data.rst.title,
              content: res.data.rst.content,
              link: res.data.rst.http,
              address: res.data.rst.address,
              openImg: res.data.rst.thumb,
              resource_type: res.data.rst.resource_type,
              opacity: 0,
              imgaddress:1,
            })
            if (res.data.rst.resource_type==1){
              that.setData({
                imgList: res.data.rst.imgs,
                choose_ad:false,
                imgad:true
              })
              if (that.data.imgList.length==3){
                that.setData({
                  imgad:false
                })
              }
            }else{
              that.setData({
                advideo: res.data.rst.resource,
              })
            }
          }
        }
      })
    }else{
      that.setData({
        status: 1
      })
    }
    //获取上传时长
    wx.request({
      url: URL + '/api.php?m=hy.getList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        "act": "ad",
        "region1": "9",
      },
      success: function (res) {
        //console.log(res)
        if(res.data.errno==0){
          that.setData({
            times:res.data.rst
          })
        }
      }
    });
    //获取手续费
    wx.request({
      url: URL + '/api.php?m=get.base',
      data: {},
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res)
        that.setData({
          fee: res.data.rst.fees
        })
      }
    })
  },
  //选择位置
  thisaddress:function(){
    var that = this;
    // wx.chooseLocation({
    //   success: function (res) {
    //     that.setData({
    //        address:res.name
    //     })
    //   },
    //   fail:function(res){
        
    //   }
    // })
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.name      //调用成功直接设置地址
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              that.setData({
                                address: res.name
                              })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })        
  },
  //放弃发布
  give_up:function(){
    wx.switchTab({
      url: '/pages/index/index',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },//删除当前图片
  clear:function(e){
    var that = this;
    var imgList = this.data.imgList;
    var index = e.currentTarget.dataset.index;
    imgList.splice(index, 1);
    that.setData({
      imgList: imgList,
      imgad:true
    });
    console.log(that.data.imgList.length)
    if (that.data.imgList.length==0){
      that.setData({
        imgad: false,
        choose_ad:true
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
    wx.reLaunch({
      url: '/pages/index/index'
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