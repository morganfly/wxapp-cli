module.exports = {
  // -------------------------商品专区--------------------------------------------------------------- 

  /*
    demo
    @param {Any}        param1  参数1
    @param {Any}        param2  参数2
    @param {Function}   cb      回调函数    
           {String}            
  */
  demo1(param1, param2, cb) {
    let app = getApp();
    app.request(app._api.api_demo1, {
      param1,
      param2
    }).then(res => {
      app.log(res)
      cb && cb(res)
    })
  },

  /*
    demo
    @param {Any}        param1  参数1
    @param {Any}        param2  参数2
    @param {Function}   cb      回调函数         
  */
  demo2(param1, param2, cb) {
    let app = getApp();
    app.request(app._api.api_demo2(param1), {
      param2
    }).then(res => {
      app.log(res);
      cb && cb(res);
    })
  },
}