/*  将时间戳转化为 YYYY/MM/DD xx:yy:zz 格式
    @param  {Date} data 时间戳
    @return {String}  YYYY/MM/DD xx:yy:zz
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/*  将时间戳转化为 YYYY-MM-DD 格式
    @param  {Date}    date  时间戳
    @return {String}  YYYY-MM-DD  
 */
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

/*  参数为一位整数则在其前面加一个零
    @param    {Number}  n   要转化的数字
    @return   {String}  n || 0n        
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*  获取用户当前位置
    @return {Object} 
 */
const getLocation = () => {
  wx.getLocation({
    success(res) {
      // var latitude = res.latitude
      // var longitude = res.longitude
      // var speed = res.speed
      // var accuracy = res.accuracy

      return res
    },
  })
}

/*  获取用户手机机型
    @return {Object}
 */
const getSystemInfo = () => {
  let _this = this;
  wx.getSystemInfoSync({
    success(res) {
      return res
    }
  });
}

/*  检查用户网络情况,如果断网,则提示用户断网
    @param {Function} callback  断网情况下的回调函数
 */
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

/*  错误提示(需要在页面里写入相关提示元素)
    @param {Content}  this        调用函数上下文
    @param {String}   errorText   错误提示方案
    @parm  {Number}   time        错误提示显示时间 
 */
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

/*  手机号码格式校验   {1开头的11位数字}
    @param  {Number || String}  phone   需要校验的手机号码
    @return {Boolean}
*/
function mobileCheck(phone) {
  var myreg = /^(1+\d{10})|(159+\d{8})|(153+\d{8})$/;

  if (!phone) {
    console.log(`请传入手机号码`)
    return false
  }

  if (!myreg.test(phone.toString())) {
    console.log(`手机号码不正确`)
    return false
  }

  return true
}

/*  邮箱格式校验  
    @param  {String} email 需要校验的邮箱
    @return {Boolean}
 */
function emailCheck(email) {
  var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (!email) {
    console.log(`请传入邮箱作为参数`)
    return false
  }
  if (!myreg.test(email)) {
    console.log('邮箱格式不正确');
    return false
  }
  return true
}

/*  去除特殊符号
    @param  {String}   str   需要去除特残符号的字符串
    @return {String}   去除完特殊符号的字符串
*/
function deleteSymbol(str) {
  if (typeof str != 'string') {
    this.errorHide(that, '去除特殊符号函数的参数必须是字符串');
    return str
  }
  let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  let rs = "";
  for (let i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

/*  去除字符串前后的空格
    @param  {String}   str  需要去除前后空格的字符串
    @return {String}   去除完前后空格的字符串 
 */
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
  @param  {Array}    arr 去重对象数组
  @param  {String}   key 数组元素对象的某个键值
  @return {Array}    去重后的数组 
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
  getSystemInfo,
  getNetStatus,
  mobileCheck,
  emailCheck,
  deleteSymbol,
  errorHide,
  trim,
  unique,
}