<template>
  <div class="approval-detail" v-if="article">
    <h2 class="text">文章审批</h2>
    <p class="text"><strong>ID:</strong> {{ article.id }}</p>
    <p class="text"><strong>标题:</strong> {{ article.title }}</p>
    <div class="content">
      <strong>内容:</strong>
      <p class="content">{{ article.content }}</p>
    </div>

    <div class="btn-group">
      <button class="approve" @click="handleApproval('1')">通过</button>
      <button class="reject" @click="handleApproval('0')">不通过</button>
    </div>
  </div>

  <div v-else>
    <p>正在加载文章...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getJudgeArticleDetail,  judgeArticles} from '@/api/article.js'
import { ElMessage } from 'element-plus'

// 获取路由参数
const route = new useRoute()
const router = useRouter()
const articleId = route.params.articleId

// 存储文章数据
const article = ref({})

// 加载文章详情
const loadArticle = async () => {
  
    const res = await getJudgeArticleDetail(articleId)
    article.value = res.data.data.articleInfo   // 假设后端返回 { id, title, content }
}

onMounted(() => {
  loadArticle()
})

// 提交审批
const handleApproval = async (status) => {
  await judgeArticles(articleId, status)
  router.push('/privilege/getArticleInQueue')
}
</script>

<style scoped>
.content {
  margin: 12px 0;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}
.btn-group {
  margin-top: 20px;
}
button {
  margin-right: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.approve {
  background: #52c41a;
  color: #fff;
  border: none;
}
.reject {
  background: #ff4d4f;
  color: #fff;
  border: none;
}

.text {
  color: white;
}
</style>
