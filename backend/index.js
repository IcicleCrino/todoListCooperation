import express from "express";

//express模块化，导入user接口模块
import list from "./src/list/list.js";
import login from "./src/login/login.js"; 
import note from "./src/note/note.js";
import tomato from "./src/tomato/tomato.js";

const app = express();

//使用模块，增加根路径/user
app.use("/user", list);
app.use("/user", login);
app.use("/user", note);
app.use("/user", tomato);

//中间件允许跨域
app.use("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
