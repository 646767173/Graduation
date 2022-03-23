// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const db = cloud.database()
	try{
		var {_id} = event;
		return await db.collection('order').doc(_id).update({
			data:{
				state:'已完成'
			},
		})
	}catch(e){
		console.log('异步操作数据库失败：'+e);
	}
	
}