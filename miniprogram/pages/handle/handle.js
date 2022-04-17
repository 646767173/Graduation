const db = wx.cloud.database();
import { getTimeNow } from '../../utils/time';
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		money:10,
		destination:'',
		detail:'',
		detailImg:'',
		remark:'',
		userInfo:{},
		address:'',
		name:'',
		phone:''
	},
	selectAddress(e){
		wx.setStorageSync('url', 'handle');
		wx.navigateTo({
			url: '../address/address',
		})
	},
	getDestination(e){
		this.setData({
			destination: e.detail.value
		})
	},
	getDetail(e){
		this.setData({
			detail: e.detail.value
		})
	},
	getDetailImg(){
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
					cloudPath:`getImg/${random}.png`,
					filePath: res.tempFilePaths[0],
					success:(res) =>{
						let fileID = res.fileID;
						this.setData({
							detailImg:fileID
						})
						wx.hideLoading();
					}
				})
			}
		})
	},
	getRemark(e){
		this.setData({
			remark: e.detail.value
		})
	},
	submit(){
		const that = this.data;
		const money = that.money;
		// 判断必填值是否填入
		if(!that.address || !that.destination || !(that.detail || that.detailImg) ){
			wx.showToast({
				icon:'none',
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
						data:{
							name: '其他易送',//模块名
							time: getTimeNow(),//当前时间
							money: that.money,//订单金额
							state: '待帮助',//订单状态
							address:that.address,//您的地址
							info: {//订单信息
								detail: that.detail,// 办理内容详情
								detailImg: that.detailImg,// 详情图
								destination: that.destination,// 办理地址
								remark: that.remark,// 备注信息
							},
							userInfo: that.userInfo,// 用户信息
							phone:that.phone,//电话
							username:that.name//姓名
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
		if(address){
			const {build,houseNumber,phone,name} = address;
			this.setData({
				address:`${build}-${houseNumber}`,
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