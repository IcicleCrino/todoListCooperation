<template>
   <el-card class="container" >
    <span class="title">{{ title }}</span>
    <div class="content">
        <div v-for="i in visibleItems" class="item" @click="watchTodo(i)">{{i.title}}</div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="查看/修改待办事务" width="750">
        <el-form :model="todo">
            <el-form-item label="事务名称" label-width="140px">
                <el-input v-model="todo.title" autocomplete="off" style="width: 270px;" />
            </el-form-item>
            <el-form-item label="内容" label-width="140px">
                <el-input
                v-model="todo.content"
                style="width: 240px"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="输入待办内容..."
              />
            </el-form-item>

            <el-form-item label="开始时间" label-width="140px">
                <el-date-picker
                        v-model="todo.startTime"
                        type="date"
                        placeholder="选择开始日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
        </el-form-item>
        <el-form-item label="结束时间" label-width="140px">
            <el-date-picker
                        v-model="todo.endTime"
                        type="date"
                        placeholder="选择开始日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
        </el-form-item>
            <el-form-item label="事务重要性" label-width="140px">
                <el-select v-model="todo.quadrant" placeholder="请选择事务重要性" style="width: 230px">
                    <el-option v-for="(val,index) in quadrant.text"  :label="val" :value="index+1" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否完成" label-width="140px" style="display: flex;justify-content:center;align-items: center;">
                <el-switch
                v-model="todo.status"
                :active-value="1"
                :inactive-value="0"
                size="large"
                active-text="已完成"
                inactive-text="未完成"
              />
            </el-form-item>
            <el-form-item label="完成时间" label-width="140px" style="display: flex;justify-content:center;align-items: center;" v-if="tag">
                <span>{{formatDate(todo.finishTime)}}</span>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="danger" @click="deleteBtn" plain>删除</el-button>
                <el-button @click="dialogFormVisible = false" plain>取消</el-button>
                <el-button type="primary" @click="confirmBtn" style="width:100px">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
   </el-card>
</template>
    
<script setup>
import { ElMessage } from 'element-plus'
import {useTodoStore} from "@/stores/todo.ts"
import {ref,computed,toRaw,watch} from "vue"
let props = defineProps(["title","frontColor","quadrant"])
const todoStore = useTodoStore();
let dialogFormVisible = ref(false);
let tag = ref(0)
let initedForm = {
    todoId:0,
    title:"",
    content:"",
    startTime:"",
    endTime:"",
    status:0,
    quadrant:1,
    finishTime:"",
}
const initForm = ()=>{
    todo = initedForm
}
const quadrant = {
   text: ["紧急且重要","不紧急但重要","紧急但不重要","既不紧急也不重要"],
    value:[1,2,3,4]
}
let todo = ref({
    todoId:0,
    title:"",
    content:"",
    startTime:"",
    endTime:"",
    status:0,
    quadrant:1,
    finishTime:""
})
const watchTodo = (data)=>{
    tag.value = data.status
    console.log(tag.value)
    todo.value = data
    console.log(todo.value)
    dialogFormVisible.value = true
}

function formatDate(date) {
    if(!date) return null;
    return new Date(date).toISOString().split('T')[0];
}


const confirmBtn = async()=>{
    const f = toRaw(todo.value);
    if(f.status != tag.value && tag.value == 0){
        console.log("in")
        f.finishTime = getFormattedDate()
    }

    f.endTime = formatDate(f.endTime);
    f.startTime = formatDate(f.startTime)
    f.finishTime = formatDate(f.finishTime)
    f.createTime =formatDate(f.createTime)
    let res = await todoStore.addTodo(f);
        ElMessage({
            message: '修改成功',
            type: 'success',
        })
        dialogFormVisible.value = false;   
}
const visibleItems = computed(() => {
  return todoStore.todoList.filter(item => item.quadrant === props.quadrant+1);
});
const deleteBtn = async()=>{
   let res = await todoStore.deleteUserTodo(todo.value.todoId)
   ElMessage({
            message: '删除成功',
            type: 'success',
        })
   dialogFormVisible.value = false;  
}
watch(dialogFormVisible ,async()=>{
    let res = await todoStore.getList();
})
const getFormattedDate = () => {
        const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 补全月份为两位数
      const day = String(date.getDate()).padStart(2, '0'); // 补全日期为两位数
      const hours = String(date.getHours()).padStart(2, '0'); // 补全小时为两位数
      const minutes = String(date.getMinutes()).padStart(2, '0'); // 补全分钟为两位数
      const seconds = String(date.getSeconds()).padStart(2, '0'); // 补全秒为两位数
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

</script>
    
    
<style scoped>
.container{
    position: relative;
    margin: 12px;
    width: 586px;
    height: 352px;
}
.title{
    font-size: 18px;
    top: 10px;
    z-index: 999;
}
.content{
    display: flex;
    padding: 10px;
    flex-wrap: wrap;
}
.item {
    min-width: 150px;
    height: 80px; 
    border: 1px solid #768778;
    border-radius: 8px;
    margin: 12px; 
    overflow: hidden; 
    padding: 12px; 
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #e0e0e0, #ffffff); 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    transition: all 0.3s ease-in-out; 
}

.item:hover {
    filter: drop-shadow(3px 2px 10px black);
    transform: scale(1.05); 
    background: linear-gradient(135deg, #d0d0d0, #f0f0f0); 
}

.item:active {
    transform: scale(0.98); 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
}
</style>