<template>
  <div class="detail-wrapper">
    <div class="back-bar">
      <el-button link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>返回文章列表
      </el-button>
    </div>

    <el-row :gutter="24" class="main-layout">
      <el-col :span="6">
        <div class="side-card author-card">
          <div class="avatar-wrapper" @click="goToProfile(data.article.author_id)">
            <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <el-tag size="small" type="success" class="status-badge">作者</el-tag>
          </div>
          
          <h3 class="author-name" @click="goToProfile(data.author.ID)">
            {{ data.author.Name || data.author.Account || '未知用户' }}
          </h3>
          <p class="author-email">{{ data.author.Email }}</p>

          <div class="author-stats">
            <div class="stat-item">
              <div class="num">{{ data.author.Read }}</div>
              <div class="label">阅读数</div>
            </div>
            <div class="stat-item">
              <div class="num">{{ data.author.Like }}</div>
              <div class="label">获赞数</div>
            </div>
            <div class="stat-item">
              <div class="num">{{ data.author.Article }}</div>
              <div class="label">作品</div>
            </div>
          </div>

          <div class="action-section">
            <el-button 
              :type="isLiked ? 'danger' : 'default'" 
              class="huge-like-btn"
              :plain="!isLiked"
              round
              @click="toggleLike"
            >
              <el-icon v-if="isLiked"><StarFilled /></el-icon>
              <el-icon v-else><Star /></el-icon>
              {{ isLiked ? '已点赞' : '点赞支持' }} · {{ likeCount }}
            </el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="11">
        <div class="content-card">
          <h1 class="article-title">{{ data.article.title }}</h1>
          <div class="article-info">
            <span>发布于 {{ formatDate(data.article.time) }}</span>
            <el-divider direction="vertical" />
            <span><el-icon><View /></el-icon> {{ data.article.read }} 次阅读</span>
          </div>

          <el-divider />

          <div class="article-body">
            <div class="rich-text">{{ data.article.content }}</div>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="side-card comment-wrapper">
          <div class="side-header">
            <el-icon><CommentIcon /></el-icon> 互动交流
          </div>
          <CommentBox 
            :article-id="route.params.articleId" 
            @user-click="goToProfile"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star, StarFilled, View, Comment as CommentIcon } from '@element-plus/icons-vue'
import { getArticleAllInfo } from '@/api/article.js'
import { createLikeService, deleteLikeService, addRead, isLikedService } from '@/api/like.js'
import CommentBox from '@/components/CommentBox.vue'

const route = useRoute()
const router = useRouter()

// 初始化结构需匹配你的 JSON
const data = ref({
  article: { id: '', author_id: '', time: '', content: '', like: 0, read: 0, title: '' },
  author: { ID: '', Account: '', Name: '', Email: '', Read: 0, Like: 0, Article: 0 }
})

const isLiked = ref(false)
const likeCount = ref(0)

// 核心跳转逻辑
const goToProfile = (userId) => {
  console.log("正在跳转到用户ID:", userId)
  if (!userId) return
  // 跳转到你定义的他人主页路由
  router.push(`/user/profile/${userId}`)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

onMounted(async () => {
  const article_id = route.params.articleId
  try {
    const res = await getArticleAllInfo(article_id)
    // 这里的赋值层级必须是 res.data.data
    data.value = res.data.data
    likeCount.value = data.value.article.like

    await addRead(article_id)
    const likedRes = await isLikedService(article_id)
    isLiked.value = likedRes.data.data.liked
  } catch (err) {
    console.error("获取详情失败", err)
  }
})

const toggleLike = () => {
  if (isLiked.value) {
    likeCount.value--
    deleteLikeService(route.params.articleId)
  } else {
    likeCount.value++
    createLikeService(route.params.articleId)
  }
  isLiked.value = !isLiked.value
}
</script>

<style scoped>
.detail-wrapper { padding: 20px; background-color: #f0f2f5; min-height: 100vh; }
.back-bar { margin-bottom: 20px; }
.side-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

/* 跳转相关的鼠标手势 */
.avatar-wrapper, .author-name { cursor: pointer; transition: 0.3s; }
.author-name:hover { color: #409EFF; }

.author-card { text-align: center; position: sticky; top: 20px; }
.author-stats { display: flex; justify-content: space-around; margin: 24px 0; padding: 16px 0; border-top: 1px dashed #ebeef5; border-bottom: 1px dashed #ebeef5; }
.stat-item .num { font-weight: bold; font-size: 1.1rem; color: #303133; }
.stat-item .label { font-size: 0.75rem; color: #909399; }
.huge-like-btn { width: 100%; height: 45px; }

.content-card { background: white; border-radius: 12px; padding: 40px; min-height: 800px; }
.article-title { font-size: 1.8rem; line-height: 1.4; color: #1a1a1a; margin-bottom: 16px; }
.article-info { font-size: 0.9rem; color: #8a919f; margin-bottom: 20px; }
.rich-text { font-size: 1.1rem; line-height: 1.8; color: #333; white-space: pre-wrap; text-align: left; }

.comment-wrapper { height: calc(100vh - 120px); overflow-y: auto; position: sticky; top: 20px; }
.side-header { font-weight: bold; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
</style>