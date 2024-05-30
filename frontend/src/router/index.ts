import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/login.vue"),
        },
        {
            path: "/user",
            name: "user",
            component: () => import("@/views/user/user.vue"),
            children: [
                {
                    path: "list",
                    name: "list",
                    component: () => import("@/components/list.vue"),
                },
                {
                    path: "note",
                    name: "note",
                    component: ()=> import("@/components/note.vue")
                },
                {
                    path: "tomato",
                    name: "tomato",
                    component: () => import("@/components/tomato.vue"),
                },
            ],
        },
    ],
});

export default router;
