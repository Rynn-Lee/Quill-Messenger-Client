import { useState } from "react"

export default function useWarning(){
  const [isError, setIsError] = useState(false)
  const [errorDetails, setErrorDetails] = useState({
    title: "",
    message: "",
    fn: null
  })

  const showWindow = ({title, message, fn = null}: any) => {
    console.log("FN:", fn)
    setErrorDetails({title, message, fn})
    setIsError(true)
  }
  const closeWindow = () => setIsError(false)

  return {isError, closeWindow, showWindow, error: errorDetails}
}