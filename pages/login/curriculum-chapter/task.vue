<template>
  <div>
    <el-button type="primary " @click="add">添加作业</el-button>
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
        label="题目">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column
        label="题干"
        prop="stems"
      >
      </el-table-column>
      <el-table-column
        label="选项A"
        prop="optionA"
      >
      </el-table-column>
      <el-table-column
        label="选项B"
        prop="optionB"
      >
      </el-table-column>
      <el-table-column
        label="选项C"
        prop="optionC"
      >
      </el-table-column>
      <el-table-column
        label="选项D"
        prop="optionD"
      >
      </el-table-column>
      <el-table-column
        label="题干"
        prop="stems"
      >
      </el-table-column>
      <el-table-column
        label="答案"
        prop="answer"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.taskId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="题干" prop="stems">
          <el-input v-model="ruleForm.stems"></el-input>
        </el-form-item>
        <el-form-item label="选项A" prop="optionA">
          <el-input v-model="ruleForm.optionA"></el-input>
        </el-form-item>
        <el-form-item label="选项B" prop="optionB">
          <el-input v-model="ruleForm.optionB"></el-input>
        </el-form-item>
        <el-form-item label="选项C" prop="optionC">
          <el-input v-model="ruleForm.optionC"></el-input>
        </el-form-item>
        <el-form-item label="选项D" prop="optionD">
          <el-input v-model="ruleForm.optionD"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="ruleForm.answer"></el-input>
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
      return axios.get('http://localhost:3000/api/task/knowledgeId?knowledge_id='+context.store.state.knowledge.knowledgeId).then(res=>{
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
          answer:'',
          knowledgeId :'',
          optionD:'',
          optionC:'',
          optionB:"",
          optionA:'',
          stems:"",
          title:''
        },
        formLabelWidth: '120px',
        rules: {
          answer:[
            { required: true, message: '请输入答案', trigger: 'change' }
          ],
          title:[
            { required: true, message: '请输入标题', trigger: 'change' }
          ],
          stems: [
            { required: true, message: '请输入题干', trigger: 'blur' },
            { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
          ],
          optionA: [
            { required: true, message: '请输入选项a', trigger: 'change' }
          ]
          ,
          optionB: [
            { required: true, message: '请输入选项B', trigger: 'change' }
          ]
          ,
          optionC: [
            { required: true, message: '请输入选项C', trigger: 'change' }
          ]
          ,
          optionD: [
            { required: true, message: '请输入选项D', trigger: 'change' }
          ],
          answer: [
            { required: true, message: '请输入答案', trigger: 'change' }
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
        get('task/knowledgeId?knowledge_id='+that.$store.state.knowledge.knowledgeId).then(res=>{
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
        deleteOne('/task/'+id,'您确定删除该条作业？',this);
      },
      //改变公告
      change:function (val) {
        this.dialogFormVisible=true;
        this.ruleForm.taskId=val.taskId;
        this.ruleForm.title=val.title;
        this.ruleForm.stems=val.stems;
        this.ruleForm.optionA=val.optionA;
        this.ruleForm.optionB=val.optionB;
        this.ruleForm.optionC=val.optionC;
        this.ruleForm.optionD=val.optionD;
        this.ruleForm.answer=val.answer;
        this.ruleForm.knowledgeId=val.knowledgeId;
        this.ruleForm._method='put';
        this.title='修改公告';
      },
      //修改公告提交
      submitForm(formName) {
        let that=this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
              post('/task',that.ruleForm).then(res=>{
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
      //添加作业
      add:function () {
        this.title='添加作业';
        this.dialogFormVisible=true;
        this.ruleForm={
          answer:'',
          knowledgeId :'',
          optionD:'',
          optionC:'',
          optionB:"",
          optionA:'',
          stems:"",
          title:''
        };
        this.ruleForm.knowledgeId=this.$store.state.knowledge.knowledgeId;
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
