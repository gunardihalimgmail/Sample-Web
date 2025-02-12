import React, { useEffect, useRef, useState } from 'react'
import './CreateCameras.scss'
import { Button as BootstrapButton, Form, Modal } from 'react-bootstrap';
import { Button, Button as MuiButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCirclePlus, faKey, faPencil, faPlus, faUserPen, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Blocks } from 'react-loader-spinner';
import { Check, Close, LensTwoTone } from '@mui/icons-material';
import Switch from "react-switch"
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, joinWithCommaNSuffixAnd, notify } from '../../../services/functions';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { CheckMark, GoogleMapsIcon, GoogleMapsIcon2, RedCloseMark } from '../../../assets';
import MapComponent from '../../maps';
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';

const ModalCreateCameras = (props) => {

  const { par_show, title, status, row, tipeMenu, par_statusLoader, listSites, listPlaces, outChange } = props;

  // title -> 'Create Cameras'
  // status -> Create / Edit
  // row -> row.<key>  -> data per row
  // tipeMenu -> 'Update User Me', default ... (eg : list - users) // indikator ganti is_active dan is_superuser jadi icon
  // par_statusLoader -> show loaders Blocks

  const [show, setShow] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(true);

  const [invalidEndpoint, setInvalidEndpoint] = useState(false); // jika invalid endpoint (rtsp://, https://), maka trigger class invalid 'ppe-modal-cam-invalid-endpoint'

  let objMasterInput = {
      'Site':null,
      'Place':null,
      'Camera Name':'',
      'Camera Location':'',
      'Latitude':0,
      'Longitude':0,
      'Endpoint':'',
      'is_active':false
  }
  const [objValueInput, setObjValueInput] = useState({...objMasterInput});
  
  // sementara input lat lng jika belum di save
  const [objInputLatLng_Temp, setObjInputLatLng_Temp] = useState<any>({lat:null, lng:null});

  const objRequired = ['Site', 'Place', 'Camera Name', 'Camera Location', 'Endpoint']

  const refPasswordInput = useRef<HTMLInputElement | null>(null);
  const refFullNameInput = useRef<HTMLInputElement | null>(null);
  const refEmailInput = useRef<HTMLInputElement | null>(null);
  const refSiteInput = useRef<HTMLInputElement | any>(null);

  const [showModalMaps, setShowModalMaps] = useState(false);
  // tujuan tanpa dependensi ([]) agar selalu masuk ke useEffect ini untuk focus

  const [optionsSites, setOptionsSites] = useState<any>([]);
  const [valueSiteSelect, setValueSiteSelect] = useState<{}|null>({});

  const [optionsPlaces, setOptionsPlaces] = useState<any>([]);
  const [valuePlaceSelect, setValuePlaceSelect] = useState<{}|null>({});

  useEffect(()=>{
  }, [])

  useEffect(()=>{
    setOptionsSites([...listSites]);

  },[listSites])

  useEffect(()=>{
    setOptionsPlaces([...listPlaces]);


  },[listPlaces])

  useEffect(()=>{
    // set status loader dari luar modal (eg. lagi fetch api)
    setLoaderStatus(par_statusLoader);
    
    setInvalidEndpoint(false);
    
  }, [par_statusLoader])

  
  useEffect(()=>{

    // use effect ini ter-call pada saat pertama kali buka modal sampai close modal

    setShow(par_show ?? false)

    if (status == 'Edit'){

        if (Array.isArray(optionsSites)){
          let findItem = optionsSites.find(x=>x?.['value'] == row?.['site_id']);
          if (findItem){
            // set value ke <Select
            setValueSiteSelect({...findItem});
          }
        }

        if (Array.isArray(optionsPlaces)){
          let findItem = optionsPlaces.find(x=>x?.['value'] == row?.['place_id']);
          if (findItem){
            // set value ke <Select
            setTimeout(()=>{
              setValuePlaceSelect({...findItem});
            },100)
          }
      }

    
        setObjValueInput((obj)=>{
            return {
              ...obj,
              'Site': row?.['site_id'] ?? null,
              'Place': row?.['place_id'] ?? null,
              'Camera Name': row?.['camera_name'] ?? '',
              'Camera Location': row?.['latitude'] != null && row?.['longitude'] != null 
                                ? row?.['latitude'].toString() + ", " + row?.['longitude'].toString()
                                : '',
              'Latitude': row?.['latitude'] ?? 0,
              'Longitude': row?.['longitude'] ?? 0,
              'Endpoint': row?.['endpoint'] ?? '',
              'is_active': row?.['is_active'] ?? false
            }
        })
    } else {
        // reset kosong semua data untuk 'create'
        setObjValueInput({...objMasterInput});
        setValueSiteSelect(null);
        setValuePlaceSelect(null);
    }

    setTimeout(()=>{
      if (refSiteInput.current) {
        refSiteInput.current.focus();
      }
      // if (refEmailInput.current){
      //   refEmailInput.current.focus();
      //   refEmailInput.current.select();
      // } 
    },100)
    
  }, [par_show, status, title, tipeMenu, row])

  const handleHide = () => {
      // event ketika klik di luar modal
  }

  const getDataPlacesBySite = async(site_id) => {
      let temp_places_arr:any[] = [];

      let places_arr:any[] = await PPE_getApiSync(`${URL_API_PPE}/v1/places/filter/${site_id}`
                            ,null
                            , 'application/json'
                            , 'GET'
                            , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

      if (typeof places_arr?.['statusCode'] == 'undefined' &&
          typeof places_arr?.['detail'] == 'undefined')
      {
          // jika data ada
          temp_places_arr = [...places_arr.map((obj, idx)=>{
                        return {
                          value: obj?.['id'],
                          label: obj?.['name']
                        }
          })];

          return temp_places_arr ?? [];
      } else {
        return [];
      }
  }

  const onChangeSelectFilterModal = async(e, action, menu:'Site'|'Place') => {
    if (action != 'clear')
    {
      if (menu == 'Site'){setValueSiteSelect({value:e.value, label:e.label})};
      if (menu == 'Place'){setValuePlaceSelect({value:e.value, label:e.label})};

      // set ke value untuk submit
      setObjValueInput((obj:any)=>{
        return {
          ...obj,
          [menu]:e.value
        }
      })

      if (menu == 'Site') {
        // isi data array places based on site id
        let dataArrPlaces:any = await getDataPlacesBySite(e.value);
        setOptionsPlaces(dataArrPlaces.length > 0 ? [...dataArrPlaces] : [])
      }
    }
    else {

      setObjValueInput((obj:any)=>{
        let _temp_obj = {...obj}
        if (menu == 'Site'){
          _temp_obj = {
            ..._temp_obj,
            'Site': null,
            'Place': null
          }
        }
        else {
          _temp_obj = {
            ..._temp_obj,
            'Place': null
          }
        }

        return {
          ...obj,
          ..._temp_obj
        }
      })

      if (menu == 'Place'){setValuePlaceSelect(null)};

      if (menu == 'Site') {
        setValueSiteSelect(null);
        setValuePlaceSelect(null);
        // isi data array places based on site id
        setOptionsPlaces([]);
      }

    
    }
    // setValueCameraSelect()
  }


  const handleClick_ChangePWD = (show:boolean, tipe:'create') => {
      if (tipe == 'create'){
        setObjValueInput({...objMasterInput})
        // setShow(show);
        
        setTimeout(()=>{
          setOptionsPlaces([]);
          setOptionsSites([]);
          setValueSiteSelect(null);
          setValuePlaceSelect(null);
        },100)

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

  const handleBlurInput = (event, tipeInput) => {

      if (event.target.value != null && event.target.value != ''){
        let pattEndP = new RegExp(/^(rtsp:\/\/|https:\/\/)/gi);
        let testEndP = pattEndP.test(event.target.value);

        if (!testEndP){
            // jika tidak valid
            setInvalidEndpoint(true);
            notify('error','Endpoint harus diawali "rtsp://" atau "https://" !', 'TOP_CENTER', 1500)

        } else {setInvalidEndpoint(false)}
      } else { 
          setInvalidEndpoint(false);
      }
  }

  const handleChangeInput = (event, tipeInput) => {
  
      if (event.target.value != null && event.target.value != ''){
            let pattEndP = new RegExp(/^(rtsp:\/\/|https:\/\/)/gi);
            let testEndP = pattEndP.test(event.target.value);

            if (testEndP){
                // jika valid
                setInvalidEndpoint(false);
            }
      }

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

    if (invalidEndpoint){
      setInvalidEndpoint(true);
      // jika end point tidak di awali dengan "rtsp://" or "https://"
      notify('error','Endpoint harus diawali "rtsp://" atau "https://" !', 'TOP_CENTER', 1500)
      return;
    } 
    if (objValueInput?.['Endpoint'] == 'rtsp://' || 
        objValueInput?.['Endpoint'] == 'https://')
    {
        setInvalidEndpoint(true);
        notify('error','Input Endpoint kurang lengkap !', 'TOP_CENTER', 1000)
        return;
    }

    let objSubmitToAPI = {};
    let endpoint = '';
    let methodhit = '';

    // menu dropdown bukan "Update User Me"
    // if (!tipeMenu && tipeMenu != 'Update User Me')
    // {
        if (status == 'Create'){
          methodhit = 'POST';
          endpoint = `${URL_API_PPE}/v1/cameras/`;

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
          endpoint = `${URL_API_PPE}/v1/cameras/${row?.['id']}`;

          objSubmitToAPI = {
            ...objSubmitToAPI,
            "updated_at": Math.floor(new Date().getTime() / 1000),
            "updated_by": parseInt(getValueFromLocalStorageFunc('IOT_USER_ID')),
          }
        }
        
      // object create / edit dengan kondisi sama
      // "camera_location": objValueInput?.['Camera Location'],

        objSubmitToAPI = 
          {
            ...objSubmitToAPI,
            "place": objValueInput?.['Place'],
            "camera_name": objValueInput?.['Camera Name'],
            "latitude": objValueInput?.['Latitude'],
            "longitude": objValueInput?.['Longitude'],
            "endpoint": objValueInput?.['Endpoint'],
            "is_active": objValueInput?.['is_active']
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
  
  const handleClickMaps = (status:boolean) => {
    
    setShowModalMaps(status);

    if ((objValueInput?.['Latitude'] == 0 || objValueInput?.['Latitude'] == null) &&
        (objValueInput?.['Longitude'] == 0 || objValueInput?.['Longitude'] == null)){
          
          // jika kosong, maka set ke indonesia
          setObjInputLatLng_Temp({
            lat: -6.179390795905389,
            lng: 106.82778903999814
          })
    } 
    else {
      setObjInputLatLng_Temp({
          lat: objValueInput?.['Latitude'],
          lng: objValueInput?.['Longitude']
      })
    }
  }

  const handleValueChangeLatLng = (tipe:'lat'|'lng', value) => {
      let {floatValue} = value;

      if (typeof floatValue != 'undefined' && floatValue != null){
        setObjInputLatLng_Temp((obj)=>{
          return {
            ...obj,
            [tipe === 'lat'?'lat':'lng']:floatValue
          }
        })
      }
  }

  // method output dari google maps
  const handleChangeGoogleMaps = (valueObj) => {
    // valueObj?.['tipe']:'loadvalue'|'close'

      // sementara belum final
      // jika sudah final (click save), simpan ke setObjValueInput

      setObjInputLatLng_Temp((obj)=>{
        return {
          ...obj,
          'lat': parseFloat(valueObj?.['lat'].toString().slice(0,20)),
          'lng': parseFloat(valueObj?.['lng'].toString().slice(0,20))
        }
      })
  }

  const handleClickSaveMaps = () => {
      
      setObjValueInput({
        ...objValueInput,
        'Latitude': objInputLatLng_Temp?.['lat'],
        'Longitude': objInputLatLng_Temp?.['lng'],
        'Camera Location': objInputLatLng_Temp?.['lat'].toString() + ", " + 
                            objInputLatLng_Temp?.['lng'].toString()
      });

      setShowModalMaps(false);

  }

  return (
    <>

        {/* MODAL CREATE USER */}
        <Modal 
                show = {show}
              // show={this.state.modal.changePWD.show} 
                centered = {true}
                size="sm"
                // fullscreen={true}
                backdrop={true}
                onHide={handleHide}
        >

            <Modal.Header className={`modalheader modal-header-global ${status == 'Edit' ? 'edit':'create'}`}>
                <Modal.Title className='dashboard-modal-title' >
                    
                    {
                      status == 'Create' && (
                        <>
                            <FontAwesomeIcon icon = {faCamera} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                            <FontAwesomeIcon icon = {faPlus} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:0, top:10, zIndex:0, transform:`scale(1.5)`}}/>
                        </>
                      )
                    }

                    {
                      status == 'Edit' && (
                        <>
                            <FontAwesomeIcon icon = {faCamera} className='login-dropdown-icon' color={'darkgreen'} 
                                    style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                            <FontAwesomeIcon icon = {faPencil} className='login-dropdown-icon' color={'darkgreen'} 
                                    style = {{position:'absolute', right:0, top:35, zIndex:0, transform:`scale(1.5)`}}/>
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
                          
                        {/* <Form.Group className='mb-2' controlId='formBasicOldPasssword'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Current Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' placeholder="Enter Current Password" 
                                // onChange={(event)=>this.handleChangePassword(event, 'oldPass')}
                                />
                        </Form.Group> */}

                        {/* Sites */}
                        <Form.Group className='mb-1 col-12' controlId='id-sites'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Site</Form.Label>
                            <Select options={optionsSites} 
                                // className="select-class-modal-company"
                                // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                // isLoading = {this.state.modal.updateJenis.input.company.isLoading}
                                value={valueSiteSelect}
                                tabSelectsValue={false} isClearable={true}  
                                isSearchable={true}
                                ref={refSiteInput}
                                onChange={(e, {action})=>{onChangeSelectFilterModal(e, action, 'Site')}}
                            />
                        </Form.Group>

                        {/* Places */}
                        <Form.Group className='mb-1 col-12' controlId='id-places'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Place</Form.Label>
                            <Select options={optionsPlaces} 
                                // className="select-class-modal-company"
                                // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                // isLoading = {this.state.modal.updateJenis.input.company.isLoading}
                                value={valuePlaceSelect}
                                tabSelectsValue={false} isClearable={true}  
                                isSearchable={true}
                                onChange={(e, {action})=>{onChangeSelectFilterModal(e, action, 'Place')}}
                            />
                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-name'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Camera Name</Form.Label>
                            <Form.Control type = "text" className='modal-input-placeholder'
                                placeholder="Enter Camera Name"
                                maxLength={100}
                                ref={refEmailInput}
                                value={objValueInput?.['Camera Name']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'Camera Name')}
                            />
                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-cameralocation'>
                            {/* camera location = gabungan lat, long */}
                            <Form.Label className='mb-1 dash-modal-form-label required'>Camera Location (Lat, Lng)</Form.Label>

                            <div className='d-flex align-items-center gap-2'>
                                <Form.Control type = "text" className='modal-input-placeholder'
                                    // placeholder="Enter Camera Location"
                                    placeholder="e.g. -9.999, 9.999"
                                    maxLength={100}
                                    ref={refFullNameInput}
                                    value={objValueInput?.['Camera Location']}
                                    // disabled={loaderStatus}
                                    disabled={true}
                                    onChange={(event)=>handleChangeInput(event, 'Camera Location')}
                                />
                                <div>
                                    {/* ICON GOOGLE MAPS */}
                                    <Tooltip title={<span>Maps</span>} arrow placement='bottom'>
                                        <MuiButton color="info" variant='outlined' 
                                                  style={{padding:'0px 8px', minWidth:'auto'}}
                                                  onClick={()=>handleClickMaps(true)}
                                        >
                                            <img src={GoogleMapsIcon} width={27} height={35}/>
                                        </MuiButton>
                                    </Tooltip>
                                </div>
                            </div>


                            {/* MODAL MAPS */}

                                <Modal centered={true} show={showModalMaps} 
                                        backdrop={true}
                                        onHide={()=>handleClickMaps(false)}
                                        className='ppe-modal-maps'
                                        fullscreen
                                        >
                                    <Modal.Body>
                                        <div className='d-flex justify-content-between px-3'>

                                          {/* input lat and long */}
                                          <div className='mt-4 mt-md-0'>
                                              <table>
                                                  <tbody>
                                                      <tr>
                                                          <td >Latitude</td>
                                                          <td className='px-2'>:</td>
                                                          <td>
                                                              <Tooltip 
                                                                title="Range Latitude : -90 s.d 90"
                                                                placement='right'
                                                                arrow
                                                              >
                                                                  <Form.Group className='pt-2 d-flex align-items-center' 
                                                                            style={{width:'fit-content'}}
                                                                            controlId='id-lat'>
                                                                        <NumericFormat 
                                                                            className='modal-input-placeholder ppe-modal-maps-input-add-input'
                                                                            placeholder='e.g. -90 s.d 90'
                                                                            value={objInputLatLng_Temp?.['lat']}
                                                                            allowNegative={true}
                                                                            maxLength={20}
                                                                            isAllowed={(values)=>{
                                                                              const {floatValue} = values;
                                                                              if ((floatValue??0) < -90 || (floatValue??0) > 90){
                                                                                  return false;
                                                                              }
                                                                              return true;
                                                                            }}
                                                                            onValueChange={(value)=>handleValueChangeLatLng('lat', value)}
                                                                        />
                                                                  </Form.Group>
                                                              </Tooltip>
                                                          </td>
                                                      </tr>

                                                      <tr>
                                                          <td className='pt-0'>Longitude</td>
                                                          <td className='pt-0 px-2'>:</td>
                                                          <td className='pt-0'>
                                                              <Tooltip 
                                                                title="Range Longitude : -180 s.d 180"
                                                                placement='bottom'
                                                                arrow
                                                              >
                                                                  <Form.Group className='pt-1 d-flex align-items-center' 
                                                                            style={{width:'fit-content'}}
                                                                            controlId='id-lat'>
                                                                        <NumericFormat 
                                                                            className='modal-input-placeholder ppe-modal-maps-input-add-input'
                                                                            placeholder='e.g. -180 s.d 180'
                                                                            value={objInputLatLng_Temp?.['lng']}
                                                                            allowNegative={true}
                                                                            maxLength={20}
                                                                            isAllowed={(values)=>{
                                                                              const {floatValue} = values;
                                                                              if ((floatValue??0) < -180 || (floatValue??0) > 180){
                                                                                  return false;
                                                                              }
                                                                              return true;
                                                                            }}
                                                                            onValueChange={(value)=>handleValueChangeLatLng('lng', value)}
                                                                        />
                                                                  </Form.Group>
                                                              </Tooltip>

                                                          </td>
                                                          <td className='ps-2 pt-1 d-none d-md-block'>
                                                            {/* show button 'Save' di samping input text longitude pada saat layar di atas 768px */}
                                                            <Button className='ppe-modal-maps-text-save' color="success" size="small" variant='outlined'
                                                                  onClick={handleClickSaveMaps}>
                                                                <span >Save</span>
                                                            </Button>
                                                          </td>
                                                      </tr>

                                                      {/* di Hide jika sudah layar desktop, jika mobile maka di show */}
                                                      <tr className='d-md-none'>
                                                          <td className='pt-0'></td>
                                                          <td className='pt-0 px-2'></td>
                                                          <td className='pt-2 text-end'>
                                                            {/* show button save di bawah untuk layar mobile */}
                                                            <Button className='ppe-modal-maps-text-save text-white' color="success" size="small" 
                                                                  fullWidth
                                                                  variant='contained'>
                                                                <span >Save</span>
                                                            </Button>
                                                          </td>
                                                      </tr>

                                                  </tbody>
                                              </table>
                                          </div>

                                          <div className='modal-maps-close d-flex' onClick={()=>handleClickMaps(false)}>
                                              <Close fontSize='large' />
                                          </div>

                                        </div>

                                        <div className='mt-2' style={{width:'100%'}}>

                                            <div style = {{height:'80vh'}}>

                                                {/* MODAL GOOGLE MAPS */}
                                                <MapComponent textStyle='light' type='input' lat={objInputLatLng_Temp?.['lat']} lng={objInputLatLng_Temp?.['lng']} outChange={handleChangeGoogleMaps}  />

                                            </div>
                                        </div>

                                    </Modal.Body>
                                </Modal>

                        </Form.Group>

                        <Form.Group className='mb-1 col-12' controlId='id-endpoint'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Endpoint</Form.Label>
                            <Form.Control type = "text" 
                                className={`modal-input-placeholder ${invalidEndpoint ? 'ppe-modal-cam-invalid-endpoint':''}`}
                                placeholder="e.g. rtsp://xxx.xxx | https://xxx.xxx"
                                maxLength={500}
                                ref={refFullNameInput}
                                value={objValueInput?.['Endpoint']}
                                disabled={loaderStatus}
                                onChange={(event)=>handleChangeInput(event, 'Endpoint')}
                                onBlur={(event)=>handleBlurInput(event, 'Endpoint')}
                            />
                        </Form.Group>
                        
                        <div className='d-flex justify-content-start gap-3 mt-1'>
                            {
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

                                </>
                            }


                        </div>
                    </div>
                }
            </Modal.Body>

            <Modal.Footer>
                <BootstrapButton variant = "secondary" 
                      onClick={()=>handleClick_ChangePWD(false,'create')} disabled={loaderStatus}
                      >Close</BootstrapButton>
                <BootstrapButton variant = "primary" 
                      onClick={()=>handleSubmit()} 
                      disabled={loaderStatus}
                >Save</BootstrapButton>
            </Modal.Footer>

            <ToastContainer 
                draggable
                pauseOnHover
            />

        </Modal>

    </>
  )
}

export default ModalCreateCameras