//app.js
import config from './config'
import req from './utils/request'
App({
  onLaunch: function () {
    wx.setStorageSync('mallName','易捷商城')
    this.configReq()
    this.beforeLogin();
    this.getUserInfo()
  },
  configReq(){
    req.baseUrl(config.serverUrl)
      .interceptor(res=>{
        switch(res.data.code){
          case 401: 
            wx.showToast({
              icon: 'loading',
              title: '重新登录',
            })
            this.login()
            return false;
          case 0:
            return true;
          default:
            wx.showToast({
              title: '操作失败',
            })
            return false;
        }
      })
  },
  beforeLogin() {
    const token = wx.getStorageSync('token')
    this.globalData.token=token
    if (token) {
      wx.checkSession({
        success: function () {
          
        },
        fail: ()=> {
          //登录失效
          this.globalData.token=null
          this.login()
        }
      })
    }else{
      this.login()
    }
  },
  login(){
    wx.login({
      success: function (res) {
        console.log(res)
        req.post('/api/user/login/'+res.code)
          .then(res=>res.data)
          .then(data=>{
            if(data.code === 0){
              wx.setStorageSync('token', data.data)
              req.header({token:data.data})
              wx.reLaunch({
                url: '/pages/index/index',
                success: () => {

                }
              })
            }
          })
      }
    })
  },
  getUserInfo(success){
    wx.getUserInfo({
      withCredentials: true,
      lang: '',
      success: res=> {
        this.globalData.userInfo=res.userInfo
        success && success(res.userInfo)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  globalData:{
    userInfo:null,
    subDomain: "mall",
    token:null,
    header:{token:''}
  }
})
