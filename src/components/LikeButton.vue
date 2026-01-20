<template>
  <div class="like-container">
    <!-- 点赞按钮 -->
    <button 
      :class="['like-btn', { active: isLiked }]" 
      @click="toggleLike"
    >
      👍 {{ likeCount }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {createLikeService, deleteLikeService} from '@/api/like.js'

// 点赞状态
const isLiked = ref(false)
// 点赞数量（初始值假设是 10）
const likeCount = ref(0)

// 切换点赞
const toggleLike = () => {
  if (isLiked.value) {
    likeCount.value--
    
  } else {
    likeCount.value++
  }
  isLiked.value = !isLiked.value
}
</script>

<style scoped>
.like-container {
  display: flex;
  align-items: center;
}

.like-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.like-btn.active {
  background: #ff4d4f;
  color: #fff;
  border-color: #ff4d4f;
}
</style>
