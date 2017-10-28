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
    selectedCates:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    req.get('/api/category')
      .then(res=>res.data)
      .then(data=>{
        if (data.code === 0) {
          this.setData({
            categories: data.data,
            cates: data.data
          })
        }
      })
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

  toGoodsList(){
    let cates = this.data.selectedCates.map(c => c.id)
    
    wx.navigateTo({
      url: '/pages/goodsList/index?cates='+JSON.stringify(cates),
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
    const cate = e.target.dataset.cate
    this.setData({
      cates:cate.children || [],
      selectedCates:[...this.data.selectedCates,cate]
    })
  }
})