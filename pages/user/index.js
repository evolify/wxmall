// pages/user/index.js
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=app.globalData.userInfo
    if(!userInfo){
      app.getUserInfo(userInfo=>{
        this.updateUserInfo(userInfo)
      })
    }else{
      this.updateUserInfo(userInfo)
    }
  },

  updateUserInfo(userInfo){
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    })
  },

  toOrderList(){
    wx.navigateTo({
      url: '/pages/order-list/index',
    })
  },
  toAddressList(){
    wx.navigateTo({
      url: '/pages/address/index',
    })
  },
  toUserType(){
    wx.navigateTo({
      url: '/pages/user-type/index',
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
  
  }
})