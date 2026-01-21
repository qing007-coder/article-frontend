<template>
  <div class="profile-container">
    <el-card shadow="never" class="header-card">
      <div class="header-content">
        <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="info-section">
          <h2 class="username">{{ authorInfo.Name || '加载中...' }}</h2>
          <el-tag type="info" size="small" v-if="authorInfo.Email">{{ authorInfo.Email }}</el-tag>
          <div class="stat-row">
            <span><b>{{ authorInfo.Article || 0 }}</b> 文章</span>
            <el-divider direction="vertical" />
            <span><b>{{ authorInfo.Like || 0 }}</b> 获赞</span>
            <el-divider direction="vertical" />
            <span><b>{{ authorInfo.Read || 0 }}</b> 浏览</span>
          </div>
        </div>
        <div class="action-section">
          <el-button 
            v-if="!isFollowing" 
            type="primary" 
            icon="Plus" 
            round 
            @click="handleFollow"
          >关注作者</el-button>
          <el-button 
            v-else 
            type="info" 
            plain 
            round 
            @click="handleUnfollow"
          >已关注</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="17">
        <el-card header="Ta 的文章" shadow="never">
          <div v-if="articles.length > 0" class="article-list">
            <div v-for="article in articles" :key="article.id" class="article-item">
              <h3 class="article-title" @click="$router.push(`/article/main/${article.id}`)">
                {{ article.title }}
              </h3>
              <p class="article-summary">{{ article.content ? article.content.substring(0, 100) + '...' : '这篇文章还没有摘要...' }}</p>
              <div class="article-meta">
                <span>{{ formatDate(article.time) }}</span>
                <span>浏览 {{ article.read || 0 }}</span>
              </div>
            </div>
          </div>
          <el-empty v-else description="该作者还没有发布过文章" />
        </el-card>
      </el-col>

      <el-col :span="7">
        <el-card header="作者简介" shadow="never">
          <p class="bio">{{ authorInfo.Info }}</p>
          <el-divider />
          <div class="achievement">
            <div class="ach-item" v-if="authorInfo.time">加入时间：{{ formatDate(authorInfo.time) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { 
  getOtherUserInfoService, 
  getAuthorArticle, 
  isFollowedService, // 导入你的新接口
  createFollowService, 
  deleteFollowService 
} from '@/api/user'

const route = useRoute()
const router = useRouter()
const authorId = route.params.id 
const authorInfo = ref({})
const articles = ref([])
const isFollowing = ref(false)

const formatDate = (str) => str ? str.split('T')[0] : '未知'

const initData = async () => {
  try {
    // 1. 同时发起三个请求，效率最高
    const [resInfo, resArt, resFollow] = await Promise.all([
      getOtherUserInfoService(authorId),
      getAuthorArticle(authorId),
      isFollowedService(authorId)
    ])

    // 2. 处理作者资料 (适配你之前发的 JSON 结构)
    // 如果返回包含 author 对象则取 author，否则取 data
    authorInfo.value = resInfo.data.data.author || resInfo.data.data

    // 3. 处理文章列表
    articles.value = resArt.data.data.data || []

    // 4. 处理关注状态
    // 注意：请根据你后端的实际返回字段修改这里 (例如 resFollow.data.data.is_followed)
    isFollowing.value = resFollow.data.data
    
  } catch (error) {
    console.error('加载失败', error)
    ElMessage.error('无法获取作者信息')
  }
}

const handleFollow = async () => {
  const res = await createFollowService(authorId)
  if (res.data.status === 200) {
    ElMessage.success('关注成功')
    isFollowing.value = true
  }
}

const handleUnfollow = async () => {
  const res = await deleteFollowService(authorId)
  if (res.data.status === 200) {
    ElMessage.success('已取消关注')
    isFollowing.value = false
  }
}

onMounted(initData)
</script>

<style scoped>
.profile-container { padding: 20px; background-color: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; border: none; }
.header-content { display: flex; align-items: center; padding: 10px 20px; }
.info-section { flex: 1; margin-left: 30px; }
.username { margin: 0 0 8px; font-size: 26px; color: #303133; }
.stat-row { margin-top: 15px; color: #606266; font-size: 14px; }
.stat-row b { color: #303133; margin-right: 3px; }

.article-item { padding: 20px 0; border-bottom: 1px solid #f0f2f5; }
.article-title { 
  margin: 0 0 10px; 
  font-size: 18px; 
  color: #303133; 
  cursor: pointer; 
  transition: color 0.3s;
}
.article-title:hover { color: #409EFF; }

.article-summary { color: #909399; font-size: 14px; margin-bottom: 10px; line-height: 1.5; }
.article-meta { font-size: 12px; color: #c0c4cc; display: flex; gap: 20px; }

.bio { font-size: 14px; color: #606266; line-height: 1.6; }
.ach-item { font-size: 13px; color: #909399; }
</style>