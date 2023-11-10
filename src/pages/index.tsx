import { useAccountStore } from "@store/AccountStore"

export default function Home() {
  const {counter, counterAdd}: any = useAccountStore()
  return (
    <>
      <div onClick={()=>counterAdd()}>Index - {counter && counter}</div>
    </>
  )
}
