<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from 'vue-router'
import { sendCommentService, deleteCommentService, getCommentListService } from '@/api/comment.js'

// 评论输入框
const newComment = ref("")
// 评论列表
const comments = ref([])
const route = new useRoute()

// 加载评论列表
const loadComments = async () => {
  
  try {
    const res = await getCommentListService(route.params.articleId)
    comments.value = []
    comments.value.push(...res.data.data.list)
  } catch (err) {
    console.error("加载评论失败", err)
  }
}

// 添加评论
const addComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const res = await sendCommentService({ 
      content: newComment.value.trim(), 
      article_id: route.params.articleId,   // 这里用 key: value
    })

    console.log(route.params.articleId)
    // 方式1：重新拉评论列表
    loadComments()
    // 方式2：也可以直接 push 新评论
    // comments.value.push(res.data)

    newComment.value = ""
  } catch (err) {
    console.error("发送评论失败", err)
  }
}


// 页面加载时获取评论
onMounted(() => {
  loadComments()
})
</script>

<template>
  <div class="comment-section">
    <!-- 输入框 -->
    <div>
      <input class="comment-input"
        v-model="newComment"
        placeholder="写下你的评论..."
      />
      <button @click="addComment">发送</button>
    </div>

    <!-- 评论列表 -->
    <ul class="comment-list">
      <li v-for="item in comments" :key="item.id" class="comment-item">
        <span>{{ item.user_id }}: {{ item.content }}</span>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.comment-box {
  width: 400px;
  margin: auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
}

.comment-input {
  width: 100%;
  height: 60px;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  outline: none;
}

button {
  padding: 6px 12px;
  margin-top: 4px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

.comment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-bottom: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.comment-text {
  flex: 1;
  margin-right: 8px;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
}
</style>
