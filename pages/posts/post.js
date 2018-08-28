var postsData = require('../../data/posts-data.js');//这里只能用相对路径，不能用绝对路径
// pages/posts/post.js
Page({
  onPostTap: function (event) {//跳转到文章详情页面的导航函数
    var postId = event.currentTarget.dataset.postid;//千万注意，这里是小写dataset.postid的 id
    wx.navigateTo({
      url: "/pages/posts/post-detail/post-detail?id=" + postId //?id= 来传递参数，参数通常是某些变量
    })
    console.log(postId);
  },
  // onSwoperItemTap: function(event) {
  //   var postId = event.currentTarget.dataset.postid;//千万注意，这里是小写dataset.postid的 id
  //   wx.navigateTo({
  //     url: "/pages/posts/post-detail/post-detail?id=" + postId //?id= 来传递参数，参数通常是某些变量
  //   })
  // },
  onSwoperTap: function(event) {
    var postId = event.target.dataset.postid;//target 指的是当前点击的组件，而currentTarget指的是事件捕获的组件
    wx.navigateTo({//target 这里指的是 image，而 currentTarget 指的是swiper组件
      url: "/pages/posts/post-detail/post-detail?id=" + postId //?id= 来传递参数，参数通常是某些变量
    })
  },
  /**
   * 页面的初始数据
   */
  data: {//data的初始化总是在 onLoad 事件发生之后进行的
  //所以在 onLoad 函数下面可以直接对 this.data 赋值就可以了，不需要调用 this.setData({})来进行数据绑定
  //如果记不清上面的逻辑，直接使用this.setData({})就是正确的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("1onLoad");
    this.setData({
      posts_key: postsData.postList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("3onReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("2onShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage");  
  }
})