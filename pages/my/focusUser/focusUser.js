const app = getApp();

Page(app.assign({
  data: {
    fansList: [],
    fansList_meta: {},
  },
  onLoad: function(options) {
    this.setData({
      userId: options.id,
    })

    this.fansList(this.data.userId, 1)
  },
  onShow: function() { 

  },
  onReady() {
    // this.videoContext = wx.createVideoContext('myVideo')
  },

  // 获取我的关注列表(变量名与粉丝列表相同)
  fansList(user, page) {
    app._func.userFocused.call(this, user, page)
  },

  // 关注
  focusUser(e) {
    let userId = e.currentTarget.dataset.user;
    app._func.focusUser.call(this, userId, res => {
      let fansList = this.data.fansList;
      fansList.map(x => {
        if (x.user.id === userId) {
          x.isFocused = !x.isFocused
        }
      })
      this.setData({
        fansList
      })
    })
  },

  // 取关
  cancelFocusUser(e) {
    let userId = e.currentTarget.dataset.user;
    
    app._func.cancelFocusUser.call(this, userId, res => {
      let fansList = this.data.fansList;
      fansList.map(x => {
        if (x.user.id === userId) {
          x.isFocused = !x.isFocused
        }
      })
      this.setData({
        fansList
      })
    })
  },

}))