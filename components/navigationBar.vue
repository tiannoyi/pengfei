<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >1</el-breadcrumb-item>
        <el-breadcrumb-item >1</el-breadcrumb-item>
      </el-breadcrumb>
      <br>
    </div>
</template>

<script>
    export default {
        name: "navigationBar",
      computed:{
        tabData:function () {
            return this.$store.state.tabData;
          }
      },

    }
</script>

<style scoped>

</style>
