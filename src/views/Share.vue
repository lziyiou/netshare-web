<template>
  <el-container>
    <el-aside>
      <el-card class="box-card" align="center" style="width: 280px; height: 450px">
        <template #header>
          <div class="card-header">
            <span>分享者信息</span>
          </div>
        </template>
          <el-icon size="100">
            <User />
          </el-icon>
          <br>
          <el-text class="mx-1" size="large">{{ shareUser.username }}</el-text>
          <el-divider />
          此分享 <el-text class="mx-1" size="large" type="warning">{{ remainder }}</el-text> 内有效，请尽快保存
      </el-card>
    </el-aside>
    <el-container>
      <el-main>
        <BreadCrumb rootPath="Share"></BreadCrumb>
        <FileTable :tableData="tableData" :isShare="true" :loading="false"></FileTable>
      </el-main>
      <el-footer>
        <!-- 分页 -->
        <FilePagination :pageData="pageData" @current-change="currentChange" @size-change="sizeChange" />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref, watch } from "vue";
import BreadCrumb from "../components/BreadCrumb.vue";
import FilePagination from "../components/FilePagination.vue";
import FileTable from "../components/FileTable.vue";
import { useRoute, useRouter } from "vue-router";
import { getShareFile } from "../request/share";
import { User } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

// 分页数据
const pageData = reactive({
  currentPage: 1, //   页码
  pageCount: 30, //  每页显示条目个数
  total: 0, //  总数
});
// 页码数变化 重新请求数据
const currentChange = (value) => {
  pageData.currentPage = value;
  getData()
};
const sizeChange = (value) => {
  pageData.pageCount = value;
  getData()
};

const tableData = ref([]);

const link = computed(() => {
  return route.path
})

const filepath = computed(() => {
  return route.query.filepath ? route.query.filepath : "/";
});

const shareUser = reactive({
  username: "",
})
const remainder = ref("")

// 请求分享资源
const getData = () => {
  getShareFile(link.value, {
    filepath: filepath.value,
    // 分页信息
    currentPage: pageData.currentPage,
    pageCount: pageData.pageCount,
  }).then((res) => {
    tableData.value = res.data.list;
    pageData.total = res.data.total; //  分页组件 - 文件总数赋值
    // 用户信息
    shareUser.username = res.data.shareUser.username
    // 剩余时间
    remainder.value = res.data.remainder
  });
};

//监视路由变化
watch(route, async (newVal, oldVal) => {
  if (route.path.indexOf("/s/") !== -1)
    getData()
});

onMounted(() => {
  getData()
})
</script>