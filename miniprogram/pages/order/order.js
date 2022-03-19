const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabList:['全部','我发布的','我帮助的','正在求助'],
		tabNow:0,//当前选中的数组下标，默认是全部
		openID:'',//账号标识
		orderList:[],
		myOrder:[],
		helpOrder:[],
		needOrder:[],
	},
	selectTab(e){
		const {id} = e.currentTarget.dataset;
		this.setData({
			tabNow:id//将当前下标赋值给tabNow
		});
		if (id === 0) {
			this.onShow();
		}else if(id === 1){
			this.getMyOrder();
		}else if(id === 2){
			this.getHelpOrder();
		}else if(id === 3){
			this.getNeedOrder();
		}
	},
	getMyOrder(e){//获取我的订单
		wx.showLoading({
			title: '加载中',
		});
		db.collection('order').where({
			_openid:this.data.openID
		}).get({
			success:(res)=>{
				const{data}=res;
				data.forEach(item=>{
					if(item.address == undefined)//未输入目的地，则办理地址为目的地
						item.address = item.info.destination;
					item.info = this.formatInfo(item);
					item.stateColor = this.formatState(item.state);
				});
				this.setData({
					myOrder:data,
				})
				wx.hideLoading();
			}
		})
	},
	getHelpOrder(e){//获取我帮助的订单
		wx.showLoading({
			title: '加载中',
		});
		db.collection('order').where({
			receivePerson:this.data.openID
		}).get({
			success:(res)=>{
				const{data}=res;
				data.forEach(item=>{
					if(item.address == undefined)//未输入目的地，则办理地址为目的地
						item.address = item.info.destination;
					item.info = this.formatInfo(item);
					item.stateColor = this.formatState(item.state);
				});
				this.setData({
					helpOrder:data,
				})
				wx.hideLoading();
			}
		})
	},
	getNeedOrder(e){//获取求助中的订单
		wx.showLoading({
			title: '加载中',
		});
		db.collection('order').where({
			state:'待帮助'
		}).get({
			success:(res)=>{
				const{data} = res;
				data.forEach(item=>{
					if(item.address == undefined)//未输入目的地，则办理地址为目的地
						item.address = item.info.destination;
					item.info = this.formatInfo(item);
					item.stateColor = this.formatState(item.state)
				});
				this.setData({
					needOrder:data
				})
				wx.hideLoading();
			}
		})
	},
	orderReceive(e){//接单
		wx.showLoading({
			title: '加载中',
		});
		const {item} = e.currentTarget.dataset;
		const {_id} = item;
		const tabNow = this.data.tabNow;
		/* if(item._openid === this.data.openID){//判断是否为自己发出的订单
			wx.showToast({
				title: '不能接自己发布的订单！',
				icon: 'none'
			})
			return;
		} */
		db.collection('order').doc(_id).update({//对数据库进行修改
			data:{
				receivePerson:this.data.openID,//添加属性，值为接单人openID
				state:'帮助中'//修改状态为帮助中
			},
			success:(res)=>{
				if(tabNow===0)
					this.onShow();
				else
					this.getNeedOrder();
				wx.hideLoading();
			},
			fail:(res)=>{
				wx.showToast({
					title: '接单失败',
					icon:"error"
				})
			}
		})
	},
	toFinish(e){//帮助完成
		wx.showLoading({
			title: '加载中',
		});
		const {item} = e.currentTarget.dataset;
		const {_id} = item;
		db.collection('order').doc(_id).update({
			data:{
				state:'已完成'
			},
			success:(res)=>{
				this.getMyOrder();
				wx.hideLoading();
			}
		});
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
	formatState(state){//处理状态，并设置其对应的样式
		if(state==='待帮助'){
			return 'top_right';
		}else if(state==='帮助中'){
			return 'top_right_help';
		}else if(state==='已完成'){
			return 'top_right_finish';
		}
	},
	refresh(e){//刷新订单
		wx.showToast({
			title: '正在刷新...',
			icon:'loading'
		});
		const tabNow = this.data.tabNow;
		switch (tabNow) {
			case 1:
				this.getMyOrder();
				break;
			case 2:
				this.getHelpOrder();
				break;
			case 3:
				this.getNeedOrder();
				break;
			default:
				this.onShow();
				break;
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({//把本地缓存的openID存入data中
			openID:wx.getStorageSync('openID')
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
		db.collection('order').get({//实现全部订单的查询
			success:(res)=>{
				const {data} = res;
				data.forEach(item => {
					if(item.address == undefined)//未输入目的地，则办理地址为目的地
						item.address = item.info.destination;
					item.info = this.formatInfo(item);
					item.stateColor = this.formatState(item.state);
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
		this.onShow();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		wx.showLoading({
			title: '加载中',
		})
		let {orderList,myOrder,helpOrder,needOrder,tabNow,openID} = this.data;
		switch (tabNow) {//switch分支对不同的页面实现分页
			case 1://我的订单分页
				db.collection('order').skip(myOrder.length).where({
					_openid:openID
				}).get({
					success:(res)=>{
						if(res.data.length){
							res.data.forEach(item=>{
								if(item.address == undefined)//未输入目的地，则办理地址为目的地
									item.address = item.info.destination;
								item.info = this.formatInfo(item);
								item.stateColor = this.formatState(item.state);
								myOrder.push(item);
							})
							this.setData({
								myOrder,
							})
						}else{
							wx.showToast({
								title: '无更多信息',
								icon:'none'
							})
						}
					},
					fail:(error) => {
						wx.showToast({
							title: '服务器出错...',
							icon:'error'
						})
					}
				})
				break;
			case 2://我帮助的分页
				db.collection('order').skip(helpOrder.length).where({
					receivePerson:this.data.openID
				}).get({
					success:(res)=>{
						if(res.data.length){
							res.data.forEach(item=>{
								if(item.address == undefined)//未输入目的地，则办理地址为目的地
									item.address = item.info.destination;
								item.info = this.formatInfo(item);
								item.stateColor = this.formatState(item.state);
								helpOrder.push(item);
							})
							this.setData({
								helpOrder,
							})
						}else{
							wx.showToast({
								title: '无更多信息',
								icon:'none'
							})
						}
					},
					fail:(error) => {
						wx.showToast({
							title: '服务器出错...',
							icon:'error'
						})
					}
				})
				break;
			case 3://正在求助分页
				db.collection('order').skip(needOrder.length).where({
					state:'待帮助'
				}).get({
					success:(res)=>{
						if(res.data.length){
							res.data.forEach(item=>{
								if(item.address == undefined)//未输入目的地，则办理地址为目的地
									item.address = item.info.destination;
								item.info = this.formatInfo(item);
								item.stateColor = this.formatState(item.state);
								needOrder.push(item);
							})
							this.setData({
								needOrder,
							})
						}else{
							wx.showToast({
								title: '无更多信息',
								icon:'none'
							})
						}
					},
					fail:(error) => {
						wx.showToast({
							title: '服务器出错...',
							icon:'error'
						})
					}
				})
				break;
			default:
				db.collection('order').skip(orderList.length).get({
					success:(res)=>{
						if(res.data.length){
							res.data.forEach(item=>{
								if(item.address == undefined)//未输入目的地，则办理地址为目的地
									item.address = item.info.destination;
								item.info = this.formatInfo(item);
								item.stateColor = this.formatState(item.state);
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
					},
					fail:(error) => {
						wx.showToast({
							title: '服务器出错...',
							icon:'error'
						})
					}
				})
				break;
		}
		wx.hideLoading();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})