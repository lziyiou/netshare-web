

export default {
    state: {
        showModel: sessionStorage.getItem('showModel') //  查看模式 - 0 列表 | 1 网格
    },
    mutations: {
        // 切换查看模式
        changeShowModel(state, data) {
            sessionStorage.setItem('showModel', data)
            state.showModel = data
        }
    },
    
}