const utils = require("../../utils/utils.js");
const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo:{},
		applyMes:{},
	},
	getName: utils.debounce(function(e){//给getName加防抖
		this.Name(e);
	}),
	Name: function(e){
		this.setData({
			['applyMes.name']: e[0].detail.value
		})
	},
	getUserID: utils.debounce(function(e){//给getUserID加防抖
		this.UserID(e);
	}),
	UserID: function(e){
		this.setData({
			['applyMes.userID']: e[0].detail.value
		})
	},
	showTips(){
		wx.showModal({
			content: '1.证件号指您学生证上面的号码，2.相关证件正面指的是学生证正面',
			showCancel: true,
			title: '内容说明',
		})
	},
	uploadImg(){
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed','original'],
			sourceType: ['camera','album'],
			success:(res)=>{
				wx.showLoading({
					title: '加载中',
				})
				const random = Math.floor(Math.random()*1000);
				wx.cloud.uploadFile({
					cloudPath: `applyImg/${this.data.userInfo.nickName}-${random}.png`,
					filePath: res.tempFilePaths[0],
					success:(res)=>{
						let fileID = res.fileID;
						this.setData({
							['applyMes.applyImg']:fileID,
						})
						wx.hideLoading()
					}
				})
			}
		})
	},
	submit(){
		const that = this.data;
		// 判断是否填入必选项
		if(!that.applyMes.applyImg || !that.applyMes.userID || !that.applyMes.name ){
			wx.showToast({
				icon:'none',
				title: '您填入的信息不全，请填写内容项',
			})
			return;
		}
		db.collection('applyOrder').add({// 提交到数据库
			data:{
				name:that.applyMes.name,
				userID:that.applyMes.userID,
				applyImg:that.applyMes.applyImg,
				userInfo:that.userInfo,
				state:'待审核'
			},
			success:(res)=>{
				// 清空输入内容
				this.setData({
					applyMes:''
				});
				wx.showToast({
					title: '提交成功',
				});
				wx.navigateTo({
					url: '../applyOrderLoading/applyOrderLoading'
					});
			},
			fail:(res)=>{
				wx.showToast({
					icon:'error',
					title: '提交失败，请检查后重试',
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const userInfo = wx.getStorageSync('userInfo');
		const applyMes = wx.getStorageSync('applyMes');
		this.setData({
			userInfo,
			applyMes,
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