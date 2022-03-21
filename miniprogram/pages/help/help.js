const utils = require("../../utils/utils.js");
const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		name:'',
		phone:'',
		mes:{},
	},
	getName: utils.debounce(function(e){//给getName加防抖
		this.Name(e);
	}),
	Name: function(e){
		this.setData({
			name: e[0].detail.value
		})
	},
	getPhone: utils.debounce(function(e){//给getUserID加防抖
		this.Phone(e);
	}),
	Phone: function(e){
		this.setData({
			phone: e[0].detail.value
		})
	},
	getProblem: utils.debounce(function(e){//加防抖
		this.Problem(e);
	}),
	Problem: function(e){
		this.setData({
			['mes.problem']: e[0].detail.value
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
					cloudPath: `feedback/${this.data.name}-${random}.png`,
					filePath: res.tempFilePaths[0],
					success:(res)=>{
						let fileID = res.fileID;
						this.setData({
							['mes.img']:fileID,
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
		if(!that.name || !that.phone || !that.mes.problem || !that.mes.img ){
			wx.showToast({
				icon:'none',
				title: '您填入的信息不全，请补全后重试',
			})
			return;
		}
		db.collection('feedback').add({// 提交到数据库
			data:{
				name: that.name,//姓名
				phone: that.phone,//电话
				mes: that.mes,//反馈内容
				state:'待处理'//状态
			},
			success:(res)=>{
				// 清空输入内容
				this.setData({
					name:'',
					phone:'',
					mes:''
				});
				wx.switchTab({
					url: '../mine/mine',
				});
				wx.showToast({
					title: '提交成功',
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