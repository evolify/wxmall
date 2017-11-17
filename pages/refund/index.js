// pages/refund/index.js
import config from '../../config.js'
import req from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    no: '',
    statusStr: '',
    status: 1,
    orderTime: '',
    price: 0.00,

    orderContent: [],
    address: null,
    trackingNo: null,

    serverUrl: config.serverUrl,
    defaultReason:true,
    defaultReasonStr:'下错单',
    reason:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var orderId = e.id
    this.orderDetails(orderId)
  },
  orderDetails(id) {
    return req.get('/api/order/details/' + id)
      .then(res => res.data.data)
      .then(data => {
        this.setData({
          ...data
        })
      })
  },
  tapDefaultReason(){
    this.setData({
      defaultReason:true,
      reason:null
    })
  },
  tapInputReason(){
    this.setData({
      defaultReason: false
    })
  },
  onReasonChange(e){
    console.log(e.detail.value)
    this.setData({
      reason: e.detail.value
    })
  },

  submit(){
    const {id,reason,defaultReason,defaultReasonStr}=this.data
    if(!defaultReason && !reason){
      wx.showToast({
        title: '请填写理由',
      })
      return
    }
    req.put('/api/order/refund/'+id+'?reason='+(reason || defaultReasonStr))
      .then(res=>res.data.data)
      .then(data=>{
        wx.navigateBack({
          
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})