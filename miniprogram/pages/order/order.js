const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabList:['全部','我的订单','我帮助的','正在悬赏'],
		tabNow:0,//当前选中的数组下标，默认是全部
		orderList:[],
	},
	selectTab(e){
		this.setData({
			tabNow:e.currentTarget.dataset.id//将当前下标赋值给tabNow
		})
	},
	formatInfo(orderInfo){//把不同模块的订单进行不同的格式处理后，展示在页面上
		const{name,info} = orderInfo;
		if (name === '帮我取') {
			const {size,destination,expectTime,expectGender,addMoney,remark} = info;
			return `取件大小: ${size} / 取件地址：${destination} / 性别限制：${expectGender} / 期望时间：${expectTime} / 额外打赏：${addMoney}元 / 备注：${remark} `
		}else if (name === '帮我印') {
			const {pageNum,copyNum,colorPrint,double,expectTime,remark} = info;
			return `打印页数: ${pageNum} / 打印份数：${copyNum} / 是否彩印：${colorPrint?'是':'否'} / 是否双面：${double?'是':'否'} / 期望送达：${expectTime} / 备注：${remark} `
		}else if (name === '帮我买') {
			const {size,destination,expectTime,expectGender,addMoney,remark} = info;
			return `商品大小: ${size} / 购买地址：${destination} / 性别限制：${expectGender} / 期望时间：${expectTime} / 额外打赏：${addMoney}元 / 备注：${remark} `
		}else if (name === '帮我送') {
			const {size,destination,expectTime,addMoney,remark} = info;
			return `送件大小: ${size} / 送件地址：${destination} / 期望时间：${expectTime} / 额外打赏：${addMoney}元 / 备注：${remark} `
		}else{//其它易送
			const {detail,destination,remark} = info;
			return `办理内容：${detail} / 办理地址：${destination} / 备注：${remark} `
		}
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
		db.collection('order').get({//实现全部订单的查询
			success:(res)=>{
				const {data} = res;
				data.forEach(item => {
					item.info = this.formatInfo(item);
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
		/* //实现获取openid
		wx.cloud.callFunction({
			name:'getMyOpenID',
			success:(res)=>{
				db.collection('order').where({
					_openid: res.result.openid
				}).get({
					success:(res)=>{
						//查到的res就是我的订单，需要将数据处理一下
						const {data} = res;
						data.forEach(item => {
							const {business,expectGender,expectTime,amount,remark,size} = item.info;
							const info = `快递大小：${size} / 快递数量：${amount} / 快递商家：${business} / 性别限制：${expectGender} / 期望时间：${expectTime} / 备注信息：${remark}`;
							item.info = info;
						});
						this.setData({
							orderList: data,
						})
					}
				})
			}
		})
		*/
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
		wx.onShow();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		wx.showLoading({
			title: '加载中',
		})
		let orderList = this.data.orderList;

		db.collection('order').skip(orderList.length).get({
			success:(res)=>{
				if(res.data.length){
					res.data.forEach(item=>{
						item.info = this.formatInfo(item);
						orderList.push(item);
					})
					this.setData({
						orderList,
					})
				}else{
					wx.showToast({
						title: '无更多信息',
						icon:'none'
					})
				}
				// wx.hideLoading();
			},
			fail:(error) => {
				wx.showToast({
					title: '服务器出错...',
					icon:'error'
				})
				wx.hideLoading();
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})