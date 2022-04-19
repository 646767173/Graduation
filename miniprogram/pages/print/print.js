const db = wx.cloud.database();
import { getTimeNow } from '../../utils/time';
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
		money:1,
		filePath:'',
		name:'',
		phone:''
	},
	bindTime(e){
		this.setData({
			timeIndex:e.detail.value,
		})
	},
	selectAddress(e){
		wx.setStorageSync('url', 'print');
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
						let filePath = res.fileID;
						wx.cloud.getTempFileURL({
							fileList:[filePath],
							success:(res)=>{
								this.setData({
									uploaded:true,
									filePath:res.fileList[0].tempFileURL
								});
								wx.showToast({
									title: '上传成功',
								})
								wx.hideLoading();
							}
						})
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
			Money = (pageNum*1)*(copyNum*4) + (copyNum*1)
		}else if(colorPrint || twoSided){
			Money = (pageNum*1)*(copyNum*2) + (copyNum*1)
		}else{
			Money = (pageNum*0.5)*(copyNum*1) + (copyNum*1)
		};
		this.setData({
			money:Money
		})
		wx.showToast({
			title: '刷新费用成功',
		})
	},
	submit(){
		this.reflashMoney();
		const that = this.data;
		const money = that.money;
		if( !that.pageNum || !that.copyNum || !that.uploaded || !that.address){// 必选项
			wx.showToast({
				icon:'none',
				title: '您填入的信息不全，请补全带*号的必填项',
			})
			return;
		};
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
							name:'帮我印',//模块名
							time: getTimeNow(),//当前时间
							money: that.money,//订单金额
							state: '待帮助',//订单状态
							address: that.address,//收件地址
							info: {//订单信息
								filePath: that.filePath,// 原件路径
								pageNum: that.pageNum,// 打印页数
								copyNum: that.copyNum,// 打印份数
								colorPrint: that.colorPrint,// 是否彩印
								double: that.twoSided,// 是否双面
								remark: that.remark,// 备注信息
								expectTime: that.timeArray[that.timeIndex],// 期望时间
							},
							userInfo: that.userInfo,//用户信息
							phone: that.phone,//收件电话
							username: that.name,//收件人姓名
							createTime: db.serverDate()//用于排序的时间
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