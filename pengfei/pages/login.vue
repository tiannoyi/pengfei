<template>
  <el-container style="height: 100%;position: absolute;width: 100%;">
    <mymenu></mymenu>
    <mycontent></mycontent>
  </el-container>
</template>

<script>
  import mymenu from '~/components/mymenu.vue';
  import mycontent from '~/components/mycontent.vue';
  export default {
    name: "login",
    components:{
      mymenu,
      mycontent
    },
    data(){
      return {
        tabIndex: 1,
      }
    }
    ,
    methods: {
      removeTab(targetName) {
        this.$store.commit('deleteTab',targetName)
      },changeTable:function (val) {
        this.$store.commit('myTab',val.name);
        for (let index in this.$store.state.editableTabs){
          if (this.$store.state.editableTabs[index].name==val.name){
            this.$router.push(this.$store.state.editableTabs[index].url);
          }
        }
      },
    },mounted:function () {
      this.$message({
        message: '尊敬的管理员'+this.$store.state.adminName.roleName+'，欢迎登陆PC端管理平台',
        type: 'success'
      });
      if (!this.$store.state.adminName){
        this.$router.push('/');
      }
    },computed : {
      editableTabs() {
        return this.$store.state.editableTabs;
      },
      editableTabsValue(){
        return this.$store.state.editableTabsValue;
      },
      adminName(){
        return this.$store.state.adminName;
      },

    }
  }
</script>

<style lang="scss">
  .el-main{
    margin: 0px;
    padding: 0px;
  }
  .el-tabs__nav-scroll{
    margin: 0px;
    padding: 0px;
    border-color:#fff;
    border: 0px;
    color: #fff;
    .el-tabs__item{
      color: #fff;
      border: 0px;
    }
    .is-active{
      color: #409EFF;
    }
    .myindex{
      .el-icon-close{
        display: none;
      }
    }
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #fff;
  }
  .el-aside {
    -webkit-transition: width 0.3s ease-in-out;
    -moz-transition: width 0.3s ease-in-out;
    -ms-transition: width 0.3s ease-in-out;
    -o-transition: width 0.3s ease-in-out;
    transition: width 0.3s ease-in-out;
  }
</style>
