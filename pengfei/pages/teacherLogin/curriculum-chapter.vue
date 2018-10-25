<template>
  <div class="container">
    <div class="left">
      <el-button type="primary " @click="addNew" size="mini">添加新章节</el-button>
      <br>
      <br>
      <span  v-if="!show">加载中</span>
      <el-tree
        v-if="show"
        style="width: 200px;"
        :props="props"
        :load="loadNode"
        lazy>
      </el-tree>
    </div>
    <div class="right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/login/curriculum' }">课程管理<span>《{{curriculumName}}》</span></el-breadcrumb-item>
      <el-breadcrumb-item >章节<span>《{{chapterName}}》</span></el-breadcrumb-item>
      <el-breadcrumb-item v-if="knowledgeName!='未选择小结'" >小结<span>《{{knowledgeName}}》</span></el-breadcrumb-item>
    </el-breadcrumb>
      <br><br>
      <div class="type-container">
        <br>
        <div class="type-form" >
          <router-view></router-view>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="章节名" prop="chapterName">
          <el-input v-model="ruleForm.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节序号" prop="chapterNum">
          <el-input v-model="ruleForm.chapterNum"></el-input>
        </el-form-item>
        <el-form-item label="编辑教师" prop="redactTeacher">
          <el-input v-model="ruleForm.redactTeacher"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import navigationBar from '~/components/navigationBar.vue';
  import { get,deleteOne,post } from '~/static/js/api.js';
  export default {
    name: "type",
    data(){
      return{
        dialogFormVisible:false,
        title:'添加新章节',
        loading:'true',
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        ruleForm: {
          chapterNum:"",
          chapterName:"",
          redactTeacher:""
        },
        formLabelWidth: '120px',
        rules: {
          chapterName:[
            { required: true, message: '请输入章节名', trigger: 'change' }
          ],
          chapterNum:[
            { required: true, message: '请输入章节序号', trigger: 'change' }
          ],
          redactTeacher:[
            { required: true, message: '请输入编辑教师', trigger: 'change' }
          ],
        }
      }
    },
    components:{
      navigationBar
    },
    methods:{
      //延时加载，为了从数据库拿东西
      loadNode(node, resolve) {

        let that=this;
        if (node.level === 0) {
          console.log(that.$store.state.curriculum);
          get('/chapter/curriculum_id/'+that.$store.state.curriculum.curriculumId).then(res=>{
            let val=res.data;
            let value=[];
           for (let valNum in val){
              value.push({
                name:val[valNum].chapterName,
                chapterId:val[valNum].chapterId,
                chapterNum:val[valNum].chapterNum,
                redactTeacher:val[valNum].redactTeacher,
                redactTime:val[valNum].redactTime,
              })
           }
            // that.$router.push('/login/curriculum-chapter');
            return resolve(value);
          })
        }
        if (node.level == 2) {
          if (node.data){
            that.$store.commit("knowledgeChange",{
              "knowledgeId":node.data.knowledgeId,
              "name":node.data.name
            })
              that.$router.push({
                path:'/login/curriculum-chapter/summary'
              });
          }
          return resolve([])
        };
        if (node.data){
          if(node.data.chapterId){
            get('/Knowledge/chapterId?chapterId='+node.data.chapterId).then(res=>{
              that.$store.commit('chapterChange',node.data);
              let val=res.data;
              let value=[];
              for (let valNum in val){
                value.push({
                  knowledgeId:val[valNum].knowledgeId,
                  chapterId:val[valNum].chapterId,
                  name:val[valNum].summaryName,
                  summaryNum:val[valNum].summaryNum,
                  redactTeacher:val[valNum].redactTeacher,
                  redactTime:val[valNum].redactTime,
                })
              }
              return resolve(value);
            })
          }
        }
      },
      //添加新章节
      addNew:function () {
        this.dialogFormVisible=true;
        this.ruleForm.curriculumId=this.$store.state.curriculum.curriculumId;
      },
      //表单验证
      submitForm(formName) {
        let that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$store.commit('showChange');
            post('/chapter',that.ruleForm).then(res=>{
              that.dialogFormVisible=false;
              that.$store.commit('showChange');
              that.$message({
                message:res.message,
                type: 'success'
              });
            })
          } else {
            return false;
          }
        })
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    computed : {
      show:function () {
        return this.$store.state.show;
      },
      curriculumName:function () {
        return this.$store.state.curriculum.name
      },
      knowledgeName:function () {
        return this.$store.state.knowledge.name
      },
      chapterName:function () {
        return this.$store.state.chapter.name
      }
    },
    mounted:function () {
      this.$store.commit('showTrue');
    }
  }
</script>

<style lang="scss">
  .container{
    display: flex;
    .left{
      min-width: 200px;
      height: 100%;
      overflow:auto
    }
    .right{
      flex: 1;
      height: 100%;
    }
    .el-tree{
      background: #F6FCFA;
    }
    .positionTopSpan{
      text-align: right;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
    }
  }
  .type-container{
    background: white;
    height: 100%;
    width: 100%;
    .type-form{
      margin: 20px;
    }
  }
  .el-tree-node{
    overflow:auto
  }
</style>
