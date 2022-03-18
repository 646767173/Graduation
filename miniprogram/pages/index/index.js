Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[
      '../../images/333.png','../../images/333.png'
    ],
    indexFunctions:[
      {
        icon:'../../images/Qujian.png',
        text:'帮我取',
        url:'../get/get'
      },
      {
        icon:'../../images/Banli.png',
        text:'帮我印',
        url:'../print/print'
      },
      {
        icon:'../../images/Gouwu.png',
        text:'帮我买',
        url:'../buy/buy'
      },
      {
        icon:'../../images/Kuaisong.png',
        text:'帮我送',
        url:'../deliver/deliver'
      },
    ],
    differentHelp:{
      text:'其它易送',
      url:'../handle/handle'
    }
  },
  toDetail(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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