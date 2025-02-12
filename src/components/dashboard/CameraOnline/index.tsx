import React, { useEffect, useRef, useState } from 'react'
import styles from './CameraOnline.module.scss';  // lokal efek
import './CameraOnlineGlobal.scss'; // global efek (khusus selectbutton primereact)
import storeMenu from '../../../stores';
import { Card } from 'react-bootstrap';
import { Button as ButtonMui } from '@mui/material'
import { Box, Tab, Tabs } from '@mui/material';
import { Grid, MagnifyingGlass, Bars, RotatingLines } from 'react-loader-spinner';
import NumberAnimate from '../../atoms/numberAnimate';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import MapComponent from '../../maps';
import { ArrowBackIosNew, ConstructionOutlined, DateRange, DateRangeOutlined, DateRangeRounded } from '@mui/icons-material';
import { NoData, OnlineWorld } from '../../../assets';
import { Gallery, Item } from 'react-photoswipe-gallery';

import 'photoswipe/dist/photoswipe.css';
import { PhotoSwipeOptions } from 'photoswipe';

import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker, { registerLocale } from 'react-datepicker';
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

// import PrimeReact from 'primereact/api';

// PrimeReact.ripple = true;    // atur secara manual ripple PrimeReact

registerLocale('id',idLocale);

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


const DashboardCameraOnline = () => {

  // Multi Select
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

  const [selectedSite, setSelectedSite] = useState<any>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>([]);
  const [disabledPlace, setDisabledPlace] = useState(true);
  const [disabledCari, setDisabledCari] = useState(true);
  const [statusCari, setStatusCari] = useState(false);


  const handleChangeSite = async(e) => {
    // e.value => {name:..., city:...}
    setSelectedPlace([]);

    if (e.value.length >= 1){
      let objSelected:any = {...e.value[e.value.length-1]};
      setSelectedSite([objSelected]);
      
      let data_places:any = await getDataPlacesApi(objSelected?.['id'] ?? null);

      setPlaces(data_places ? [...data_places] : []);

      if (e.value.length > 0 && places.length > 0) {
        setDisabledCari(false);
      }

      setDisabledPlace(false);

    } else {
      setSelectedSite([]);

      setPlaces([]);
      setDisabledCari(true);

      setDisabledPlace(true);
    }
  }

  // ...

  // Prime React Data Table
  const [datas, setDatas] = useState<any>([]);
  const [selectedDatas, setSelectedDatas] = useState<any>(null);

  // Multi Select
  const [sites, setSites] = useState<any>([]);
  const [places, setPlaces] = useState<any>([]);
  

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS},
    status: { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.EQUALS}]},
    name:   { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.STARTS_WITH}]},
    uptime: { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.STARTS_WITH}]},
    version: { operator: FilterOperator.AND, constraints:[{  matchMode: FilterMatchMode.STARTS_WITH}]},

    // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    // representative: { value: null, matchMode: FilterMatchMode.IN },
    // status:         { operator:FilterOperator.OR, constraints:[{value: null, matchMode: FilterMatchMode.EQUALS}] },
    // status:         { value: null, matchMode: FilterMatchMode.EQUALS },
  })
  // ... 

  // const representatives = [
  //     { name: 'Amy Elsner', image: 'amyelsner.png' },
  //     { name: 'Anna Fali', image: 'annafali.png' },
  //     { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  //     { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
  //     { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
  //     { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
  //     { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
  //     { name: 'Onyama Limba', image: 'onyamalimba.png' },
  //     { name: 'Stephen Shaw', image: 'stephenshaw.png' },
  //     { name: 'XuXue Feng', image: 'xuxuefeng.png' }
  // ];

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

  // untuk prime data table 
  const [sortField, setSortField] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<any>(null);


  // Set Date Periode
  const [startDate, setStartDate] = useState<Date | null>(new Date());

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
        {
          id: 2,
          status: 'Offline',
          name: 'street2',
          uptime: 'up 5 days',
          version: '3.0.0'
        },
        {
          id: 3,
          status: 'Offline',
          name: 'street3',
          uptime: 'up 19 days',
          version: '3.2.0'
        },
        {
          id: 4,
          status: 'Offline',
          name: 'street4',
          uptime: 'up 19 days',
          version: '3.2.0'
        },
        {
          id: 5,
          status: 'Online',
          name: 'street5',
          uptime: 'up 19 days',
          version: '3.2.0'
        },
        {
          id: 6,
          status: 'Offline',
          name: 'street6',
          uptime: 'up 20 days',
          version: '4.2.0'
        },
        {
          id: 7,
          status: 'Online',
          name: 'street7',
          uptime: 'up 30 days',
          version: '5.2.0'
        },
        {
          id: 8,
          status: 'Online',
          name: 'street7',
          uptime: 'up 30 days',
          version: '5.2.0'
        },
        {
          id: 9,
          status: 'Online',
          name: 'street7',
          uptime: 'up 30 days',
          version: '5.2.0'
        },
        {
          id: 10,
          status: 'Online',
          name: 'street7',
          uptime: 'up 30 days',
          version: '5.2.0'
        },
        {
          id: 11,
          status: 'Online',
          name: 'street7',
          uptime: 'up 30 days',
          version: '5.2.0'
        },
      ];

      return data;
      

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

  }

  useEffect(()=>{
    
    const fetchData = async() => {

        // setDisabledTab(true); // disabled tab pada saat loading
        setShowLoaderMain(true);

        // (PAKAI) get data camera Online (SAMPLE)
        const data = await getDataCameraApi() || [];
        // ...

        const data_sites = await getDataSitesApi() || [];

        setSites(data_sites.length > 0 ? [...data_sites] : []);

        setDatas([...data]);

        setTimeout(()=>{

          setShowLoaderMain(false);
  
          // setTimeout(()=>{
          //   setDisabledTab(false);
          // },1000)
  
        },1000)


        setTimeout(()=>{
          // dispatch icon title
          storeMenu.dispatch({type:'titleicon', text: 'Camera Online'});
  
          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Dashboard', value:'Dashboard'}, {key:'Monitoring', value:'Monitoring'}, {key:'Camera Online', value:'Camera Online'}]});
          
        },100)
    }

    fetchData();
  },[])

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
        return <Tag value={rowData?.['status'] && rowData?.['status'].toUpperCase()} 
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

            generateCameraAndTools(arr_camera, tabValue, startDate); // generate data element per camera
  
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

  const handleChangePeriode = (date) => {

      setStartDate(date);

      setDisabledTab(true); // disabled tab pada saat loading
      setShowLoaderMain(true);

      generateCameraAndTools(dataCamera ?? [], tabValue, date); // generate data element per camera

      setTimeout(()=>{
        setShowLoaderMain(false);

        setTimeout(()=>{
          setDisabledTab(false);
        },1000)

      },500)

  }

  
  const getDataCameraByPlace = async(place_id) => {
    if (place_id != null) {

      let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cameras/places/?place_id=${place_id}`
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
            return resultdata;
        } else {return [];}
      }

    } else {
      return null;
    }

  }

  
  const handleCari = async() => {

      setShowLoaderMain(true);

      if (selectedSite.length > 0 && selectedPlace.length > 0) {
        
        // get Data Camera By Place
        let place_id = selectedPlace?.[0]?.id;
        if (place_id != null) {
            let result = await getDataCameraByPlace(place_id);

            if (Array.isArray(result)) {
              // ** sementara disable tunggu api
              // setDatas([...result]);
            } else  {setDatas([]);}
        } else {
          setDatas([]);
        }

        setTimeout(()=>{
          setShowLoaderMain(false);
          setStatusCari(true);  // aktifkan cari sebagai flag kalau sudah klik cari
        },300)

      } else {
        setDatas([]);
        
        setTimeout(()=>{
          setStatusCari(true);
          setShowLoaderMain(false);
        },300)
      }
  }

const handleChangePlace = async(e) => {

  setSelectedPlace(e.value);

  // jika sudah terisi site dan places, maka baru akan aktif tombol cari
  if (e.value.length >= 1 && sites.length >= 1) {
    setDisabledCari(false);
  } else {
    setDisabledCari(true);
  }
}


  return (
    <>
        <div className={`${styles['ppe-anly']}`}>

            {/* <ReactPlayer 
              url={`http://localhost:8089/live/streamsss.m3u8`}
              muted={true}
              controls={true}
              playing={true}
              width={300}
              height={300}
            /> */}

            {/* <video 
              src={`http://localhost:8089/live/streamsss.m3u8`}
              // src={`https://www.youtube.com/watch?v=LXb3EKWsInQ`}
              style={{display:'block'}}
              controls={true}
              width={500}
              height={500}
            /> */}

            {/* Periode Date Picker */}
            <div className={`d-flex flex-column flex-sm-column flex-md-row align-items-stretch gap-2 ${styles['ppe-anly-datepicker']}`}>
              
                {/* <span className='ppe-anly-datepicker-title 
                          align-self-start align-self-sm-start align-self-md-center'>Periode :</span>

                <div className='d-flex align-items-stretch ppe-anly-datepicker-container'>

                  <DateRangeRounded className='ppe-anly-datepicker-icon'/>

                  <div className='d-flex align-items-stretch ppe-anly-datepicker-parent'>
                      <ReactDatePicker 
                            selected={startDate}
                            onChange={(date)=>handleChangePeriode(date)}
                            dateFormat={`MMMM yyyy`}
                            shouldCloseOnSelect={true}
                            showMonthYearPicker 
                      />
                  </div>
                </div> */}

                <div>
                  {/* Site */}
                    <MultiSelect 
                        options={sites}
                        value={selectedSite}
                        onChange={handleChangeSite}
                        optionLabel='name'
                        filter
                        showClear
                        resetFilterOnHide   // reset filter ketika sudah hide
                        className={`w-100 custom-multiselect-prime`}
                        showSelectAll={false}
                        maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                        placeholder='Select a Site'
                        style={{height:'35px', minWidth:'190px', maxWidth:'250px', padding: '2px 0px', lineHeight:'5px'}}
                    />
                </div>

                <div>
                  {/* SPBU */}
                    <MultiSelect 
                        options={places}
                        value={selectedPlace}
                        onChange={handleChangePlace}
                        optionLabel='name'
                        filter
                        showClear
                        showSelectAll={true}
                        resetFilterOnHide   // reset filter ketika sudah hide
                        className={`w-100 custom-multiselect-prime`}
                        maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                        placeholder='Select Places'
                        style={{height:'35px', minWidth:'200px', maxWidth:'250px', padding: '2px 0px', lineHeight:'5px'}}
                    />
                </div>
                <div>
                    <ButtonPrime label="Cari" disabled={disabledCari} onClick={handleCari} loading={false} icon='pi pi-search' iconPos='left' className={`custom-prime-size-small w-100`} outlined></ButtonPrime>
                </div>
            </div>

            {
              datas == null || (Array.isArray(datas) && datas.length == 0) && (
                  <div key={`random-img-nodata`} className={`col d-flex justify-content-center align-items-center`}>

                    {
                      !showLoaderMain && (
                            <div className='position-relative'>
                                {/* <div className='ppe-nodata-dashanly'>{`Gallery`} </div> */}
                                <img src={NoData} height = "400" width="400"/>
                                <Box className={`d-flex justify-content-center ${styles['ppe-btn-refresh']}`}>
                                    <ButtonMui variant='outlined' color='error'
                                          onClick={()=>{refresh_func()}}
                                          className='d-flex align-items-end'
                                          // disabled={loadMoreProgShow}
                                          >
                                      <span>Refresh</span>
                                  </ButtonMui>
                                </Box>
                            </div>
                      )
                    }

                    {
                      showLoaderMain &&
                          (
                            <div className={`${styles['ppe-anly-ppe-loader-main']}`}>
                                <Bars width='80' height='80' visible={showLoaderMain} color='#4fa94d'/>
                            </div>
                          )
                    }
                  </div>
              )
            }

            {
               datas != null && (Array.isArray(datas) && datas.length > 0) && (
                    <>
                        <div className='d-flex flex-column flex-sm-column flex-md-row justify-content-start align-items-center' style={{position:'relative', cursor:'default'}}>
                            <img src={OnlineWorld} width="250" height="250" />
                            <div className='d-flex align-self-stretch'
                                  style={{position:'relative', height:'100%'}}>

                                <div className={`d-flex flex-column align-items-center align-items-md-start w-100 ${styles['camol-title-container']}`}>
                                    <h3 className={`${styles['camol-title']}`}>Connect Cameras</h3>
                                    <div style={{marginBottom:'20px'}} />
                                    <h6 className={`${styles['camol-subtitle']}`}>A list of all your connected cameras</h6>
                                </div>

                            </div>
                        </div>

                    
                        <div className='mt-3 mb-3'>
                            <div className='d-flex justify-content-end'>
                                <SelectButton className={`camol-custom-selectbutton-group`} value={valSelectListGrid} onChange={(e)=>handleChangeSelectListGrid(e)} optionLabel="value" options={listGridOptions} itemTemplate={justifyTemplate} />
                                {/* <SelectButton className={`camol-custom-selectbutton-group`} value={valSelectListGrid} onChange={(e)=>handleChangeSelectListGrid(e)} optionLabel="value" options={listGridOptions} itemTemplate={justifyTemplate} /> */}
                            </div>
                        </div>

                          { 
                            valSelectListGrid == "List" && (
                                <div className={`card mt-1 camol-prime-table`}>

                                      <>
                                        <DataTable dataKey="id" // dataKey sebagai pembeda kode unik wajib ada
                                                  value={datas} paginator rows={10} 
                                                  header={header} 
                                                  
                                                  filters={filters} 
                                                  onFilter={(e) => setFilters(e.filters)}

                                                  sortMode='single'
                                                  sortField={sortField}
                                                  sortOrder={sortOrder}
                                                  onSort={(e)=>{
                                                        let newSortOrder:any = null;
                                                        if (sortField == e.sortField){  // periksa sebelumnya
                                                          if (sortOrder == 1){
                                                              newSortOrder = -1;    // descending
                                                          }
                                                          else if (sortOrder == -1) {
                                                              newSortOrder = null;  // reset sorting
                                                          } else {
                                                              newSortOrder = 1;  // ascending
                                                          }
                                                        } else {
                                                            newSortOrder = 1; // ascending
                                                        }
                                                        
                                                        setSortField(newSortOrder == null ? null : e.sortField);  // harus reset null jika normal, supaya hilang warna background-nya
                                                        setSortOrder(newSortOrder);
                                                  }}
            
                                                resizableColumns
                                                columnResizeMode='expand'
                                                emptyMessage="No Cameras Found." 
                                                loading={false}
                                                stripedRows
                                                // className={`${styles['camol-prime-table']}`}
                                                className={`camol-prime-table`}
                                                // rowClassName={rowClassName} 
                                                selection={selectedDatas} onSelectionChange={(e) => setSelectedDatas(e.value)} selectionMode="single"
                                                stateStorage="custom" // custom -> supaya di reset ke semula setting-an table pada saat render ulang
                                                stateKey="dt-state-demo-local" 
                                                tableStyle={{ minWidth: '50rem' }}>
                                                  
                                            {/* <Column selectionMode='multiple' headerStyle={{width:'3rem'}} /> */}
            
                                            <Column field="status" header="Status" body={statusBodyTemplate} filterElement={statusFilterTemplate} sortable filter filterField='status' sortField='status' filterPlaceholder="Search" style={{ width: '25%' }}></Column>
            
                                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search" style={{ width: '25%' }}></Column>
            
                                            <Column field="uptime" header="Uptime" sortable filter filterField='uptime' filterPlaceholder="Search" style={{ width: '25%' }}></Column>
            
                                            <Column field="version" header="Version" sortable filter filterField='version' filterPlaceholder="Search" style={{ width: '25%' }}></Column>
            
                                        </DataTable>
            
                                            {/* <Column header="Country" body={countryBodyTemplate} sortable sortField="country.name" filter filterField="country.name" filterPlaceholder="Search" style={{ width: '25%' }}></Column> */}
                                            
                                            {/* <Column header="Agent" body={representativeBodyTemplate} sortable sortField="representative.name" filter filterField="representative"
                                                    showFilterMatchModes={false} filterElement={representativeFilterTemplate} filterMenuStyle={{ width: '14rem' }} style={{ width: '25%' }} ></Column> */}
            
                                            {/* <Column field="status" showFilterMatchModes={true} header="Status" body={statusBodyTemplate} sortable filter filterElement={statusFilterTemplate} filterMenuStyle={{ width: '14rem' }} style={{ width: '25%' }}></Column> */}
                                      </>
                                </div>
                            )
                          }

                          {
                            valSelectListGrid == "Grid" && (
                              <div className={`row gap-3 d-flex flex-row flex-wrap justify-content-around mb-5`}>
                                  {
                                    datas.map((obj, idx)=>(
                                        
                                          <div key={`camol-card-grid-key-${idx}`} className={`card ${styles['camol-card-grid-container']}`} 
                                                      style={{overflow:'auto', animationDelay:`${Math.random()*0.5}s`}}>

                                              <div className='card-body'>
                                                  <span className={`${styles['camol-card-icon-container']} 
                                                                  ${styles[`camol-card-icon-color-${idx % 4}`]}
                                                                  d-flex justify-content-center align-items-center
                                                                  mb-4
                                                              `}>
                                                      <i className='pi pi-video' />
                                                  </span>

                                                  <h6 className={`${styles['camol-card-name']}`}>{`${obj?.['name']}`}</h6>

                                                  <div className='d-flex justify-content-between align-items-center'>

                                                      {/* Ket 1 */}
                                                      <h3 className={`${styles['camol-card-ket1']}`}>{obj?.['uptime']}</h3>
                                                      
                                                      {/* <span>+0.38%</span> */}

                                                    {/* Tag Online / Offline */}
                                                      <div className={`camol-icon-tag-parent`}>
                                                            <div className={`camol-icon-tag-radius`}
                                                                  style={{backgroundColor: obj?.['status'].toUpperCase() == "ONLINE" ? "green" : "#000000"}}>
                                                            </div>
                                                            <Tag className={`custom-tag`}
                                                                value={obj?.['status'].toUpperCase()} 
                                                                style={{backgroundColor: obj?.['status'].toUpperCase() == "ONLINE" ? "rgba(86,202,0,0.16)" : "#80808052",
                                                                        color: obj?.['status'].toUpperCase() == "ONLINE" ? "forestgreen" : "darkslategray"
                                                                }}
                                                                // severity={getSeverity(rowData.status)} 
                                                            />
                                                      </div>

                                                  </div>
                                              </div>
                                          </div>
                                    ))
                                  }

                              </div>
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

export default DashboardCameraOnline