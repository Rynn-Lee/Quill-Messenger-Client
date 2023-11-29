import { useAccountStore } from "@/stores/account-store"

export default function AddFriends() {
  const {usertag, _id}: any = useAccountStore()


  return (
    <>
      <div>add friends - {usertag} - {_id}</div>
      {/* <div onClick={()=>counterAdd()}>AddFriends - {counter && counter}</div> */}
    </>
  )
}
