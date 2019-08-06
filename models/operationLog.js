const mongoose = require('mongoose')
// 表模型
const operationLog = new mongoose.Schema({
	'userName': String,
	'landTime': String,
	'landIp': String,
	'operationText': String,
	'permissions': {
		type: Number,
		// 权限 1最高管理员 2正常用户
		enum: [1, 2],
		default: 2
	}
})
module.exports = mongoose.model('OperationLog', operationLog)