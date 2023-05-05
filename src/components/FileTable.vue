<template>
  <el-table :data="tableData" style="width: 100%; margin-top: 20px" max-height="465" height="465" stripe
    v-loading="loading" @row-click="handleRow" :row-class-name="tableRowClassName" ref="tableRef">
    <el-table-column type="selection"></el-table-column>
    <el-table-column type="index" width="70" label="序号" align="center" />
    <el-table-column prop="filename" label="文件名">
      <template #default="scope">
        <el-tooltip :disabled="scope.row.isDir == 1" placement="right" effect="light">
          <template #content> {{ scope.row.filename }} </template>
          <el-text class="w-100px" truncated>{{ scope.row.filename }}</el-text>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="filetype" label="类型" width="110" align="center">
      <template #default="scope">
        <span>{{ calculateFiletype(scope.row.extendName) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="filesize" sortable label="大小" width="150" align="center">
      <template #default="scope">
        <span>{{ calculateFilesize(scope.row.filesize) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="uploadTime" sortable label="修改日期" width="210" align="center">
      <template #default="scope">
        <span>{{ calculateDateTime(scope.row.uploadTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="240" align="center">
      <template #default="scope">
        <el-button link type="primary" size="small" :icon="Download" @click.stop="handleDownload(scope.row)"
          v-show="!scope.row.isDir"></el-button>
        <el-popconfirm v-if="!isShare" title="确定要删除吗？" @confirm="handleDelete(scope.row)">
          <template #reference>
            <el-button v-if="!isShare" link type="primary" size="small" @click.stop="" :icon="Delete"></el-button>
          </template>
        </el-popconfirm>
        <!-- 分享 -->
        <el-button v-if="!isShare" link type="primary" size="small" @click.stop="$emit('handleShare', scope.row)"
          :icon="Share"></el-button>
        <el-button v-if="!isShare" link type="primary" size="small" @click.stop="$emit('handleMove', scope.row)"
          :icon="Rank"></el-button>
        <el-button v-if="!isShare" link type="primary" size="small" :icon="EditPen"
          @click.stop="handleRename(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="renameDialog.visible" title="重命名" width="40%">
    <el-form :model="renameDialog" :rules="renameDialog.rules" label-position="top" ref="addFolderFormRef">
      <el-form-item label="请输入新的名称" prop="name">
        <el-input v-model="renameDialog.newName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleRenameSubmit"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 图片展示区 -->
  <el-image-viewer @close="closeImgViewer" :url-list="imageList" v-if="showImageViewer" :initial-index="initialIndex" />
  <!-- 视频展示区 -->
  <el-dialog v-model="videoDialogVisible" width="auto" destroy-on-close :title="videoTitle" align-center center>
    <video ref="videoRef" controls width="720" height="480"></video>
    <template #footer>
      <span class="dialog-footer"> </span>
    </template>
  </el-dialog>
</template>
  
<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { deleteFile, download, renameFile } from "../request/file";
import { nextTick, onMounted, reactive, ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import {
  FolderAdd,
  Delete,
  Share,
  Upload,
  Rank,
  EditPen,
  Download,
} from "@element-plus/icons-vue";
import { ca, el } from "element-plus/es/locale";
import { getImg } from "../request/file";
import jsCookie from "js-cookie";
import dashjs from "dashjs";

const router = useRouter();
const route = useRoute();
const props = defineProps(["tableData", "loading", "isShare"]);

const tableRef = ref();
defineExpose({ tableRef });

// 下载
function handleDownload(row) {
  download({
    userFileId: row.userFileId,
    isShare: props.isShare
  }).then(
    (response) => {
      const blob = new Blob([response]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = row.filename;
      link.click();
    },
    (error) => {
      console.log(error);
    }
  );
}

// 删除
function handleDelete(row) {
  deleteFile({
    userFileId: row.userFileId,
  }).then(
    (res) => {
      // 删除成功提示
      ElMessage({
        message: "删除成功！",
        type: "success",
        duration: 1000,
      });
      // 刷新数据
      for (let i = 0; i < props.tableData.length; i++) {
        if (props.tableData[i].userFileId == row.userFileId)
          props.tableData.splice(i, 1);
      }
    },
    (error) => {
      console.log(error);
    }
  );
}

//  计算文件大小
function calculateFilesize(size) {
  const B = 1024;
  const KB = Math.pow(1024, 2);
  const MB = Math.pow(1024, 3);
  const GB = Math.pow(1024, 4);
  if (!size) {
    return "";
  } else if (size < KB) {
    return (size / B).toFixed(0) + " KB";
  } else if (size < MB) {
    return (size / KB).toFixed(1) + " MB";
  } else if (size < GB) {
    return (size / MB).toFixed(2) + " GB";
  } else {
    return (size / GB).toFixed(3) + " TB";
  }
}

//  格式化日期
function calculateDateTime(dateTime) {
  return new Date(dateTime).toLocaleString();
}

// 处理文件格式
function calculateFiletype(type) {
  if (type) {
    const category = {
      image: ["gif", "jpg", "jpeg", "png", "bmp", "webp"],
      video: [
        "mp4",
        "m3u8",
        "rmvb",
        "mpg",
        "avi",
        "swf",
        "3gp",
        "mkv",
        "mov",
        "flv",
      ],
      audio: [
        "mp3",
        "wav",
        "wma",
        "ogg",
        "aac",
        "flac",
        "aif",
        "au",
        "ram",
        "mmf",
        "amr",
      ],
      document: [
        "doc",
        "txt",
        "docx",
        "pages",
        "epub",
        "pdf",
        "numbers",
        "csv",
        "xls",
        "xlsx",
        "keynote",
        "ppt",
        "pptx",
        "hlp",
        "wps",
        "rtf",
        "html",
      ],
    };

    if (category.image.indexOf(type.toLowerCase()) > -1) {
      return "图片";
    } else if (category.document.indexOf(type.toLowerCase()) > -1) {
      return "文档";
    } else if (category.video.indexOf(type.toLowerCase()) > -1) {
      return "视频";
    } else if (category.audio.indexOf(type.toLowerCase()) > -1) {
      return "音频";
    } else {
      return "其他";
    }
  } else {
    return "文件夹";
  }
}

const showImageViewer = ref(false);
const imageList = ref([] as string[]);
const initialIndex = ref(0);

const closeImgViewer = () => {
  showImageViewer.value = false;
};

// 监视路由变化时，清空imageList
watch(route, async (newVal, oldVal) => {
  imageList.value = [];
});

const tableRowClassName = ({ row, rowIndex }) => {
  row.rowIndex = rowIndex;
};

// 视频块显示
const videoDialogVisible = ref(false);
const videoRef = ref();
const videoTitle = ref("");

const filepath = computed(() => {
  return route.query.filepath ? route.query.filepath : "/"
})

// 行点击事件
async function handleRow(row) {
  let isShare = false
  if (props.isShare)
    isShare = props.isShare
  //  若是目录则进入目录
  if (row.isDir) {
    router.push({
      query: {
        // filepath: `${row.filepath}${row.filename}/`,
        filepath: `${filepath.value}${row.filename}/`,
      },
    });
  } else if (calculateFiletype(row.extendName) === "图片") {
    showImageViewer.value = true;
    initialIndex.value = row.rowIndex;

    // 如果imageList为空 则初始化
    if (imageList.value.length == 0) {
      props.tableData.forEach((element) => {
        if (calculateFiletype(element.extendName) === "图片") {

          const url =
            "/api/img?userFileId=" +
            element.userFileId +
            "&tokenByQuery=" +
            jsCookie.get("token")
            + "&isShare=" + isShare;
          imageList.value.push(url);
        }
      });
    }
  } else if (calculateFiletype(row.extendName) === "视频") {
    videoDialogVisible.value = true;
    videoTitle.value = row.filename;

    const videoUrl =
      "/api/video/" +
      row.userFileId +
      "/mpd?tokenByQuery=" +
      jsCookie.get("token")
      + "&isShare=" + isShare;
    await nextTick();
    var player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.value, videoUrl, true);
  }
}

// 重命名块
const renameDialog = reactive({
  visible: false,
  newName: "",
  oldName: "",
  userFileId: -1,
  rules: {
    name: [
      {
        required: true,
        message: "请输入文件夹名称",
        trigger: "blur, change",
      },
    ],
  },
});

function handleRename(row) {
  // 打开填写新文件名的对话框
  renameDialog.visible = true;
  renameDialog.userFileId = row.userFileId;
  renameDialog.newName = row.filename;
}

const handleRenameSubmit = () => {
  // 新旧名字一样提示
  if (renameDialog.newName === renameDialog.oldName) {
    ElMessage({
      message: "新旧名字一样!",
      type: "warning",
      duration: 1000,
    });
    renameDialog.visible = false;
    return;
  }

  renameFile({
    userFileId: renameDialog.userFileId,
    newName: renameDialog.newName,
  }).then(
    (res) => {
      // 重命名成功提示
      ElMessage({
        message: "重命名成功！",
        type: "success",
        duration: 1000,
      });
      renameDialog.visible = false;
      // 刷新数据
      for (let i = 0; i < props.tableData.length; i++) {
        if (props.tableData[i].userFileId == renameDialog.userFileId)
          props.tableData[i].filename = renameDialog.newName;
      }
    },
    (error) => {
      console.log(error);
    }
  );
};

defineEmits(["handleMove", "handleShare"]);
</script>
  