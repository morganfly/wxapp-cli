const app = getApp()

Component({
  properties: {
    title: String
  },
  data: {
    prevPage: '',
    currentUrl: '',
  },
  attached: function() {
    let prevPage = app.getRouterInfo(-1, `noError`);
    let currentUrl = ap.getRouterInfo()

    this.setData({
      prevPage,
      currentUrl,
    })
  },

  methods: {
    // 返回上一页
    goBack() {
      let prevPage = this.data.prevPage;
      let currentUrl = this.data.currentUrl;

      if (!prevPage && currentUrl === `pages/posts/index/index`) {
        wx.redirectTo({
          url: '/pages/Index/index',
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    },
  }
})