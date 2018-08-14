const app = getApp();

Component({
  properties: {
    from: String
  },
  data: {

  },
  methods: {
    // 发表话题
    pubilshPosts() {
      if (this.data.from) {
        app.href(`/pages/posts/public/public?from=${this.data.from}`)
      } else {
        app.href('/pages/posts/public/public')
      }
    }
  }
})