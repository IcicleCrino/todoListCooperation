import { defineStore } from "pinia";

export const useURLStore = defineStore("URL", () => {
    const baseURL = "http://localhost:3000";
    const userReg = baseURL + "/user/reg";
    const userLogin = baseURL + "/user/login";
    const userCreateTodo = baseURL + "/user/createTodo";
    const userGetTodo = baseURL + "/user/getTodo";
    const userDoneTodo = baseURL + "/user/doneTodo";
    const userUndoTodo = baseURL + "/user/undoTodo";

    return {
        baseURL,
        userReg,
        userLogin,
        userCreateTodo,
        userGetTodo,
        userDoneTodo,
        userUndoTodo,
    };
});
