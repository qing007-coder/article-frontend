import request from '@/utils/request'

export const sendCommentService = ({content, article_id}) => 
    request.post("/article/create_comment", {content, article_id})

export const deleteCommentService = (id) => 
    request.get(`/article/delete_comment/${id}`)

export const getCommentListService = (id) => 
    request.get(`/article/get_comment_list/${id}`)

