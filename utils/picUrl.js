const apiUrl = 'https://forum.hzyoka.com';

const url = (url) => {
  let str = apiUrl + url;
  return str.replace(/com\/\//, "com/");
}


//  引用服务器图片地址管理 

export default {
  avatar_demo: url('/static/avatar/008.png')
}