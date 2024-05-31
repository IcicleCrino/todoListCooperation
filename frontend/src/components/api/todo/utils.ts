import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: `http://localhost:3000/user/todo`,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

export default service;