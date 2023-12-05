import CryptoJS from 'crypto-js'

export const md5hash = (data: any) => {
  const converted = JSON.stringify(data)
  const encrypted = CryptoJS.MD5(converted).toString()
  return encrypted
}