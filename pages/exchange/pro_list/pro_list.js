const app = getApp();

Page(app.assign({
  data: {
    product: {
      imgUrl: '/img/pic3.png',
      name: '貂蝉手办',
      intro: '直播间送主播的必备',
      price: 80000
    },
    proList: [],
    proList_meta: {},
    hot_productList: [],
    hot_productList_meta: {},
    recommend_productList: [],
    recommend_productList_meta: {},
  },
  onLoad: function (options) {
    let category = options.category;
    this.setData({ category })
    this.productList(category);

    // 设定滑块高度
    app.scrollheight(this, 0)
  },

  // 商品详情列表获取
  productList(category, page = 1, cb) {
    app._func.pro_list.call(this, category, page)
  },

  // 跳转商品详情
  proDetail(e) {
    let id = e.currentTarget.id;
    app.href('/pages/exchange/pro_detail/pro_detail?id=' + id)
  },

  // 加载更多
  loadMore() {
    let category = this.data.category;
    let list = category + `_productList`
    app.loadMore(this, list, (currentPage) => {
      this.productList(category, currentPage)
    })
  },
}))