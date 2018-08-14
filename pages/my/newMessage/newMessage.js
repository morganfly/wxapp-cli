const app = getApp();

Page(app.assign({
  data: {
    isShow: false,
  },
  onLoad: function(options) {
    // 获取我的动态列表 
    app._func.unread_list.call(this, 1)

    // 设定滑块高度
    app.scrollheight(this, 0)
  },
  onShow: function() {

  },
  onReachBottom: function() {
    this.loadMore()
  },
  onHide: function() {
    this.cancel_redPoint();
  },
  onUnload: function() {
    this.cancel_redPoint();
  },

  // 删帖,删头像,禁言取消红点
  cancel_redPoint() {
    let unread_list = this.data.unread_list;
    let ids = [];
    unread_list.forEach((x, index) => {
      if (!x.read_at && [`topicdelete`, 'deleteavatar', 'forbiduser', 'userFocus'].includes(x.data.type)) {
        ids.push(x.id)
      }
    })
    if (ids.length > 0) {
      app._func.unread_clear.call(this, ids)
    }
  },

  // 进入帖子详情并取消红点
  message(e) {
    let topic_id = e.currentTarget.id;
    let id = e.currentTarget.dataset.unreadId;
    let type = e.currentTarget.dataset.type;
    let read_at = e.currentTarget.dataset.read;
    let reply_id = e.currentTarget.dataset.replyId;

    // 消除动态红点
    !read_at && app._func.unread_clear.call(this)

    if (topic_id && type != `topicdelete`) {
      app.href(`/pages/posts/index/index?id=${topic_id}&&position=${reply_id}&&positionType=${type}`)
    }
  },

  // 回复
  reply(e) {
    let topic = e.currentTarget.dataset.topic;
    let userInfo = wx.getStorageSync(`userInfo`)

    if (userInfo.status == 1) {
      app.toast(`您已经被禁言`)
      return
    }

    // 有parentId为楼中楼
    if (e.currentTarget.dataset.parentid) {
      let parent_id = e.currentTarget.dataset.parentid;
      let target_user_id = e.currentTarget.dataset.targetid;
      this.setData({
        parent_id,
        target_user_id,
        id: topic,
      })
    } else {
      this.setData({
        parent_id: e.currentTarget.dataset.parentid,
        target_user_id: e.currentTarget.dataset.targetid,
        id: topic,
      })
    }
    this.replyShow()
  },

  // 回帖弹框的出现和隐藏
  replyShow(e) {
    let isShow = this.data.isShow;
    this.setData({
      isShow: !isShow
    })
    if (this.data.isShow == false) {
      // 获取我的动态列表 
      app._func.unread_list.call(this)
    }
  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `unread_list`, (currentPage) => {
      app._func.unread_list.call(this, currentPage)
    })
  },

  // 用户详情
  userDetail(e) {
    let id = e.currentTarget.dataset.id;
    app.href(`/pages/my/index/index?id=${id}`)
  },
}))