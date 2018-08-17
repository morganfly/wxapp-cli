import PicUrl from '/utils/picUrl.js';
import Api from '/utils/api.js';
import Common from '/utils/common.js';
import Util from '/utils/util.js';
import * as Http from '/utils/httpModel.js';

let Socket = require(`/utils/socket.js`);

// 引入app模版对象
import Default from '/utils/app_default.js'


// 初始化app默认配置
let _init = Default.init({}, Default._init)

//app.js 
App(Object.assign({}, Default.app_default, {
  onLaunch() {
    this.isHasTokenTime().then(() => {
      // token过期，需要重新登录

      this.log('token isHasTokenTime过期')
      wx.clearStorageSync();

      this.login()

    }).catch(() => {
      this.globalData.canTokenUse = true;
    })

    // Socket.init(function() {})
  },

  // 检查token是否过期(过期则调用登录接口)
  isHasTokenTime() {
    return new Promise((resolve, reject) => {
      let _this = this;
      let serverTime = wx.getStorageSync('token_ttl');
      let tokenTime = wx.getStorageSync(`token_date`) ? wx.getStorageSync('token_date') : new Date().getTime()
      let curTime = new Date();
      let lefttime = parseInt((curTime.getTime() - tokenTime) / 1000);

      this.log(`token已存在时间`, lefttime)
      this.log(`token有效时间`, serverTime)

      if (lefttime >= serverTime) {
        resolve()
      } else {
        reject()
      }
    })
  },


  // 检查token是否可用
  checkToken(cb) {
    let app = getApp();
    let timer = setInterval(() => {
      if (app.globalData.canTokenUse === true) {
        clearInterval(timer)
        cb && cb()
      }
    }, 500)
  },


  // 登录
  login() {
    wx.login({
      success: res => {
        let code = res.code;
        wx.setStorageSync('loginCode', code)
        this.hasToken()
      }
    })
  },

  // 如果token存过但过期情况下,重新调用用户信息接口;如果token不存在情况下,则弹出授权弹窗   
  hasToken() {
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
      wx.setStorageSync('token_type', res.token_type);
      wx.setStorageSync('token_date', new Date()) // 取得token的日期
    });
  },

  // 获取用户信息(后台用户信息,登录最后一步)
  userInfo(cb) {
    this.request(this._api.userInfo, {})
      .then(res => {
        let userInfo = wx.getStorageSync('userInfo')
        userInfo = Object.assign(userInfo, res)
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('userId', res.id)
        cb && cb(userInfo)
      })
  },

  // 重置连接socket
  connectSocket() {
    Socket.init(() => {

    })
  },

  globalData: {
    authorization: false, // 授权弹窗是否出现
    systemInfo: '', // 手机机型信息
    networkType: '', // 网络状态
    loginCode:'',
    userInfo: '', // 用户信息
    token: '', // token
    token_ttl: '', // token 有效期
    token_type:'',
    routerPage: [], // 页面路由
  }
}))