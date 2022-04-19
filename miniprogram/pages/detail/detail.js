const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		order:{}
	},
	copy(e){
		const url = this.data.order.info.filePath;
		wx.setClipboardData({
			data: url,
			success:()=>{
				wx.showToast({
					title: '文件URL已复制到剪切板',
					icon:'none'
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const {id} = options;
		db.collection('order').where({_id:id}).get({
			success:(res)=>{
				let order = res.data[0];
				this.setData({
					order,
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})