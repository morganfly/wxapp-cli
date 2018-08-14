// 废弃
// const apiUrl = 'https://forum.sanguosha.com';

// dev
const apiUrl = 'https://testforum.hzyoka.com';
const socketUrl = `wss://testforum.hzyoka.com/wss`;

// product
// const apiUrl = 'https://forum.hzyoka.com'; 
// const socketUrl = `wss://forum.hzyoka.com/wss`;
 
const url = (url) => {
  let str = apiUrl + url;
  return str.replace(/com\/\//, "com/");
}

export default {
  apiUrl,
  socketUrl,

  // 登录
  login: {
    url: url('/api/authorizations'),
    method: 'POST'
  },

  // 帖子列表 
  postsList: {
    url: url('/api/topics'),
    method: 'GET'
  },

  // 精选帖子列表
  selectPostsList: {
    url: url('/api/topics/top/topics'),
    method: 'GET'
  },

  // 获取帖子详情
  postsDetail: (id) => {
    return {
      url: url(`/api/topics/${id}`),
      method: 'GET'
    }
  },

  // 帖子回复列表
  replyList: (topic) => {
    return {
      url: url(`/api/topics/${topic}/replies`),
      method: 'GET'
    }
  },

  // 分类 
  categories: {
    url: url('/api/categories'),
    method: 'GET'
  },

  // 当前登录用户信息
  userInfo: {
    url: url('/api/user'),
    method: 'GET'
  },

  // 上传图片
  upLoadImg: {
    url: url(`/api/images`),
    method: `POST`
  },

  // 获取登录用户的权限
  userPermissions: {
    url: url(`/api/user/permissions`),
    method: `GET`
  },

  // 修改用户昵称 
  editUserNickname: {
    url: url(`/api/userNickname`),
    method: `PUT`
  },

  // 修改用户头像
  editUserAvatar: {
    url: url(`/api/userAvatar`),
    method: `PUT`
  },

  // 删除他人用户头像
  deleteAvatar: (user) => {
    return {
      url: url(`/api/user/${user}/avatar`),
      method: `PUT`
    }
  },

  // 禁止其他用户发言
  forbid: (user) => {
    return {
      url: url(`/api/user/${user}/forbid`),
      method: `PUT`
    }
  },

  // 取消禁言
  cancel_forbid: (user) => {
    return {
      url: url(`/api/user/${user}/cancelForbid`),
      method: `PUT`
    }
  },

  // 发布帖子
  postsPublish: {
    url: url(`/api/topics`),
    method: `POST`
  },

  // 编辑帖子
  editPosts: (topic) => {
    return {
      url: url(`/api/topics/${topic}`),
      method: `PUT`
    }
  },

  // 删除帖子
  deletePosts: (topic) => {
    return {
      url: url(`/api/topics/${topic}`),
      method: `DELETE`
    }
  },

  // 关闭帖子,关闭的帖子不能回复
  closePosts: (topic) => {
    return {
      url: url(`/api/topics/${topic}/close`),
      method: `PUT`
    }
  },

  // 打开关闭的帖子
  openPosts: (topic) => {
    return {
      url: url(`/api/topics/${topic}/open`),
      method: `PUT`
    }
  },

  // 设置帖子标签
  configPostsLabel: (topic) => {
    return {
      url: url(`/api/topics/${topic}/label`),
      method: `PUT`
    }
  },

  // 发布帖子回复
  replies: (topic) => {
    return {
      url: url(`/api/topics/${topic}/replies`),
      method: `POST`
    }
  },

  // 删除帖子的回复
  delelteReplies: (topic, reply) => {
    return {
      url: url(`/api/topics/${topic}/replies/${reply}`),
      method: `DELETE`
    }
  },

  // 点赞帖子
  praisePosts: (topic) => {
    return {
      url: url(`/api/topics/${topic}/likes`),
      method: `POST`
    }
  },

  // 取消点赞帖子
  cancelPraise: (topic) => {
    return {
      url: url(`/api/topics/${topic}/likes`),
      method: `DELETE`
    }
  },

  // 点赞回复
  priseReply: (reply) => {
    return {
      url: url(`/api/replies/${reply}/likes`),
      method: `PUT`
    }
  },

  // 某个用户的个页面信息
  userProfile: (user) => {
    return {
      url: url(`/api/users/${user}/profile`),
      method: `GET`
    }
  },

  // 获取用户收藏的帖子
  postsUserCollect: (user) => {
    return {
      url: url(`/api/users/${user}/collections`),
      method: 'GET'
    }
  },

  // 某个用户发布的帖子
  postsUserPublish: (user) => {
    return {
      url: url(`/api/users/${user}/topics`),
      method: 'GET'
    }
  },

  // 获取某个用户喜欢的帖子
  postsUserLikes: (user) => {
    return {
      url: url(`/api/users/${user}/likes`),
      method: 'GET'
    }
  },

  // 某个用户的回复列表
  postsUserReply: (user) => {
    return {
      url: url(`/api/users/${user}/replies`),
      method: 'GET'
    }
  },

  // 头像列表
  avatarList: {
    url: url(`/api/avatars`),
    method: `GET`
  },

  // 收藏帖子
  collect: (topic) => {
    return {
      url: url(`/api/topics/${topic}/collections`),
      method: `POST`
    }
  },

  // 取消收藏帖子
  cancelCollect: (topic) => {
    return {
      url: url(`/api/topics/${topic}/collections`),
      method: `DELETE`
    }
  },

  // 商城的banner图
  bannerImg: {
    url: url(`/api/shop/banners`),
    method: `GET`
  },

  // 商城的商品列表
  productList: {
    url: url(`/api/shop/goods`),
    method: `GET`
  },

  // 商城商品详情
  productDetail: (goods) => {
    return {
      url: url(`/api/shop/goods/${goods}`),
      method: `GET`
    }
  },

  // 商品兑换
  productExchange: (goods) => {
    return {
      url: url(`/api/shop/exchange/${goods}`),
      method: 'POST'
    }
  },

  // 咸豆日志
  dd_log: {
    url: url(`/api/shop/coinLog`),
    method: `GET`
  },

  // 咸豆任务列表
  dd_tasks: {
    url: url(`/api/shop/tasks`),
    method: `GET`
  },

  // 咸豆任务奖励领取
  dd_bonus: (task) => {
    return {
      url: url(`/api/shop/getTaskBonus/${task}`),
      method: `POST`
    }
  },

  // 分享回调接口
  shareLog: {
    url: url(`/api/shareApp`),
    method: `POST`
  },

  // 打开小程序
  openMiniApp: {
    url: url(`/api/openMiniApp`),
    method: `POST`
  },

  // 动态数量
  unread_num: {
    url: url(`/api/user/notifications/stats`),
    method: `GET`
  },

  // 动态列表
  unreadList: {
    url: url(`/api/user/notifications`),
    method: `GET`
  },

  // 清空动态数量
  unreadClear: (id) => {
    return {
      url: url(`/api/user/read/notifications/${id}`),
      method: `PUT`
    }
  },

  unreadClearMultiple: {
    url: url(`/api/user/read/notifications`),
    method: `PUT`
  },

  // 用户最新一条帖子
  userLastPosts: {
    url: url(`/api/topics/user/latest`),
    method: `GET`
  },

  // 用户角色 
  userRoles: {
    url: url(`/api/user/roles`),
    method: `GET`
  },



  // ------------------------------三期-------------------------------------------------
  // 获取用户关注列表
  userFocused: (user) => {
    return {
      url: url(`/api/users/${user}/focus?include=user`),
      method: `GET`
    }
  },

  // 获取用户的粉丝列表
  userFans: (user) => {
    return {
      url: url(`/api/users/${user}/fans?include=user`),
      method: `GET`
    }
  },

  // 关注用户
  focusUser: (user) => {
    return {
      url: url(`/api/user/${user}/focus`),
      method: `POST`
    }
  },

  // 取消关注用户
  cancelFocusUser: (user) => {
    return {
      url: url(`/api/user/${user}/focus`),
      method: `DELETE`
    }
  },

  // 搜索帖子 
  //  @param  keyword {string}  搜索关键字
  //  @param  limit {string}    每一页数默认10.可不传递
  search: {
    url: url(`/api/topics/search`),
    method: `GET`
  },

  // 用户和他人关注关系获取
  userRelate: (user) => {
    return {
      url: url(`/api/user/${user}/relate`),
      method: `GET`,
    }
  },

  // 已关注人的帖子列表
  focusedUserPosts: {
    url: url(`/api/focus/topics?include=user`),
    method: `GET`
  },

  // 设置帖子标签
  setLabel: (topic) => {
    return {
      url: url(`/api/topics/${topic}/label`),
      method: `PUT`
    }
  },




  // -----------------------------------------------------------------------------------

};