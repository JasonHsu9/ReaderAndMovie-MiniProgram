// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id;
    var postData = postsData.postList[postId];
    this.setData({ //这里我使用this.data.postData直接赋值的时候，数据绑定失败，用this.setData(object)才成功了
      postData
    });
    this.data.currentPostId = postId;

    var postsCollected = wx.getStorageSync("posts_collected");
    console.log(postsCollected);
    if (postsCollected) {
      var postCollected = postsCollected[postId]; //从缓存获取值，赋值给 postCollected
      this.setData({ //更新 data 绑定在页面的 collected 从而让页面显示相应的图片（收藏或未收藏）
        collected: postCollected
      });
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor();
  },

  setMusicMonitor: function() {
    var that = this;
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function() { //这里不要用成wx.onBackgroundAudioStop(CALLBACK)这个函数是用于停止，而不是暂停
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(function() { //这里不要用成wx.onBackgroundAudioStop(CALLBACK)这个函数是用于停止，而不是暂停
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap: function(event) {
    // this.getPostsCollectedAsy();//调用异步方法
    this.getPostsCollectedSyc(); //调用同步方法
  },
  getPostsCollectedAsy: function() { //异步方法
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected; //收藏数据变化，收藏和未收藏互换
        postsCollected[that.data.currentPostId] = postCollected; //收藏值发生变化时，更新缓存里面的数据
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  getPostsCollectedSyc: function() { //同步方法
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected; //收藏数据变化，收藏和未收藏互换
    postsCollected[this.data.currentPostId] = postCollected; //收藏值发生变化时，更新缓存里面的数据
    this.showToast(postsCollected, postCollected);
  },
  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏操作提示",
      content: postCollected ? "您将收藏该文章" : "取消文章的收藏",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          });
        }
      }
    })
  },
  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    });
    wx.showToast({ //显示操作提示框
      title: postCollected ? '收藏成功' : "您取消了收藏",
      duration: 800, // default is 1500 单位不用写，统一为ms
      icon: "success" //success 、loading
    });
  },
  onShareTap: function(event) {
    var itemList = [ //这里最多6个元素
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        //res.cancel 用户是不是点击了取消按扭
        //res.tapIndex 数组元素的序号, 从0开始
        //微信不支持分享功能，这里仅仅作测试使用
        wx.showModal({
          title: '用户 ' + itemList[res.tapIndex], //res.tapIndex 为数组索引值
          content: '微信不支持分享功能，这里仅仅作测试使用!您可以点击确认或者取消，但是本小程序不会有任何响应！'
        })
      }
    })
  },
  //缓存的特点，只要你不主动清除，它就永久存在！
  //最大缓存数据量，10M，wx.setStorageSync(keyName,Value)同步设置缓存数据  wx.clearStorageSync()同步清除缓存数据，wx.removeStorageSync(keyName)清除指定的缓存数据
  //开发的时候，在文章详情页面添加了一个清除缓按钮调试，完成后再删除，避免缓存无法清除对调试造成困扰
  onMusicTap: function(event) {
    var currentMusic = postsData.postList[this.data.currentPostId].music;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: currentMusic.dataUrl,
        title: currentMusic.title,
        coverImgUrl: currentMusic.coverImgUrl
      });
      this.setData({
        isPlayingMusic: true
      });
    }

  }

})