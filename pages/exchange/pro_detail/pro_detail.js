const app = getApp();

Page(app.assign({
  data: {
    pro_info: {
      title: '三国杀 "筛子版"',
      text: '《三国杀》是中国传媒大学动画学院04级游戏专业学生设计，由北京游卡桌游文化发展有限公司出版发行的一款热门的桌...'
    },
    pro_intro: {
      title: '商品介绍',
      text: '40000咸豆可兑换'
    },
    pro_date: {
      title: "兑换期限",
      text: '2018年4月9日17:42:08至2018年9月9日17:42:08'
    },
    pro_rule: {
      title: '兑换规则',
      rule: [
        '礼品数量有限，先兑先得，兑完即止。礼品兑换成功后，会扣除相应点券，已兑换礼品不能退换。',
        '兑换成功后，您可以到“兑换记录”中查询已兑换礼品。',
        '兑换礼品由礼品供应商提供，所有礼品均以实物为准，除礼品本身存在质量瑕疵外，均不允许换货。所兑换的礼品如有质量'
      ]
    }
  },
  onLoad: function (options) {
    let id = options.id;
    this.setData({ id });
    this.productDetail(id);

  },
  onShow: function () {
    return app.sharePage();
  },

  // 获取商品详情
  productDetail(id) {
    app._func.pro_detail.call(this, id)
  },

  // 商品兑换
  pro_exchange(e) {
    app._func.pro_exchange.call(this, this.data.id)
  }
}))