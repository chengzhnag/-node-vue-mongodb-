<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>数据查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="输入水工的用户号码" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="count" label="序号" width="50">
                </el-table-column>
                <el-table-column align='center' prop="createTime" label="日期" sortable width="180">
                </el-table-column>
                <el-table-column align='center' prop="qualityAssuranceNum" label="质保号" width="140">
                </el-table-column>
                <el-table-column align='center' prop="dealers" label="经销商" width="70">
                </el-table-column>
                <el-table-column align='center' prop="customerName" label="用户姓名" width="100">
                </el-table-column>
                <el-table-column align='center' prop="customerAdress" label="用户地址">
                </el-table-column>
                <el-table-column align='center' prop="hydraulicName" label="水工姓名" width="80">
                </el-table-column>
                <el-table-column align='center' prop="hydraulicMobil" label="水工电话" width="120">
                </el-table-column>
                <el-table-column align='center' prop="hydraulicIntegral" label="积分" width="50">
                </el-table-column>
                <el-table-column align='center' prop="operatingAccount" label="操作员" width="90">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看用户信息" :visible.sync="dialogFormVisible" center custom-class='dialog_box' width="70%">
            <div class="form-box data_query_box" style="width: 700px;">
                <el-form ref="form" label-position="right" :model="form" label-width="80px">
                    <div class="one_row">
                        <el-form-item label="用户姓名" prop="userName">
                            <el-input v-model="form.userName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="用户电话" prop="userPhoen">
                            <el-input v-model="form.userPhoen" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="用户地址" prop="userAddress">
                            <el-input v-model="form.userAddress" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="水工姓名" prop="hydraulicName">
                            <el-input v-model="form.hydraulicName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="水工电话" prop="hydraulicPhoen">
                            <el-input v-model="form.hydraulicPhoen" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="质保卡号" prop="qualityAssuranceNum">
                            <el-input v-model="form.qualityAssuranceNum" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="水工积分" prop="hydraulicIntegral">
                            <el-input v-model="form.hydraulicIntegral" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="经销商">
                            <el-input v-model="form.dealers" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="one_row">
                        <el-form-item label="上传时间">
                            <el-input v-model="form.uploadTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="操作账号">
                            <el-input v-model="form.operatingAccount" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <el-carousel :interval="4000" type="card" height="200px" v-if='tableData.length'>
                    <el-carousel-item v-for="(item, index) in tableData[idx]['uploadPhotos']" :key="index">
                        <img class="carousel_img" :src="hostUrl + item.path" @click='openImg(item.path)' />
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'imagechange',
    data() {
        return {
            tableData: [],
            cur_page: 1,
            multipleSelection: [],
            select_word: '',
            del_list: [],
            editVisible: false,
            delVisible: false,
            idx: 0,
            totalCount: 0,
            form: {
                userName: '', // 用户姓名
                userPhoen: '', // 用户电话
                userAddress: '', // 用户地址
                hydraulicName: '', // 水工姓名
                hydraulicPhoen: '', // 水工电话
                qualityAssuranceNum: '', // 质保卡号
                hydraulicIntegral: '', // 水工积分
                dealers: '', // 经销商
                uploadTime: '', // 上传时间
                operatingAccount: ''
            },
            dialogFormVisible: false,
            hostUrl: this.$commonapi.hostUrl
        }
    },
    created() {
        this.getData();
    },
    activated() {
        this.getData();
    },
    computed: {

    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            this.$axios.get(this.$commonapi.getuserlist, {
                params: {
                    pageNum: this.cur_page,
                    pageSize: 10,
                    keyword: this.select_word
                }
            }).then((res) => {
                console.log(res);
                if (res.data.statusCode === 1) {
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].count = (this.cur_page - 1) * 10 + i + 1;
                        res.data.data[i].createTime = this.filterTime(res.data.data[i].createTime);
                    }
                    this.tableData = res.data.data;
                    this.totalCount = res.data.totalCount;
                    console.log(this.totalCount);
                } else {
                    this.$message.error('获取数据失败');
                }

            })
        },
        search() {
            if (this.select_word.replace(/\s/g, '') != '') {
                this.getData();
            }
        },
        handleEdit(index, row) {
            this.idx = index;
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
            this.dialogFormVisible = true;
            console.log(this.hostUrl);
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 确定删除
        deleteRow() {
            this.$axios.get(this.$commonapi.deleteuser, {
                params: {
                    _id: this.tableData[this.idx]['_id']
                }
            }).then((res) => {
                console.log(res);
                if (res.data.statusCode === 1) {
                    this.$message.success('删除成功');
                    this.delVisible = false;
                    this.tableData.splice(this.idx, 1);
                } else {
                    this.$message.error(res.data.msg);
                    this.delVisible = false;
                }

            })


        },
        filterTime(time) {
            return new Date(time).toLocaleString();
        },
        openImg(path) {
            let url = this.hostUrl + path;
            window.open(url);
        }
    }
}
</script>
<style>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.data_query_box .one_row {
    display: flex;
    justify-content: space-between;
}

.dialog_box .el-dialog__body {
    display: flex;
    justify-content: center;
}

.carousel_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>