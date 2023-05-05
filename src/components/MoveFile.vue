<template>
  <!-- 对话框 - 移动文件 -->
  <el-dialog v-model="MoveDialog.visible" :title="title" width="40%">
    请选择目的文件夹：
    <el-tree-select
      v-model="folderId"
      :data="folderTree"
      check-strictly
      show-checkbox
      accordion
      default-expand-all
      :default-checked-keys="[defaultKey]"
      ref="treeSelectRef"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="MoveDialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleMoveSubmit"
          :loading="MoveDialog.loading"
        >
          移动
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { nextTick, onMounted, reactive, ref } from "vue";
import { getDirTree, moveFile } from "../request/file";

const props = defineProps(["tableData"]);

const MoveDialog = reactive({
  visible: false,
  loading: false,
});

// 接收用户选择文件夹id
const folderId = ref();
// 旧目录id
const oldFolderId = ref();

// 目录结构
const folderTree = ref([]);
const userFileId = ref();

const title = ref()
const defaultKey = ref('')

// 处理移动事件
const handleMove = (row) => {
  defaultKey.value = row.parentId
  folderId.value = parseInt(row.parentId)
  
  oldFolderId.value = row.parentId;
  userFileId.value = row.userFileId;
  title.value = "您要移动的文件为：" + row.filename

  // 打开对话框
  MoveDialog.visible = true;
  // 获取目录树并展示
  getDirTree()
    .then((res) => {
      folderTree.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 提交移动请求
const handleMoveSubmit = () => {
  // 未选择目录
  if (folderId.value === undefined) {
    ElMessage({
      message: "请选择目的文件夹.",
      type: "warning",
    });
    return;
  }
  // 未更改目录
  if (folderId.value == oldFolderId.value) {
    ElMessage({
      message: "目录未更改.",
      type: "warning",
    });
    return;
  }

  moveFile({
    userFileId: userFileId.value,
    parentId: folderId.value,
  })
    .then(() => {
      ElMessage({
        message: "修改成功.",
        type: "success",
      });
      // 刷新数据
      props.tableData.forEach((element, i) => {
        if (element.userFileId === userFileId.value) {
          props.tableData.splice(i, 1);
        }
      });
      // 关对话框
      MoveDialog.visible = false;
    })
    .catch((err) => {
      console.log(err);
    });
};

defineExpose({ handleMove });
</script>