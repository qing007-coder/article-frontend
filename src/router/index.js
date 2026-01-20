import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', component: () => import('@/views/login/LoginPage.vue')},
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/main',
      children: [
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue'), 
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/article/main',
          component: () => import('@/views/article/ArticleContainer.vue')
        },
        {
          path: '/article/sendArticle',
          component: () => import('@/views/article/SendArticle.vue')
        },
        {
          path: '/privilege/getArticleInQueue',
          component: () => import('@/views/privilege/ArticleQueue.vue')
        },
        {
          path: '/user/manage',
          component: () => import('@/views/user/ManageArticle.vue')
        }
      ]
    },
    {
      path: '/article/main/:articleId',
      component: () => import('@/views/article/ArticleContent.vue')
    },
    {
      path: '/privilege/getArticleInQueue/:articleId',
      component: () => import('@/views/privilege/ArticleDetail.vue')
    },
    {
      path: '/user/manage/article/:articleId',
      component: () => import('@/views/user/EditArticle.vue')
    },
  ]
})

router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router

