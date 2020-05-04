<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表单内容 -->
      <el-table :data="roleList" style="width: 100%" border stripe>
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
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
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

            <el-button
              @click="RolesSet(scope.row)"
              type="warning"
              icon="el-icon-setting"
              size="mini"
              :enterable="false"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="addRightDialog" width="50%" @close="addDislogClose">
        <el-tree
          :data="rightList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="treeRef"
          :default-checked-keys="defKeys"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRightDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRightDefine">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
    created() {
        this.getRoleList();
    },
    data() {
        return {
            // 分配权限对话框
            addRightDialog: false,
            // 角色列表
            roleList: [
                {
                    id: 1,
                    roleName: '主管',
                    roleDesc: '技术负责人',
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
                    roleName: '实习生',
                    roleDesc: '听话',
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
                    roleName: '实习生2',
                    roleDesc: '很强',
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
            // 权限列表
            rightList: [
                {
                    id: 1,
                    authName: '商品管理 1',
                    children: [
                        {
                            id: 12,
                            authName: '分类修改 1-1',
                            children: [
                                {
                                    id: 123,
                                    authName: '三级 1-1-1'
                                }
                            ]
                        },
                        {
                            id: 13,
                            authName: '商品列表 1-1',
                            children: [
                                {
                                    id: 133,
                                    authName: '三级 1-1-1'
                                }
                            ]
                        },
                        {
                            id: 14,
                            authName: '商品分类 1-1',
                            children: [
                                {
                                    id: 143,
                                    authName: '三级 1-1-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    authName: '订单管理 2',
                    children: [
                        {
                            id: 21,
                            authName: '二级 2-1',
                            children: [
                                {
                                    id: 213,
                                    authName: '三级 2-1-1'
                                }
                            ]
                        },
                        {
                            id: 22,
                            authName: '二级 2-2',
                            children: [
                                {
                                    id: 223,
                                    authName: '三级 2-2-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    authName: '权限管理 3',
                    children: [
                        {
                            id: 31,
                            authName: '二级 3-1',
                            children: [
                                {
                                    id: 313,
                                    authName: '三级 3-1-1'
                                }
                            ]
                        },
                        {
                            id: 32,
                            authName: '二级 3-2',
                            children: [
                                {
                                    id: 323,
                                    authName: '三级 3-2-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    authName: '用户管理 4',
                    children: [
                        {
                            id: 41,
                            authName: '二级 3-1',
                            children: [
                                {
                                    id: 431,
                                    authName: '三级 3-1-1'
                                }
                            ]
                        },
                        {
                            id: 42,
                            authName: '二级 3-2',
                            children: [
                                {
                                    id: 432,
                                    authName: '三级 3-2-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 5,
                    authName: '数据统计 5',
                    children: [
                        {
                            id: 51,
                            authName: '二级 3-1',
                            children: [
                                {
                                    id: 531,
                                    authName: '三级 3-1-1'
                                }
                            ]
                        },
                        {
                            id: 52,
                            authName: '二级 3-2',
                            children: [
                                {
                                    id: 532,
                                    authName: '三级 3-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
            // 默认选择的权限
            defKeys: [123, 431, 331],
            defaultProps: {
                children: 'children',
                label: 'authName'
            }
        };
    },
    methods: {
        getRoleList() {},
        // 删除对应id
        removeTag(role, id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
        // 分配权限对话框
        RolesSet(role) {
            // 通过递归的形式，获取角色素有三级id
            this.addRightDialog = true;
            this.getLeafKeys(role, this.defaultProps);
        },
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach(item => this.getLeafKeys(item.arr));
        },
        // 确定权限
        addRightDefine() {
            console.log(this.$refs.treeRef);
            const keys = [
                ...this.$refs.treeRef.getCheckdKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            this.addRightDialog = false;
            console.log(keys);
        }
    }
};
</script>
<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
