var app = getApp();
import req from '../../utils/request.js'
const statusList = ["全部", "待付款", "待发货", "待收货", "已完成"]
Page({
    data:{
      id:0,
      no:'',
      status:'待付款',
      orderTime:'',
      price:0.00,

      orderContent:[],
      address:null,
    },
    onLoad:function(e){
      var orderId = e.id
      this.orderDetails(orderId)
    },
    orderDetails(id){
      req.get('/api/order/'+id)
        .then(res=>data.data)
        .then(data=>{
          this.setData({
            ...data,
            status:statusList[data.status],
          })
        })
    },

    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
    confirmBtnTap:function(e){
      var that = this;
      var orderId = e.currentTarget.dataset.id;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading();
              wx.request({
                url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/delivery',
                data: {
                  token: app.globalData.token,
                  orderId: orderId
                },
                success: (res) => {
                  wx.request({
                    url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/reputation',
                    data: {
                      token: app.globalData.token,
                      orderId: orderId,
                      reputation:2
                    },
                    success: (res) => {
                      wx.hideLoading();
                      if (res.data.code == 0) {
                        that.onShow();
                      }
                    }
                  })
                }
              })
            }
          }
      })
    }
})