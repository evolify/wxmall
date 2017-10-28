// var commonCityData = require('../../utils/city.js')
//获取应用实例
import config from '../../config'
import req from '../../utils/request.js'
var app = getApp()
Page({
  data: {

    region: ['浙江省', '宁波市', '北仑区'],
    customItem: '全部',

    serverUrl:config.serverUrl,

    edit:false,

    provinces:[],
    citys:[],
    districts:[],

    id:null,
    contact: null,
    phone: null,
    province: '浙江省',
    city:'宁波市',
    district:'镇海区',
    address:null,
    zipCode:null,
  },


  onLoad: function (options) {
    console.log(options)
    const {id}=options
    if(id){
      req.get('/api/address /'+id)
        .then(res=>res.data)
        .then(data=>{
          if (data.code === 0) {
            this.setData({
              edit: true,
              id: data.data.id,
              contact: data.data.contact,
              phone: data.data.phone,
              province: data.data.province,
              city: data.data.city,
              district: data.data.district,
              address: data.data.address,
              zipCode: data.data.zipCode
            })
          }
        })
    }
  },

  bindRegionChange(e){
    const [p,c,d]=e.detail.value
    this.setData({
      province:p,
      city:c,
      district:d
    })
  },

  bindSave: function(e) {
    var contact = e.detail.value.contact;
    var address = e.detail.value.address;
    var phone = e.detail.value.phone;
    var zipCode = e.detail.value.zipCode;
    const {id,province,city,district,edit}=this.data

    if (!contact || !phone ||!province){
      wx.showModal({
        title: '提示',
        content: '请完善信息',
        showCancel:false
      })
      return
    }
    if(edit){
      this.update(id, contact, phone, province, city, district, address, zipCode)
    }else{
      this.add(contact, phone, province, city, district, address, zipCode)
    }
  },

  add(contact, phone, province, city, district, address, zipCode){
    req.post('/api/address',{contact, phone, province, city, district, address, zipCode})
      .then(res=>res.data)
      .then(data=>{
        if(data.code === 0){
        }
        wx.navigateBack({})
      })
  },

  update(id,contact, phone, province, city, district, address, zipCode){
    req.put('/api/address/'+id, { id, contact, phone, province, city, district, address, zipCode })
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
        }
        wx.navigateBack({})
      })
  },

  bindCancel: function () {
    wx.navigateBack({})
  },
  deleteAddress: function (e) {
    if(!this.data.edit){
      return
    }
    var that = this
    var id = this.data.id
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: res=> {
        if (res.confirm) {
          req.delete('/api/address/'+id)
            .then(res=>{
              wx.navigateBack({})
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  loadRegion(pid=1,success){
  },
})
