const app = getApp();

Page(app.assign({
  data: {
    coin: 0,
  },
  onLoad: function (options) {

  },
  onShow: function () {
    app._func.dd_tasks.call(this)
    this.setData({
      coin: wx.getStorageSync(`coin`)
    })
  },

  // 领取奖励
  getBonus(e) {
    let id = e.currentTarget.id;
    app._func.dd_bonus.call(this, id, res => {
      app._func.dd_tasks.call(this)
    })
  }
}))