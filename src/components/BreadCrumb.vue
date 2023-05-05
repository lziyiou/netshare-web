<template>
  <div style="margin-top: 20px">
    <!-- 按类型查看文件时 -->
    <el-breadcrumb
      class="bread-crumb"
      v-if="filetype != 0"
      :separator-icon="ArrowRight"
    >
      <el-breadcrumb-item>{{ filetypeMap[filetype] }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按路径查看文件时 -->
    <el-breadcrumb :separator-icon="ArrowRight" v-else>
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="index"
        :to="{ name: rootPath, query: { filepath: item.path } }"
        >{{ item.name }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>
  
<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["rootPath"]);  // 页面的根目录

const router = useRouter();
const route = useRoute();

const filetype = computed(() => {
  let filetype = route.query.filetype ? route.query.filetype : "0";
  return parseInt(filetype as string)
});

const filetypeMap = {
  1: "全部图片",
  2: "全部文档",
  3: "全部视频",
  4: "全部音乐",
  5: "其他",
};
const breadCrumbList = computed(() => {
  var res = [{ name: "全部文件", path: "/" }];
  var path = route.query.filepath; 
  let pathList = path ? (path as string).split("/").slice(1, -1) : [];

  pathList.forEach((element, index) => {
    res.push({
      name: element,
      path: `${res[index].path}${element}/`,
    });
  });
  return res;
});
</script>