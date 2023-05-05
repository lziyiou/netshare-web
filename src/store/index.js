import { createStore } from 'vuex'

import user from "./module/user"
import file from "./module/file"

const store = createStore({
  state: {
    //
  },
  getters: {
      isLogin: (state) => state.user.isLogin,
      username: (state) => state.user.username,
      userId: (state) => state.user.userId,
      userInfoObj: (state) => state.user.userInfoObj,
      // 查看模式 - 0 列表 | 1 网格 | 2 时间线
      showModel: (state) => (state.file.showModel === null ? 0 : Number(state.file.showModel))
  },
  mutations: {
      //
  },
  actions: {
    //
  },
  modules: {
    user,
    file
  },
})

export default store
