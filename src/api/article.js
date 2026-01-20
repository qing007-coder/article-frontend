import request from '@/utils/request'

export const searchArticleService = (value) => 
  request.get(`/article/search?value=${value}`)

export const sendArticleService = ({category,title, content}) => 
  request.post('/article/upload_article', {category, title, content})

export const getArticleAllInfo = (id) => 
  request.get(`/article/get_article_info/${id}`)

export const updateArticle = ({id, title, content}) => 
  request.post('/user/edit_article', {id, title, content})

export const getJudgeArticleQueue = () => 
  request.get('/check/get_unchecked_article_list')

export const getJudgeArticleDetail = (id) => 
  request.get(`/check/get_unchecked_article_details/${id}`)

export const judgeArticles = (article_id, status) => 
  request.post('/check/judge_articles', {article_id, status})

export const deleteArticleService = (id) => 
  request.get(`/user/delete_article/${id}`)

// 2. 对应 article.GET("get_the_hottest_article_list", ...)
export const getHottestArticles = () => {
  return request.get('/article/get_the_hottest_article_list')
}

// 3. 对应 article.GET("get_the_most_like_article_list", ...)
export const getMostLikeArticles = () => {
  return request.get('/article/get_the_most_like_article_list')
}

// 4. 对应 article.GET("get_article_by_category/:category", ...)
export const getArticlesByCategory = (category) => {
  return request.get(`/article/get_article_by_category/${category}`)
}

// 5. 对应 category.GET("get_category_list", ...)
export const getCategoryList = () => {
  return request.get('/category/get_category_list')
}