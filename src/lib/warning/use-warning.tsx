import { useState } from "react"

export default function useWarning(){
  const [isError, setIsError] = useState(false)
  const [errorDetails, setErrorDetails] = useState({
    title: "aboba",
    message: "aboba message"
  })

  const throwError = ({title, message}: any) => {
    setErrorDetails({title, message})
    setIsError(true)
  }
  const closeError = () => setIsError(false)

  return {isError, closeError, throwError, error: errorDetails}
}