<template name="mymenu">
  <el-aside :width="width" style="min-height: 100%;" >
    <el-row class="admin">
      <!--<image class="image" src="./../assets/logo.png" style="border-radius: 50%;height: 100px;width: 100px;"/>-->
      <!--<p>{{adminName}}</p>-->
    </el-row>
    <el-menu :collapse="!menuBlock" :default-active="editableTabsValue.toString()"
             class="el-menu-vertical-demo"
             style="min-height: 100%;"
             background-color="#EEEEEE"
             text-color="#000"
             popper-append-to-body="true"
             active-text-color="#ffd04b"
    >
      <el-submenu v-for="(items,index) in menuList"  v-bind:key="index" :index="items.permissions.pId.toString()">
        <template slot="title"><i :class="items.permissions.img"></i>
          <span slot="title">{{items.permissions.pName}}</span>
        </template>
        <el-menu-item-group >
          <el-menu-item  v-for="(item,index) in items.list" v-bind:key="index" :index="item.pId.toString()" @click="changeUrl(item)">&nbsp;&nbsp;{{item.pName}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
  import { get } from '~/static/js/api.js';
  export default {
    name: "mymenu",
    async asyncData(app){
      // let menu = await Promise.all([
      //   get('/menu')
      //  ])
      //  return{
      //   menu:menu
      //  }
    },
    data(){
      return{
        menuList:[{
          "permissions": {
            "pId": 2,
            "pName": "课程管理",
            "path": "",
            "img": 'el-icon-view',
            "order": 2
          },
          "list": [{
            "pId": 101,
            "pName": "管理课程",
            "path": "/teacherLogin/curriculum",
            "img": null,
            "order": null
          },
          ]
            },
          ]
      }
    },
    created:function(){
      // get('/menu').then(res=>{
      //   console.log(res)
      // })
    },
    methods:{
      //点击左侧导航栏触发
      changeUrl:function (val) {
        if (val.path){
          this.$router.push(val.path);
        } else{
          let value= this.$message({
            type:'error',
            message:'路径不存在'
          });
          value;
        }
        this.$store.commit('menuBlockChange');
        if (val.pId){
          this.$store.commit('myTab',val.pId)
        }
        this.$store.commit('addTab',val);
      },

    },
    computed : {
      menuBlock(){
        return this.$store.state.menuBlock;
      },
      editableTabs() {
        return this.$store.state.editableTabs;
      },
      editableTabsValue(){
        return this.$store.state.editableTabsValue;
      },
      width:function () {
        let width='300px';
        if (!this.menuBlock) {
          width='64px'
        }
        return width;
      }
    }
  }
</script>

<style lang="scss">
  .el-menu-vertical-demo{
    width: 300px;
  }
  .el-menu--collapse{
    width: 64px;
  }
  .el-menu-item{
    width: 300px;
  }
  .el-menu--collapse .el-menu-item{
    width: 63px;
  }
  .el-menu-vertical-demo{
    border-right: 0px;
  }
  .el-menu-item-group__title{
    display: none;
  }
</style>
