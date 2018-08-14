let app = getApp();

import Emoji from '../../../plugin/importServer/emoji/emoji.js'

Component({
  properties: {
    isShow: Boolean,
    target_user_id: String,
    parent_id: String,
    topic: String,
  },
  data: {
    body: '',
    imgList: [],
    bottom: 0,
  },
  attached: function() {
    Emoji.init.call(this)
  },
  methods: {
    // 回复内容输入
    contentInput(e) {
      let body = e.detail.value
      this.setData({
        body
      })
    },

    // 回复——确定
    reply() {
      let body = this.data.body;
      let topic = this.data.topic;
      let parent_id = this.data.parent_id;
      let target_user_id = this.data.target_user_id;
      let imgList = this.data.imgList;
      if (body.length < 1) {
        app.toast(`话题内容,至少一个字`)
        return
      }

      app._func.posts_reply.call(this, topic, body, imgList, parent_id, target_user_id, res => {
        this.setData({
          body: ''
        })

        // 同步缓存数据
        let sync = () => {
          let prevUrl = app.getRouterInfo(-1).url;
          let list_str = app.globalData.listStr[prevUrl]
          let list_array = wx.getStorageSync(list_str)

          if (parent_id) { //并不是直接回复帖子
            return
          }

          if (!Array.isArray(list_array)) {
            throw TypeError
          }

          list_array.forEach((x, index) => {
          
            if (parseInt(x.id) === parseInt(topic)) {

              x.reply_count++;
              wx.setStorageSync(list_str, list_array)
              return
            }
          })
        }

        sync()
      })
    },

    // 取消回复
    cancelReply() {
      this.setData({
        body: '',
      })
      this.triggerEvent('replyShow', {
        noRefresh: true
      })
    },

    // 表情选择
    emojiShowHide(e) {
      Emoji.emojiShowHide.call(this, e)
    },

    // 点击emoji背景遮罩隐藏emoji盒子
    emojiChoose(e) {
      Emoji.emojiChoose.call(this, e)
    },

    // 点击emoji背景遮罩隐藏emoji盒子
    cemojiCfBg(e) {
      Emoji.cemojiCfBg.call(this, e)
    },

    // 上传图片
    uploadImg(e) {
      app._func.img_upload.call(this, `topic`)
    },

    // 删除图片
    imgDelete(e) {
      let index = e.currentTarget.dataset.index;
      let imgList = this.data.imgList;
      app.log(`删除前`, imgList)
      imgList.splice(index, 1)
      app.log(`删除后`, imgList)
      this.setData({
        imgList
      })
    },

    // 获取键盘高度
    getHeight(e) {
      this.setData({
        bottom: e.detail.height * 2
      })
    }
  },
})