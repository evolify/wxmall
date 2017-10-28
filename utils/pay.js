import req from './request.js'
function wxpay(app, price, id, redirectUrl) {

  req.post('/api/wxpay/unified/'+id)
    .then(res=>res.data.data)
    .then(data=>{
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        fail: function (err) {
          wx.showToast({ title: '支付失败:' + err })
        },
        success: function () {
          wx.showToast({ title: '支付成功' })
          wx.reLaunch({
            url: redirectUrl
          });
        }
      })
    })
}

module.exports = {
  wxpay: wxpay
}
