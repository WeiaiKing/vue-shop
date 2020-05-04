<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table :data="rightlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">等级一</el-tag>
            <el-tag type="success" v-if="scope.row.level==1">等级二</el-tag>
            <el-tag type="warning" v-if="scope.row.level==2">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
    created() {
        this.getRightList();
    },
    data() {
        return {
            rightlist: [
                {
                    id: 1,
                    authName: '商品管理',
                    level: '0',
                    path: 'goods'
                },
                {
                    id: 2,
                    authName: '订单管理',
                    level: '0',
                    path: 'oders'
                },
                {
                    id: 3,
                    authName: '权限管理',
                    level: '0',
                    path: 'rights'
                },
                {
                    id: 4,
                    authName: '商品列表',
                    level: '1',
                    path: 'goods'
                },
                {
                    id: 5,
                    authName: '添加商品',
                    level: '2',
                    path: 'goods'
                }
            ]
        };
    },
    methods: {
        // async getRightList(){
        //   // 发送请求
        //   const {data:res} = await this.$http.get('/api/rightlist')
        //   if(res.meta.status !==200){
        //     return this.$message.error('获取权限失败')
        //   }
        //   this.rightlist = res.data
        // }
    }
};
</script>
<style lang="less" scoped></style>
