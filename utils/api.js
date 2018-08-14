'use strict'

// dev
const apiUrl = 'https://testforum.hzyoka.com';
const socketUrl = `wss://testforum.hzyoka.com/wss`;

// product
// const apiUrl = ''; 
// const socketUrl = ``;


//  @param {String}  url  请求地址除域名外部分

const url = (url) => {
  let str = apiUrl + url;
  return str.replace(/com\/\//, "com/");
}


/*@param {String} url   请求地址除域名外部分
  @param {String} method    请求方式  
*/

class Api {
  constructor(url, method, param) {
    if (typeof url !== string || typeof url !== string) {
      console.error(`url和method参数必须为字符串或者字符串模版`)
    }

    if (!param) {
      this.url = url(url);
      this.method = method.toUpperCase()
    } else {

    }
  }
}


export default {
  apiUrl,
  socketUrl,

  api_demo1: {
    url: url('/api/authorizations'),
    method: 'POST'
  },

  api_demo2: (id) => {
    return {
      url: url(`/api/topics/${id}`),
      method: 'GET'
    }
  },

  login: {
    url: url('/api/authorizations'),
    method: 'POST'
  },

  userInfo: {
    url: url('/api/user'),
    method: 'GET'
  },
};