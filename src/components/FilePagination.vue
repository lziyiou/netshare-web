<template>
    <el-pagination
        :total="pageData.total"
        layout="total, prev, pager, next, sizes"
        class="pagination"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageCount"
        :page-sizes="[10, 30, 50, 100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
</template>

<script lang="ts" setup>
    const props = defineProps(['pageData'])

    function handleCurrentChange(currentPage) {
      props.pageData.currentPage = currentPage;
    }

    // 分页组件 每页显示条目个数改变
    function handleSizeChange(pageCount) {
        props.pageData.pageCount = pageCount;
    }
</script>

<style scoped>
    .pagination{
        float: right;
        margin-top: 16px;
        margin-right: 16px;
    }
</style>