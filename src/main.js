import { createApp } from 'vue';
import { store } from '@/store/index'
import { createWebHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus'
import axios from 'axios';
import App from './App.vue';
import Events from "@/components/events/Events";
import Register from "@/components/users/Register";
import Login from "@/components/users/Login";
import Profile from "@/components/users/Profile";
import {setAuthHeader} from "@/Api";

const routes = [

    {
        path: "/events",
        component: Events
    },
    {
        path: "/users/register",
        component: Register
    },
    {
        path: "/users/login",
        component: Login
    },
    {
        path: "/users/:id",
        component: Profile
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

router.beforeEach((to, _from, next) => {
    setAuthHeader(store.state.auth_token)
    const isAuthenticated = store.getters.isAuthenticated;

    if (['/users/login', '/users/register'].includes(to.path) && isAuthenticated) {
        next(`/users/${store.state.user_id}`);
    }

    if (!['/users/login', '/users/register'].includes(to.path) && !isAuthenticated) {
        next('/users/login');
    } else {
        next();
    }
});



const app = createApp(App);
app.use(router)
app.use(store)
app.use(ElementPlus)
app.config.globalProperties.axios = axios;
app.mount('#app');

