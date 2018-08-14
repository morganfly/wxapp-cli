// const apiUrl = 'https://forum.sanguosha.com';
const apiUrl = 'https://forum.hzyoka.com';

const url = (url) => {
  let str = apiUrl + url;
  return str.replace(/com\/\//, "com/");
}



export default {
  test: 'www.baidu.com'
}