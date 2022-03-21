// pages/addAddress/addAddress.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		defaultAddress:true,
		build:'',
		houseNumber:'',
		name:'',
		phone:'',
		isEdit:false,//是否编辑
		editNow:false,//当前编辑中
		editIndex:0,
	},
	selectBuilding(){
		wx.navigateTo({
			url: '../selectBuilding/selectBuilding',
		})
	},
	getHouseNumber(e){
		this.setData({
			houseNumber:e.detail.value
		})
	},
	getName(e){
		this.setData({
			name:e.detail.value
		})
	},
	getPhone(e){
		this.setData({
			phone:e.detail.value
		})
	},
	changeSwitch(e){
		this.setData({
			defaultAddress:e.detail.value
		})
	},
	save(e){
		const { build,houseNumber,name,phone,defaultAddress,isEdit,editNow,index } = this.data;
		if(!build || !houseNumber || !name || !phone){// 判断信息是否输入完全
			wx.showToast({
				title: '您输入的信息不全，请完善',
				icon:'none'
			});
			return;
		}
		let address = wx.getStorageSync('address');
		if (!isEdit&&defaultAddress&&address) {
			for (let i = 0; i < address.length; i++) {
				if(address[i].defaultAddress){
					wx.showToast({
						icon:'none',
						title: '已存在默认地址!',
					})
					return;
				}
			}
		}
		const form = {
			build,
			houseNumber,
			name,
			phone,
			defaultAddress,
		};
		if(!address){
			address = [form];//第一次让它变成一个地址数组，里面的元素是地址对象
		}else{//非首次，
			if (editNow) {//替换掉当前修改的地址
				address[Number(index)] = form;
			}else{
				address.push(form);//自动加入到数组中，保存为新地址
			}
		}
		wx.setStorageSync('address', address);
		wx.redirectTo({
			url: '../address/address',
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//取出页面参数
		// const build = options.build;
		const { build,address,index } = options;
		if (address) {
			const { build:builds,houseNumber,name,phone,defaultAddress } = JSON.parse(address);
			if (defaultAddress) {
				this.setData({
					isEdit:true
				});
			}
			this.setData({
				build:builds,
				houseNumber,
				name,
				phone,
				defaultAddress,
				index,
				editNow:true
			})
		}else{
			this.setData({
				build,
			})
		}
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