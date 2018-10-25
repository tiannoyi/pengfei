<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item >管理员账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
    <el-button type="primary " @click="add">添加管理员</el-button>
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
        label="管理员账户名">
        <template slot-scope="scope">{{ scope.row.adminName }}</template>
      </el-table-column>
      <el-table-column
        prop="password"
        label="管理员密码">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="管理员手机号">
      </el-table-column>
      <el-table-column
        prop="role.roleName"
        label="管理权限">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.adminId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pages"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.size">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户ID" prop="adminName" v-if="title!='修改管理员'">
          <el-input v-model="ruleForm.adminId"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="adminName">
          <el-input v-model="ruleForm.adminName"></el-input>
        </el-form-item>
        <el-form-item label="账户密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="账户手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="adminName">
          <el-select v-model="ruleForm.roleId" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
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
    name: "admin",
    async asyncData (){
      let [admin, role] = await Promise.all([
        axios.get('http://localhost:3000/api/admins?currentPage=1&pageSize=10'),
          axios.get('http://localhost:3000/api/roles?pageNum=1&pageSize=50')
      ])
      return{
        tableData: admin.data.data,
        roleList: role.data.data.list
      }
    },
    data(){
      return{
        tableData:{
          list:[]
        },
        title:'',
        size:10,
        dialogFormVisible: false,
        loading:false,
        ruleForm: {
          adminName:'',
          phone:'',
          password:'',
          roleId:'',
          adminId:''
        },
        formLabelWidth: '120px',
        rules: {
          adminName:[
            { required: true, message: '请输入管理员账户名', trigger: 'change' }
          ],
          phone:[
            { required: true, message: '请输入手机号', trigger: 'change' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'change' }
          ],
          roleId:[
            { required: true, message: '请选择类别号', trigger: 'change' }
          ],
          adminId:[
            { required: true, message: '请输入管理员ID', trigger: 'change' }
          ],
        }
      }
    },
    mounted:function(){

    },
    methods:{
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {
        let that=this;
        that.loading=true;
        get('/admins?'+'currentPage='+currentPage+'&pageSize='+pageSize).then(res=>{
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
      //删除单个管理员
      deleteThis:function (id) {
        deleteOne('/admins/'+id,'您确定删除该管理员（永久）？',this);
      },
      //改变管理员
      change:function (value) {
        this.dialogFormVisible=true;
        this.ruleForm={
          "adminId":value.adminId,
          "adminName":value.adminName,
          "phone":value.phone,
          "password":value.phone,
          "roleId":value.roleId,
        };
        this.title='修改管理员';
      },
      //更改管理员提交
      submitForm(formName) {
        let that=this;
        let config = {
          headers:{'Content-Type':'application/json;charset=UTF-8'}
        };
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.title=='添加管理员'){
              let id =that.ruleForm.adminId;
              delete that.ruleForm.adminId;
              axios.post("/admins",JSON.stringify(that.ruleForm),config).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
            }else{
              axios.put("/admins/"+that.ruleForm.adminId,JSON.stringify(that.ruleForm),config).then(res=>{
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
        this.title='添加管理员';
        this.ruleForm={
          adminName:'',
          phone:'',
          password:'',
          roleId:'',
          salt:'',
          adminId:''
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
