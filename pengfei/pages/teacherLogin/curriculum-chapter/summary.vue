<template>
  <div style="width: 100%;">
    <el-dialog :title="title" :visible.sync="dialogsummany">
      <el-form :model="knowledge" :rules="rulesOne" ref="knowledge" label-width="100px" class="demo-ruleForm">
        <el-form-item label="小结名" prop="summaryName">
          <el-input v-model="knowledge.summaryName"></el-input>
        </el-form-item>
        <el-form-item label="小结序号" prop="summaryNum">
          <el-input v-model="knowledge.summaryNum"></el-input>
        </el-form-item>
        <el-form-item label="编辑教师" prop="redactTeacher">
          <el-input v-model="knowledge.redactTeacher"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="postAdd('knowledge')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-row type="flex" class="row-bg" justify="space-between" style="width: 100%;">
      <el-col :span="20">
        <el-button type="success "  size="mini" @click="addVideo">添加视频</el-button>
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="dialogsummany=true"></el-button>
          <el-button type="primary" icon="el-icon-share" @click="task"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="deleteKnowledge"></el-button>
          <el-button type="success "  size="mini" @click="article">查看文章</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="4" >
        <el-button type="text " style="float: right" @click="back" icon="el-icon-d-arrow-left">返回章节</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        style="text-align: center"
        width="55">
      </el-table-column>
      <el-table-column
        width="110"
        label="视频名称">
        <template slot-scope="scope">{{ scope.row.videoName }}</template>
      </el-table-column>
      <el-table-column
        prop="videoAddress"
        label="视频地址"
        width="200">
      </el-table-column>
      <el-table-column
        prop="videoDuration"
        label="时长"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="addTime"
        label="创建时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <!--<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
          <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
          <el-button type="text orange"  size="small"  @click="deleteThis(scope.row.videoId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from "axios";
  import { get, post} from "../../../static/js/api";
  export default {
    name: "index",
    data(){
      return{
        tableData:[],
        dialogsummany:false,
        loading:false,
        dialogFormVisible:false,
        videoData: {
          videoName:'',
          videoDuration: '',
          knowledgeId: '',
        },
        title:'',
        knowledge: {
          chapterId:'',
          summaryName: '',
          summaryNum: '',
          redactTeacher: '',
        },
        rulesOne:{
          summaryName: [
            { required: true, message: '请输入小结名', trigger: 'blur' }
          ],
          summaryNum: [
            { required: true, message: '请输入小结序号', trigger: 'blur' }
          ],
          redactTeacher: [
            { required: true, message: '请输入编辑老师', trigger: 'blur' }
          ]
        },
      }
    },

    methods:{
      //表单验证
      submitForm(formName) {
        let that =this;
        that.$store.commit('showChange');
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.ruleForm.curriculumId=that.$store.state.curriculumId;
            that.ruleForm.chapterId=that.$store.state.chapter.chapterId;
            post('/chapter',that.ruleForm).then(res=>{
              that.$store.commit('showChange');
              that.$message({
                message:res.message,
                type: 'success'
              });
            })
          } else {
            return false;
          }
        });
      },
      //提交新小结信息
      postAdd:function (knowledge) {
        let that =this;
        that.$store.commit('showChange');
        that.$refs[knowledge].validate((valid) => {
          if (valid) {
            that.knowledge.chapterId=that.$store.state.chapter.chapterId;
            that.knowledge._method="put";
            post('/Knowledge/'+that.$store.state.knowledge.knowledgeId,that.knowledge).then(res=>{
              that.$store.commit('showChange');
              that.dialogFormVisible=false;
              that.$message({
                message:res.message,
                type: 'success'
              });
              that.dialogsummany=false;
            })
          } else {
            return false;
          }
        });
      },
      //页面刷新触发函数
      refresh:function () {
        this.title='修改'+this.$store.state.knowledge.name+'小结';
        let that=this;
        that.loading=true;
        let id=that.$store.state.knowledge.knowledgeId;
        that.$store.commit('showChange');
        if (id){
          get('/video/knowledgeId?knowledge_id='+id).then(res=>{
            that.$store.commit('showChange');
            if (res.data){
              that.tableData=res.data
            }
            that.loading=false;
            that.$store.commit("showTrue");
          })
        }else{
          that.message.error("请先选择小结")
        }
      },
      //删除单个小结
      deleteKnowledge:function () {
        let that=this;
        this.$confirm('此操作将永久删除该条小结, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/Knowledge/'+that.knowledgeId).then(res=>{
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.$router.push("/login/curriculum-chapter")
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加视频跳转
      addVideo:function () {
        this.$router.push('/login/addVideo')
      },
      //删除视频函数
      deleteThis:function (id) {
        let that=this;
        this.$confirm('此操作将永久删除该条视频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/video/'+id).then(res=>{
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          that.refresh();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //修改视频弹出
      change:function (val) {
        this.videoData.videoId=val.videoId;
        this.videoData.videoName=val.videoName;
        this.videoData.videoDuration=val.videoDuration;
        this.videoData.knowledgeId=val.knowledgeId;
        this.dialogFormVisible=true;
      },
      //提交视频
      submitUpload:function () {
        this.$refs.upload.submit();
      },
      successF:function () {
        this.dialogFormVisible=false;
        this.refresh()
      },
      //返回章节
      back:function () {
        this.$router.push('/login/curriculum-chapter')
      },
      //查看作业
      task:function () {
        this.$router.push("/login/curriculum-chapter/task");
      },
      //查看文章
      article:function () {
        this.$router.push("/login/curriculum-chapter/article");
      }
    },
    mounted:function () {
      this.refresh()
    },
    computed:{
      knowledgeId:function () {
        return this.$store.state.knowledge.knowledgeId
      }
    },
    watch:{
      knowledgeId(curval,oldval){
        this.refresh();
      }
    }
  }
</script>

<style scoped>

</style>
