// plugin/component/timer/timer.js
Component({
  properties: {

  },
  data: {
    i:0,
    num:10
  },
  attached() {
   this.start(15)
  },
  methods: {
    // 开始倒时间
    start(x=10){
      let num = this.data.num;
      if(x!=10){
        num = x;
        this.setData({
          num
        })
      }
      let i = this.data.i;
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })

      this.setData({
        animationData: animation.export(),
        num
      })
      let interval = setInterval(function () {
        i++;
        animation.rotate((360/num) * i).step()
        this.setData({
          animationData: animation.export(),
          i
        })
      }.bind(this), 1000)

      let timer = setTimeout(function () {
        clearInterval(interval);
      }.bind(this), num*1000)
    },
    // 初始化倒计时
    init(){
      this.setData({
        i:0
      })
    }
  }
})
