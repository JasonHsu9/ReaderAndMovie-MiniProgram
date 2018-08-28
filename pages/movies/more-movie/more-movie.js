// pages/movies/more-movie/more-movie.js
var app = getApp();
var utils = require('../../../utils/utils.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    totalCount: 0,
    requestUrl: "",
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    var dataUrl = "";

    this.data.category = category;

    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;

      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;

      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    utils.http(dataUrl, this.processDoubanData);
  },
  processDoubanData: function(moviesDouban) {
    var movies = [];
    for (var index in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[index];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title,
        stars: utils.convertToStarsArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }

    let totalMovies = [];
    this.setData({
      totalCount: this.data.totalCount + 20
    });
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading(); //当http请求完成，成功获取数据时，隐藏导航条的加载状态
    //当初次加载后，再次发起http请求后，data中isEmpty值变为false，所以此后执行http函数会将数据追加给，data的 movies属性，实现上滑加载更多内容
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.category,
      success: function(res) {}
    })
  },
  onReachBottom: function(enent) {
    //由于服务器默认每次只加载20条数据
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading(); //导航栏呈现 正在加载状态
  },
  onPullDownRefresh: function (event) {//在当前页面的json 文件中的 backgroundColor字段配置，可以提供下拉时的背景颜色，以让用户明显的收到下拉反馈
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    utils.http(refreshUrl, this.processDoubanData);
    wx.hideNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieTitle = event.currentTarget.dataset.movietitle;
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId + "&title=" + movieTitle
    })
  }
})