<template>
  <el-row :gutter="20">
    <el-col :lg="12" :xs="24" :md="16">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" label-position="right" class="demo-ruleForm">
        <el-button type="primary " @click="addNew">添加新小节</el-button>
        <br>
        <br>
        <el-form-item label="章节名称：" prop="chapterName">
          <el-input v-model="ruleForm.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节序号：" prop="chapterNum">
          <el-input v-model="ruleForm.chapterNum"></el-input>
        </el-form-item>
        <el-form-item label="编辑教师：" prop="redactTeacher">
          <el-input v-model="ruleForm.redactTeacher"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交修改</el-button>
          <el-button @click="deleteChapter">删除该章节</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="添加新小结" :visible.sync="dialogFormVisible">
        <el-form :model="knowledge" :rules="rulesOne" ref="knowledge" label-width="100px" class="demo-ruleForm">
          <el-form-item label="小结名" prop="summaryName">
            <el-input v-model="knowledge.summaryName"></el-input>
          </el-form-item>
          <el-form-item label="小结序号" prop="summaryNum">
            <el-input v-model="knowledge.summaryNum"></el-input>
          </el-form-item>
          <el-form-item label="编辑教师" prop="redactTeacher">
            <el-input v-model="knowledge.redactTeacher"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="postAdd('knowledge')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import  axios from 'axios';
    import {post,deleteOne} from "../../../static/js/api";

    export default {
        name: "index",
      data(){
          return{
            dialogFormVisible:false,
            ruleForm: {
              chapterId:'',
              chapterName: '',
              chapterNum: '',
              redactTeacher: '',
              curriculumId: '',
              _method: 'put',
            },
            knowledge: {
              chapterId:'',
              summaryName: '',
              summaryNum: '',
              redactTeacher: '',
            },
            rules: {
              chapterName: [
                { required: true, message: '请输入章节名', trigger: 'blur' }
              ],
              chapterNum: [
                { required: true, message: '请输入章节序号', trigger: 'blur' }
              ],
              redactTeacher: [
                { required: true, message: '请输入编辑老师', trigger: 'blur' }
              ]
            },
            rulesOne:{
              summaryName: [
                { required: true, message: '请输入小结名', trigger: 'blur' }
              ],
              summaryNum: [
                { required: true, message: '请输入小结序号', trigger: 'blur' }
              ],
              redactTeacher: [
                { required: true, message: '请输入编辑老师', trigger: 'blur' }
              ]
            },
          }
      },
      methods:{
        //表单验证
        submitForm(formName) {
          let that =this;
          that.$store.commit('showChange');
          that.$refs[formName].validate((valid) => {
            if (valid) {
              that.ruleForm.curriculumId=that.$store.state.curriculum.curriculumId;
              that.ruleForm.chapterId=that.$store.state.chapter.chapterId;
              post('/chapter',that.ruleForm).then(res=>{
                that.$store.commit('showChange');
                that.$message({
                  message:res.message,
                  type: 'success'
                });
              })
            } else {
              return false;
            }
          });
        },
        //删除单签章节
        deleteChapter:function () {
          let that=this;
          that.$store.commit('showChange');
          axios.delete('/chapter/'+that.$store.state.chapter.chapterId).then(res=>{
            that.$store.commit('showChange');
          })
       },
       //为当前章节添加新小结
        addNew:function () {
          if (this.$store.state.chapter.chapterId){
            this.dialogFormVisible=true;
          }else{
            this.$message.error('请先选择章节');
          }
        },
        //提交新小结信息
        postAdd:function (knowledge) {
          let that =this;
          that.$store.commit('showChange');
          that.$refs[knowledge].validate((valid) => {
            if (valid) {
              that.knowledge.chapterId=that.$store.state.chapter.chapterId;
              if(that.$store.state.chapter.chapterId){
                post('/Knowledge',that.knowledge).then(res=>{
                  that.$store.commit('showChange');
                  that.dialogFormVisible=false;
                  that.$message({
                    message:res.message,
                    type: 'success'
                  });
                })
              }else{
                that.$message.error('请先选择章节');
              }
            } else {
              return false;
            }
          });
        }
      },
      mounted:function () {
        //清空当前记录
        window.sessionStorage.setItem('chapterData','');
        window.sessionStorage.setItem("knowledgeId",'');
      }
    }
</script>

<style scoped>

</style>
