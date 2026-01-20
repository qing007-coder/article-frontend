import request from '@/utils/request'

export const getTagList = () =>
    request.get(`/category/get_category_list`)