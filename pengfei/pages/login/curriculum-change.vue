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
        <el-steps :active="active" finish-status="success" style="width: 80%;margin-left: 10%;">
          <el-step title="修改基本信息"></el-step>
          <el-step title="修改课程封面"></el-step>
          <el-step title="修改课程视频图片"></el-step>
        </el-steps>
        <br><br>
        <div class="type-form" >
        <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" label-position="right" class="demo-ruleForm">
        <el-form-item v-if="active==0" label="课程名称：" >
        <el-input placeholder="请输入课程名称" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="active==0" label="学校名：" @click="selectUniversity">
        <span>当前所选学校：{{universityName}}</span>
        <el-button type="text"  size="small"  @click="selectUniversity">点击选择学校</el-button>
        </el-form-item>
        <el-form-item v-if="active==0" label="课程类别名：" @click="selectUniversity">
        <span>当前所选课程类别：{{ctName}}</span>
        <el-button type="text"  size="small"  @click="selectCT">点击选择学校</el-button>
        </el-form-item>
        <el-form-item v-if="active==0" label='是否为系统封面'>
        <el-switch v-model="ruleForm.ismainpic"></el-switch>
        </el-form-item>
        <el-form-item v-if="active==0" label="请输入负责老师：" >
        <el-input placeholder="请输入课程负责老师名称" v-model="ruleForm.mainTeacher"></el-input>
        </el-form-item>
        <el-form-item v-if="active==0" label="课程介绍：" >
        <el-input type="textarea" v-model="ruleForm.introduce"></el-input>
        </el-form-item>
        <el-form-item v-if="active==0" label="课程寄语：" >
        <el-input type="textarea" v-model="ruleForm.message"></el-input>
        </el-form-item>
        <el-form-item v-if="active==0" label="预备知识："  >
        <el-input type="textarea" v-model="ruleForm.propaedeutics"></el-input>
        </el-form-item>
        <el-form-item v-if="active==0" label="合格要求："  >
        <el-input type="textarea" v-model="ruleForm.require"></el-input>
        </el-form-item>
        <el-form-item v-if="active==0" label="评分标准："  >
        <el-input type="textarea" v-model="ruleForm.scoring"></el-input>
        </el-form-item>
        <el-form-item  v-if="active==0">
        <el-button type="primary" @click="submit">提交修改</el-button>
        </el-form-item>
        <el-form-item v-if="active==1" label="上传新封面图片：" >
        <el-upload
        class="upload-demo"
        ref="upload"
        action="http://www.tiannoyi.com/video/curriculum/curriculumPicture"
        accept="*.image"
        :on-success="success"
        :data="pirture"
        name="curriculumPicture"
        :limit=1
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submit1">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上图片文件</div>
        </el-upload>
          <el-button @click="before" size="small">上一步</el-button>
          <el-button @click="next" size="small">下一步</el-button>
        </el-form-item>
        <el-form-item v-if="active==2"  label="上传图片：" >
        <el-upload
        class="upload-demo"
        ref="upload"
        action="http://www.tiannoyi.com/video/curriculum/curriculumVideoPicture"
        accept="*.image"
        :on-success="success"
        :data="pirture"
        name="curriculumVideoPicture"
        :limit=1
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submit2">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上图片文件</div>
        </el-upload>
          <el-button @click="before" size="small">上一步</el-button>
        </el-form-item>
          <el-form-item  v-if="active==3">
            <el-button type="primary" @click="back">返回课程页面</el-button>
          </el-form-item>
        </el-form>
        </div>
      </div>
    </div>
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
    async asyncData(context){
      let [courseType,universityList,ruleForm] = await Promise.all([
        axios.get('http://localhost:3000/api/courseType/CourseTypePage?currentPage=1&pageSize=3'),
        axios.get("http://localhost:3000/api/getSchoolAll?currentPage=1&pageSize=3"),
        axios.get("http://localhost:3000/api/curriculum/"+context.store.state.curriculum.curriculumId),
      ])
      return{
        courseTypeList:courseType.data.data,
        universityList:universityList.data.data,
        ruleForm:ruleForm.data.data,
      }
    },
    data(){
      return{
        active: 0,
        size:3,
        header:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        pirture:{
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
      next:function () {
        if (this.active++ > 2) this.active = 0;
      },
      before:function () {
        if (this.active-- < 1) this.active = 0;
      },
      //选择学校
      selectUniversity:function () {
        this.dialogUniversity=true;
      },
      refresh:function(){
        let that=this;
        get("/curriculum/"+context.store.state.curriculum.curriculumId).then(res=>{
          that.ruleForm=res.data.data
        })
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
      submit1:function(){
        this.pirture.curriculumId=this.ruleForm.curriculumId;
        this.$refs.upload.submit();
      },
      submit2:function(){
        this.pirture.curriculumId=this.ruleForm.curriculumId;
        this.$refs.upload.submit();
      },
      //上传成功的回调函数
      success:function () {
        this.$notify({
          title: '成功',
          message: '课程封面图片上传成功',
          type: 'success'
        });
        this.next();
      },
      submit:function () {
        this.ruleForm._method="put";
        post('/curriculum/'+this.$store.state.curriculum.curriculumId,this.ruleForm).then(res=>{
          this.next();
          this.$notify({
            title: '成功',
            message: '课程修改成功',
            type: 'success'
          });
        })
      },
      back:function () {
        this.$router.push("/login/curriculum");
      }
    },
    mounted:function(){
      this.curriculumUrl="/curriculum/"+this.$store.state.curriculum.curriculumId;
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
