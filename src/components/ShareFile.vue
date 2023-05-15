<template>
  <!-- 对话框 - 分享文件 -->
  <el-dialog v-model="ShareDialog.visible" :title="title" width="32%" @close="result=false">
    <el-row style="margin-bottom: 20px" align="middle" justify="center" v-if="!result">
      <el-col :span="6"><el-text tag="b" size="large">选择有效期</el-text>
      </el-col>
      <el-col :span="10"><el-select v-model="expirationSelect.exp" class="m-2" placeholder="Select" size="large">
          <el-option v-for="item in expirationSelect.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select></el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" align="middle" justify="center" v-if="!result">
      <el-col :span="6"><el-text tag="b" size="large">分享形式</el-text>
      </el-col>
      <el-col :span="10"><el-select v-model="shareForm.form" class="m-2" placeholder="Select" size="large">
          <el-option v-for="item in shareForm.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select></el-col>
    </el-row>

    <el-row style="margin-bottom: 20px" v-if="result">
      <el-col>
        <el-text tag="b" size="large">分享链接：</el-text>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px" v-if="result">
      <el-col>
        <el-input readonly v-model="link">
          <template #suffix>
            <el-icon @click="copyLink">
              <CopyDocument />
            </el-icon>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ShareDialog.visible = false" v-if="!result">取消</el-button>
        <el-button v-if="!result" type="primary" @click="handleShareSubmit" :loading="ShareDialog.loading">
          创建分享
        </el-button>
        <el-button v-if="result" type="primary" @click="copyLink">
          复制链接
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { computed, reactive, ref } from "vue";
import { getDirTree, moveFile } from "../request/file";
import { CopyDocument } from "@element-plus/icons-vue";
import { shareFile } from "../request/share";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();


const props = defineProps(["tableData"]);

const ShareDialog = reactive({
  visible: false,
  loading: false,
});

const title = ref();
const expirationSelect = reactive({
  exp: 7,
  options: [
    {
      value: 7,
      label: "7天",
    },
    {
      value: 30,
      label: "30天",
    },
    {
      value: -1,
      label: "永久有效",
    },
  ],
});

const shareForm = reactive({
  form: 1,
  options: [
    // {
    //   value: 0,
    //   label: "私密链接",
    // },
    {
      value: 1,
      label: "公开链接",
    },
  ],
});

// 处理分享事件
const handleShare = (row) => {
  title.value = "要分享的文件为：" + row.filename;
  userFileId.value = row.userFileId;
  // 打开对话框
  ShareDialog.visible = true;
};

const userFileId = ref();

const baseUrl = computed(() => {
  // 获取当前页面地址，如http://localhost:8080/admin/index
  let wPath = window.document.location.href;
  let pos = wPath.lastIndexOf(":");
  pos += wPath.substring(pos).indexOf("/")
  // 获取主机地址，如：http://localhost:8080
  let localhostPath = wPath.substring(0, pos);
  return localhostPath
})

// 是否已获取到结果
const result = ref(false);
const link = ref();

// 提交分享请求
const handleShareSubmit = () => {
  shareFile({
    userFileId: userFileId.value,
    exp: expirationSelect.exp,
    form: shareForm.form,
  })
    .then((res) => {
      console.log(res);
      ElMessage({
        type: "success",
        message: res.message,
      });
      result.value = true;
      link.value = baseUrl.value + res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 复制链接
const copyLink = () => {
  navigator.clipboard.writeText(link.value).then(
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

defineExpose({ handleShare });
</script>