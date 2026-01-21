import request from '@/utils/request'

export const getVerifyCode = ({email}) => 
  request.post('/public/send_verification', {email})

// 注册接口
export const userRegisterService = ({name, email, account, password, verifyCode}) => 
  request.post('/public/register', {name, email, account, password, verifyCode})

// 登录接口
export const userLoginService = ({account, password}) => 
  request.post('/public/login', {account, password})

export const userInfoService = () => 
  request.get('/user/get_user_details')

export const userAllInfoService = () => 
  request.get('/user/get_user_details')

export const modifyPasswordService = ({oldPassword, newPassword}) => 
  request.post('/user/modify_password', {oldPassword, newPassword})

export const getUserArticle = (value) => 
  request.get(`/user/get_user_article?value=${value}`)

export const getOtherUserInfoService = (uid) => 
  request.get(`/user/get_other_user_detail/${uid}`)

// 获取关注列表
export function getFollowListService() {
  return request({
    url: '/user/get_follow_list',
    method: 'get'
  })
}


export function createFollowService(authorId) {
  return request({
    url: '/user/create_follow',
    method: 'post',
    data: {
      author_id: authorId
    }
  })
}

// 取消关注
export function deleteFollowService(authorId) {
  return request({
    url: `/user/delete_follow/${authorId}`,
    method: 'get'
  })
}

export const getAuthorArticle = (value) => 
  request.get(`/article/get_author_article/${value}`)

// 判断是否关注了该作者
export const isFollowedService = (authorId) => 
  request.get(`/user/is_followed/${authorId}`)

// 修改个人资料接口
export const editProfileService = ({id, name, info}) => 
  request.post('/user/edit_profile', {id, name, info})