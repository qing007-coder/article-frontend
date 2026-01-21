<template>
  <div class="user-center-container">
    <el-row :gutter="25">
      <el-col :span="9">
        <el-card class="profile-card" shadow="hover">
          <div class="user-header">
            <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <h2 class="username">{{ userAllInfo.Name || userAllInfo.Account || '未设置昵称' }}</h2>
            <el-tag size="small" type="info">{{ userAllInfo.Email }}</el-tag>
          </div>
          
          <el-divider content-position="left">个人简介</el-divider>
          <div class="bio-content">
            <p v-if="userAllInfo.Info" class="info-text">{{ userAllInfo.Info }}</p>
            <p v-else class="info-empty">这个人很懒，什么都没留下...</p>
          </div>

          <div class="user-stats-grid">
            <div class="stat-item">
              <div class="num">{{ userAllInfo.Article || 0 }}</div>
              <div class="label">文章</div>
            </div>
            <div class="stat-item">
              <div class="num">{{ userAllInfo.Read || 0 }}</div>
              <div class="label">浏览</div>
            </div>
            <div class="stat-item">
              <div class="num">{{ userAllInfo.Like || 0 }}</div>
              <div class="label">获赞</div>
            </div>
          </div>
          
          <div class="user-info-footer">
            <el-button type="primary" icon="Edit" @click="openEditDialog" style="width: 100%">
              修改个人资料
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="15">
        <el-card class="content-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>我的关注 ({{ followList.length }})</span>
            </div>
          </template>

          <div v-if="followList.length > 0" class="follow-list">
            <div v-for="user in followList" :key="user.ID" class="follow-item">
              <div class="follow-info">
                <el-avatar 
                  :size="45" 
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" 
                  style="cursor: pointer"
                  @click="$router.push(`/user/profile/${user.ID}`)"
                />
                <div class="details">
                  <div class="name" @click="$router.push(`/user/profile/${user.ID}`)">{{ user.Account }}</div>
                  <div class="email">{{ user.Email }}</div>
                </div>
              </div>
              <el-button 
                type="danger" 
                size="small" 
                variant="outline"
                plain 
                @click="handleUnfollow(user.ID)"
              >取消关注</el-button>
            </div>
          </div>
          <el-empty v-else description="还没有关注任何人哦" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editDialogVisible" title="修改个人资料" width="400px" destroy-on-close>
      <el-form :model="editForm" label-position="top">
        <el-form-item label="昵称">
          <el-input v-model="editForm.name" placeholder="请输入你的昵称" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input 
            v-model="editForm.info" 
            type="textarea" 
            :rows="4" 
            placeholder="简单介绍一下自己吧"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">保存更改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { 
  userAllInfoService, 
  getFollowListService, 
  deleteFollowService,
  editProfileService 
} from '@/api/user'

// 数据定义
const userAllInfo = ref({})
const followList = ref([])

// 修改资料相关
const editDialogVisible = ref(false)
const editForm = ref({
  id: '',
  name: '',
  info: ''
})

// 1. 获取个人详细信息
const fetchUserDetail = async () => {
  try {
    const res = await userAllInfoService()
    // 适配你的层级：res.data.data.data
    userAllInfo.value = res.data.data.data
  } catch (err) {
    console.error("加载详情失败", err)
  }
}

// 2. 获取关注列表
const fetchFollowList = async () => {
  const res = await getFollowListService()
  if (res.data.status === 200) {
    followList.value = res.data.data.data || []
  }
}

// 3. 开启修改弹窗
const openEditDialog = () => {
  editForm.value.id = userAllInfo.value.ID
  editForm.value.name = userAllInfo.value.Name || userAllInfo.value.Account
  editForm.value.info = userAllInfo.value.Info || ''
  editDialogVisible.value = true
}

// 4. 提交修改
const submitEdit = async () => {
  try {
    const res = await editProfileService({
      id: String(editForm.value.id),
      name: editForm.value.name,
      info: editForm.value.info
    })
    
    if (res.data.status === 200) {
      ElMessage.success('资料修改成功')
      editDialogVisible.value = false
      fetchUserDetail() // 刷新页面数据
    }
  } catch (err) {
    ElMessage.error('修改失败')
  }
}

// 5. 取消关注处理
const handleUnfollow = (authorId) => {
  ElMessageBox.confirm('确定要取消关注吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    const res = await deleteFollowService(authorId)
    if (res.data.status === 200) {
      ElMessage.success('取消关注成功')
      fetchFollowList()
    }
  }).catch(() => {})
}

onMounted(() => {
  fetchUserDetail()
  fetchFollowList()
})
</script>

<style scoped>
.user-center-container {
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-card {
  padding: 10px;
}

.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.username {
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.bio-content {
  padding: 10px 15px;
  text-align: left;
}

.info-text {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.info-empty {
  font-size: 14px;
  color: #999;
  font-style: italic;
}

.user-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 25px 0;
  background: #fafafa;
  border-radius: 8px;
  padding: 15px 0;
}

.stat-item {
  text-align: center;
}

.stat-item .num {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.stat-item .label {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.follow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.follow-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.details .name {
  font-weight: 600;
  font-size: 15px;
  color: #409EFF;
  cursor: pointer;
}

.details .email {
  font-size: 12px;
  color: #909399;
  margin-top: 3px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>