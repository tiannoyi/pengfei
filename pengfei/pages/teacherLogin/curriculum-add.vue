<template>
  <div class="container">
    <div class="right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item >系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/login/curriculum' }">课程管理</el-breadcrumb-item>
        <el-breadcrumb-item >课程添加</el-breadcrumb-item>
      </el-breadcrumb>
      <br>
      <div class="type-container">
        <br>
        <br>
        <div class="type-form" >
          <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" label-position="right" class="demo-ruleForm">
            <el-form-item label="课程名称：" >
              <el-input placeholder="请输入课程名称" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="学校名：" @click="selectUniversity">
              <span>当前所选学校：{{universityName}}</span>
              <el-button type="text"  size="small"  @click="selectUniversity">点击选择学校</el-button>
            </el-form-item>
            <el-form-item label="课程类别名：" @click="selectUniversity">
              <span>当前所选课程类别：{{ctName}}</span>
              <el-button type="text"  size="small"  @click="selectCT">点击选择学校</el-button>
            </el-form-item>
            <el-form-item label='是否为系统封面'>
              <el-switch v-model="ruleForm.ismainpic"></el-switch>
            </el-form-item>
            <el-form-item label="请输入负责老师：" >
              <el-input placeholder="请输入课程负责老师名称" v-model="ruleForm.mainTeacher"></el-input>
            </el-form-item>
            <el-form-item label="课程介绍：" >
              <el-input type="textarea" v-model="ruleForm.introduce"></el-input>
            </el-form-item>
            <el-form-item label="课程寄语：" >
              <el-input type="textarea" v-model="ruleForm.message"></el-input>
            </el-form-item>
            <el-form-item label="预备知识："  >
            <el-input type="textarea" v-model="ruleForm.propaedeutics"></el-input>
          </el-form-item>
            <el-form-item label="合格要求："  >
              <el-input type="textarea" v-model="ruleForm.require"></el-input>
            </el-form-item>
            <el-form-item label="评分标准："  >
              <el-input type="textarea" v-model="ruleForm.scoring"></el-input>
            </el-form-item>
            <el-form-item label="上传新课程：" >
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://www.tiannoyi.com/video/curriculum"
                :data="ruleForm"
                accept="*.image"
                :on-success="success"
                name="picture"
                :limit=1
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上视频文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog title="请选择封面图片" :visible.sync="dialogVideo">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="curriculumUrl"
        :data="ruleForm"
        accept="*.image"
        :on-success="successVideo"
        name="video"
        :limit=1
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitVideo">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上视频文件</div>
      </el-upload>
    </el-dialog>
    <el-dialog title="请选择学校" :visible.sync="dialogUniversity">
      <el-input
        class="demo-input-suffix"
        placeholder="请输入内容"
        suffix-icon="el-icon-search"
        v-model="searchThis"
        @keydown.native.13="searchUniversity"
      ></el-input>
      <br>
      <!--@selection-change="handleSelectionChange"-->
      <el-table
        ref="multipleTable"
        :data="universityList.list"
        v-loading="loadUniversity"
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
            <el-button type="text"  size="small" @click="UniversityF(scope.row)">选择此学校</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div class="block">
        <el-pagination
          v-if="!searchVal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="universityList.pageNum"
          :page-sizes="[3,5,10]"
          :page-size="universityList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="universityList.total">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="请选择课程所属类别" :visible.sync="dialogCT">
      <el-input
        class="demo-input-suffix"
        placeholder="请输入内容"
        suffix-icon="el-icon-search"
        v-model="searchThisCT"
        @keydown.native.13="searchCT"
      ></el-input>
      <br><br>
      <!--@selection-change="handleSelectionChange"-->
      <el-table
        ref="multipleTable"
        :data="courseTypeList.list"
        v-loading="loadCT"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          style="text-align: center"
          width="55">
        </el-table-column>
        <el-table-column
          width="80"
          label="头像">
          <template slot-scope="scope">
            <img  v-bind:src="scope.row.picture" ALT="图片加载失败" style="width: 100%;"/>
          </template>
        </el-table-column>
        <el-table-column
          label="类别名">
          <template slot-scope="scope">{{ scope.row.ctName }}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="CTF(scope.row)">选择此类别</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div class="block">
        <el-pagination
          v-if="!searchValCT"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="courseTypeList.currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="courseTypeList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="courseTypeList.totalNum">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { get,post } from "../../static/js/api";
  import axios from 'axios'
  export default {
    name: "setting",
    async asyncData(){
      let [courseType,universityList] = await Promise.all([
        axios.get('http://localhost:3000/api/courseType/CourseTypePage?currentPage=1&pageSize=3'),
        axios.get("http://localhost:3000/api/getSchoolAll?currentPage=1&pageSize=3"),
      ])
      return{
        courseTypeList:courseType.data.data,
        universityList:universityList.data.data
      }
    },
    data(){
      return{
        size:3,
        header:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        dialogUniversity:false,
        dialogCT:false,
        dialogVideo:false,
        loadCT:false,
        loadUniversity:false,
        searchVal:'',
        searchValCT:'',
        searchThis:'',
        searchThisCT:'',
        universityName:'',
        ctName:'',
        props1: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        curriculumUrl:'',
        ruleForm: {
          universityId:'',
          ctId:'',
          name:'',
          introduce:'',
          message:'',
          propaedeutics:'',
          meferences:'',
          require:'',
          scoring:'',
          ismainpic:false,
          mainTeacher:'',
          _method:''
        }
      }
    },
    methods:{
      //选择学校
      selectUniversity:function () {
        this.dialogUniversity=true;
      },
      //选择课程类别
      selectCT:function(){
        this.dialogCT=true;
      },
      //分页查询所有的学校
      refreshUniversity:function (currentPage=1,pageSize=3) {
        let that=this;
        that.loadUniversity=true;
        get('/getSchoolAll?'+'currentPage='+currentPage+'&pageSize='+pageSize).then(res=>{
          that.universityList=res.data;
          that.loadUniversity=false;
        })
      },
      //分页查询所有的课程类别
      refreshCT:function (currentPage=1,pageSize=3) {
        let that=this;
        that.loadCT=true;
        get('/courseType/CourseTypePage?currentPage='+currentPage+'&pageSize='+pageSize).then(res=>{
          that.courseTypeList=res.data;
          that.loadCT=false;
        })
      }
      ,
      searchUniversity:function () {
        let that=this;
        that.searchVal=that.searchThis;
        if (that.searchVal!=''){
          that.loadUniversity=true;
          get("/getFuzzyquerySchool?name="+that.searchVal).then(res=>{
            that.universityList.list=res.data;
            that.loadUniversity=false;
          })
        } else{
          that.refreshUniversity()
        }
      },
      searchCT:function(){
        let that=this;
        that.searchValCT=that.searchThisCT;
        if (that.searchValCT.length!=0){
          that.loadCT=true;
          get("/getFuzzyqueryCoures?name="+that.searchValCT).then(res=>{
            that.courseTypeList.list=res.data;
            that.loadCT=false;
          })
        } else{
          that.refreshCT()
        }
      },
      handleSizeChange:function (sizeChange) {
        this.size=sizeChange;
        this.refreshUniversity(1,this.size);
      },
      //当前页数改变
      handleCurrentChange:function (current) {
        this.refreshUniversity(current,this.size);
      },
      UniversityF:function (val) {
        this.dialogUniversity=false;
        this.universityName=val.schoolName;
        this.ruleForm.universityId=val.universityId;
      },
      CTF:function (val) {
        this.dialogCT=false;
        this.ruleForm.ctId=val.ctId
        this.ctName=val.ctName
      },
      submitUpload:function () {
        if (this.ruleForm._method){
          delete  this.ruleForm._method;
        }
        this.$refs.upload.submit();
      },
      submitVideo:function(){
        this.$refs.upload.submit();
      },
      //上传成功的回调函数
      success:function (res) {
         this.curriculumUrl="http://www.tiannoyi.com/video/curriculum/"+ res.data.curriculumId;
         this.ruleForm._method='put';
         this.dialogVideo=true;
         post('http://www.tiannoyi.com/video/insertGive?teacherId='+this.$store.state.adminName.teacherId+'&curriculumId='+res.data.curriculumId).then(res=>{
           this.$notify({
             title: '成功',
             message: '授课添加成功',
             type: 'success'
           });
         })
      },
      successVideo:function () {
       this.dialogVideo=false;
        this.$notify({
          title: '成功',
          message: '视频添加成功',
          type: 'success'
        });
      }
    },
    mounted:function(){
      // this.refresh();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
</script>

<style lang="scss">
  .container{
    display: flex;
    .left{
      width: 200px;
    }
    .right{
      flex: 1;
    }
    .el-tree{
      background: #F6FCFA;
    }
  }
  .type-container{
    background: white;
    height: 100%;
    width: 100%;
    .type-form{
      width: 70%;
      margin-left: 10%;
    }
  }
  .block{
    text-align: right;
  }
</style>
