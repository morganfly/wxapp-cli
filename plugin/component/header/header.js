let app = getApp();

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    userInfo: Object,
    postsDetail: Object,
    myId: String,
    userPermissions: Object,
    noNickName: String,
  },
  data: {
    optionsShow: false,
    role: '',
  },

  attached: function() {

  },
  methods: {
    // 跳转到个人页
    toMy(e) {
      let id = e.currentTarget.id;
      app.href(`/pages/my/index/index?id=${id}`)
    },

    // 跳转绑定页面
    bindAccount() {
      let userInfo = this.data.userInfo;
      app.href(`/pages/bindAccount/bindAccount?user_id=${userInfo.id}`)
    },
  }
})