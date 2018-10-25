import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = '/api'
let config = {
  headers:{'Content-Type':'multipart/form-data'}
};
export function deleteOne (url='/null',message,_this) {
  return new Promise((resolve, reject) => {
    if (_this){
      _this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(url).then(res=>{
         if (res.data.state=="SUCCESS"){
           _this.$message({
             type: "success",
             message: res.data.message
           });
         } else{
           _this.$message.error('删除失败')
         }
          _this.refresh();
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  })
}
export function post (url='/null', params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function  get (url='/null') {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function img (url='/null', params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params,config)
      .then(res => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export default {
  get:get(),
  post:post(),
  img:img(),
  deleteOne:deleteOne()
}
