import express from "express"
import mysql2 from "mysql2/promise"
import fs from "node:fs"
import jsyaml from "js-yaml"
import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt"

import secretKey from './src/secretKey.js';

//express模块化，导入user接口模块
import user from "./src/user.js"

//异步读取文件，编码格式为utf-8
const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8")
//使用jsyaml 解析yaml文件配置
const dbConfig = jsyaml.load(dbYaml)
//使用mysql2的.createConnetion方法，传入数据库配置，await回调连接数据库 
const sql = await mysql2.createConnection({
    //用...解构配置
    ...dbConfig.db
})

const app = express()

//使用模块，增加根路径/user
app.use("/user", user)

//通过中间件实现jwt验证

app.listen(3000, ()=>{
    console.log("http://localhost:3000")
})
