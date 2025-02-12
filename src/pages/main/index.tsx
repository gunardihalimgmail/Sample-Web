import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router'
import { Routes, Route } from 'react-router-dom'
import DashboardTangki from '../Dashboard/tangki'
import MapsTangki from '../Dashboard/maps'
import './main.scss'
import SideMenu from '../layout/features/sideMenu'
import HamburgerMenu from '../layout/features/hamburgerMenu'
import storeMenu from '../../stores'
import NumberAnimate from '../../components/atoms/numberAnimate'
import { Col, Dropdown, Row } from 'react-bootstrap'
import Icon from '@mdi/react'
import { mdiAccountMultiple, mdiCameraWireless, mdiChartBarStacked } from '@mdi/js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faKey, faPersonRunning, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, handleLogOutGlobal_PPE, notify } from '../../services/functions'
import ModalChangePassword from '../../components/modal/ChangePassword'
import ListUsers from '../../components/list/Users'
import { AppRegistration, Architecture, Assignment, BarChart, CandlestickChart, CellTower, Collections, ConnectedTv, DirectionsCar, DomainAdd, Engineering, HighlightAlt, InsertChart, Inventory, LocalGasStation, MusicVideoOutlined, PlayCircle, QueryStats, Settings, StackedBarChart, VideoStable } from '@mui/icons-material'
import BreadcrumbsCustom from '../../components/atoms/BreadcrumbsCustom'
import ModalCreateUser from '../../components/modal/CreateUser'
import { FidgetSpinner, Grid, InfinitySpin } from 'react-loader-spinner'

const Main = () => {

  const [angka,setAngka]= useState(788);
  const [angka2,setAngka2]= useState(0);

  const [showLoaderMain, setShowLoaderMain] = useState(true); // loader di awal sebelum show main

  const [objShowState, setObjShowState] = useState({}); // changePWD

  const [titleIcon, setTitleIcon] = useState('');

  const [breadPath, setBreadPath] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  
  const [modalTitle, setModalTitle] = useState('Edit User'); // title modal (eg. Create user)
  const [modalStatus, setModalStatus] = useState('Edit');  // status modal (eg. create / edit)
  const [modalRow, setModalRow] = useState({});    // data parsing for edit
  const [modalLoader, setModalLoader] = useState(true);  // set Loader show in modal (eg. fetch api)
  
  const [disabledProp, setDisabledProp] = useState(false);


  
  // const navigate = useNavigate();

  useEffect(()=>{

      setTimeout(()=>{
        setShowLoaderMain(false); // hide loader to show main
      },1000)
    
      
      const unsubscribe = storeMenu.subscribe(()=>{

        // listening "Breadcrumb"
          let breadcrumbsReducer:any = storeMenu.getState().menuReducer.breadcrumbs;
          if (breadcrumbsReducer.type == 'breadcrumbs'){
            setBreadPath([...breadcrumbsReducer.text])
          }

          // STATUS MENU (OPEN = TRUE / CLOSE = FALSE)
          let menuReducer:any = storeMenu.getState().menuReducer.menu;
          
          if (menuReducer.type == 'menu'){
            
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

          let titleIconReducer:any = storeMenu.getState().menuReducer.titleicon;
          setTitleIcon(titleIconReducer.text)
      })



      return () => {
        unsubscribe();
      }
      
  },[])


  const handleClick = () => {
    let acak = Math.floor(Math.random() * 15000000)
    setAngka(acak)
  }

  const handleLogOut = () => {
      handleLogOutGlobal_PPE();
  }

  const handleClick_ChangePWD = (showModal:boolean, form:'changePWD') => {
        // showModal -> true / false

    let objShowModalTemp = {...objShowState};

    switch(form){
      case 'changePWD': 
          objShowModalTemp = {
              ...objShowModalTemp,
              [form]: showModal
          }
          break;
    }

    setObjShowState({...objShowModalTemp});
  }

  const handleOutEventModal = ({tipe, value, form}) => {

    if (form == 'changePWD'){
        if (tipe == 'close_modal'){
          // value = false, maka close modal
            setObjShowState({
                ...objShowState,
                [form]: value
            })
        }
    }

  }

  const modalEventOutChange = ({tipe, value, form}) => {
      if (form == 'createUser') {
        if (tipe == 'close_modal'){
          setShowModal(value);
        }
      }
  }

  
  const handleClick_UpdateUserMe = (status:'Create'|'Edit'|'Delete', title) => {

      setModalStatus(status);
      setModalTitle(title);
      setShowModal(true);

      // setModalStatus('Create');
      // setModalTitle('Create User');
  
      if (status == 'Edit'){

        // data api dari Read User Me (later)
        setModalLoader(true);
        
        PPE_getApiSync(URL_API_PPE + "/v1/users/me",
              null,"application/json","GET",
              getValueFromLocalStorageFunc("IOT_TOKEN") ?? "")
        .then((response)=>{

          // ***NANTI UPDATE UPDATE USER ME (EDIT USER)
            // let tempData = {email:'asda', full_name:'tes', is_active:false, is_superuser:false};

            // setModalRow(tempData);

            let statusCodeError = response?.['statusCode']; // error dari internal
            if (typeof statusCodeError != 'undefined'){                

                notify("error", response?.['msg'], "TOP_RIGHT");

                setTimeout(()=>{
                  setDisabledProp(false);
                  setModalLoader(false);
                },200)

                return
            }
              
            // alert(JSON.stringify(response))
            if (typeof response?.['detail'] != 'undefined'){
                notify("error", response?.['detail'], "TOP_CENTER");

                setTimeout(()=>{
                  setModalLoader(false);  // show loader in modal
                  setDisabledProp(false);

                  // not authenticated
                  // if (response?.['detail'].toString().toLowerCase() == 'not authenticated')
                  // {
                    // jika tidak ada token, maka keluar dari form saja
                    setShowModal(false);
                  // }
                  
                },1800)

                return
            }
            else {
              setModalRow({...response});
              setModalLoader(false);
              setDisabledProp(false);
              setShowModal(true);
            }
            
            // alert(JSON.stringify(response))
        })
        
      }
  }

  return (
    <>

      {
        showLoaderMain &&
            (
              <div className='ppe-loader-main'>
                  <Grid width='80' height='80' visible={showLoaderMain} radius={'12.5'} color='cadetblue'/>
              </div>
            )
      }

      {
        !showLoaderMain &&
          (
              <div className='main-container'>
                
                  <div className='main-left open'>
                      <SideMenu />
                  </div>

                  <div className='main-right open' >


                      <div className='ppe-margin-body'>
                          <Row>
                            <Col className='d-flex justify-content-between'>
                                <h3 className='ppe-dashtangki-page-title'>
                                      <HamburgerMenu />
                                      <span className='ppe-bg-gradient-success ppe-dashtangki-mdi-span ms-3'>
                                          {
                                            titleIcon == 'Users' && 
                                            (
                                              <Icon path={mdiAccountMultiple} size={1} color= "white"/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Cameras' && 
                                            (
                                              <Icon path={mdiCameraWireless} size={1} color= "white"/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Features' && 
                                            (
                                              <Architecture sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Results' && 
                                            (
                                              <AppRegistration sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Settings' && 
                                            (
                                              <Settings sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }

                                          {/* Dashboard Main */}
                                          {
                                            titleIcon == 'Main' && 
                                            (
                                              <BarChart sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }

                                          {
                                            titleIcon == 'Analitik' && 
                                            (
                                              <QueryStats sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'PPE' && 
                                            (
                                              <Engineering sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Vehicle' && 
                                            (
                                              <DirectionsCar sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Monitoring' && 
                                            (
                                              <ConnectedTv sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Camera Online' && 
                                            (
                                              <CellTower sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Task' && 
                                            (
                                              <Assignment sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Live View' && 
                                            (
                                              <PlayCircle sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Recordings' && 
                                            (
                                              <VideoStable sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'ROI' && 
                                            (
                                              <HighlightAlt sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Events' && 
                                            (
                                              <Collections sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Sites' && 
                                            (
                                              <DomainAdd sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Places' && 
                                            (
                                              <LocalGasStation sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                          {
                                            titleIcon == 'Penjualan' && 
                                            (
                                              <Inventory sx={{fontSize: '30px', color:'white'}}/>
                                            )
                                          }
                                      </span>

                                      {/* Dashboard */}
                                      <div className='ppe-title-icon'>{titleIcon}</div>
                                </h3>

                                <div className='d-flex align-items-center'>
                                    <span className='ppe-dash-welcome-title'>{getValueFromLocalStorageFunc("IOT_USER")}</span>

                                      <Dropdown>
                                          <Dropdown.Toggle variant="secondary" id = "ppe-dropdown-basic-user">
                                              <span className='ppe-dashboard-dropdown-basic-user-fauser'>
                                                  <FontAwesomeIcon icon = {faUser} />
                                              </span>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>

                                              <Dropdown.Header className='text-right ppe-login-dropdown-header-container'>
                                                  <span className='ppe-login-dropdown-header'>{`Welcome,`}</span>
                                              </Dropdown.Header>
                                              
                                              <div className='ppe-dash-link-dropdown' 
                                                  onClick={()=>handleClick_UpdateUserMe('Edit','Edit User')}
                                              >
                                                  <FontAwesomeIcon icon = {faKey} className='ppe-login-dropdown-icon' color={'darkgreen'} />
                                                  <span className='ppe-login-dropdown-content'>Update User Me</span>
                                              </div>

                                              <Dropdown.Divider />
                                              <Link to = "/login" onClick={handleLogOut} className='ppe-dash-link-dropdown ppe-dash-link-logout'>  
                                                  <FontAwesomeIcon icon = {faPersonRunning} className='ppe-login-dropdown-icon' color={'red'} />
                                                  <span className='ppe-login-dropdown-content'>Log Out</span>
                                              </Link>
                                              
                                          </Dropdown.Menu>
                                      </Dropdown>
                                </div>
                            </Col>
                          </Row>

                          <Row className='mt-3'>
                            <Col>
                                {/* <BreadcrumbsCustom arrPath={[{key:'Maintenance', value:'Maintenance'}, {key:'Users', value:'Users'}]}/> */}
                                <BreadcrumbsCustom arrPath={breadPath}/>
                            </Col>
                          </Row>

                          <ModalCreateUser par_show={showModal ?? false} title={modalTitle} status={modalStatus} 
                                    row={modalRow} tipeMenu={'Update User Me'}
                                    par_statusLoader={modalLoader}
                                    outChange={modalEventOutChange} />

                      
                          <div className='mt-4'>
                              
                              {/* <button className='btn btn-outline-primary mb-3 mt-4' onClick={handleClick}>Click Change Angka</button>
                              <NumberAnimate angka={angka} propStyle={{backgroundColorAnimate:'lightblue', textColor:'black'}} /> */}
                              <Outlet />
                          </div>

                          {/* SHOW MODAL */}
                          <ModalChangePassword par_show={objShowState?.['changePWD'] ?? false} outChange={handleOutEventModal}/>


                      </div>
                  </div>
              </div>
          )
      }
    </>
  )
}

export default Main