import Sidebar from "@components/sidebar/sidebar";

export default function AppLayout({children}: any){
  return(
    <>
      <Sidebar />
      <div>
        {children}
      </div>
    </>
  )
}