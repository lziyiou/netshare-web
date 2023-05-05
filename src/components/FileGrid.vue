<template>
    <ul class="file-list" v-loading="loading" element-loading-text="加载中……">
        <li
            class="file-item"
            v-for="(item, index) in tableData"
            :key="index"
            :title="`${item.filename}`"
            @click="handleClick(index)"
            >
            <el-image
                class="file-img"
                :src="getImgSrc(item.userFileId)"
                :preview-src-list="srcList"
                :initial-index="4"
                fit="contain"
                lazy 
                />
            <div class="file-name">{{ item.filename }}</div>
        </li>
</ul>

    <!-- 图片展示区 -->
    <el-image-viewer 
      @close="closeImgViewer" 
      :url-list="imageList" 
      v-if="showImageViewer"
      :initial-index="initialIndex"
      />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getImg } from "../request/file";
import jsCookie from "js-cookie";
// 导入组件

    const props = defineProps(['tableData', 'loading'])
    const srcList = []

    const getImgSrc = (userFileId) => {
        return "/api/img?userFileId=" + userFileId +"&tokenByQuery=" + jsCookie.get('token')
    }

    
    // 处理查看图片
    const showImageViewer = ref(false)
    const imageList = ref([] as string[])
    const initialIndex = ref(0)
    
    const closeImgViewer = () => {
      showImageViewer.value = false
    }

    const handleClick = index => {
        showImageViewer.value = true
        initialIndex.value = index
        
        // 如果imageList为空 则初始化
        if (imageList.value.length == 0) {
          props.tableData.forEach(element => {
            let url = "/api/img?userFileId=" + element.userFileId +"&tokenByQuery=" + jsCookie.get('token')
            imageList.value.push(url)
          });
          
        }
    }

</script>

<style scoped>

.file-list {
  height: calc(100vh - 230px);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  list-style: none;
  overflow-y: auto;
}
.file-item {
    margin: 16px 16px 0 0;
    border-radius: 4px;
    width: 120px;
    padding: 8px;
    cursor: pointer;
    text-align: center;
}
.file-img {
    width: 100px;
    height: 100px;
}

.file-name {
    line-height: 24px;
    font-size: 12px;
    word-break: break-all;
}
</style>