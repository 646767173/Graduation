Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		timeIndex:0,
		timeArray:['不限时间','尽快送达','今天中午1点前','今天晚上8点前'],
		uploaded:false,
		address:'',
		userInfo:{},
		pageNum:0,//页数
		copyNum:1,//份数
		remark:'',//备注
		colorPrint:false,
		twoSided:false,
		money:2,
	},
	bindTime(e){
		this.setData({
			timeIndex:e.detail.value,
		})
	},
	selectAddress(e){
		wx.navigateTo({
			url: '../address/address',
		})
	},
	uploadFile(e){//上传打印文件
		wx.chooseMessageFile({
			count: 1,
			type:'all',
			success:(res)=>{
				wx.showLoading({
					title: '加载中',
				});
				const random = Math.floor(Math.random()*1000);
				wx.cloud.uploadFile({
					cloudPath:`printFile/${random}.doc`,
					filePath: res.tempFiles[0].path,
					success:(res)=>{
						this.setData({
							uploaded:true
						});
						wx.showToast({
							title: '上传成功',
						})
						wx.hideLoading();
					},
					fail:(res)=>{
						wx.showToast({
							title: '上传失败',
							icon:'none'
						})
					}
				})
			}
		})
	},
	getPageNumber(e){//页数
		this.setData({
			pageNum:Number(e.detail.value),
		})
	},
	getCopyNumber(e){//份数
		this.setData({
			copyNum:Number(e.detail.value),
		})
	},
	getColorPrint(e){//彩印
		this.setData({
			colorPrint:e.detail.value,
		})
	},
	getTwoSided(e){//双面打印
		this.setData({
			twoSided:e.detail.value,
		})
	},
	getRemark(e){
		this.setData({
			remark:e.detail.value
		})
	},
	reflashMoney(){
		let Money;
		let that = this.data;
		let colorPrint = that.colorPrint;
		let twoSided = that.twoSided;
		let pageNum = that.pageNum;
		let copyNum = that.copyNum;
		if(colorPrint && twoSided){
			Money = (pageNum*1)*(copyNum*4) + (copyNum*2)
		}else if(colorPrint || twoSided){
			Money = (pageNum*1)*(copyNum*2) + (copyNum*2)
		}else{
			Money = (pageNum*1)*(copyNum*1) + (copyNum*2)
		};
		this.setData({
			money:Money
		})
		wx.showToast({
			title: '刷新费用成功',
		})
	},
	submit(){
		
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
		// 获取个人信息
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
		// 提示内容
		wx.showToast({
			icon:'none',
			title: '请确保上传打印文件格式为doc',
		});
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