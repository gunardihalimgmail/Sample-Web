import React, { useEffect, useRef, useState } from 'react'
import './CreateUser.scss'
import { Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUserPen, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Blocks } from 'react-loader-spinner';
import { Check, LensTwoTone } from '@mui/icons-material';
import Switch from "react-switch"
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, joinWithCommaNSuffixAnd, notify } from '../../../services/functions';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { CheckMark, RedCloseMark } from '../../../assets';

const ModalCreateUser = (props) => {

  const { par_show, title, status, row, tipeMenu, par_statusLoader, outChange } = props;

  // title -> 'Create User'
  // status -> Create / Edit
  // row -> row.<key>  -> data per row
  // tipeMenu -> 'Update User Me', default ... (eg : list - users) // indikator ganti is_active dan is_superuser jadi icon
  // par_statusLoader -> show loaders Blocks

  const [show, setShow] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(true);

  let objMasterInput = {
      'Email':'',
      'is_active':false,
      'is_superuser':false,
      'Fullname':'',
      'Password':'',
      'Konfirmasi Password':''
  }
  const [objValueInput, setObjValueInput] = useState({...objMasterInput});

  const objRequired = ['Email', 'Password', 'Konfirmasi Password']

  const refPasswordInput = useRef<HTMLInputElement | null>(null);
  const refFullNameInput = useRef<HTMLInputElement | null>(null);
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

    if (status == 'Edit'){
      
        setObjValueInput((obj)=>{
            return {
              'Email': row?.['email'] ?? '',
              'is_active': row?.['is_active'] ?? false,
              'is_superuser': row?.['is_superuser'] ?? false,
              'Fullname': row?.['full_name'] ?? '',
              'Password':'',
              'Konfirmasi Password':''
            }
        })
    } else {
        // reset kosong semua data untuk 'create'
        setObjValueInput({...objMasterInput});
    }

    setTimeout(()=>{
      if (refEmailInput.current){
        refEmailInput.current.focus();
        refEmailInput.current.select();
      } 
    },100)
    
  }, [par_show, status, title, tipeMenu, row])

  const handleHide = () => {
      // event ketika klik di luar modal
  }

  const handleClick_ChangePWD = (show:boolean, tipe:'createUser') => {
      if (tipe == 'createUser'){
        // setShow(show);
        setObjValueInput({...objMasterInput})
        // setTimeout(()=>{
          outChange({tipe:'close_modal', value: show, form:'createUser'});
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

            // not authenticated
            // if (response?.['detail'].toString().toLowerCase() == 'not authenticated')
            // {
            //   // jika tidak ada token, maka keluar dari form saja
            //   // setShowModal(false);
            // }
            
          },200)

          return
      }
      else {
          // jika success
          notify("success", "Your data was saved!", "TOP_CENTER");

          setTimeout(()=>{
            setLoaderStatus(false);
            setShow(false);
            outChange({tipe:'close_after_success_save', value: false, form:'createUser'});
          },1500)

      }
      
      // alert(JSON.stringify(response))
    })


    
  }

  return (
    <>

        {/* MODAL CREATE USER */}
        <Modal 
                show = {show}
              // show={this.state.modal.changePWD.show} 
                centered = {true}
                size="sm"
                backdrop={true}
                onHide={handleHide}
        >

            <Modal.Header className={`modalheader modal-header-global ${status == 'Edit' ? 'edit':'create'}`}>
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
                        className='row'
                        >
                          
                        {/* <Form.Group className='mb-2' controlId='formBasicOldPasssword'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Current Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' placeholder="Enter Current Password" 
                                // onChange={(event)=>this.handleChangePassword(event, 'oldPass')}
                                />
                        </Form.Group> */}
                        <Form.Group className='mb-1 col-12' controlId='id-email'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Email</Form.Label>
                            <Form.Control type = "text" className='modal-input-placeholder'
                                placeholder="Enter Email"
                                maxLength={100}
                                ref={refEmailInput}
                                value={objValueInput?.['Email']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'Email')}
                            />
                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-fullname'>
                            <Form.Label className='mb-1 dash-modal-form-label'>Full Name</Form.Label>
                            <Form.Control type = "text" className='modal-input-placeholder'
                                placeholder="Enter Full Name"
                                maxLength={50}
                                ref={refFullNameInput}
                                value={objValueInput?.['Fullname']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'Fullname')}
                            />
                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-password'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' 
                                  ref={refPasswordInput} 
                                  placeholder="Enter New Password" 
                                  value={objValueInput?.['Password']}
                                  disabled={loaderStatus}
                                  onChange={(event)=>handleChangeInput(event, 'Password')}
                                />
                        </Form.Group>
                        <Form.Group className='mb-1' controlId='id-confpassword'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Confirm Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' placeholder="Confirm New Password" 
                                disabled={loaderStatus}
                                value={objValueInput?.['Konfirmasi Password']}
                                onChange={(event)=>handleChangeInput(event, 'Konfirmasi Password')}
                            />
                        </Form.Group>
                        
                        <div className='d-flex justify-content-start gap-3 mt-3'>
                            {
                              tipeMenu == 'Update User Me' &&
                              (
                                  <>
                                  {/* Active */}
                                    {
                                      row?.['is_active'] && (
                                        <div className='d-flex align-items-center gap-1'>
                                          <img src={CheckMark} width={20} height={20}/>
                                          <span className='ppe-modal-label-active-check'>Active</span>
                                        </div>
                                      )
                                    }
                                    {
                                      !row?.['is_active'] && (
                                        <div className='d-flex align-items-center gap-1'>
                                          <img src={RedCloseMark} width={20} height={20}/>
                                          <span className='ppe-modal-label-active-check'>Active</span>
                                        </div>
                                      )
                                    }

                                    {/* Superuser */}
                                    {       
                                      row?.['is_superuser'] && (
                                        <div className='d-flex align-items-center gap-1'>
                                          <img src={CheckMark} width={20} height={20}/>
                                          <span className='ppe-modal-label-active-check'>Superuser</span>
                                        </div>
                                      )
                                    }

                                    {       
                                      !row?.['is_superuser'] && (
                                        <div className='d-flex align-items-center gap-1'>
                                          <img src={RedCloseMark} width={20} height={20}/>
                                          <span className='ppe-modal-label-active-check'>Superuser</span>
                                        </div>
                                      )
                                    }

                                  </>
                              )
                            }

                            {
                              tipeMenu != "Update User Me" && 
                              (
                                  <>
                                    <Form.Group className='mb-1' controlId='id-isactive'>
                                        <Form.Label className='mb-1 dash-modal-form-label'>Active</Form.Label>
                                        <div>
                                            <label>
                                                <Switch
                                                    // onColor="#86d3ff"
                                                    // onHandleColor="#2693e6"
                                                    // checkedIcon={false}
                                                    // uncheckedIcon={false}
                                                    // handleDiameter={30}
                                                    // height={20}
                                                    // width={48}
                                                    boxShadow='0px 1px 5px rgba(0,0,0,0.6)'
                                                    onChange={(val)=>{handleChangeSwitchChecked(val, 'is_active')}} 
                                                    checked = {objValueInput?.['is_active'] ?? false}
                                                />
                                            </label>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className='mb-1' controlId='id-issuperuser'>
                                        <Form.Label className='mb-1 dash-modal-form-label'>Superuser</Form.Label>
                                        <div>
                                            <label>
                                                <Switch
                                                    boxShadow='0px 1px 5px rgba(0,0,0,0.6)'
                                                    onChange={(val)=>{handleChangeSwitchChecked(val, 'is_superuser')}} 
                                                    checked = {objValueInput?.['is_superuser'] ?? false}
                                                />
                                            </label>
                                        </div>
                                    </Form.Group>
                                  </>
                              )
                            }


                        </div>
                    </div>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant = "secondary" 
                      onClick={()=>handleClick_ChangePWD(false,'createUser')} disabled={loaderStatus}
                      >Close</Button>
                <Button variant = "primary" 
                      onClick={()=>handleSubmit()} 
                      disabled={loaderStatus}
                >Save</Button>
            </Modal.Footer>

            <ToastContainer 
                draggable
                pauseOnHover
            />

        </Modal>

    </>
  )
}

export default ModalCreateUser