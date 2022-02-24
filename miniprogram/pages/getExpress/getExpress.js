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
				money:2
			},
			{
				name:'中尺寸',
				mes:'中尺寸：鞋服盒子大小--(30cm*60cm)，费用4元',
				money:4
			},
			{
				name:'大尺寸',
				mes:'大尺寸：重量≥5kg，费用7元',
				money:7
			},
			],
		typeNow:0,
		showMore:false,
		isReward:false,
		businessIndex:0,
		businessArray:['顺丰速递','京东快递','圆通速递','韵达快递','中通快递','申通快递','其他快递'],
		selectBusiness:false,
		timeIndex:0,
		timeArray:['不限时间','尽快送达','今天中午1点前','今天晚上8点前'],
		genderIndex:0,
		genderArray:['不限性别','仅限男生','仅限女生'],
		amountIndex:0,
		amountArray:['1个','2个','3个(+1元)','3~5个(+2元)','5~7个(+3元)'],
		money:2,
		address:'',
		business:'',
		expressCode:'',
		codeImg:'',
		remark:'',
		addMoney:0,
		userInfo:{}
	},
	bindAmount(e){
		this.setData({
			amountIndex:e.detail.value,
		})
	},
	bindGender(e){
		this.setData({
			genderIndex:e.detail.value,
		})
	},
	bindBusiness(e){
		this.setData({
			businessIndex:e.detail.value,
			selectBusiness:true,
		})
	},
	bindTime(e){
		this.setData({
			timeIndex:e.detail.value,
		})
	},
	selectType(e){
		const {id,mes} = e.currentTarget.dataset;
		this.setData({
			typeNow: id,
			money: this.data.typeList[id].money,
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
	selectAddress(e){
		wx.navigateTo({
			url: '../address/address',
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