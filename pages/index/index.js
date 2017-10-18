//index.js
//获取应用实例
import config from '../../config'
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    scrollTop:"0",
    loadingMoreHidden:true,

    serverUrl:config.serverUrl,
    goodsList:[],
    banners:[]
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  scroll: function (e) {
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })

    this.loadBanners()

    wx.request({
      url: config.serverUrl+'/api/product',
      success:res=>{
        if(res.data.code === 0){
          this.setData({
            goodsList:res.data.data
          })
        }
      }
    })
  },
  loadBanners(){
    wx.request({
      url: config.serverUrl+'/banner',
      success:res=>{
        if(res.data.code === 0){
          this.setData({
            banners:res.data.data
          })
        }
      }
    })
  },
})
