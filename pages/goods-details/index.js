//index.js
//获取应用实例
import config from '../../config'
import req from '../../utils/request'
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail:{},
    swiperCurrent: 0,  
    hasMoreSelect:false,
    selectSize:"选择：",
    selectSizePrice:0,
    shopNum:0,
    hideShopPopup:true,
    buyNumber:0,
    buyNumMin:1,
    buyNumMax:0,

    propertyChildIds:"",
    propertyChildNames:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo:{},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车

    serverUrl:config.serverUrl,

    id:0,
    name:'',
    no:'',
    category:{},
    brand:{},
    images:[],
    descImages:[],
    description:'',
    props:[],
    goodsList:[],

    goods:{},
    optional:false,
    count:1,

    shoppingCar:[]
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  onLoad: function (e) {
    var that = this;
    // 获取购物车数据
    wx.getStorage({
      key: 'shoppingCar',
      success: function(res) {
        that.setData({
          shoppingCar:res.data || []
        });
      }
    })

    // 获取商品信息
    this.details(e.id)

  },

  details(id){
    return req.get('/api/product/' + id)
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          data = data.data
          this.setData({
            id: data.id,
            name: data.name,
            no: data.no,
            description: data.description,
            category: data.category,
            brand: data.brand,
            images: data.images,
            descImages: data.descImages,
            props: data.props,
            goodsList: data.goodsList,
            goods: data.goodsList[0],
            optional: data.goodsList.length > 1
          })
        }
      })
  },

  /**
   * 选择商品规格
   */
  selectGoods(e){
    this.setData({
      goods: e.currentTarget.dataset.goods
    })
  },

  /**
   * 跳转购物车
   */
  toShoppingCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  
  /**
   * 添加购物车
   */
  toAddShoppingCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
    // if(this.data.optional){
    //   this.bindGuiGeTap();
    // }else{
    //   this.addShoppingCar()
    // }
  },

  /**
   * 购买
   */
  toBuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    // if(this.data.optional){
    //   this.bindGuiGeTap();
    // }else{
    //   this.buyNow()
    // }
  },  
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
     this.setData({  
        hideShopPopup: false 
    })  
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function() {
     this.setData({  
        hideShopPopup: true 
    })  
  },

  countInput: function(e){
    const value =e.detail.value
    if(!value){
      this.setData({
        count:''
      })
      return value
    }
    if(/^(0|[1-9]\d*)$/.test(value)){
      this.setData({
        count:parseInt(value)
      })
      return value
    }
    return this.data.count
  },
  countDec: function() {
    const c = parseInt(this.data.count)
    this.setData({  
        count: c<=1 ?1 :c-1
    })  
  },
  countInc: function() {
    this.setData({  
      count: (parseInt(this.data.count) || 0)+1
    })  
  },

  /**
  * 加入购物车
  */
  addShoppingCar:function(){
    let {goods,count}=this.data
    let shoppingCar = [
      ...this.data.shoppingCar.filter(i=>i.goods.id!==goods.id),
      {
        goods,
        count:count || 1
      }
    ]

    this.setData({
      shoppingCar:shoppingCar
    });

    // 写入本地存储
    wx.setStorage({
      key:"shoppingCar",
      data:shoppingCar
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
  },
	/**
	  * 立即购买
	  */
  buyNow:function(){
    this.closePopupTap();
    const goods = this.data.goods
    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow&goodsId="+goods.id+"&count="+(this.data.count||1)
    })    
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading()
    this.details(this.data.id)
      .then(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
})
