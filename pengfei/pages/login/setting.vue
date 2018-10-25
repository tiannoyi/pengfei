<template>
  <div class="container">
    <div class="right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >系统管理</el-breadcrumb-item>
        <el-breadcrumb-item >网页信息设置</el-breadcrumb-item>
      </el-breadcrumb>
      <br><br>
      <div class="type-container">
        <br>
        <br>
        <div class="type-form" >
          <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" label-position="right" class="demo-ruleForm">
            <el-form-item label="网页名称：">
              <el-input placeholder="请输入内容" v-model="ruleForm.systemName" @keyup.native.13="changeTitle(ruleForm.systemName)">
                <template slot="append" ><span style="cursor: pointer" @click="changeTitle(ruleForm.systemName)">确认修改</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="logo略缩图：" >
              <img :src="ruleForm.systemLogo" alt="网络原因或者图片损毁" style="height: 200px;">
            </el-form-item>
            <el-form-item label="logo地址图片：" >
              <el-input placeholder="请输入内容" v-model="ruleForm.systemLogo">
              </el-input>
            </el-form-item>
            <el-form-item label="上传新的图片：" >
              <el-upload
                class="upload-demo"
                drag
                name="logo"
                action="http://www.tiannoyi.com/video/system/updateLogo"
                show-file-list=true
                :on-success="refresh"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="封面略缩图：" >
              <img :src="ruleForm.cover" alt="网络原因或者图片损毁" style="height: 200px;">
            </el-form-item>
            <el-form-item label="封面略缩图：" >
              <el-input  v-model="ruleForm.cover">
              </el-input>
            </el-form-item>
            <el-form-item label="上传新的图片：" >
              <el-upload
                class="upload-demo"
                drag
                name="cover"
                action="http://www.tiannoyi.com/video/system/updateCover"
                show-file-list=true
                :on-success="refresh"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="密匙（待定）：" prop="name">
              <el-input v-model="ruleForm.appsecret"></el-input>
            </el-form-item>
            <el-form-item label="appid：" prop="name">
              <el-input v-model="ruleForm.appid"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { get,post } from "../../static/js/api";
  export default {
    name: "setting",
    asyncData(){
      return get('http://localhost:3000/api/system').then(res=>{
        return{
          ruleForm:res.data
        }
      })
    },
    data(){
      return{
        props1: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        ruleForm: {
          sustemId: '',
          systemName: '',
          systemLogo: '',
          cover: '',
          appsecret: '',
          appid: '',
        }
      }
    },
    methods:{
      //获取加载,数据
      refresh:function(){
        get('/system').then(res=>{
          this.ruleForm=res.data;
        })
      },

      //修改标题
      changeTitle:function (value) {
        post('/system/1 ',{
          "systemName":value,
          "_method":"put"
        }).then(res=>{

        })
      }
    },
    mounted:function(){
      // this.refresh();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
</script>

<style lang="scss">
  .container{
    display: flex;
    .left{
      width: 200px;
    }
    .right{
      flex: 1;
    }
    .el-tree{
      background: #F6FCFA;
    }
  }
  .type-container{
    background: white;
    height: 100%;
    width: 100%;
    .type-form{
      width: 70%;
      margin-left: 10%;
    }
  }
</style>
