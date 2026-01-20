import request from '@/utils/request'

export const createLikeService = (id) => 
    request.get(`/article/create_like/${id}`)

export const deleteLikeService = (id) => 
    request.get(`/article/delete_like/${id}`)
export const isLikedService = (id) => 
    request.get(`/article/is_liked/${id}`)

export const getLikeListService = (id) => 
    request.get(`/article/get_like_list/${id}`)

export const addRead = (id) => 
    request.get(`/article/add_read/${id}`)