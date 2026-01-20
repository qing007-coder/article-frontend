<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 假设有 API 文件
import { getArticleAllInfo, updateArticle } from '@/api/article.js'

// 路由对象
const route = useRoute()
const router = useRouter()

// 表单数据
const form = ref({
  id: '',
  title: '',
  content: '',
})


// 加载文章详情
const loadArticle = async () => {
  const id = route.params.articleId
  if (!id) return
  const res = await getArticleAllInfo(id)
  if (res.data.status === 200) {
    Object.assign(form.value, res.data.data.article)
  } else {
    ElMessage.error('加载文章失败')
  }
}

// 保存修改
const saveArticle = async () => {
  const res = await updateArticle({
    id: form.value.id,
    title: form.value.title,
    content: form.value.content,
  })
  if (res.data.status === 200) {
    ElMessage.success('保存成功')
    router.push('/user/manage') // 返回列表页
  } else {
    ElMessage.error(res.data.message || '保存失败')
  }
}

// 挂载后加载文章
onMounted(loadArticle)
</script>

<template>
  <div class="article-editor">
    <el-card shadow="hover" class="editor-card">
      <h2 class="title">编辑文章</h2>

      <el-form label-width="100px" :model="form" class="editor-form">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="12"
            placeholder="请输入文章内容..."
          />
        </el-form-item>

        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="saveArticle">保存</el-button>
            <el-button @click="router.back()">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.article-editor {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.editor-card {
  width: 800px;
  border-radius: 12px;
  padding: 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.cover-uploader {
  width: 200px;
  height: 120px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button-group {
  display: flex;
  gap: 10px;
}
</style>
