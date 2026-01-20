<template>
  <div class="article-manage-wrapper">
    <!-- 标题 -->
    <div class="page-header">
      <h2>个人文章管理</h2>
      <p>管理你发布过的所有文章</p>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar-card">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章标题"
        clearable
        @clear="loadArticles"
        @keyup.enter.native="loadArticles"
        style="width: 260px"
      />
      <el-button type="primary" @click="loadArticles">搜索</el-button>
    </div>

    <!-- 表格卡片 -->
    <div class="table-card">
      <el-table
        :data="articles"
        stripe
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="like" label="点赞" width="100" />
        <el-table-column prop="read" label="阅读" width="100" />
        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.time) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="editArticle(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteArticle(scope.row.id)"
            >
              删除
            </el-button>
            <el-button size="small" @click="viewComments(scope.row.id)">
              评论
            </el-button>
            <el-button size="small" @click="viewLikes(scope.row.id)">
              点赞
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 评论弹窗 -->
    <el-dialog
      v-model="commentDialogVisible"
      title="评论列表"
      width="650px"
    >
      <el-table :data="comments" stripe>
        <el-table-column prop="user_id" label="用户" width="150" />
        <el-table-column prop="content" label="评论内容" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteComment(scope.row.ID)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 点赞弹窗 -->
    <el-dialog
      v-model="likeDialogVisible"
      title="点赞用户列表"
      width="420px"
    >
      <el-table :data="likes" stripe>
        <el-table-column prop="UserID" label="用户ID" />
        <el-table-column label="点赞时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.CreatedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getUserArticle } from '@/api/user.js'
import { getCommentListService, deleteCommentService } from '@/api/comment.js'
import { getLikeListService } from '@/api/like.js'
import { deleteArticleService } from '@/api/article.js'

const router = useRouter()

const articles = ref([])
const comments = ref([])
const likes = ref([])

const searchKeyword = ref('')
const commentDialogVisible = ref(false)
const likeDialogVisible = ref(false)

const loadArticles = async () => {
  try {
    const res = await getUserArticle(searchKeyword.value)
    articles.value = res.data.data.data || []
  } catch {
    ElMessage.error('加载文章失败')
  }
}

onMounted(loadArticles)

const editArticle = (id) => {
  router.push(`/user/manage/article/${id}`)
}

const deleteArticle = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该文章？', '提示', {
      type: 'warning',
    })
    await deleteArticleService(id)
    ElMessage.success('删除成功')
    loadArticles()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

const viewComments = async (id) => {
  try {
    const res = await getCommentListService(id)
    comments.value = res.data.data.list || []
    commentDialogVisible.value = true
  } catch {
    ElMessage.error('加载评论失败')
  }
}

const deleteComment = async (commentId) => {
  try {
    await deleteCommentService(commentId)
    ElMessage.success('评论已删除')
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch {
    ElMessage.error('删除失败')
  }
}

const viewLikes = async (id) => {
  try {
    const res = await getLikeListService(id)
    likes.value = res.data.data.list || []
    likeDialogVisible.value = true
  } catch {
    ElMessage.error('加载点赞列表失败')
  }
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', { hour12: false })
}
</script>

<style scoped>
/* 页面整体 */
.article-manage-wrapper {
  padding: 24px;
  background: linear-gradient(180deg, #f5f7fa 0%, #eef1f6 100%);
  min-height: 100vh;
}

/* 头部 */
.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #1f2329;
}

.page-header p {
  margin-top: 6px;
  font-size: 0.9rem;
  color: #8a919f;
}

/* 工具栏卡片 */
.toolbar-card {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* 表格卡片 */
.table-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>
