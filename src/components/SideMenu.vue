<template>
<el-row class="tac">
    <el-col>
        <el-menu
            class="el-menu-vertical-demo"
            :router="true"
            :default-active="activeIndex.toString()"
        >
            <el-menu-item index="0" :route="{ name: 'Home'}">
                <el-icon><Menu /></el-icon>
                <span>全部</span>
            </el-menu-item>
            <el-menu-item index="3" :route="{ name: 'Home', query: { filetype: 3 } }">
                <el-icon><VideoCamera /></el-icon>
                <span>视频</span>
            </el-menu-item>
            <el-menu-item index="2" :route="{ name: 'Home', query: { filetype: 2 } }">
                <el-icon><Document /></el-icon>
                <span>文档</span>
            </el-menu-item>
            <el-menu-item index="1" :route="{ name: 'Home', query: { filetype: 1 } }">
                <el-icon><Picture /></el-icon>
                <span>图片</span>
            </el-menu-item>
            <el-menu-item index="4" :route="{ name: 'Home', query: { filetype: 4 } }">
                <el-icon><Headset /></el-icon>
                <span>音乐</span>
            </el-menu-item>
            <el-menu-item index="5" :route="{ name: 'Home', query: { filetype: 5 } }">
                <el-icon><TakeawayBox /></el-icon>
                <span>其他</span>
            </el-menu-item>
        </el-menu>
    </el-col>
</el-row>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu,
    Picture,
    VideoCamera,
    Headset,
    TakeawayBox
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

    const activeIndex = computed(() => {
        return route.query.filetype ? route.query.filetype : 0
    })
</script>
  