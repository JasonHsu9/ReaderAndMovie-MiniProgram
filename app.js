App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    doubanBase: "https://douban.uieee.com"//豆瓣屏蔽了微信小程序对 https://api.douban.com 接口的调用，这里
    //就使用了一位网友提供的反向代理接口 https://douban.uieee.com
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
