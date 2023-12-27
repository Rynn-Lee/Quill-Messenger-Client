export const tryCatch = (fn: Function) => {
  try{
    fn()
  } catch (error) {
    console.log("An error occured!:", error)
  }
}