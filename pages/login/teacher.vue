<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >管理用户</el-breadcrumb-item>
      <el-breadcrumb-item >管理教师</el-breadcrumb-item>
    </el-breadcrumb>
    <br><br>
    <el-button type="success" icon="el-icon-refresh" circle @click="refresh(1,10)"></el-button>
    <el-button type="primary " @click="addTeacher">添加教师</el-button>
    &nbsp;&nbsp;
    <el-input
      class="demo-input-suffix"
      placeholder="请输入内容"
      suffix-icon="el-icon-search"
      v-model="searchThis"
      @keydown.native.13="search"
    ></el-input>
    <br><br>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData.list"
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
          <el-button @click="showClass(scope.row)" type="text" size="small">查看授课信息</el-button>
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.teacherId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block" v-if="!searchVal">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </div>
    <div class="block" v-if="searchVal">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.prePage+1"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalNum">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="teachData"  ref="teachData" label-width="150px" label-position="right" class="demo-ruleForm">
        <el-form-item label="教师名称：" prop="videoName">
          <el-input v-model="teachData.name"></el-input>
        </el-form-item>
        <el-form-item label="教师职称：" prop="videoDuration">
          <el-input v-model="teachData.title"></el-input>
        </el-form-item>
        <el-form-item label="教师简介：" prop="videoDuration">
          <el-input v-model="teachData.intro"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="http://www.tiannoyi.com/video/teacher/update"
            :data="teachData"
            accept="image/*"
            :on-success="subSuc"
            :limit=1
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="teachADD">修改教师（不上传头像）</el-button>
            <div slot="tip" class="el-upload__tip">只能上图片文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="teachName+'的授课信息'" :visible.sync="dialogTableVisible">
      <el-table
        ref="multipleTable"
        :data="classData"
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
            <!--<i class="el-icon-star-on orange" v-if="scope.row.score!=undefined"  v-for="n in scope.row.score" v-bind:key="n" ></i>-->
            <!--<i class="el-icon-star-on wirte" v-if="scope.row.score!=undefined"  v-for="n in (5-scope.row.score)" v-bind:key="n" ></i>-->

            <!--<br>-->
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
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="curriculumGo(scope.row)" type="text" size="small">前往课程</el-button>
            <el-button type="text orange"  size="small"  @click="deleteCurriculum(scope.row.curriculum[0].curriculumId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import { get,deleteOne,post } from '~/static/js/api.js';
  export default {
    name: "teacher",
    async asyncData (){
      let [tableData,] = await Promise.all([
        axios.get('http://localhost:3000/api/teacher/page?'+'pageNum='+1+'&pageSize='+10),
      ])
      return{
        tableData:tableData.data.data,
      }
    },
    data(){
      return{
        dialogFormVisible:false,
        dialogTableVisible:false,
        loadDialog:false,
        loading:false,
        title:'修改教师',
        tableData:{
          list:[]
        },
        classData:[

        ],
        size:10,
        searchVal:'',
        searchThis:'',
        currentPage:'1',
        teachData:{
          teacherId:'',
          name:'',
          title:'',
          intro:'',
        },
        teachName:'未选择'
      }
    },
    mounted:function(){

    },
    methods:{
      //每次事件调用页面刷新触发函数
      refresh:function (currentPage=1,pageSize=10) {

        let that=this;
        that.loading=true;
        get('/teacher/page?'+'pageNum='+currentPage+'&pageSize='+pageSize).then(res=>{
          that.tableData=res.data;
          that.loading=false;
        })
      },
      //页面页码改变触发函数
      handleSizeChange:function (sizeChange) {
        if (this.searchThis.length==0){
          this.size=sizeChange;
          this.refresh(1,sizeChange);
        } else{
          this.size=sizeChange;
          this.search(1,sizeChange)
        }
      },
      //当前页数改变
      handleCurrentChange:function (current) {
        if (this.searchThis.length==0){
          this.refresh(current,this.size);
        } else{
          this.currentPage=current;
          this.search(current,this.size)
        }
      },
      //删除单个课程
      deleteThis:function (id) {
        deleteOne('/teacher/'+id,'您确定删除该条课程？',this);
      },
      //根据课程名称模糊查询；
      search:function (context,currentPage=1,size=10) {
        let that=this;
        that.searchVal=that.searchThis;
        if (that.searchVal.length!=0){
          that.loading=true;
          get('/teacher/name?name='+that.searchVal+'&currentPage='+currentPage+'&pageSize='+size).then(res=>{
            that.tableData=res.data;
            that.loading=false;
          })
        } else{
          that.refresh(1,10)
        }
      },
      //将修改的数据添加到服务器上去
      submitUpload() {
        if (this.teachData.teacherId!=''){
          this.$refs.upload.submit();
        }else{
          this.$message.error('提交错误');
        }
      },
      //教师修改
      change:function(val){
        this.dialogFormVisible=true;
        this.teachData.teacherId=val.teacherId;
        this.teachData.name=val.name;
        this.teachData.title=val.title;
        this.teachData.intro=val.intro;
      },
      //修改成功之后的回调函数
      subSuc:function () {
        this.dialogFormVisible=false;
        this.refresh(1,10);
      },
      //跳转到添加教师页面
      addTeacher:function () {
        this.$router.push('/login/teachAdd');
      },
      //查看授课信息
      showClass:function (val) {
        let that=this;
        that.teachName=val.name;
        that.loadData=true;
        that.dialogTableVisible=true
        get('/give/giveAndCurriculum?teacher_id='+val.teacherId).then(res=>{
          that.classData=res.data;
          that.loadData=false;
        })
      },
      //前往课程界面
      curriculumGo:function (val) {
        this.$store.commit('curriculumChange',{
          curriculumId:val.curriculum[0].curriculumId,
          name:val.curriculum[0].name
        })
        this.$router.push('/login/curriculum-chapter');
      },
      //前往删除当前页面
      deleteCurriculum:function (val) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/deleteByidGive/'+val).then(res=>{
            this.$message({
              message: res.message,
              type: res.state.toLowerCase()
            });
          })
        }).catch(() => {
          this.$message({
            type: 'fail',
            message: '已取消删除'
          });
        });
      },
      teachADD:function () {
        let that=this;
        post("/teacher/update",that.teachData).then(res=>{
          that.$message({
            type: res.state,
            message: res.message
          });
          that.refresh();
          that.dialogFormVisible=false;
        })
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
