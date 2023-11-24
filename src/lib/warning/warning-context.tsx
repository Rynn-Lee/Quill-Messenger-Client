import useWarning from "./use-warning";
import React from "react";
import styles from "./warning.module.sass"

export const WarningContext: any = React.createContext(null)

export default function WarningProvider({children}: any){
  const warningHook = useWarning()

  return(
    <WarningContext.Provider value={warningHook}>
      {warningHook.isError
      ?
        <div className={styles.errorWindow} onClick={()=>warningHook.closeWindow()}>
          <div className={styles.errorBlock} onClick={(e)=>e.stopPropagation()}>
            <div className={styles.errorTitle}>{warningHook.error.title}</div>
            <div className={styles.errorMessage}>{warningHook.error.message}</div>
            <div className={styles.actionButtons}>
              {warningHook.error.fn ? <button onClick={()=>{warningHook.error.fn(); warningHook.closeWindow()}}>Continue</button> : <></>}
              <button onClick={()=>warningHook.closeWindow()}>Close</button>
            </div>
          </div>
        </div>
      : <></>}
      {children}
    </WarningContext.Provider>
  )
}