var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {
		type: String,
		required: true 
	},
	nickname: {
		type: String,
		required: true 
	},
	password: {
		type: String,
		required: true 
	},
	created_time: {
		type: Date,
		default: Date.now
	},
	last_modified_time: {
		type: Date,
		default: Date.now
	},
	avatar: {
		type: String,
		default: '/public/img/default_avatar.png'
	},
	gender: {
		type: Number,
		enum: [-1, 0, 1],
		default: -1
	},
	birthday: {
		type: Date
	},
	photo_number: {
		type: String
	},
	status: {
		type: Number,
		// 权限 1最高管理员 2正常用户
		enum: [1, 2],
		default: 2
	}
})

module.exports = mongoose.model('User', userSchema);