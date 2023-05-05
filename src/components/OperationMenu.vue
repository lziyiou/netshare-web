<template>
    <el-button-group class="ml-4">
        <el-button 
            type="primary" 
            :icon="FolderAdd" 
            :disabled="filetype!='0'?true:false"
            @click="addFolderDialog.visible = true"
        >新建文件夹
        </el-button>
        <el-button
          type="primary"
          :icon="Upload"
          :disabled="filetype !== '0'"
          @click="uploadDrawer = true"
        >上传文件
        </el-button>
        <el-button type="primary" :icon="Delete" @click="deleteSelected" />
    </el-button-group>

    <!-- 对话框 - 新建文件夹 -->
    <el-dialog
        v-model="addFolderDialog.visible"
        title="新建文件夹"
        width="40%"
    >
        <el-form
            :model="addFolderForm"
            :rules="addFolderRules"
            label-position="top"
            ref="addFolderFormRef"
        >
            <el-form-item label="文件夹名称" prop="name">
                <el-input v-model="addFolderForm.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addFolderDialog.visible = false">取消</el-button>
                <el-button 
                    type="primary" 
                    @click="handleAddFolderSubmit"
                    :loading="addFolderDialog.loading"
                    >
                提交
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-drawer
      v-model="uploadDrawer"
      title="上传文件"
    >
      <uploader
        :options="options"
        :file-status-text="statusText"
        class="uploader-example"
        ref="uploaderRef"
        @file-complete="fileComplete"
        @file-added="handleFileAdded"
        @complete="complete"
        @fileSuccess="fileSuccess"
        :autoStart="true"
      >
        <uploader-unsupport></uploader-unsupport>
          <uploader-btn>选择文件</uploader-btn>
        <uploader-list></uploader-list>
      </uploader>
    </el-drawer>
</template>

<script setup lang="ts">
import {
  FolderAdd,
  Delete,
  Upload
} from '@element-plus/icons-vue'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { createDir, deleteFile } from '../request/file'
import { useRoute, useRouter } from "vue-router";
import type { UploadProps, UploadUserFile } from 'element-plus'
import Cookies from "js-cookie";
import SparkMD5 from "spark-md5";
import { ElMessage, ElMessageBox } from 'element-plus'

  const router = useRouter()
  const route = useRoute()

  const props = defineProps(['filetype', 'getSelectRows', 'tableData'])
  defineEmits(['uploadFileClick'])

const addFolderDialog = reactive({
    visible: false,
    loading: false
})
const addFolderForm = reactive({
    name: ""
})
const addFolderRules = reactive({
    name: [
        {
            required: true,
            message: "请输入文件夹名称",
            trigger: "blur, change",
        }
    ]
})


const filepath = computed(() => {
  return route.query.filepath ? route.query.filepath : '/'
})

const addFolderFormRef = ref()
function handleAddFolderSubmit() {
  addFolderFormRef.value.validate((valid)=>{
      if (valid) {
        addFolderDialog.loading = true; //  对话框的确定按钮打开loading状态
        // 表单校验通过 - 调用新建文件夹接口
        createDir({
          filename: addFolderForm.name,
          filepath: filepath.value, //  文件路径
          // isDir: 1, //  是否为文件夹：1 表示文件夹 0 表示文件
        }).then(
          (res) => {
            addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
            if (res.success) {
              ElMessage({
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
              addFolderDialog.visible = false; //  关闭对话框

              // 刷新数据
              props.tableData.push(res.data)
              
            } else {
              ElMessage.error(res.message);
            }
          },
          (error) => {
            addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
            console.log(error);
          }
        );
      }
    }) 
  }


  // 上传组件配置
  const uploadDrawer = ref(false) // 上传文件抽屉

  const uploaderRef = ref()

  const options = {
    target: '/api/upload', 
    testChunks: true,
    maxChunkRetries: 5, //  并发上传数，默认 3
    chunkSize: 3 * 1024 * 1024, //  每个分片的大小
    fileParameterName: "multipartFile",
    // 服务器分片校验函数，秒传及断点续传基础
    checkChunkUploadedByResponse: function (chunk, message) {
      let data = JSON.parse(message).data;
      if (data.skipUpload) {
        // 分片已存在于服务器中
        return true;
      }
      return (data.uploaded || []).indexOf(chunk.offset + 1) >= 0;
    },
    headers: {
      token: Cookies.get("token")
    },
    query: ()=>{
      return {filepath: filepath.value}
    }
  }

  const statusText = {
    success: '上传成功',
    error: '错误',
    uploading: '上传中',
    paused: '暂停',
    waiting: '等待'
  }

  const complete = () => {
    
  }

  const fileSuccess = (rootFile, file, message, chunk)=>{
    var obj = JSON.parse(message)
    props.tableData.push(obj.data.userFile)
  }

  const fileComplete = () => {

  }

  const handleFileAdded = (file) => {
    console.log(filepath.value);
    
  }

  // 批量删除文件
  const deleteSelected = () => {
    ElMessageBox.confirm(
      '确定删除选中文件吗?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        props.getSelectRows().forEach(row => {
          deleteFile({
            userFileId: row.userFileId
          }).then((res) => {
            // 刷新数据
            for (let i=0; i<props.tableData.length; i++) {
              if (props.tableData[i].userFileId == row.userFileId)
              props.tableData.splice(i, 1);
            }
          },
          (error) => {
            // console.log(error);
          })
        });
        
        ElMessage({
          type: 'success',
          message: '删除成功',
        })

      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
  }


</script>

<style scoped>
  
  .uploader-example .uploader-btn {
    margin-right: 8px;
  }
  .uploader-list {
    margin-top: 10px;
  }
</style>