<template>
	<div>
		<el-button type="primary " @click="add">添加课程类别</el-button>
		&nbsp;&nbsp;
		<el-input class="demo-input-suffix" placeholder="请输入内容" suffix-icon="el-icon-search" v-model="searchThis" @keydown.native.13="search"></el-input>
		<br><br>
		<!--@selection-change="handleSelectionChange"-->
		<el-table ref="multipleTable" :data="tableData.list" v-loading="loading" tooltip-effect="dark" style="width: 100%">
			<el-table-column type="index" style="text-align: center" width="55">
			</el-table-column>
			<el-table-column width="80" label="头像">
				<template slot-scope="scope">
					<img v-bind:src="scope.row.picture" ALT="图片加载失败" style="width: 100%;" />
				</template>
			</el-table-column>
			<el-table-column label="类别名">
				<template slot-scope="scope">{{ scope.row.ctName }}</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
					<el-button type="text orange" size="small" @click="deleteThis(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<br>
		<div class="block">
			<el-pagination v-if="!searchVal" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.currentPage" :page-sizes="[10, 20, 30]" :page-size="tableData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalNum">
			</el-pagination>
		</div>
		<el-dialog :title="title" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="类别名" prop="ctName">
					<el-input v-model="ruleForm.ctName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-upload class="upload-demo" ref="upload" :action="url" :data="ruleForm" :on-success="successFunc" name="picture" accept="image/*" :limit=1 :auto-upload="false">
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload(ruleForm)">上传到服务器</el-button>
						<el-button style="margin-left: 10px;" size="small" type="success" @click="changeData">上传（不修改头像）</el-button>
						<div slot="tip" class="el-upload__tip">只能上图片文件</div>
					</el-upload>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import axios from "axios";
	import {get,
		deleteOne,
		post
	} from '~/static/js/api.js';
	export default {
		asyncData() {
				return axios.get('http://localhost:3000/api/courseType/CourseTypePage?currentPage=1&pageSize=10').then(res => {
					return {
						tableData: res.data.data
					}
				})
			},
			data() {
				return {
					url: 'http://www.tiannoyi.com/video/courseType',
					tableData: '',
					title: '',
					size: 10,
					dialogFormVisible: false,
					loading: false,
					searchVal: '',
					searchThis: '',
					ruleForm: {
						schoolName: ''
					},
					formLabelWidth: '120px',
					rules: {
						schoolName: [{
							required: true,
							message: '请输入类别名称',
							trigger: 'change'
						}],
					}
				}
			},
			mounted: function() {

			},
			methods: {
				successFunc: function() {
					this.dialogFormVisible = false;
					this.refresh()
				},
				//每次事件调用页面刷新触发函数
				refresh: function(currentPage = 1, pageSize = 10) {
					let that = this;
					this.dialogFormVisible = false;
					that.loading = true;
					get('/courseType/CourseTypePage?currentPage=' + currentPage + '&pageSize=' + pageSize).then(res => {
						that.tableData = res.data;
						that.loading = false;
					})
				},
				//页面页码改变触发函数
				handleSizeChange: function(sizeChange) {
					this.size = sizeChange;
					this.refresh(1, this.size);
				},
				//当前页数改变
				handleCurrentChange: function(current) {
					this.refresh(current, this.size);
				},
				//删除单个类别
				deleteThis: function(id) {
					deleteOne('/courseType/' + id.ctId, '您确定删除该类别（这会导致相关视频的删除）？', this);
				},
				//改变类别
				change: function(value) {
					this.dialogFormVisible = true;
					this.ruleForm = value;
					this.title = '修改类别';
				},
				submitUpload() {	
					if(this.title == '添加类别') {
						this.url = 'http://www.tiannoyi.com/video/courseType';
						this.ruleForm = {
							"ctName": this.ruleForm.ctName
						}
					}
					//上传到服务器
					else {
						this.url = 'http://www.tiannoyi.com/video/courseType/update/' + this.ruleForm.ctId;
						 delete this.ruleForm.ctName;
						 delete this.ruleForm.ctId;
						 delete this.ruleForm.picture
					}
					this.$refs.upload.submit();
				},
				//添加公告
				add: function() {
					this.dialogFormVisible = true;
					this.title = '添加类别';
					this.ruleForm = {
						ctName: '',
					}
				},
				//搜索
				search: function() {
					let that = this;
					that.searchVal = that.searchThis;
					if(that.searchVal.length != 0) {
						that.loading = true;
						get("/getFuzzyqueryCoures?name=" + that.searchVal).then(res => {
							that.tableData.list = res.data;
							that.loading = false;
						})
					} else {
						that.refresh();
					}
				},
				//上传不修改
				changeData: function() {
					let that = this;
					if(that.title == '添加类别') {
						that.url = '/courseType';
						that.ruleForm = {
							"ctName": that.ruleForm.ctName
						}
					} else {
						that.url = '/courseType/update/' + this.ruleForm.ctId;
						that.ruleForm = {
							"ctName": that.ruleForm.ctName,
						}
					}
					post(that.url, that.ruleForm).then(res => {
						that.$notify({
							title: '成功',
							message: res.message,
							type: 'success'
						});
						that.successFunc();
					})
				}
			}
	}
</script>

<style lang="scss">
	.el-container {
		background-color: #dbe1ec;
	}
	
	.block {
		text-align: right;
	}
	
	.demo-input-suffix {
		width: 300px
	}
	
	.orange {
		color: #FF9900;
	}
	
	.wirte {
		color: #dbe1ec;
	}
</style>