import React, { useEffect, useRef, useState } from 'react'
import './Events.scss';
import storeMenu from '../../../stores'
import { Card, ListGroup } from 'react-bootstrap';
import { Button as ButtonMui } from '@mui/material'
import { Box, Tab, Tabs } from '@mui/material';
import { Grid, MagnifyingGlass, Bars, RotatingLines } from 'react-loader-spinner';
import NumberAnimate from '../../atoms/numberAnimate';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import MapComponent from '../../maps';
import { ArrowBackIosNew, ConstructionOutlined, DateRange, DateRangeOutlined, DateRangeRounded } from '@mui/icons-material';
import { MustSearch, NoData, OnlineWorld } from '../../../assets';
import { Gallery, Item } from 'react-photoswipe-gallery';

import 'photoswipe/dist/photoswipe.css';
import { PhotoSwipeOptions } from 'photoswipe';

import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from 'react-datepicker';
import { DateRangeIcon } from '@mui/x-date-pickers';
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, notify } from '../../../services/functions';
import { ToastContainer } from 'react-toastify';
import { format, lastDayOfMonth } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import ReactPlayer from 'react-player/lazy';

import {FilterMatchMode, FilterOperator} from 'primereact/api'
import {MultiSelect} from 'primereact/multiselect';
import {Button as ButtonPrime} from 'primereact/button';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton'
import { Tag } from 'primereact/tag';
import Icon from '@mdi/react';
import { mdiCalendarMultipleCheck, mdiCctv, mdiClipboard, mdiClipboardCheckMultiple, mdiClipboardCheckMultipleOutline, mdiClipboardText, mdiCountertop, mdiDotsGrid, mdiMapMarkerOutline } from '@mdi/js';

import ReactHlsPlayer from 'react-hls-player';

import video1 from '../../../assets/video/video1.mp4';
import video2 from '../../../assets/video/video2.mp4';

import { useInView } from 'react-intersection-observer';


// import PrimeReact from 'primereact/api';

// PrimeReact.ripple = true;    // atur secara manual ripple PrimeReact

interface CustomTabPanelProps {
  children?:React.ReactNode,
  index:number,
  value:number,
  [key:string]:any
}

  // Element Content Tab
  const CustomTabPanel:React.FC<CustomTabPanelProps> = ({children, index, value, outRefresh, ...props}) => {
      return (
        <></>
      )
  }


const Events = () => {

  // *** scrolling and load data more (react-intersection-observable)
  // const {ref, inView} = useInView({
  //     threshold: 0.93, // 10% terlihat, maka di load next data
  //     // rootMargin:'300px',
  //     triggerOnce: false,
  //     onChange(inView, entry) {
  //             // *** Get data when scrolling to bottom

  //         if (inView){
  //           console.log(entry)
  //           // alert( `Place ${JSON.stringify(selectedPlace)}`);
            
  //           if (isFetching) {
  //             // refMasuk.current.scrollIntoView();
  //             return;
  //           }

            
  //           const getDataScroll = async() => {

  //                setIsFetching(true);

  //               // setTimeout(async()=>{
  //                   let place_id = selectedPlace?.[0]?.id;
  //                   if (place_id != null) {
  //                     await generateArrImageCameraFunc_InComp(startDate, endDate, place_id);
  //                     setIsFetching(false);
  //                   }
  //               // },0)
  //           }
  //           getDataScroll();
  //         }
  //     },
  // });


  const [isFetching,  setIsFetching] = useState(false); // State untuk menandakan proses sedang berlangsung

  // ...

  const playerRef = useRef<HTMLVideoElement>(null);
  const [inputRefs, setInputRefs] = useState<any>([]);

  const refMasuk = useRef<any>(null);

  // Multi Select
  const [sites, setSites] = useState<any>([]);
  const [places, setPlaces] = useState<any>([]);

  // const site = [
  //   {name:'Jakarta', code: 'JKT'},
  //   {name:'Pontianak', code: 'PNK'},
  //   {name:'Surabaya', code: 'SBY'},
  //   {name:'Bandung', code: 'BDG'},
  //   {name:'Bali', code: 'BAL'}
  // ];
  // const places = [
  //   {name:'SPBU 1', code: 'SPBU 1'},
  //   {name:'SPBU 2', code: 'SPBU 2'},
  //   {name:'SPBU 3', code: 'SPBU 3'},
  //   {name:'SPBU 4', code: 'SPBU 4'},
  //   {name:'SPBU 5', code: 'SPBU 5'}
  // ];

  
  const photoSwpOpt:PhotoSwipeOptions = {
      arrowPrev:true,
      arrowNext:true,
      zoom: true,
      // initialZoomLevel:1.01,
      secondaryZoomLevel:2,
      wheelToZoom: true,
      zoomTitle:'Zoom',
      // maxZoomLevel
      close: true,
      counter: false,
      bgOpacity: 0.7,
      bgClickAction: false,
      clickToCloseNonZoomable: false
  }

  const [arrImageCameraGal, setArrImageCameraGal] = useState<any[]>([]);

  const [selectedSite, setSelectedSite] = useState<any>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>([]);
  const [disabledPlace, setDisabledPlace] = useState(true);
  const [disabledCari, setDisabledCari] = useState(true);
  const [statusCari, setStatusCari] = useState(false);
  const [statusAwal, setStatusAwal] = useState(true);

  const handleChangeSite = async(e) => {
    // e.value => {name:..., city:...}
    setSelectedPlace([]);

    if (e.value.length >= 1){

      let objSelected:any = {...e.value[e.value.length-1]};
      setSelectedSite([objSelected]);
      setSelectedPlace([]);

      let data_places:any = await getDataPlacesApi(objSelected?.['id'] ?? null);

      setPlaces(data_places ? [...data_places] : []);

      // * asumsi pasti ada perubahan, maka button cari di disable
      setDisabledCari(true);

      // if (e.value.length > 0 && selectedPlace.length > 0 
      //     && startDate != null && endDate != null
      // ) {
      //   setDisabledCari(false);
      // }
      

      setDisabledPlace(false);
    } 
    else {
      setSelectedSite([]);
      setPlaces([]);
      setDisabledCari(true);

      setDisabledPlace(true);
    }
  }

  const handleChangePlace = async(e) => {

    if (e.value.length >= 1){

      let objSelected:any = {...e.value[e.value.length - 1]};
      setSelectedPlace([objSelected]);
  
      // setSelectedPlace(e.value);  // multi value
  
      // jika sudah terisi site dan places, maka baru akan aktif tombol cari
      if (e.value.length >= 1 && sites.length >= 1
        && startDate != null && endDate != null
      ) {
          setDisabledCari(false);
        }
        else {
          setDisabledCari(true);
        }
    } 
    else {
      // hanya bisa pilih satu place
        setSelectedPlace([]);
        setDisabledCari(true);
    }
  }

  // ...

  // Prime React Data Table
  const [datas, setDatas] = useState<any>([]);
  const [selectedDatas, setSelectedDatas] = useState<any>(null);


  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS},
    status: { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.EQUALS}]},
    name:   { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.STARTS_WITH}]},
    uptime: { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.STARTS_WITH}]},
    version: { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.STARTS_WITH}]},

  })
  // ... 

  // const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal'];
  const statuses = ['ONLINE', 'OFFLINE'];

  // Prime React Select Button Group
  const listGridOptions = [
      {icon: 'pi pi-list', value:'List'},
      {icon: 'pi pi-th-large', value:'Grid'}
  ];
  const [valSelectListGrid, setValSelectListGrid] = useState("List");  // default Select Button
  const justifyTemplate = (option) => {
      return <i className={option.icon} title={option.value}></i>;
  }

  const handleChangeSelectListGrid = (e) => {
    // ** agar efek aktif warna background tidak hilang
    if (e.value != null){
      if (e.value != valSelectListGrid) {
        setValSelectListGrid(e.value)
      }
    }
  }

  // ...
  
  const getSeverity = (status) => {
      if (status){
          switch (status) {
              // case 'online':  return 'success';
              // case 'offline': return 'warning';

              case 'unqualified':
                  return 'danger';
    
              case 'qualified':
                  return 'success';
    
              case 'new':
                  return 'info';
    
              case 'negotiation':
                  return 'warning';
    
              case 'renewal':
                  return null;
          }
      } else {
        return null;
      }
  };

  const [sortField, setSortField] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<any>(null);


  // Set Date Periode
  const [startDate, setStartDate] = useState<Date | any>(new Date(new Date().setDate(1)));
  const [endDate, setEndDate] = useState<Date | any>(lastDayOfMonth(new Date()));

  const [dataCamera, setDataCamera] = useState<any[] | null>([]);
  // data -> [{id:1, camera_name:xxx, is_active:true, endpoint:xxx, latitude:9.99, longitude:9.99}]

  // Total Camera render
  const [totalCamera, setTotalCamera] = useState(15);

  const [statusNoData, setStatusNoData] = useState(false);  // status no data akan show icon no data jika data camera tidak ada

  const [disabledTab, setDisabledTab] = useState(false);

  // loader pada saat ganti tab camera
  const [showLoaderMain, setShowLoaderMain] = useState(true);

  // Tab Camera (index ter-select) 
  const [tabValue, setTabValue] = useState(0);

  const [arrImageCamera, setArrImageCamera] = useState<any[]>([
    // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
    // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
    // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
    // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
    // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`}
  ])

  const [ objChartData, setObjChartData ] = useState({});
  // contoh -> {'camera-1':{categories:['helmet','wearpack','glasses'], data:[1,2,3]}}

  const [objCardList, setObjCardList] = useState({
    // 'camera-1':{
      //     label: 'Camera 1',
      //     tools:{
      //       'helmet': {label:'Helmet', value:789, previousValue:9, avatarIcon:<Avatar src={Helmet} sx={{bgcolor:teal["200"]}} />, percent:'100%', trenStatus:null, trenIcon: null},
      //       'glasses': {label:'Glasses', value:25, previousValue:50, avatarIcon:<Avatar src={Glasses} sx={{bgcolor:lightGreen["200"]}} />, percent:'50%', trenStatus:'down', trenIcon: <ArrowDownward sx={{color:'red'}} />},
      //       'earmuffs': {label:'Ear Muffs', value:78, previousValue:39, avatarIcon:<Avatar src={EarMuffs} sx={{bgcolor:yellow["A700"]}} />, percent:'70%',  trenStatus:'down', trenIcon: <ArrowDownward sx={{color:'red'}} />},
      //       'respirator': {label:'Respirator', value:100, previousValue:79, avatarIcon:<Avatar src={Respirator} sx={{bgcolor:purple["100"]}} />, percent:'70%', trenStatus:'up', trenIcon: <ArrowUpward sx={{color:'green'}} />},
      //       'wearpack': {label:'Wearpack', value:150, previousValue:130, avatarIcon:<Avatar src={Wearpack} sx={{bgcolor:orange["200"]}} />, percent:'28.87%', trenStatus:'up', trenIcon: <ArrowUpward sx={{color:'green'}} />},
      //       'harness': {label:'Safety Harness', value:9, previousValue:10, avatarIcon:<Avatar src={SafetyHarness} sx={{bgcolor:lime["700"]}} />, percent:'10%', trenStatus:'down', trenIcon: <ArrowDownward sx={{color:'red'}} />},
      //       'gloves': {label:'Gloves', value:50, previousValue:25, avatarIcon:<Avatar src={Gloves} sx={{bgcolor:cyan["100"]}} />, percent:'17.56%', trenStatus:'up', trenIcon: <ArrowUpward sx={{color:'green'}} />},
      //       'shoes': {label:'Safety Shoes', value:100, previousValue:200, avatarIcon:<Avatar src={SafetyShoes} sx={{bgcolor:yellow["400"]}} />, percent:'99.99%', trenStatus:'down', trenIcon: <ArrowDownward sx={{color:'red'}} />}
      //     },
      //     position: {lat:9.99, lng:9.99},
      //     url_video: 'https://embed.api.video/live/li7l84vhPhQjjSRQ1J8prILs',
      //     time: '01 December 2023 15:00'
      // },
  });

  const selectedPlaceRef = useRef(selectedPlace);
  const startDateRef = useRef(startDate);
  const endDateRef = useRef(endDate);
  const isFetchingRef = useRef<boolean>(false); // untuk indikator proses scroll
  const arrImageCameraGalRef = useRef<any[]>([]); // data image  
  const arrImageCameraGalLengthRef = useRef<any>(0);



  // ** PIIS Testing Scroll Window
  const generateArrImageCameraFunc_ScrollWindow = async(tanggal_start?:Date, tanggal_end?:Date, place_id?:any, arrImageCameraGal_length?:number) => {
    if (tanggal_start != null && tanggal_end != null && place_id != null)
    {       

            let start_month, end_month, periode;  // periode -> "2024-06"

            start_month = format(tanggal_start, "yyyy-MM-dd", {locale:idLocale});
            end_month = format(tanggal_end, "yyyy-MM-dd", {locale: idLocale});

            
            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cctvresults/places/?skip=${arrImageCameraGal_length}&limit=100&place_id=${place_id}&start_month=${start_month}&end_month=${end_month}`
                  , null
                  , 'application/json'
                  , 'GET'
                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
            
            let statusCodeError = resultdata?.['statusCode']; // error dari internal
            let responseDetail = resultdata?.['detail'] // error dari api

            let arrImageCamera_temp = [...arrImageCamera];

            if (typeof statusCodeError != 'undefined'){
                arrImageCamera_temp = [];
                
                notify('error', "'API Images' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
                return
            }
            else if (typeof responseDetail != 'undefined'){
                arrImageCamera_temp = [];

                notify('error', "'API Images' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
                return
            }
            else {

                // jika data ada, ambil raw_data
                if (Array.isArray(resultdata) && resultdata.length > 0){

                  try {
                      let raw_data_ori = [...resultdata];

                      let raw_data_modif = raw_data_ori.map((obj, idx)=>{
                            return {
                              ...obj,
                              isLoading: true
                            }
                      })

                      arrImageCamera_temp = [...raw_data_modif];

                      console.error("IMAGE raw_data_modif");
                      console.log(raw_data_modif);
  
                      // ... Modifikasi object
  
                      // let raw_data_result_str = resultdata?.[0]?.['raw_data'];
                      
                    }
                    catch(e:any){
                      arrImageCamera_temp = [];
              
                      notify('error', e.toString(), 'TOP_CENTER');
                    }
                }
                else {
                    arrImageCamera_temp = [];
                }
            }

            // let gabungimg = [...arrImageCameraGal, ...arrImageCamera_temp];

            // console.log("arrImageCameraGalx");
            // console.log(arrImageCameraGal);
            
            // setArrImageCameraGal([...gabungimg]);

            // * menambahkan data image baru ke arrImageCameraGal
            // setDatas([...gabungimg]);

            return [...arrImageCamera_temp];

    }
    else {
      return [];
    }
}

  
  const generateArrImageCameraFunc_InComp = async(tanggal_start?:Date, tanggal_end?:Date, place_id?:any) => {
    
      if (tanggal_start != null && tanggal_end != null && place_id != null)
    {
              // *** nanti tambahkan id camera jika API sudah ready (parameter results)
              let start_month, end_month, periode;  // periode -> "2024-06"

              start_month = format(tanggal_start, "yyyy-MM-dd", {locale:idLocale});
              end_month = format(tanggal_end, "yyyy-MM-dd", {locale: idLocale});
  
              
              let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cctvresults/places/?skip=${arrImageCameraGal.length}&limit=100&place_id=${place_id}&start_month=${start_month}&end_month=${end_month}`
                    , null
                    , 'application/json'
                    , 'GET'
                    , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
              
              let statusCodeError = resultdata?.['statusCode']; // error dari internal
              let responseDetail = resultdata?.['detail'] // error dari api

              let arrImageCamera_temp = [...arrImageCamera];

              if (typeof statusCodeError != 'undefined'){
                  arrImageCamera_temp = [];
                  
                  notify('error', "'API Images' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
                  return
              }
              else if (typeof responseDetail != 'undefined'){
                  arrImageCamera_temp = [];

                  notify('error', "'API Images' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
                  return
              }
              else {

                  // jika data ada, ambil raw_data
                  if (Array.isArray(resultdata) && resultdata.length > 0){

                    try {
                        let raw_data_ori = [...resultdata];

                        let raw_data_modif = raw_data_ori.map((obj, idx)=>{
                              return {
                                ...obj,
                                isLoading: true
                              }
                        })

                        arrImageCamera_temp = [...raw_data_modif];

                        console.error("IMAGE raw_data_modif");
                        console.log(raw_data_modif);
    
                        // ... Modifikasi object
    
                        // let raw_data_result_str = resultdata?.[0]?.['raw_data'];
                        
                      }
                      catch(e:any){
                        arrImageCamera_temp = [];
                
                        notify('error', e.toString(), 'TOP_CENTER');
                      }
                  }
                  else {
                      arrImageCamera_temp = [];
                  }
              }

              let gabungimg = [...arrImageCameraGal, ...arrImageCamera_temp];

              console.log("arrImageCameraGalx");
              console.log(arrImageCameraGal);
              
              setArrImageCameraGal([...gabungimg]);

              // menambahkan data image baru ke arrImageCameraGal
              setDatas([...gabungimg]);


              // setelah 5 detik, maka semua loading akan di-false
              setTimeout(()=>{
                setArrImageCameraGal(prevImages=>{
                  let prev = [...prevImages];
                  let result_uptofalse = prev.map((obj,idx)=>{
                    return {
                      ...obj,
                      isLoading:false
                    }
                  })
                  return result_uptofalse;
                })
              },5000) // 5 detik
    
      }

      return
      // FOR TEST ONLY, TUNGGU API REKAPAN
      // jumlah gambar
      let randomJumlahImage = Math.floor(Math.random() * 10); // 0 - 9
      
      if (randomJumlahImage > 0){
        let arrImage:any[] = [];
        let arrImageTemp = new Array(randomJumlahImage).fill({isLoading: true});

        arrImage = arrImageTemp.map((val, idx)=>{
          return {
            // isLoading: true,
            isLoading: val?.['isLoading'],
            url: `https://picsum.photos/800/${Math.floor((Math.random()*401)+400)}`
            // url: `https://picsum.photos/1000/${Math.floor((Math.random()*401)+400)}`
          }
        })

        if (arrImage.length > 0)
        {
          // isi gambar yang sudah ada existing "arrImageCameraGal"
          // , kemudian tambahkan list gambar baru
          let arrImg_temp = [...arrImageCameraGal, 
                              ...arrImage];

          setArrImageCameraGal([...arrImg_temp]);

          // setelah 5 detik, maka semua loading akan di-false
          setTimeout(()=>{
            setArrImageCameraGal(prevImages=>{
              let prev = [...prevImages];
              let result_uptofalse = prev.map((obj,idx)=>{
                return {
                  ...obj,
                  isLoading:false
                }
              })
              return result_uptofalse;
            })
          },5000) // 5 detik

        }

      }
  }

  const getDataCamera = async() => {
      // MASTER DATA CAMERA
      let response = await PPE_getApiSync(`${URL_API_PPE}/v1/cameras/?skip=0&limit=1000`
              ,null
              , 'application/json'
              , 'GET'
              , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

        // .then((response)=>{

      let statusCodeError = response?.['statusCode']; // error dari internal
      let responseDetail = response?.['detail'] // error dari api
        
      if (typeof statusCodeError != 'undefined'){
          notify('error', "'API Camera' " + (response?.['msg'] ?? ''), 'TOP_CENTER')
          return [];
      }
      else if (typeof responseDetail != 'undefined'){
          notify('error', "'API Camera' " + (response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? ''), 'TOP_CENTER')
          return [];
      }
      else {
          if (Array.isArray(response)){
            return [...response];
          }
          else {
            return [];
          }
      }
        // });
  }


  const getDataSitesApi = async() => {

      
    let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/sites/?skip=0&limit=1000`
                    , null
                    , 'application/json'
                    , 'GET'
                    , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

    let statusCodeError = resultdata?.['statusCode']; // error dari internal
    let responseDetail = resultdata?.['detail'] // error dari api

    let data:any = [];

    if (typeof statusCodeError != 'undefined'){

        notify('error', "'API Results' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
        return data;
    }
    else if (typeof responseDetail != 'undefined'){

        notify('error', "'API Results' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
        return data
    }
    else {
      // jika data ada, ambil raw_data
        if (Array.isArray(resultdata) && resultdata.length > 0){
            data = [...resultdata];
        } else {
            data = []
        }
        return data;
    }
      

      // *** Sample Data
      // const data = [
      //   {
      //       id: 1000,
      //       name: 'James Butt',
      //       country: {
      //           name: 'Algeria',
      //           code: 'dz'
      //       },
      //       company: 'Benton, John B Jr',
      //       date: '2015-09-13',
      //       status: 'unqualified',
      //       verified: true,
      //       activity: 17,
      //       representative: {
      //           name: 'Ioni Bowcher',
      //           image: 'ionibowcher.png'
      //       },
      //       balance: 70663
      //   },
      //   {
      //       id: 2000,
      //       name: 'Anderson',
      //       country: {
      //           name: 'China',
      //           code: 'cn'
      //       },
      //       company: 'Google',
      //       date: '2017-10-18',
      //       status: 'new',
      //       verified: true,
      //       activity: 20,
      //       representative: {
      //           name: 'Wang Ming',
      //           image: 'amyelsner.png'
      //       },
      //       balance: 80010
      //   }
      // ];
      // const data = [];

  }

  const getDataPlacesApi = async(site_id) => {
      
      if (typeof site_id != 'undefined' && site_id != null) {

        let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/places/filter/${site_id}`
                        , null
                        , 'application/json'
                        , 'GET'
                        , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
  
        let statusCodeError = resultdata?.['statusCode']; // error dari internal
        let responseDetail = resultdata?.['detail'] // error dari api
  
        let data:any = [];
  
        if (typeof statusCodeError != 'undefined'){
  
            notify('error', "'API Results' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
            return data;
        }
        else if (typeof responseDetail != 'undefined'){
  
            notify('error', "'API Results' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
            return data
        }
        else {
        // jika data ada, ambil raw_data
        if (Array.isArray(resultdata) && resultdata.length > 0){
            data = [...resultdata];
        } 
        else {
            data = []
        }
            return data;
        }

      } else {
        return [];
      }

  }


  // akses mp4 agar tidak expired di aws s3
  const [headers, setHeaders] = useState({});

  const getDataCameraApi = () => {
      const data = [
        {
          id: 0,
          status: 'Online',
          name: 'oprit',
          uptime: 'up 3 days',
          version: '3.0.0'
        },
        {
          id: 1,
          status: 'Online',
          name: 'frontdoor',
          uptime: 'up 107 days',
          version: '3.0.0'
        },
        // {
        //   id: 2,
        //   status: 'Offline',
        //   name: 'street2',
        //   uptime: 'up 5 days',
        //   version: '3.0.0'
        // },
        // {
        //   id: 3,
        //   status: 'Offline',
        //   name: 'street3',
        //   uptime: 'up 19 days',
        //   version: '3.2.0'
        // },
        // {
        //   id: 4,
        //   status: 'Offline',
        //   name: 'street4',
        //   uptime: 'up 19 days',
        //   version: '3.2.0'
        // },
        // {
        //   id: 5,
        //   status: 'Online',
        //   name: 'street5',
        //   uptime: 'up 19 days',
        //   version: '3.2.0'
        // }
      ];
      return data;
  }


  // *** testing aws s3 konfigurasi
  const [videoUrl, setVideoUrl] = useState<any>(null);

  
  
  
  const generateArrImageCameraFunc_Scroll = async(tanggal_start:Date|null, tanggal_end:Date|null, place_id:any ) => {

    if (tanggal_start != null && tanggal_end != null && place_id != null)
    {
            // *** nanti tambahkan id camera jika API sudah ready (parameter results)
            let start_month, end_month, periode;  // periode -> "2024-06"

            start_month = format(tanggal_start, "yyyy-MM-dd", {locale:idLocale});
            end_month = format(tanggal_end, "yyyy-MM-dd", {locale: idLocale});

            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cctvresults/places/?skip=${arrImageCameraGal.length}&limit=100&place_id=${place_id}&start_month=${start_month}&end_month=${end_month}`
                  , null
                  , 'application/json'
                  , 'GET'
                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
            
            let statusCodeError = resultdata?.['statusCode']; // error dari internal
            let responseDetail = resultdata?.['detail'] // error dari api

            let arrImageCamera_temp = [...arrImageCamera];

            if (typeof statusCodeError != 'undefined'){
                arrImageCamera_temp = [];
                
                notify('error', "'API Images' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
                return []
            }
            else if (typeof responseDetail != 'undefined'){
                arrImageCamera_temp = [];

                notify('error', "'API Images' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
                return []
            }
            else {

                // jika data ada, ambil raw_data
                if (Array.isArray(resultdata) && resultdata.length > 0){

                  
                  try {
                      let raw_data_ori = [...resultdata];

                      let raw_data_modif = raw_data_ori.map((obj, idx)=>{
                            return {
                              ...obj,
                              isLoading: true
                            }
                      })

                      arrImageCamera_temp = [...raw_data_modif];

                      console.error("IMAGE raw_data_modif");
                      console.log(raw_data_modif);
  
                      // ... Modifikasi object
  
                      // let raw_data_result_str = resultdata?.[0]?.['raw_data'];
                      
                    }
                    catch(e:any){
                      arrImageCamera_temp = [];
               
                      notify('error', e.toString(), 'TOP_CENTER');
                    }
                }
                else {
                    arrImageCamera_temp = [];
                }
            }

            let gabungimg = [...arrImageCameraGal, ...arrImageCamera_temp];

            // tampil di card
            setArrImageCamera([...gabungimg]);

            // setelah 5 detik, maka semua loading akan di-false
            setTimeout(()=>{
              setArrImageCamera(prevImages=>{
                let prev = [...prevImages];
                let result_uptofalse = prev.map((obj,idx)=>{
                  return {
                    ...obj,
                    isLoading:false
                  }
                })
                return result_uptofalse;
              })
            },5000) // 5 detik

    }
  }

  const handleScrollWindows = async(e) => {
      
      if (isFetching) return;
      // alert(JSON.stringify(arrImageCamera))
      let scrollHeight = e.target.scrollHeight;
      let scrollTop = e.target.scrollTop;
      let offsetHeight = e.target.offsetHeight;

      // *** patokan
      let threshold = scrollHeight - offsetHeight - 150;
      
      if (scrollTop >= threshold) {
        
        // console.log('scroll height : ',e.target.scrollHeight)
        // console.log('scroll top : ', e.target.scrollTop)
        // console.log('patokan : ', e.target.scrollHeight - e.target.offsetHeight - 300)
        // console.log('Client top : ', e.target.clientHeight)

        setIsFetching(true);

        // alert(selectedPlace) // tidak terdeteksi perubahan state dalam scroll
        setTimeout(async()=>{
          // get Data Image By Place
          
          let place_id = selectedPlace?.[0]?.id;

          if (place_id != null) {
              await generateArrImageCameraFunc_InComp(startDate, endDate, place_id);
              
              setIsFetching(false);
          }
        }, 300)

      }

  }

  useEffect(()=>{
    // ** PIIS Testing Scroll
    selectedPlaceRef.current = selectedPlace;
    startDateRef.current = startDate;
    endDateRef.current = endDate;
    // arrImageCameraGalLengthRef.current = arrImageCameraGal.length ?? 0;
    
    // console.log("arrImageCameraGal.length : " + arrImageCameraGal.length);

  }, [selectedPlace, startDate, endDate
    // , arrImageCameraGal
  ])

  // mengatur scrolling
  useEffect(()=>{
    
      // *** parameter 'true' untuk capturing (baca listener dari element paling luar ke dalam)
      // *** jika pakai closure / arrow function langsung disebut sebagai bubbling (baca element dari dalam ke luar)
      // window.addEventListener('scroll', handleScrollWindows, true);


      // **** CARA 1
      // const handleScroll = async(e:any) => {
      //   if (isFetching) return;
      //   let scrollHeight = e.target.scrollHeight;
      //   let scrollTop = e.target.scrollTop;
      //   let offsetHeight = e.target.offsetHeight;
  
      //   // *** patokan
      //   let threshold = scrollHeight - offsetHeight - 100;
        
      //   if (scrollTop >= threshold) {
          
      //     // console.log('scroll height : ',e.target.scrollHeight)
      //     console.log('scroll top : ', e.target.scrollTop)
      //     console.log('patokan : ', e.target.scrollHeight - e.target.offsetHeight - 300)
      //     // console.log('Client top : ', e.target.clientHeight)
  
      //     setIsFetching(true);
  
      //     setTimeout(async()=>{
      //         // get Data Image By Place
  
      //       let place_id = selectedPlace?.[0]?.id;
      //       if (place_id != null) {
      //           await generateArrImageCameraFunc_InComp(startDate, endDate, place_id);
                
      //           setIsFetching(false);
      //       }
      //     }, 300)
  
      //   }
      // }

      // **** CARA 2
      // let isFetchingLocal = false;
      isFetchingRef.current = false;

      const handleScrollWindows_Second = async(e:any) => {


        // const windowInnerHeight = window.innerHeight;
        // const documentScrollTop = document.documentElement.scrollTop;
        // const documentOffsetHeight = document.documentElement.offsetHeight;

        const scrollTop = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const offsetHeight = e.target.offsetHeight;

        // let threshold = scrollHeight - offsetHeight - 150;
        let threshold = scrollHeight - offsetHeight - 100;

        console.log("Scroll Top : " + e.target.scrollTop);

        // if (scrollTop >= threshold && !isFetchingLocal) {
        if (scrollTop >= threshold && !isFetchingRef.current) {

          setDisabledCari(true);

          // isFetchingLocal = true;
          isFetchingRef.current = true;
          
          let place_id = selectedPlaceRef.current?.[0]?.id;
          let start_date = startDateRef.current;
          let end_date = endDateRef.current;
          let arrImageCameraGal_length = arrImageCameraGalLengthRef.current ?? 0;
          
          let newData:any = [];

          if (place_id != null) {

              newData = await generateArrImageCameraFunc_ScrollWindow(start_date, end_date, place_id, arrImageCameraGal_length);

              // alert("arrImageCameraGal_length : " + arrImageCameraGal_length)

              if (newData.length > 0) {

                arrImageCameraGalRef.current = arrImageCameraGalRef.current.concat([...newData]);
                arrImageCameraGalLengthRef.current = arrImageCameraGalRef.current.length;

                setArrImageCameraGal(prevData => {
                  // console.log("Panjang arrImageCameraGal : " + prevData.length);
                  // console.log("Panjang arrImageCameraGal (Ref) : " + arrImageCameraGalLengthRef.current);
                  // arrImageCameraGalLengthRef.current = (prevData.length + newData.length) ?? 0;

                  return [...prevData, ...newData]});

                setDatas(prevData => [...prevData, ...newData]);

                
                setTimeout(()=>{
                  // console.log("isFetchingLocal : " + isFetchingLocal);
                  // console.log("scrollTop : " + scrollTop);
                  // console.log("scrollHeight : " + scrollHeight);
                  // console.log("offsetHeight : " + offsetHeight);
                  // console.log("newData");  
                  // console.log(newData);  
                  // console.log("----- newData");  
                  
                  // isFetchingLocal = false;
                  isFetchingRef.current = false;
                  
                  setDisabledCari(false);
                  
              
                   // setelah 5 detik, maka semua loading akan di-false
                  setTimeout(()=>{
                    // isFetchingLocal = false;
                    // isFetchingRef.current = false;
                    
                    setArrImageCameraGal(prevImages=>{
                      let prev = [...prevImages];
                      let result_uptofalse = prev.map((obj,idx)=>{
                        return {
                          ...obj,
                          isLoading:false
                        }
                      })
                      return result_uptofalse;
                    });

                    arrImageCameraGalRef.current = arrImageCameraGalRef.current.map((obj, idx)=>{
                        return {
                          ...obj,
                          isLoading: false
                        }
                    });

                  },10000) // 5 detik

                  e.target.scrollTo({
                    top: e.target.scrollTop - 50,
                    behaviour:'smooth'
                  });
                  
                }, 1000)
              }
              else {
                isFetchingRef.current = false;
                setDisabledCari(false);
              }

          }
          else {
            // isFetchingLocal = false;
            isFetchingRef.current = false;
          }

        }
        
      }

      // window.addEventListener('scroll', handleScrollWindows, true);
      // window.addEventListener('scroll', handleScrollWindows_Second, true);
      window.addEventListener('scroll', handleScrollWindows_Second, true);

      return ()=>{
        window.removeEventListener('scroll', handleScrollWindows_Second, true);
      };
  },[])

  useEffect(()=>{
    
      setArrImageCameraGal([...arrImageCamera]);
    
  },[arrImageCamera])

  useEffect(()=>{
    
    const fetchData = async() => {

        // setDisabledTab(true); // disabled tab pada saat loading
        setShowLoaderMain(true);

        // ** Sample Data
        // const sample_data = await getDataCameraApi() || [];
        
        const data_sites = await getDataSitesApi() || [];

        setSites(data_sites.length > 0 ? [...data_sites] : []);

        // ...
        setInputRefs(prevRefs=>{
            const newRefs:any = Array.from({length:data_sites.length},(_,i)=> prevRefs[i] || React.createRef());

            return newRefs;
        })
      

        setTimeout(()=>{

          // setDatas([...sample_data]);
          setShowLoaderMain(false);
  
          // setTimeout(()=>{
          //   setDisabledTab(false);
          // },1000)
  
        },1000)


        setTimeout(()=>{
          // dispatch icon title
          storeMenu.dispatch({type:'titleicon', text: 'Events'});
  
          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Dashboard', value:'Dashboard'}, {key:'Monitoring', value:'Monitoring'}, {key:'Events', value:'Events'}]});
          
        },100)
    }

    fetchData();
  },[])

  
  const generateArrImageCameraFunc = async(tanggal_start:Date|null, tanggal_end:Date|null, place_id:any ) => {

    if (tanggal_start != null && tanggal_end != null && place_id != null)
    {
            // *** nanti tambahkan id camera jika API sudah ready (parameter results)
            let start_month, end_month, periode;  // periode -> "2024-06"

            start_month = format(tanggal_start, "yyyy-MM-dd", {locale:idLocale});
            end_month = format(tanggal_end, "yyyy-MM-dd", {locale: idLocale});

            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cctvresults/places/?skip=0&limit=100&place_id=${place_id}&start_month=${start_month}&end_month=${end_month}`
                  , null
                  , 'application/json'
                  , 'GET'
                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
            
            let statusCodeError = resultdata?.['statusCode']; // error dari internal
            let responseDetail = resultdata?.['detail'] // error dari api

            let arrImageCamera_temp = [...arrImageCamera];

            if (typeof statusCodeError != 'undefined'){
                arrImageCamera_temp = [];
                
                notify('error', "'API Images' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
                return []
            }
            else if (typeof responseDetail != 'undefined'){
                arrImageCamera_temp = [];

                notify('error', "'API Images' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
                return []
            }
            else {

                // jika data ada, ambil raw_data
                if (Array.isArray(resultdata) && resultdata.length > 0){

                  
                  try {
                      let raw_data_ori = [...resultdata];

                      let raw_data_modif = raw_data_ori.map((obj, idx)=>{
                            return {
                              ...obj,
                              // width: 0,
                              // height: 0,
                              isLoading: true
                            }
                      })

                      arrImageCamera_temp = [...raw_data_modif];

                      console.error("IMAGE raw_data_modif");
                      console.log(raw_data_modif);
  
                      // ... Modifikasi object
  
                      // let raw_data_result_str = resultdata?.[0]?.['raw_data'];
                      
                    }
                    catch(e:any){
                      arrImageCamera_temp = [];
               
                      notify('error', e.toString(), 'TOP_CENTER');
                    }
                }
                else {
                    arrImageCamera_temp = [];
                }
            }

            // tampil di card
            setArrImageCamera([...arrImageCamera_temp]);

            arrImageCameraGalRef.current = [...arrImageCamera_temp];
            arrImageCameraGalLengthRef.current = (arrImageCamera_temp.length) ?? 0;

            // setelah 5 detik, maka semua loading akan di-false
            setTimeout(()=>{
              setArrImageCamera(prevImages=>{
                let prev = [...prevImages];
                let result_uptofalse = prev.map((obj,idx)=>{
                  return {
                    ...obj,
                    isLoading:false
                  }
                })
                return result_uptofalse;
              })

              arrImageCameraGalRef.current = arrImageCameraGalRef.current.map((obj, idx)=>{
                  return {
                    ...obj,
                    isLoading: false
                  }
              });
            },5000) // 5 detik

            return [...arrImageCamera_temp];

    }

    return

    // jumlah gambar
    let randomJumlahImage = Math.floor(Math.random() * 30); // 0 - 9

    if (randomJumlahImage > 0){
      let arrImage:any[] = [];
      let arrImageTemp = new Array(randomJumlahImage).fill({isLoading: true});

      arrImage = arrImageTemp.map((val, idx)=>{
        let getPic = `https://picsum.photos/${Math.floor((Math.random()*401)+1000)}/${Math.floor((Math.random()*401)+1000)}`;
        // console.log(getPic)
        return {
          // isLoading: true,
          isLoading: val?.['isLoading'],
          img: `${getPic}`
          // url: `https://picsum.photos/800/${Math.floor((Math.random()*401)+400)}`
        }
      })
      alert(JSON.stringify(arrImage))
      setArrImageCamera([...arrImage]);
        
      // setelah 5 detik, maka semua loading akan di-false
      setTimeout(()=>{
        setArrImageCamera(prevImages=>{
          let prev = [...prevImages];
          let result_uptofalse = prev.map((obj,idx)=>{
            return {
              ...obj,
              isLoading:false
            }
          })
          return result_uptofalse;
        })
      },5000) // 5 detik

    } else {
      // kalau tidak ada gambar, maka show image no data
      setArrImageCamera([]);
    }
  }


  const countryBodyTemplate = (rowData) => {
      return (
          <div className="d-flex align-items-center gap-2" >
              <img alt={rowData.country.code} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
              <span>{rowData.country.name}</span>
          </div>
      );
  };

  
  const representativeBodyTemplate = (rowData) => {
      const representative = rowData.representative;

      return (
          <div className="d-flex align-items-center gap-2">
              <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
              <span className='ms-2'>{representative.name}</span>
          </div>
      );
  };


  const representativesItemTemplate = (option) => {
      return (
          <div className="d-flex align-items-center gap-2">
              <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
              <span>{option.name}</span>
          </div>
      );
  };

  // const representativeFilterTemplate = (options) => {
  //   // options.value => menghasilkan value yang ter-select "name" dan "image" dalam array
  //     return (
  //         <MultiSelect value={options.value} filter options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
  //     )
  // };

  const statusItemTemplate = (option) => {
    // option => isi data string misal 'ONLINE','OFFLINE'
        return (
            <div className='camol-icon-tag-parent'>
                <div className='camol-icon-tag-radius'
                      style={{backgroundColor: option == "ONLINE" ? "green" : "#000000"}}
                      >
                </div>
                <Tag className='custom-tag'
                    value={option.toUpperCase()} 
                    style={{backgroundColor: option == "ONLINE" ? "rgba(86,202,0,0.16)" : "#80808052",
                            color: option == "ONLINE" ? "forestgreen" : "darkslategray"
                    }}
                    // severity={getSeverity(rowData.status)} 
                />
            </div>
        )
        // return <Tag value={option} severity={getSeverity(option)}/>;
  };

  const statusFilterTemplate = (options) => {
      return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
  };

  const onGlobalFilterChange = (event) => {
      const value = event.target.value;
      let _filters = { ...filters };

      _filters['global'].value = value;

      setFilters(_filters);
  };

  const renderHeader = () => {
      const value = filters['global'] ? filters['global'].value : '';
      
      return (
          <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Global Search" />
          </IconField>
      );
  };

  const statusBodyTemplate = (rowData) => {
      let status_temp;
      if (typeof rowData?.['status'] != 'undefined' && rowData?.['status'] && typeof rowData?.['status'] == 'string'){
          status_temp = rowData?.['status'].toUpperCase();
          
          return (
              <>
                  <div className='camol-icon-tag-parent'>
                      <div className='camol-icon-tag-radius'
                            style={{backgroundColor: status_temp == "ONLINE" ? "green" : "#000000"}}
                            >
                      </div>
                      <Tag className='custom-tag'
                          value={rowData.status.toUpperCase()} 
                          style={{backgroundColor: status_temp == "ONLINE" ? "rgba(86,202,0,0.16)" : "#80808052",
                                  color: status_temp == "ONLINE" ? "forestgreen" : "darkslategray"
                          }}
                          // severity={getSeverity(rowData.status)} 
                      />
                  </div>
              </>
          );

      } else {
        return <Tag value={rowData.status.toUpperCase()} 
                    style={{backgroundColor:'grey'}} />
      }
  };

  const header = renderHeader();


  const refresh_func = async() => {

        setDisabledTab(true); // disabled tab pada saat loading
        setShowLoaderMain(true);

        let arr_camera:any[] = await getDataCamera() || [];  // Get Data Camera (Master)
        if (arr_camera.length > 0)
        {
            setDataCamera([...arr_camera]); // master camera

            // generateCameraAndTools(arr_camera, tabValue, startDate); // generate data element per camera
  
        }
        else {
            setDataCamera([]);  // master camera
        }

        setTimeout(()=>{
          setShowLoaderMain(false);
  
          setTimeout(()=>{
            setDisabledTab(false);
          },1000)
  
        },500)
  }

  const outRefreshTabPanel = () => {
      refresh_func();
  }
  

  const generateCameraAndTools = async(arr_camera?:any[], index_camera?:any, tanggal?:Date|null) => {

    // generate looping Jumlah Camera -> 'setObjCardList'
    // looping tools

    // console.error("Array Camera Parameter----------")
    // console.log(arr_camera);
    
    if (index_camera != null && !isNaN(index_camera)) // jika angka, maka masuk
    {
      
        // Master Camera jika ada yang diberikan dari parameter
        let dataCamera_single:any = null;
        if (typeof arr_camera != 'undefined' && Array.isArray(arr_camera))
        {
            if (arr_camera.length > 0)
            {
              dataCamera_single = arr_camera[index_camera];
              // {"camera_name":"Camera Test","latitude":-6.27856,"longitude":106.726,"endpoint":"rtsp://www.test.com","is_active":true,"created_at":1711432223,"created_by":1,"updated_at":1718163835,"updated_by":1,"id":3}
              // console.log(JSON.stringify(dataCamera_single));
            }
        }
        else {
            // jika tidak ada di parameter, maka ambil dari state dataCamera
            if (typeof dataCamera != 'undefined' && Array.isArray(dataCamera))
            {
                if (dataCamera.length > 0)
                {
                  dataCamera_single = dataCamera[index_camera];
                }
                else {
                  setDataCamera([]);
                }
            }
        }

        // jika dataCamera_single tidak null
        if (dataCamera_single != null)
        {
            // id camera yang nanti akan di parsing sebagai parameter untuk api results
            let camera_id = dataCamera_single?.['id'];
            let camera_name = dataCamera_single?.['camera_name'];
            let camera_endpoint = dataCamera_single?.['endpoint'];
            let camera_isactive = dataCamera_single?.['is_active'];
            let camera_latitude = dataCamera_single?.['latitude'];
            let camera_longitude = dataCamera_single?.['longitude'];

            // *** nanti tambahkan id camera jika API sudah ready (parameter results)
            let start_month, end_month, periode;  // periode -> "2024-06"

            if (tanggal != null)
            { 
              start_month = format(new Date(tanggal.getFullYear(), tanggal.getMonth(), 1), "yyyy-MM-dd", {locale:idLocale});
              end_month = format(lastDayOfMonth(tanggal), "yyyy-MM-dd", {locale: idLocale});
              periode = format(tanggal, "yyyy-MM", {locale:idLocale});
            }

            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/dashboard/vehicle-statistics?skip=0&limit=1000&id_camera=${camera_id}&start_month=${start_month}&end_month=${end_month}`
                  , null
                  , 'application/json'
                  , 'GET'
                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
            
            let statusCodeError = resultdata?.['statusCode']; // error dari internal
            let responseDetail = resultdata?.['detail'] // error dari api

            let objCardList_temp = {...objCardList};
            let objChartData_temp = {...objChartData};  // per camera untuk chart

            if (typeof statusCodeError != 'undefined'){
                objCardList_temp = {...objCardList_temp, [`${camera_id}`]:{}};
                objChartData_temp = {...objChartData_temp, [`${camera_id}`]:{}};
                
                notify('error', "'API Results' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
                return
            }
            else if (typeof responseDetail != 'undefined'){
                objCardList_temp = {...objCardList_temp, [`${camera_id}`]:{}};
                objChartData_temp = {...objChartData_temp, [`${camera_id}`]:{}};

                notify('error', "'API Results' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
                return
            }
            else {

              // jika data ada, ambil raw_data
              if (Array.isArray(resultdata) && resultdata.length > 0){
                  
                    let raw_data_ori = resultdata.filter(val=>val?.['id_camera'] == camera_id && val?.['month'] == periode)[0]; // object asli

                    // Modifikasi object
                    let raw_data_modif = {...raw_data_ori}; // hasil modifikasi (ada key yang dihapus atau diubah)
                    if (raw_data_modif?.['id_camera']){delete raw_data_modif?.['id_camera']}; // hapus id_camera
                    if (raw_data_modif?.['month']){delete raw_data_modif?.['month']}; // hapus month

                    // [['total_boots', 0], ...], kemudian di hilangkan kata awalan "total_"
                    // Final : {boots:3,...}
                    let raw_data_modif_objentri = 
                                      Object.fromEntries(
                                          Object.entries(raw_data_modif).map(([k,v],i)=>{

                                              let remove_total = k;
                                              if (k.startsWith("total_")){
                                                  remove_total = k.replace(/^total_/gi, '');
                                              }

                                              // dari ['total_hardhat',3] -> ['hardhat',3]
                                              return [remove_total, v]
                                          })
                                      );
                    
                    console.log("raw_data_modif_objentri")
                    console.log(raw_data_modif_objentri)

                    // ... Modifikasi object

                    // let raw_data_result_str = resultdata?.[0]?.['raw_data'];
                    try {
                      // convert dari string ke object
                      // let raw_data_result_obj =  JSON.parse(raw_data_result_str.replace(/'/gi,'"'));
                      let raw_data_result_obj = {...raw_data_modif_objentri};

                      // hapus object key 'img', jadi hanya tersisa tools
                      if (raw_data_result_obj?.['img']){
                        delete raw_data_result_obj?.['img'];
                      }

                      // jadikan object ke array, contoh : [["boots",0],["hardhat",1],["no-hardhat",0],...]
                      let raw_data_result_arr = Object.entries(raw_data_result_obj);

                      // proses ke objCardList

                      // buat tools obj untuk objCardData
                      let objChartData_cat:any[] = [];
                      let objChartData_data:any[] = [];

                      // buat tools_obj untuk objCardList
                      let tools_obj_temp:any = {};

                      let tools_obj_temp_arr:any[] = raw_data_result_arr.map(([k,v],i)=>{

                          // bentuk jadi Label Pascal Case with space -> Boots, No Hardhat, ...
                          let k_label = '';
                          if (typeof k == 'string')
                          {
                              k_label = k.startsWith("no_") ? k.replace(/^no_/,"No ") : k;

                              let k_label_arr = k_label.split(" "); // jadi array

                              // ['No', 'Wearpack']
                              k_label_arr = k_label_arr.map((val, idx)=>val.trim().substring(0,1).toUpperCase() + val.trim().substring(1));

                              // 'No Wearpack'
                              k_label = k_label_arr.join(" ");
                          }

                          // TUJUAN UTAMA : {boots:0, hardhat:1,...}
                          tools_obj_temp = {
                            ...tools_obj_temp,
                            [k]: {name: `${k}`, api: `${k}`, label: `${k_label}`, value: parseFloat(`${v}`)} 
                          }
                          // ....
                          
                          // return ['No Wearpack', 0]
                          return [k_label,v];
                      });


                      objCardList_temp = {
                          ...objCardList_temp,
                          [`${camera_id}`]:{
                              'label': `${camera_name}`,
                              'tools': {...tools_obj_temp},
                              'position': {lat: parseFloat(`${camera_latitude}`), lng: parseFloat(`${camera_longitude}`)},
                              'url_video': `${camera_endpoint}`
                          }
                      }

                      // ['Boots', 'Hardhat', 'No Hardhat', 'No Wearpack', 'Wearpack']
                      objChartData_cat = tools_obj_temp_arr.map(([k,v],i)=>k);
                      // [0, 1, 0, 0, 1]
                      objChartData_data = tools_obj_temp_arr.map(([k,v],i)=>v);

                      objChartData_temp = {
                          ...objChartData_temp,
                          [`${camera_id}`]:{
                              'categories': [...objChartData_cat],
                              'data': [...objChartData_data]
                          }
                      }


                      console.error("objCardList_temp");
                      console.log(objCardList_temp);

                      console.error("objCard Data");
                      console.log(objChartData_cat)
                      console.log(objChartData_data)

                      // console.error("raw_data_result_obj");
                      // console.log(raw_data_result_obj);

                      // console.error("raw_data_result_arr");
                      // console.log(raw_data_result_arr);

                    }
                    catch(e:any){
                      
                      objCardList_temp = {...objCardList_temp, [`${camera_id}`]:{
                                                  'label': `${camera_name}`,
                                                  'tools': {},
                                                  'position': {lat: -6.179390795905389, lng: 106.82778903999814},
                                                  'url_video': `${camera_endpoint}`
                                          }};
                      objChartData_temp = {...objChartData_temp, [`${camera_id}`]:{
                                                  'categories': [],
                                                  'data': []
                                          }};
                      notify('error', e.toString(), 'TOP_CENTER');
                      console.error(objChartData_temp)
                    }
                }
                else {
                  // jika "resultdata" data nya kosong

                    objCardList_temp = {...objCardList_temp, [`${camera_id}`]:{
                                        'label': `${camera_name}`,
                                        'tools': {},
                                        'position': {lat: -6.179390795905389, lng: 106.82778903999814},
                                        'url_video': `${camera_endpoint}`
                                }};
                    objChartData_temp = {...objChartData_temp, [`${camera_id}`]:{
                                        'categories': [],
                                        'data': []
                                }};
                }
            }


            // console.error("INI DIA OBJCARDLIST_TEMP....................")
            console.log(objCardList_temp);

            // tampil di card
            setObjCardList(objCardList_temp);

            // tampil di bar chart
            setObjChartData(objChartData_temp)

        }
    }

    return

  }

  // Tab Change
  const handleChangeTab = (event:React.SyntheticEvent, newValue:number) => {

    setDisabledTab(true); // disabled tab pada saat loading
    setTabValue(newValue);

    generateCameraAndTools(dataCamera ?? [], newValue, startDate); // generate data element per camera

    setShowLoaderMain(true);

    setTimeout(()=>{
      setShowLoaderMain(false);

      setTimeout(()=>{
        setDisabledTab(false);
      },1000)

    }, 500)
  }

  const handleChangePeriode = (date, posisi?:'start'|'end') => {

    // jika date tidak di input, maka disabled button 'cari'
      if (date == null) {
        setDisabledCari(true);
      }

      if (typeof posisi == 'undefined' || posisi == 'start' || posisi == null){

          setStartDate(date);

          
          // jika tanggal start date > end date, maka end date set samakan seperti start
          if (date > endDate) {
              setEndDate(date);

              // start date tidak kosong dan end date pasti terisi otomatis, maka tidak perlu compare end date
              if (date != null && selectedSite.length > 0 && selectedPlace.length > 0) {
                  setDisabledCari(false);
              }

          } else if(date <= endDate) {
              if (date != null && endDate != null && selectedSite.length > 0 && selectedPlace.length > 0) {
                  setDisabledCari(false);
              }
          }


      } else if (posisi == 'end') {

          if (date != null && startDate != null && selectedSite.length > 0 && selectedPlace.length > 0) {
              setDisabledCari(false);
          }

          setEndDate(date);
      }

      // setDisabledTab(true); // disabled tab pada saat loading
      // setShowLoaderMain(true);

      // generateCameraAndTools(dataCamera ?? [], tabValue, date); // generate data element per camera

      // setTimeout(()=>{
      //   setShowLoaderMain(false);

        // setTimeout(()=>{
        //   setDisabledTab(false);
        // },1000)

      // },500)

  }

  
  const getDataRecordings = async(place_id) => {
    
    if (place_id != null) {
      
      let start_date = format(startDate,"yyyy-MM-dd");
      let end_date = format(endDate,"yyyy-MM-dd");

      let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/logs/places/?place_id=${place_id}&skip=0&limit=1000&start_month=${start_date}&end_month=${end_date}`
                , null
                , 'application/json'
                , 'GET'
                , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

      let statusCodeError = resultdata?.['statusCode']; // error dari internal
      let responseDetail = resultdata?.['detail'] // error dari api
    
      
      if (typeof statusCodeError != 'undefined'){
          notify('error', "'API Results' " + (resultdata?.['msg'] ?? ''), 'TOP_CENTER')
          return null;
      }
      else if (typeof responseDetail != 'undefined'){
          notify('error', "'API Results' " + (resultdata?.['detail']?.[0]?.['msg'] ?? resultdata?.['detail'] ?? ''), 'TOP_CENTER')
          return null;
      } 
      else {
        if (Array.isArray(resultdata) && resultdata.length > 0){

            let temp = resultdata.map((obj,idx)=>{

                let tanggal, waktu;
                try{

                  if (new Date(obj?.['date_create'])){

                    tanggal = format(new Date(obj?.['date_create']),'dd MMMM yyyy');
                    waktu = format(new Date(obj?.['date_create']),'HH:mm:ss');
                  } else {
                    tanggal = null;
                    waktu = null;
                  }
                }catch(e){tanggal = null;}

                return {
                  ...obj,
                  tanggal,
                  waktu
                }

            })
            return [...temp];
        } else {return [];}
      }

    } else {
      return null;
    }

  }
  
  const handleCari = async() => {

      setShowLoaderMain(true);

      if (selectedSite.length > 0 && selectedPlace.length > 0
            && startDate != null && endDate != null
      ) {
        
          // setArrImageCameraGal([]);

          // get Data Camera By Place

          isFetchingRef.current = false; // agar scroll bisa jalan

          let place_id = selectedPlace?.[0]?.id;
          if (place_id != null) {
              let result = await generateArrImageCameraFunc(startDate, endDate, place_id);

              if (Array.isArray(result)) {

                setDatas([...result]);
                // setArrImageCamera([...result])
              } else  {setDatas([]); setArrImageCamera([]); setArrImageCameraGal([]);}
          } else {
            setDatas([]);
            setArrImageCamera([]);
            setArrImageCameraGal([]);
          }
          
          setTimeout(()=>{
            setStatusAwal(false);
            setStatusCari(true);  // aktifkan cari sebagai flag kalau sudah klik cari
            setShowLoaderMain(false);
          },300)
          
      } else {

          setDatas([]);
          setArrImageCamera([]);
          setArrImageCameraGal([]);

          setTimeout(()=>{
            setStatusAwal(false);
            setStatusCari(true);
            setShowLoaderMain(false);
          },300)
      }
  }


  
  const handleLoadImg = (event, idx) => {

        const naturalWidth = event?.target?.naturalWidth ?? 1500;
        const naturalHeight = event?.target?.naturalHeight ?? 1050;

        // * pakai ref untuk scrolling
        if (typeof arrImageCameraGalRef.current?.[idx] != 'undefined') {

          arrImageCameraGalRef.current[idx] = {...arrImageCameraGalRef.current[idx], 
                      naturalWidth: naturalWidth / 1.5, naturalHeight: naturalHeight / 1.5,
                      isLoading: false};
        };

        setTimeout(()=>{
          setArrImageCameraGal(prevImages=>{

              // prevImages[idx] = {...prevImages[idx], isLoading: false}
              let arrImageCam_Temp = [...prevImages];
              arrImageCam_Temp[idx] = {...arrImageCam_Temp[idx], 
                      naturalWidth: naturalWidth / 1.5, naturalHeight: naturalHeight / 1.5,
                      isLoading: false};
              // return prevImages;
              return arrImageCam_Temp;
          });

        },1)

  }


  return (
    <>
        <div className='ppe-anly'>

            {/* <ButtonPrime onClick={handleTes} /> */}
            {/* Periode Date Picker */}
            <div className='d-flex flex-column flex-sm-column flex-md-row align-items-stretch gap-2 ppe-anly-datepicker'>
              
                {/* <span className='ppe-anly-datepicker-title 
                          align-self-start align-self-sm-start align-self-md-center'>Periode :</span> */}

                <div className='d-flex justify-content-start align-items-stretch ppe-anly-datepicker-container'>

                  <DateRangeRounded className='ppe-anly-datepicker-icon'/>

                  <div className='d-flex align-items-stretch ppe-anly-datepicker-parent'>
                      <ReactDatePicker 
                            selected={startDate}
                            onChange={(date)=>handleChangePeriode(date, 'start')}
                            dateFormat={`dd MMMM yyyy`}
                            placeholderText='Start Date'
                            title='Start Date'
                            shouldCloseOnSelect={true}
                            todayButton={`Today`}
                            // locale={'id'} // indonesia (registerLocale)
                            // showMonthYearPicker 
                      />
                  </div>
                </div>
                
                <div className='d-flex align-items-center justify-content-center recordings-strip-between-date'>
                    <span>-</span>
                </div>

                <div className='d-flex justify-content-start align-items-stretch ppe-anly-datepicker-container'>

                  <DateRangeRounded className='ppe-anly-datepicker-icon'/>

                  <div className='d-flex align-items-stretch ppe-anly-datepicker-parent'>
                      <ReactDatePicker 
                            selected={endDate}
                            onChange={(date)=>handleChangePeriode(date, 'end')}
                            dateFormat={`dd MMMM yyyy`}
                            startDate={startDate}
                            minDate={startDate}
                            title='End Date'
                            placeholderText='End Date'
                            shouldCloseOnSelect={true}
                            todayButton={`Today`}
                      />
                  </div>
                </div>

                <div>
                  {/* Site / Lokasi */}
                    <MultiSelect 
                        options={sites}
                        value={selectedSite}
                        onChange={handleChangeSite}
                        optionLabel='name'
                        filter
                        showClear
                        resetFilterOnHide   // reset filter ketika sudah hide
                        className='w-100 custom-multiselect-prime'
                        showSelectAll={false}
                        maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                        placeholder='Select a Site'
                        style={{height:'35px', minWidth:'40px', maxWidth:'250px', padding: '2px 0px', lineHeight:'5px'}}
                    />
                </div>

                <div>
                  {/* Places / SPBU */}
                    <MultiSelect 
                        options={places}
                        value={selectedPlace}
                        onChange={handleChangePlace}
                        optionLabel='name'
                        filter
                        showClear
                        showSelectAll={false}
                        resetFilterOnHide   // reset filter ketika sudah hide
                        className='w-100 custom-multiselect-prime'
                        maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                        placeholder='Select a Place'
                        style={{height:'35px', minWidth:'200px', maxWidth:'250px', padding: '2px 0px', lineHeight:'5px'}}
                        disabled={disabledPlace}
                    />
                </div>
                <div>
                    <ButtonPrime label="Cari" disabled={disabledCari} onClick={handleCari} loading={false} icon='pi pi-search' iconPos='left' className='custom-prime-size-small w-100' outlined>
                    </ButtonPrime>
                </div>
            </div>

            {
              showLoaderMain &&
                    (
                      <div className='ppe-anly-ppe-loader-main'>
                          <Bars width='80' height='80' visible={showLoaderMain} color='#4fa94d'/>
                      </div>
                    )
            } 

            {
               !showLoaderMain && (
                    <>

                      {/* jika status nya bukan awal (sudah pernah klik Cari) dan data kondisi kosong */}
                      {
                        !statusAwal && (datas == null || (Array.isArray(datas) && datas.length == 0)) && (
                            <div key={`random-img-nodata`} className='col d-flex justify-content-center align-items-center'>

                                  {
                                    !showLoaderMain && (
                                          <div className='position-relative'>
                                              <img src={NoData} height = "400" width="400"/>
                                              <Box className='d-flex justify-content-center ppe-btn-refresh'>
                                                  <ButtonMui variant='outlined' color='error'
                                                        onClick={()=>{refresh_func()}}
                                                        className='d-flex align-items-end'
                                                        >
                                                    <span>Refresh</span>
                                                </ButtonMui>
                                              </Box>
                                          </div>
                                    )
                                  }

                                  
                                </div>
                        )
                      }
                      
                      {/* jika status nya awal masuk dan belum klik cari akan muncul tampilan gambar search dulu */}
                      {
                        !statusCari && statusAwal && (
                            <div className='d-flex justify-content-center align-items-center'>
                                <div className='position-relative'>
                                    <img src={MustSearch} height = "400" width="400"/>
                                    <Box className='d-flex justify-content-center ppe-btn-refresh filter-instructions-container'>

                                        {/* <ButtonMui variant='outlined' color='error'
                                              onClick={()=>{refresh_func()}}
                                              className='d-flex align-items-end'
                                              >
                                          <span>Refresh</span>
                                      </ButtonMui> */}

                                      <span className='filter-instructions mt-3'>Silahkan Filter Terlebih Dahulu !</span>
                                    </Box>
                                </div>
                            </div>
                        )
                      }


                      {
                          // jika sudah click cari dan data nya ada
                        statusCari && (

                            datas != null && (Array.isArray(datas) && datas.length != 0) && (
                              
                              // ** PIIS Testing Scroll Window
                              // *** scrolling use react-intersection-observable
                              <div className="live-container mt-4 p-2" 
                                    // onScroll={handleScrollWindows}
                                >

                                  <div className='row px-1 w-100'>
                                      <Gallery withCaption withDownloadButton options={photoSwpOpt}>
                                          {
                                            // new Array(Math.floor((Math.random()*10)  1)).fill(null).map((obj,idx)=>{

                                              // arrImageCameraGal.length > 0 &&
                                              //     arrImageCameraGal.map((objimg,idx)=>(

                                              arrImageCameraGalRef.current.length > 0 &&
                                                  arrImageCameraGalRef.current.map((objimg,idx)=>(


                                                  // return (

                                                      <div key={`random-img-${idx}`} className='col-md-3 col-lg-3 mt-0 py-1 px-1'
                                                          style={{height:'300px'}}
                                                          >

                                                          <div className='info-image events-ppe-random-img-container'>

                                                              {
                                                                // arrImageCameraGal?.[idx]?.['isLoading'] && 
                                                                  objimg?.['isLoading'] &&
                                                                  (
                                                                    <div className='d-flex justify-content-center align-items-center' style={{height:'100%'}}>
                                                                        <RotatingLines visible={true}
                                                                              width="96"
                                                                              strokeColor='darkcyan'
                                                                              animationDuration='0.75'
                                                                        />
                                                                    </div>
                                                                  )
                                                              }

                                                                {/* BANNER TOP */}
                                                                
                                                                  <div style={{
                                                                              height:'100%', 
                                                                              display: objimg?.['isLoading'] ? 'none':'block' 
                                                                              }}>

                                                                        <Item 
                                                                              key={`random-item-img-${idx}`} 
                                                                              original={`${objimg?.['img']}`}
                                                                              thumbnail={`${objimg?.['img']}`}
                                                                              width={`${objimg?.[ 'naturalWidth'] ?? 1000}`}
                                                                              height={`${objimg?.['naturalHeight'] ?? 700}`}
                                                                              // width={`600`}
                                                                              // height={`690`}
                                                                              // width={`1000`}
                                                                              // height={`700`}
                                                                        >
                                                                            {({ref, open})=>(
                                                                              <>
                                                                                <img ref={ref} 
                                                                                      onClick={open} 
                                                                                      onLoad={(event)=>{handleLoadImg(event, idx)}}
                                                                                      onError={()=>{}}
                                                                                      src={`${objimg?.['img']}`} width={'100%'} height={'100%'} />
                                                                              </>
                                                                            )}
                                                                        </Item>


                                                                        {/* <img src={`${objimg?.['url']}`} onLoad={()=>handleLoadImg(idx)} width={'100%'} height={'100%'} /> */}

                                                                  </div>

                                                          </div>
                                                      </div>
                                                  // )
                                                  ))
                                          }

                                      </Gallery>
                                  </div>

                                  {/* ** react-intersection-observable */}
                                  {/* <div ref={ref} style={{height:'5px', backgroundColor:'red',
                                      position:'relative', width:'100%', top:'0'
                                  }}>
                                  </div> */}


                              </div>
                            )

                        )

                      }

                    </>
               )
            }

        </div>
        
        <ToastContainer 
          draggable
          pauseOnHover
        />
    </>
  )
}

export default Events