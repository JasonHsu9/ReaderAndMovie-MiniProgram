function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num)
      array.push(1);
    else
      array.push(0);
  }
  return array;
}

function http(url, callBack) {
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
      callBack(res.data);
    },
    fail: function(error) {
      console.log(error);
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = '';
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + '/';
  }

  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = [];
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    };
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  http: http,
  convertToStarsArray: convertToStarsArray,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}