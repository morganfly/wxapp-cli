const app = getApp();

Page(app.assign({
  data: {
    id: '',
    postsDetail: '',
    isPraised: false,
    isShow: false,
    target_user_id: '',
    parent_id: '',
    is_collection: false,
    replyList: [],
    replyList_meta: {},
    onlyAuthor: 0,
    isMy: false,
    userId: wx.getStorageSync('userId'),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function(options) {
    // 手动调用微信授权按钮 
    app.myPop2 = this.selectComponent('#popTip2');

    // id 处理
    let id = options.id;
    this.setData({
      id,
      userPermissions: wx.getStorageSync(`userPermissions`),
      position: options.position || '',
      positionType: options.positionType || '',
    })
  },

  onShow: function() {
    let timer = setInterval(() => {
      if (this.data.id) {
        clearInterval(timer)
        let id = this.data.id;
        this.postsDetail(id)
        this.replyList(id)
        this.setData({
          userId: wx.getStorageSync(`userId`)
        })
      }
    }, 500)
  },

  onReady: function() {

  },

  onReachBottom: function() {
    this.loadMore();
  },

  onShareAppMessage: function(res) {
    let id = this.data.id;
    return {
      title: `三国咸话`,
      path: `/pages/posts/index/index?id=${id}`
    }
  },

  // 只看楼主
  onlyAuthor() {
    this.data.onlyAuthor == 0 ? this.setData({
      onlyAuthor: 1
    }) : this.setData({
      onlyAuthor: 0
    })
    this.replyList(this.data.id)
  },

  // 获取帖子详情
  postsDetail(topic) {
    wx.showLoading({
      title: 'loading',
    })
    app._func.posts_detail.call(this, topic, res => {
      this.setData({
        is_collection: res.is_collection,
        is_praise: res.is_like,
      })

      wx.getStorageSync(`userId`) == res.user.id && this.setData({
        isMy: true
      })

      wx.hideLoading()
      // app._func.img_reSize.call(this, this.data.postsDetail.body_image)
    })
  },

  // 获取帖子回复列表
  replyList(topic, page = 1) {
    let onlyAuthor = this.data.onlyAuthor;
    app._func.posts_replyList.call(this, topic, onlyAuthor, page, res => {
      this.scrollTop();
    })
  },

  // 锚点定位
  scrollTop() {
    let query = wx.createSelectorQuery()
    let str = `#${this.data.position}`
    let positonType = this.data.positionType;

    console.log(this.data.position, positonType)

    if (this.data.position && this.data.position !== 'undefined' && positonType !== '') {
      switch (positonType) {
        case 'reply':
          {
            query.selectAll(`.blockFrame .reply`).boundingClientRect()
            break
          }
        case 'replyReply':
          {
            query.selectAll(`.blockFrame .replyComment`).boundingClientRect()
            break
          }
        default:
          {
            break
          }
      }

      query.exec((res) => {
        console.log(res)

        let list = res[0]
        list.map(x => {
          if (x.id == this.data.position) {
            wx.pageScrollTo({
              scrollTop: x.top,
            }, 500)
          }
        })
      })
    }
  },

  // 对帖子点赞
  praise(e) {
    let id = this.data.id;
    let d = this.data.postsDetail;
    let is_praise = this.data.is_praise;

    // 区分点赞和取消点赞
    if (is_praise == false) {
      app._func.posts_praise.call(this, id, res => {
        this.data.postsDetail.like_count++;
        this.setData({
          is_praise: true,
          postsDetail: d,
        })
        prevPage_change(`add`)
      })
    } else {
      app._func.posts_cancelPraise.call(this, id, res => {
        this.data.postsDetail.like_count--;
        this.setData({
          is_praise: false,
          postsDetail: d,
        })
        prevPage_change(`reduce`)
      })
    }

    // 对上一页列表数据进行同步修改
    let prevPage_change = (change) => {
      app.prevPage_change.call(this, (list_array, list_str) => {

        list_array.forEach((x, index) => {
          if (parseInt(x.id) === parseInt(id)) {
            change === `add` && x.like_count++;
            change === `reduce` && x.like_count--;
            x.is_like = !x.is_like;
            wx.setStorageSync(list_str, list_array);
            return
          }
        })
      })
    }
  },

  // 回复状况区别(回复楼中楼和回复帖子)
  reply(e) {
    let topic = this.data.id;
    let userInfo = wx.getStorageSync(`userInfo`);
    let postsStatus = this.data.postsDetail.status;

    // let status = this.currentTarget.dataset.status;

    if (userInfo.status == 1) {
      app.toast(`您已经被禁言`)
      return
    }

    if (postsStatus == 1) {
      app.toast(`该帖子已关闭,禁止回复`)
      return
    }

    // 有parentId为楼中楼
    if (e.currentTarget.dataset.parentid) {
      let parent_id = e.currentTarget.dataset.parentid;
      let target_user_id = e.currentTarget.dataset.targetid;
      this.setData({
        parent_id,
        target_user_id,
      })
    } else {
      this.setData({
        parent_id: '',
        target_user_id: '',
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
    if (this.data.isShow == false && !e.detail.noRefresh) {
      this.replyList(this.data.id)
    }
  },

  // 对回复点赞
  replyPraise(e) {
    let id = e.currentTarget.id;
    app._func.reply_praise.call(this, id, res => {
      this.replyList(this.data.id)
    })
  },

  // 删除回复
  replyDelete(e) {
    let topic = this.data.id;
    let reply = e.currentTarget.id;
    app._func.reply_delete.call(this, topic, reply, res => {
      this.replyList(topic)
    })
  },

  // 收藏 和 取消收藏 帖子
  collectSwitch() {
    let topic = this.data.postsDetail.id;

    // 收藏
    let collect = (topic) => {
      return new Promise((resolve, reject) => {
        app._func.posts_collect.call(this, topic, res => {
          app.toast(`收藏成功`)
          this.setData({
            is_collection: true
          })

          resolve(true)

        })
      })
    }

    // 取消收藏
    let cancelCollect = (topic) => {
      return new Promise((resolve, reject) => {
        app._func.posts_cancelCollect.call(this, topic, res => {
          app.toast(`取消收藏成功`)
          this.setData({
            is_collection: false
          })
        })

        resolve(false)
      })
    }

    // 收藏和取消收藏
    new Promise((resolve, reject) => {
        if (this.data.is_collection == false) {
          app.log(`收藏帖子`)
          resolve(topic)
        } else {
          app.log(`取消收藏帖子`)
          reject(topic)
        }
      })
      .then(collect)
      .catch(cancelCollect)
      .then((is_collection) => {
        app.prevPage_change((list_array, list_str) => {
          list_array.forEach((x, index) => {
            if (parseInt(x.id) === parseInt(topic)) {
              x.is_collection = is_collection;
              return
            }
          })

          wx.setStorageSync(list_str, list_array)
        })
      })

  },

  // 预览图片
  picPreview(e) {
    app.picPreview(e)
  },

  // 跳转用户个人中心
  toMy(e) {
    let id = e.currentTarget.dataset.user;
    app.href(`/pages/my/index/index?id=${id}`)
  },

  // 帖子关闭图标的显示和隐藏
  iconChange(e) {

    // 当前页面数据变动
    let postsDetail = this.data.postsDetail;
    let id = e.detail.id;

    postsDetail.status = e.detail.status;

    this.setData({
      postsDetail
    })

    // 对上一页列表数据进行同步修改
    app.prevPage_change.call(this, (list_array, list_str) => {
      list_array.forEach((x, index) => {
        if (parseInt(x.id) === parseInt(id)) {
          x.status = e.detail.status
          wx.setStorageSync(list_str, list_array);
          return
        }
      })
    });

  },

  // 加载更多
  loadMore() {
    app.loadMore(this, `replyList`, (currentPage) => {
      this.replyList(this.data.id, currentPage)
    })
  },

  // 登录授权
  bindGetUserInfo(res) {
    app.log(`授权反馈`, res)
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      // wx.openSetting()
      app.toast(`重新点击请授权按钮进行授权`)
      return
    }

    app.myPop2.handleClose();
    app.getUserId(res.detail)
  },

}))