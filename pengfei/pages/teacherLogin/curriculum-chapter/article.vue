<template>
  <div>
    <el-button type="text" icon="el-icon-arrow-left"></el-button>
    <el-button type="primary " @click="add" size="mini">添加文章</el-button>
    <br><br>
    <!--@selection-change="handleSelectionChange"-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      v-loading="loading"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        style="text-align: center"
        width="55">
      </el-table-column>
      <el-table-column
        label="文章标题">
        <template slot-scope="scope">{{ scope.row.articleName }}</template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        prop="addTime"
      ></el-table-column>
      <el-table-column
        label="内容"
        prop="articleContent"
      ></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="文章名称" prop="articleName">
          <el-input v-model="ruleForm.articleName"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="articleContent">
          <el-input type="textarea" v-model="ruleForm.articleContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { get,deleteOne,post } from '~/static/js/api.js';
  import navigationBar from '~/components/navigationBar.vue';
  import axios from 'axios';
  export default {
    name: "announcement",
    asyncData:function(context){
      return axios.get('http://localhost:3000/api/article/knowledgeId?knowledge_id='+context.store.state.knowledge.knowledgeId).then(res=>{
        return{
          tableData:res.data.data
        }
      })
    },
    data(){
      return{
        tableData:[],
        title:'',
        size:10,
        dialogFormVisible: false,
        loading:false,
        ruleForm: {
          articleContent:'',
          articleName:''
        },
        formLabelWidth: '120px',
        rules: {
          articleContent:[
            { required: true, message: '请输入文章内容', trigger: 'change' }
          ],
          articleName:[
            { required: true, message: '请输入文章内容', trigger: 'change' }
          ],
        }
      }
    },
    components:{
      navigationBar
    },
    mounted:function(){

    },
    methods:{
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {
        let that=this;
        that.loading=true;
        get('/article/knowledgeId?knowledge_id='+that.$store.state.knowledge.knowledgeId).then(res=>{
          that.tableData=res.data;
          that.loading=false;
        })
      },
      //删除单个文章
      deleteThis:function (val) {
        deleteOne('/article/'+val.articleId,'您确定删除该条文章？',this);
      },
      //改变文章
      change:function (val) {
        this.title='修改文章';
        this.dialogFormVisible=true;
        this.ruleForm=val;
      },
      //提交修改 or 提交添加
      submitForm(formName) {
        let that=this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.title=='添加文章'){
              that.ruleForm.knowledgeId=that.$store.state.knowledge.knowledgeId;
              post('/article',that.ruleForm).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
            }else{
              let val={
                "articleId":that.ruleForm.articleId,
                "articleName":that.ruleForm.articleName,
                "articleContent":that.ruleForm.articleContent,
                "knowledgeId":that.$store.state.knowledge.knowledgeId
              }
              post('/article/update',val).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
            }
          } else {
            return false;
          }
        });
      },
      //添加文章
      add:function () {
        this.title='添加文章';
        this.dialogFormVisible=true;
        this.ruleForm={
          knowledgeId :'',
        };
      },
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
