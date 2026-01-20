<template>
  <div class="article-manage">
    <h2 class="title">个人文章管理</h2>

    <!-- 搜索框 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章标题"
        clearable
        @clear="loadArticles"
        @keyup.enter.native="loadArticles"
        style="width: 250px"
      />
      <el-button type="primary" @click="loadArticles">搜索</el-button>
    </div>

    <!-- 文章列表 -->
    <el-table
      :data="articles"
      border
      style="width: 100%; margin-top: 15px"
      highlight-current-row
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="like" label="点赞数" width="100" />
      <el-table-column prop="read" label="阅读数" width="100" />
      <el-table-column label="发布时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.time) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
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
          <el-button
            size="small"
            @click="viewComments(scope.row.id)"
          >
            评论
          </el-button>
          <el-button
            size="small"
            @click="viewLikes(scope.row.id)"
          >
            点赞
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 评论弹窗 -->
    <el-dialog
      title="评论列表"
      v-model="commentDialogVisible"
      width="600px"
    >
      <el-table :data="comments" border>
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
      title="点赞用户列表"
      v-model="likeDialogVisible"
      width="400px"
    >
      <el-table :data="likes" border>
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
import axios from 'axios'
import { getUserArticle } from '@/api/user.js'
import { getCommentListService, deleteCommentService } from '@/api/comment.js'
import { getLikeListService } from '@/api/like.js'
import { deleteArticleService } from '@/api/article.js'

// 路由
const router = useRouter()

// 数据
const articles = ref([])
const comments = ref([])
const likes = ref([])

const searchKeyword = ref('')
const commentDialogVisible = ref(false)
const likeDialogVisible = ref(false)

// 加载文章列表
const loadArticles = async () => {
  try {
    const res = await getUserArticle(searchKeyword.value)
    console.log(searchKeyword.value)
    articles.value = res.data.data.data || []
  } catch (err) {
    console.error(err)
    ElMessage.error('加载文章失败')
  }
}

onMounted(() => {
  loadArticles()
})


// 修改文章
const editArticle = (id) => {
  router.push(`/user/manage/article/${id}`)
}

// 删除文章
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

// 查看评论
const viewComments = async (id) => {
  try {
    const res = await getCommentListService(id)
    comments.value = res.data.data.list || []
    commentDialogVisible.value = true
  } catch (err) {
    ElMessage.error('加载评论失败')
  }
}

// 删除评论
const deleteComment = async (commentId) => {
  try {
    await deleteCommentService(commentId)
    ElMessage.success('评论已删除')
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (err) {
    ElMessage.error('删除失败')
  }
}

// 查看点赞列表
const viewLikes = async (id) => {
  try {
    const res = await getLikeListService(id)
    likes.value = res.data.data.list || []
    likeDialogVisible.value = true
  } catch (err) {
    ElMessage.error('加载点赞列表失败')
  }
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', { hour12: false })
}
</script>

<style scoped>
.article-manage {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  color: white;
}
</style>
