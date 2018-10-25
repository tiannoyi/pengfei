<template>
  <el-container>
    <el-header style=" font-size: 12px;display: flex;align-items: center" id="header">
      <el-button  icon="el-icon-menu"  @click.stop="changeMenu($event)"></el-button>
      <div style="flex:1;text-align: right">
      <span style="color: white;">
        账户权限：{{adminName}}
         <el-tooltip class="item" effect="dark" content="注销登录" placement="top">
           <span @click="login">[注销]</span>
    </el-tooltip>
      </span>
      </div>
      <div style="width: 70px;text-align: right">
        <div class="block">
          <el-color-picker v-model="backgroundColor" @change="changeColor"></el-color-picker>
        </div>
      </div>
    </el-header>
    <el-main style="display: flex;flex-direction:column">

      <div style="flex: 1;background-color: #F6FCFA;padding: 30px;min-height: 300px" class="routerDiv">
        <transition :name="transitionName">
          <router-view></router-view>
        </transition>
      </div>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "mycontent",
      data(){
        return {
          tabIndex: 1,
          backgroundColor:'#409EFF',
          transitionName:'router-after'
        }
      },
      watch:{
        '$route' (to, from) {
          if(to.path == '/'){
            this.transitionName = 'router-before';
          }else{
            this.transitionName = 'router-after';
          }
        }
      },
      methods: {
        login:function(){
           this.$router.push('/');
        },
          //改变当前路由
        changeMenu:function () {
          this.$store.commit('menuBlockChange');
        },
        //移除当前选项
        removeTab(targetName) {
          this.$store.commit('deleteTab',targetName)
        },
        //更改当前列表
        changeTable:function (val) {
          this.$store.commit('myTab',val.name);
          for (let index in this.$store.state.editableTabs){
            if (this.$store.state.editableTabs[index].name==val.name){
              this.$router.push('/login/'+this.$store.state.editableTabs[index].url);
            }
          }
        },
        //更改头部颜色
        changeColor:function () {
          document.getElementById('header').style.background=this.backgroundColor;
        },


      },mounted:function () {
          document.getElementById('header').style.background=this.backgroundColor;
      },computed : {
        editableTabs() {
          return this.$store.state.editableTabs;
        },
        editableTabsValue(){
          return this.$store.state.editableTabsValue;
        },
        menuBlock(){
          return this.$store.state.menuBlock;
        },
        time(){
          return new Date();
        },
        adminName:function () {
          return this.$store.state.adminName.roleName
        },
      }
    }
</script>

<style lang="scss">
  .el-tabs--card>.el-tabs__header .el-tabs__item {
    color: #47494e;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
    background-color:#F6FCFA ;
  }
  .el-tabs__content{
    display: none;
  }
  .el-tabs--card>.el-tabs__header{
    margin-bottom: 0px;
  }
  .time{
    color: white;
  }
  .router-before-enter, .router-after-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .router-before-leave-active, .router-after-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }
  .routerDiv{
    transition: all .5s cubic-bezier(.55,0,.1,1);
    overflow:auto;
    min-width: 700px;
  }
</style>
