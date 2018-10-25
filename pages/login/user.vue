<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >用户管理</el-breadcrumb-item>
      <el-breadcrumb-item >管理普通用户</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
    <el-button type="success" icon="el-icon-refresh" circle @click="refresh(1,10)"></el-button> &nbsp;&nbsp;
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
        width="200"
        label="用户名">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column
        label="微信号"
        prop="wechat"
        >
      </el-table-column>
      <el-table-column
        prop="password"
        label="密码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电子邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="qq"
        label="QQ号"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="grade(scope.row)">查看成绩</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.userId)">删除</el-button>
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
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="ruleForm.qq"></el-input>
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
    asyncData(){
      return axios.get('http://localhost:3000/api/getUserAll/?page=1&rows=10').then(res=>{
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
          userName:'',
          phone:'',
          email:"",
          qq:''
        },
        formLabelWidth: '120px',
        rules: {
          userName:[
            { required: true, message: '请输入用户名', trigger: 'change' }
          ],
          phone:[
            { required: true, message: '请输入用户电话', trigger: 'change' }
          ],
          email: [
            { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          ],
          qq: [
            { required: true, message: '请输入用户QQ', trigger: 'change' }
          ],
        }
      }
    },
    mounted:function(){
      // this.refresh(1,10);
    },
    methods:{
      grade:function(value){
        this.$store.commit('userChange',{
          "userId":value.userId,
          "name":value.userName
        })
        this.$router.push("/login/grade")
      },
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {
        let that=this;
        that.loading=true;
        get('/getUserAll?'+'page='+currentPage+'&rows='+pageSize).then(res=>{
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
      //删除单个用户
      deleteThis:function (id) {
        deleteOne('/user/deleteUser/'+id,'您确定删除该条课程？',this);
      },
      //修改用户信息
      change:function (value) {
        this.dialogFormVisible=true;
        this.ruleForm=value;
        this.ruleForm._method='put';
        this.title='修改公告';
      },
      //修改公告提交
      submitForm(formName) {
        let that=this;
        let config = {
          headers:{'Content-Type':'application/json;charset=UTF-8'}
        };
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.title=='添加用户'){
              axios.post("/insertUser",JSON.stringify(that.ruleForm),config).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
            }else{
              that.ruleForm={
                "userName":that.ruleForm.userName,
                "userId":that.ruleForm.userId,
                "email":that.ruleForm.email,
                "phone":that.ruleForm.phone,
                "email":that.ruleForm.email ,
                "qq":that.ruleForm.qq
              }
              post("/user/updateUser",that.ruleForm).then(res=>{
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
      //添加公告
      add:function () {
        this.dialogFormVisible=true;
        this.title='添加用户';
        this.ruleForm={
          userName:'',
          phone:'',
          email:"",
          qq:''
        }
      },
      //搜索
      search:function () {
        let that=this;
        that.searchVal=that.searchThis;
        if (that.searchVal!=''){
          that.loading=true;
          get("/getFuzzyqueryUser?name="+that.searchVal).then(res=>{
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
