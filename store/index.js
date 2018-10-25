import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    editableTabs:[{
      title: '首页',
      name: '0',
      content: '首页',
      url:'/'
    }],
    editableTabsValue:1,
    adminName:'',
    //响应式导航栏参数
    menuBlock: true,
    size:'',
    menu:{

    },
    class:"",
    navbar:['首页'],
    curriculum:{
      'curriculumId':'未选择章节',
      'name':'未选择章节'
    },
    knowledge:{
      'knowledgeId':'未选择章节',
      'name':'未选择章节'
    },
    user:{
      'userId':'未选择用户',
      'name':'未选择用户'
    },
    chapter:{
      'chapter':'未选择小结',
      'name':'未选择小结'
    },
    curriculumGrade:{
      'chapter':'未选择课程',
      'name':'未选择课程'
    },
    tutionId:'',
    show:true,
    tabData:'',
  },
  mutations: {
    showChange:function(state,value){
      state.show = !state.show;
    },
    chapterChange:function(state,value){
      state.chapter = value;
    },
    //页面刷新时候让树形控件自动加载的函数
    showTrue:function(state,value){
      state.show = true;
    },
    //路由改变触发改变当前面包屑
    routerChange:function(state,value){
      state.navbar = value;
    },
    //登录触发
    login:function(state,value){
      state.adminName = value;
    },
    //更改路由触发
    myTab:function (state,value) {
      state.editableTabsValue = value;
    },
    //当期查询课程ID
    curriculumChange:function(state,value){
      state.curriculum = value;
    },
    curriculumGrade:function(state,value){
      state.curriculumGrade = value;
    },
    //当前查询知识ID
    knowledgeChange:function(state,value){
      state.knowledge = value;
    },
    userChange:function(state,value){
      state.user = value;
    },
    addTab:function (state,val) {
      let doit=true;
      for (let index in state.editableTabs){
        if (state.editableTabs[index].name==val.pId){
          return doit=false;
        }
      }
      if (doit){
        state.editableTabs.push({
          title: val.pName,
          name: val.pId,
          content: val.pName,
          url:val.path
        });
      }
    },
    deleteTab:function (state,targetName) {
      if (targetName!=0){
        let tabs = state.editableTabs;
        let activeName = state.editableTabsValue;
        if (activeName == targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name == targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        //
        state.editableTabsValue = activeName;

        state.editableTabs = tabs.filter(tab => tab.name != targetName);
      }
    },
    menuBlockChange (state) {
      state.menuBlock=!state.menuBlock;
    },
    menuBlockTrue(state){
      state.menuBlock=true;
    },
    menuBlockFalse(state){
      state.menuBlock=false
    },
    changeSize:function (state,value) {
      state.size=value;
    },
    changeMenu:function (state,value) {
      state.menu=value;
    },
    classChange:function (state,val) {
      state.class=val;
    },
    tutionIdChange:function(state,value){
      state.tutionId =value;
    },
  }
})

export default store
