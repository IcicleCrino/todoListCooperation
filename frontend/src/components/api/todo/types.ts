interface response{
    code:number,
    success:boolean,
}

type Time = string | null;
export interface todo{
        todoId: number,
        userId: string,
        content:string,
        title:string,
        finishTime:Time,
        endTime: Time,
        createTime: Time,
        startTime: Time,
        status: 0 | 1,
        quadrant: 1 | 2 | 3 | 4,
}
export type todoList = todo[];

export interface getTodoListResponse extends response{
    msg:todoList
}

export interface commonResponse extends response{
    msg:string
}

export interface createTodo{
    todoId:number | string,
    userId:string,
    title:string,
    content:string,
    startTime:Time,
    endTime:Time,
    status:0|1,
    quadrant:1|2|3|4
}
