<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>
<script>
import md5 from 'blueimp-md5'
import { Message } from 'element-ui';
export default {
    data: function() {
        return {
            ruleForm: {
                username: JSON.parse(localStorage.getItem('loginUser')) ? JSON.parse(localStorage.getItem('loginUser')).user : '',
                password: JSON.parse(localStorage.getItem('loginUser')) ? JSON.parse(localStorage.getItem('loginUser')).password : ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let password = md5(md5(this.ruleForm.password));
                    console.log(this.$commonapi);
                    this.$axios.post(this.$commonapi.login, {
                            nickname: this.ruleForm.username,
                            password: password
                        })
                        .then(function(response) {
                            if (response.data.statusCode === 1) {

                                Message.success(response.data.message)
                                localStorage.setItem('userMessage', JSON.stringify(response.data.userMessage));
                                localStorage.setItem('loginUser', JSON.stringify({ user: _this.ruleForm.username, password: _this.ruleForm.password }));
                                localStorage.removeItem('needEditUser');
                                _this.$router.push('/dashboard');
                            } else {
                                Message.error(response.data.message)
                            }

                        })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>