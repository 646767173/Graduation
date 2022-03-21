Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabList:['教学楼','英东楼','图书馆','科学楼','北区宿舍','南区宿舍'],
		tabNow:0,
	},
	selectBuilding(e){
		const that = this.data;
		const index = e.currentTarget.dataset.index;
		let build;
		// 楼栋分支处理
		switch (that.tabNow) {
			case 1://英东楼
				build = `${that.tabList[that.tabNow]}-${index+1}层`;
				break;
			case 2://图书馆
				build = `${that.tabList[that.tabNow]}-${index+1}层`;
				break;
			case 3://科学楼
				build = `${that.tabList[that.tabNow]}-${index+1}层`;
				break;
			case 4://北区宿舍
				build = `${that.tabList[that.tabNow]}-${index+7}栋`;
				break;
			case 5://南区宿舍
				build = `${that.tabList[that.tabNow]}-${index+1}栋`;
				break;
			default://教学楼
				build = `${that.tabList[that.tabNow]}-${index+2}层`;
				break;
		}
		wx.redirectTo({
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