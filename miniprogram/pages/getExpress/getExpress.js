// pages/getExpress/getExpress.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		typeList:[
			{
				name:'小尺寸',
				mes:'小尺寸：手机巴掌大小--(20cm*50cm)，费用2元',
			},
			{
				name:'中尺寸',
				mes:'中尺寸：鞋服盒子大小--(30cm*60cm)，费用4元',
			},
			{
				name:'大尺寸',
				mes:'大尺寸：重量≥5kg，费用7元',
			},
			],
		typeNow:0,
		showMore:false,
		isReward:false,
	},
	selectType(e){
		const {id,mes} = e.currentTarget.dataset;
		this.setData({
			typeNow: id
		})
		wx.showToast({
			icon: 'none',
			title: mes,
		})
	},
	showMore(){
		this.setData({
			showMore:!this.data.showMore
		})
	},
	handleChangeReward(e){
		const value = e.detail.value;
		this.setData({
			isReward:value,
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