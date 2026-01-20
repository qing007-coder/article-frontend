<template>
  <div class="article-list-page">
    <!-- 搜索区 -->
    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="请输入文章标题关键词"
        clearable
        prefix-icon="Search"
        style="width: 300px; margin-right: 10px;"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 文章列表 -->
    <el-card v-for="item in articles" :key="item.id" shadow="hover" class="article-item" @click="$router.push(`/article/main/${item.id}`)">
      <div class="article-header">
        <h3 class="title">{{ item.title }}</h3>
        <div class="meta">
          <span>👍 {{ item.like }}</span>
          <span>👁️ {{ item.read }}</span>
          <span>{{ formatTime(item.time) }}</span>
        </div>
      </div>
      <div class="content">
        {{ item.content }}
      </div>
    </el-card>

    <!-- 无数据时 -->
    <el-empty v-if="articles.length === 0" description="暂无文章" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchArticleService } from '@/api/article.js'

const articles = ref([])       // 后端返回的所有文章
const keyword = ref('')           // 搜索关键词

// 获取后端数据
const loadArticles = async () => {
  const res = await searchArticleService("")
  articles.value = res.data.data.data
}

const handleSearch = async () => {
  const res = await searchArticleService(keyword.value)
  articles.value = res.data.data.data
}

onMounted(() => {
  loadArticles()
})


// 时间格式化
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', { hour12: false })
}
</script>

<style scoped>
.article-list-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.article-item {
  margin-bottom: 15px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.meta {
  font-size: 13px;
  color: #999;
}

.meta span {
  margin-left: 10px;
}

.content {
  margin-top: 8px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}
</style>
