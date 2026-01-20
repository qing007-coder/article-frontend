<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { getArticleAllInfo, updateArticle } from '@/api/article.js'

const route = useRoute()
const router = useRouter()

const form = ref({
  id: '',
  title: '',
  content: '',
})

// 加载文章
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

// 保存
const saveArticle = async () => {
  const res = await updateArticle({
    id: form.value.id,
    title: form.value.title,
    content: form.value.content,
  })

  if (res.data.status === 200) {
    ElMessage.success('保存成功')
    router.push('/user/manage')
  } else {
    ElMessage.error(res.data.message || '保存失败')
  }
}

onMounted(loadArticle)
</script>

<template>
  <div class="article-editor-wrapper">
    <div class="editor-card">
      <!-- 头部 -->
      <div class="editor-header">
        <h2>编辑文章</h2>
        <p>修改文章标题和正文内容</p>
      </div>

      <!-- 表单 -->
      <el-form :model="form" label-width="80px" class="editor-form">
        <el-form-item label="标题">
          <el-input
            v-model="form.title"
            size="large"
            maxlength="100"
            show-word-limit
            placeholder="请输入文章标题"
          />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="16"
            maxlength="100000"
            show-word-limit
            placeholder="请输入文章内容..."
          />
        </el-form-item>

        <!-- 操作区 -->
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" size="large" @click="saveArticle">
              保存修改
            </el-button>
            <el-button size="large" @click="router.back()">
              取消
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* 整体背景 */
.article-editor-wrapper {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(180deg, #f5f7fa 0%, #eef1f6 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* 卡片 */
.editor-card {
  width: 900px;
  background: #ffffff;
  border-radius: 14px;
  padding: 32px 36px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* 头部 */
.editor-header {
  margin-bottom: 28px;
}

.editor-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #1f2329;
}

.editor-header p {
  margin-top: 6px;
  font-size: 0.9rem;
  color: #8a919f;
}

/* 表单 */
.editor-form {
  margin-top: 10px;
}

/* 按钮区 */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>
