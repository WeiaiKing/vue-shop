<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.queryInfo"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="商品名称"></el-table-column>
        <el-table-column prop="email" label="商品价格(元)" width="180px"></el-table-column>
        <el-table-column prop="type" label="商品重量" width="180px"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="250px"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button @click="userEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="userDel(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="2"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
    created() {
        this.getUserList();
    },
    data() {
        return {
            // 分配权限
            editRightDialog: false,
            // 分配权限表单
            userInfo: {},
            // 用户列表
            userList: [
                {
                    id: 1,
                    username: '沿途车载充电了登录会计法了建立收费',
                    email: '0',
                    type: 100,
                    create_time: '2020-02-17 12:00:00'
                },
                {
                    id: 2,
                    username: '沿途车载充电了登录会计法了建立收费',
                    email: '149',
                    type: 100,
                    create_time: '2020-02-17 12:00:00'
                }
            ],
            // select 的值
            selectRoleId: '',
            // 获取用户列表的参数对象，写到这个方便以后调用修改
            queryInfo: {
                // 查询字段
                query: '',
                // 当前页数页数
                pagenum: 1,
                // 每页显示几个
                pagesize: 2
            }
        };
    },
    methods: {
        // 获取初始table数据
        async getUserList() {
            const { data: res } = await this.axios('userList', {
                params: this.queryInfo
            });
            console.log(res);
        },
        // 页码大小处理
        handleSizeChange(val) {
            this.queryInfo.pagesize = val;
            // 每页多少条，那么要从新发送请求。下同
            console.log(`每页 ${val} 条`);
        },
        // 监听页码值改变的事件
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        // 开关回调
        clickSwitch(e) {
            // 请求路径， users/:uld/state/:type
            this.axios.put(`users/${e.id}/state/${e.mg_state}`);
            this.$message.success('更改用户状态成功');
            console.log(e);
        },
        // 添加商品
        addGoods() {
            this.$router.push('/commodityList/addGoods');
        },
        // dislog 关闭前的事件
        addDislogClose() {
            console.log('cjjjj');
            this.$refs.addUserForm.resetFields();
        },
        // dislog user define
        addUserDefine() {
            this.$refs.addUserForm.validate(valid => {
                if (valid) {
                    this.$message.success('添加用户成功');
                    this.addUserDialog = false;
                    // 重新获取用户信息
                    this.getUserList();
                } else {
                    return false;
                }
            });
        },
        //  user edit
        userEdit(e) {
            this.editUserDialog = true;
            //  获取到该行的信息
            console.log(e);
            this.editUserForm.username = e.username;
            this.editUserForm.mobile = e.mobile;
            this.editUserForm.email = e.email;
            this.editUserForm.id = e.id;
            // 以后也要记得判断状态码，也不是每次都能成功的
        },
        // edit dislog 关闭前的事件
        editDislogClose() {
            this.$refs.editUserForm.resetFields();
        },
        // user edit define
        editUserDialogDefine() {
            this.$refs.editUserForm.validate(valid => {
                if (valid) {
                    this.$message.success('修改用户成功');
                    this.editUserDialog = false;
                    // 重新获取用户信息
                    this.userList[
                        this.editUserForm.id - 1
                    ].mobile = this.editUserForm.mobile;
                    this.userList[
                        this.editUserForm.id - 1
                    ].email = this.editUserForm.email;
                    this.getUserList();
                } else {
                    return false;
                }
            });
        },
        // userDel
        userDel(e) {
            console.log(e);
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 分配权限
        userSet(e) {
            this.userInfo = e;
            this.editRightDialog = true;
        },
        editRightDialogDefine() {
            this.$message.success('更新角色成功');
            this.editRightDialog = false;
        },
        // 关闭事件
        rightDislogClose() {
            this.userInfo = '';
            this.selectRoleId = '';
        }
    }
};
</script>
<style lang="less" scoped>
</style>
