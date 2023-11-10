import { useAccountStore } from "@store/AccountStore"

export default function AddFriends() {
  const {counter, counterAdd}: any = useAccountStore()
  return (
    <>
      <div onClick={()=>counterAdd()}>AddFriends - {counter && counter}</div>
    </>
  )
}
