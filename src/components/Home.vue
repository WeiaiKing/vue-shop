<template>
  <div>
    <el-botton @click="back" type="info">退出</el-botton>
  </div>
</template>
<script>
export default {
    methods: {
        // 退出登录，只需要销毁本地token
        back() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
};
</script>
<style lang="less" scoped>
</style>
