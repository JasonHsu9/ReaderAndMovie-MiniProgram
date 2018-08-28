// pages/movies/movie-detail/movie-detail.js
let utils = require("../../../utils/utils.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var movieId = options.id;
    var movieTitle = options.title;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    utils.http(url, this.processDoubanData);
    wx.setNavigationBarTitle({
      title: movieTitle
    })
  },
  processDoubanData: function(data) {
    console.log(data);
    var director = { //定义一个director 导演 对象
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }

    var movie = {
      movieImg: data.images ? data.images.large : "", //影片海报
      country: data.countries[0], //地区
      title: data.title, //电影名称
      originalTitle: data.original_title, //电影的最初名称，当被翻译为外文时，这个可以知道电影原原始名称
      wishCount: data.wish_count, //多少人想看
      commentCount: data.comments_count, //多少人评论
      year: data.year, //上映年份
      genres: data.genres.join("、"), //电影风格、类型
      stars: utils.convertToStarsArray(data.rating.stars), //电影星星数，和评分相关
      score: data.rating.average, //电影评分
      director: director, //上面处理过的js对象
      casts: utils.convertToCastString(data.casts), //主演
      castsInfo: utils.convertToCastInfos(data.casts), //影人图片
      summary: data.summary //影片概要
    }
    console.log(movie);
    this.setData({
      movie: movie
    })
  },
  viewMoviePostImg: function(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({//大图预览功能，当点击图片的时候会全屏显示图片
      current: src,
      urls: [src]
    })
  }
})