<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClassify">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <ZkTable
        :data="getCategList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        class="tableMargin"
      >
        <template slot="isok" scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen;"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.level==0" size="mini">一级</el-tag>
          <el-tag type="success" v-if="scope.row.level==1" size="mini">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.level==2" size="mini">三级</el-tag>
        </template>
        <template slot="product" slot-scope="scope">
          <el-button @click="userEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button @click="userDel(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </ZkTable>

      <el-pagination
        @size-change="2"
        @current-change="1"
        :current-page="1"
        :page-size="2"
        layout="total,  prev, pager, next, jumper"
        :total="30"
      ></el-pagination>
      <el-dialog title="添加分类" :visible.sync="cateDialog" width="50%" @close="rightDislogClose">
        <div>
          <p>分类名称:</p>
          <p>
            父级分类:
            <el-cascader
              v-model="value"
              :options="getLinkList"
              @change="handleChange"
              expand-trigger="hover"
              :props="cascaderProps"
              clearable
            ></el-cascader>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateDialog = false">取 消</el-button>
          <el-button type="primary" @click="cateDialogDefine">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
    created() {
        this.getCategList();
    },
    data() {
        return {
            // 添加分类弹框
            cateDialog: false,
            // 三级联动的值
            value: [],
            // 查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // table  对应的列数
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    width: 200,
                    label: '操作',
                    type: 'template',
                    template: 'product'
                }
            ],
            cascaderProps: {
                value: 'id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联数据
            getLinkList: [
                {
                    id: 1,
                    cat_name: '大家电',
                    cat_deleted: false,
                    level: '0',
                    children: [
                        {
                            id: 11,
                            cat_name: '电视',
                            level: '1',
                            cat_deleted: false
                        }
                    ]
                },
                {
                    id: 2,
                    cat_name: '热门推荐',
                    cat_deleted: false,
                    level: '0',
                    children: [
                        {
                            id: 21,
                            cat_name: '电视',
                            level: '1',
                            cat_deleted: false
                        }
                    ]
                },
                {
                    id: 3,
                    cat_name: '海外网',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 4,
                    cat_name: '苏宁房产',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 5,
                    cat_name: '手机相机',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 5,
                    cat_name: '手机相机',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 5,
                    cat_name: '手机相机',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 5,
                    cat_name: '手机相机',
                    cat_deleted: false,
                    level: '0'
                }
            ],
            // 列表数据
            getCategList: [
                {
                    id: 1,
                    cat_name: '大家电',
                    cat_deleted: false,
                    level: '0',
                    children: [
                        {
                            id: 11,
                            cat_name: '电视',
                            level: '1',
                            cat_deleted: false,
                            children: [
                                {
                                    id: 111,
                                    cat_name: '全面电视',
                                    level: '2',
                                    cat_deleted: false
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    cat_name: '热门推荐',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 3,
                    cat_name: '海外网',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 4,
                    cat_name: '苏宁房产',
                    cat_deleted: false,
                    level: '0'
                },
                {
                    id: 5,
                    cat_name: '手机相机',
                    cat_deleted: false,
                    level: '0'
                }
            ]
        };
    },
    methods: {
        //
        // async getCategList(){
        //   // 发送请求
        //   const {data:res} = await this.$http.get('/api/rightlist')
        //   if(res.meta.status !==200){
        //     return this.$message.error('获取权限失败')
        //   }
        //   this.rightlist = res.data
        // }
        addClassify() {
            this.cateDialog = true;
        },
        cateDialogDefine() {
            this.cateDialog = false;
            console.log(this.value);
        }
    }
};
</script>
<style lang="less" scoped>
.tableMargin {
    margin-top: 15px;
}
.el-cascader {
    width: 80%;
}
</style>
