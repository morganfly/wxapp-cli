const app = getApp();

Component({
  properties: {
    postsInfo: Object,
    userPermissions: Object,
  },
  data: {
    dialog_hidden: true,
    myId: wx.getStorageSync('userId'),
    userPermissions: wx.getStorageSync('userPermissions'),
    mark_text: ``,
    posts_status: ``,
    reason_delete: ``,
  },
  attached: function() {
    this.pop0 = this.selectComponent('#popTip0')
    this.pop1 = this.selectComponent('#popTip1')

    // 解决第一次授权时还没有获得userPermissions问题
    let timer = setInterval(() => {
      if (wx.getStorageSync(`userPermissions`)) {
        clearInterval(timer)
        this.setData({
          userPermissions: wx.getStorageSync(`userPermissions`)
        })
      }
    }, 500)

  },
  methods: {
    // 开关dialog_edit
    posts_edit(e) {
      this.setData({
        dialog_hidden: !this.data.dialog_hidden,
        mark_text: this.data.postsInfo.is_collection === false ? '收藏' : '取消收藏',
        posts_status: this.data.postsInfo.status === 0 ? '关闭帖子' : '恢复帖子',
      })
    },

    // 操作二次确认(关闭和删除)
    confirmOperation(e) {
      let num = e.currentTarget.dataset.num;
      this.setData({
        reason_delete: ``,
      })
      this[`pop${num}`].showPop();
    },

    // input删除理由
    reason_delete(e) {
      this.setData({
        reason_delete: e.detail.value
      })
    },

    // 删除帖子
    postsDelete(e) {
      let reason_delete = this.data.reason_delete;

      if (!reason_delete) return app.toast(`请输入删除理由`)

      let postsDetailDelete = (currentPage) => {
        return new Promise((resolve, result) => {
          // 同步修改上一页列表数据
          let prevUrl = app.getRouterInfo(-1).url;
          let list_str = app.globalData.listStr[prevUrl];

          let list_array = wx.getStorageSync(list_str);
          list_array.forEach((x, index) => {
            if (parseInt(x.id) === parseInt(this.data.postsInfo.id)) {
              delete list_array[index]
              return
            }
          })

          wx.setStorageSync(list_str, list_array)

          let timer = setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 500)

          resolve()
        })
      }

      let notPostsDetailDelete = (currentPage) => {
        return new Promise((resolve, result) => {
          currentPage.data.postsList.forEach((x, index) => {

            if (x.id === this.data.postsInfo.id) {

              currentPage.data.postsList.splice(index, 1)

              currentPage.setData({
                postsList: currentPage.data.postsList
              })

              let currentUrl = currentPage.route;
              let list_str = app.globalData.listStr[currentUrl];
              let list_array = wx.getStorageSync(list_str);
              delete list_array[index]
              wx.setStorageSync(list_str, list_array)
            }

            this.posts_edit()

            resolve()
          })
        })
      }

      new Promise((resolve, reject) => {
          app._func.posts_delete.call(this, this.data.postsInfo.id, reason_delete, res => {
            let currentPage = getCurrentPages()[getCurrentPages().length - 1];

            if (currentPage.route === `pages/posts/index/index`) {
              resolve(currentPage)
            } else {
              reject(currentPage)
            }
          })
        })
        .then(postsDetailDelete)
        .catch(notPostsDetailDelete)
        .then()
    },

    // 关闭帖子
    postsClose(e) {
      let id = this.data.postsInfo.id;

      let closePosts = () => {
        return new Promise((resolve, result) => {
          app._func.posts_close.call(this, this.data.postsInfo.id, res => {
            this.posts_edit()
            let postsInfo = this.data.postsInfo;

            postsInfo.status = 1;
            resolve(postsInfo)
          })
        })
      }

      let cancelClosePosts = () => {
        return new Promise((resolve, reject) => {
          app._func.posts_open.call(this, this.data.postsInfo.id, res => {
            this.posts_edit()
            let postsInfo = this.data.postsInfo;

            postsInfo.status = 0;
            resolve(postsInfo)
          })
        })
      }

      new Promise((resolve, reject) => {
          if (this.data.postsInfo.status === 0) {
            resolve()
          } else {
            reject()
          }
        })
        .then(closePosts)
        .catch(cancelClosePosts)
        .then((postsInfo) => {
          this.triggerEvent('iconChange', {
            status: postsInfo.status,
            id,
          }, {
            capturePhase: true
          })

          this.setData({
            postsInfo,
          })
        })
    },

    // 收藏帖子
    postsMark(e) {
      let topic = this.data.postsInfo.id;
      let postsInfo = this.data.postsInfo;

      let collect = () => {
        return new Promise((resolve, reject) => {
          app._func.posts_collect.call(this, topic, res => {
            app.toast(`收藏成功`)
            resolve(true)
          })
        })
      }

      let cancelCollect = () => {
        return new Promise((resolve, reject) => {
          app._func.posts_cancelCollect.call(this, topic, res => {
            app.toast(`取消收藏成功`)
            resolve(false)
          })
        })
      }

      new Promise((resolve, reject) => {
          if (this.data.postsInfo.is_collection === false) {
            resolve()
          } else {
            reject()
          }
        })
        .then(collect)
        .catch(cancelCollect)
        .then((is_collection) => {

          postsInfo.is_collection = !postsInfo.is_collection;
          this.setData({
            postsInfo
          })

          app.prevPage_change((list_array, list_str) => {
            list_array.forEach((x, index) => {
              if (parseInt(x.id) === parseInt(topic)) {
                x.is_collection = is_collection
                return
              }
            })

            wx.setStorageSync(list_str, list_array)
          })


          this.posts_edit();
        })
    },

    // 编辑帖子
    postsEdit(e) {
      this.posts_edit()
      wx.setStorageSync(`editPosts`, this.data.postsInfo)
      app.href(`/pages/posts/public/public?type=edit`)
    },

    // 设置标签帖子
    setLabel(e) {
      let labelId = e.currentTarget.dataset.labelId;
      let topic = this.data.postsInfo.id;

      app._func.setLabel.call(this, topic, labelId, res => {

        app.toast(`标签设置成功,刷新列表后可正确显示标签`)
        this.posts_edit()
      })
    },


  },
})