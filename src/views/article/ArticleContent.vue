<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import { getArticleAllInfo } from '@/api/article.js'
import {createLikeService, deleteLikeService, addRead, isLikedService} from '@/api/like.js'
import CommentBox from '@/components/CommentBox.vue'

const route = new useRoute()

const data = ref({
  article: {
    id: '',
    author_id: '',
    time: '',
    content: '',
    like: 0,
    read: 0,
    title: ''
  },
  author: {
    Account: '',
    Password: '',
    Email: '',
    Read: 0,
    Like: 0,
    Article: 0,
  }
})

// 点赞状态
const isLiked = ref(false)
// 点赞数量（初始值假设是 10）
const likeCount = ref(0)

onMounted(async () => {
  const article_id = route.params.articleId
  const articleRes = await getArticleAllInfo(article_id)
  data.value = articleRes.data.data
  likeCount.value = articleRes.data.data.article.like

  await addRead(article_id)

  const likedRes = await isLikedService(article_id)
  isLiked.value = likedRes.data.data.liked
})


// 切换点赞
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

<template>
  <el-row>
    <el-col :span="7">
      <div id="infoContainer">
        <el-avatar :size="100"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <div>{{ data.author.Account }}|{{ data.author.Email }}</div>
        <ul>
          <li>总阅览数  {{ data.author.Read }}</li>
          <li>总点赞数  {{ data.author.Like}}</li>
          <li>发布文章数  {{ data.author.Article }}</li>
        </ul>

        <div class="like-container">
          <!-- 点赞按钮 -->
          <button 
            :class="['like-btn', { active: isLiked }]" 
            @click="toggleLike"
          >
            👍 {{ likeCount }}
          </button>
        </div>
        
      </div>
    </el-col>
    <el-col :span="10">
      <div id="contentContainer">
        <h1>{{ data.article.title }}</h1>
        <p>{{ data.article.content }}</p>
      </div>
    </el-col>
    <el-col :span="7">
      <CommentBox />
    </el-col>
  </el-row>
</template>

<style scoped>  
#infoContainer{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 350px;
  width: 350px;
  background-color: rgba(255, 255, 255, .65);
}

ul{
  display: flex;
}
li{
  width: 100px;
  height: 100px;
}
h1{
  text-align: center;
}
#contentContainer{
  height: 780px;
  background-color: rgba(255, 255, 255, .65);
}

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