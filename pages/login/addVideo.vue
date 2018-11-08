<template>
  <el-row>
    <el-col :span="24">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >信息管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/login/curriculum' }">课程管理<span>《{{curriculumName}}》</span></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/login/curriculum-chapter' }">章节<span>《{{chapterName}}》</span></el-breadcrumb-item>
        <el-breadcrumb-item v-if="knowledgeName!='未选择小结'" :to="{path:'/login/curriculum-chapter/summary'}">小结<span>《{{knowledgeName}}》</span></el-breadcrumb-item>
      </el-breadcrumb>
      <br>
      <div class="type-container">
        <br>
        <br>
        <div class="type-form" >
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" label-position="right" class="demo-ruleForm">
            <el-form-item label="视频名称：" prop="videoName">
              <el-input v-model="ruleForm.videoName"></el-input>
            </el-form-item>
            <el-form-item label="视频时长：" prop="videoDuration">
              <el-input v-model="ruleForm.videoDuration"></el-input>
            </el-form-item>
            <el-form-item>
              <el-upload
                class="upload-demo"
                :on-success="newVideo"
                ref="upload"
                action="http://www.tiannoyi.com/video/video"
                :data="ruleForm"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                accept="video/*"
                :limit=1
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上视频文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import { get,post } from "../../static/js/api";
  export default {
    name: "addVideo",
    data(){
      return{
        ruleForm: {
          videoName:'',
          videoDuration: '',
          knowledgeId:""
        },
        rules: {
          chapterName: [
            { required: true, message: '请输入视频名称', trigger: 'blur' }
          ],
          chapterNum: [
            { required: true, message: '请选择视频地址', trigger: 'blur' }
          ],
          redactTeacher: [
            { required: true, message: '请输入视频时长', trigger: 'blur' }
          ]
        },
      }
    },
    methods:{
      //修改标题
      changeTitle:function (value) {
        post('/system/1 ',{
          "systemName":value,
          "_method":"put"
        }).then(res=>{

        })
      },
      submitUpload() {
      	      	this.ruleForm.knowledgeId=this.$store.state.knowledge.knowledgeId;
          this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {

      },
      newVideo:function (res) {
        this.$notify({
          title: res.state.toLowerCase(),
          message: res.message,
          type: 'success'
        });
        this.$router.push("/login/curriculum-chapter/summary")
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    computed:{
      knowledgeName:function () {
        return this.$store.state.knowledge.name;
      },
      chapterName:function () {
        return this.$store.state.chapter.name;
      },
      curriculumName:function () {
        return this.$store.state.curriculum.name;
      }
    }
  }
</script>

<style lang="scss">
  .type-container{
    background: white;
    height: 100%;
    width: 100%;
  }
</style>
