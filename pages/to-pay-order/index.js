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
    calcFreight:0,
    invoiceType:0, //发票类型，0：不需要开票，1：个人发票，2：公司发票
    invoiceTitle:null,//发票抬头
    tfn: null,//公司税号    tfn:'',
    companyName: '',
    companyPhone: '',
    companyAddress: '',
    bank: '',
    bankAccount: '',
    bankAddress: '',
    addressList:[],
    addressArray:[],//picker中用到
    address:null,
    tips:'',
    invoiceOptions:['不开发票','个人发票','增值税普通发票', '增值税专用发票'],
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
        const {name,tfn,companyName,companyPhone,companyAddress,bank,bankAccount,bankAddress}=data
        this.setData({
          invoiceTitle:name,
          tfn, companyName, companyPhone, companyAddress, bank, bankAccount, bankAddress
        })
        if(data.userType===1){
          this.setData({
            invoiceType:2
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
      freight:this.data.calcFreight,
      totalPrice:this.data.goodsPrice+this.data.calcFreight
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
  onCompanyNameChange(e){
    this.setData({
      companyName:e.detail.value
    })
  },
  onCompanyPhoneChange(e){
    this.setData({
      companyPhone:e.detail.value
    })
  },
  onCompanyAddressChange(e){
    this.setData({
      companyAddress:e.detail.value
    })
  },
  onBankChange(e){
    this.setData({
      bank:e.detail.value
    })
  },
  onBankAccountChange(e){
    this.setData({
      bankAccount:e.detail.value
    })
  },
  onBankAddressChange(e){
    this.setData({
      bankAddress:e.detail.value
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
          let price = list[0].goods.price * list[0].count
          price = parseFloat(price.toFixed(2))
          const calcFreight = price < 3000 ?20 :0
          const freight = this.data.deliverType === 1 ?calcFreight :0
          this.setData({
            goodsList:list,
            goodsPrice: price,
            calcFreight,
            freight,
            totalPrice:price+freight
          })
        })
    }else{
      list=wx.getStorageSync('toBuyGoodsList') || [0]
      let price = [0,...list].reduce((v1,v2)=>v1+v2.goods.price*v2.count)
      price=parseFloat(price.toFixed(2))
      const calcFreight = price < 3000 ? 20 : 0
      const freight = this.data.deliverType === 1 ? calcFreight : 0
      this.setData({
        goodsList:list,
        goodsPrice:price,
        calcFreight,
        freight,
        totalPrice:price+freight
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
    const { 
      invoiceType, invoiceTitle, name, tfn, companyName, companyPhone, companyAddress, bank, bankAccount, bankAddress,
      totalPrice, deliverType, freight, address
      } = this.data
    if(!this.data.goodsList || this.data.goodsList.length===0){
      wx.showToast({
        title: '商品列表为空',
      })
      return
    }
    if(deliverType === 1 && (!address || !address.id)){
      wx.showToast({
        title: '请选择收货地址',
      })
      return
    }
    wx.showLoading()
    req.post('/api/order',{
        price: totalPrice,
        deliverType,
        freight,
        invoiceType,invoiceTitle, name, tfn, companyName, companyPhone, companyAddress, bank, bankAccount, bankAddress,
        addressId: deliverType === 1 ? address.id : null,
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
      let list1 = wx.getStorageSync('toBuyGoodsList')
      let list2=wx.getStorageSync('shoppingCar')
      wx.setStorage({
        key: 'shoppingCar',
        data: list2.filter(o=>list1.every(o1=>o1.goods.id!==o.goods.id))
      })
      wx.removeStorageSync('toBuyGoodsList')
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
