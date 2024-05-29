import express from "express";
import mysql2 from "mysql2/promise";
import fs from "node:fs";
import jsyaml from "js-yaml";

//使用express的.Router()方法，调用后返回router实例，然后在rout、er实例上进行操作，编写接口
const router = express.Router();
//中间件允许跨域
router.use("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

//路由使用express的json模块，接受客户端post发来的json文件
router.use(express.json());

const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8");
//用js-yaml模块的.load()方法，解析yaml文件
const dbConfig = jsyaml.load(dbYaml);
//通过mysql2模块的.createConnetion()方法，将解析的yaml文件解构后作为配置传入，await回调连接
const sql = await mysql2.createConnection({
    //使用yaml文件的db部分
    ...dbConfig.db,
});

router.post("/tomato/tomatoTask/select", async (req, res) => {
    const { taskId, userId } = req.body;
    const test = `select * from tomatoTask where taskId = ? and userId = ?`;

    try {
        let [result] = await sql.query(test, [taskId, userId]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoTask/selectAll", async (req, res) => {
    const { userId } = req.body;
    const test = `select * from tomatoTask where userId = ?`;

    try {
        let [result] = await sql.query(test, [userId]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoTask/insert", async (req, res) => {
    const { taskId, taskName, taskLong, taskContent, userId } = req.body;
    const test = `INSERT INTO tomatoTask (taskId, taskName, taskLong, taskContent, userId) VALUES (?, ?, ?, ?, ?)`;

    try {
        let [result] = await sql.query(test, [
            taskId,
            taskName,
            taskLong,
            taskContent,
            userId,
        ]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoTask/update", async (req, res) => {
    const { taskId, taskName, taskLong, taskContent } = req.body;
    // const test = `INSERT INTO tomatoTask (taskName, taskLong, taskContent) VALUES ( ?, ?, ?)`;
    const test =
        "UPDATE tomatoTask SET taskName = ? , taskLong=? , taskContent = ? WHERE taskId = ?";
    console.log(taskId, taskName, taskLong, taskContent);
    try {
        let [result] = await sql.query(test, [
            taskName,
            taskLong,
            taskContent,
            taskId,
        ]);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoTask/delete", async (req, res) => {
    const { taskId } = req.body;
    const test = `delete from tomatoTask where taskId = ?`;

    try {
        let [result] = await sql.query(test, [taskId]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoClock/insert", async (req, res) => {
    const { clockId, clockName, clockLong } = req.body;
    const test = `INSERT INTO tomatoClock (clockId, clockName, clockLong) VALUES (?, ?, ?)`;

    try {
        let [result] = await sql.query(test, [clockId, clockName, clockLong]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoClock/delete", async (req, res) => {
    const { clockId } = req.body;
    const test = `delete from tomatoClock where clockId = ?`;

    try {
        let [result] = await sql.query(test, [clockId]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

router.post("/tomato/tomatoClock/select", async (req, res) => {
    const { clockId } = req.body;
    const test = `select * from tomatoClock where clockId = ?`;

    try {
        let [result] = await sql.query(test, [clockId]);
        res.send(result);
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).send("An error occurred while inserting task");
    }
});

export default router;
