import React, { useEffect, useRef } from 'react'
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar'
import { svgCustom } from '../../../util/svgcustom'
import './sideMenu.scss'
import { Link, useNavigate } from 'react-router-dom'
import IoTLogo from '../../../../assets/images/iot_logo.png'
import HamburgerMenu from '../hamburgerMenu'
import storeMenu from '../../../../stores'
import { Dashboard, ImportContacts } from '@mui/icons-material'

const SideMenu = () => {

  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (window.innerWidth < 768){
      if (wrapperRef.current && !(wrapperRef.current as HTMLElement).contains(event.target)) {
          storeMenu.dispatch({type:'menu', text: false});

          if (localStorage.getItem("MENU_STATUS") != null) {
              localStorage.removeItem("MENU_STATUS");
          }

          localStorage.setItem("MENU_STATUS", (false).toString());
      }
    }
  }

  useEffect(()=>{
      // tambahkan efek css pada menu utama yang ter-select (Dashboard - Utama)
      // let psMenuButton = document.querySelectorAll(".ps-menuitem-root:not(.sidemenu-submenu) a.ps-menu-button")[0] as HTMLElement;
      // psMenuButton.classList.add('active');

      document.addEventListener("mousedown", handleClickOutside);

      // set side menu apakah di open di awal
      let menu_status_temp:any = localStorage.getItem("MENU_STATUS");
      if (menu_status_temp != null) {
          storeMenu.dispatch({type:'menu', text: menu_status_temp == "true" ? true : false});
      } else {    
          storeMenu.dispatch({type:'menu', text: true});
      }

  },[])

  const handleClickSubMenu = (path:any, index:any) => {
    let psMenuButtons = document.querySelectorAll(".ps-menuitem-root:not(.sidemenu-submenu) a.ps-menu-button");
    psMenuButtons.forEach((val, idx)=>{
        val.classList.remove("active");
    })

    // setTimeout(()=>{
        let psMenuButton = document.querySelectorAll(".ps-menuitem-root:not(.sidemenu-submenu) a.ps-menu-button")[index] as HTMLElement;
        psMenuButton.classList.add('active')
        // psMenuButtons.forEach((val, idx)=>{
            // let psMenuButton = val as HTMLElement;
            // psMenuButton.classList.add('active')
            // psMenuButton.style.backgroundColor = "red"
        // })
    // })

    navigate({
      pathname: path
    })    
  }
  
  return (
    <>
        <div className='side-left-sub' ref={wrapperRef}>
                
            <Sidebar
								className='sidebarClasses'
								backgroundColor='rgb(249,249,249,0.5)'
								collapsed={false} // menu pindah ke kanan
            >
                <Menu
                menuItemStyles={{
                    button: ({ level, active, disabled }) => {
                    if (level === 0)
                    {
                        return {
                            // color: disabled ? '#f5d9ff' : '#d359ff',
                            backgroundColor: active ? '#eecef9' : undefined,
                            fontWeight: 500,
                            paddingLeft:'25px',
                            ['&']:{
                                backgroundColor:'rgba(200, 221, 221, 0.7)',
                            },
                            ['&:hover']:{
                                backgroundColor:'rgb(197, 228, 255)',
                                color:'rgb(68, 89, 110)',
                                borderRadius:'0'
                            },
                            ['&.active']: { 
                                // backgroundColor: '#13395e',
                                color: '#b6c8d9',
                            },
                            // ketika menu item level 0 lagi open
                            ['&.ps-open']:{
                                fontFamily:'Titillium_Web_Bold'
                            }
                            ,
                            fontFamily:'Titillium_Web_Regular',
                            fontSize:'14px',
                        }
                    }
                    else
                    {
                        return {
                            ['&']:{
                                backgroundColor:'rgba(200, 221, 221, 0.7)',  // background menu item
                                paddingLeft:'50px',
                                // color: '#000',
                                fontSize:'14px'
                            },
                            ['&:hover']:{
                                backgroundColor:'rgb(197, 228, 255)',
                                color:'rgb(68, 89, 110)',
                                borderRadius:'0'
                            },
                            [`&.active`]: {
                                // backgroundColor: '#13395e',
                                // color: '#b6c8d9',
                                fontWeight:'700',
                                // color:'navy',
                            }
                        }
                    }
                    },
                }}
                >

                <div className='logo-header'>
                    <div className='logo-title-image'>
                        <img src={IoTLogo} />

                        <div className='sidemenu-ham-menu'>
                          <HamburgerMenu />
                        </div>
                    </div>
                    {/* <div className='logo-title'>
                        P
                    </div>
                    <p className='logo-subtitle'>
                        Pro Dash
                    </p> */}
                </div>

                <div className='pre-title-submenu'>
                    <p>General</p>
                </div>

                    <SubMenu className='submenu-custom' label="Dashboard" defaultOpen ={window.location.pathname.indexOf("/dashboard") != -1 ? true : false} 
                          icon={svgCustom('dashboard','rgb(44, 169, 188)',18,18,'rgb(0, 0, 0)')}
                    >
                        {/* <MenuItem onClick={() => handleClickSubMenu("/dashboard/main", 1)}><span className='sidemenu-label-submenu'>Main</span></MenuItem> */}

                        {/* /dashboard (yang muncul) kondisi awal setelah login */}

                        {/* <MenuItem onClick={() => handleClickSubMenu("/dashboard/analitik", 1)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/analitik") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Analitik</span></MenuItem> */}
                        <MenuItem onClick={() => handleClickSubMenu("/transaksi/penjualan", 1)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/analitik") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Penjualan</span></MenuItem>

                        {/* <SubMenu className='submenu-custom submenu-custom-2' label="Analitik" defaultOpen={window.location.pathname.indexOf("/dashboard/analitik") != -1 ? true : window.location.pathname.indexOf("/dashboard") != -1 ? true : false}>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/analitik/ppe", 2)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/analitik/ppe") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>PPE</span></MenuItem>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/analitik/vehicle", 3)} className='custom-menu-item' style={{fontWeight: window.location.pathname.indexOf("/dashboard/analitik/vehicle") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Vehicle</span></MenuItem>
                        </SubMenu> */}

                        <SubMenu className='submenu-custom submenu-custom-2' label="Monitoring" defaultOpen={window.location.pathname.indexOf("/dashboard/monitoring") != -1 ? true : false}>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/monitoring/camera-online", 3)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/monitoring/camera-online") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Camera Online</span></MenuItem>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/monitoring/task", 4)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/monitoring/task") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Task</span></MenuItem>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/monitoring/live-view", 5)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/monitoring/live-view") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Live View</span></MenuItem>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/monitoring/recordings", 6)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/monitoring/recordings") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Recordings</span></MenuItem>
                            <MenuItem onClick={() => handleClickSubMenu("/dashboard/monitoring/events", 7)} className={`custom-menu-item`} style={{fontWeight: window.location.pathname.indexOf("/dashboard/monitoring/events") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Events</span></MenuItem>
                        </SubMenu>
                    </SubMenu>

                    <SubMenu className='submenu-custom' label="Maintenance" defaultOpen ={window.location.pathname.indexOf("/list") != -1 ? true : false} 
                          icon={svgCustom('repair',undefined,30,30,undefined)}
                    >
                        <MenuItem onClick={() => handleClickSubMenu("/list/users", 9)}    style={{fontWeight: window.location.pathname.indexOf("/list/users") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Users</span></MenuItem>
                        <MenuItem onClick={() => handleClickSubMenu("/list/sites", 10)}    style={{fontWeight: window.location.pathname.indexOf("/list/sites") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Sites</span></MenuItem>
                        <MenuItem onClick={() => handleClickSubMenu("/list/places", 11)}    style={{fontWeight: window.location.pathname.indexOf("/list/places") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Places</span></MenuItem>
                        <MenuItem onClick={() => handleClickSubMenu("/list/cameras", 12)}  style={{fontWeight: window.location.pathname.indexOf("/list/cameras") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Cameras</span></MenuItem>
                        <MenuItem onClick={() => handleClickSubMenu("/list/features", 13)} style={{fontWeight: window.location.pathname.indexOf("/list/features") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Features</span></MenuItem>
                        <MenuItem onClick={() => handleClickSubMenu("/list/results", 14)}  style={{fontWeight: window.location.pathname.indexOf("/list/results") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Results</span></MenuItem>
                        <MenuItem onClick={() => handleClickSubMenu("/list/settings", 15)} style={{fontWeight: window.location.pathname.indexOf("/list/settings") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>Settings</span></MenuItem>

                        <MenuItem onClick={() => handleClickSubMenu("/other/roi", 16)} style={{fontWeight: window.location.pathname.indexOf("/other/roi") != -1 ? 700:'normal'}}><span className='sidemenu-label-submenu'>ROI</span></MenuItem>
                    </SubMenu>

                </Menu>
            </Sidebar>
            <div className='side-bottom'>
                <div className='logo-img-bottom'>
                </div>
            </div>
        </div>
    </>
  )
}

export default SideMenu