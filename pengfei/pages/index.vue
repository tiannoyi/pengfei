<template>
  <div class="container">
    <el-card class="box-card el-col-xs-24  el-col-sm-12  el-col-lg-6" shadow="hover">
      <div slot="header" class="clearfix" style="text-align: center;">
        <span>管理员登录</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" label-position="right" ref="ruleForm"  class="demo-ruleForm">
        <el-form-item label="账号" prop="adminName">
          <el-input type="text" v-model="ruleForm.adminName " auto-complete="off"  suffix-icon="el-icon-service"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off"  suffix-icon="el-icon-time"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;" :loading="loadButton">登录</el-button>
        </el-form-item>
        <div style="padding: 14px;">
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="dialogFormVisible=true">注册</el-button>
          </div>
        </div>
      </el-form>
    </el-card>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户ID" prop="adminName" v-if="title!='修改管理员'">
          <el-input v-model="ruleFormAdd.adminId"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="adminName">
          <el-input v-model="ruleFormAdd.adminName"></el-input>
        </el-form-item>
        <el-form-item label="账户密码" prop="password">
          <el-input v-model="ruleFormAdd.password"></el-input>
        </el-form-item>
        <el-form-item label="账户手机号" prop="phone">
          <el-input v-model="ruleFormAdd.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sub('ruleFormAdd')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      var user = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }else{
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        }else{
          callback();
        }
      };
      return {
        dialogFormVisible:false,
        ruleFormAdd: {
          adminName:'',
          phone:'',
          password:'',
          roleId:'',
          adminId:''
        },
        formLabelWidth: '120px',
        title:'添加管理员',
        rulesAdd: {
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
        },
        ruleForm: {
          adminName : '',
          password: ''
        },
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          adminName : [
            { validator: user, trigger: 'blur' }
          ]
        },
        loadButton:false
      };
    },
    methods: {
      //登录提交
      submitForm(formName) {
        let that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.loadButton=true;
            axios.post('http://www.tiannoyi.com/video/login?adminName='+that.ruleForm.adminName+'&password='+that.ruleForm.adminName,that.ruleForm).then(res=>{
              that.loadButton=false;
              if (res.data.message!='FAIL'){
                that.$store.commit('login',res.data.data);
                if (res.data.data.teacherId){
                  that.$router.push('/teacherLogin');
                }else{
                    that.$router.push('/login');
                }
              }else{
                return  alert("账号密码有误，请重新输入账号密码")
              }
            })
          } else {
            return false;
          }
        });
      },
      sub(formNameAdd) {
        let that=this;
        let config = {
          headers:{'Content-Type':'application/json;charset=UTF-8'}
        };
        that.$refs[formNameAdd].validate((valid) => {
          if (valid) {
            if (that.title=='添加管理员'){
              let id =that.ruleFormAdd.adminId;
              delete that.ruleFormAdd.adminId;
              axios.post("/admins",JSON.stringify(that.ruleFormAdd),config).then(res=>{
                that.dialogFormVisible=false;
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
    },
    mounted:function () {
    }
  }
</script>

<style lang="scss">
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
