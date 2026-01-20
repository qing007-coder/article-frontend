<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { sendArticleService } from '@/api/article.js'
import { getTagList } from '@/api/tag.js'

const formRef = ref()

const sendArticleModel = ref({
  title: '',
  content: '',
  category: null,
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const categoryList = ref([])

const loadCategories = async () => {
  const res = await getTagList()
  categoryList.value = res.data?.data?.data ?? []
}

onMounted(loadCategories)

const sendArticle = async () => {
  await formRef.value.validate()
  const res = await sendArticleService(sendArticleModel.value)
  ElMessage.success(res.data?.msg || '发布成功')

  sendArticleModel.value = {
    title: '',
    content: '',
    category: null,
  }
}
</script>

<template>
  <div class="publish-wrapper">
    <div class="publish-card">
      <div class="publish-header">
        <h2>发布文章</h2>
        <p>分享你的想法，让更多人看到</p>
      </div>

      <el-form
        ref="formRef"
        :model="sendArticleModel"
        :rules="rules"
        label-position="top"
        class="publish-form"
      >
        <!-- 标题 -->
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="sendArticleModel.title"
            size="large"
            maxlength="100"
            show-word-limit
            placeholder="请输入一个清晰、有吸引力的标题"
          />
        </el-form-item>

        <!-- 分类 -->
        <el-form-item label="文章分类" prop="category">
          <el-select
            v-model="sendArticleModel.category"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <!-- 内容 -->
        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="sendArticleModel.content"
            type="textarea"
            :rows="18"
            maxlength="100000"
            show-word-limit
            placeholder="开始写作吧……"
          />
        </el-form-item>

        <!-- 操作 -->
        <el-form-item class="action-row">
          <el-button type="primary" size="large" @click="sendArticle">
            发布文章
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* 页面整体背景 —— 不再死白 */
.publish-wrapper {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(180deg, #f5f7fa 0%, #eef1f6 100%);
}

/* 主卡片 */
.publish-card {
  max-width: 920px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* 顶部标题区 */
.publish-header {
  margin-bottom: 32px;
}

.publish-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #1f2329;
}

.publish-header p {
  margin-top: 8px;
  color: #8a919f;
  font-size: 0.95rem;
}

/* 表单整体 */
.publish-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

/* textarea 阅读更舒服 */
.publish-form :deep(textarea) {
  line-height: 1.8;
  font-size: 1rem;
}

/* 操作区 */
.action-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}

/* 主按钮 */
.action-row .el-button {
  padding: 12px 28px;
  font-size: 1rem;
}
</style>
