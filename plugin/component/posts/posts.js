let app = getApp();

Component({
  properties: {
    d: Object,
    isMy: Boolean,
    noUser: Boolean,
  },
  data: {
    e: 'hello hello',
    is_like: false,
    labelColor: [`d32a0e`, `f18f3f`, `f69d9e`, `31a7e2`],
  },
  attached() {
    this.setData({
      is_like: this.data.d.is_like
    })
  },
  methods: {
    // 跳转帖子详情
    postsDetail(e) {
      let id = e.currentTarget.id;
      app.href(`/pages/posts/index/index?id=${id}`)
    },

    // 点赞
    praise(e) {
      let id = e.currentTarget.id;
      let d = this.data.d;

      // 自已不能给自己点赞
      if (parseInt(d.user.id) === parseInt(wx.getStorageSync(`userId`))) {
        app.toast(`不能给自己的帖子点赞哦`)
        return
      }


      // 同步点赞操作到缓存
      let syncCache = (change) => {
        let currentPageUrl = app.getRouterInfo(0).url;
        let list_str = app.globalData.listStr[currentPageUrl];
        let list_array = wx.getStorageSync(list_str);

        if (!list_array) {
          throw `没有找到对应的列表信息 plugin/component/posts/posts.js line:41`
        }

        list_array.forEach((x, index) => {
          if (parseInt(x.id) === parseInt(id)) {
            change === `add` && x.like_count++;
            change === `reduce` && x.like_count--;
            x.is_like = !x.is_like;
            wx.setStorageSync(list_str, list_array);
            return
          }
        })

      }

      // 区分点赞和取消点赞
      if (d.is_like == false) {
        app._func.posts_praise.call(this, id, res => {
          d.is_like = true;
          d.like_count++;
          this.setData({
            d
          })
          syncCache(`add`)
        })
      } else {
        app._func.posts_cancelPraise.call(this, id, res => {
          d.is_like = false;
          d.like_count--;
          this.setData({
            d
          })
          syncCache(`reduce`)
        })
      };


      // app._func.posts_cancelPraise.call(this, id)
    },

    // 图片预览
    picPreview(e) {
      app.picPreview(e)
    },

    // 帖子处理
    posts_edit(e) {
      let id = e.currentTarget.id;
    },

    // 跳转用户个人中心
    toMy(e) {
      let id = e.currentTarget.dataset.user;
      app.href(`/pages/my/index/index?id=${id}`)
    },


    // 帖子关闭图标的显示和隐藏
    iconChange(e) {
      let d = this.data.d;
      let id = e.detail.id;

      d.status = e.detail.status;

      this.setData({
        d
      })
    },
  }
})