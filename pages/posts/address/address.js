const app = getApp();

// 引入SDK核心类
const QQMapWX = require('../../../plugin/importServer/map/qqmap-wx-jssdk.js');

// 实例化API核心类
const map = new QQMapWX({
  key: 'L3JBZ-XR6KV-7LKPK-UUXQC-MV35S-4BFTK'
});

Page(app.assign({
  data: {
    address: '火星'
  },
  onLoad: function(options) {

  },
  onShow: function() {
    this.getAddress()
  },

  // 发帖地址
  getAddress() {
    let _this = this;
    checkAddress()

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

    function checkAddress() {
      // 检查用户是否进行过相关授权
      wx.getSetting({
        success(res) {
          app.log(`wx.getSetting`, res.authSetting)
          if (res.authSetting['scope.userLocation']) {
            userAddress()
          } else {
            wx.authorize({
              scope: 'scope.userLocation',
              success(res) {
                app.log(res)
                userAddress()
              },
              fail(res) {
                app.log(`fail`, res)
              }
            })
          }
        }
      })
    }
  },

  // 选择地址
  address_choose(e) {

    let address = e.currentTarget.dataset.address;
    let currentPage = getCurrentPages()[getCurrentPages().length - 1];
    let prevPage = getCurrentPages()[getCurrentPages().length - 2];

    if (address === 'address_none') {
      prevPage.setData({
        address: '火星'
      })
    } else {
      prevPage.setData({
        address
      })
    }

    wx.navigateBack({
      delta: 1
    })
  },

  // 重新获取定位权限
  address_get(e) {
    wx.openSetting({
    })
  },

}))