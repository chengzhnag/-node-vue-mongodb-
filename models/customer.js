const mongoose = require('mongoose')
// 表模型
const customerSchema = new mongoose.Schema({
	'customerName': String,
	'customerMobil': String,
	'customerAdress': String,
	'hydraulicName': String,
	'hydraulicMobil': String,
	'qualityAssuranceNum': String,
	'hydraulicIntegral': String,
	'dealers': String,
	'createTime': {
		type: Date,
		default: Date.now
	},
	'operatingAccount': String,
	'uploadPhotos': Array
})
module.exports = mongoose.model('Customer', customerSchema)