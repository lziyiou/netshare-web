<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-aside width="auto"><SideMenu /></el-aside>
        <el-container>
          <el-main>
            <el-row>
              <!-- 操作区 -->
              <el-col :span="20">
                <OperationMenu
                  :filetype="filetype"
                  :getSelectRows="getSelectRows"
                  :tableData="tableData"
                />
              </el-col>
              <!-- 网格列表切换部分 -->
              <el-col :span="4">
                <ShowModel v-if="filetype === '1'"></ShowModel>
              </el-col>
            </el-row>
            <!-- 面包屑 -->
            <BreadCrumb root-path="Home" />
            <!-- 列表模式(数据部分) -->
            <FileTable
              ref="fileTableRef"
              :tableData="tableData"
              :loading="loading"
              @handle-move="handleMove"
              @handle-share="handleShare"
              v-if="(showModel === 0 && filetype === '1') || filetype !== '1'"
            />
            <!-- 网格模式 v-if 当左侧菜单选择图片且查看模式为"网格"时显示 -->
            <FileGrid
              :tableData="tableData"
              :loading="loading"
              v-if="filetype === '1' && showModel === 1"
            ></FileGrid>

          </el-main>
          <el-footer>
            <!-- 分页 -->
            <FilePagination
              :pageData="pageData"
              @current-change="currentChange"
              @size-change="sizeChange"
            />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
  <!-- 隐藏部分 -->
  <!-- 移动文件 -->
  <moveFile ref="moveFileRef" :tableData="tableData"></moveFile>
  <shareFile ref="shareFileRef"></shareFile>
</template>

<script setup>
import BreadCrumb from "../components/BreadCrumb.vue";
import SideMenu from "../components/SideMenu.vue";
import FileTable from "../components/FileTable.vue";
import FilePagination from "../components/FilePagination.vue";
import ShowModel from "@/components/ShowModel.vue";
import FileGrid from "@/components/FileGrid.vue";
import OperationMenu from "../components/OperationMenu.vue";
import MoveFile from "../components/MoveFile.vue";
import ShareFile from "@/components/ShareFile.vue"
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getFileListByPath, getFileListByType } from "../request/file";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const fileTableRef = ref();
const getSelectRows = () => {
  return fileTableRef.value.tableRef.getSelectionRows();
};

const router = useRouter();
const route = useRoute();

const store = useStore();

const loading = ref(false);
const tableData = ref([]);

const pageData = reactive({
  currentPage: 1, //   页码
  pageCount: 30, //  每页显示条目个数
  total: 0, //  总数
});
const filetype = computed(() => {
  return route.query.filetype ? route.query.filetype : "0";
});

const filepath = computed(() => {
  return route.query.filepath ? route.query.filepath : "/";
});

//监视路由变化
watch(route, async (newVal, oldVal) => {
  if(route.path === "/")
    getFileList();
});

// 页码数变化 重新请求数据
const currentChange = (value) => {
  pageData.currentPage = value;
  getFileList();
};
const sizeChange = (value) => {
  pageData.pageCount = value;
  getFileList();
};

function getFileList() {
  loading.value = true; // 打开表格loading状态
  if (filetype.value === "0") {
    // 左侧菜单选择的为 全部 时，根据路径，获取文件列表
    getFileDataByPath();
  } else {
    // 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
    getFileDataByType();
  }
}

function getFileDataByPath() {
  getFileListByPath({
    filepath: filepath.value,
    currentPage: pageData.currentPage,
    pageCount: pageData.pageCount,
  }).then(
    (res) => {
      loading.value = false; //  关闭表格loading状态
      if (res.success) {
        tableData.value = res.data.list;
        pageData.total = res.data.total; //  分页组件 - 文件总数赋值
      } else {
        console.log(res.message);
      }
    },
    (error) => {
      loading.value = false;
      console.log(error);
    }
  );
}
// 根据类型获取文件列表
function getFileDataByType() {
  getFileListByType({
    filetype: filetype.value, //  文件类型
    currentPage: pageData.currentPage, //  当前页码
    pageCount: pageData.pageCount, //  每页条目数
  }).then(
    (res) => {
      loading.value = false; //  关闭表格loading状态
      if (res.success) {
        tableData.value = res.data.list; // 表格数据赋值
        pageData.total = res.data.total; //  分页组件 - 文件总数赋值
      } else {
      }
    },
    (error) => {
      loading.value = false;
      console.log(error);
    }
  );
}

// 列表 | 网格状态
const showModel = computed(() => {
  return store.getters.showModel;
});

// 移动文件事件
const moveFileRef = ref()

const handleMove = (row) => {
  // 触发MoveFile组件处理移动事件
  moveFileRef.value.handleMove(row)
}

// 分享文件事件
const shareFileRef = ref()
const handleShare = (row) => {
  shareFileRef.value.handleShare(row)
}

onMounted(() => {
  getFileList();
});
</script>
