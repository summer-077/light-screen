import axios from 'axios'
import { Message } from 'element-ui';
// 设置超时时间
axios.defaults.timeout = 10000;

if (process.env.NODE_ENV === "development") {
  // 开发环境
  axios.defaults.baseURL = "/dev/";
}else {
  // 生产环境
  axios.defaults.baseURL = "/";
  if (window) {
    window.console.log = function () {};
  }
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  Message.error("请求失败！请检查网络，或者联系技术人员！")
  return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  Message.error("响应失败！请检查网络，或者联系技术人员！")
  return Promise.reject(error);
});



export default axios