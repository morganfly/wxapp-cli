const app = getApp();

Page({
  data: {
    src: ''
  },

  onLoad: function (options) {
    let user_id = options.user_id;
    this.setData({
      src: `https://forum.hzyoka.com/bindnickname?user_id=${user_id}`
    })
  },

})