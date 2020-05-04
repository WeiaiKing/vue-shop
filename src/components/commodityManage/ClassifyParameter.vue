<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <el-row class="cat_option">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="value"
            :options="getLinkList"
            @change="handleChange"
            expand-trigger="hover"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isBtnDisabled" @click="many">添加参数</el-button>
            </el-col>
          </el-row>
          <!-- 表单内容 -->
          <el-table :data="roleList" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="item in scope.row.children"
                  :key="item.id"
                  closable
                  @close="handleClose(item)"
                >{{item.authName}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  @click="userEdit(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  @click="userDel(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="isBtnDisabled" @click="only">添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 表单内容 -->
          <el-table :data="onlyList" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row
                  :class="['bdbottom',i==0?'bdtop':'',{vcenter:true}]"
                  v-for="(item,i) in scope.row.children"
                  :key="item.id"
                >
                  <!-- 一级 权限-->
                  <el-col :span="5">
                    <el-tag closable @close="removeTag(scope.row,item2.id)">{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二级 三级权限-->
                  <el-col :span="19">
                    <el-row
                      v-for="(item2,i2) in item.children"
                      :key="item2.id"
                      :class="[i2==0?'':'bdtop','vcenter']"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          closable
                          @close="removeTag(scope.row,item2.id)"
                        >{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18" :offset="6">
                        <el-tag
                          v-for="(item3) in item2.children"
                          :key="item3.id"
                          type="warning"
                          closable
                          @close="removeTag(scope.row,item3.id)"
                        >{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  @click="userEdit(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  @click="userDel(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 创建对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialog"
      width="50%"
      @close="addDislogClose"
    >
      <el-form
        :model="addUserForm"
        :rules="rules"
        ref="addUserForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDefine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data() {
        return {
            // 弹框
            addDialog: false,
            // 添加表单
            addUserForm: {
                username: ''
            },
            // 表单规则
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ]
            },
            // 默认激活的tabs
            activeName: 'many',
            // 三级联动的值
            value: [],
            //  联级参数
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
                            cat_deleted: false,
                            children: [
                                {
                                    id: 111,
                                    cat_name: '电视',
                                    level: '1',
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
            // 角色列表
            roleList: [
                {
                    id: 1,
                    roleName: '版式',
                    children: [
                        {
                            id: 101,
                            authName: '商品管理',
                            path: null,
                            children: [
                                {
                                    id: 104,
                                    authName: '商品列表',
                                    path: null,
                                    children: [
                                        {
                                            id: 105,
                                            authName: '添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理',
                                            path: null
                                        },
                                        {
                                            id: 105,
                                            authName: '添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理,添加商品',
                                            path: null
                                        },
                                        {
                                            id: 105,
                                            authName: '添加商品添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理',
                                            path: null
                                        },
                                        {
                                            id: 105,
                                            authName: '添加商品添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理',
                                            path: null
                                        }
                                    ]
                                },
                                {
                                    id: 102,
                                    authName: '订单管理',
                                    path: null,
                                    children: [
                                        {
                                            id: 106,
                                            authName: '添加订单',
                                            path: null
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            id: 50,
                            authName: '订单管理',
                            path: null,
                            children: [
                                {
                                    id: 51,
                                    authName: '商品列表',
                                    path: null,
                                    children: [
                                        {
                                            id: 52,
                                            authName: '添加商品',
                                            path: null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            // 添加tag的值
            tagArr: ['商品管理', '订单管理'],
            // 静态熟悉感
            onlyList: [
                {
                    id: 1,
                    roleName: '主体-商品名称',
                    children: [
                        {
                            id: 101,
                            authName: '商品管理',
                            path: null,
                            children: [
                                {
                                    id: 104,
                                    authName: '商品列表',
                                    path: null,
                                    children: [
                                        {
                                            id: 105,
                                            authName: '添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理',
                                            path: null
                                        },
                                        {
                                            id: 105,
                                            authName: '添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理,添加商品',
                                            path: null
                                        },
                                        {
                                            id: 105,
                                            authName: '添加商品添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理',
                                            path: null
                                        },
                                        {
                                            id: 105,
                                            authName: '添加商品添加商品',
                                            path: null
                                        },
                                        {
                                            id: 109,
                                            authName: '订单管理',
                                            path: null
                                        }
                                    ]
                                },
                                {
                                    id: 102,
                                    authName: '订单管理',
                                    path: null,
                                    children: [
                                        {
                                            id: 106,
                                            authName: '添加订单',
                                            path: null
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            id: 50,
                            authName: '订单管理',
                            path: null,
                            children: [
                                {
                                    id: 51,
                                    authName: '商品列表',
                                    path: null,
                                    children: [
                                        {
                                            id: 52,
                                            authName: '添加商品',
                                            path: null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    roleName: '显示-曲面',

                    children: [
                        {
                            id: 21,
                            authName: '订单管理',
                            path: null,
                            children: [
                                {
                                    id: 22,
                                    authName: '商品列表',
                                    path: null,
                                    children: [
                                        {
                                            id: 23,
                                            authName: '添加商品',
                                            path: null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    roleName: '系统-智能电视',

                    children: [
                        {
                            id: 31,
                            authName: '权限管理',
                            path: null,
                            children: [
                                {
                                    id: 32,
                                    authName: '权限管理',
                                    path: null,
                                    children: [
                                        {
                                            id: 33,
                                            authName: '添加商品',
                                            path: null
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            inputVisible: false,
            inputValue: ''
        };
    },
    methods: {
        handleChange(e) {
            if (e.length === 3) {
            } else {
                this.$http.get(`categories/${this.cateID}/attributes`, {
                    params: { sel: 'namy' }
                });
            }
            console.log(e);
        },
        many() {
            this.addDialog = true;
        },
        only() {
            this.addDialog = true;
        },
        addDefine() {
            this.$message.success('添加参数成功');
            this.addDialog = false;
        },
        // tag标签关闭
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            const inputValue = this.inputValue;
            if (inputValue) {
                this.roleList[0].children.push(inputValue);
            }

            this.inputValue = '';
            this.inputVisible = false;
        }
    },
    computed: {
        isBtnDisabled() {
            if (this.value.length !== 3) {
                return true;
            }
            return false;
        },
        // 计算三级分类的Id
        cateID() {
            if (this.value.length !== 3) {
                return this.value[2];
            }
            return null;
        },
        // 动态计算dialog标题
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数';
            }
            return '静态参数';
        }
    }
};
</script>
<style lang="less" scoped>
.el-alert {
    margin-bottom: 15px;
}
.el-tag {
    margin: 15px;
}

.button-new-tag {
    width: 120px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 120px;
}
</style>
