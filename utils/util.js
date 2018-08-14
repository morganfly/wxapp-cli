// 时间戳转换1
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 时间戳转化2
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

// 个位数数字前补全0
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取用户当前位置
const getLocation = () => {
  wx.getLocation({
    success(res) {
      console.log('location', res)
    },
  })
}

// 用户选取自己所在地
const mapLocation = () => {
  wx.chooseLocation({
    success(res) {
      console.log('mapLocation', res)
    },
  })
}

// 获取机型信息
const getSystemInfo = () => {
  let _this = this;
  wx.getSystemInfo({
    success(res) {
      console.log('systemInfo', res)
      _this.globalData.systemInfo = res;
    }
  });
}

// 获取网络类型和是否有网络连接
const getNetStatus = (callback) => {
  let me = this;
  wx.getNetworkType({
    success(res) {
      let networkType = res.networkType;
      me.globalData.networkType = networkType
      if (networkType == "none") {
        //提示断网
        wx.showModal({
          title: '提示',
          content: '您的网络断开了，请重连！',
          complete: function() {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        })
      }
      typeof callback == 'function' && callback(networkType)
    }
  })
}

//错误提示
function errorHide(target, errorText, time = 3000) {
  let that = target;
  that.setData({
    error: "1",
    error_text: errorText
  });
  let errorTime = setTimeout(function() {
    that.setData({
      error: "0"
    });
  }, time);
}

// 手机号码格式   {1开头的11位数字}
function mobile(that, value, callBack) {
  var myreg = /^(1+\d{10})|(159+\d{8})|(153+\d{8})$/;
  if (!value) {
    this.errorHide(that, '请输入手机号');
    return
  }
  if (!myreg.test(value)) {
    this.errorHide(that, '手机号码格式不正确');
    return
  }

  if (callBack) callBack();
}

// 邮箱格式
function email(that, value, callBack) {
  var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (!value) {
    this.errorHide(that, '请输入邮箱');
    return
  }
  if (!myreg.test(value)) {
    this.errorHide(that, '邮箱模式不正确');
    return
  }
  if (callBack) callBack();
}

// 去除特殊符号
function deleteSymbol(value) {
  if (typeof value != 'string') {
    this.errorHide(that, '去除特殊符号函数的参数必须是字符串');
    return value
  }
  let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  let rs = "";
  for (let i = 0; i < value.length; i++) {
    rs = rs + value.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

// 去除字符串前后空格
function trim(str) {
  str = str.replace(/^(\s|\u00A0)+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}


// 对象数组去重
/*
  @param {Array}    arr 去重对象数组
  @param {String}   key 数组元素对象的某个键值
 */
function unique(arr, key) {
  let unique = {};
  arr.forEach(function(item) {
    unique[JSON.stringify(item[key])] = item; //键名不会重复
  })
  arr = Object.values(unique).map(function(u) {
    //Object.values()返回对象的所有键值组成的数组，map方法是一个遍历方法，返回遍历结果组成的数组.将unique对象的键名还原成对象数组
    return u;
  })
  return arr;
}



module.exports = {
  formatTime,
  formatTime2,
  getLocation,
  mapLocation,
  getSystemInfo,
  getNetStatus,
  mobile,
  email,
  deleteSymbol,
  errorHide,
  trim,
  unique,
}