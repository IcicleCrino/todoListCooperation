<script setup lang="ts">
import { ref, reactive, toRaw, onMounted, watch, nextTick } from "vue";
import type { createTodo, todoList } from "@/components/api/todo/types";
import { useTodoStore } from "@/stores/todo";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const todoStore = useTodoStore();
let dialogFormVisible = ref(false);
const quadrant = {
    text: ["紧急且重要", "不紧急但重要", "紧急但不重要", "既不紧急也不重要"],
    value: [1, 2, 3, 4],
};
let form = reactive<createTodo>({
    todoId: 0,
    userId: localStorage.getItem("userId") as string,
    title: "",
    content: "",
    startTime: "",
    endTime: "",
    status: 0,
    quadrant: 1,
});
let initedForm: createTodo = {
    todoId: 0,
    userId: localStorage.getItem("userId") as string,
    title: "",
    content: "",
    startTime: "",
    endTime: "",
    status: 0,
    quadrant: 1,
};
const initForm = () => {
    form = initedForm;
};
const addTodo = () => {
    dialogFormVisible.value = true;
};

function isFullyChanged(current: createTodo) {
    return !(
        current.content == "" ||
        current.title == "" ||
        current.endTime == "" ||
        current.startTime == ""
    );
    // 所有属性都已更改
}
const confirmBtn = async () => {
    const f = toRaw(form);
    console.log(f);
    if (isFullyChanged(f)) {
        let res = await todoStore.addTodo(f);
        ElMessage({
            message: "添加成功",
            type: "success",
        });
        initForm();
        dialogFormVisible.value = false;
    }
};

watch(dialogFormVisible, async () => {
    let res = await todoStore.getList();
});

onMounted(async () => {
    let res = await todoStore.getList();
});
</script>

<template>
    <el-button
        @click="addTodo"
        type="success"
        :icon="Plus"
        circle
        style="width: 50px; height: 50px; position: absolute"
    />
    <el-dialog v-model="dialogFormVisible" title="添加代办事务" width="750">
        <el-form :model="form">
            <el-form-item label="事务名称" label-width="140px">
                <el-input
                    v-model="form.title"
                    autocomplete="off"
                    style="width: 270px"
                />
            </el-form-item>
            <el-form-item label="内容" label-width="140px">
                <el-input
                    v-model="form.content"
                    style="width: 240px"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    type="textarea"
                    placeholder="输入待办内容..."
                />
            </el-form-item>
            <el-form-item label="开始时间" label-width="140px">
                <el-date-picker
                    v-model="form.startTime"
                    type="date"
                    placeholder="选择开始日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item label="结束时间" label-width="140px">
                <div class="block">
                    <el-date-picker
                        v-model="form.endTime"
                        type="date"
                        placeholder="选择结束日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
                </div>
            </el-form-item>
            <el-form-item label="事务重要性" label-width="140px">
                <el-select
                    v-model="form.quadrant"
                    placeholder="请选择事务重要性"
                    style="width: 230px"
                >
                    <el-option
                        v-for="(val, index) in quadrant.text"
                        :label="val"
                        :value="index + 1"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmBtn"> 添加 </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
.container {
    width: 1200px;
    height: 44px;
    display: flex;
    align-items: center;
}
</style>
