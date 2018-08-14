const app = getApp();

Page(app.assign({
  data: {
    postsList: [],
    postsList_meta: {},
    scrollheight: '',
  },
  onLoad: function(options) {
    this.getPostsList(1, '')

    // 设定滑块高度
    app.scrollheight(this, 0, 0)
  },
  onShow: function() {
    this.setData({
      postsList: wx.getStorageSync(`winePosts_list`),
      userPermissions: wx.getStorageSync(`userPermissions`),
    })

    this.clearRedPoint();
  },

  // 获取帖子列表
  getPostsList(page, label) {
    app._func.posts_list.call(this, page, 4, res => {})
  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `postsList`, (currentPage) => {
      this.getPostsList(currentPage, 4, res => {}, 1)
    })
  },

  // 清除首页子版块的红点
  clearRedPoint() {
    let subsection_message = wx.getStorageSync(`subsection_message`);
    if (subsection_message) {
      subsection_message.zhujiu = false;
      wx.setStorageSync(`subsection_message`, subsection_message)
    }
  },
}))