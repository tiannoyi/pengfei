<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item >学校管理</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
    <el-button type="primary " @click="add">添加角色</el-button>
    &nbsp;&nbsp;
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
        label="权限名称">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.roleId)">删除</el-button>
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
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <!--<el-tree-->
            <!--:data="newList"-->
            <!--show-checkbox-->
            <!--default-expand-all-->
            <!--node-key="id"-->
            <!--ref="tree"-->
            <!--highlight-current-->
            <!--:props="defaultProps">-->
          <!--</el-tree>-->
          <el-table
            ref="multipleTable"
            :data="roleList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="权限名"
              width="120">
              <template slot-scope="scope">{{ scope.row.permissionName }}</template>
            </el-table-column>
          </el-table>
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
    async asyncData (){
      let [admin, permissions] = await Promise.all([
        axios.get('http://localhost:3000/api/roles?pageNum=1&pageSize=100'),
        axios.get('http://localhost:3000/api/permissions?pageNum=1&pageSize=100')
      ])
      return{
        tableData: admin.data.data,
        roleList: permissions.data.data.list
      }
    },
    data(){
      return{
        tableData:'',
        title:'',
        size:10,
        dialogFormVisible: false,
        loading:false,
        ruleForm: {
          roleName:'',
          roleId:'',
          state:'0'
        },
        formLabelWidth: '120px',
        rules: {
          roleName:[
            { required: true, message: '请输入角色名', trigger: 'change' }
          ],
        },
        multipleSelection:''
      }
    },
    methods:{
      handleSelectionChange(val) {
        this.multipleSelection = val;
        let value='1';
        for (let num in this.multipleSelection){
          if (num!=1){
            value=value+','+this.multipleSelection[num].permissionId;
          }
        }
        this.multipleSelection=value;
      },
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {
        let that=this;
        that.loading=true;
        get('/roles?'+'currentPage='+currentPage+'&pageSize='+pageSize).then(res=>{
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
        deleteOne('/roles/'+id,'您确定删除该角色？',this);
      },
      //改变公告
      change:function (value) {
        this.dialogFormVisible=true;
        this.ruleForm=value;
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
              let value={
                'roleName':that.ruleForm.roleName,
                "state": "1",
                "permissionsStr":that.multipleSelection
              }
              axios.post("/roles",JSON.stringify(value),config).then(res=>{
                that.dialogFormVisible=false;
                that.refresh();
                that.$notify({
                  title: '成功',
                  message: res.message,
                  type: 'success'
                });
              })
            }else{
              let value={
                'roleName':that.ruleForm.roleName,
                "state": "1",
                "permissionsStr":that.multipleSelection
              }
              axios.put("/roles/"+that.ruleForm.roleId,JSON.stringify(value),config).then(res=>{
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
