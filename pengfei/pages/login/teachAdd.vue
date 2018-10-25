<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/login/teacher'}">教师管理</el-breadcrumb-item>
      <el-breadcrumb-item >添加教师</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
      <el-form :model="teachData"  ref="teachData" label-width="150px" label-position="right" class="demo-ruleForm" style="background: white;margin: 10px;padding-top: 50px;">
        <el-form-item label="教师名称：" prop="videoName">
          <el-input v-model="teachData.name"></el-input>
        </el-form-item>
        <el-form-item label="教师职称：" prop="videoDuration">
          <el-input v-model="teachData.title"></el-input>
        </el-form-item>
        <el-form-item label="教师简介：" prop="videoDuration">
          <el-input v-model="teachData.intro"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="http://www.tiannoyi.com/video/teacher"
            :data="teachData"
            :limit=1
            accept="image/*"
            :on-success="subSuc"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传图片</div>
          </el-upload>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import { get,deleteOne } from '~/static/js/api.js';
  export default {
    name: "teacher",
    data(){
      return{
        teachData:{
          name:'',
          title:'',
          intro:'',
        }
      }
    },
    mounted:function(){

    },
    methods:{
      //将所有数据上传到服务器上
      submitUpload() {
          this.$refs.upload.submit();
      },
      //提交成功之后的回调函数
      subSuc:function () {

      }
    }
  }
</script>

<style lang="scss">
  .el-container{
    background-color: #dbe1ec;
  }
  .block{
    text-align: right;
  }
  .demo-input-suffix{
    width:300px
  }
  .orange{
    color: #FF9900;
  }
  .wirte{
    color: #dbe1ec;
  }
</style>
