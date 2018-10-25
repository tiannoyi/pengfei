<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item >学校管理</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
    <el-button type="primary " @click="add">添加学校</el-button>
    &nbsp;&nbsp;
    <el-input
      class="demo-input-suffix"
      placeholder="请输入内容"
      suffix-icon="el-icon-search"
      v-model="searchThis"
      @keydown.native.13="search"
    ></el-input>
    <br><br>
    <!--@selection-change="handleSelectionChange"-->
    <el-table
      ref="multipleTable"
      :data="tableData.list"
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
        label="学校名称">
        <template slot-scope="scope">{{ scope.row.schoolName }}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.universityId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block">
      <el-pagination
        v-if="!searchVal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.prePage+1"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="ruleForm.schoolName"></el-input>
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
  import axios from "axios";
  import { get,deleteOne,post } from '~/static/js/api.js';
  export default {
    name: "announcement",
    asyncData (){
      return axios.get('http://localhost:3000/api/getSchoolAll?currentPage=1&pageSize=10').then(res=>{
        return{
          tableData:res.data.data
        }
      })
    },
    data(){
      return{
        tableData:'',
        title:'',
        size:10,
        dialogFormVisible: false,
        loading:false,
        searchVal:'',
        searchThis:'',
        ruleForm: {
          schoolName:''
        },
        formLabelWidth: '120px',
        rules: {
          schoolName:[
            { required: true, message: '请输入学校名称', trigger: 'change' }
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
        get('/getSchoolAll?'+'currentPage='+currentPage+'&pageSize='+pageSize).then(res=>{
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
        deleteOne('/deleteSchool?id='+id,'您确定删除该学校？',this);
      },
      //改变公告
      change:function (value) {
        this.dialogFormVisible=true;
        this.ruleForm=value;
        this.ruleForm._method='put';
        this.title='修改公告';
      },
      //修学校提交
      submitForm(formName) {
        let that=this;
        let config = {
          headers:{'Content-Type':'application/json;charset=UTF-8'}
        };
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.title=='添加学校'){
              axios.post("/insertSchool",JSON.stringify(that.ruleForm),config).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
            }else{
              axios.put("/updateSchool",JSON.stringify(that.ruleForm),config).then(res=>{
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
      //添加学校
      add:function () {
        this.dialogFormVisible=true;
        this.title='添加学校';
        this.ruleForm={
          schoolName:'',
        }
      },
      //搜索
      search:function () {
        let that=this;
        that.searchVal=that.searchThis;
        if (that.searchVal!=''){
          that.loading=true;
          get("/getFuzzyquerySchool?name="+that.searchVal).then(res=>{
            that.tableData.list=res.data;
            that.loading=false;
          })
        } else{
          that.refresh()
        }
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
