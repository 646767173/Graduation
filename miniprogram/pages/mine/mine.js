// pages/mine/mine.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo:{},
		hasUserInfo:false,
		canIUseGetUserProfile:false,
	},

	// 新接口的方法
	getUserProfile(){
		wx.getUserProfile({
			desc: '获取您的微信头像与昵称',//获取信息的目的是什么，描述给用户
			success:(res)=>{
				this.setData({
					userInfo:res.userInfo,
					hasUserInfo:true,
				})
				wx.setStorageSync('userInfo', res.userInfo);//将获取的信息缓存
			}
		})
	},

	// 老接口的方法
	getUserInfo(e){
		this.setData({
			userInfo:e.detail.userInfo,
			hasUserInfo:true
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if(wx.getUserProfile){//存在的话，我就可以使用
			this.setData({
				canIUseGetUserProfile:true//令是否可用为true
			})
		}
		const userInfo = wx.getStorageSync('userInfo');
		this.setData({
			hasUserInfo:!!userInfo,//两次取反确保为布尔值
			userInfo:userInfo,
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