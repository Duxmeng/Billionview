// pages/demo/demo.js
Page({
  data: {
    list: ['red', 'blue', 'yellow'],
    pot: 0,
    move: 0,
  },

  onLoad: function () {
    
  },
  next: function (e) {
    if (this.data.move == 0) {
      this.setData({
        move: 2
      })
      let that = this;
      setTimeout(function () {
        var list = that.data.list;
        var first = list.shift();
        list.push(first);
        that.setData({
          list: list,
          move: 0
        })
      }, 800)
    }
    
  },
  /**
    * 生命周期函数--监听页面卸载
    */
  onUnload: function () {
    
  },
})
