// pages/address/address.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		address:[],
	},
	addAddress(e){
		wx.navigateTo({
			url: '../addAddress/addAddress',
		})
	},
	edit(e){
		const index = e.currentTarget.dataset.index;
		const address = this.data.address[index];
		wx.navigateTo({
			url: `../addAddress/addAddress?address=${JSON.stringify(address)}&index=${index}`,
		})
	},
	delete(e){
		const that = this;
		wx.showModal({
			title:'是否删除？',
			confirmText:'删除',
			cancelText:'取消',
			success:function (res) {
				if (res.confirm) {
					const index = e.currentTarget.dataset.index;
					const address = that.data.address;
					address.splice(index,1);
					wx.setStorageSync('address', address);
					wx.showToast({
						title: '删除成功',
					})
					that.onLoad();
				} else {
					return;
				}
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const address = wx.getStorageSync('address');
		this.setData({
			address,
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