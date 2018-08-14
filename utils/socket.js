let API = require('./api.js')

module.exports = {

  // socket 
  socketOpen: false,
  socketMsgQueue: [],


  
  init: function(callback) {
    let _this = this;
    let localUserId = wx.getStorageSync('userId');
    this.callback = callback;
    this.create();



    // 创建一个socket
    wx.onSocketOpen(function(res) {
      console.log('WebSocket连接打开')

      //链接打开后就直接发送一个消息
      // { "code":"1000", "data":{ "user_id":4 } }
      // 涉及到顺序行。
      wx.sendSocketMessage({
        data: JSON.stringify({
          code: '1000',
          data: {
            user_id: localUserId
          }
        })
      })

      _this.socketOpen = true
      _this.heartCheck().reset().start();

      for (let i = 0; i < _this.socketMsgQueue.length; i++) {
        _this.pushMessage(_this.socketMsgQueue[i])
      }
      _this.socketMsgQueue = []

    })

    // 收到服务器内容
    wx.onSocketMessage(function(res) {
      _this.socketOpen = true
      if (res.data != '') { 
        let data = JSON.parse(res.data);
        if (!data.code) {

        } else {
          _this.heartCheck().reset().start();
          if (data.code == 10001) {
            console.log('收到服务器内容：'+ res.data)
            if (!wx.getStorageSync(`subsection_message`)) {
              wx.setStorageSync(`subsection_message`, {})
            }

            let subsection_message = wx.getStorageSync(`subsection_message`);
            subsection_message[data.type] = true;
            wx.setStorageSync(`subsection_message`, subsection_message)
          }
        }
      }
    })

    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败，请检查！')
      _this.socketOpen = false;
      _this.reconnect()
    })

    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！')
      _this.socketOpen = false;
      _this.reconnect()
    })

  },

  create: function() {
    let _this = this;
    wx.connectSocket({
      url: API.default.socketUrl
    })
  },

  pushMessage: function(msg) {
    let _this = this;
    let sign = wx.getStorageSync('sign');
    let toData = Object.assign({
      sign: sign
    }, msg)

    if (_this.socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(toData)
      })
    } else {
      _this.socketMsgQueue.push(toData)
    }
  },

  reconnect: function() {
    console.log('重连socket...')
    let _this = this;
    if (_this.lockReconnect) return;
    _this.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function() {
      _this.init(_this.callback); //or _this.creat()
      _this.lockReconnect = false;
    }, 4000);

  },

  getConnStatus: function() {
    return this.socketOpen;
  },

  heartCheck: function() {
    let _this = this;
    return {
      timeout: 4000, //4秒
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function() {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
      },
      start: function() {
        let self = this;

        this.timeoutObj = setInterval(function() {
          // 这里发送一个心跳，后端收到后，返回一个心跳消息，
          // onmessage拿到返回的心跳就说明连接正常
          _this.pushMessage({
            code: "1001",
            data: "ping",
          });

          // self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
          //   wx.closeSocket();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
          // }, self.timeout)
        }, 4000)
      }

    }
  },

  closeSocket: function() {
    wx.closeSocket();
  }

}