function init() {
  this.setData({
    emojiShow: false,
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],//qq、微信原始表情
    alipayEmoji: [],//支付宝表情 
  })

  let em = {}, that = this, emChar = that.data.emojiChar.split("-");
  let emojis = []
  that.data.emoji.forEach(function (v, i) {
    em = {
      char: emChar[i],
      emoji: "0x1f" + v
    };
    emojis.push(em)
  });
  that.setData({
    emojis: emojis
  })
}

//点击表情显示隐藏表情盒子
function emojiShowHide() {
  this.setData({
    emojiShow: !this.data.emojiShow,
  })
}

//表情选择
function emojiChoose(e, lastBlur) {
  if (lastBlur == `title`) {
    this.setData({
      title: this.data.title + e.currentTarget.dataset.emoji
    })
  } else {
    this.setData({
      body: this.data.body + e.currentTarget.dataset.emoji
    })
  }
}

//点击emoji背景遮罩隐藏emoji盒子
function cemojiCfBg() {
  this.setData({
    emojiShow: false,
  })
}

module.exports = {
  init,
  emojiShowHide,
  emojiChoose,
  cemojiCfBg
}