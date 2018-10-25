<template>

    <el-form :model="teachData"  ref="teachData" label-width="150px" label-position="right" class="demo-ruleForm">
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
          action="http://www.tiannoyi.com/video/teacher/update"
          :data="teachData"
          accept="image/*"
          :on-success="subSuc"
          :limit=1
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="teachADD">添加教师（不上传头像）</el-button>
          <div slot="tip" class="el-upload__tip">只能上图片文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
</template>

<script>
  import axios from "axios";
  import { get,deleteOne,post } from '~/static/js/api.js';
    export default {
      async asyncData (context){
        let [teachData] = await Promise.all([
          axios.get('http://localhost:3000/api/teacher/adminId/'+context.store.state.adminName.teacherId),
        ])
        return{
          teachData:teachData.data.data,
        }
      },
        name: "setting",
      data(){
          return{
            dialogFormVisible:true,
            title:'修改教师信息',
            teachData:{
              teacherId:'',
              name:'',
              title:'',
              intro:'',
            },
          }
      },
      mounted:function(){
          // get('/teacher/adminId/'+this.$store.state.adminName.teacherId).then(res=>{
          //
          // })
        this.teachData={
          'teacherId':this.$store.state.adminName.teacherId,
          'name':'',
          'title':'',
          'intro':''
        }
        console.log(this.teachData)
        // this.teachData={
        //   'teacherId':this.$store.state.adminName.teacherId,
        //   'name':this.tableData.name,
        //   'title':this.tableData.title,
        //   'intro':this.tableData.intro
        // }
      },
      methods:{
        submitUpload() {
          if (this.teachData.teacherId!=''){
            this.$refs.upload.submit();
          }else{
            this.$message.error('提交错误');
          }
        },
        subSuc:function () {
          this.dialogFormVisible=false;
          this.$router.push('/teacherLogin')
        },
        teachADD:function () {
          let that=this;
          post("/teacher/update",that.teachData).then(res=>{
            that.$message({
              type: res.state.toLowerCase(),
              message: res.message
            });
            this.$router.push('/teacherLogin')
          })
        }
      }
    }
</script>

<style scoped>

</style>
