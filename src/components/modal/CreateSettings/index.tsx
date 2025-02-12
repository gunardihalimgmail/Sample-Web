import React, { useEffect, useRef, useState } from 'react'
import './CreateSettings.scss'
import { Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Blocks } from 'react-loader-spinner';
import { Settings } from '@mui/icons-material';
import Switch from "react-switch"
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, joinWithCommaNSuffixAnd, notify } from '../../../services/functions';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import Select from 'react-select';

const ModalCreateSettings = (props) => {

  const { par_show, title, status, row, tipeMenu, par_statusLoader, listSettings, outChange } = props;

  // title -> 'Create Cameras'
  // status -> Create / Edit
  // row -> row.<key>  -> data per row
  // tipeMenu -> 'Update User Me', default ... (eg : list - users) // indikator ganti is_active dan is_superuser jadi icon
  // par_statusLoader -> show loaders Blocks

  const [show, setShow] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(true);

  let objMasterInput = {
      // 'Title':'',
      'Camera':null,
      'Storage Name':'',
      'ROI':'',
  }
  const [objValueInput, setObjValueInput] = useState({...objMasterInput});

  // const objRequired = ['Title', 'Storage Name','ROI']
  const objRequired = ['Storage Name','ROI']

  const refPasswordInput = useRef<HTMLInputElement | null>(null);
  const refFullNameInput = useRef<HTMLInputElement | null>(null);
  const refEmailInput = useRef<HTMLInputElement | null>(null);

  const [optionsSettings, setOptionsSettings] = useState<any>([]);
  const [valueCameraSelect, setValueCameraSelect] = useState<{}|null>({});

  // tujuan tanpa dependensi ([]) agar selalu masuk ke useEffect ini untuk focus
  // hanya jalan sekali saat render
  useEffect(()=>{

  }, [])

  useEffect(()=>{
    setOptionsSettings([...listSettings])
  },[listSettings])

  useEffect(()=>{
    // set status loader dari luar modal (eg. lagi fetch api)
    setLoaderStatus(par_statusLoader);

  }, [par_statusLoader])
  
  
  useEffect(()=>{
    setShow(par_show ?? false)

    // setTimeout(()=>{

      // if (par_show){
      //   const fetchData = async() => {
      //     // read data features to list
      //     await getDataFeature(); 
      //   }
      //   fetchData();
      // }
    // },100)

  },[par_show])


  useEffect(()=>{

      if (status == 'Edit'){

          if (Array.isArray(optionsSettings)){
            let findItem = optionsSettings.find(x=>x?.['value'] == row?.['id_camera']);
            if (findItem){
              // set value ke <Select
              setValueCameraSelect({...findItem});
            }
          }

          // setValueCameraSelect
        
          setObjValueInput((obj)=>{
              return {
                // 'Title': row?.['title'] ?? '',
                'Camera': row?.['id_camera'] ?? null,
                'Storage Name': row?.['storage_name'] ?? '',
                'ROI': row?.['roi'] ?? ''
              }
          })

      } else {
          // reset kosong semua data untuk 'create'
          
          setObjValueInput({...objMasterInput});
          setValueCameraSelect(null);
      }
  }, [row])

  useEffect(()=>{

    // use effect ini ter-call pada saat pertama kali buka modal sampai close modal

    setTimeout(()=>{
      if (refEmailInput.current){
        refEmailInput.current.focus();
        refEmailInput.current.select();
      } 
    },100)
    
  }, [status, title, tipeMenu])

  const onChangeSelectFilterModal = (e, action, menu) => {
      if (action != 'clear')
      {
        setValueCameraSelect({value:e.value, label:e.label})

        // set ke value untuk submit
        setObjValueInput((obj:any)=>{
          return {
            ...obj,
            'Camera':e.value
          }
        })
      }
      else {
        setValueCameraSelect(null);

        setObjValueInput((obj:any)=>{
          return {
            ...obj,
            'Camera':null
          }
        })
      }
      // setValueCameraSelect()
  }

  const handleHide = () => {
      // event ketika klik di luar modal
  }

  // kondisi close modal
  const handleClick_ChangePWD = (show:boolean, tipe:'create') => {
      if (tipe == 'create'){

          // setShow(show);
          setObjValueInput({...objMasterInput})
        
          // setTimeout(()=>{
            outChange({tipe:'close_modal', value: show, form:'create'});

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
    // if (!tipeMenu && tipeMenu != 'Update User Me')
    // {
        if (status == 'Create'){
          methodhit = 'POST';
          endpoint = `${URL_API_PPE}/v1/settings`;

          objSubmitToAPI = {
            ...objSubmitToAPI,
            "created_at": Math.floor(new Date().getTime() / 1000),
            "created_by": parseInt(getValueFromLocalStorageFunc('IOT_USER_ID')),
            "updated_at": Math.floor(new Date().getTime() / 1000),
            "updated_by": parseInt(getValueFromLocalStorageFunc('IOT_USER_ID')),
          }
        } 
        else if (status == 'Edit'){
          methodhit = 'PUT';
          endpoint = `${URL_API_PPE}/v1/settings/${row?.['id']}`;

          objSubmitToAPI = {
            ...objSubmitToAPI,
            "updated_at": Math.floor(new Date().getTime() / 1000),
            "updated_by": parseInt(getValueFromLocalStorageFunc('IOT_USER_ID')),
          }
        }
        
      // object create / edit dengan kondisi sama
        objSubmitToAPI = 
          {
            ...objSubmitToAPI,
            // "title": objValueInput?.['Title'],
            "id_camera": objValueInput?.['Camera'],
            "storage_name": objValueInput?.['Storage Name'],
            "roi": objValueInput?.['ROI']
          }
    // }

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
            outChange({tipe:'close_after_success_save', value: false, form:'create'});
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
                        <>
                            <Settings style={{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(1.5)`}} 
                                          className='login-dropdown-icon'/>

                            {/* <FontAwesomeIcon icon = {faCamera} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/> */}
                            <FontAwesomeIcon icon = {faPlus} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:0, top:10, zIndex:0, transform:`scale(1.5)`}}/>
                        </>
                      )
                    }

                    {
                      status == 'Edit' && (
                        <>
                            <Settings style={{position:'absolute', right:20, top:25, zIndex:0, transform:`scale(1.5)`}} 
                                          className='login-dropdown-icon'/>
                            {/* <FontAwesomeIcon icon = {faCamera} className='login-dropdown-icon' color={'darkgreen'} 
                                    style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/> */}
                            <FontAwesomeIcon icon = {faPencil} className='login-dropdown-icon' color={'darkgreen'} 
                                    style = {{position:'absolute', right:-2, top:15, zIndex:0, transform:`scale(1.5)`}}/>
                        </>
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
                          
                        {/* <Form.Group className='mb-1' controlId='id-title'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Title</Form.Label>
                            <Form.Control type = "text" className='modal-input-placeholder'
                                placeholder="Enter Title"
                                maxLength={100}
                                ref={refEmailInput}
                                value={objValueInput?.['Title']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'Title')}
                            />
                        </Form.Group> */}

                        <Form.Group className='mb-1 col-12' controlId='id-camera'>
                            <Form.Label className='mb-1 dash-modal-form-label'>Camera</Form.Label>
                            <Select options={optionsSettings} 
                                // className="select-class-modal-company"
                                // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                // isLoading = {this.state.modal.updateJenis.input.company.isLoading}
                                value={valueCameraSelect}
                                tabSelectsValue={false} isClearable={true}  
                                isSearchable={true}
                                onChange={(e, {action})=>{onChangeSelectFilterModal(e, action, 'listcamera')}}
                            />
                            
                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-storage_name'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Storage Name</Form.Label>
                            <Form.Control type = "text" className='modal-input-placeholder'
                                placeholder="Enter Storage Name"
                                maxLength={100}
                                ref={refFullNameInput}
                                value={objValueInput?.['Storage Name']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'Storage Name')}
                            />
                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-roi'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>ROI</Form.Label>
                            <Form.Control type = "text" className='modal-input-placeholder'
                                placeholder="Enter ROI"
                                maxLength={100}
                                value={objValueInput?.['ROI']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'ROI')}
                            />
                        </Form.Group>
                    </div>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant = "secondary" 
                      onClick={()=>handleClick_ChangePWD(false,'create')} disabled={loaderStatus}
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

export default ModalCreateSettings