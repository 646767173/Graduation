const utils = require("../../utils/utils.js");
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo:{},
	},

	updateName: utils.debounce(function(e){//updateName添加防抖
		this.Name(e);
	}),
	Name: function(e){
		let userInfo = this.data.userInfo;
		userInfo.nickName = e[0].detail.value;
		this.setData({
			userInfo:userInfo//键值对，同名时可简写
		})
	},
	updatePhone:utils.debounce(function(e){//updatePhone添加防抖
		this.Phone(e);
	}),
	Phone(e){
		let userInfo = this.data.userInfo;
		userInfo.phone = e.detail.value;
		this.setData({
			userInfo,
		})
	},

	updateAvatar(){
		let userInfo = this.data.userInfo;
		wx.chooseImage({
			count: 1,//只选择一张
			sizeType:['original','compressed'],//原图、压缩
			sourceType: ['album', 'camera'],//相册、拍照
			success:(res) => {
				wx.showLoading({
					title: '加载中',
				})
				const random = Math.floor(Math.random() * 1000);//取随机数
				wx.cloud.uploadFile({
					cloudPath: `avatar/${this.data.userInfo.nickName}-${random}.png`,
					filePath: res.tempFilePaths[0],
					success:(res)=>{
						let fileID = res.fileID;
						userInfo.avatarUrl = fileID;
						this.setData({
							userInfo,
						})
						wx.hideLoading();
					}
				})
			}
		})
	},

	updateAddress(){
		wx.setStorageSync('url', 'updateInfo');
		wx.navigateTo({
			url: '../address/address',
		})
	},

	submit(){
		wx.setStorageSync('userInfo', this.data.userInfo);
		wx.showToast({
			title: '修改成功',
		})
		wx.switchTab({
			url: '../mine/mine',
			// switchTab不会调用onload，需要进行如下优化
			success: function (e) {
				var page = getCurrentPages().pop();
				if (page == undefined || page == null) return;
				page.onLoad();
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const userInfo = wx.getStorageSync('userInfo');
		this.setData({
			userInfo,
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
		wx.switchTab({
			url: '../mine/mine',
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