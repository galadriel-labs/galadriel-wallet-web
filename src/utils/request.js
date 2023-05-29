import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: 'https://walletapi.galadriel.xyz',
  timeout: 20000 
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = getToken() // 
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * status 
  */
    return response.data
  },
  error => {
    console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
