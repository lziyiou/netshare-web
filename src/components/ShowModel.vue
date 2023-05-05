<template>
    <!-- v-if 只有左侧菜单选择图片时 才展示此组件 -->
    <el-radio-group
      v-if="filetype === '1'"
      v-model="currentshowModel"
    >
      <el-radio-button :label="0">
        <i class="el-icon-tickets"></i> 列表
      </el-radio-button>
      <el-radio-button :label="1">
        <i class="el-icon-s-grid"></i> 网格
      </el-radio-button>
      <!-- <el-radio-button :label="2">
        <i class="el-icon-date"></i> 时间线
      </el-radio-button> -->
    </el-radio-group>
</template>

<script lang="ts" setup>

    import { computed, nextTick, onMounted, reactive, ref } from 'vue'
    import { useStore } from 'vuex'
    import { useRoute, useRouter } from "vue-router";
    const store = useStore()

    
    const router = useRouter()
    const route = useRoute()

    const filetype = computed(() => {
        return route.query.filetype ? route.query.filetype : "0"
    })

    const currentshowModel = computed({
        // getter
        get() {
            return store.getters.showModel;
        },
        // setter
        set(val) {
            // 注意：我们这里使用的是解构赋值语法
            store.commit("changeShowModel", val); //  修改查看模式
        }
    })
</script>