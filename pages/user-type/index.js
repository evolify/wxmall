// pages/user-type/index.js
import req from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:0,
    companyName:'',
    tfn:''
  },

  setType(e){
    console.log(e.currentTarget.dataset.type)
    this.setData({
      userType: parseInt(e.currentTarget.dataset.type)
    })
  },

  cancel(){
    wx.navigateBack({
      
    })
  },
  submit(){
    const {userType,companyName,tfn}=this.data
    if(userType===1 && (!companyName || !tfn)){
      wx.showToast({
        title: '企业信息不能为空',
      })
      return
    }

    req.put('/api/user/type',{userType,companyName,tfn})
      .then(res=>res.data.data)
      .then(data=>{})
    this.cancel()
  },
  onNameChange(e){
    this.setData({
      companyName:e.detail.value.trim()
    })
  },
  onTfnChange(e){
    this.setData({
      tfn:e.detail.value.trim()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    req.get('/api/user/type')
      .then(res=>res.data.data)
      .then(data=>{
        this.setData({
          ...data
        })
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