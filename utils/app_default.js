import PicUrl from '../utils/picUrl.js'
import Api from '../utils/api.js'
import Common from '../utils/common.js'
import Util from '../utils/util.js'
import * as Http from '../utils/httpModel.js'

// app默认模版
const _init = {
  href_default: `/pages/Index/index`,
  share_default: {
    path: `/pages/Index/index`,
    title: `三国咸话`,
    postsDetail_title: `三国咸话`,
  },
  logUrl: `https://testforum.hzyoka.com`,
}

// app模版初始化
const init_func = (data, _init) => {
  _init = Object.assign(_init, data)
}

// app模版内容
let app_default = {

  // 请求重新封装
  request(api, data = {}) {
    return Http.http.call(this, api, data)
  },

  // this.log封装
  log() {
    if (Api.apiUrl === _init.logUrl) {
      console.log(...arguments)
    }
  },

  // 页面跳转
  href(url = _init.href_default) {
    let indexList = [

    ];

    let routerPage = this.globalData.routerPage;
    if (!routerPage.includes(url)) {
      // 记录路由
      routerPage.push(url);
      setTimeout(res => {
        routerPage.pop();
      }, 1000);
      if (indexList.includes(url)) {
        wx.switchTab({
          url: url
        })
      } else wx.navigateTo({
        url: url
      });
    }
  },

  // 页面重定向
  redirectTo(url) {
    wx.redirectTo({
      url: url,
    });
  },

  // 错误信息提示
  toast(title = 'error!') {
    return wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  },

  // 分享函数
  sharePage(title = _init.share_default.title) {
    let path = _init.share_default.path;
    let json = {
      title: title,
      path: path,
      success: (res) => {
        this.request(this._api.shareLog, {}).then(res => {
          this.log(`分享成功`, path, res)
        })
      }
    }

    return json
  },

  sharePage_button(id, title = _init.share_default.postsDetail_title) {
    let path = `/pages/posts/index/index?id=${id}`
    let json = {
      title: title,
      path: path,
      success: (res) => {
        this.request(this._api.shareLog, {}).then(res => {
          this.log(`分享成功`, path, res)
        })
      }
    }

    return json
  },

  // 加载更多
  loadMore(_this, list, cb, loadAll = `loadAll`) {

    let meta = list + `_meta`
    let postsList = _this.data[list];
    let postsList_meta = _this.data[meta];
    let currentPage = postsList_meta.pagination.current_page;

    if (currentPage < postsList_meta.pagination.total_pages) {
      this.log(meta, postsList_meta)
      currentPage++;
      cb && cb(currentPage)
    } else {
      _this.setData({
        [loadAll]: true
      })
    }
  },

  // 下拉刷新
  downRefresh(_this, cb) {

    !cb && _this.onShow();

    let timer = setTimeout(res => {
      wx.stopPullDownRefresh()
    }, 1500)

    cb && cb()
  },

  // 图片预览
  picPreview(e) {
    let current = e.currentTarget.dataset.current;
    let urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: current,
      urls: urls,
    })
  },

  // 设定滑块高度
  scrollheight(_this, ...argument) {
    let sum = (...argument) => {
      let total = 0;
      argument.forEach(x => {
        total += x
      })
      return total * 2
    }

    let scrollHeight = wx.getSystemInfoSync().windowHeight * 2 - sum(...argument) + 'rpx';

    _this.setData({
      scrollHeight
    })
  },

  // 获取页面路由信息(param == 0 为当前页,index应取负数)
  getRouterInfo(index = 0, error) {
    let pages = getCurrentPages() //获取加载的页面

    if (pages.length - 1 + index < 0) {
      !error && console.log(`index错误,找寻不到相应页栈`)
      return
    }

    let currentPage = pages[pages.length - 1 + index] //获取当前页面的对象
    let url = currentPage.route //当前页面url
    let options = currentPage.options //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    let urlWithArgs = url + '?'
    for (let key in options) {
      let value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return {
      page: currentPage,
      urlWithArgs,
      url,
      options
    }
  },

  // 混合
  assign(obj) {

    return Object.assign({

      // 分享
      onShareAppMessage: (res) => {
        let app = getApp();

        if (res.from === 'button') {
          let id = res.target.dataset.id;
          return app.sharePage_button(id)
        } else {
          return app.sharePage()
        }
      },

      // 下拉刷新
      onPullDownRefresh: function() {
        let app = getApp();

        app.log(this)

        app.downRefresh(this)
      },

    }, obj)
  },

  // 监听页面数据变化
  initWatch(_page) {
    if (!_page) {
      this.error('未检测到Page对象,请将当前page传入该函数');
      return false;
    }
    if (!_page.watch) { //判断是否有需要监听的字段
      this.error('未检测到Page.watch字段(如果不需要监听，请移除initWatch的调用片段)');
      return false;
    }
    let _dataKey = Object.keys(_page.data);
    Object.keys(_page.watch).map((_key) => { //遍历需要监听的字段
      _page.data['__' + _key] = _page.data[_key]; //存储监听的数据
      if (_dataKey.includes(_key)) { //如果该字段存在于Page.data中，说明合法
        Object.defineProperties(_page.data, {
          [_key]: { //被监听的字段
            enumerable: true,
            configurable: true,
            set: function(value) {
              let oldVal = this['__' + _key];
              if (value !== oldVal) { //如果新设置的值与原值不等，则触发监听函数
                setTimeout(function() { //为了同步,否则如果回调函数中有获取该字段值数据时将不同步,获取到的是旧值
                  _page.watch[_key].call(_page, oldVal, value); //设置监听函数的上下文对象为当前的Page对象并执行
                }.bind(this), 0)
              }
              this['__' + _key] = value;
            },
            get: function() {
              return this['__' + _key]
            }
          }
        })
      } else {
        this.error('监听的属性[' + _key + ']在Page.data中未找到，请检查~')
      }
    })
  },

  // 对上一页列表数据进行同步修改(list_str:列表缓存键名,postsList:page.data中列表键名,list_array:列表键值)
  prevPage_change(cb) {

    let currentUrl = this.getRouterInfo(0).url;

    // 根据上一页router.url来匹配列表相应字段
    let getStr = (pageStr) => {
      let listStr = this.globalData.listStr;

      if (listStr[pageStr]) {
        return listStr[pageStr]
      } else {
        throw `cannt find ${pageStr}`;
      }
    }

    // 具体同步数据
    let sync_prevPage = (list_array, list_str) => {
      if (!Array.isArray(list_array)) {
        throw "list_array is not Array";
      }

      cb && cb(list_array, list_str)
    }

    if (currentUrl === `pages/posts/index/index`) {
      let prevPage = this.getRouterInfo(-1);
      let list_str = getStr(prevPage.url);
      let list_array = wx.getStorageSync(list_str);
      sync_prevPage(list_array, list_str)
    }
  },

  _pic: PicUrl,
  _api: Api,
  _func: Common,
  _util: Util,

}


module.exports = {
  _init,
  init: init_func,
  app_default
}


/*
    const app = getApp()
    Page({
      data: {
        appList: [], //应用列表数据    
        pageIndex: 0, //当前页码索引
        isLoading: false //是否正在加载中
      },
      watch: { //需要监听的字段
        'pageIndex': function(value) {
          this.log('监听数据-pageIndex', value, this)
        },
        'isLoading': function(value) {
          this.log('监听数据-isLoading', value, this)
        }
      },
      onLoad() {
        app.initWatch(this) //初始化需要监听的字段
      }
    })
  */