<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >信息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/login/curriculum' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item >开课信息管理( {{curriculumName}} )</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <br>
    <el-button type="primary " @click="newAdd" >添加开课信息</el-button>
    <br><br>
    <el-table
      ref="multipleTable"
      :data="tableData.list"
      tooltip-effect="dark"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        style="text-align: center"
        width="55">
      </el-table-column>
      <el-table-column
        width="110"
        label="参与人数">
        <template slot-scope="scope">{{ scope.row.population }}</template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开课时间">
      </el-table-column>
      <el-table-column
        prop="endtime"
        label="结束时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="开课状态"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==0" style='background-color: rgba(255, 0, 0, .1);'>未开课</el-tag>
          <el-tag type="warning" v-if="scope.row.status==1" style='background-color: rgba(0, 255, 0,)'>即将开课</el-tag>
          <el-tag type="warning" v-if="scope.row.status==2" style='background-color: #80DC17;'>开课中</el-tag>
          <el-tag type="warning" v-if="scope.row.status==3" style='background-color: #E6E6E6;'>已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="schedules"
        label="课程安排"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toAnnouncement(scope.row)">公告管理</el-button>
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.tutionId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalNum">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="tution" :rules="rules" ref="tution" label-width="100px" class="demo-ruleForm">
        <el-form-item label="开课时间：">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开课状态：">
          <!--tution.status-->
          <el-select v-model="tution.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课时安排：">
          <el-input v-model="tution.schedules"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(tution)">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios';
  import { get,deleteOne,post } from '~/static/js/api.js';
  export default {
    name: "classTime",
    // asyncData(context){
    //   return axios.get('http://localhost:3000/api/tution/curriculum_id?currentPage=1&pageSize=10&curriculum_id='+context.store.state.curriculum.curriculumId).then(res=>{
    //     if (res.data.state=="SUCCESS"){
    //       return{
    //         tableData:res.data.data,
    //         loading:false
    //       }
    //     }else{
    //       alert("请从开课页面进入该页面")
    //       context.route.push('/login/curriculum');
    //     }
    //   }).catch(error=>{
    //     alert("请从开课页面进入该页面")
    //     context.route.push('/login/curriculum');
    //   })
    // },
    data(){
      return{
        options: [{
          value: 0,
          label: '未开课'
        }, {
          value: 1,
          label: '即将开课'
        }, {
          value: 2,
          label: '开课中'
        }, {
          value: 3,
          label: '已结束'
        }],
        loading:false,
        dialogFormVisible:false,
        add:'',
        title:'',
        tableData:{
          list:[]
        },
        size:10,
        tution_id:'',
        searchVal:'',
        time:'',
        tution:{
          curriculumId:'',
          schedules:'',

          status:0,
          startTime:'',
          endtime:''
        },
        rules: {
          schedules: [
            { required: true, message: '请输入课时安排', trigger: 'blur' }
          ],

          status: [
            { required: true, message: '请选择当前状态', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],

        },
      }
    },
    mounted:function(){
      this.refresh();
    },
    methods:{
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {
        let that=this;
        that.loading=true;
        get("/tution/curriculum_id?currentPage="+currentPage+"&pageSize="+pageSize+"&curriculum_id="+ that.$store.state.curriculum.curriculumId).then(res=>{
          if (res.state=="SUCCESS"){
            that.tableData=res.data
            that.loading=false;
          }else{
            that.$alert('您打开页面的方式不正确', '查询失败', {
              confirmButtonText: '确定',
              callback: action => {
                that.$router.push('/login/curriculum');
              }
            });
          }
        }).catch(error=>{
          that.$alert('您打开页面的方式不正确', '查询失败', {
            confirmButtonText: '确定',
            callback: action => {
              that.$router.push('/login/curriculum');
            }
          });
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
      //删除单个开课信息
      deleteThis:function (id) {
        deleteOne('/tution/'+id,'您确定删除该条记开课记录？',this);
      },
      //编辑当前的开课信息
      change:function (val) {
        this.tution.curriculumId=this.$store.state.curriculum.curriculumId;
        this.tution_id=val.tutionId;
        this.title='修改当前信息';
        this.dialogFormVisible=true;
        this.time=[val.startTime,val.endtime];
        this.tution=val;
        this.tution._method='put';
      },
      //添加开课信息
      newAdd:function () {
        this.dialogFormVisible=true;
        this.title="创建开课信息";
        this.tution={
          curriculumId:'',
          schedules:'',
          population:'',
          status:0,
          startTime:'',
          endtime:''
        };
        this.tution.curriculumId=this.$store.state.curriculum.curriculumId;
      },
      //提交开课信息
      submitForm:function (formName) {
        let that=this;
        if (that.title=='创建开课信息'){
          that.tution.startTime=that.date(that.time[0]);
          that.tution.endtime=that.date(that.time[1]);
          post("/tution",that.tution).then(res=>{
            that.dialogFormVisible=false;
            that.$notify({
              title: '成功',
              message: res.message,
              type: res.state.toLowerCase()
            });
            that.refresh();
          })
        } else{
          that.tution.startTime=that.date(that.time[0]);
          that.tution.endtime=that.date(that.time[1]);
          post("/tution/"+that.tution_id,that.tution).then(res=>{
            that.$notify({
              title: '成功',
              message: res.message,
              type: res.state.toLowerCase()
            });
            that.dialogFormVisible=false;
            that.refresh();
          })
        }
      },
      //转化日期格式
      date:function (time) {
        var date = new Date(time);
        return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
      },
      //前往公告页面
      toAnnouncement:function (val) {
        this.$store.commit('tutionIdChange',val.tutionId);
        this.$router.push('/login/announcement')
      }
    },
    computed:{
      curriculumName:function () {
        return this.$store.state.curriculum.name
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
