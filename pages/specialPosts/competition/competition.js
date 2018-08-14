const app = getApp();

Page(app.assign({
  data: {

  },
  onLoad: function (options) {
    wx.showModal({
      title: '暂未开放',
      content: '敬请期待',
      complete: res => {
        app.redirectTo(`/pages/Index/index`)
      }
    })
  },
  onShow: function () {

  },
}))