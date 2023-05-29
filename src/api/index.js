import request from '@/utils/request'

export function creatGen(password) {
  return request({
    url: '/account/gen',
    method: 'post',
    data: {
      password
    }
  })
}

export function getAccountInfo(privateKey, tokens) {
  return request({
    url: '/account',
    method: 'post',
    data: { 
        privateKey,
        tokens
     }
  })
}

// deposit data
export function depositdatagen(galadrielPubkey, token, amount) {
    return request({
      url: '/depositdatagen',
      method: 'post',
      data: {
        galadrielPubkey,
        token,
        amount
      }
    })
  }

  //  data
export function transferdatagen(toGaladrielPubkey, token, amount, privateKey) {
    return request({
      url: '/transferdatagen',
      method: 'post',
      data: {
        toGaladrielPubkey,
        token,
        amount,
        privateKey
      }
    })
  }
 
    // withdraw data
export function burndatagen(token, to, privateKey) {
    return request({
      url: '/burndatagen',
      method: 'post',
      data: {
        token,
        to,
        privateKey
      }
    })
  }


      // 
export function txs(privateKey, pageSize, pageNum) {
  return request({
    url: '/txs',
    method: 'post',
    data: {
      privateKey,
      pageSize,
      pageNum
    }
  })
}

// 
export function openproofgen(txHash, privateKey) {
  return request({
    url: '/openproofgen',
    method: 'post',
    data: {
      txHash,
      privateKey
    }
  })
}