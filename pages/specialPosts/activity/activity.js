const app = getApp();

Page(app.assign({
  data: {
    postsList: [],
    postsList_meta: {},
    scrollHeight: '',
  },
  onLoad: function(options) {
    this.getPostsList(1, 3)

    // 设定滑块高度
    app.scrollheight(this, 0, 0)
  },
  onShow: function() {
    this.setData({
      userPermissions: wx.getStorageSync(`userPermissions`),
      postsList: wx.getStorageSync(`activityPosts_list`),
    })

    // 清除首页子版块的红点
    this.clearRedPoint();
  },

  // 获取帖子列表
  getPostsList(page, label) {
    app._func.posts_list.call(this, page, label)
  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `postsList`, (currentPage) => {
      this.getPostsList(currentPage, 3)
    })
  },

  // 清除首页子版块的红点
  clearRedPoint() {
    let subsection_message = wx.getStorageSync(`subsection_message`);
    if (subsection_message) {
      subsection_message.activity = false;
      wx.setStorageSync(`subsection_message`, subsection_message)
    }
  },
}))