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
 
  // 获取我的粉丝列表
  fansList(user, page) {
    app._func.userFans.call(this, user, page)
  },

  // 关注
  focusUser(e) {
    let userId = e.currentTarget.dataset.user;
    app._func.focusUser.call(this, userId, res => {
      let fansList = this.data.fansList;
      fansList.map(x => {
        if (x.user.id === userId) {
          x.is_focus_each_other = !x.is_focus_each_other
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
    console.log(userId)
    app._func.cancelFocusUser.call(this, userId, res => {
      let fansList = this.data.fansList;
      fansList.map(x => {
        if (x.user.id === userId) {
          x.is_focus_each_other = !x.is_focus_each_other
        }
      })
      this.setData({
        fansList
      })
    })
  },

  // 前往用户详情
  userDetail(e){
    let userId = e.currentTarget.dataset.id;
    app.href(`/pages/my/index/index?id=${userId}`)
  },

}))