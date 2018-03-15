// pages/category/index.js
import config from "../../config"
import req from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories:[],
    cates:[],
    selectedCates:[],
    keywords:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCategories()
  },

  loadCategories(){
    return req.get('/api/category')
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          this.setData({
            categories: data.data,
            cates: data.data
          })
        }
      })
  },

  onKeywordsChange(e) {
    this.setData({
      keywords: e.detail.value
    }, () => {
    })
  },
  onSearch() {
    if (this.data.selectedCates.length > 0) {
      const { id, name } = this.data.selectedCates[this.data.selectedCates.length - 1]
      this.toGoodsList(id, name,this.data.keywords)
    } else {
      this.toGoodsList(0, '全部分类',this.data.keywords)
    }
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
    this.loadCategories()
      .then(()=>{
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  tapAll(){
    if (this.data.selectedCates.length > 0) {
      const {id,name} = this.data.selectedCates[this.data.selectedCates.length - 1]
      this.toGoodsList(id,name)
    } else {
      this.toGoodsList(0,'全部分类')
    }
  },

  toGoodsList(id,name,keywords){
    wx.navigateTo({
      url: '/pages/goodsList/index?cateId='+id+'&cateName='+name+'&keywords='+(keywords || ''),
    })
  },

  navBack(e){
    if(this.data.selectedCates.length>1){
      const cate=this.data.selectedCates[this.data.selectedCates.length-2]
      this.setData({
        cates:cate.children,
        selectedCates:this.data.selectedCates.slice(0,this.data.selectedCates.length-1)
      })
    }else{
      this.setData({
        cates:this.data.categories,
        selectedCates:[]
      })
    }
  },
  tapCate:function(e){
    const cate = e.currentTarget.dataset.cate
    if(cate.children && cate.children.length>0){
      this.setData({
        cates:cate.children || [],
        selectedCates:[...this.data.selectedCates,cate]
      })
    }else{
      this.toGoodsList(cate.id,cate.name)
    }
  }
})