import CryptoJS from 'crypto-js'

export const encrypt = (data: any, key: string) => {
  const converted = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(converted, key)
  return encrypted
}

export const decrypt = (data: any, key: string) => {
  const decrypted = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
  const converted = JSON.parse(decrypted)
  return converted
}

export const md5hash = (data: any) => {
  const converted = JSON.stringify(data)
  const encrypted = CryptoJS.MD5(converted).toString()
  return encrypted
}