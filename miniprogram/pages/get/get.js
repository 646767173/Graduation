const db = wx.cloud.database();
import { getTimeNow } from '../../utils/time';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		typeList: [
			{
				name: '小尺寸',
				mes: '小尺寸：手机巴掌大小--(20cm*50cm)，费用2元',
				money: 2
			},
			{
				name: '中尺寸',
				mes: '中尺寸：鞋服盒子大小--(40cm*80cm)，费用4元',
				money: 4
			},
			{
				name: '大尺寸',
				mes: '大尺寸：重量≥5kg，费用7元',
				money: 7
			},
		],
		typeNow: 0,
		showMore: false,
		isReward: false,
		timeIndex: 0,
		timeArray: ['尽快送达', '今天中午1点前', '今天晚上8点前'],
		genderIndex: 0,
		genderArray: ['不限性别', '仅限男生', '仅限女生'],
		money: 2,
		addMoney: 0,
		address: '',
		destination: '',
		detail: '',
		detailImg: '',
		remark: '',
		phone: '',
		name: '',
		userInfo: {}
	},
	bindGender(e) {
		this.setData({
			genderIndex: e.detail.value,
		})
	},
	bindTime(e) {
		this.setData({
			timeIndex: e.detail.value,
		})
	},
	selectType(e) {
		const { id, mes } = e.currentTarget.dataset;
		this.setData({
			typeNow: id,
			money: this.data.typeList[id].money,
		})
		wx.showToast({
			icon: 'none',
			title: mes,
		})
	},
	showMore() {
		this.setData({
			showMore: !this.data.showMore
		})
	},
	handleChangeReward(e) {
		const value = e.detail.value;
		this.setData({
			isReward: value,
		})
	},
	selectAddress(e) {
		wx.setStorageSync('url', 'get');
		wx.navigateTo({
			url: '../address/address',
		})
	},
	getDestination(e) {
		this.setData({
			destination: e.detail.value
		})
	},
	getDetail(e) {
		this.setData({
			detail: e.detail.value
		})
	},
	getDetailImg() {
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed', 'original'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				wx.showLoading({
					title: '加载中',
				})
				const random = Math.floor(Math.random() * 1000);
				wx.cloud.uploadFile({
					cloudPath: `getImg/${random}.png`,
					filePath: res.tempFilePaths[0],
					success: (res) => {
						let fileID = res.fileID;
						wx.cloud.getTempFileURL({
							fileList:[fileID],
							success:(res)=>{
								this.setData({
									detailImg: res.fileList[0].tempFileURL
								})
								wx.hideLoading();
							}
						})
					}
				})
			}
		})
	},
	getAddMoney(e) {
		this.setData({
			addMoney: Number(e.detail.value)
		})
	},
	getRemark(e) {
		this.setData({
			remark: e.detail.value
		})
	},
	submit() {
		const that = this.data;
		const money = that.money + that.addMoney;
		// 判断必填值是否填入
		if (!that.address || !that.destination || !(that.detail || that.detailImg)) {
			wx.showToast({
				icon: 'none',
				title: '您填入的信息不全，请补全带*号的必填项',
			})
			return;
		}
		wx.showModal({
			title: '请支付',
			content: '需支付'+money+'元',
			confirmText: '确认支付',
			cancelText: '取消',
			success(res) {
				if (res.confirm) {//用户点击确定
					wx.showToast({
						title: '支付成功',
					});
					db.collection('order').add({
						data: {
							name: '帮我取',//模块名
							time: getTimeNow(),//当前时间
							money: that.money + that.addMoney,//订单金额
							state: '待帮助',//订单状态
							address: that.address,//收件地址
							info: {//订单信息
								size: that.typeList[that.typeNow].name,// 取件大小
								detail: that.detail,// 取件详情
								detailImg: that.detailImg,// 取件详情图
								destination: that.destination,//取件地址
								remark: that.remark,// 备注信息
								expectTime: that.timeArray[that.timeIndex],// 期望时间
								expectGender: that.genderArray[that.genderIndex],// 性别限制
								addMoney: that.addMoney,// 额外打赏
							},
							userInfo: that.userInfo,//用户信息
							phone: that.phone,//用户电话
							username: that.name,//收件人姓名
							createTime: db.serverDate()//用于排序的时间
						},
						success: (res) => {
							wx.switchTab({
								url: '../index/index',
							});
							wx.showToast({
								title: '发布成功',
							});
						},
						fail: (res) => {
							wx.showToast({
								inco: 'none',
								title: '发布失败',
							})
						}
					})
				} else if (res.cancel) {//用户点击取消
					wx.showToast({
						icon:'none',
						title: '已取消',
					});
				}
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
		if (address) {
			const { build, houseNumber, phone, name } = address;
			this.setData({
				address: `${build}-${houseNumber}`,
				phone,
				name,
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
		wx.switchTab({
			url: '../index/index',
		})
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