<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/teacherLogin' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >信息管理</el-breadcrumb-item>
        <el-breadcrumb-item >课程管理</el-breadcrumb-item>
      </el-breadcrumb>
      <br><br>
      <el-button type="primary " @click="addCurriculun">添加课程</el-button>
      &nbsp;&nbsp;
      <br><br>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        v-loading="loadDialog"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          style="text-align: center"
          width="55">
        </el-table-column>
        <el-table-column
          width="110"
          label="课程名称">
          <template slot-scope="scope">{{ scope.row.curriculum[0].name }}</template>
        </el-table-column>
        <el-table-column
          label="略缩图"
          width="80" style="padding: 5px;">
          <template slot-scope="scope"><img  v-bind:src="scope.row.curriculum[0].picture" ALT="图片加载失败" style="width: 100%;"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="curriculum[0].mainTeacher"
          label="授课老师"
          width="200">
        </el-table-column>
        <el-table-column
          prop="curriculum[0].video"
          label="课程地址"
          width="200">
        </el-table-column>
        <el-table-column
          prop="curriculum[0].time"
          label="开课次数"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="评价"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="orange">评分：{{scope.row.curriculum[0].score}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="curriculum[0].scoring"
          label="评分标准"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="curriculum[0].require"
          label="合格要求"
          show-overflow-tooltip>
        </el-table-column>
          <el-table-column
          label="查询成绩"
          show-overflow-tooltip>
          <template slot-scope='scope'>
          	   <el-button @click="grade(scope.row)" type="text" size="small">查看成绩</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="320">
          <template slot-scope="scope">
            <el-button @click="curriculumGo(scope.row)" type="text" size="small">前往课程</el-button>
            <el-button @click="look(scope.row)" type="text" size="small">查看开课</el-button>
            <el-button @click="commentThis(scope.row)" type="text" size="small">查看评论</el-button>
            <el-button type="text" size="small" @click="changeVal(scope.row)">修改课程信息</el-button>
            <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.curriculum[0])">删除</el-button>
             <el-button type="text orange"  size="small"  @click="deleteddd(scope.row.curriculum[0])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-dialog title="选择授课教师" :visible.sync="dialogTableVisible">
        <el-input
          class="demo-input-suffix"
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
          v-model="searchThis"
          @keydown.native.13="teachSearch"
        ></el-input>
        <br><br>
        <el-table
          v-loading="loadDialog"
          ref="multipleTable"
          :data="teachList.list"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            style="text-align: center"
            width="55">
          </el-table-column>
          <el-table-column
            width="110"
            label="教师名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            label="教师图片"
            width="80" style="padding: 5px;">
            <template slot-scope="scope"><img  v-bind:src="scope.row.picture" ALT="图片加载失败" style="width: 100%;"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="教师职称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="intro"
            label="教师简介"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="showClass(scope.row)" type="text" size="small">选择此教师</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :page-sizes="[1, 2, 3]"
            :page-size="teachList.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="teachList.total">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import axios from "axios";
  import { get,deleteOne,post } from '~/static/js/api.js';
    export default {
      async asyncData (context){
        let [tableData,teachList] = await Promise.all([
          axios.get('http://localhost:3000/api/give/giveAndCurriculum?teacher_id='+context.store.state.adminName.teacherId),
          axios.get('http://localhost:3000/api/teacher/page?'+'pageNum='+1+'&pageSize='+3),
        ])
        return{
          tableData:tableData.data.data,
          teachList:teachList.data.data
        }
      },
      name: "curriculum",
      data(){
        return{
          dialogTableVisible:false,
          loadDialog:false,
          teachSize:3,
          tableData:{
            list:[]
          },
          classData:[],
          size:10,
          searchVal:'',
          searchTeach:'',
          searchThis:'',
          teachList:{
            list:[]
          },
        }
      },
      mounted:function(){
       this.refresh();
      },
      methods:{
      	grade:function(val){
      		 this.$store.commit('curriculumChange',val);
      		 this.$router.push("/teacherLogin/curriculum-grade");
      	},
      	
        //每次刷新教师
        teachRefresh:function (currentPage=1,pageSize=3) {
          let that=this;
         get('/teacher/page?'+'pageNum='+currentPage+'&pageSize='+pageSize).then(res=>{
            that.teachList=res.data;
          })
        },
         //每次事件调用页面刷新触发函数
         refresh:function () {
           let that=this;
           get('/give/giveAndCurriculum?teacher_id='+this.$store.state.adminName.teacherId).then(res=>{
             that.tableData=res.data;
           })
         },
        //页面页码改变触发函数
        handleSizeChange1:function (sizeChange) {
          if (this.searchTeach){
            this.teachSize=sizeChange;
            this.teachRefresh(1,this.teachSize);
          } else{
            this.teachSize=sizeChange;
            this.teachRefresh(1,sizeChange)
          }
        },
        //当前页数改变
        handleCurrentChange1:function (current) {
          if (this.searchTeach){
            this.teachRefresh(current,this.teachSize);
          } else{
            this.teachRefresh(current,this.teachSize);
          }
        },

        //根据课程名称模糊查询；
        search:function () {
           let that=this;
          get('/curriculum/name?currentPage=1&pageSize='+that.size+'&name='+that.searchVal).then(res=>{
            that.tableData=res.data;
          })
        },
        //跳转到编辑课程去
        change:function (val) {
          // this.$store.commit('curriculumIdChange',val.);
          this.$store.commit('curriculumChange',{
            'curriculumId':val.curriculumId,
            'name':val.name
          });
          this.$router.push('/teacherLogin/curriculum-chapter')
        },
        //添加课程
        add:function () {
          this.$store.commit('curriculumIdChange',0);
        },
        //查看开课信息
        look:function (val) {
          this.$store.commit('curriculumChange',val);
          this.$router.push("/teacherLogin/classTime")
        },
        //查看当前的品论
        commentThis:function (val) {
          this.$store.commit('curriculumChange',val);
          this.$router.push('/teacherLogin/comment')
        },
        //显示所有教师
        showTable:function (val) {
          this.dialogTableVisible=true;
          this.$store.commit('curriculumChange',val);
        },
        //搜索教师
        teachSearch:function (node,currentPage=1,size=3) {
          let that=this;
          if (that.searchThis.length!=0){
            that.searchTeach=that.searchThis;
            that.loading=true;
            get('/teacher/name?name='+that.searchTeach+'&currentPage='+currentPage+'&pageSize='+size).then(res=>{
              that.teachList=res.data;
              that.loading=false;
            })
          } else{
            that.teachRefresh(1,3);
          }
        },
        showClass:function (val) {
          let that = this;
          post("/insertGive?teacherId="+val.teacherId+"&curriculumId="+this.$store.state.curriculum.curriculumId,{
            "teacherId":val.teacherId,
            "curriculumId":this.$store.state.curriculum.curriculumId
          }).then(res=>{
            that.dialogTableVisible=false;
            that.refresh();
          })
        },
        addCurriculun:function () {
          this.$router.push('/teacherLogin/curriculum-add')
        },
        //修改课程信息
        changeVal:function (val) {
          this.$store.commit('curriculumChange',val);
          this.$router.push("/teacherLogin/curriculum-change")
        },
        curriculumGo:function (val) {
          this.$store.commit('curriculumChange',{
            curriculumId:val.curriculum[0].curriculumId,
            name:val.curriculum[0].name
          })
          this.$router.push('/teacherLogin/curriculum-chapter');
        },
        deleteThis:function(id){
        	deleteOne("/deleteByidGive/"+id.giveId,'您确定删除该授课？',this)
        }
        deleteddd:fuction(id){
        	console.log(id)
        }
        
      },
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
