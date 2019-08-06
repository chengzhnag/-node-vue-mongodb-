var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = require('./router.js');

var app = express();
// 自定义跨域中间件
var allowCors = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
};
app.use(allowCors); //使用跨域中间件


app.use('/public/', express.static(path.join(__dirname, './public/')))
app.engine('html', require('express-art-template')) // 配置express-art-template模板
// app.engine('html', require('express-art-template'))

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(bodyParser.json())

app.use(router);

const port = 8081;
app.listen(port, '0.0.0.0', function() {
	console.log('running ' + port + ' ...')
})