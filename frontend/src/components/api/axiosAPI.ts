import axios from "axios";
import { useURLStore } from "@/stores/URL";
import { useTodoStore } from "@/stores/todo";

const URL = useURLStore();
const Todo = useTodoStore();

//用户注册
async function userReg(
    userName: string,
    userAccount: string,
    userPassword: string,
) {
    let status = -1;
    await axios
        .post(URL.userReg, {
            userName: userName,
            userAccount: userAccount,
            userPassword: userPassword,
        })
        .then((res) => {
            if (res.data.code == 200) {
                //成功登录返回true
                status = 200;
            } else if (res.data.code == 400) {
                //账号已被注册
                status = 400;
            }
        })
        .catch((err) => {
            status = 500;
        });
    return status;
}
//用户登录

async function userLogin(userAccount: string, userPassword: string) {
    let status = -1;
    let userId = -1;
    await axios
        .post(URL.userLogin, {
            userAccount: userAccount,
            userPassword: userPassword,
        })
        .then((res) => {
            //通过res.data.code判断是否登录成功
            if (res.data.code == 200) {
                //返回用户id
                localStorage.setItem("userId", res.data.userId);
                userId = res.data.userId;
                status = 200;
            } else {
                status = 400;
            }
        })
        .catch((error) => {
            status = 500;
        });

    return {
        status,
        userId,
    };
}

//创建待办
async function createTodo(
    todoName: string,
    userId: number,
    startTime: Date = new Date(),
) {
    console.log(userId);
    let status = -1;
    await axios
        .post(URL.userCreateTodo, {
            event_name: todoName,
            start_time: startTime,
            end_time: startTime,
            target_id: userId,
        })
        .then((res) => {
            status = 200;
        })
        .catch((err) => {
            status = 500;
        });
    return status;
}
//获取待办

async function getTodoList() {
    let status = -1;
    //确保有token
    if (!localStorage.getItem("token")) {
        return 401;
    }
    //axios获取用户所有待办
    await axios
        .get(URL.userGetTodo, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            Todo.todoList = res.data.data;
            status = 200;
        })
        .catch((err) => {
            console.log(err);
            console.log(400);
        });
    return status;
}
//完成待办

export default {
    userReg,
    userLogin,
    createTodo,
    getTodoList,
};
