import { useAccountStore } from "@store/AccountStore"

export default function AddFriends() {
  const {usertag, password}: any = useAccountStore()
  return (
    <>
      <div>add friends - {usertag} - {password}</div>
      {/* <div onClick={()=>counterAdd()}>AddFriends - {counter && counter}</div> */}
    </>
  )
}
