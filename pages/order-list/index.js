var wxpay = require('../../utils/pay.js')
import req from '../../utils/request.js'
import config from '../../config'
var app = getApp()
Page({
  data:{
    serverUrl:config.serverUrl,
    statusList:["全部","待付款","待发货","待收货","已完成"],
    status:1,
    tabClass: ["", "", "", "", ""],
    orderList:[]
  },
  onShow(){
    this.loadOrderList(this.data.status)
  },
  loadOrderList(status){
    req.get('/api/order/byStatus/'+status)
      .then(res=>res.data.data)
      .then(data=>{
        this.setData({
          orderList:data
        })
      })
  },
  statusTap:function(e){
     var status =  e.currentTarget.dataset.index;
     console.log(status)
     this.loadOrderList(status)
     this.setData({
      status
     });
  },


  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    console.log(id)
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: res=> {
        if (res.confirm) {
          wx.showLoading();
          req.delete('/api/order/'+id)
            .then(res=>{
              wx.hideLoading()
              this.loadOrderList()
            })
        }
      }
    })
  },

  toPayTap:function(e){
    const {id,price}=e.currentTarget.dataset
    wxpay.wxpay(app, price, id, "/pages/order-list/index");
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  getOrderStatistics : function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: app.globalData.token },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[1] = "red-dot"
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[2] = "red-dot"
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[3] = "red-dot"
          }
          if (res.data.data.count_id_success > 0) {
            tabClass[4] = "red-dot"
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  
  }
})