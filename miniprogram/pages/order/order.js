const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabList:['全部','我的订单','我帮助的','正在悬赏'],
		tabNow:0,//当前选中的数组下标，默认是全部

	},
	selectTab(e){
		this.setData({
			tabNow:e.currentTarget.dataset.id//将当前下标赋值给tabNow
		})
	}
	,
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		db.collection('order').get({
			success:(res)=>{
				const {data} = res;
				data.forEach(item => {
					const {business,expectGender,expectTime,number,remark,size} = item.info;
					const info = `快递类型：${size} -- 快递数量：${number}个 -- 快递商家：${business} -- 期望性别：${expectGender} -- 期望时间：${expectTime} -- 备注信息：${remark}`;
					item.info = info;
				});
				this.setData({
					orderList: data,
				})
			},
			fail:(res) => {
				wx.showToast({
					icon:'none',
					title: '查询失败',
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