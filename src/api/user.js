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