const app = getApp();

Page(app.assign({
  data: {
    currentTab: 0,
  },
  onLoad: function(options) {

  },
  onShow: function() {

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
}))