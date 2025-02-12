import React, { useEffect, useRef, useState } from 'react'
import './AnalitikAll.scss'
import storeMenu from '../../../stores'
import { Card } from 'react-bootstrap';
import { Button as ButtonMui } from '@mui/material'
import { Box, Tab, Tabs } from '@mui/material';
import { Grid, MagnifyingGlass, Bars, RotatingLines } from 'react-loader-spinner';
import NumberAnimate from '../../atoms/numberAnimate';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import MapComponent from '../../maps';
import { ArrowBackIosNew, ConstructionOutlined, DateRange, DateRangeOutlined, DateRangeRounded } from '@mui/icons-material';
import { NoData } from '../../../assets';
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

import {MultiSelect} from 'primereact/multiselect';
import {Button as ButtonPrime} from 'primereact/button';
// import PrimeReact from 'primereact/api';

// PrimeReact.ripple = true;    // atur secara manual ripple PrimeReact

interface CustomTabPanelProps {
  children?:React.ReactNode,
  index?:number,
  value:number,
  [key:string]:any
}

  // Element Content Tab
  const CustomTabPanel:React.FC<CustomTabPanelProps> = ({children, index, value, outRefresh, ...props}) => {
      
    // objCameraAndTools -> berasal dari 'objCardList'
    // objChartData -> {categories:['helmet','wearpack','glasses'], data:[1,2,3]}
    // arrImageCamera -> {isLoading: true, url: `https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`}
      const { objCameraAndTools, objChartData, arrImageCamera, idCamera, tanggal } = props;

      const [arrImageCameraGal, setArrImageCameraGal] = useState<any[]>([]);
      // barChartConf -> Bar Chart -> {series:[{name:'xxx', data:[...]}], options:{...}]}
      const [barChartConf, setBarChartConf] = useState({});

      // Setting Drag Scroll pada card container
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [scrollLeft, setScrollLeft] = useState(0);
        const containerRefCard:any = useRef<any>(null);
      // ... {end setting}

      const [isFetching,  setIsFetching] = useState(false); // State untuk menandakan proses sedang berlangsung
      let refGalleryContainer:any = useRef(null);
      let [heightGalContainer, setheightGalContainer] = useState(300);

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

      useEffect(()=>{
          setArrImageCameraGal([...arrImageCamera]);
      },[arrImageCamera])

      useEffect(()=>{

          let barChartConf_series_temp:ApexAxisChartSeries = [];
          barChartConf_series_temp = [{
                  'name': 'Analitik',
                  'data': objChartData?.['data'] ?? []
          }]

          let barChartConf_options_temp:ApexOptions = {};
          barChartConf_options_temp = {
                    chart:{
                        height: 350,
                        type: 'bar'
                    },
                    plotOptions:{
                      bar:{
                        borderRadius: 10,
                        columnWidth: '50%'
                      }
                    },
                    dataLabels:{
                      enabled: true
                    },
                    stroke:{
                      width:0
                    },
                    grid:{
                      row:{
                        colors:['#fff', '#f2f2f2']
                      }
                    },
                    xaxis:{
                      labels:{
                        rotate: -45
                      },
                      categories: [...objChartData?.['categories'] ?? []],
                      tickPlacement:'off'
                    },
                    yaxis:{
                      title:{
                        text:''
                      }
                    },
                    fill:{
                      type:'gradient',
                      gradient:{
                          shade:'light',
                          type:'horizontal',
                          shadeIntensity:0.25,
                          gradientToColors: undefined,
                          inverseColors: true,
                          opacityFrom: 0.85,
                          opacityTo: 0.85,
                          stops: [50, 0, 100]
                      }
                    }
            }
          
          let barChartConf_merge_temp = {
              series: [...barChartConf_series_temp],
              options: {...barChartConf_options_temp}
          }
          setBarChartConf({...barChartConf_merge_temp});


          console.log("barChartConf_merge_temp")
          console.log(barChartConf_merge_temp)

      },[objChartData])


      const handleMouseDownCardContainer = (e) => {
          // e.pageX = e.clientX -> posisi cursor
            if (containerRefCard.current)
            {
              setIsDragging(true);
              let width_ContainerFromStart_To_Cursor = e.pageX - containerRefCard.current.offsetLeft;
              setStartX(width_ContainerFromStart_To_Cursor);
      
              setScrollLeft(containerRefCard.current.scrollLeft);
            }
      }
  
      const handleMouseUpCardContainer = (e) => {
          setIsDragging(false);
      }
  
      const handleMouseMoveCardContainer = (e) => {
          if (!isDragging) return;
    
          if (containerRefCard.current)
          {
            // hanya terhitung jika di drag
            let width_ContainerFromStart_To_Cursor_New = e.pageX - containerRefCard.current.offsetLeft;
      
            let selisih_Width_X = width_ContainerFromStart_To_Cursor_New - startX;
            let step_X = selisih_Width_X * 1.5;
      
            containerRefCard.current.scrollLeft = scrollLeft - step_X;
          }
      }

      const generateArrImageCameraFunc_InComp = async(id_camera?:any, tanggal?:Date|null) => {

          if (id_camera != null && !isNaN(id_camera)) // jika angka, maka masuk
          {
              
                  // id camera yang nanti akan di parsing sebagai parameter untuk api results
                  let camera_id = id_camera;
                  
                  // *** nanti tambahkan id camera jika API sudah ready (parameter results)
                  let start_month, end_month, periode;  // periode -> "2024-06"
      
                  if (tanggal != null)
                  { 
                    start_month = format(new Date(tanggal.getFullYear(), tanggal.getMonth(), 1), "yyyy-MM-dd", {locale:idLocale});
                    end_month = format(lastDayOfMonth(tanggal), "yyyy-MM-dd", {locale: idLocale});
                    periode = format(tanggal, "yyyy-MM", {locale:idLocale});
                  }
      
                  let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/dashboard/ppe-image?skip=${arrImageCameraGal.length}&limit=100&id_camera=${camera_id}&start_month=${start_month}&end_month=${end_month}`
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
                            let raw_data_ori = resultdata.filter(val=>val?.['id_camera'] == camera_id && val?.['month'] == periode); // object asli
      
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
                  // menambahkan data image baru ke arrImageCameraGal
                  setArrImageCameraGal([...gabungimg]);
      
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

      const handleScrollContainer = (e) => {

        if (isFetching) return; // Jika proses sedang berlangsung, keluar dari fungsi
          
          let gal_threshold = e.target.scrollHeight - e.target.offsetHeight;

        let gal_scrollHeight = e.target.scrollHeight;
        let gal_offsetHeight = e.target.offsetHeight;
        let gal_scrollTop = e.target.scrollTop;
        let gal_final = e.target.scrollHeight - e.target.offsetHeight - 5;
        
        if (gal_scrollTop >= gal_final && gal_scrollTop > 0 && gal_final > 0)
          {
              setIsFetching(true);
            
              setTimeout(()=>{

                console.log(`Scroll Height : ${gal_scrollHeight}
                            \nOffset Height : ${gal_offsetHeight}
                            \nScroll - Offset Height : ${gal_threshold}
                            \nScroll Top : ${gal_scrollTop}
                            \nScroll Final : ${gal_final}
                            `);
                setheightGalContainer((prev)=>prev + 100);
                
                generateArrImageCameraFunc_InComp(idCamera, tanggal);  //GENERATE IMAGE

                setIsFetching(false);
                
              },300)
          }
          // console.log(refContainer.current.scrollHeight)
      }

      const handleLoadImg = (idx) => {
          // if (arrImageCameraGal.length > 0)
          // {
            setTimeout(()=>{
              setArrImageCameraGal(prevImages=>{
  
                  // prevImages[idx] = {...prevImages[idx], isLoading: false}
                  let arrImageCam_Temp = [...prevImages];
                  arrImageCam_Temp[idx] = {...arrImageCam_Temp[idx], isLoading: false};
                  // return prevImages;
                  return arrImageCam_Temp;
              })

            },1)

          // }
    
      }

      const refresh_func_tabpanel = () => {
          outRefresh();
      }
  
      return (
                  <>
                      {
                        // *** Data Kosong
                          (objCameraAndTools == null ||
                          typeof objCameraAndTools?.['tools'] == 'undefined' ||
                          Object.keys(objCameraAndTools?.['tools']).length == 0) && (

                              <div key={`random-img-nodata`} className='col d-flex justify-content-center align-items-center ppe-anly-nodata-cust-tabpanel'>
                                
                                  <div className='position-relative'>
                                      {/* <div className='ppe-nodata-dashanly'>{`Gallery`} </div> */}
                                      <img src={NoData} height = "400" width="400"/>
                                      <Box className='d-flex justify-content-center ppe-btn-refresh'>
                                          <ButtonMui variant='outlined' color='error'
                                                onClick={()=>{refresh_func_tabpanel()}}
                                                className='d-flex align-items-end'
                                                // disabled={loadMoreProgShow}
                                                >
                                            <span>Refresh</span>
                                        </ButtonMui>
                                      </Box>
                                  </div>
                              </div>
                          )
                      }

                      {
                        // *** Data Ada
                        objCameraAndTools?.['tools'] &&
                        Object.keys(objCameraAndTools?.['tools']).length > 0 && (
                            <>

                                <div className={`ppe-card-dash-top ${isDragging ? 'isDragging' : ''}`}
                                      onMouseDown={handleMouseDownCardContainer}
                                      onMouseMove={handleMouseMoveCardContainer}
                                      onMouseLeave={handleMouseUpCardContainer}
                                      onMouseUp={handleMouseUpCardContainer}
                                      ref={containerRefCard}
                                >
                                    {
                                      Object.keys(objCameraAndTools?.['tools']).map((tool,idxtool)=>{
                                        return (
                                          <div key={`ppe-aly-${idxtool}`} className='ppe-card-dash-top-sub'>
                                            <Card className={`ppe-card-dash-main ppe-card-idx-${idxtool % 9}`}>
                                                <Card.Body>
                                                    <div className='ppe-card-body-title'>
                                                        <span>{objCameraAndTools?.['tools']?.[tool]?.['label']}</span>
                                                    </div>

                                                    <div className='ppe-card-body-title mt-3'>
                                                        <div className='d-flex justify-content-center'>
                                                          <NumberAnimate propStyle={{textColor:'white'}} angka={objCameraAndTools?.['tools']?.[tool]?.['value']} />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                          </div>
                                        )
                                      })
                                    }
                                </div>

                                <div className='mt-3' style={{cursor:'auto'}}>
                                  {
                                    Object.keys(barChartConf).length > 0 && 
                                    (
                                      <ReactApexChart 
                                            options={barChartConf?.['options']} 
                                            series={barChartConf?.['series']} 
                                            type="bar"
                                            height={350}
                                      />
                                    )
                                  }
                                </div>

                                {/* IMAGE GALLERY */}

                                {/* <div className='mt-3 ppe-card-dash-info-image-gal'>
                                    
                                    <div className='d-flex align-items-start ppe-card-dash-info-image-title'
                                          style = {{maxHeight:'800px', overflow:'auto'}}
                                          ref={refGalleryContainer} 
                                          onScroll={handleScrollContainer}>

                                        <div className='row px-2 w-100 h-100'>
                                            {
                                              arrImageCameraGal && arrImageCameraGal.length == 0 && 
                                              (
                                                  <div key={`random-img-nodata`} className='col d-flex justify-content-center align-items-center'>
                                                    <div className='position-relative'>
                                                        <div className='ppe-nodata-gallery-text'>{`Gallery`} </div>
                                                        <img src={NoData} height = "400" width="400"/>
                                                    </div>
                                                  </div>
                                              )
                                            }

                                            <Gallery withCaption withDownloadButton options={photoSwpOpt}>
                                                {
                                                  // new Array(Math.floor((Math.random()*10)+1)).fill(null).map((obj,idx)=>{
                                                  arrImageCameraGal.length > 0 &&
                                                      arrImageCameraGal.map((objimg,idx)=>(
                                                            <div key={`random-img-${idx}`} className='col-md-2 col-lg-2 mt-0 py-1 px-1'>

                                                                <div className='info-image ppe-random-img-container'>

                                                                    {
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

                                                                      
                                                                        <div style={{
                                                                                    height:'100%', 
                                                                                    display: objimg['isLoading'] ? 'none':'block' 
                                                                                    }}>

                                                                              <Item 
                                                                                    key={`random-item-img-${idx}`} 
                                                                                    original={`${objimg?.['img']}`}
                                                                                    thumbnail={`${objimg?.['img']}`}
                                                                                    width="600"
                                                                                    height="690"
                                                                              >
                                                                                  {({ref, open})=>(
                                                                                    <img ref={ref} onClick={open} 
                                                                                          onLoad={()=>{handleLoadImg(idx)}}
                                                                                          onError={()=>{}}
                                                                                          src={`${objimg?.['img']}`} width={'100%'} height={'100%'} />
                                                                                  )}
                                                                              </Item>

                                                                        </div>

                                                                </div>
                                                            </div>
                                                        // )
                                                      ))
                                                }

                                            </Gallery>
                                        </div>

                                    </div>
                                </div> */}
                            </>

                        )
                      }

                      {/* *** MODAL GOOGLE MAPS */}
                      {/* <div className='mt-3' style={{cursor:'auto', width:'100%'}}>
                          <div style = {{height:'90vh'}}>

                              <MapComponent type='view_cctv' 
                                  outChange={()=>{}}
                                  textStyle='dark'
                                  defaultStyleMapNumber={2} 
                                  titleInfoWindow={`${objCameraAndTools?.['label']}`}
                                  urlVideo={`${objCameraAndTools?.['url_video']}`}
                                  lat={objCameraAndTools?.['position']?.['lat']} lng={objCameraAndTools?.['position']?.['lng']} 
                              />
                          </div>
                      </div> */}
                    
                  </>
              )
  }


const DashboardAnalitikAll = () => {

  // default status semua data
  const [statusAllCam, setStatusAllCam] = useState<boolean>(true);

  // Multi Select
  const cities = [
    {name:'Jakarta', code: 'JKT'},
    {name:'Pontianak', code: 'PNK'},
    {name:'Surabaya', code: 'SBY'},
    {name:'Bandung', code: 'BDG'},
    {name:'Bali', code: 'BAL'}
  ];
  const [selectedCities, setSelectedCities] = useState<any>([]);

  const handleChangeCities = (e) => {
    // e.value => {name:..., city:...}
    if (e.value.length >= 1){
      let objSelected:any = {...e.value[e.value.length-1]};
      setSelectedCities([objSelected]);
    } else {
      setSelectedCities([]);
    }
  }


  // ...


  // Set Date Periode
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const [dataCamera, setDataCamera] = useState<any[] | null>([]);
  // data -> [{id:1, camera_name:xxx, is_active:true, endpoint:xxx, latitude:9.99, longitude:9.99}]

  // Total Camera render
  const [totalCamera, setTotalCamera] = useState(15);

  const [statusNoData, setStatusNoData] = useState(false);  // status no data akan show icon no data jika data camera tidak ada

  const [disabledTab, setDisabledTab] = useState(false);

  // Multi Select
  const multiSelectJenisDashboardRef = useRef<any>(null);
  const [selectedJenisDashboard, setSelectedJenisDashboard] = useState<any>([]);
  const [arrJenisDashboard, setArrJenisDashboard] = useState<any>([]);

  // urutan tools array (api = nama tools versi api)
  let tools_arr = [{name:'wearpack', api:'wearpack', label:'Wearpack'}, {name:'no_wearpack', api:'no_wearpack', label:'No Wearpack'}, {name:'helmet', api:'helmet', label:'Helmet'}
                  , {name:'glasses', api:'glasses', label:'Glasses'}, {name:'earmuffs', api:'earmuffs', label:'Earmuffs'}, {name:'respirator', api:'respirator', label:'Respirator'}
                  , {name:'harness', api:'harness', label:'Harness'}, {name:'gloves', api:'gloves', label:'Gloves'}, {name:'shoes', api:'shoes', label:'Shoes'}
  ]

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


  const generateArrImageCameraFunc = async(arr_camera?:any[], index_camera?:any, tanggal?:Date|null) => {

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

            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/dashboard/ppe-image?skip=0&limit=100&id_camera=${camera_id}&start_month=${start_month}&end_month=${end_month}`
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
                      let raw_data_ori = resultdata.filter(val=>val?.['id_camera'] == camera_id && val?.['month'] == periode); // object asli

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

            // tampil di card
            setArrImageCamera([...arrImageCamera_temp]);

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
        else {
            setArrImageCamera([]);
        }
    }

    return
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


  useEffect(()=>{

  },[totalCamera])


  useEffect(()=>{
    // * useEffect awal

    const fetchData = async() => {

        // * Jenis Dashboard
        let arr_dashboard = [
          {id:0, name:'PPE', api:'ppe'},
          {id:1, name:'Vehicle', api:'vehicle'}
        ];
        setArrJenisDashboard(arr_dashboard);

        if (arr_dashboard.length > 0) {
          setSelectedJenisDashboard([{...arr_dashboard[0]}]);
        }
        // ... end


  
        setDisabledTab(true); // disabled tab pada saat loading
        setShowLoaderMain(true);

        let arr_camera:any[] = await getDataCamera() || [];  // Get Data Camera (Master)
        if (arr_camera.length > 0)
        {
            setDataCamera([...arr_camera]); // master camera

            // generateArrImageCameraFunc(arr_camera, tabValue, startDate); // generate GAMBAR per Camera
      
            generateCameraAndTools(arr_camera, tabValue, startDate, statusAllCam, arr_dashboard?.[0]?.['api'] ?? null); // generate data element per camera
  
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


        setTimeout(()=>{
          // dispatch icon title
          storeMenu.dispatch({type:'titleicon', text: 'Analitik'});
  
          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Dashboard', value:'Dashboard'}, {key:'Analitik', value:'Analitik'}]});
          
        },100)
    }

    fetchData();
  },[])

  const refresh_func = async() => {

        setDisabledTab(true); // disabled tab pada saat loading
        setShowLoaderMain(true);

        let arr_camera:any[] = await getDataCamera() || [];  // Get Data Camera (Master)
        if (arr_camera.length > 0)
        {
            setDataCamera([...arr_camera]); // master camera
            
            // generateArrImageCameraFunc(arr_camera ?? [], tabValue, startDate); // generate GAMBAR per Camera
      
            generateCameraAndTools(arr_camera, tabValue, startDate, statusAllCam, selectedJenisDashboard?.[0]?.['api'] ?? null); // generate data element per camera
  
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
  

  const generateCameraAndTools = async(arr_camera?:any[]|null, index_camera?:any, tanggal?:Date|null, statusAllCamera?:boolean, jenis_dashboard?:any) => {

    // ** jenis_dashboard -> ppe / vehicle

    // generate looping Jumlah Camera -> 'setObjCardList'
    // looping tools

    // console.error("Array Camera Parameter----------")
    // console.log(arr_camera);
    
    if (index_camera != null && !isNaN(index_camera)) // jika angka, maka masuk
    {
      
        // Master Camera jika ada yang diberikan dari parameter
        let dataCamera_single:any = null;
        if (typeof arr_camera != 'undefined' && arr_camera != null && Array.isArray(arr_camera))
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

        // jika dataCamera_single tidak null atau Status Semua Camera
        if (dataCamera_single != null || statusAllCamera)
        {
            // id camera yang nanti akan di parsing sebagai parameter untuk api results

            let camera_id = statusAllCamera ? 'All' : dataCamera_single?.['id'];
            
            let camera_name = statusAllCamera ? 'All' : dataCamera_single?.['camera_name'];
            let camera_endpoint = statusAllCamera ? '' : dataCamera_single?.['endpoint'];
            let camera_isactive = statusAllCamera ? true : dataCamera_single?.['is_active'];
            let camera_latitude = statusAllCamera ? 0 : dataCamera_single?.['latitude'];
            let camera_longitude = statusAllCamera ? 0 : dataCamera_single?.['longitude'];

            // *** nanti tambahkan id camera jika API sudah ready (parameter results)
            let start_month, end_month, periode;  // periode -> "2024-06"

            if (tanggal != null)
            { 
              start_month = format(new Date(tanggal.getFullYear(), tanggal.getMonth(), 1), "yyyy-MM-dd", {locale:idLocale});
              end_month = format(lastDayOfMonth(tanggal), "yyyy-MM-dd", {locale: idLocale});
              periode = format(tanggal, "yyyy-MM", {locale:idLocale});
            }

            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/dashboard/cctv-statistics?skip=0&limit=1000&start_month=${start_month}&end_month=${end_month}&jenis=${jenis_dashboard}`
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
              if ((Array.isArray(resultdata) && resultdata.length > 0)){
                    
                    let raw_data_ori:any;   // {month:'', total_bus:1, total_car:2, dst... }

                    if (statusAllCamera) {
                        // jika all data semua camera
                        raw_data_ori = {...resultdata[0]};
                    } else {
                        // jika terpilih camera tertentu
                        raw_data_ori = resultdata.filter(val=>val?.['id_camera'] == camera_id && val?.['month'] == periode)[0]; // object asli
                    }

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
                          [`${statusAllCamera ? 'All' : camera_id}`]:{
                              'label': `${statusAllCamera ? 'All' : camera_name}`,
                              'tools': {...tools_obj_temp},
                              'position': {lat: parseFloat(`${statusAllCamera ? 0 : camera_latitude}`), lng: parseFloat(`${statusAllCamera ? 0 : camera_longitude}`)},
                              'url_video': `${statusAllCamera ? '' : camera_endpoint}`
                          }
                      }
                      

                      // ['Boots', 'Hardhat', 'No Hardhat', 'No Wearpack', 'Wearpack']
                      objChartData_cat = tools_obj_temp_arr.map(([k,v],i)=>k);
                      // [0, 1, 0, 0, 1]
                      objChartData_data = tools_obj_temp_arr.map(([k,v],i)=>v);

                      objChartData_temp = {
                          ...objChartData_temp,
                          [`${statusAllCamera ? 'All' : camera_id}`]:{
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
                      
                      objCardList_temp = {...objCardList_temp, [`${statusAllCamera ? 'All' : camera_id}`]:{
                                                  'label': `${statusAllCamera ? 'All' : camera_name}`,
                                                  'tools': {},
                                                  'position': {lat: -6.179390795905389, lng: 106.82778903999814},
                                                  'url_video': `${statusAllCamera ? '' : camera_endpoint}`
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

                    objCardList_temp = {...objCardList_temp, [`${statusAllCamera ? 'All' : camera_id}`]:{
                                        'label': `${statusAllCamera ? 'All' : camera_name}`,
                                        'tools': {},
                                        'position': {lat: -6.179390795905389, lng: 106.82778903999814},
                                        'url_video': `${statusAllCamera ? '' : camera_endpoint}`
                                }};
                    objChartData_temp = {...objChartData_temp, [`${statusAllCamera ? 'All' : camera_id}`]:{
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

    let objCardList_temp = {...objCardList};
    let objChartData_temp = {...objChartData};  // per camera untuk chart

    if (totalCamera > 0)
    {
        for (let i=1; i<=totalCamera; i++)
        {
            // looping tools
            let tools_obj_temp = {};

            // isi ke objChartData
            let objChartData_cat:any[] = [];
            let objChartData_data:any[] = [];

            if (tools_arr.length > 0)
            {
              
                // contoh data tools_arr -> {name:'wearpack', api:'wearpack', label:'Wearpack'}
                for (let j=0; j<tools_arr.length; j++)
                {
                    // let valueTool = Math.floor(Math.random() * 101); // tambah key value (FOR TEST)
                    let valueTool = 0;

                    // ==== tujuan'y isi ke ->  objCardList

                    let tools_arr_copy_content = {...tools_arr?.[j]};
                    tools_arr_copy_content['value'] = 0; // tambah key value
                    // tools_arr_copy_content['value'] = valueTool;

                    let tool_name = tools_arr?.[j]?.['name'];
                    let tool_label = tools_arr?.[j]?.['label'];


                    tools_obj_temp = {
                      ...tools_obj_temp,
                      [tool_name]: {...tools_arr_copy_content}
                    }
                    // ... ==== end isi ke -> objCardList

                    // ==== tujuan'y isi ke -> objChartData
                    objChartData_cat = [...objChartData_cat, tool_label];  // categories
                    objChartData_data = [...objChartData_data, valueTool];  // data
                }
            }

            objCardList_temp = {
                ...objCardList_temp,
                [`camera-${i}`]:{
                        'label':`Camera ${i}`,
                        'tools':{...tools_obj_temp},
                        'position': {lat: -6.179390795905389, lng: 106.82778903999814},  // parsing API, default nya indonesia
                        'url_video': 'https://cctvjss.jogjakota.go.id/margo-utomo/Toko-Cat-Wahyu.stream/chunklist_w1093883685.m3u8'  // video cctv
                        // 'url_video': 'https://cctvjss.jogjakota.go.id/atcs/ATCS_joktengkulon.stream/chunklist_w1632001161.m3u8'  // video cctv
                        // 'url_video': 'https://mam.jogjaprov.go.id:1937/cctv-public/ViewSimpangTugu.stream/chunklist_w1966116383.m3u8'  // video cctv
                        // 'url_video': 'https://pelindung.bandung.go.id:3443/video/DPU/sudirman.m3u8'  // video cctv
                }
            }

            objChartData_temp = {
                ...objChartData_temp,
                [`camera-${i}`]:{
                        'categories': [...objChartData_cat],
                        'data': [...objChartData_data]
                }
            }
        }
    } else {
      objCardList_temp = {}
      objChartData_temp = {}
    }
    console.log(objCardList_temp)
    setObjCardList(objCardList_temp);

    // bar chart
    setObjChartData(objChartData_temp);
    // ...

    console.log(objChartData_temp);
  }

  // Tab Change
  const handleChangeTab = (event:React.SyntheticEvent, newValue:number) => {

    setDisabledTab(true); // disabled tab pada saat loading
    setTabValue(newValue);

    generateArrImageCameraFunc(dataCamera ?? [], newValue, startDate); // GENERATE GAMBAR PER CAMERA

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

      // generateArrImageCameraFunc(dataCamera ?? [], tabValue, date); // generate GAMBAR per Camera

      generateCameraAndTools(dataCamera ?? [], tabValue, date, statusAllCam, selectedJenisDashboard?.[0]?.['api'] ?? null); // generate data element per camera

      setTimeout(()=>{
        setShowLoaderMain(false);

        setTimeout(()=>{
          setDisabledTab(false);
        },1000)

      },500)

  }

  const handleChangeDashboard = async(e) => {
    // * harus ada yang terpilih, jika tidak ada maka jangan parsing kondisi kosong

    if (e.value.length >= 1){
      
      let objSelected:any = {...e.value[e.value.length-1]};

      setSelectedJenisDashboard([objSelected]);

      // * jika sudah ada yang terpilih, maka langsung close drop down nya
      if (multiSelectJenisDashboardRef.current){
        multiSelectJenisDashboardRef.current.hide();
      }

      // * load data dari api
      setShowLoaderMain(true);

      // generateArrImageCameraFunc(dataCamera ?? [], tabValue, date); // generate GAMBAR per Camera

      generateCameraAndTools(dataCamera ?? [], tabValue, startDate, statusAllCam, objSelected?.['api']); // generate data element per camera

      setTimeout(()=>{
        setShowLoaderMain(false);
      }, 500)
    } 
  }


  return (
    <>
        <div className='ppe-anly'>

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
            <div className='d-flex flex-column flex-sm-column flex-md-row align-items-stretch gap-2 ppe-anly-datepicker'>
              
                {/* <span className='ppe-anly-datepicker-title 
                          align-self-start align-self-sm-start align-self-md-center'>Periode :</span> */}

                <div>
                  {/* Jenis Dashboard */}
                    <MultiSelect 
                        ref={multiSelectJenisDashboardRef}
                        options={arrJenisDashboard}
                        value={selectedJenisDashboard}
                        onChange={handleChangeDashboard}
                        optionLabel='name'
                        filter
                        showClear
                        resetFilterOnHide   // reset filter ketika sudah hide
                        className='w-100 custom-multiselect-prime'
                        showSelectAll={false}
                        maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                        placeholder='Select a Dashboard'
                        style={{height:'35px', minWidth:'230px', maxWidth:'250px', padding: '2px 0px', lineHeight:'5px'}}
                    />
                </div>

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
                </div>

                {/* <div>
                    <MultiSelect 
                        options={cities}
                        value={selectedCities}
                        onChange={handleChangeCities}
                        optionLabel='name'
                        filter
                        resetFilterOnHide   // reset filter ketika sudah hide
                        className='w-100 custom-multiselect-prime'
                        showSelectAll={false}
                        maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                        placeholder='Select a City'
                        style={{height:'35px', maxWidth:'250px', padding: '2px 0px', lineHeight:'5px'}}
                    />
                </div>
                <div>
                    <ButtonPrime label="Cari" icon='pi pi-search' iconPos='left' className='custom-prime-size-small' outlined></ButtonPrime>
                </div> */}
            </div>


            {/* Real Dashboard Analitik (All Statistics Data) */}
            {
              !showLoaderMain && (
                  <>
                      {/* Jika Data Kosong */}
                      {/* {
                        dataCamera == null || (Array.isArray(dataCamera) && dataCamera.length == 0) && (
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
                      } */}

                      {/* Jika Data Ada */}
                      {
                          <CustomTabPanel key={`tab-custom-analitik-0`} value={tabValue} 
                                  objCameraAndTools={objCardList?.[Object.keys(objCardList)[0]]}  // element tools objCardList
                                  objChartData={objChartData?.[Object.keys(objCardList)[0]]}  // configurasi bar chart
                                  arrImageCamera={arrImageCamera ?? []}
                                  idCamera={Object.keys(objCardList)[0]}
                                  tanggal={startDate}
                                  outRefresh={outRefreshTabPanel}
                          />
                      }
                  </>
              )
            }

            {
                showLoaderMain &&
                (
                  <div className='ppe-anly-ppe-loader-main'>
                      <Bars width='80' height='80' visible={showLoaderMain} color='#4fa94d'/>
                  </div>
                )
            }

            {/* ... end */}

            
        </div>
        
        <ToastContainer 
          draggable
          pauseOnHover
        />
    </>
  )
}

export default DashboardAnalitikAll