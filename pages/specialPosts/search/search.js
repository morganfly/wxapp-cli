const app = getApp();

Page(app.assign({
  data: {
    keyword: '',
    postsList: [],
    postsList_meta: {},
    loadAll: false,
  },
  onLoad: function(options) {

  },
  onShow: function() {

  },
  onReachBottom: function() {
    this.loadMore();
  },

  // 输入关键字
  searchInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },


  // 清除关键字
  searchInputClear(e) {
    this.setData({
      keyword: ``
    })
  },

  // 搜索_确认 
  searchCertain() {
    let keyword = this.data.keyword;

    if (!keyword) return app.toast(`搜索关键字不可为空`)

    this._search(keyword, 1)

  },

  // 通过关键字进行搜索
  _search(keyword, page, cb, limit) {
    app._func.posts_search.call(this, keyword, page)
  },



  // 加载更多
  loadMore() {
    let page = this.data.postsList_meta.pagination.current_page;
    page++
    this._search(this.data.keyword, page)
  },

}))