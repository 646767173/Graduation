const db = wx.cloud.database();
import { getTimeNow } from '../../utils/time';
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
		businessArray:['顺丰速递','京东快递','圆通速递','韵达快递','中通快递','申通快递','其他快递(写在备注)'],
		timeIndex:0,
		timeArray:['尽快送达','今天中午1点前','今天晚上8点前'],
		genderIndex:0,
		genderArray:['不限性别','仅限男生','仅限女生'],
		amountIndex:0,
		amountArray:['1个','2个','3个','4个','5个'],
		money:2,
		address:'',
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
	getExpressCode(e){
		this.setData({
			expressCode: e.detail.value
		})
	},
	getAddMoney(e){
			this.setData({
				addMoney:Number(e.detail.value)
			})
	},
	getRemark(e){
		this.setData({
			remark: e.detail.value
		})
	},
	getCode(){
		wx.chooseImage({
			count: 1,
			sizeType:['compressed','original'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				wx.showLoading({
					title: '加载中',
				})
				const random = Math.floor(Math.random()*1000);
				wx.cloud.uploadFile({
					cloudPath:`expressCode/${random}.png`,
					filePath: res.tempFilePaths[0],
					success:(res) =>{
						let fileID = res.fileID;
						this.setData({
							codeImg:fileID
						})
						wx.hideLoading();
					}
				})
			}
		})
	},
	submit(){
		const that = this.data;
		// 判断必填值是否填入
		if(!that.address || !(that.expressCode || that.codeImg) ){
			wx.showToast({
				icon:'none',
				title: '您填入的信息不全，请填写必填项',
			})
			return;
		}
		db.collection('order').add({
			data:{
				name: '帮我取',//模块名
				time: getTimeNow(),//当前时间
				money: that.money + that.addMoney,//订单金额
				state: '待帮助',//订单状态
				address: that.address,//收件地址
				info: {//订单信息
					size: that.typeList[that.typeNow].name,// 快递大小
					business: that.businessArray[that.businessIndex],// 快递商家
					expressCode: that.expressCode,// 取件码
					codeImg: that.codeImg,// 取件码截图
					remark: that.remark,// 备注信息
					expectTime: that.timeArray[that.timeIndex],// 期望时间
					expectGender: that.genderArray[that.genderIndex],// 性别限制
					amount: that.amountArray[that.amountIndex]// 快递数量
				},
				userInfo: that.userInfo//用户信息
			},
			success:(res)=>{
				wx.switchTab({
					url: '../index/index',
				});
				wx.showToast({
					title: '发布成功',
				});
			},
			fail:(res)=>{
				wx.showToast({
					inco:'none',
					title: '发布失败',
				})
			}
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
		const address = wx.getStorageSync('addressNow');
		const userInfo = wx.getStorageSync('userInfo');
		if(address){
			const {build,houseNumber} = address;
			this.setData({
				address:`${build}-${houseNumber}`
			})
		}
		this.setData({
			userInfo,
		})
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