<template>
    <div class="tomato-warpper">
        <div class="tomato-prompt">{{ name }}</div>
        <div class="tomato-countdown">
            {{ minutes }} : {{ seconds < 10 ? "0" + seconds : seconds }}
        </div>
        <div class="tomato-button">
            <el-button @click="doAsync()">{{ status }}</el-button>
            <el-button @click="reset()" v-show="flag == 2">中止</el-button>
        </div>
    </div>

    <el-button type="success" class="custom-button" @click="showsetTaskForm"
        >添加任务</el-button
    >
    <div v-if="setTask" class="modal">
        <div class="modal-content">
            <el-form v-model="form" label-width="80px">
                <el-form-item label="任务号">
                    <el-input v-model="form.taskId"></el-input>
                </el-form-item>
                <el-form-item label="任务名称">
                    <el-input v-model="form.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务时长">
                    <el-input v-model="form.taskLong"></el-input>
                </el-form-item>
                <el-form-item label="任务详细">
                    <el-input
                        type="textarea"
                        v-model="form.taskContent"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitTask"
                        >提交</el-button
                    >
                    <el-button @click="hideSetTaskForm">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <!-- 输出表格 -->

    <el-button type="success" class="custom-button" @click="showTaskForm2"
        >显示任务</el-button
    >
    <div v-if="showModal2" class="modal">
        <div class="modal-content">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="taskName" label="任务名" width="180">
                </el-table-column>
                <el-table-column prop="taskId" label="任务号" width="180">
                </el-table-column>
                <el-table-column prop="taskLong" label="任务时间" width="180">
                </el-table-column>
                <el-table-column prop="taskContent" label="任务详细">
                </el-table-column>
                <el-table-column prop="userId" label="用户id" width="180">
                </el-table-column>
            </el-table>

            <el-form-item>
                <el-button @click="hideTaskForm2">关闭</el-button>
            </el-form-item>
        </div>
    </div>

    <el-button type="success" class="custom-button" @click="showTaskForm3"
        >查询并选择任务</el-button
    >
    <div v-if="showModal3" class="modal">
        <div class="modal-content">
            <el-input
                v-model="input"
                style="width: 240px"
                placeholder="请输入任务号"
                clearable
            />
            <el-button type="success" @click="showTaskForm4">查询</el-button>
            <el-form-item>
                <el-button @click="hideTaskForm3">关闭</el-button>
            </el-form-item>
        </div>
    </div>

    <div v-if="showModal4" class="modal">
        <div class="modal-content">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="taskName" label="任务名" width="180">
                </el-table-column>
                <el-table-column prop="taskId" label="任务号" width="180">
                </el-table-column>
                <el-table-column prop="taskLong" label="任务时间" width="180">
                </el-table-column>
                <el-table-column
                    prop="taskContent"
                    label="任务详细"
                    width="180"
                >
                </el-table-column>
                <el-table-column prop="userId" label="用户Id" width="180">
                </el-table-column>
            </el-table>

            <el-form-item>
                <el-button type="success" @click="hideTaskForm4"
                    >关闭</el-button
                >
                <el-button type="success" @click="change">选择</el-button>
            </el-form-item>
        </div>
    </div>

    <el-button type="success" class="custom-button" @click="showTaskForm5"
        >删除任务</el-button
    >

    <div v-if="showModal5" class="modal">
        <div class="modal-content">
            <el-input
                v-model="input2"
                style="width: 240px"
                placeholder="请输入要删除任务号"
                clearable
            />

            <el-form-item>
                <el-button type="success" @click="delete1">删除</el-button>
                <el-form-item></el-form-item>
                <el-button @click="hideTaskForm5">关闭</el-button>
            </el-form-item>
        </div>
    </div>

    <el-button type="success" class="custom-button" @click="showTaskForm6"
        >修改任务</el-button
    >
    <div v-if="showModal6" class="modal">
        <div class="modal-content">
            <el-input
                v-model="input3"
                style="width: 240px"
                placeholder="请输入要修改任务号"
                clearable
            />
            <el-button type="success" @click="showTaskForm7">修改</el-button>

            <el-form-item>
                <el-button @click="hideTaskForm6">关闭</el-button>
            </el-form-item>
        </div>
    </div>

    <div v-if="showModal7" class="modal">
        <div class="modal-content">
            <el-form v-model="form2" label-width="80px">
                <el-form-item label="任务名称">
                    <el-input v-model="form2.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务时长">
                    <el-input v-model="form2.taskLong"></el-input>
                </el-form-item>
                <el-form-item label="任务详细">
                    <el-input
                        type="textarea"
                        v-model="form2.taskContent"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitTask2"
                        >提交</el-button
                    >
                    <el-button @click="hideTaskForm7">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { toast, type ToastOptions } from "vue3-toastify";
import axios from "axios";

//输出表格
const tableData = ref();

let setTask = ref(false);
let showModal2 = ref(false);
let showModal3 = ref(false);
let showModal4 = ref(false);
let showModal5 = ref(false);
let showModal6 = ref(false);
let showModal7 = ref(false);

const taskName = ref("");
const taskLong = ref(0);
const taskContent = ref("");
const input = ref("");
const userId_input = ref("");
const input2 = ref("");
const input3 = ref("");

const name = ref("");
const time = ref(0);

const showsetTaskForm = () => {
    setTask.value = true;
};

const showTaskForm2 = () => {
    axios
        .post("http://localhost:3000/user/tomato/tomatoTask/selectAll", {
            userId: localStorage.getItem("userId"),
        })
        .then((res) => {
            tableData.value = res.data;
        });
    showModal2.value = true;
};

const showTaskForm3 = () => {
    showModal3.value = true;
};

const showTaskForm4 = () => {
    axios
        .post("http://localhost:3000/user/tomato/tomatoTask/select", {
            taskId: input.value,
            userId: localStorage.getItem("userId"),
        })
        .then((res) => {
            tableData.value = res.data;
        })
        .catch((error) => {
            console.error(error);
        });

    showModal4.value = true;
    showModal3.value = false;
};

const showTaskForm5 = () => {
    showModal5.value = true;
};

const showTaskForm6 = () => {
    showModal6.value = true;
};

const showTaskForm7 = () => {
    showModal7.value = true;
    showModal6.value = false;
};

const delete1 = () => {
    axios.post("http://localhost:3000/user/tomato/tomatoTask/delete", {
        taskId: input2.value,
    });

    showModal5.value = false;
};

const hideSetTaskForm = () => {
    setTask.value = false;
};

const hideTaskForm2 = () => {
    showModal2.value = false;
};

const hideTaskForm3 = () => {
    showModal3.value = false;
};
const hideTaskForm4 = () => {
    showModal4.value = false;
};

const hideTaskForm5 = () => {
    showModal5.value = false;
};
const hideTaskForm6 = () => {
    showModal6.value = false;
};
const hideTaskForm7 = () => {
    showModal7.value = false;
};

const change = () => {
    if (tableData.value.length > 0) {
        const selectedTask = tableData.value[0]; // 假设选择第一个任务
        name.value = selectedTask.taskName;
        time.value = selectedTask.taskLong;
        totalSeconds.value = time.value * 60;
        updateTimer();
    }
    showModal4.value = false;
};

//0表示未开始状态(开始) 1表示开始计时状态(暂停) 2表示暂停状态(中止/继续)
const flag = ref<number>(0);

const status = ref<string>("开始");

// 定义总秒数，25分钟 * 60秒
const totalSeconds = ref(time.value * 60);
// 分钟
const minutes = ref(time.value);
// 秒
const seconds = ref(0);
// 停止器
var stop: number = 0;

const changeStatus = () => {
    flag.value = (flag.value + 1) % 3;

    if (flag.value == 0) {
        status.value = "开始";
    } else if (flag.value == 1) {
        status.value = "暂停";
    } else {
        status.value = "继续";
    }
};

// 初始化
minutes.value = Math.floor(totalSeconds.value / 60);
seconds.value = totalSeconds.value % 60;

// 更新分钟和秒的函数
const updateTimer = () => {
    minutes.value = Math.floor(totalSeconds.value / 60);
    seconds.value = totalSeconds.value % 60;
};

// 倒计时函数
const countdown = () => {
    if (totalSeconds.value > 0) {
        totalSeconds.value--;
        updateTimer();
    } else {
        clearInterval(stop);
        flag.value = 0; // 倒计时结束，重置标志位
    }
};

console.log(flag.value);
const countdownHandler = () => {
    //修改后为1，说明之前是0，按下后应当开始计时
    console.log(flag.value, status.value);

    if (flag.value == 1) {
        updateTimer();
        stop = setInterval(countdown, 1000);
    }

    //修改后为2，说明之前是1，按下后应当停止计时
    else if (flag.value == 2) {
        clearInterval(stop);
    }

    //修改后是0，说明之前是2，按下后应该继续
    else {
        //回到暂停状态
        flag.value = 0;
    }
};

const reset = () => {
    totalSeconds.value = time.value * 60;
    updateTimer();
    flag.value = 0;
    status.value = "开始";
};

const doAsync = async () => {
    await changeStatus();
    await countdownHandler();
};

//输入表格
const form = ref({
    taskId: "",
    taskName: "",
    taskLong: "",
    taskContent: "",
    userId: "",
});
const form2 = ref({
    taskName: "",
    taskLong: "",
    taskContent: "",
});

const submitTask = () => {
    // 发送任务数据到后端
    axios.post("http://localhost:3000/user/tomato/tomatoTask/insert", {
        taskId: form.value.taskId,
        taskName: form.value.taskName,
        taskLong: form.value.taskLong,
        taskContent: form.value.taskContent,
        userId: localStorage.getItem("userId"),
    });
    axios.post("http://localhost:3000/user/tomato/tomatoClock/insert", {
        clockId: form.value.taskId,
        clockName: form.value.taskName,
        clockLong: form.value.taskLong,
    });
    setTask.value = false;
};

const submitTask2 = () => {
    // 发送任务数据到后端
    axios
        .post("http://localhost:3000/user/tomato/tomatoTask/update", {
            taskId: input3.value,
        })
        .then((res) => {
            tableData.value = res.data;
        });
    axios.post("http://localhost:3000/user/tomato/tomatoTask/update", {
        taskId: input3.value,
        taskName: form2.value.taskName,
        taskLong: form2.value.taskLong,
        taskContent: form2.value.taskContent,
    });
    showModal7.value = false;
};
</script>

<style scoped lang="scss">
.tomato-warpper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    height: 100%;
    width: 100%;
    // background-color: aqua;

    .tomato-prompt {
        font-size: 3rem;
    }

    .tomato-countdown {
        font-size: 5rem;
        margin: 5%;
    }

    .el-button {
        width: 240px;
        height: 48px;
        font-size: 2rem;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
}
.custom-button {
    margin: 5px; /* Add margin around each button */
    padding: 10px 20px; /* Adjust padding for better button size */
    border-radius: 5px; /* Rounded corners for buttons */
    background-color: #409eff; /* Button background color */
    color: #ffffff; /* Text color */
    font-weight: bold; /* Bold text */
    cursor: pointer; /* Pointer cursor on hover */
}

.custom-button:hover {
    background-color: #66b1ff; /* Button background color on hover */
}
</style>
