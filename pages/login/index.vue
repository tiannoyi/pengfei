<template>
    <div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" >
          <div id="editor" style="text-align: center">
            尊敬的管理员，欢迎您的登陆，请点击左侧导航栏开始您的管理之旅
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" ></el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "index",
      data(){
          return{
            uetest:'试一下！！！！',

            config: {
              initialFrameWidth: null,
              initialFrameHeight: 350
            }
          }
      },
      methods:{

      },
      mounted:function () {

      },
      components:{

      }
    }
</script>

<style scoped>
  #myChart {
    width: 100%;
    height: 500px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }
  .myicon{
    font-size: 50px;
    margin: 20px;
    color: #6CCAC9;
  }
</style>
