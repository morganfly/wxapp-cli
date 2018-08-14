const app = getApp();
const Socket = require(`../../utils/socket.js`);

Page(app.assign({
  data: {
    classArray: [],
    userInfo: '',
    inputSwitch: false,
    postsList: [],
    postsList_meta: {},
    loadAll: false,
    posts_userLast: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollHeight: '',
    role: '',
    // subsection_message: {},
    // unread_count: '',
  },
  onLoad: function(options) {
    // 手动调用微信授权按钮 
    app.myPop2 = this.selectComponent('#popTip2')

    // 设定滑块高度
    app.scrollheight(this, 0)

    app.checkToken.call(this, () => {
      this.getUserInfo();
      this.getPostsList(1, 1, res => {
        // 将精选帖子拼接到帖子列表内
        this.selectConcat(res)
      });

      // 获取动态数量
      // app._func.unread_num.call(this, (res) => {
      //   this.setData({
      //     unread_count: res.unread_count
      //   })
      // })

      // 连接socket来获取帖子子版块的消息通知
      if (wx.getStorageSync(`userId`) && !Socket.getConnStatus()) {
        app.connectSocket()
      }
    })

  },
  onShow: function() {
    // 从缓存里获取数据丢入data中
    this.setData({
      userInfo: wx.getStorageSync(`userInfo`) || '',
      postsList: wx.getStorageSync(`index_list`) || [],
      postsList_meta: wx.getStorageSync(`index_list_meta`) || {},
      subsection_message: wx.getStorageSync(`subsection_message`) || {},
    })


    app.checkToken.call(this, () => {

      // 获取动态数量
      app._func.unread_num.call(this, (res) => {
        this.setData({
          unread_count: res.unread_count
        })
      })
    })


  },
  onReachBottom: function() {
    this.loadMore();
  },
  onPullDownRefresh: function() {
    this.onLoad();

    let timer = setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  // 拼接精品帖到帖子列表内
  selectConcat() {
    app._func.select_postsList.call(this, res => {
      let postsList = this.data.postsList;
      let index_list = wx.getStorageSync(`index_list`);
      let selectPostsList = res.data;

      if (Array.isArray(selectPostsList)) {

        index_list = res.data.concat(index_list)
        postsList = res.data.concat(postsList)
        app.log(postsList)
        this.setData({
          postsList
        })
        wx.setStorageSync(`index_list`, index_list)
      }
    })
  },

  // 跳转到咸豆专区
  dd_history() {
    app.href(`/pages/exchange/dd_history/dd_history`)
  },

  // 防止index.js跑得app.js快的回调
  userInfoReadyCallback(res) {},

  // 获取帖子列表
  getPostsList(page, label, cb) {
    new Promise((resolve, reject) => {
      app._func.posts_list.call(this, page, label, res => {
        resolve()
      })
    }).then(res => {
      cb && cb(res)
    })
  },

  // 获取或者更新用户信息
  getUserInfo() {
    app.userInfo(res => {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        coin: wx.getStorageSync(`coin`)
      })
    })
  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `postsList`, (currentPage) => {
      this.getPostsList(currentPage, 1)
    })
  },

  // 登录授权
  bindGetUserInfo(res) {
    app.log(`授权反馈`, res)
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      // wx.openSetting()
      app.toast(`重新点击请授权按钮进行授权`)
      return
    }

    app.myPop2.handleClose();
    app.getUserId(res.detail)
  },

  // 更多子版块
  moreSubsection(){
    app.toast(`尽请期待`)
  },

}))