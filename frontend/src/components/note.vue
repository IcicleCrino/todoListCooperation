<template>
    <div class="flex h-full w-full items-center bg-gray-200">
        <div class="h-full w-[300px] p-4">
            <div
                class="flex h-full w-full flex-col items-center rounded-lg bg-white"
            >
                <div class="mb-4 mt-4 flex w-5/6 items-center justify-center">
                    <el-input
                        v-model="searchWord"
                        @keydown.enter="searchNote(searchWord)"
                    ></el-input>
                    <el-icon
                        size="20"
                        class="ml-2 hover:cursor-pointer"
                        @click="searchNote(searchWord)"
                        ><Search
                    /></el-icon>
                </div>
                <div class="flex w-5/6 justify-between">
                    <el-button type="primary" @click="addNote()"
                        >新增</el-button
                    >
                    <el-button type="danger" @click="deleteNote(currentIndex)"
                        >删除</el-button
                    >
                    <el-button type="warning" @click="saveNote(currentIndex)"
                        >保存</el-button
                    >
                </div>
                <div
                    class="h-full w-full flex-grow flex-col overflow-scroll p-4"
                >
                    <div
                        class="flex justify-start"
                        v-for="(item, index) in displayNav"
                        :key="item.noteId"
                    >
                        <div
                            class="mb-1 w-full select-none text-gray-800 hover:cursor-pointer"
                            @click="toNote(index)"
                        >
                            {{ item.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex h-full flex-grow flex-col">
            <div class="h-[120px] w-full p-4 pr-0">
                <div
                    class="flex h-full w-full items-center justify-start rounded-lg bg-white"
                >
                    <input
                        v-model="displayTitle"
                        class="ml-8 text-3xl font-bold"
                    />
                </div>
            </div>
            <div class="m-4 w-full flex-grow">
                <div class="h-full w-full rounded-lg bg-white p-8">
                    <textarea
                        placeholder="您可以在这里编写笔记内容"
                        class="h-full w-full outline-none"
                        v-model="displayContent"
                        @blur="saveNote(currentIndex)"
                    >
                    </textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from "vue";
import axios from "axios";
import { useNotesStore } from "../stores/notes";
import toastAPI from "@/components/api/toastAPI";

import { type Note, type NoteSearchResult } from "@/interface/interface";

const NoteStore = useNotesStore();
const userId = localStorage.getItem("userId");

const title = ref<string>("请点击新增，开始编写笔记");
const content = ref<string>("");
const currentIndex = ref<number>(0);
const searchWord = ref<string>("");
const searchResult = ref<Array<NoteSearchResult>>([]);

const displayTitle = computed({
    get() {
        if (NoteStore.noteList.length <= 0) return title.value;
        else return NoteStore.noteList[currentIndex.value].title;
    },
    set(newValue) {
        if (NoteStore.noteList.length <= 0) {
            title.value = "请点击新增，开始编写笔记";
        } else {
            NoteStore.noteList[currentIndex.value].title = newValue;
        }
    },
});

const displayContent = computed({
    get() {
        if (NoteStore.noteList.length <= 0) return content.value;
        else return NoteStore.noteList[currentIndex.value].content;
    },
    set(newValue) {
        if (NoteStore.noteList.length <= 0) {
            content.value = "";
        } else {
            NoteStore.noteList[currentIndex.value].content = newValue;
        }
    },
});

const displayNav = computed(() => {
    if (searchWord.value.length <= 0) {
        return NoteStore.noteList;
    } else {
        return searchResult.value;
    }
});

//当用户删除搜索词时，清除掉搜索结果
watchEffect(() => {
    if (searchWord.value.length <= 0) {
        searchResult.value.splice(0, searchResult.value.length);
    }
});

axios
    .get("http://localhost:3000/user/getNotes", {
        params: {
            userId: userId,
        },
    })
    .then((res) => {
        NoteStore.noteList = res.data.data;
    });

//切换到其他笔记
const toNote = (index: number) => {
    //如果是搜索模式，则需要转换一下
    if (searchWord.value.length > 0) {
        let noteId = searchResult.value[index].noteId;
        for (let i = 0; i < NoteStore.noteList.length; i++) {
            if (NoteStore.noteList[i].noteId === noteId) {
                index = i;
                break;
            }
        }
    }

    title.value = NoteStore.noteList[index].title;
    content.value = NoteStore.noteList[index].content;
    currentIndex.value = index;
};

//保存当前笔记
const saveNote = (index: number) => {
    //如果重名，则依次尝试添加后缀（1）~(120)，直到不重名为止
    let tempTitle = NoteStore.noteList[index].title;
    for (let i = 1; i < 120; i++) {
        if (isTitleDuplicated(tempTitle)) {
            tempTitle = NoteStore.noteList[index].title + "（" + i.toString() + "）";
        } else {
            break;
        }
    }
    NoteStore.noteList[index].title = tempTitle;

    //调用patch方法，更新旧笔记
    axios
        .patch("http://localhost:3000/user/updateNote", {
            title: NoteStore.noteList[index].title,
            content: NoteStore.noteList[index].content,
            noteId: NoteStore.noteList[index].noteId,
        })
        .then(() => {
            toastAPI.successNotice("笔记保存成功");
        });
};

const isTitleDuplicated = (title: string) => {
    for (let i = 0; i < NoteStore.noteList.length; i++) {
        if (NoteStore.noteList[i].title === title) {
            return true;
        }
    }
    return false;
};

//新增笔记
const addNote = () => {
    let newNote: Note = {
        title: "新标题",
        content: "",
    };

    //如果重名，则依次尝试添加后缀（1）~(120)，直到不重名为止
    let tempTitle = newNote.title;
    for (let i = 1; i < 120; i++) {
        if (isTitleDuplicated(tempTitle)) {
            tempTitle = newNote.title + "（" + i.toString() + "）";
        } else {
            break;
        }
    }
    newNote.title = tempTitle;

    NoteStore.noteList.push(newNote);
    currentIndex.value = NoteStore.noteList.length - 1;

    axios
        .post("http://localhost:3000/user/addNote", {
            userId: userId,
            title: newNote.title,
            content: newNote.content,
        })
        .then((res) => {
            NoteStore.noteList[currentIndex.value].noteId = res.data.noteId;
            toastAPI.successNotice("添加笔记成功");
        });
};

//删除笔记
const deleteNote = (index: number) => {
    let noteId = NoteStore.noteList[index].noteId;
    NoteStore.noteList.splice(index, 1);
    if (currentIndex.value <= 0) {
        if (NoteStore.noteList.length >= 1) {
            currentIndex.value++;
        }
    }
    currentIndex.value--;
    axios.delete("http://localhost:3000/user/deleteNote/" + noteId).then(() => {
        toastAPI.successNotice("成功删除笔记");
    });
};

//查找笔记标题
const searchNote = (searchWord: string) => {
    axios
        .post("http://localhost:3000/user/searchNote", {
            title: searchWord,
        })
        .then((res) => {
            console.log(res.data.data);
            searchResult.value = res.data.data;
            console.log(searchResult.value);
        });
};
</script>

<style lang="scss" scoped>
input {
    outline: none;
}
</style>
