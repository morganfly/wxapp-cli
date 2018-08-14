Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    noclosebtn: {
      type: Boolean,
      value: false
    },
    height: {
      type: String,
      value: '300'
    },
    content: {
      type: String,
      value: ''
    },
    okBtnText: {
      type: String,
      value: ''
    },
    cancelBtnText: {
      type: String,
      value: ''
    }
  },

  data: {
    isShow: false
  },

  methods: {
    handleClose() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    handleOkbtn() {
      this.handleClose()
      this.triggerEvent('handleOkFn')
    },

    handleCanbtn() {
      this.handleClose()
      this.triggerEvent('handleCanFn')
    },

    showPop() {
      this.setData({
        isShow: true
      })
    },
  }

})
