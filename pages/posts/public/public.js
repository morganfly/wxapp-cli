const app = getApp();

// 引入SDK核心类
const QQMapWX = require('../../../plugin/importServer/map/qqmap-wx-jssdk.js');

import Emoji from '../../../plugin/importServer/emoji/emoji.js'

// 实例化API核心类
const map = new QQMapWX({
  key: 'L3JBZ-XR6KV-7LKPK-UUXQC-MV35S-4BFTK'
});

Page(app.assign({
  data: {
    imgList: [],
    title: ``,
    body: ``,
    lastBlur: `body`,
    address: `所在位置`,
    category_id: 1,
    category_text: `话题类型`,
    from: '',
  },
  onLoad: function(options) {
    let type = options.type;
    let from = options.from;

    if (type == 'edit') {
      // 编辑帖子获取原帖子内容
      let d = wx.getStorageSync(`editPosts`)
      app.log(`d`, d)
      this.setData({
        type: type,
        topic: d.id,
        title: d.title,
        body: d.body,
        imgList: d.body_image,
        category_id: d.category_id,
        address: d.address,
        dialog_show: false,
      })
    }


    if (from === 'activity') {
      this.setData({
        from,
        category_id: 3,
      })
    } else if (from === 'wine') {
      this.setData({
        from,
        category_id: 4,
      })
    } else if (from === 'talk') {
      this.setData({
        from,
        category_id: 5,
      })
    }

    Emoji.init.call(this)

  },
  onShow: function() {
    return app.sharePage();
  },

  // 标题输入
  titleInput(e) {
    this.setData({
      title: e.detail.value,
    })
  },

  // 内容输入
  contentInput(e) {
    this.setData({
      body: e.detail.value,
    })
  },

  // 通过改变lastBlur来识别表情添加在title还是body里
  titleBlur() {
    this.setData({
      lastBlur: `title`
    })
  },

  bodyBlur() {
    this.setData({
      lastBlur: `body`
    })
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

  // 发帖地址
  getAddress() {
    let _this = this;
    userAddress()

    function userAddress() {
      // 用户地址获取
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: res => {
          var latitude = res.latitude
          var longitude = res.longitude

          // 调用接口
          map.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success(res) {
              app.log(`detailAddress`, res);
              if (res.result.address_component.nation != "中国") {
                _this.setData({
                  address: res.result.address_component.nation
                })
              } else {
                _this.setData({
                  address: res.result.address_component.city
                })
              }
            },
            fail(res) {
              app.log(`detailAddress`, res);
            },
          });
        },
        fail: res => {
          // app.toast(`获取发帖地址失败`)
          app.log(`getAddress`, res)
        }
      })
    }
  },

  // 跳转获取发帖地址页面
  jumpAddress() {
    let type = this.data.type;
    if (type != `edit`) {
      app.href(`/pages/posts/address/address`)
    }
  },

  // 发表
  publish() {
    let title = this.data.title;
    let body = this.data.body;
    let imgList = this.data.imgList;
    let type = this.data.type;
    let address = this.data.address;
    let category_id = parseInt(this.data.category_id);

    address === `所在位置` && (address = `火星`)

    if (body.length < 1) {
      app.toast(`话题内容,至少一个字`)
      return
    }

    if (category_id === 1) {
      app.toast(`请选择话题类型`)
      return
    }

    if (type == `edit`) {
      let topic = this.data.topic;
      app._func.posts_edit.call(this, topic, title, body, imgList, category_id, res => {
        app.toast(`编辑帖子成功`)

        let timer = setTimeout(res => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
      return
    }


    app._func.posts_publish.call(this, title, body, category_id, address, imgList, res => {
      this.setData({
        imgList: []
      })

      let prevPage = app.getRouterInfo(-1).page;

      prevPage.onLoad();

      wx.navigateBack({
        delta: 1,
      })
    })
  },

  //表情选择
  emojiChoose(e) {
    Emoji.emojiChoose.call(this, e, this.data.lastBlur)
  },

  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg(e) {
    Emoji.cemojiCfBg.call(this, e)
  },

  //点击emoji背景遮罩隐藏emoji盒子
  emojiShowHide(e) {
    Emoji.emojiShowHide.call(this, e)
  },

  // 打开帖子分类选项
  showDialog(e) {
    this.setData({
      dialog_show: !this.data.dialog_show,
    })
  },

  //选择帖子分类
  changeCategory(e) {
    let categoryId = e.currentTarget.dataset.categoryId;

    switch (categoryId) {
      case "4":
        this.setData({
          category_id: categoryId,
          category_text: '三国煮酒'
        })
        break
      case "5":
        this.setData({
          category_id: categoryId,
          category_text: '咸言咸语'
        })
        break
    }
  },
}))