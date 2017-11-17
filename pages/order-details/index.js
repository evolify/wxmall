var app = getApp();
import config from '../../config.js'
import req from '../../utils/request.js'
Page({
    data:{
      id:0,
      no:'',
      statusStr:'待付款',
      status:1,
      orderTime:'',
      price:0.00,

      orderContent:[],
      address:null,
      trackingNo:null,

      serverUrl:config.serverUrl
    },
    onLoad:function(e){
      var orderId = e.id
      this.orderDetails(orderId)
    },
    orderDetails(id){
      return req.get('/api/order/details/'+id)
        .then(res=>res.data.data)
        .then(data=>{
          this.setData({
            ...data
          })
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      wx.showLoading()
      this.orderDetails(this.data.id)
        .then(res => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
    },

    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
})