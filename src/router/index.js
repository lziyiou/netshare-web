import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", //  主页
      name: "Home",
      component: () =>
        import("../views/HomeView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/s/:catchAll(.*)", //  分享页面
      name: "Share",
      component: () =>
        import("../views/Share.vue"),
    },
    {
      path: "/login", //  登录页面
      name: "Login",
      component: () =>
        import("../views/LoginView.vue"),
    },
    {
      path: "/register", //  注册页面
      name: "Register",
      component: () =>
        import("../views/RegisterView.vue"),
    },
    {
      path: "/:catchAll(.*)", //  404页面
      name: "404",
      component: () =>
        import("../views/404View.vue"),
    },
  ]
})

export default router
