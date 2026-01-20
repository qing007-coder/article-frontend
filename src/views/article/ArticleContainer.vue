<template>
  <div class="main-container">
    <div class="content-wrapper">
      <div class="filter-section">
        <div class="search-box">
          <el-input v-model="keyword" placeholder="搜你所想..." @keyup.enter="handleSearch">
            <template #append>
              <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
            </template>
          </el-input>
        </div>
        
        <div class="category-tags">
          <span class="tag-label">文章分类:</span>
          <el-check-tag
            :checked="activeCategory === 'all'"
            @change="filterByCategory('all')"
          >全部</el-check-tag>

          <el-check-tag
            v-for="cat in categories"
            :key="cat.id"
            :checked="activeCategory === cat.name"
            @change="filterByCategory(cat.ID)"
          >
            {{ cat.name }}
          </el-check-tag>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="18">
          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="最新" name="latest" />
            <el-tab-pane label="🔥 热门" name="hot" />
          </el-tabs>

          <div v-loading="loading" class="list-container">
            <el-card 
              v-for="item in articles" 
              :key="item.id" 
              class="article-card"
              @click="$router.push(`/article/main/${item.id}`)"
            >
              <h3 class="title">{{ item.title }}</h3>
              <p class="summary">{{ item.content?.slice(0, 100) }}...</p>
              <div class="card-meta">
                <span>分类: <el-tag size="small">{{ item.category }}</el-tag></span>
                <span class="stats">
                  <el-icon><View /></el-icon> {{ item.read }}
                  <el-divider direction="vertical" />
                  <el-icon><Pointer /></el-icon> {{ item.like }}
                </span>
              </div>
            </el-card>
            <el-empty v-if="articles.length === 0" />
          </div>
        </el-col>

        <el-col :span="6">
          <div class="rank-card hot-rank">
            <div class="rank-title">24h 热门排行</div>
            <div v-for="(h, i) in hotList" :key="h.id" class="rank-item" @click="$router.push(`/article/main/${h.id}`)">
              <span class="num">{{ i+1 }}</span> {{ h.title }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, View, Pointer } from '@element-plus/icons-vue'
import { 
  searchArticleService, 
  getHottestArticles, 
  getArticlesByCategory,
  getCategoryList 
} from '@/api/article.js'

// 状态变量
const categories = ref([])    
const articles = ref([])      
const hotList = ref([])       
const activeCategory = ref('all')
const activeTab = ref('latest')
const keyword = ref('')
const loading = ref(false)

// 1. 获取分类配置
const fetchCategoryConfig = async () => {
  const res = await getCategoryList()
  categories.value = res.data.data.data || []
}

// 2. 核心搜索逻辑 (修复部分)
const handleSearch = async () => {
  activeCategory.value = 'all' // 搜索时重置分类选中
  loading.value = true
  try {
    // 调用 search 接口，传入关键词
    const res = await searchArticleService(keyword.value)
    articles.value = res.data.data.data || []
  } finally {
    loading.value = false
  }
}

// 3. 按分类筛选
const filterByCategory = async (catName) => {
  activeCategory.value = catName
  keyword.value = '' // 切换分类时清空搜索框
  loading.value = true
  try {
    if (catName === 'all') {
      const res = await searchArticleService("") 
      articles.value = res.data.data.data
    } else {
      const res = await getArticlesByCategory(catName)
      articles.value = res.data.data.data
    }
  } finally {
    loading.value = false
  }
}

// 4. 获取侧边栏榜单
const loadSidebar = async () => {
  const res = await getHottestArticles()
  hotList.value = res.data.data.data || []
}

// 5. Tab 切换
const handleTabChange = async (name) => {
  activeCategory.value = 'all'
  loading.value = true
  if (name === 'hot') {
    const res = await getHottestArticles()
    articles.value = res.data.data.data
    loading.value = false
  } else {
    handleSearch() // 默认走搜索（全量）
  }
}

const formatTime = (t) => t ? new Date(t).toLocaleDateString() : '-'

onMounted(() => {
  fetchCategoryConfig()
  handleSearch() // 初始加载全部
  loadSidebar()
})
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  padding: 24px;
  background: #f5f7fa; /* 画布灰，非常重要 */
}


.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 过滤区增加底部细线，增强分隔感 */
.filter-section {
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f2f5;
}

.category-tags {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 文章卡片：在纯白背景下，增加边框和微弱阴影 */
.article-card {
  margin-bottom: 16px;
  cursor: pointer;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  transition: all 0.25s ease;
}

.article-card:hover {
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.title {
  font-size: 20px; /* 标题稍微放大 */
  margin: 0 0 12px 0;
  color: #1d2129;
}

.summary {
  font-size: 14px;
  color: #4e5969;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* 侧边栏排行榜：增加背景色块区分 */
.side-bar {
  position: sticky;
  top: 24px;
}

.rank-card {
  padding: 20px;
  background: linear-gradient(180deg, #ffffff, #fafafa);
  border-radius: 12px;
  border: 1px solid #ebeef5;
}


.rank-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1d2129;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #f0f2f5;
}

.rank-num {
  font-style: italic;
  font-weight: bold;
  margin-right: 12px;
  color: #86909c;
}

.rank-num.top {
  color: #ff4d4f;
}

/* 标签页样式微调 */
:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #e5e6eb;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}

</style>