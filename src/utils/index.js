import { BigNumber, ethers } from 'ethers';
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes'
var CryptoJS = require("crypto-js");
let crypto = require("crypto");

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export const getUserBalance = (publicAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  return provider.getBalance(publicAddress)
}

export const getTransactionHashData = async (hash) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const hashData = await provider.getTransactionReceipt(hash)
  return hashData && hashData.status === 1 ? true: null
}

 export const decrypt = (encKey, password) => {
  // let msg = 'abcd'
  // let pw = '123'
  // // let pwhash = sha256(pw)
  // const ciphertext =  CryptoJS.AES.encrypt(msg, pw)
  // // console.log(ciphertext)
  // // console.log(ciphertext.ciphertext.toString())

  // let out = CryptoJS.AES.decrypt(ciphertext.toString(), pw)
  // console.log(out.toString(CryptoJS.enc.Utf8))

  // let key = Buffer.from("123")
  let hashKey = sha256(password)

  let hexHashKey = hashKey.toString()
  // console.log(hashKey.toString(), hexHashKey.length)
  let key = Buffer.from(hexHashKey, "hex")

  // console.log(key.length)
  let hexEnc = encKey//"6309b2877c367103f408a9725db62f1d26cbb4ebafa2e6069ec41ec033fd966cc0233e53e8b3759eddb4ccfce87a4e964658250a168fdd7d0529bcba";
  // console.log("ac")
  let hexEncByte = Buffer.from(hexEnc, "hex");
  // console.log(hexEncByte.length)

  let nonceIndex = 12;
  let nonce = hexEncByte.slice(0, nonceIndex);
  nonce = Buffer.from(nonce.toString("hex"), "hex")
  let encData = hexEncByte.slice(nonceIndex, hexEncByte.length);
  // console.log("enc data leng", encData.length)

  let sFrom = encData.length - 16;
  let authTagUtf8 = encData.slice(sFrom, encData.length);
  // console.log("auth", authTagUtf8.toString("hex"))
  let authTag = Buffer.from(authTagUtf8.toString("hex"), 'hex');
  // console.log("a")

  let decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
  // console.log("b")
  decipher.setAuthTag(authTag)

  let encryptedTextUtf8 = encData.slice(0, sFrom);
  let encryptedText = Buffer.from(encryptedTextUtf8.toString("hex"), 'hex');

  // console.log("i")
  let decrypted = decipher.update(encryptedText, 'hex', 'hex');
  // console.log("j")
  // console.log(decrypted.length)
  
  decrypted += decipher.final();
  // console.log("k")
  let out = decrypted.toString("hex");
  // console.log(decrypted.length, out)
  return out
 }