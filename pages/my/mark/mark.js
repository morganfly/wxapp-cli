const app = getApp();

Page(app.assign({
  data: {
    isMy: true,
    posts_userCollect: [],
    posts_userCollect_meta: {},
  },
  onLoad: function (options) {
    // 设定滑块高度
    app.scrollheight(this, 0)
  },
  onShow: function () {
    let user_id = wx.getStorageSync(`userId`);

    // 获取我的主题
    app._func.posts_userCollect.call(this, user_id)
  },

  // 跳转帖子详情
  postsDetail(e) {
    let id = e.currentTarget.id;
    app.href(`/pages/posts/index/index?id=${id}`)
  },

  // 加载更多
  loadMore() {
    let user_id = wx.getStorageSync(`userId`);

    app.loadMore(this, `posts_userCollect`, (currentPage) => {
      this.posts_userCollect(user_id, currentPage)
    })
  },
}))