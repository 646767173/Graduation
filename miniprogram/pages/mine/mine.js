// pages/mine/mine.js
const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo:{},
		hasUserInfo:false,
		canIUseGetUserProfile:false,
		state:'',//success表示已是接单员，fail表示申请但未通过，loading表示审核中，null表示未申请过
		admin:false,
	},
	/* 
		复制内容data到剪切板
		wx.setClipboardData({
			data: 'data',
			success:()=>{
				wx.showToast({
					title: '复制成功',
				})
			}
		})
	*/
	toExamine(){
		wx.navigateTo({
			url: '../examine/examine',
		})
	},
	updateInfo(){
		if(this.data.hasUserInfo){
			wx.navigateTo({
				url: '../updateInfo/updateInfo',
			})
		}
	},
	toApplyOrder(){
		const {state} = this.data;
		switch (state) {
			case 'success':
				wx.showModal({
					title: '提示',
					content: '您已是接单员了，请勿重复申请',
					showCancel:false
				})
				break;
			case 'fail':
				wx.showModal({
					title: '提示',
					content: '您之前提交的申请未通过，可继续申请',
					success:(res)=>{
						const {confirm} = res;
						if(confirm){
							wx.navigateTo({
								url: '../applyOrder/applyOrder',
							})
						}
					}
				})
				break;
			case 'loading':
				wx.showModal({
					title: '提示',
					content: '您的申请正在审核中，请耐心等待',
					showCancel:false
				})
				break;
			default:
				wx.navigateTo({
					url: '../applyOrder/applyOrder',
				})
				break;
			
		}
	},
	toAboutUs(){
		wx.navigateTo({
			url: '../aboutUs/aboutUs',
		})
	},
	toHelp(){
		wx.navigateTo({
			url: '../help/help',
		})
	},
	isAdmin(){//判断当前用户是否为管理员
		db.collection('admin').where({
			adminID:wx.getStorageSync('openID')
		}).get({
			success:(res)=>{
				this.setData({
					admin:!!res.data.length
				})
			}
		})
	},
	// 新接口的方法
	getUserProfile(){
		wx.getUserProfile({
			desc: '获取您的微信头像与昵称',//获取信息的目的是什么，描述给用户
			success:(res)=>{
				this.setData({
					userInfo:res.userInfo,
					hasUserInfo:true,
				})
				wx.setStorageSync('userInfo', res.userInfo);//将获取的信息缓存
			}
		})
	},

	// 老接口的方法
	getUserInfo(e){
		this.setData({
			userInfo:e.detail.userInfo,
			hasUserInfo:true
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if(wx.getUserProfile){//存在的话，我就可以使用
			this.setData({
				canIUseGetUserProfile:true//令是否可用为true
			})
		}
		const userInfo = wx.getStorageSync('userInfo');
		this.setData({
			hasUserInfo:!!userInfo,//两次取反确保为布尔值
			userInfo:userInfo,
		});
		let state;//申请接单当前状态
		this.isAdmin();//是否管理员？
		db.collection('applyOrder').where({
			_openid:wx.getStorageSync('openID')
		}).get({
			success:(res)=>{
				const {data} = res;
				if(data.length){
					for(let i = 0;i < data.length;i++){
						if (data[i].state === '通过') {
							state = 'success';
							break;
						}else if(data[i].state === '不通过') {
							state = 'fail';
							break;
						}else{
							state = 'loading';
							break;
						}
					}
				}else{
					state = 'null'
				}
				this.setData({
					state,
				})
			}
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