module.exports = {
  // -------------------------商品专区--------------------------------------------------------------- 
  // 兑换商品
  pro_exchange(id, cb) {
    let app = getApp();
    app.request(app._api.productExchange(id), {}).then(res => {
      app.log(res)
      app.toast(`商品兑换成功`)
      wx.setStorageSync(`coin`, res.coin)
      this.setData({
        coin: res.coin
      })
      cb && cb(res)
    })
  },

  // 商品banner
  bannerImg(cb) {
    let app = getApp();
    app.request(app._api.bannerImg, {}).then(res => {
      this.setData({
        banner: res.data
      })
      cb && cb(res)
    })
  },

  // 商品列表
  pro_list(category, page = 1, cb) {
    let app = getApp();
    app.request(app._api.productList, {
      category: category
    }).then(res => {
      let product = category + '_productList';
      let meta = product + '_meta';

      app.log(product, res)

      let list = [];

      if (page == 1) {
        list = res.data;
      } else {
        list = this.data[product].concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        [product]: list,
        [meta]: res.meta
      })
      cb && cb(res)
    })
  },

  // 商品详情
  pro_detail(id, cb) {
    let app = getApp();
    app.request(app._api.productDetail(id), {}).then(res => {
      app.log('goods', res)
      let pro_info = this.data.pro_info;
      let pro_intro = this.data.pro_intro;
      let pro_date = this.data.pro_date;
      let pro_rule = this.data.pro_rule;
      pro_info.title = res.name;
      pro_info.text = res.desc;
      pro_intro.text = res.exchange_desc;
      pro_date.text = res.exchange_date;
      pro_rule.rule = res.exchange_rule;
      this.setData({
        goods: res,
        pro_info,
        pro_intro,
        pro_date,
        pro_rule,
        picture: res.picture,
      })
      cb && cb(res)
    })
  },

  // 咸豆日志
  dd_log(page = 1, cb) {
    let app = getApp();
    app.request(app._api.dd_log, {
      page
    }).then(res => {
      let logs = [];

      if (page == 1) {
        logs = res.data
      } else {
        logs = this.data.logs.concat(res.data)
      }

      this.setData({
        logs: logs,
        logs_meta: res.meta,
      })
      app.log('dd_log', res)
      cb && cb(res)
    })
  },

  // 咸豆任务列表
  dd_tasks(page = 1, cb) {
    let app = getApp();
    app.request(app._api.dd_tasks, {}).then(res => {
      app.log('dd_tasks', res)

      let dd_tasks = [];

      if (page == 1) {
        dd_tasks = res.data
      } else {
        dd_tasks = this.data.dd_tasks.concat(res.data)
      }

      this.setData({
        dd_tasks,
        dd_tasks_media: res.media
      })
      cb && cb(res)
    })
  },

  // 咸豆任务奖励领取
  dd_bonus(task, cb) {
    let app = getApp();
    app.request(app._api.dd_bonus(task), {}).then(res => {
      app.log(`dd_bonus`, res)
      app.toast(`咸豆领取成功`)
      wx.setStorageSync(`coin`, res.coin)
      this.setData({
        coin: res.coin
      })
      cb && cb(res)
    })
  },

  // -------------------------帖子--------------------------------------
  // 分类
  posts_categories(cb) {
    let app = getApp();
    app.request(app._api.categories, {}).then(res => {
      app.log(`categories`, res)

      this.setData({
        posts_categories: res.data,
      })

      wx.setStorageSync(`posts_categories`, res.data)

      cb && cb(res)
    })
  },

  // 获取帖子列表
  posts_list(page, category_id, cb, has_label = 0, include = 'user,label', order = '') {
    let app = getApp();
    app.request(app._api.postsList, {
      page,
      category_id,
      include,
      order,
      has_label,
    }).then(res => {
      app.log('postsList', res)
      let postsList = [];
      if (page == 1) {
        postsList = res.data;
      } else {
        postsList = this.data.postsList.concat(res.data);
        postsList = app._util.unique(postsList, `excerpt`)
      }

      wx.hideLoading();
      this.setData({
        postsList: postsList,
        postsList_meta: res.meta
      })


      // 把不同的帖子列表存入缓存 

      let storageStr = [{
        list: ``,
        meta: ``
      }, {
        list: `index_list`,
        meta: `index_list_meta`
      }, {
        list: `selectPosts_list`,
        meta: `selectPosts_list_meta`
      }, {
        list: `activityPosts_list`,
        meta: `activityPosts_list_meta`
      }, {
        list: `winePosts_list`,
        meta: `winePosts_list_meta`
      }, {
        list: `talkPosts_list`,
        meta: `talkPosts_list_meta`
      }]

      let getStr = (category_id) => {
        if (category_id) {
          return {
            list: storageStr[category_id].list,
            meta: storageStr[category_id].meta,
          }
        } else {
          return {
            list: storageStr[2].list,
            meta: storageStr[2].meta,
          }
        }
      }

      wx.setStorage({
        key: getStr(category_id).list,
        data: postsList,
      })

      wx.setStorage({
        key: getStr(category_id).meta,
        data: res.meta,
      })


      cb && cb(res)
    })
  },

  // 获取精选帖子列表
  select_postsList(cb, has_label = 1, include = 'user,label', order = '') {
    let app = getApp();
    app.request(app._api.selectPostsList, {
      has_label,
      include,
      order
    }).then(res => {
      app.log('selectPostsList', res)
      cb && cb(res)

    })
  },

  // 获取帖子详情
  posts_detail(topic, cb) {
    let app = getApp();
    app.request(app._api.postsDetail(topic), {
      include: 'user,label'
    }).then(res => {
      app.log('posts_detail', res)
      this.setData({
        postsDetail: res,
        userInfo: res.user
      })
      cb && cb(res)
    })
  },

  // 获取帖子回复列表
  posts_replyList(topic, onlyAuthor, page = 1, cb, cb2) {
    let app = getApp();
    app.request(app._api.replyList(topic), {
      include: `user`,
      onlyAuthor: onlyAuthor,
      page,
    }).then(res => {
      app.log(`posts_replyList`, res)


      let replyList = [];

      if (page == 1) {
        replyList = res.data;
      } else {
        replyList = this.data.replyList.concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        replyList: replyList,
        replyList_meta: res.meta
      }, res => {
        cb2 && cb2(res)
      })
      cb && cb(res)
    })
  },

  // 某人发布的帖子
  posts_userPublish(user, page = 1, cb) {
    let app = getApp();
    app.request(app._api.postsUserPublish(user), {
      page
    }).then(res => {
      app.log('posts_userPublish', res)

      let posts_userPublish = [];

      if (page == 1) {
        posts_userPublish = res.data;
      } else {
        posts_userPublish = this.data.posts_userPublish.concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        posts_userPublish,
        posts_userPublish_meta: res.meta
      })
      cb && cb(res)
    })
  },

  // 某人回复的帖子
  posts_userReply(user, page = 1, cb) {
    let app = getApp();
    app.request(app._api.postsUserReply(user), {
      include: `topic`,
      page,
    }).then(res => {
      app.log('posts_userReply', res)

      let posts_userReply = [];

      if (page == 1) {
        posts_userReply = res.data;
      } else {
        posts_userReply = this.data.posts_userReply.concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        posts_userReply,
        posts_userReply_meta: res.meta
      })
      cb && cb(res)
    })
  },

  // 某人赞过的帖子
  posts_userLikes(user, page = 1, cb) {
    let app = getApp();
    app.request(app._api.postsUserLikes(user), {
      include: `topic`,
      page
    }).then(res => {
      app.log('posts_userLikes', res)

      let posts_userLikes = [];

      if (page == 1) {
        posts_userLikes = res.data;
      } else {
        posts_userLikes = this.data.posts_userLikes.concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        posts_userLikes,
        posts_userLikes_meta: res.meta
      })
      cb && cb(res)
    })
  },

  // 某人收藏的帖子
  posts_userCollect(user, page = 1, cb) {
    let app = getApp();
    app.request(app._api.postsUserCollect(user), {
      include: `topic`,
      page
    }).then(res => {
      app.log('posts_userCollect', res)

      let posts_userCollect = [];

      if (page == 1) {
        posts_userCollect = res.data;
      } else {
        posts_userCollect = this.data.posts_userCollect.concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        posts_userCollect,
        posts_userCollect_meta: res.meta,
      })
    })
  },

  // 发表帖子
  posts_publish(title, body, category_id, address, body_image, cb) {
    let app = getApp();
    if (title == ``) {
      app.toast(`标题不能为空`);
      return
    }
    if (body == ``) {
      app.toast(`内容不能为空`)
      return
    }
    app.request(app._api.postsPublish, {
      title,
      body,
      category_id,
      address,
      body_image
    }).then(res => {
      app.log('posts_publish', res)
      cb && cb(res)
    })
  },

  // 点赞帖子
  posts_praise(topic, cb) {
    let app = getApp();
    app.request(app._api.praisePosts(topic), {}).then(res => {
      app.log('posts_praise 点赞成功', res)
      cb && cb(res)
    })
  },

  // 取消点赞帖子
  posts_cancelPraise(topic, cb) {
    let app = getApp();
    app.request(app._api.cancelPraise(topic), {}).then(res => {
      app.log(`posts_cancelPraise 取消点赞成功`, res)
      cb && cb(res)
    })
  },

  // 收藏帖子
  posts_collect(topic, cb) {
    let app = getApp();
    app.request(app._api.collect(topic), {
      topic
    }).then(res => {
      cb && cb(res)
    })
  },

  // 取消收藏帖子
  posts_cancelCollect(topic, cb) {
    let app = getApp();
    app.request(app._api.cancelCollect(topic), {
      topic
    }).then(res => {
      cb && cb(res)
    })
  },

  // 回复帖子
  posts_reply(topic, contents, contents_image, parent_id, target_user_id, cb) {
    let app = getApp();
    let data;
    if (parent_id != '') {
      data = {
        contents,
        parent_id,
        target_user_id,
      }
    } else {
      data = {
        contents,
        contents_image,
      }
    }
    app.request(app._api.replies(topic), data).then(res => {
      if (parent_id) {
        app.log(`楼中楼`, res)
      } else {
        app.log(`帖子回复`, res)
      }
      this.triggerEvent('replyShow', {})
      cb && cb(res)
    })
  },

  // 编辑帖子
  posts_edit(topic, title, body, body_image, category_id, cb) {
    let app = getApp();
    app.request(app._api.editPosts(topic), {
      title,
      body,
      body_image,
      category_id
    }).then(res => {
      app.log(`posts_edit`, res)
      cb && cb(res)
    })
  },

  // 删除帖子
  posts_delete(topic, reason, cb) {
    let app = getApp();
    app.request(app._api.deletePosts(topic), {
      reason
    }).then(res => {
      app.log(`posts_delete`, res)
      app.toast(`删除成功`)
      cb && cb(res)
    })
  },

  // 关闭帖子
  posts_close(topic, cb) {
    let app = getApp();
    app.request(app._api.closePosts(topic), {}).then(res => {
      app.log(`posts_close`, res)
      app.toast(`关闭成功`)
      cb && cb(res)
    })
  },

  // 恢复关闭帖子
  posts_open(topic, cb) {
    let app = getApp();
    app.request(app._api.openPosts(topic), {}).then(res => {
      app.log(`posts_open`, res)
      app.toast(`打开帖子成功`)
      cb && cb(res)
    })
  },

  // 设置帖子标签
  posts_labelConfig(topic, label, cb) {
    let app = getApp();
    app.request(app._api.configPostsLabel(topic), {
      label
    }).then(res => {
      app.log(`posts_labelConfig`, res)
      cb && cb(res)
    })
  },

  // 用户最新一条帖子
  posts_userLast(cb) {
    let app = getApp();
    app.request(app._api.userLastPosts, {}).then(res => {
      app.log(`posts_userLast`, res)

      if (res.status_code == 405) return

      this.setData({
        posts_userLast: res
      })
      cb && cb(res)
    })
  },

  // 为帖子回复点赞
  reply_praise(reply, cb) {
    let app = getApp();
    app.request(app._api.priseReply(reply), {}).then(res => {
      app.log(`reply_praise`, res)
      cb && cb(res)
    })
  },

  // 删除回复
  reply_delete(topic, reply, cb) {
    let app = getApp();
    app.request(app._api.delelteReplies(topic, reply), {}).then(res => {
      app.log(`reply_delete`, res)
      app.toast(`删除成功`)
      cb && cb(res)
    })
  },

  // -------------------------用户-----------------------------------------
  // 获取用户授权信息
  user_roles(cb) {
    let app = getApp();
    app.request(app._api.userRoles, {}).then(res => {
      app.log(`user_roles`, res)

      let role = '';

      if (res.data.length > 0) {
        role = res.data[0].desc
      }

      wx.setStorageSync(`user_roles`, role)

      cb && cb(role)
    })
  },

  // 打开小程序时打点
  openMiniApp() {
    let timer = setInterval(res => {
      if (wx.getStorageSync('token')) {
        let app = getApp();
        app.request(app._api.openMiniApp, {}).then(res => {
          app.log('openMiniApp', res)
        })
        clearInterval(timer)
      }
    }, 1000)

  },

  // 编辑头像
  user_editAvatar(id, type = 'default', cb) {
    let app = getApp();
    app.request(app._api.editUserAvatar, {
      avatar_image_id: id,
      type: type,
    }).then(res => {
      app.log('editAvatar', res)
      app.toast(`头像修改成功`)
      let userInfo = wx.getStorageSync(`userInfo`)
      userInfo.avatar = res.avatar;
      wx.setStorageSync(`userInfo`, userInfo)
      cb && cb(res)
    })
  },

  // 更改昵称 
  user_editNickName(nick_name, cb) {
    let app = getApp();
    app.request(app._api.editUserNickname, {
      nick_name: nick_name
    }).then(res => {
      let userInfo = wx.getStorageSync(`userInfo`)
      userInfo.nick_name = res.nick_name;
      wx.setStorageSync(`userInfo`, userInfo)
      app.toast(`昵称修改成功`)
      cb && cb(res)
    })
  },

  // 删除他人头像
  user_deleteAvatar(user, cb) {
    let app = getApp();
    app.request(app._api.deleteAvatar(user), {}).then(res => {
      app.log(`user_deleteAvatar`, res)
      app.toast(`删除头像成功`)

      cb && cb(res)
    })
  },

  // 禁止其他用户发言
  user_forbid(user, ban_day, cb) {
    let app = getApp();
    app.request(app._api.forbid(user), {
      ban_day,
    }).then(res => {
      app.log(`user_forbid`, res)

      app.toast(`禁言成功`)
      cb && cb(res)
    })
  },

  // 取消禁言
  cancel_forbid(user, cb) {
    let app = getApp();
    app.request(app._api.cancel_forbid(user), {}).then(res => {
      app.log(`cancel_forbid`, res)

      app.toast(`取消禁言成功`)
      cb && cb(res)
    })
  },

  // 用户个人中心信息
  user_profile(id, cb) {
    let app = getApp();
    app.request(app._api.userProfile(id), {}).then(res => {
      app.log('user_profile', res)
      this.setData({
        user_profile: res
      })

      cb && cb(res)
    })
  },

  // 头像列表
  user_avatarList(cb) {
    let app = getApp();
    app.request(app._api.avatarList, {}).then(res => {
      app.log(`user_avatarList`, res)
      this.setData({
        avatarList: res
      })
      cb && cb(res)
    })
  },

  // 获取登录用户的权限
  userPermissions(cb) {
    let app = getApp();
    app.request(app._api.userPermissions, {}).then(res => {
      app.log(`userPermissions`, res)
      let userPermissions = {};

      res.data.forEach(x => {
        userPermissions[x.name] = ture
      })

      wx.setStorageSync(`userPermissions`, data)

      cb && cb(res)
    })
  },

  // --------------------------上传图片---------------------------------------------
  // 图片上传
  img_upload(type) {
    let app = getApp();
    let imgList = this.data.imgList
    wx.showLoading({})
    // 选择图片
    wx.chooseImage({
      success: res => {
        let tempFilePaths = res.tempFilePaths;
        app.log(`选择图片成功`, tempFilePaths)
        if (tempFilePaths.length + imgList.length > 9) {
          return app.toast(`最多上传九张图片`)
        }

        // 循环上传图片
        tempFilePaths.forEach((x, index) => {
          index != tempFilePaths.length - 1 && wxUpload(x)
          index == tempFilePaths.length - 1 && wxUpload(x, `last`)
        })
      },
      fail: res => {
        app.log(`fail`, res)
        wx.hideLoading()
      }
    })

    // 上传图片实现
    let wxUpload = (tempFilePath, last) => {
      app.log(`开始上传图片`)
      wx.uploadFile({
        url: `${app._api.apiUrl}/api/images`,
        filePath: tempFilePath,
        name: 'image',
        header: {
          'Authorization': "Bearer " + wx.getStorageSync('token')
        },
        formData: {
          'type': type
        },
        success: res => {
          app.log(`img_upload`, res)
          let imgList = this.data.imgList;
          last && wx.hideLoading();
          if (res.statusCode == 200) {
            imgList.push(JSON.parse(res.data).path)
            this.setData({
              imgList
            })
          } else {
            if (res.statusCode == 413) {
              res.statusCode == 413 && app.toast(`上传图片过大,暂不支持1M以上图片`)
              return
            } else {
              app.toast(JSON.parse(res.data).message)
            }
          }
        }
      })
    }
  },

  // 上传图片实现(头像)
  wxUpload(type, imgList, cb) {
    let app = getApp();
    wx.uploadFile({
      url: `${app._api.apiUrl}/api/images`,
      filePath: imgList,
      name: 'image',
      header: {
        'Authorization': "Bearer " + wx.getStorageSync('token')
      },
      formData: {
        'type': type
      },
      success: res => {
        app.log(`img_upload`, res)
        if (res.statusCode == 200) {
          cb && cb(res)
        } else {
          if (res.statusCode == 413) {
            res.statusCode == 413 && app.toast(`上传图片过大,暂不支持1M以上图片`)
            return
          } else {
            app.toast(JSON.parse(res.data).message)
          }
        }
      }
    })
  },

  // 图片重置大小
  img_reSize(imgList, cb) {
    let app = getApp();
    let list = imgList;
    let newList = [];

    if (list.length = 0) {
      return
    }

    list.forEach(x => {
      newList.push({
        url: x
      })
    })
    list = newList;

    // 图片信息获取
    let imgInfo = (url, index) => {
      wx.getImageInfo({
        src: url,
        success: (res) => {
          app.log(`图片宽`, res.width, `图片高`, res.height)
          // app.log(res)
          let width = res.width;
          let height = res.height;
          let ratio = width / height;
          if (width > height) {
            list[index].width = 700;
            list[index].height = 700 / ratio
            list[index].style = `width:${700}rpx;height:${700 / ratio}rpx;`
          } else {
            list[index].height = 700;
            list[index].width = 700 * ratio;
            list[index].style = `width:${700 * ratio}rpx;height:${700}rpx;`
          }
        }
      })
    }

    // 遍历
    list.forEach((x, index) => {
      imgInfo(x.url, index)
    })

    let postsDetail = this.data.postsDetail;

    postsDetail.body_image = list

    this.setData({
      postsDetail
    })
  },

  // ---------------------------通知----------------------------------------------------
  // 动态数目
  unread_num(cb) {
    let app = getApp();
    app.request(app._api.unread_num, {}).then(res => {
      app.log(`unread_num`, res)
      app.globalData.unread_count = res.unread_count
      cb && cb(res)
    })
  },

  // 动态列表
  unread_list(page = 1, cb) {
    let app = getApp();
    app.request(app._api.unreadList, {
      page
    }).then(res => {
      app.log(`unread_list`, res)

      let unread_list = [];

      if (page == 1) {
        unread_list = res.data
      } else {
        unread_list = this.data.unread_list.concat(res.data)
      }

      this.setData({
        unread_list,
        unread_list_meta: res.meta,
      })
      cb && cb(res)
    })
  },

  // 清空动态数量
  unread_clear(id = '', cb) {
    let app = getApp();


    if (Array.isArray(id) && id.length > 0) {
      app.request(app._api.unreadClearMultiple, {
        ids: id
      }).then(res => {
        app.log(`unread_clear`, res)
        app._func.unread_num.call(this)

        cb && cb(res)
      })
    } else {
      app.request(app._api.unreadClear(id), {}).then(res => {
        app.log(`unread_clear`, res)
        app._func.unread_num.call(this)

        cb && cb(res)
      })
    }
  },


  // --------------------------三期优化------------------------------------------------------------

  // 帖子搜索
  //  @param  keyword {string}  搜索关键字
  //  @param  limit {string}    每一页数默认10.可不传递

  posts_search(keyword, page, cb, limit = 10) {
    let app = getApp();
    app.request(app._api.search, {
      keyword,
      limit,
      page
    }).then(res => {
      app.log(res)

      let postsList;

      if (page == 1) {
        postsList = res.data;
      } else {
        postsList = this.data.postsList || [];
        postsList = postsList.concat(res.data);
      }



      this.setData({
        postsList,
        postsList_meta: res.meta,
      })

      res.meta.pagination.current_page === res.meta.pagination.current_page && this.setData({
        loadAll: true
      })

      cb && cb(res)
    })
  },


  // 用户和他人关注关系获取
  userRelate(userId, cb) {
    let app = getApp();
    app.request(app._api.userRelate(userId), {}).then(res => {

      this.setData({
        relate: res.relate
      })

      cb && cb(res)
    })
  },

  // 粉丝列表获取
  userFans(user, page, cb) {
    let app = getApp();
    app.request(app._api.userFans(user), {
      page
    }).then(res => {

      let fansList;

      if (page == 1) {
        fansList = res.data;
      } else {
        fansList = (this.data.fansList || []).concat(res.data)
      }

      app.log(`userFans`, fansList)

      this.setData({
        fansList,
        fansList_meta: res.meta,
      })

      cb && cb(res)
    })
  },

  // 关注列表获取
  userFocused(user, page, cb) {
    let app = getApp();
    app.request(app._api.userFocused(user), {
      page
    }).then(res => {

      let fansList;

      if (page == 1) {
        fansList = res.data;
      } else {
        fansList = (this.data.fansList || []).concat(res.data)
      }

      fansList.map(x => {
        x.isFocused = true
      })

      app.log(`userFocused`, fansList)


      this.setData({
        fansList,
        fansList_meta: res.meta,
      })

      cb && cb(res)
    })
  },

  // 关注用户
  focusUser(user, cb) {
    let app = getApp();
    app.request(app._api.focusUser(user), {}).then(res => {

      app.toast(`关注用户成功`)

      cb && cb(res)

    })
  },

  // 取关用户
  cancelFocusUser(user, cb) {
    let app = getApp();
    app.request(app._api.cancelFocusUser(user), {}).then(res => {

      app.toast(`取消关注用户成功`)

      cb && cb(res)
    })
  },

  // 关注的用户的帖子列表
  focusedUserPosts(page, cb) {
    let app = getApp();
    app.request(app._api.focusedUserPosts, {}).then(res => {
      app.log('posts_focusedUser', res)

      let posts_focusedUser = [];

      if (page == 1) {
        posts_focusedUser = res.data;
      } else {
        posts_focusedUser = this.data.posts_focusedUser.concat(res.data);
      }

      wx.hideLoading();

      this.setData({
        posts_focusedUser,
        posts_focusedUser_meta: res.meta
      })
      cb && cb(res)
    })
  },

  // 为帖子设置标签
  setLabel(topic, label_id, cb) {
    let app = getApp();
    app.request(app._api.setLabel(topic), {
      label_id,
    }).then(res => {
      app.log(`setLabal`, res)

      cb && cb(res);
    })
  },


  /*
  //映射
  map(_this) {
    _this.getLocation = this.getLocation;
    _this.mapLocation = this.mapLocation;
    _this.getSystemInfo = this.getSystemInfo;
    _this.getNetStatus = this.getNetStatus;
    _this.pro_exchange = this.pro_exchange;
  },
  */
}