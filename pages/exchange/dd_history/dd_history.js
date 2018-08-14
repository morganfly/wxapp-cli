const app = getApp();

Page(app.assign({
  data: {
    logs: [],
    logs_meta: {},
    coin: 0,
    scrollHeight: '',
  },
  onLoad: function (options) {
    // 设定滑块高度
    app.scrollheight(this, 162)
  },
  onShow: function () {
    app._func.dd_log.call(this)
    this.setData({
      coin: wx.getStorageSync(`coin`)
    })
  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `logs`, (currentPage) => {
      app._func.dd_log.call(this, currentPage)
    })
  } 
}))