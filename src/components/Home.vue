<template>
  <el-container class="home-container">
    <!-- 头部部分 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="back">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏部分 -->
      <el-aside :width="isCollapse ?'64px':'200px'">
        <div class="toggle-botton" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#599ef8"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="isactivePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单内容 -->
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{item.firstname}}</span>
            </template>
            <!-- item 子元素 -->
            <el-menu-item
              :index="childItem.id + ''"
              v-for="childItem in item.child"
              :key="childItem.id"
              @click="saveNavState(childItem.id)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childItem.secondName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中心主题部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    created() {
        // 请求菜单
        this.getMenuList();
        this.isactivePath = window.sessionStorage.getItem('activePath');
    },
    data() {
        return {
            isCollapse: false,
            isactivePath: '',
            menulist: [
                {
                    id: 1,
                    firstname: '用户管理',
                    child: [
                        {
                            id: '/userlist',
                            secondName: '用户列表'
                        }
                    ]
                },
                {
                    id: 2,
                    firstname: '权限管理',
                    child: [
                        {
                            id: '/rolelist',
                            secondName: '角色列表'
                        },
                        {
                            id: '/rightlist',
                            secondName: '权限列表'
                        }
                    ]
                },
                {
                    id: 3,
                    firstname: '商品管理',
                    child: [
                        {
                            id: '/commoditylist',
                            secondName: '商品列表'
                        },
                        {
                            id: '/classify',
                            secondName: '分类参数'
                        },
                        {
                            id: '/commodityClass',
                            secondName: '商品分类'
                        }
                    ]
                },
                {
                    id: 4,
                    firstname: '订单管理',
                    child: []
                },
                {
                    id: 5,
                    firstname: '数据统计'
                }
            ],
            // 当于直接加到menulist里面了。以为键是以menulist的id作为的，循环直接调用
            icon: {
                1: 'el-icon-s-custom',
                2: 'el-icon-potato-strips',
                3: 'el-icon-shopping-bag-2',
                4: 'el-icon-notebook-2',
                5: 'el-icon-s-data'
            }
        };
    },
    methods: {
        // 退出登录，只需要销毁本地token
        back() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        // 获取菜单列表
        async getMenuList() {
            const { result: res } = await this.axios();
            console.log(res);
            // 请求数据之后操作
            // if(!res.meta.status !==200) return this.$message.error()
            // this.getMenuList = res.data
        },
        // 折叠
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存Nav
        saveNavState(e) {
            window.sessionStorage.setItem('activePath', e);
            console.log(e);
            this.isactivePath = e
        }
    }
};
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #b3c0d1;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    div {
        display: flex;
        align-items: center;
        font-size: 20px;
    }
    div img {
        margin-right: 20px;
        border-radius: 50%;
        height: 50px;
        width: 50px;
    }
}
.el-aside {
    background-color: #545c64;
    color: #333;
    .el-menu {
        border-right: 0;
    }
}
.el-main {
    background-color: #e9eef3;
    color: #333;
}
.toggle-botton {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    &:hover {
        cursor: pointer;
    }
}
</style>
