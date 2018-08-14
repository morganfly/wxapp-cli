const app = getApp();

Page(app.assign({
  data: {
    banner: '',
    hot_productList: [],
    hot_meta: {},
    recommend_productList: [],
    recommend_meta: {},
    userInfo: ``,
    coin: ``,
    myId:wx.getStorageSync(`userId`),
  },

  onLoad: function (options) {
    this.bannerImg();
    // 热门兑换
    this.productList('hot', 1, res => {
      // 为你推荐
      this.productList('recommend', 1);
    });

  },

  onShow: function () {
    this.setData({
      coin: wx.getStorageSync(`coin`),
      userInfo: wx.getStorageSync('userInfo'),
    })
  },

  // 跳转商品详情
  proDetail(e) {
    let id = e.currentTarget.id;
    app.href('/pages/exchange/pro_detail/pro_detail?id=' + id)
  },

  // 跳转商品分类
  more(e) {
    let category = e.currentTarget.dataset.category;
    app.href(`/pages/exchange/pro_list/pro_list?category=${category}`)
  },

  // banner图获取
  bannerImg() {
    app._func.bannerImg.call(this)
  },

  // 商品详情列表获取
  productList(category, page, cb) {
    app._func.pro_list.call(this, category, page, cb)
  },

  // 商品兑换 
  pro_exchange(e) {
    let id = e.currentTarget.id;
    app._func.pro_exchange.call(this, id)
  },

  // 跳转到咸豆专区
  dd_history() {
    app.href(`/pages/exchange/dd_get/dd_get`)
  },
}))