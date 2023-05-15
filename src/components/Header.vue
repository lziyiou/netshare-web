<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" :router="true" mode="horizontal" :ellipsis="false">
        <el-menu-item index="Home" :route="{ name: 'Home' }">首页</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="Login" :route="{ name: 'Login' }" v-show="!isLogin">登录</el-menu-item>
        <el-menu-item index="Register" :route="{ name: 'Register' }" v-show="!isLogin">注册 </el-menu-item>
        <!-- 为了和其他菜单样式保持一致，请一定要添加类名 el-menu-item -->
        <div class="el-menu-item exit" @click="exitButton" v-show="isLogin"> 退出 </div>
        <!-- 为了和其他菜单样式保持一致，请一定要添加类名 el-menu-item -->
        <el-popover placement="bottom" title="" width="500" :hide-after="500" trigger="hover" @show="getUserData">
            <template #reference>
                <div class="el-menu-item username" v-show="isLogin">
                    <!-- 图标来自于Element UI官方图标库 -->
                    <el-icon>
                        <User />
                    </el-icon>{{ username }}
                </div>
            </template>
            <!-- 用户资料区 -->
            <el-text>我的分享</el-text>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="filename" label="文件名">
                    <template #default="scope">
                        <el-text class="w-100px" truncated>{{ scope.row.filename }}</el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="link" label="链接">
                    <template #default="scope">
                        <el-link type="primary" :underline="false" @click="copyLink(scope.row.link)">复制链接</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-text class="w-100px" truncated>
                            <el-text class="mx-1" size="large" type="warning">{{ scope.row.status }}</el-text> <el-text class="mx-1" v-if="scope.row.status !== '永久有效'">后过期</el-text>
                        </el-text>
                    </template>
                </el-table-column>
            </el-table>
        </el-popover>
    </el-menu>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Cookies from "js-cookie";
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus';
import { User } from '@element-plus/icons-vue'
import { getUserInfo } from "../request/user";

const store = useStore()
const router = useRouter()
const route = useRoute()

const activeIndex = computed(() => {
    return route.name
})
const isLogin = computed(() => {
    return store.getters.isLogin
})
const username = computed(() => {
    return store.getters.username
})

function exitButton() {
    Cookies.set("token", "");
    ElMessage({
        message: '退出登录成功！',
        type: 'success',
        duration: 1000
    })
    router.replace({ path: "/login" }); //  退出登录后跳转到登录页面

}


const baseUrl = computed(() => {
    // 获取当前页面地址，如http://localhost:8080/admin/index
    let wPath = window.document.location.href;
    let pos = wPath.lastIndexOf(":");
    pos += wPath.substring(pos).indexOf("/")
    // 获取主机地址，如：http://localhost:8080
    let localhostPath = wPath.substring(0, pos);
    return localhostPath
})

// 分享数据
const tableData = ref([])

const getUserData = () => {
    getUserInfo().then(res => {
        tableData.value = res.data
        tableData.value.forEach(item => {
            (item as any).link = baseUrl.value + (item as any).link
        })
    })
}



// 复制链接
const copyLink = (link) => {
    navigator.clipboard.writeText(link).then(
        () => {
            ElMessage({
                type: "success",
                message: "复制成功",
            });
            /* Resolved - 文本被成功复制到剪贴板 */
        },
        () => {
            console.error("Failed to copy");
            /* Rejected - 文本未被复制到剪贴板 */
        }
    );
};









</script>

<style scoped>
.flex-grow {
    flex-grow: 1;
}
</style>