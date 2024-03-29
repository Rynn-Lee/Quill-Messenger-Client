const getDate = () =>{
  const date = new Date().getTime()/1000
  return date.toFixed(0)
}
const getItem = (item: string) => {
  const result: any = localStorage.getItem(item)
  return JSON.parse(result)
}
const setItem = (item: string, value: any) =>{
  const valueToSet = JSON.stringify(value)
  try{
    localStorage.setItem(item, valueToSet)
  } catch (error: any) {
    throw new Error(error)
  }
  return true
}
const removeItem = (item: string) => {
  try{
    localStorage.removeItem(item)
  } catch (error: any) {
    throw new Error(error)
  }
  return true
}

export {getDate, getItem, setItem, removeItem}