var express = require('express');
var User = require('./models/user.js');
var Customer = require('./models/customer.js');
var LoginLog = require('./models/loginLog.js');
var OperationLog = require('./models/operationLog.js');
var md5 = require('blueimp-md5')
const mongoose = require('mongoose')
var multer = require('multer');
// var upload = multer({dest:'upload/'})
/*upload*/
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹需要手动创建！！！
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//添加配置文件到muler对象。
var upload = multer({
    storage: storage
});
/*end*/
mongoose.connect('mongodb://localhost/zs', {
    useNewUrlParser: true
});

const db = mongoose.connection
db.once("open", function() {
    console.log("数据库连接成功");
})
db.on("error", function(error) {
    console.log("数据库连接失败：" + error);
});

db.on('disconnected', function() {
    console.log('数据库连接断开');
})

var router = express.Router();

// 系统用户注册
router.post('/register', function(req, res) {
    var body = req.body;
    User.findOne({
        nickname: body.nickname
    }, function(err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'server err'
            })
        }
        if (data) {
            return res.status(200).json({
                success: true,
                message: '邮箱或者用户名已存在'
            })
        }
        body.password = md5(md5(body.password));
        new User(body).save(function(err, data) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'server err3'
                })
            }
            res.status(200).json({
                success: true,
                message: 'ok'
            })
        })

    })
    // res.send('hello');
})

// 用户登录
router.post('/login', function(req, res) {
    var body = req.body;
    User.findOne({
        nickname: body.nickname
    }, function(err, data) {
        if (err) {
            return res.status(200).json({
                success: false,
                statusCode: 0,
                message: '用户不存在'
            })
        }
        // console.log(data);
        if (data) {
            if (body.password === data.password) {
                let param = {
                    userName: data.nickname,
                    landTime: new Date().toLocaleString(),
                    landIp: getClientIP(req) + '',
                    permissions: data.status
                }
                insertLoginLog(param);
                return res.status(200).json({
                    success: true,
                    statusCode: 1,
                    userMessage: data,
                    message: '登录成功'
                })
            } else {
                return res.status(200).json({
                    success: false,
                    statusCode: 0,
                    message: '密码错误'
                })
            }
        } else {
            return res.status(200).json({
                success: false,
                statusCode: 0,
                message: 'sql err'
            })
        }


    })
})

// 用户注册
router.post('/userregister', function(req, res) {
    var body = req.body;
    Customer.findOne({
        customerName: body.customerName,
        customerMobil: body.customerMobil
    }, function(err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'server err'
            })
        }
        if (data) {
            return res.status(200).json({
                success: true,
                statusCode: 0,
                message: '当前用户已存在'
            })
        }
        new Customer(body).save(function(err, success) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'server err3'
                })
            }
            let param = {
                userName: body.operatingAccount,
                landTime: new Date().toLocaleString(),
                landIp: getClientIP(req) + '',
                operationText: body.operatingAccount + '添加了一个用户: ' + body.customerName,
                permissions: '2'
            }
            insertOperationLog(param);
            res.status(200).json({
                success: true,
                statusCode: 1,
                message: 'ok',
                data: success
            })
        })

    })
    // res.send('hello');
})

// 文件上传
router.post('/upload', upload.single('myfile'), function(req, res, next) {
    let obj = req.file;
    if (req.path) {
        obj.statusCode = 1;
        obj.message = '上传成功';
        res.status(200).json(obj)
    } else {
        res.status(200).json({
            success: false,
            statusCode: 0,
            message: 'err'
        })
    }

});

// 获取登录日志
router.get('/loginLog', function(req, res) {
    const {
        pageNum = 1, pageSize = 10
    } = req.query;
    LoginLog.countDocuments({}, (err, count) => {
        LoginLog.find({})
            .skip((parseInt(pageNum, 10) - 1) * parseInt(pageSize, 10))
            .limit(parseInt(pageSize, 10))
            .sort({
                '_id': -1
            })
            .exec((err, doc) => {
                try {
                    if (!err && doc) {
                        return res.json({
                            code: 0,
                            statusCode: 1,
                            totalCount: count,
                            msg: '列表获取成功',
                            data: doc
                        })
                    }
                    res.json({
                        code: 1,
                        msg: '后端出错1',
                        err: err,
                        statusCode: 0
                    })
                } catch (e) {
                    res.json({
                        code: 1,
                        msg: '后端出错',
                        statusCode: 0
                    })
                }
            })
    })
})

// 获取用户信息
router.get('/getuserlist', function(req, res) {
    var findval = new RegExp(req.query.keyword); //查询的时候判断条件加 new RegExp( )即可变成关键字搜索
    const {
        pageNum = 1, pageSize = 10
    } = req.query;
    Customer.countDocuments({}, (err, count) => {
        Customer.find({
                $or: [{
                    customerName: findval
                }, {
                    hydraulicName: findval
                }, {
                    customerAdress: findval
                }, {
                    customerMobil: findval
                }, {
                    hydraulicMobil: findval
                }, {
                    dealers: findval
                }]
            })
            .skip((parseInt(pageNum, 10) - 1) * parseInt(pageSize, 10))
            .limit(parseInt(pageSize, 10))
            .sort({
                '_id': -1
            })
            .exec((err, doc) => {
                try {
                    if (!err && doc) {
                        return res.json({
                            code: 0,
                            statusCode: 1,
                            totalCount: count,
                            msg: '列表获取成功',
                            data: doc
                        })
                    }
                    res.json({
                        code: 1,
                        msg: '后端出错1',
                        err: err,
                        statusCode: 0
                    })
                } catch (e) {
                    res.json({
                        code: 1,
                        msg: '后端出错',
                        statusCode: 0
                    })
                }
            })
    })
})

// 删除用户
router.get('/deleteuser', function(req, res) {
    Customer.findOne({
        _id: req.query._id
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: '要删除的用户查找失败'
            })
        }
        if (data) {
            Customer.remove({
                _id: req.query._id
            }, function(err) {
                if (err) return res.json({
                    code: 0,
                    statusCode: 0,
                    msg: '找不到该用户或该用户已删除'
                })
                let param = {
                    userName: req.query.account,
                    landTime: new Date().toLocaleString(),
                    landIp: getClientIP(req) + '',
                    operationText: req.query.account + '删除了一个用户: ' + data.customerName,
                    permissions: '2'
                }
                insertOperationLog(param);
                return res.json({
                    code: 0,
                    statusCode: 1,
                    msg: '删除成功'
                })

            })
        }

    })

})

// 用户更新数据
router.post('/updateuser', function(req, res) {
    var body = req.body;
    Customer.findOne({
        _id: body._id
    }, function(err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: '要更新的用户查找失败'
            })
        }
        if (data) {
            let param = {
                userName: data.operatingAccount,
                landTime: new Date().toLocaleString(),
                landIp: getClientIP(req) + '',
                operationText: data.operatingAccount + '更新了一个用户: ' + data.customerName,
                permissions: '2'
            }
            insertOperationLog(param);
            Object.assign(data, body);
            data.save(function(err, updateData) {
                return res.json({
                    code: 0,
                    statusCode: 1,
                    msg: '更新成功',
                    data: updateData
                })
            })
        }

    })
})

// 获取操作日志
router.get('/operationlog', function(req, res) {
    const {
        pageNum = 1, pageSize = 10
    } = req.query;
    OperationLog.countDocuments({}, (err, count) => {
        OperationLog.find({})
            .skip((parseInt(pageNum, 10) - 1) * parseInt(pageSize, 10))
            .limit(parseInt(pageSize, 10))
            .sort({
                '_id': -1
            })
            .exec((err, doc) => {
                try {
                    if (!err && doc) {
                        return res.json({
                            code: 0,
                            statusCode: 1,
                            totalCount: count,
                            msg: '列表获取成功',
                            data: doc
                        })
                    }
                    res.json({
                        code: 1,
                        msg: '后端出错1',
                        err: err,
                        statusCode: 0
                    })
                } catch (e) {
                    res.json({
                        code: 1,
                        msg: '后端出错',
                        statusCode: 0
                    })
                }
            })
    })
})

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};

// 插入登录日志记录
function insertLoginLog(obj) {

    var log = new LoginLog(obj);

    log.save(function(err, res) {

        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }

    });
}
// 插入操作日志记录
function insertOperationLog(obj) {

    var log = new OperationLog(obj);

    log.save(function(err, res) {

        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }

    });
}

module.exports = router;