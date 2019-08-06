<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> {{isEdit ? '修改信息' : '添加信息'}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{isEdit ? '修改用户' : '添加用户'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 100%;">
                <el-form ref="form" :rules="rules" label-position="right" :model="form" label-width="80px">
                    <div class="one_row">
                        <el-form-item label="用户姓名" prop="userName">
                            <el-input v-model="form.userName" clearable></el-input>
                        </el-form-item>
                        <el-form-item class="row_right" label="用户电话" prop="userPhoen">
                            <el-input v-model="form.userPhoen" clearable></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="用户地址" prop="userAddress">
                            <el-input v-model="form.userAddress" clearable></el-input>
                        </el-form-item>
                        <el-form-item class="row_right" label="水工姓名" prop="hydraulicName">
                            <el-input v-model="form.hydraulicName" clearable></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="水工电话" prop="hydraulicPhoen">
                            <el-input v-model="form.hydraulicPhoen" clearable></el-input>
                        </el-form-item>
                        <el-form-item class="row_right" label="质保卡号" prop="qualityAssuranceNum">
                            <el-input v-model="form.qualityAssuranceNum" clearable></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="水工积分" prop="hydraulicIntegral">
                            <el-input v-model="form.hydraulicIntegral" clearable></el-input>
                        </el-form-item>
                        <el-form-item class="row_right" label="经销商">
                            <el-input v-model="form.dealers" clearable></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="上传时间">
                            <el-input v-model="form.uploadTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item class="row_right" label="操作账号">
                            <el-input v-model="form.operatingAccount" disabled></el-input>
                        </el-form-item>
                    </div>
                    <el-row :gutter="20" class='el_row_box'>
                        <el-col :span="8" v-for="(item, index) in needEditUser.uploadPhotos" :key="index">
                            <div class="grid-content bg-purple">
                                <img :src="imgHttp + '' +  item.path" alt="">
                                <i class="el-icon-delete" @click="deleteImg(index)"></i>
                                <span class="count">{{item.count}}</span>
                            </div>
                        </el-col>
                        <i class="el-icon-arrow-left" @click="rollLeft"></i>
                        <i class="el-icon-arrow-right" @click="rollRight"></i>
                    </el-row>
                    <el-form-item label="上传图片">
                        <el-upload target="tg" name="myfile" id="myfile" class="upload-demo" drag :action="uploadUrl" list-type="picture" multiple :file-list="fileList" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">{{isEdit ? '立即修改' : '立即添加'}}</el-button>
                        <el-button @click="resetForm('form')" v-if='!isEdit'>重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'addmessage',
    data: function() {
        return {
            form: {
                userName: '', // 用户姓名
                userPhoen: '', // 用户电话
                userAddress: '', // 用户地址
                hydraulicName: '', // 水工姓名
                hydraulicPhoen: '', // 水工电话
                qualityAssuranceNum: '', // 质保卡号
                hydraulicIntegral: '', // 水工积分
                dealers: '', // 经销商
                uploadTime: new Date().toLocaleString(), // 上传时间
                operatingAccount: JSON.parse(localStorage.getItem('userMessage')).nickname // 操作账号
            },
            rules: {
                userName: [
                    { required: true, message: '请输入用户姓名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                userPhoen: [
                    { required: true, message: '请输入用户电话', trigger: 'blur' },
                    { min: 11, max: 11, message: '长度需11个字符', trigger: 'blur' }
                ],
                hydraulicName: [
                    { required: true, message: '请输入水工姓名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                hydraulicPhoen: [
                    { required: true, message: '请输入水工电话', trigger: 'blur' },
                    { min: 11, max: 11, message: '长度需11个字符', trigger: 'blur' }
                ],
                userAddress: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
                qualityAssuranceNum: [
                    { required: true, message: '请输入质保卡号', trigger: 'blur' }
                ],
                hydraulicIntegral: [
                    { required: true, message: '请输入水工积分', trigger: 'blur' }
                ]
            },
            uploadUrl: this.$commonapi.upload,
            fileList: [],
            needEditUser: {},
            isEdit: false,
            imgHttp: this.$commonapi.hostUrl
        }
    },
    mounted() {

    },
    activated() {
        this.isEdit = false;
        let needEditUser = localStorage.getItem('needEditUser');
        if (needEditUser && !this.isEdit) {
            this.needEditUser = JSON.parse(needEditUser);
            this.isEdit = true;
            console.log(this.needEditUser);
            this.init(this.needEditUser);
        }

    },
    methods: {
        submitForm(formName) {
            let _this = this;

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let param = {
                        customerName: this.form.userName,
                        customerMobil: this.form.userPhoen,
                        customerAdress: this.form.userAddress,
                        hydraulicName: this.form.hydraulicName,
                        hydraulicMobil: this.form.hydraulicPhoen,
                        qualityAssuranceNum: this.form.qualityAssuranceNum,
                        hydraulicIntegral: this.form.hydraulicIntegral,
                        dealers: this.form.dealers,
                        operatingAccount: this.form.operatingAccount,
                        uploadPhotos: this.fileListReduce()
                    };
                    
                    let url = this.$commonapi.userregister;
                    if (this.isEdit) {
                        url = this.$commonapi.updateuser;
                        param._id = this.needEditUser._id;
                    }
                    this.$axios.post(url, param)
                        .then(function(response) {
                            if (response.data.statusCode === 1) {
                                _this.$router.push('/');
                                _this.$refs[formName].resetFields();
                                _this.fileList = [];
                                _this.$message.success("添加成功")
                                if (_this.isEdit) {
                                    localStorage.removeItem('needEditUser');
                                    _this.needEditUser = {};
                                }
                                
                            } else {
                                _this.$message.error(response.data.message)
                            }

                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        uploadError(err, file, fileList) {
            console.log(err);
            this.$message.error(file.name + '上传失败');
        },
        uploadSuccess(res, file, fileList) {
            if (res.statusCode === 1) {
                this.fileList = fileList;
                console.log(fileList);
            }
        },
        beforeUpload(file) {
            console.log(file);
            let ret = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'gif'];
            let suffix = file.name.split('.');
            suffix = suffix[suffix.length - 1];
            if (ret.includes(suffix)) {
                console.log('ok');
            } else {
                this.$message({
                    message: '请不要上传除图片外其他文件',
                    type: 'warning'
                });
                return false;
            }
            for (let i = 0; i < this.fileList.length; i++) {
                if (this.fileList[i]['name'] === file['name']) {
                    this.$message({
                        message: '请不要重复上传',
                        type: 'warning'
                    });
                    return false;
                }
            }
        },
        fileListReduce() {
            let data = this.fileList;
            let returnDta = [];
            for (let i = 0; i < data.length; i++) {
                returnDta.push(data[i]['response']);
            }
            if (this.isEdit) {
                returnDta = returnDta.concat(this.needEditUser.uploadPhotos);
            }
            return returnDta;
        },
        init(row) {
            this.form = {
                userName: row.customerName, // 用户姓名
                userPhoen: row.customerMobil, // 用户电话
                userAddress: row.customerAdress, // 用户地址
                hydraulicName: row.hydraulicName, // 水工姓名
                hydraulicPhoen: row.hydraulicMobil, // 水工电话
                qualityAssuranceNum: row.qualityAssuranceNum, // 质保卡号
                hydraulicIntegral: row.hydraulicIntegral, // 水工积分
                dealers: row.dealers, // 经销商
                uploadTime: row.createTime, // 上传时间
                operatingAccount: row.operatingAccount
            };
            let data = this.needEditUser.uploadPhotos;
            for (let i = 0; i < data.length; i++) {
                data[i].count = i + 1;
            }
            this.needEditUser.uploadPhotos = data;
        },
        deleteImg(index) {
            let count = this.needEditUser.uploadPhotos[index]['count'];
            let data = this.needEditUser.uploadPhotos;
            data.splice(index, 1);

            for (let i = 0; i < data.length; i++) {
                if (data[i]['count'] > count) {
                    data[i]['count']--;
                }
            }
            this.needEditUser.uploadPhotos = data;
        },
        rollRight() {
            console.log('滚动右边');
            if (this.needEditUser.uploadPhotos.length > 3) {
                let alone = this.needEditUser.uploadPhotos[this.needEditUser.uploadPhotos.length - 1];
                this.needEditUser.uploadPhotos.pop();
                this.needEditUser.uploadPhotos.unshift(alone);
            }
        },
        rollLeft() {
            console.log('滚动左边');
            if (this.needEditUser.uploadPhotos.length > 3) {
                let alone = this.needEditUser.uploadPhotos[0];
                this.needEditUser.uploadPhotos.shift();
                this.needEditUser.uploadPhotos.push(alone);
            }
        }
    },
    beforeDestroy() {
        localStorage.removeItem('needEditUser');
    },
    destroyed() {
        localStorage.removeItem('needEditUser');
    }
}
</script>
<style>
.one_row {
    display: flex;
    /*justify-content: space-between;*/
}

.one_row .row_right {
    margin-left: 50px;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    position: relative;
    border-radius: 4px;
    min-height: 36px;
    height: 200px;
}

.grid-content .count {
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -7px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    font-size: 10px;
    color: #000;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
}

.grid-content .el-icon-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    display: none;
}

.grid-content:hover .el-icon-delete {
    display: block;
}

.grid-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.el_row_box {
    position: relative;
    overflow: hidden;
    max-height: 200px;
}

.el_row_box .el-icon-arrow-left {
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -18px;
    margin-left: 18px;
    font-size: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 36px;
    background-color: rgba(31, 45, 61, .11);
    color: #fff;
    cursor: pointer;
    display: none;
}

.el_row_box .el-icon-arrow-right {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -18px;
    margin-right: 18px;
    font-size: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 36px;
    background-color: rgba(31, 45, 61, .11);
    color: #fff;
    cursor: pointer;
    display: none;
}

.el_row_box .el-icon-arrow-right:hover {
    background-color: rgba(31, 45, 61, .31);
}

.el_row_box .el-icon-arrow-left:hover {
    background-color: rgba(31, 45, 61, .31);
}

.el_row_box:hover .el-icon-arrow-left {
    display: block;
}

.el_row_box:hover .el-icon-arrow-right {
    display: block;
}
</style>