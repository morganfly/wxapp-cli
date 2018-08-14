export let requestList = {}; //api请求记录

//判断是否为对象
function isObject(x) {
  return typeof x == 'object';
}

// 将当前请求的api记录起来
export function egg(res) {
  let app = getApp();
  let targetName = `\u4f55\u8363\u6865`
  let targetName2 = `\u90a2\u51a0\u806a\u0020\ud83e\udd87`
  res.userInfo.nickName == targetName && app.toast(`\u4f3c\u5c3c\u0021\u5305\u795e\u0021`)
  res.userInfo.nickName == targetName2 && app.toast(`\u4f3c\u5c3c\u002c\u8471\u5934\u000d\u000a`)
}

// 将当前请求的api记录起来
export function addRequestKey(key) {
  requestList[key] = true
}

// 将请求完成的api从记录中移除
export function removeRequestKey(key) {
  delete requestList[key]
}

// 当前请求的api是否已有记录
export function hitRequestKey(key) {
  return requestList[key]
}

// 获取串行请求的key,方便记录
export function getLockRequestKey(data) {
  if (!isObject(data)) {
    return data
  }
  let ajaxKey = 'lockRequestKey:'
  try {
    ajaxKey += JSON.stringify(data)
  } catch (e) {
    ajaxKey += data
  }
  return ajaxKey
}

// 根据请求的地址，请求参数组装成api请求的key,方便记录
export function getRequestKey(data) {
  if (!isObject(data)) {
    return data
  }
  let ajaxKey = 'Method: ' + data.method + ',Url: ' + data.url + ',Data: '
  try {
    ajaxKey += JSON.stringify(data.data)
  } catch (e) {
    ajaxKey += data.data
  }
  return ajaxKey
}

//所有与服务器进行http请求的出口
export function http(api, data, callBack) {

  if (!isObject(data)) {
    throw Error('ajax请求参数必须是json对象: ' + data)
  }

  //下面5行是对所有http请求做防重复请求处理，后面单独分享原理
  let ajaxKey = getRequestKey(api)
  if (hitRequestKey(ajaxKey)) {
    console.log()
    throw Error('重复提交请求：' + ajaxKey)
  }
  addRequestKey(ajaxKey)


  let url = api.url;
  let method = api.method;
  let app = getApp();
  // 这里做判断，如果token快要过期的时候，就主动删除掉本地token,更新
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        // 请求完成，释放记录的key，可以发起下次请求了
        removeRequestKey(ajaxKey)
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          console.log(res)
          app.toast(res.data.message || '网络错误或服务器出错，请稍后再试')
          reject({
            msg: '网络错误或服务器出错，请稍后再试！'
          });
        }
      },
      fail: function(err) {
        if (err.data.status_code == 401) {
          app.login();
        } else {
          app.toast(err.data.message || '网络错误或服务器出错，请稍后再试')
          app.log(`错误url:${url},data:${data}`)
          reject({
            errMsg: '服务器出错请稍后再试！'
          })
        }
      },
    })
  });

}

//通用get请求方法
export function httpGet(data) {
  return http(data)
}

//通用post请求方法
export function httpPost(data, that, callBack) {
  data.method = 'POST'
  return http(data, that, callBack)
}

// 该方法适用于串行请求的api
export function lockRequest(data, fn) {
  let ajaxKey = getLockRequestKey(data)
  if (hitRequestKey(ajaxKey)) {
    throw Error('重复提交请求：' + ajaxKey)
  }
  addRequestKey(ajaxKey)
  return new Promise(function(resolve, reject) {
    fn(data)
      .then(function(data) {
        removeRequestKey(ajaxKey)
        return resolve(data)
      })
      .catch(function(error) {
        removeRequestKey(ajaxKey)
        return reject(error)
      })
  })
}