const app = getApp();

Page(app.assign({
  data: {
    avatar_demo: app._pic.avatar_demo
  },
  onLoad: function(options) {
    // 手动调用微信授权按钮 
    app.myPop2 = this.selectComponent('#popTip2')

    app.checkToken.call(this, () => {

    })
  },
  onShow: function() {
    app.checkToken.call(this, () => {
      this.getUserInfo();
    })
  },
  onReachBottom: function() {
    this.loadMore();
  },

  // 登录授权
  bindGetUserInfo(res) {

    app.log(`授权反馈`, res)

    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      app.toast(`重新点击请授权按钮进行授权`)
      return
    }

    app.myPop2.handleClose();

    app.getUserId(res.detail)
  },

  // 获取或者更新用户信息
  getUserInfo() {
    app.userInfo(userInfo => {
      this.setData({
        userInfo: userInfo,
      })
    })
  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `postsList`, (currentPage) => {
      this.getPostsList(currentPage, 1)
    })
  },
}))