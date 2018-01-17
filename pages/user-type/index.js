// pages/user-type/index.js
import req from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:0,
    name:'',
    phone:'',
    address:'',

    tfn:'',
    companyName:'',
    companyPhone:'',
    companyAddress:'',
    bank:'',
    bankAccount:'',
    bankAddress:''
  },

  setType(e){
    this.setData({
      userType: parseInt(e.currentTarget.dataset.type)
    })
  },

  cancel(){
    wx.navigateBack({
      
    })
  },
  submit(){
    const { userType, name, phone, address, tfn, companyName, companyPhone, companyAddress, bank, bankAccount,bankAddress}=this.data
    let obj={}
    if(userType === 0){
      if (!name || !phone || !address){
        wx.showToast({
          title: '个人信息不能为空',
        })
        return
      }
      obj={userType,name,phone,address}
    }else if (userType === 1){
      if (!companyName || !tfn || !companyPhone || !companyAddress || !bank || !bankAccount || !bankAddress){
        wx.showToast({
          title: '企业信息不能为空',
        })
        return
      }
      obj = { userType, tfn, companyName, companyPhone, companyAddress, bank, bankAccount, bankAddress}
    }

    req.put('/api/user/type',obj)
      .then(res=>res.data.data)
      .then(data=>{})
    this.cancel()
  },
  onNameChange(e){
    this.setData({
      name:e.detail.value.trim()
    })
  },
  onPhoneChange(e){
    this.setData({
      phone:e.detail.value.trim()
    })
  },
  onAddressChange(e){
    this.setData({
      address:e.detail.value.trim()
    })
  },


  onTfnChange(e){
    this.setData({
      tfn:e.detail.value.trim()
    })
  },
  onCompanyNameChange(e){
    this.setData({
      companyName:e.detail.value.trim()
    })
  },
  onCompanyPhoneChange(e){
    this.setData({
      companyPhone:e.detail.value.trim()
    })
  },
  onCompanyAddressChange(e){
    this.setData({
      companyAddress:e.detail.value.trim()
    })
  },
  onBankChange(e){
    this.setData({
      bank:e.detail.value.trim()
    })
  },
  onBankAccountChange(e){
    this.setData({
      bankAccount:e.detail.value.trim()
    })
  },
  onBankAddressChange(e){
    this.setData({
      bankAddress:e.detail.value.trim()
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