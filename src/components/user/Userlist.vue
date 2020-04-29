<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <!-- prop="mg_state"  不生效了 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="clickSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="userEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="userDel(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                @click="userSet(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
                :enterable="false"
              ></el-button>
            </el-tooltip>
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
      <!-- 创建用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="addDislogClose">
        <el-form
          :model="addUserForm"
          :rules="rules"
          ref="addUserForm"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUserDefine">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%" @close="editDislogClose">
        <el-form :model="editUserForm" :rules="editRules" ref="editUserForm" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUserDialogDefine">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
    created() {
        this.getUserList();
    },
    data() {
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (regEmail.test(value)) {
                return callback();
            }
            callback(new Error('输入合法的邮箱'));
        };
        var checkMobile = (rule, value, callback) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (regMobile.test(value)) {
                return callback();
            }
            callback(new Error('输入合法的邮箱'));
        };
        return {
            // dislog 编辑
            editUserDialog: false,
            // editUserForm-data
            editUserForm: {
                id: '',
                username: '',
                password: '',
                mobile: '',
                email: ''
            },
            // dislog显示隐藏
            addUserDialog: false,
            // addUserForm-Data
            addUserForm: {
                username: '',
                password: '',
                mobile: '',
                email: ''
            },
            //  addUserForm rule
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 8 到 16 个字符',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    { required: true, validator: checkMobile, trigger: 'blur' }
                ],

                email: [
                    { required: true, validator: checkEmail, trigger: 'blur' }
                ]
            },
            // editUserForm rule
            editRules: {
                mobile: [
                    { required: true, validator: checkMobile, trigger: 'blur' }
                ],

                email: [
                    { required: true, validator: checkEmail, trigger: 'blur' }
                ]
            },
            // 用户列表
            userList: [
                {
                    id: 1,
                    username: 'king',
                    mobile: '17878756322',
                    type: 1,
                    email: '1192620781@qq.com',
                    create_time: '2020',
                    mg_state: false,
                    role_name: 'aking'
                },
                {
                    id: 2,
                    username: 'Ajking',
                    mobile: '1192620781',
                    type: 1,
                    email: '8888@163',
                    create_time: '2019',
                    mg_state: true,
                    role_name: 'aking'
                }
            ],
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
        // 添加用户
        addUser() {
            this.addUserDialog = true;
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

            // async await  的方式
            // const result = await this.$confirm(
            //     '此操作将永久删除该用户, 是否继续?',
            //     '提示',
            //     {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }
            // ).catch(err => err);
            // console.log(result);
        }
    }
};
</script>
<style lang="less" scoped></style>
