<template>
  <div>
    <br>
    <!--@selection-change="handleSelectionChange"-->
    <el-button type="success" icon="el-icon-refresh" circle @click="refresh(1,10)"></el-button>
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
        label="题目">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column
        label="题干"
        prop="stems"
      >
      </el-table-column>
      <el-table-column
        label="成绩"
        prop="performance"
      >
      </el-table-column>
      <el-table-column
        label="回答时间"
        prop="addtime"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.performanceId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        v-if="!searchVal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.currentPage+1"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalNum">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="成绩" prop="performance">
          <el-input v-model="ruleForm.performance"></el-input>
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
      return axios.get('http://localhost:3000/api/performance/userId/'+context.store.state.user.userId+'?currentPage=1&pageSize=10').then(res=>{
        return{
          tableData:res.data.data
        }
      })
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
          performance:'',
          performanceId :''
        },
        formLabelWidth: '120px',
        rules: {
          answer:[
            { required: true, message: '请输入成绩', trigger: 'change' }
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
        get('/performance/userId/'+that.$store.state.user.userId+'?currentPage='+currentPage+'&pageSize='+pageSize).then(res=>{
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
        deleteOne('/performance/'+id,'您确定删除该条成绩？',this);
      },
      //改变公告
      change:function (val) {
//    	this.ruleForm=val; 
//      this.dialogFormVisible=true;
      },
      //修改成绩提交
      submitForm(formName) {
        let that=this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            let val={
              "performanceId":that.ruleForm.performanceId,
              "performance":that.ruleForm.performance,
              "_method":"put"
            }
            post('/performance',val).then(res=>{
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
