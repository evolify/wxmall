//index.js
//获取应用实例
import config from '../../config'
import req from '../../utils/request.js'
var app = getApp()

Page({
  data: {
    goodsList:[],

    goodsPrice:0,//商品价格
    totalPrice:0,//订单总价格，包含运费
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，

    serverUrl:config.serverUrl,
    deliverType:0, //0 渔山岛自提，1 邮寄
    freight:0, //运费 如果是快递，运费为20
    invoiceType:0, //发票类型，0：不需要开票，1：个人发票，2：公司发票
    invoiceTitle:null,//发票抬头
    tfn:null,//公司税号
    addressList:[],
    addressArray:[],//picker中用到，tx实力有点low。。。
    address:null,
    tips:'',
    invoiceOptions:['不开发票','个人发票','企业发票'],
  },

  
  onLoad: function (options) {
    const {orderType,goodsId,count}=options
    this.initGoodsList(orderType,goodsId,count)
    this.initInvoice()
  },

  initInvoice(){
    req.get('/api/user/type')
      .then(res=>res.data.data)
      .then(data=>{
        if(data.userType===1){
          this.setData({
            invoiceType:2,
            invoiceTitle: data.companyName,
            tfn:data.tfn
          })
        }else{
          this.setData({
            invoiceType:0
          })
        }
      })
  },

  tapFetch(){
    this.setData({
      deliverType:0,
      freight:0,
      totalPrice:this.data.goodsPrice
    })
  },
  tapPost() {
    this.setData({
      deliverType: 1,
      freight:20,
      totalPrice:this.data.goodsPrice+20
    })
  },
  bindAddressChange(e){
    this.setData({
      address:this.data.addressList[e.detail.value]
    })
  },
  onInvoiceTypeChange(e){
    this.setData({
      invoiceType:e.detail.value
    })
  },
  onInvoiceTitleChange(e){
    this.setData({
      invoiceTitle:e.detail.value
    })
  },
  onTfnChange(e){
    this.setData({
      tfn:e.detail.value
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
          const price = list[0].goods.price * list[0].count
          this.setData({
            goodsList:list,
            goodsPrice: price,
            totalPrice:price+this.data.freight
          })
        })
    }else{
      list=wx.getStorageSync('toByGoodsList')     
      const price = list.length > 1
        ? list.reduce((v1, v2) => v1.goods.price * v1.count + v2.goods.price * v2.count)
        : list[0].goods.price * list[0].count 
      this.setData({
        goodsList:list,
        goodsPrice:price,
        totalPrice:price+this.data.freight
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
        freight:this.data.freight,
        invoiceType:this.data.invoiceType,
        invoiceTitle:this.data.invoiceTitle,
        tfn:this.data.tfn,
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
        wx.redirectTo({
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
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
