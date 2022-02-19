// pages/selectBuilding/selectBuilding.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabList:['教学楼','英东楼','图书馆','科学楼','北区宿舍','南区宿舍'],
		tabNow:0,
		nanqu:['A','B','C','D','E','F']
	},
	selectBuilding(e){
		const that = this.data;
		const index = e.currentTarget.dataset.index;
		const build = `${that.tabList[that.tabNow]}-${index+2}层`;
		wx.navigateTo({
			url: `../addAddress/addAddress?build=${build}`,
		})
	},
	selectTab(e){
		const id = e.currentTarget.dataset.id;
		this.setData({
			tabNow:id,
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