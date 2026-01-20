<script setup>
import { getJudgeArticleQueue, judgeArticles } from '@/api/article.js';
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const tableData = ref([])
const router = useRouter()

const addTableData = async () => {
  const res = await getJudgeArticleQueue()
  tableData.value.push(...res.data.data.list)
  console.log(res);
}

addTableData()
console.log(tableData.value);

const detail = async (row) => {
  router.push(`/privilege/getArticleInQueue/${row.ArticleID}`)
}


</script>

<template>
  <el-table :data="tableData" style="width: 100%" @row-click="detail">
    <el-table-column prop="ID" label="id" width="180"/>
  </el-table>
</template>

<style>
.el-table {
  margin-top: 10px;
}
</style>