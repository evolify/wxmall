// pages/goodsList/index.js
import config from '../../config'
import req from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    cateId:0,
    keywords:'',
    serverUrl:config.serverUrl,

    page:0,
    size:20,
    count:0,
    totalCount:0,
    totalPage:0,
    last:false,
    first:false
  },

  page({ size = 20, number = 0, numberOfElements = 0, totalElements = 0, totalPages = 0, first = true, last = false, }) {
    this.setData({
      size,last,first,
      page:number,
      count:numberOfElements,
      totalCount:totalElements,
      totalPage:totalPages
    })
    return this
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {cateId,cateName}=options
    this.setData({
      cateId
    },()=>{
      this.loadProducts()
    })
    wx.setNavigationBarTitle({
      title: cateName,
    })
  },


  load(page) {
    const {keywords,cateId,size}=this.data
    return req.get('/api/product/byCategory/'+cateId+'?keywords='+keywords+'&size='+size+'&page='+page)
      .then(res => res.data.data)
  },

  loadProducts(){
    return this.load(0)
      .then(data => {
        this.setData({
          goodsList: data.content
        })
        this.page(data)
      })
  },

  nextPage(){
    const { page, last } = this.data
    if (!last) {
      this.load(page + 1)
        .then(data => {
          this.setData({
            goodsList: [...this.data.goodsList, ...data.content]
          })
          this.page(data)
        })
    }
  },

  onKeywordsChange(e){
    this.setData({
      keywords:e.detail.value
    },()=>{
      //输入事件触发搜索，如果体验不好再去掉。
      this.onSearch()
    })
  },
  onSearch(){
    this.loadProducts()
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
    wx.showLoading()
    this.loadProducts()
      .then(()=>{
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.nextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  toDetails(e){
    wx.navigateTo({
      url: '/pages/goods-details/index?id=' + e.currentTarget.dataset.id,
    })
  }
})