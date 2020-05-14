<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="orderID" label="订单编号"></el-table-column>
        <el-table-column prop="orderPrice" label="订单价格" width="70px"></el-table-column>
        <el-table-column prop="pay" label="是否付款" width="120px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay ==='0'" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.pay ==='1'" type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliver" label="是否发货" width="70px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="250px"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="userEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              @click="userWuliu(scope.row)"
              type="success"
              icon="el-icon-location"
              size="mini"
            ></el-button>
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
      <el-dialog title="提示" :visible.sync="editDialog" width="50%" :before-close="handleClose">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="省市区/县" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editDialogDefine">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="wuliuDialog" width="50%" :before-close="handleClose">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.timestamp"
          >{{activity.content}}</el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="wuliuDialog = false">取 消</el-button>
          <el-button type="primary" @click="wuliuDialog = false">确 定</el-button>
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
        return {
            wuliuDialog: false,
            ruleForm: {
                name: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }
                ]
            },

            editDialog: false,
            // 分配权限
            editRightDialog: false,
            // 分配权限表单
            userInfo: {},
            // 用户列表
            userList: [
                {
                    id: 1,
                    orderID: 'lwekjrlkdkf23ir',
                    orderPrice: '40',
                    pay: '1',
                    deliver: '否',
                    create_time: '2020-02-17 12:00:00'
                },
                {
                    id: 2,
                    orderID: 'i9idu9eifiwof',
                    orderPrice: '20',
                    pay: '0',
                    deliver: '否',
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
            },
            activities: [
                {
                    content: '支持使用图标',
                    timestamp: '2018-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more'
                },
                {
                    content: '支持自定义颜色',
                    timestamp: '2018-04-03 20:46',
                    color: '#0bbd87'
                },
                {
                    content: '支持自定义尺寸',
                    timestamp: '2018-04-03 20:46',
                    size: 'large'
                },
                {
                    content: '默认样式的节点',
                    timestamp: '2018-04-03 20:46'
                }
            ]
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
        userEdit() {
            this.editDialog = true;
        },
        editDialogDefine() {
            this.editDialog = true;
        },
        userWuliu() {
            this.wuliuDialog = true;
        }
    }
};
</script>
<style lang="less" scoped>
</style>
