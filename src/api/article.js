import request from '@/utils/request'

export const searchArticleService = (value) => 
  request.get(`/article/search?value=${value}`)

export const sendArticleService = ({title, content}) => 
  request.post('/article/upload_article', {title, content})

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