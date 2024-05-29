import mysql2 from "mysql2/promise";
import fs from "node:fs";
import jsyaml from "js-yaml";
import express from "express";

//异步读取文件
const yaml = fs.readFileSync("./src/db.config.yaml", "utf8");
//读取yaml配置
const config = jsyaml.load(yaml);
//连接数据库
const sql = await mysql2.createConnection({
    ...config.db,
});

const router = express.Router();
router.use(express.json());

//中间件允许跨域
router.use("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
    );
    next();
});

//获取所有笔记
router.get("/getNotes", async (req, res) => {
    const { userId } = req.query;
    console.log(req.query);
    const [result] = await sql.query("select * from note where userId = ?", [
        userId,
    ]);
    console.log(result);
    res.send({
        code: 200,
        data: result,
        message: "成功查询该用户所有笔记",
    });
});

//获得单独笔记
router.get("/getNote", async (req, res) => {
    const { noteId } = req.body;
    const [[result]] = await sql.query("select * from note where noteId = ?", [
        noteId,
    ]);
    console.log(result);
    res.send({
        code: 200,
        data: result,
        message: "成功查询，笔记id：" + noteId,
    });
});

//通过笔记标题，查找笔记id
router.post("/searchNote", async (req, res) => {
    const { title } = req.body;
    const [result] = await sql.query(
        "select title, noteId from note where title like ?",
        ["%" + title + "%"]
    );
    res.send({
        code: 200,
        data: result,
        message: "模糊查找成功",
    });
    return;
});

//添加笔记
router.post("/addNote", async (req, res) => {
    //解构出笔记标题和内容
    const { userId, title, content } = req.body;
    //判断笔记标题和内容是否合法
    //首先标题长度不能为0，且不能超过48个字
    if (title.length < 0 || title.length > 48) {
        res.send({
            code: 401,
            message: "标题长度不合格",
        });
        return;
    }
    //其次标题不能重复
    const [result] = await sql.query(
        "select title from note where title = ? and userId = ?",
        [title, userId]
    );
    console.log(result);
    //如果结果数组长度大于0，说明重复
    if (result.length > 0) {
        res.send({
            code: 401,
            message: "笔记标题已经存在",
        });
        return;
    }
    //将笔记插入数据库
    await sql.query(
        "insert into note(userId, title, content) values(?, ?, ?)",
        [userId, title, content]
    );
    //获取新笔记的noteId
    const [[noteId]] = await sql.query(
        "select noteId from note where title = ?",
        [title]
    );
    res.send({
        code: 200,
        message: "成功添加笔记" + title,
        noteId: noteId.noteId,
    });
    return;
});

//更新笔记内容
router.patch("/updateNote", async (req, res) => {
    const { noteId, title, content } = req.body;
    const result = await sql.query(
        "update note set title = ?, content = ? where noteId = ?",
        [title, content, noteId]
    );
    console.log(result);
    res.send({
        code: 200,
        data: {
            title,
            content,
        },
        message: "修改成功",
    });
    return;
});

//删除笔记
router.delete("/deleteNote/:noteId", async (req, res) => {
    const { noteId } = req.params;
    await sql.query("delete from note where noteId = ?", [noteId]);
    res.send({
        code: 200,
        message: "成功删除编号为：" + noteId + " 的笔记",
    });
    return;
});

export default router;
