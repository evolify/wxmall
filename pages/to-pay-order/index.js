//index.js
//获取应用实例
import config from '../../config'
import req from '../../utils/request.js'
var app = getApp()

Page({
  data: {
    goodsList:[],

    totalPrice:0,
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，

    serverUrl:config.serverUrl,
    deliverType:0, //0 渔山岛自提，1 邮寄
    addressList:[],
    addressArray:[],//picker中用到，tx实力有点low。。。
    address:null,
    tips:''
  },

  
  onLoad: function (options) {
    // that.setData({
    //   isNeedLogistics: 1,
    //   orderType: options.orderType
    // });
    const {orderType,goodsId,count}=options
    this.initGoodsList(orderType,goodsId,count)
  },

  tapFetch(){
    this.setData({
      deliverType:0
    })
  },
  tapPost() {
    this.setData({
      deliverType: 1
    })
  },
  bindAddressChange(e){
    this.setData({
      address:this.data.addressList[e.detail.value]
    })
  },

  initGoodsList(orderType,goodsId,count){
    let list=[]
    if(orderType === "buyNow"){
      req.get('/api/goods/'+goodsId)
        .then(res=>res.data)
        .then(data=>{
          if(data.code===0){
            list.push({
              goods: data.data,
              count
            })
          }
          return list
        })
        .then(list=>{
          this.setData({
            goodsList:list,
            totalPrice: list[0].goods.price * list[0].count
          })
        })
    }else{
      list=wx.getStorageSync('toByGoodsList')      
      this.setData({
        goodsList:list,
        totalPrice:list.length>1
          ?list.reduce((v1,v2)=>v1.goods.price*v1.count+v2.goods.price*v2.count)
          :list[0].goods.price*list[0].count
      })
    }
  },

  onShow : function () {
    this.loadAddressList()
  },

  loadAddressList(){
    req.get('/api/address')
      .then(res=>res.data)
      .then(data=>{
        if(data.code===0){
          let address
          if (this.data.address && this.data.address.id) {
            address = data.data.find(addr => addr.id === this.data.address.id)
          } else {
            address = data.data[0]
          }
          this.setData({
            addressList: data.data,
            addressArray: data.data.map(item => item.contact + '  ' + item.address),
            address
          })
        }
      })
  },

  submitOrder(e){
    wx.showLoading();
    req.post('/api/order',{
        price: this.data.totalPrice,
        deliverType: this.data.deliverType,
        addressId: this.data.deliverType === 1 ? this.data.address.id : null,
        orderContents: this.data.goodsList.map(o => ({
          goodsId: o.goods.id,
          count: o.count
        })),
        tips:e.detail.value.tips
      })
      .then(res=>res.data)
      .then(data=>{
        wx.hideLoading()
        this.updateShoppingCar()
        wx.reLaunch({
          url: "/pages/order-list/index"
        });
      })
  },

  updateShoppingCar(){
    if(this.data.orderType!=='buyNow'){
      let list1 = wx.getStorageSync('toByGoodsList')
      let list2=wx.getStorageSync('shoppingCar')
      wx.setStorage({
        key: 'shoppingCar',
        data: list2.filter(o=>list1.every(o1=>o1.goods.id!==o.goods.id))
      })
      wx.removeStorageSync('toByGoodsList')
    }
  },

  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = e.detail.value.remark; // 备注信息

    var postData = {
      token: loginToken,
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      postData.provinceId = that.data.curAddressData.provinceId;
      postData.cityId = that.data.curAddressData.cityId;
      if (that.data.curAddressData.districtId) {
        postData.districtId = that.data.curAddressData.districtId;
      }
      postData.address = that.data.curAddressData.address;
      postData.linkMan = that.data.curAddressData.linkMan;
      postData.mobile = that.data.curAddressData.mobile;
      postData.code = that.data.curAddressData.code;
    }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }


    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/order/create',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的 参数
      success: (res) =>{
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        
        if ("buyNow" != that.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
        }

        // 下单成功，跳转到订单管理界面
        wx.reLaunch({
          url: "/pages/order-list/index"
        });
      }
    })
  },

  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  editAddress(){
    const address = this.data.address
    if(!address || !address.id){
      wx.showModal({
        title: '错误',
        content: '请选择一个地址',
        showCancel: false
      })
      return
    }
    wx.navigateTo({
      url: '/pages/address-add/index?id='+address.id,
    })
  },
  // selectAddress: function () {
  //   wx.navigateTo({
  //     url:"/pages/select-address/index"
  //   })
  // },
})
