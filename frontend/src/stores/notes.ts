import { defineStore } from "pinia";
import { type Note } from "@/interface/interface";
import { ref } from "vue"

export const useNotesStore = defineStore(
    "notes",
    () => {
        let noteList = ref<Array<Note>>([]);
        return {
            noteList
        }
    },
    {
        persist: true,
    },
);
