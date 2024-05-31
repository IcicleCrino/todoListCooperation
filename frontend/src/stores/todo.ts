import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user"
import { getUserTodoList, addUserTodo, DeleteUserTodo } from "../components/api/todo/index"
import type { createTodo, todoList } from "../components/api/todo/types";
import { ref } from "vue"
let userStore = useUserStore();
export const useTodoStore = defineStore(
    "todo",
    () => {
        let userId = localStorage.getItem("userId");
        console.log(userId)
        let todoList = ref<todoList>([]);
        const getList = async () => {
            let result = await getUserTodoList(userId as string)
            todoList.value = result.data.msg
            return result.data
        };

        const addTodo = async (form: createTodo) => {
            return await addUserTodo(form);
        };

        async function deleteUserTodo(todoId: number) {
            return await DeleteUserTodo(todoId);
        };
        return {
            todoList,
            getList,
            addTodo,
            deleteUserTodo,
        }
    },
    {
        persist: true,
    },
);
