// pages/movies/movies.js
var utils = require('../../utils/utils.js');
var app = getApp();

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPannelShow: false,
    searchResult: {}
  },
  onLoad: function(options) {
    var startTo3 = "?start=0&count=3";
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + startTo3;
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + startTo3;
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + startTo3;
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映"); //
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    //豆瓣屏蔽了微信小程序对 https://api.douban.com 接口的调用，这里
    //就使用了一位网友提供的反向代理接口 https://douban.uieee.com
    wx.request({
      url: url,
      data: {}, //submit data
      method: "GET",
      header: {
        "Content-Type": "Application/json"
      },
      success: function(res) {
        console.log(res);
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function(error) {
        // console.log(error);
      }
    })
  },
  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
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
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  },
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },
  onBindFocus: function(event) {
    // containerShow: true初始值
    // searchPannelShow: false初始值
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult: {}
    })
  },
  onBindConfirm: function(e) { //bindblur属性绑定的onBindBlur函数可以在输入框失去焦点时，取得输入框的值
    var text = e.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "categoryTitle")
  },
  onMovieTap: function(event) {
    var movieTitle = event.currentTarget.dataset.movietitle;
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId + "&title=" + movieTitle
    })
  }
})