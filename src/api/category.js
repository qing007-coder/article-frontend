import request from '@/utils/request'

// 获取所有分类名（用于生成标签栏）
export const getCategoryList = () => request.get('/category/get_category_list')

// 根据分类名获取文章（核心筛选接口）
export const getArticlesByCategory = (category) => request.get(`/article/get_article_by_category/${category}`)

// 搜索接口（全部加载时使用）
export const searchArticles = (keyword) => request.get('/article/search', { params: { key_word: keyword } })