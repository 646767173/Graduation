// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const db = cloud.database();
	try{
		const {id} = event;
		return await db.collection('order').doc(id).remove();
	}catch(e){
		console.log('异步操作数据库失败：'+e);
	}
}