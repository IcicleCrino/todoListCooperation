import request  from "./utils";
import type { AxiosPromise } from "axios";
import type { getTodoListResponse,createTodo } from "./types"

export function getUserTodoList(
    query:string
):AxiosPromise<getTodoListResponse>{
    return request({
        url:"/getList",
        method:"post",
        params:{
            userId : query
        }
    })
}

export function addUserTodo(
    query:createTodo
):AxiosPromise<getTodoListResponse>{
    return request({
        url:"/create",
        method:"post",
        data:query
    })
}

export function DeleteUserTodo(
    todoId:number
):AxiosPromise<any>{
    return request({
        url:"/delete",
        method:"post",
        params:{
            todoId : todoId
        }
    })
}