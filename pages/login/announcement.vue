<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/login/curriculum' }">视频管理</el-breadcrumb-item>
      <el-breadcrumb-item >课程开课《{{curriculumName}}》</el-breadcrumb-item>
      <el-breadcrumb-item >课程公告</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
    <el-button type="primary " @click="add">添加公告</el-button>
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
        width="200"
        label="公告名称">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column
        label="发布人"
        prop="issuer"
        width="80" >
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="修改时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.announcementId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item label="发布人" prop="issuer">
        <el-input v-model="ruleForm.issuer"></el-input>
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
  export default {
    name: "announcement",
    data(){
      return{
        tableData:'',
        title:'',
        size:10,
        dialogFormVisible: false,
        loading:false,
        ruleForm: {
          announcementId:'',
          tutionId:'',
          title:'',
          content:'',
          issuer:"",
          _method:'put'
        },
        formLabelWidth: '120px',
        rules: {
          announcementId:[
            { required: true, message: '请输入公告ID', trigger: 'change' }
          ],
          tutionId:[
            { required: true, message: '请输入开课ID', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请输入公告标题', trigger: 'blur' },
            { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入公告内容', trigger: 'change' }
          ],
          issuer:[
            { required: true, message: '请输入发布人', trigger: 'change' }
          ],
        }
      }
    },
    mounted:function(){
      this.refresh(1,10);
    },
    methods:{
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {
        let that=this;
        that.loading=true;
        get("/announcement/tutionId?tution_id="+that.$store.state.tutionId).then(res=>{
          that.tableData=res.data;
          that.loading=false;
        })
      },
      //页面页码改变触发函数
      handleSizeChange:function (sizeChange) {
        this.size=sizeChange;
        this.refresh(1,this.size);
      },
      //当前页数改变
      handleCurrentChange:function (current) {
        this.refresh(current,this.size);
      },
      //删除单个课程
      deleteThis:function (id) {
        deleteOne('/announcement/'+id,'您确定删除该条课程？',this);
      },
      //改变公告
      change:function (value) {
        this.dialogFormVisible=true;
        this.ruleForm=value;
        this.ruleForm._method='put';
        this.title='修改公告';
      },
      //修改公告提交
      submitForm(formName) {
        let that=this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            delete that.ruleForm.pubdate;
              post('/announcement',that.ruleForm).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
          } else {
            return false;
          }
        });
      },
      //添加公告
      add:function () {
        this.dialogFormVisible=true;
        this.title='添加公告';
        this.ruleForm={
          "tutionId":this.$store.state.tutionId,
          "title":"",
          "content":"",
          "issuer":""
        }
      },
    },
    computed:{
      curriculumName:function () {
        return   this.$store.state.curriculum.name;
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
