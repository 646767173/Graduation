const db = wx.cloud.database();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabList:['正在求助','我发布的','我帮助的','全部订单'],
		tabNow:0,//当前选中的数组下标，默认是正在求助
		openID:'',//账号标识
		orderList:[],
		myOrder:[],
		helpOrder:[],
		needOrder:[],
		isReceiver:false,//是不是接单员
		finishNum:0,//已完成总数
		finishMoney:0,//已完成总收益
		regionIndex:0,
		regionArray:['全部','教学楼','英东楼','图书馆','科学楼','北区宿舍','北区饭堂','北门宣传栏','饭堂小卖部','南区宿舍','南区饭堂'],
	},
	bindRegion(e){
		this.setData({
			regionIndex:e.detail.value,
		})
		const arr = this.data.regionArray;
		const index = this.data.regionIndex;
		// 开始查询
		this.getNeedOrder(arr[index]);
		wx.showToast({
			title: '选择成功！',
		})
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
			this.getFinishNum();
			this.getFinishMoney();
		}else if(id === 3){
			this.getAll();
		}
	},
	getNeedOrder(e){//获取求助中的订单
		wx.showLoading({
			title: '加载中',
		});
		if (e==='全部'|| !e) {
			db.collection('order').orderBy('createTime','desc').where({
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
				}
			})
		}else{
			db.collection('order').orderBy('createTime','desc').where({
				state:'待帮助',
				'info.destination': db.RegExp({
					regexp: e,
					options: 'i'
				})
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
				}
			})
		}
		wx.hideLoading();
	},
	getMyOrder(e){//获取我发布的订单
		wx.showLoading({
			title: '加载中',
		});
		db.collection('order').orderBy('createTime','desc').where({
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
		db.collection('order').orderBy('createTime','desc').where({
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
	getAll(e){//获取全部的订单
		db.collection('order').orderBy('createTime','desc').get({//实现全部订单的查询
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
					title: '查询失败，服务器每日请求次数用完',
				})
			}
		})
	},
	orderReceive(e){//接单
		if (!this.data.isReceiver) {//进入则说明不是接单员，直接return
			wx.showModal({
				content: '您不是接单员，请先申请成为接单员',
				title:'提示',
				showCancel:false
			})
			return;
		}
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
		wx.cloud.callFunction({
			name:'receiveOrder',
			data:{
				_id,
				openID:this.data.openID
			},
			success:(res)=>{
				if(tabNow===0)
					this.onShow();
				else
					this.getNeedOrder();
				wx.hideLoading();
				wx.showToast({
					title: '已接单',
				})
			},
			fail:(res)=>{
				wx.showToast({
					title: '接单失败',
					icon:"error"
				})
			}
		})
	},
	toCancel(e){//取消发布
		const that = this;
		wx.showModal({
			title: '提示',
			content: '撤回发布的订单将被删除，您确认撤回吗',
			success (res) {
				if (res.confirm) {
					const { id } = e.currentTarget.dataset;
					wx.cloud.callFunction({
						name:'deleteOrder',
						data:{ id },
						success:()=>{
							that.getMyOrder();
							wx.showToast({
								title: '已撤回发布',
							});
						}
					})
				} else if (res.cancel) {
					wx.showToast({
						icon:'none',
						title: '已取消操作',
					});
				}
			}
		})
	},
	toFinish(e){//帮助完成
		wx.showLoading({
			title: '加载中',
		});
		const {id} = e.currentTarget.dataset;
		wx.cloud.callFunction({
			name:'finishOrder',
			data:{ id },
			success:(res)=>{
				this.getMyOrder();
				wx.hideLoading();
				wx.showToast({
					title: '已完成',
				})
			},
			fail:(res)=>{
				wx.hideLoading();
				wx.showToast({
					title: '操作失败',
					icon:'error'
				})
			}
		})
	},
	toDetail(e){//跳转详情页
		const {id} = e.currentTarget.dataset;
		wx.navigateTo({
			url: `../detail/detail?id=${id}`,
		})
	},
	formatInfo(orderInfo){//把不同模块的订单进行不同的格式处理后，展示在页面上
		const{name,info} = orderInfo;
		if (!info.remark) {
			info.remark = '无';
		}
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
	refresh(){//刷新订单
		const tabNow = this.data.tabNow;
		if(tabNow===1){
			this.getMyOrder();
		}else if(tabNow===2){
			this.getHelpOrder();
		}else if(tabNow===3){
			this.getAll()
		}else if(tabNow===0){
			this.onShow();
		}
		wx.showToast({
			title: '刷新成功',
		});
	},
	isReceiver(){//是不是接单员
		db.collection('applyOrder').where({
			_openid: wx.getStorageSync('openID'),
			state:'通过'
		}).get({
			success:(res)=>{
				this.setData({
					isReceiver:!!res.data.length
				})
			}
		})
		
	},
	getFinishNum(){//已完成总数
		db.collection('order').where({
			receivePerson:wx.getStorageSync('openID'),
			state:'已完成'
		}).count({
			success:(res)=>{
				this.setData({
					finishNum: res.total
				})
			}
		})
	},
	getFinishMoney(){//已完成总收益
		const $ = db.command.aggregate;
		db.collection('order').aggregate().match({
			receivePerson:wx.getStorageSync('openID'),
			state:'已完成'
		}).group({
			_id:null,
			totalNum: $.sum('$money')
		}).end({
			success:(res)=>{
				this.setData({
					finishMoney:res.list[0].totalNum
				})
			}
		})
	},
	callPhone(e){//打电话
		const {phone} = e.currentTarget.dataset;
		wx.makePhoneCall({
			phoneNumber: phone,
		});
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
		this.setData({//把本地缓存的openID存入data中
			openID:wx.getStorageSync('openID'),
			regionIndex:0
		})
		this.isReceiver();
		this.getNeedOrder();
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
			case 0://正在求助分页
			db.collection('order').orderBy('createTime','desc').skip(needOrder.length).where({
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
			case 1://我的订单分页
				db.collection('order').orderBy('createTime','desc').skip(myOrder.length).where({
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
				db.collection('order').orderBy('createTime','desc').skip(helpOrder.length).where({
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
			case 3://全部订单
				db.collection('order').orderBy('createTime','desc').skip(orderList.length).get({
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