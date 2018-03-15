//index.js
import config from '../../config'
import req from '../../utils/request.js'
var app = getApp()
Page({
  data: {
    serverUrl:config.serverUrl,
    saveHidden:true,
    totalPrice:0,
    allSelect:true,
    noSelect:false,
    list:[],
    selectedIds:[],
    delBtnWidth:120,    //删除按钮宽度单位（rpx）
    startX:0
  },
 
 //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  onLoad: function () {
      this.initEleWidth()
  },
  onShow(){
    var shoppingCar = wx.getStorageSync('shoppingCar')
    this.setData({
      list:[],
      selectedIds:[]
    })
    shoppingCar.forEach(item => {
      req.get('/api/goods/' + item.goods.id)
        .then(res => res.data)
        .then(data => {
          if (data.code === 0) {
            this.refreshData(shoppingCar, data.data)
          } else {
            this.removeGoods(item.goods.id)
          }
        })
    })
  },
  removeGoods(id){
    const list = this.data.list.filter(item => item.goods.id !== id)
    const ids = this.data.selectedIds.filter(i => i !== id)
    this.updateData(list, ids)
  },
  refreshData(list,goods){
    let item=list.find(i=>i.goods.id === goods.id)
    if(item){
      item.goods=goods
      this.updateData(list,this.data.selectedIds)
    }
  },
  updateData(list, selectedIds) {
    this.setData({
      list: list.map(item => ({
        ...item,
        selected: selectedIds.some(id => id === item.goods.id)
      })),
      selectedIds,
      allSelect: list.length === selectedIds.length,
      noSelect: selectedIds.length === 0,
      totalPrice: this.totalPrice(list, selectedIds)
    })
    wx.setStorage({
      key: 'shoppingCar',
      data: list,
    })
  },
  totalPrice: function (list, ids) {
    if (ids.length <= 0) {
      return 0
    }
    const price = list.filter(item => ids.some(id => item.goods.id === id))
      .map(item => item.goods.price*item.count)
      .reduce((p1, p2) => p1 + p2)
    return parseFloat(price.toFixed(2))
  },
  toIndexPage:function(){
      wx.switchTab({
            url: "/pages/index/index"
      });
  },

  touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
    if(e.touches.length==1){
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var style = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，container位置不变
        style = "margin-left:0px";
      }else if(disX > 0 ){//移动距离大于0，container left值等于手指移动距离
        style = "margin-left:-"+disX+"px";
        if(disX>=delBtnWidth){
          style = "margin-left:-"+delBtnWidth+"px";
        }
      }
      const id = e.currentTarget.dataset.id;
      let list=this.data.list
      let item=list.find(i=>i.goods.id === id)
      if(item){
        item.style=style
        this.updateData(list,this.data.selectedIds)
      }
    }
  },

  touchE:function(e){
    var index = e.currentTarget.dataset.index;    
    if(e.changedTouches.length==1){
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var style = disX > delBtnWidth/2 ? "margin-left:-"+delBtnWidth+"px":"margin-left:0px";

      const id = e.currentTarget.dataset.id;
      let list = this.data.list
      let item = list.find(i => i.goods.id === id)
      if (item) {
        item.style = style
        this.updateData(list, this.data.selectedIds)
      }
    }
  },
  delItem:function(e){
    const id = e.currentTarget.dataset.id
    const list=this.data.list.filter(item=>item.goods.id!==id)
    const ids=this.data.selectedIds.filter(i=>i!==id)
    this.updateData(list,ids)
  },
  selectTap:function(e){
    var id = e.currentTarget.dataset.id;
    let list=[]
    if(this.data.selectedIds.some(i=>i === id)){
      list=this.data.selectedIds.filter(i=>i!==id)
    }else{
      list=[...this.data.selectedIds,id]
    }
    this.updateData(this.data.list,list)
   },
   bindAllSelect:function(){
      let {list,selectedIds}=this.data
      if(list.length === selectedIds.length){
        this.updateData(this.data.list,[])
      }else{
        this.updateData(this.data.list,this.data.list.map(item=>item.goods.id))
      }
   },

   incBtnTap:function(e){
    const id = e.currentTarget.dataset.id;
    let list = this.data.list
    let item = list.find(i=>i.goods.id === id)
    if(!item){
      return
    }
    item.count++
    this.updateData(list,this.data.selectedIds)
   },
   decBtnTap:function(e){
     const id = e.currentTarget.dataset.id;
     let list = this.data.list
     let item = list.find(i => i.goods.id === id)
     if (!item) {
       return
     }
     item.count=item.count<=1 ?1 :item.count-1
     this.updateData(list, this.data.selectedIds)
   },

   editTap:function(){
     console.log('edit')
     this.setData({
       saveHidden:false
     })
   },
   saveTap:function(){
     this.setData({
       saveHidden:true
     })
   },

    /**
     * 删除选择
     */
    deleteSelected:function(){
      if (this.data.noSelect) {
        return
      }
      let {list,selectedIds}=this.data
      list=list.filter(item=>selectedIds.every(id=>id!==item.goods.id))
      this.updateData(list,[])
    },

    toPayOrder:function(){
      if(this.data.noSelect){
        return
      }
      wx.showLoading()
      var that = this;
      if (this.data.noSelect) {
        return;
      }
      wx.setStorageSync('toBuyGoodsList', this.data.list.filter(item=>item.selected))
      this.navigateToPayOrder()
    },
    navigateToPayOrder:function () {
      wx.hideLoading();
      wx.navigateTo({
        url:"/pages/to-pay-order/index?goodsIds="+JSON.stringify(this.data.selectedIds)
      })
    },

    toDetails(e){
      wx.navigateTo({
        url: '/pages/goods-details/index?id=' + e.currentTarget.dataset.id,
      })
    },

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showLoading()
    this.onLoad()
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },



})
