import PicUrl from '/utils/picUrl.js'
import Api from '/utils/api.js'
import Common from '/utils/common.js'
import Util from '/utils/util.js'
import * as Http from '/utils/httpModel.js'

let Socket = require(`/utils/socket.js`);

// 引入app模版对象
import Default from '/utils/app_default.js'


// 初始化app模版对象
Default.init({}, Default._init)

//app.js 
App(Object.assign(Default.app_default, {
  onLaunch() {
    // 检查token存不存在和token有没有过期
    this.isHasTokenTime().then(() => {
      // token过期，需要重新登录
      this.log('token isHasTokenTime过期')
      wx.clearStorageSync();
      this.login()
    }).catch(() => {
      this.globalData.canTokenUse = true;
    })

    // 小程序开始打点
    this._func.openMiniApp.call(this)

    Socket.init(function() {})
  },

  // 登录
  login() {
    wx.login({
      success: res => {
        let code = res.code;
        wx.setStorageSync('loginCode', code)
        this.getUserInfo()
      }
    })
  },

  // 检查token是否过期(过期则调用登录接口)
  isHasTokenTime() {
    return new Promise((resolve, reject) => {
      let _this = this;
      let serverTime = wx.getStorageSync('token_ttl');
      let tokenTime = wx.getStorageSync(`token_date`) ? wx.getStorageSync('token_date') : new Date().getTime()
      let curTime = new Date();
      let lefttime = parseInt((curTime.getTime() - tokenTime) / 1000);
      this.log(`lefttime`, lefttime)
      this.log(`serverTime`, serverTime)
      if (lefttime >= serverTime) {
        resolve()
      } else {
        reject()
      }
    })
  },

  // 检查token是否可用(过期则等待app.js中登录完成)
  // checkToken() {
  //   return new Promise((resolve, reject) => {
  //     if (wx.getStorageSync(`tokenCanUse`)) {
  //       resolve()
  //     } else {
  //       reject()
  //     }
  //   })
  // },

  checkToken(cb) {
    let app = getApp();
    let timer = setInterval(() => {
      if (app.globalData.canTokenUse === true) {
        clearInterval(timer)
        cb && cb()
      }
    }, 500)
  },


  // 获取用户信息第一步___判断用户授权状况  (全套登录入口)
  getUserInfo() {

    let _this = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              _this.getUserId(res, () => {})
            }
          })
        } else {
          this.log('用户没有授权')
          _this.myPop2.showPop();
        }
      },
    })
  },

  // 获取微信给的用户信息和token(登录态)
  getUserId(res, cb) {
    let code = wx.getStorageSync('loginCode');
    let encryptedData = res.encryptedData;
    let iv = res.iv;

    // 存储微信给的userInfo
    this.globalData.userInfo = res.userInfo;
    wx.setStorageSync('userInfo', res.userInfo)
    Http.egg(res)

    // 请求后台接口获取user_id
    this.request(this._api.login, {
      code,
      encryptedData,
      iv
    }).then(res => {
      wx.hideLoading();

      this.globalData.token = res.token;
      this.globalData.canTokenUse = true;
      wx.setStorageSync('token', res.token);
      wx.setStorageSync('token_ttl', res.expires_in); // token有效期 
      // wx.setStorageSync(`token_ttl`, 100)
      wx.setStorageSync('token_type', res.token_type);
      wx.setStorageSync('token_date', new Date()) // 取得token的日期

      // 获取用户信息
      this.userInfo(cb)

    });
  },

  // 获取用户信息(后台用户信息,最后一步)
  userInfo(cb) {
    this.request(this._api.userInfo, {})
      .then(res => {
        let userInfo = wx.getStorageSync('userInfo')
        userInfo = Object.assign(userInfo, res)
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('userId', res.id)
        wx.setStorageSync(`coin`, res.coin)
        cb && cb(res)


        // 获取登录用户权限
        this.request(this._api.userPermissions, {}).then(res => {
          this.log('登录用户权限', res)

          let userPermissions = {};

          res.data.forEach(x => {
            userPermissions[x.name] = true
          })

          wx.setStorageSync(`userPermissions`, userPermissions)

        })


        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(userInfo)
        }
      })
  },

  // 重置连接socket(首页有调用)
  connectSocket() {
    Socket.init(() => {

    })
  },

  globalData: {
    authorization: false, // 授权弹窗是否出现
    systemInfo: '', // 手机机型信息
    networkType: '', // 网络状态
    userInfo: '', // 用户信息
    token: '', // token
    token_ttl: '', // token 有效期
    routerPage: [], // 页面路由
    listStr: {
      'pages/my/index/index': 'index_list',
      'pages/Index/index': 'index_list',
      'pages/specialPosts/selectPosts/selectPosts': 'selectPosts_list',
      'pages/specialPosts/activity/activity': 'activityPosts_list',
      'pages/specialPosts/wine/wine': 'winePosts_list',
      'pages/specialPosts/talk/talk': 'talkPosts_list',
    }, // 匹配对应页面和列表字段
  }
}))