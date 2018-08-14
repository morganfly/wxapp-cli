const app = getApp();

Page(app.assign({
  data: {
    id: '',
    my_id: '',
    isMy: true,
    currentTab: 3,
    userInfo: '',
    posts_userPublish: [],
    posts_userPublish_meta: {},
    posts_userReply: [],
    posts_userReply_meta: {},
    posts_userLikes: [],
    posts_userLikes_meta: {},
    posts_userCollect: [],
    posts_userCollect_meta: {},
    loadAll: false,
    loadAll1: false,
    loadAll2: false,
    scrollHeight: '',
    dialog_hidden: true,
    shutup: `禁言`,
    ban_day: '',
  },
  onLoad: function(options) {
    let id = options.id || wx.getStorageSync('userInfo').id;
    let my_id = wx.getStorageSync('userInfo').id;
    this.pop1 = this.selectComponent('#popTip1')

    this.setData({
      id,
      my_id,
      unread_count: app.globalData.unread_count || 0,
      userPermissions: wx.getStorageSync(`userPermissions`),
    })

    // 辨别是看他人信息还是自己信息
    if (my_id != id) {
      this.setData({
        isMy: false,
        currentTab: 0,
      })

      app._func.userRelate.call(this, id)
    }

    // 设定滑块高度
    app.scrollheight(this, 300)
  },
  onShow: function() {
    let timer = setInterval(res => {
      let id = this.data.id
      if (id) {

        clearInterval(timer)

        // 获取个人资料
        this.userProfile()

        // 获取我的主题
        app._func.posts_userPublish.call(this, id, 1)

        // 获取我的回复
        app._func.posts_userReply.call(this, id, '')

        // 获取我的赞过的帖子
        app._func.posts_userLikes.call(this, id)

        // 获取关注用户的帖子
        app._func.focusedUserPosts.call(this,1)

        this.setData({
          userPermissions: wx.getStorageSync(`userPermissions`),
        })
      }
    }, 300)
  },

  // 获取用户档案
  userProfile() {
    let id = this.data.id;
    app._func.user_profile.call(this, id, res => {
      this.setData({
        shutup: res.status == 1 ? `取消禁言` : `禁言`
      })
    })
  },

  // 编辑头像
  editAvatar() {
    this.data.isMy == true && app.href(`/pages/my/avatar/avatar`)
    // if(this.data.isMy != true){

    // }
  },

  // 选项卡选择
  tabIndex(e) {
    let current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current
    })
  },
  tabBox(e) {
    if (this.data.currentTab === e.detail.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.detail.current
      });
    }
  },

  // 跳转帖子详情
  postsDetail(e) {
    let id = e.currentTarget.id;
    app.href(`/pages/posts/index/index?id=${id}`)
  },

  // 删除用户头像
  deleteAvatar(e) {
    let id = this.data.id;
    app._func.user_deleteAvatar.call(this, id, res => {
      this.onShow();
    })
  },

  // 禁言
  forbid(e) {
    let id = this.data.id;

    let forbid = (id) => {
      this.setData({
        ban_day: ``,
      })
      this.pop1.showPop()
    }

    let cancel_forbid = (id) => {
      app._func.cancel_forbid.call(this, id, res => {
        this.userProfile()
      });
    }

    new Promise((resolve, reject) => {
        if (this.data.user_profile.status === 0) {
          resolve(id)
        } else {
          reject(id)
        }
      })
      .then(forbid).catch(cancel_forbid)
  },

  // 天数禁言
  forbidDays() {
    let ban_day = this.data.ban_day;
    this._forbid(ban_day)
  },

  // 永久禁言
  forbidForever() {
    this._forbid(-1)
  },

  // 禁言天数输入
  forbidInput(e) {
    app.log(e)

    this.setData({
      ban_day: e.detail.value
    })
  },

  // 调用禁言接口
  _forbid(ban_day) {
    let id = this.data.id;

    if (isNaN(ban_day)) {
      return app.toast(`禁言天数请入数字`)
    }

    app._func.user_forbid.call(this, id, ban_day * 1, res => {
      this.userProfile()
    });
  },

  // 开关dialog_edit
  posts_edit(e) {
    this.setData({
      dialog_hidden: !this.data.dialog_hidden,
    })
  },


  // 关注我的人(我的粉丝)
  goMyFans(e) {
    app.href(`/pages/my/fans/fans?id=${this.data.id}`)
  },

  // 我关注的人
  myFocus(e) {
    app.href(`/pages/my/focusUser/focusUser?id=${this.data.id}`)
  },

  // 徽章
  goBadge(e) {
    app.href(`/pages/my/badge/badge?id=${this.data.id}`)
  },

  // 关注
  focusUser(e) {
    app._func.focusUser.call(this, this.data.id, res => {
      this.setData({
        relate: 1
      })
    })
  },

  // 取关
  cancelFocusUser(e) {
    app._func.cancelFocusUser.call(this, this.data.id, res => {
      this.setData({
        relate: 2
      })
    })
  },

  // 加载更多(我发表的)
  loadMore() {
    app.loadMore(this, `posts_userPublish`, (currentPage) => {
      app._func.posts_userPublish.call(this, id, currentPage)
    })
  },
  // 加载更多(我回复的)
  loadMore1() {
    app.loadMore(this, `posts_userReply`, (currentPage) => {
      app._func.posts_userReply.call(this, id, currentPage)
    }, `loadAll1`)
  },
  // 加载更多(我赞过的)
  loadMore2() {
    app.loadMore(this, `posts_userLikes`, (currentPage) => {
      app._func.posts_userLikes.call(this, id, currentPage)
    }, `loadAll2`)
  },
  // 加载更多(关注)
  loadMore3() {
    app.loadMore(this, `posts_focusedUser`, (currentPage) => {
      app._func.posts_userLikes.call(this, id, currentPage)
    }, `loadAll3`)
  },
}))