import React, { useEffect, useRef, useState } from 'react'
import './DetailInfoCamera.scss'
import { Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faKey, faUserPen, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Blocks } from 'react-loader-spinner';
import { Check, LensTwoTone } from '@mui/icons-material';
import Switch from "react-switch"
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, joinWithCommaNSuffixAnd, notify } from '../../../services/functions';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { CheckMark, RedCloseMark } from '../../../assets';

const ModalDetailInfoCamera = (props) => {

  const { par_show, title, status, row, tipeMenu, par_statusLoader, outChange } = props;

  // title -> 'Create User'
  // status -> Create / Edit / Detail
  // row -> row.<key>  -> data per row
  // tipeMenu -> 'Update User Me', default ... (eg : list - users) // indikator ganti is_active dan is_superuser jadi icon
  // par_statusLoader -> show loaders Blocks

  const [show, setShow] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(true);

  let objMasterInput = {
      // 'Email':'',
      // 'is_active':false,
      // 'is_superuser':false,
      // 'Fullname':'',
      // 'Password':'',
      // 'Konfirmasi Password':''
  }
  const [objValueInput, setObjValueInput] = useState({...objMasterInput});

  // const objRequired = ['Email', 'Password', 'Konfirmasi Password']
  const objRequired = [];

  const refEmailInput = useRef<HTMLInputElement | null>(null);

  // tujuan tanpa dependensi ([]) agar selalu masuk ke useEffect ini untuk focus
  useEffect(()=>{
      
  }, [])

  useEffect(()=>{
    // set status loader dari luar modal (eg. lagi fetch api)
    setLoaderStatus(par_statusLoader);
  }, [par_statusLoader])
  
  useEffect(()=>{

    // use effect ini ter-call pada saat pertama kali buka modal sampai close modal

    setShow(par_show ?? false)

    
    if (status == 'Edit' || status == 'Detail'){
      
        setObjValueInput((obj)=>{
            return {...row};
        })

    } else {
        // reset kosong semua data untuk 'create'
        setObjValueInput({...objMasterInput});
    }

    // setTimeout(()=>{
    //   if (refEmailInput.current){
    //     refEmailInput.current.focus();
    //     refEmailInput.current.select();
    //   } 
    // },100)
    
  }, [par_show, status, title, tipeMenu, row])

  const handleHide = () => {
      // event ketika klik di luar modal
  }

  const handleClick_ChangePWD = (show:boolean, tipe:'infocamera') => {
      if (tipe == 'infocamera'){
        // setShow(show);
        setObjValueInput({...objMasterInput})
        // setTimeout(()=>{
          outChange({tipe:'close_modal', value: show, form:'infocamera'});
        // },100)
      }
  }

  const handleChangeSwitchChecked = (valCheck, nameInput) => {
      if (typeof valCheck != 'undefined' && valCheck != null)
      {
        setObjValueInput((obj)=>{
            return {
              ...obj,
              [nameInput]: valCheck
            }
        })
      }
  }

  const handleChangeInput = (event, tipeInput) => {
      setObjValueInput((obj)=>{
          return {
            ...obj,
            [tipeInput]: event.target.value
          }
      })
  }

  const handleSubmit = () => {

    console.log(objValueInput)

    let keyInvalid:any[] = [];

    // periksa apakah ada data yang kosong
    let tempObjValueInput:any[] = [...objRequired];
    tempObjValueInput.forEach((key)=>{
      
        if (objValueInput?.[key] == null || 
              (
                typeof objValueInput?.[key] == 'string' &&
                objValueInput?.[key] == ''
              )
        ){
          keyInvalid = [...keyInvalid, key]
        }
    })
    
    // periksa data kosong
    if (keyInvalid.length > 0)
    {
        notify('error', 'Input ' + joinWithCommaNSuffixAnd(keyInvalid) + ' harus dilengkapi !', 'TOP_CENTER');
        return
    }

    // periksa validitas email
    if (objValueInput?.['Email'] != null && typeof objValueInput?.['Email'] != 'undefined'){

        let pattEmail = new RegExp(/[a-zA-Z0-9.,?!$^&-_+=*()\[\]]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}/gi);

        // let exeEmail = pattEmail.exec(objValueInput?.['Email']);
        // console.log(objValueInput?.['Email']);
        // console.log("exeEmail");
        // console.log(exeEmail?.[0]);
        // console.log(exeEmail?.['input']);

        let tesEmail = pattEmail.test(objValueInput?.['Email']);
    
        if (!tesEmail){
          notify('error', 'Email tidak valid !', 'TOP_CENTER');
          return
        }

    }



    // periksa password & konfirmasi password
    if (objValueInput?.['Password'] != objValueInput?.['Konfirmasi Password']){
        notify('error', 'Password dan Konfirmasi Password tidak sama !', 'TOP_CENTER');
        return
    }

    let objSubmitToAPI = {};
    let endpoint = '';
    let methodhit = '';

    // menu dropdown bukan "Update User Me"
    if (!tipeMenu && tipeMenu != 'Update User Me')
    {
        if (status == 'Create'){
          methodhit = 'POST';
          endpoint = `${URL_API_PPE}/v1/users`;
        } 
        else if (status == 'Edit'){
          methodhit = 'PUT';
          endpoint = `${URL_API_PPE}/v1/users/${row?.['id']}`;
        }
        
      // object create / edit dengan kondisi sama
        objSubmitToAPI = 
          {
            "email": objValueInput?.['Email'],
            "is_active": objValueInput?.['is_active'],
            "is_superuser": objValueInput?.['is_superuser'],
            "full_name": objValueInput?.['Fullname'],
            "token_user": getValueFromLocalStorageFunc("IOT_TOKEN") ?? '',
            "password": objValueInput?.['Password']
          }
    }
    else if (tipeMenu == "Update User Me") {
        methodhit = 'PUT';
        endpoint = `${URL_API_PPE}/v1/users/me`;
        objSubmitToAPI = 
          {
            "password": objValueInput?.['Password'],
            "full_name": objValueInput?.['Fullname'],
            "email": objValueInput?.['Email']
          }
    }

    PPE_getApiSync(endpoint,
        objSubmitToAPI ?? null,"application/json",methodhit,
        getValueFromLocalStorageFunc("IOT_TOKEN") ?? "")
    .then((response)=>{

      setLoaderStatus(true);

      let statusCodeError = response?.['statusCode']; // error dari internal
      if (typeof statusCodeError != 'undefined'){                

          notify("error", response?.['msg'], "TOP_CENTER");

          setTimeout(()=>{
            setLoaderStatus(false);
          },200)

          return
      }
        
      if (typeof response?.['detail'] != 'undefined'){

          notify("error", response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? '', "TOP_CENTER");

          setTimeout(()=>{
              setLoaderStatus(false);
            
          },200)

          return
      }
      else {
          // jika success
          setLoaderStatus(false);
          setShow(false);
          outChange({tipe:'close_modal', value: false, form:'infocamera'});
      }
      
    })


    
  }

  return (
    <>

        {/* MODAL DETAIL INFO */}
            <Modal 
                    show = {show}
                  // show={this.state.modal.changePWD.show} 
                    centered = {true}
                    size="sm"
                    backdrop={true}
                    onHide={handleHide}
                    backdropClassName='modal-detail-info'
            >

                <Modal.Header className={`modalheader modal-header-global ${status == 'Edit' ? 'edit':status == 'Detail' ? 'detail':'create'}`}>
                    <Modal.Title className='dashboard-modal-title' >
                        
                        {
                          status == 'Create' && (
                            <FontAwesomeIcon icon = {faUserPlus} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                          )
                        }

                        {
                          status == 'Edit' && (
                            <FontAwesomeIcon icon = {faUserPen} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                          )
                        }

                        {
                          status == 'Detail' && (
                            <FontAwesomeIcon icon = {faCircleInfo} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                          )
                        }

                        {/* <img src = {PassPNG} width = {80} height = {80}
                            style = {{position:'absolute', zIndex:0, top:-30, right:0}}/> */}
                        
                        <span className='login-icon-modal-title'>
                            {title}
                            {/* Create User */}
                        </span>

                        {/* TES DOWNLOAD FILE */}
                        {/* <a href = "http://192.168.1.120:3007/download" download> Download </a> */}
                    </Modal.Title>
                    {/* <span className='dashboard-modal-close'
                      onClick={()=>this.handleClick_ChangePWD(false,'changePWD')}>X</span> */}
                </Modal.Header>


                <Modal.Body>

                    <div className='d-flex justify-content-center align-items-center'>
                        <Blocks
                              height="100"
                              width="100"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={loaderStatus}
                              ariaLabel="blocks-wrapper"
                        />
                    </div>

                    {
                        !loaderStatus
                        &&
                        <div
                            style={{display: loaderStatus ? 'none' : 'flex'}}
                            // className='row'
                            >
                              
                            <div className='d-flex flex-column align-items-center w-100'>
                                {
                                  row != null && 
                                  row?.['tools'] &&

                                    Object.keys(row?.['tools']) && (
                                        Object.keys(row?.['tools']).map((val, idx)=>{ 
                                            // helmet, glasses, ...
                                            return (
                                              <div key={`modal-detailinfo-subject-${idx}`} className='d-flex flex-row modal-detailinfo-container'>
                                                  <span className='modal-detailinfo-subject-1'>{val.substring(0,1).toUpperCase() + val.substring(1)}</span>
                                                  <span className='modal-detailinfo-subject-2 ms-2'>:</span>
                                                  <span className='modal-detailinfo-subject-3 ms-2'>{row?.['tools']?.[val]}</span>
                                              </div>
                                            )
                                        })
                                    )

                                }

                            </div>
                        </div>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <div className='d-flex justify-content-center w-100'>
                        <Button variant = "primary" 
                              onClick={()=>handleClick_ChangePWD(false,'infocamera')} 
                              disabled={loaderStatus}
                              style={{width:'100%'}}
                              >Close</Button>
                    </div>

                    {/* <Button variant = "primary" 
                          onClick={()=>handleSubmit()} 
                          disabled={loaderStatus}
                    >Save</Button> */}
                    
                </Modal.Footer>

                <ToastContainer 
                    draggable
                    pauseOnHover
                />

            </Modal>

    </>
  )
}

export default ModalDetailInfoCamera