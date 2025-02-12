import React, { useEffect, useState } from 'react'
import './hamburgerMenu.scss'
import storeMenu from '../../../../stores';

const HamburgerMenu = () => {
    const [open, setOpen] = useState(true);

    useEffect(()=>{

        
        const unsubscribe = storeMenu.subscribe(()=>{
          // STATUS MENU (OPEN = TRUE / CLOSE = FALSE)
          let menuReducer:any = storeMenu.getState().menuReducer.menu;
          if (menuReducer.type == 'menu'){
                  
                  setOpen(menuReducer.text)

                  let mainLeftStyle = document.querySelector(".main-left") as HTMLElement;
                  if (menuReducer.text == false){
                      mainLeftStyle.classList.remove('open');
                  } else if (menuReducer.text == true) {
                      mainLeftStyle.classList.add('open');
                  }

                  let mainRightStyle = document.querySelector(".main-right") as HTMLElement;
                  if (menuReducer.text == false){
                      mainRightStyle.classList.remove('open');
                  } else if (menuReducer.text == true) {
                      mainRightStyle.classList.add('open');
                  }

          }
        })

          
        let localSto_MenuStatus = localStorage.getItem("MENU_STATUS");
        
        if (localSto_MenuStatus != null){
            setOpen(localSto_MenuStatus == "true" ? true : false)

            let mainLeftStyle = document.querySelector(".main-left") as HTMLElement;
            let mainRightStyle = document.querySelector(".main-right") as HTMLElement;

            if (localSto_MenuStatus == "false") {

                mainLeftStyle.classList.remove('open');
                mainRightStyle.classList.remove('open');
              
            }
            else if (localSto_MenuStatus == "true") {

                mainLeftStyle.classList.add('open');
                mainRightStyle.classList.add('open');
            }

        }

        return () => {
            unsubscribe();
        }

    },[])

    const handleClick = () => {
      setOpen(!open)
      // alert(!open)
      storeMenu.dispatch({type:'menu', text:!open})
      
      if (localStorage.getItem("MENU_STATUS") != null) {
          localStorage.removeItem("MENU_STATUS");
      }
      localStorage.setItem("MENU_STATUS", (!open).toString());
    }

    return (
        <>
            <div className={`hamburger-menu ${open ? 'active' : ''}`} onClick={handleClick}
                    title={`${!open ? 'Show Menu':'Collapse Menu'}`}>
                <div className={`submenu ${open ? 'active':''}`}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </>
    )
}

export default HamburgerMenu