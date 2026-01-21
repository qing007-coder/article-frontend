<template>
  <div class="comment-box-inner">
    <div class="input-area">
      <el-input
        v-model="newComment"
        type="textarea"
        placeholder="写下你的看法..."
        :rows="3"
        resize="none"
      />
      <el-button type="primary" size="small" @click="addComment" :disabled="!newComment.trim()">
        发表评论
      </el-button>
    </div>

    <el-divider />

    <div class="comment-list">
      <div v-for="item in comments" :key="item.ID" class="comment-item">
        <el-avatar 
          :size="32" 
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" 
          @click="$emit('user-click', item.user_id)"
        />
        <div class="c-main">
          <div class="c-header">
            <span class="c-name" @click="$emit('user-click', item.user_id)">
              {{ item.name || '用户: ' + item.user_id }}
            </span>
            <span class="c-time">{{ formatTime(item.CreatedAt) }}</span>
          </div>
          <div class="c-text">{{ item.content }}</div>
        </div>
      </div>
      <el-empty v-if="comments.length === 0" description="暂无评论" :image-size="60" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from 'vue-router'
import { sendCommentService, getCommentListService } from '@/api/comment.js'

const props = defineProps(['articleId'])
const emit = defineEmits(['user-click']) // 声明点击事件通知父组件

const newComment = ref("")
const comments = ref([])
const route = useRoute()

const loadComments = async () => {
  try {
    const res = await getCommentListService(route.params.articleId)
    // 根据你的返回格式 res.data.data.list
    comments.value = res.data.data.list || []
  } catch (err) {
    console.error("加载评论失败", err)
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  const res = await sendCommentService({ 
    content: newComment.value.trim(), 
    article_id: route.params.articleId 
  })
  if (res.data.status === 200) {
    newComment.value = ""
    loadComments()
  }
}

const formatTime = (t) => t ? t.split('T')[0] : ''

onMounted(loadComments)
</script>

<style scoped>
.input-area { text-align: right; }
.el-button { margin-top: 8px; }
.comment-item { display: flex; gap: 10px; margin-bottom: 15px; text-align: left; }
.c-main { flex: 1; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
.c-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.c-name { font-size: 13px; font-weight: bold; color: #409EFF; cursor: pointer; }
.c-time { font-size: 11px; color: #999; }
.c-text { font-size: 14px; color: #333; line-height: 1.5; }
.el-avatar { cursor: pointer; }
</style>