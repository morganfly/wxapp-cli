const app = getApp();

Page(app.assign({
  data: {
    userInfo: '',
    avatarList: [],
    checkId: '',
  },
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    app.log(`userInfo`, wx.getStorageSync('userInfo'))
    app._func.user_avatarList.call(this)
  },
  onShow: function() {

  },


  // 选择头像
  chooseAvatar(e) {
    let id = e.currentTarget.id;
    let avatarList = this.data.avatarList;

    avatarList.forEach(x => {
      x.check = false;
      if (id == x.id) {
        x.check = true;
      }
    })
    this.setData({
      avatarList,
      checkId: id
    })
  },

  // 选择头像(确认)
  AvatarEdit(e) {
    let id = this.data.checkId;
    if (!id) {
      app.toast(`请选择头像`)
      return
    }

    app._func.user_editAvatar.call(this, id, 'default', res => {

      let timer = setTimeout(res => {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    })
  },

  // 自定义头像
  customAvatar(e) {
    wx.chooseImage({
      success: res => {
        let tempFilePaths = res.tempFilePaths[0];
        app.href(`/pages/my/customAvatar/customAvatar?tempFilePaths=${tempFilePaths}`)
      }
    })
  },

  // 更改昵称(输入)
  nickNameInput(e) {
    this.setData({
      nick_name: e.detail.value
    })
  },

  // 更改昵称(确认)
  nickName(e) {
    let nick_name = app._util.trim.call(this, this.data.nick_name);
    if (nick_name.length == 0) {
      app.toast(`昵称不能为空`)
      return
    }

    app._func.user_editNickName.call(this, nick_name)
  },
}))