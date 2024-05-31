<template>
    <el-card class="content">
        <top-bar class="btn"></top-bar>
        <div class="boxs">
            <Box
                v-for="(item, index) in data.title"
                :title="item"
                :frontColor="color"
                :quadrant="index"
            />
        </div>
    </el-card>
</template>

<script setup>
import topBar from "./topBar.vue";
import Box from "./todoBox.vue";

const data = {
    title: ["紧急且重要", "不紧急但重要", "紧急但不重要", "既不紧急也不重要"],
    color: ["red", "green", "blue", "gray"],
};
</script>

<style scoped>
.content {
    margin: 15px;
    min-height: 98vh;
    top: 0;
    left: 0;
    position: relative;
}
.btn {
    position: fixed;
    right: 10px;
    top: 30px;
}
.boxs {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
</style>
