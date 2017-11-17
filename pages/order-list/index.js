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
    orderList:[],

    page: 0,
    size: 20,
    count: 0,
    totalCount: 0,
    totalPage: 0,
    last: false,
    first: false
  },

  page({ size = 20, number = 0, numberOfElements = 0, totalElements = 0, totalPages = 0, first = true, last = false, }) {
    this.setData({
      size, last, first,
      page: number,
      count: numberOfElements,
      totalCount: totalElements,
      totalPage: totalPages
    })
    return this
  },

  onShow(){
    this.loadOrderList(this.data.status)
  },
  load(status,page){
    return req.get('/api/order/byStatus/' + status+'?page='+page+'&size='+this.data.size)
      .then(res => res.data.data)
  },
  loadOrderList(status){
    return this.load(status,0)
      .then(data=>{
        this.setData({
          orderList:data.content
        })
        this.page(data)
      })
  },
  statusTap:function(e){
     var status =  e.currentTarget.dataset.index;
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
              this.loadOrderList(this.data.status)
            })
        }
      }
    })
  },

  toPayTap:function(e){
    const {id,price}=e.currentTarget.dataset
    wxpay.wxpay(app, price, id, "/pages/order-list/index");
  },
  confirmOrder(e){
    const { id } = e.currentTarget.dataset
    req.put('/api/order/confirm/'+id)
      .then(res=>{
        wx.showToast({
          title: '确认收货',
          icon:'success'
        })
        this.loadOrderList(this.data.status)
      })
  },
  refund(e){
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/refund/index?id='+id,
    })
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading()
    this.loadOrderList(this.data.status)
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    const{status,last,page,orderList}=this.data
    if(!last){
      this.load(status,page+1)
        .then(data=>{
          this.setData({
            orderList: [...orderList,...data.content]
          })
          this.page(data)
        })
    }
  }
})