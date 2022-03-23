// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
	const db = cloud.database();
	try{
		var {_id,name,openID} = event;
		console.log(_id,name,openID);
		return await db.collection('applyOrder').doc(_id).update({
			data:{
				state:name,
				examinePerson:openID
			},
		})
	}catch(e){
		console.log('异步操作数据库失败：'+e);
	}
}