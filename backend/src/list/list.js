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


router.post("/todo/getList", async (req, res) => {
    const { userId } = req.query;
    console.log(req.query);
    const query = `select * from todo where userId = ?`;
    let [result] = await sql.query(query, [userId]);
    res.send({ code: 200, msg: result, success: true });
});

router.post("/todo/create", async (req, res) => {
    console.log("create" + req.body);
    let result = null;
    const {
        finishTime,
        todoId,
        userId,
        content,
        title,
        endTime,
        startTime,
        status,
        quadrant,
    } = req.body;

    if (todoId != 0 ) {
        if (!finishTime) {
            const query = `UPDATE todo SET content = ?, title = ?, endTime = ?, startTime = ?, status = ?, quadrant = ? WHERE todoId = ?;`;
            try {
                [result] = await sql.query(query, [
                    content,
                    title,
                    endTime,
                    startTime,
                    status,
                    quadrant,
                    todoId,
                ]);
                res.send({
                    code: 200,
                    msg: "Todo updated successfully",
                    success: true,
                    result,
                });
            } catch (error) {
                console.error("Database error:", error);
                res.status(500).send({
                    code: 500,
                    msg: "Internal Server Error",
                    success: false,
                });
            }
        } else {
            const query = `UPDATE todo SET content = ?, title = ?, endTime = ?, startTime = ?, status = ?, quadrant = ?, finishTime = ? WHERE todoId = ?;`;
            try {
                [result] = await sql.query(query, [
                    content,
                    title,
                    endTime,
                    startTime,
                    status,
                    quadrant,
                    finishTime,
                    todoId,
                ]);
                res.send({
                    code: 200,
                    msg: "Todo updated successfully",
                    success: true,
                    result,
                });
            } catch (error) {
                console.error("Database error:", error);
                res.status(500).send({
                    code: 500,
                    msg: "Internal Server Error",
                    success: false,
                });
            }
        }
    } else {
        const insertQuery = `INSERT INTO todo (userId, content, title, endTime, startTime, status, quadrant) VALUES (?, ?, ?, ?, ?, ?, ?);`;
        try {
            [result] = await sql.query(insertQuery, [
                userId,
                content,
                title,
                endTime,
                startTime,
                status,
                quadrant,
            ]);
            res.send({
                code: 200,
                msg: "Todo created successfully",
                success: true,
                result,
            });
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).send({
                code: 500,
                msg: "Internal Server Error",
                success: false,
            });
        }
    }
});

router.post("/todo/delete", async (req, res) => {
    console.log("delete" + req.query);
    const { todoId } = req.query;
    const query = `delete from todo where todoId = ?`;
    let [result] = await sql.query(query, [todoId]);
    res.send({ code: 200, msg: "ok", success: true });
});
export default router;
