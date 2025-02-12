
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './Main.scss'
import { ToastContainer } from 'react-toastify';
import storeMenu from '../../../stores';
import { MRT_ColumnDef, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MaterialReactTable } from 'material-react-table';
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, handleSwal, handleSwalResult, notify } from '../../../services/functions';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Avatar, AvatarGroup, Badge, Box, Button, Chip } from '@mui/material';
import { AccessTime, ArrowBackIosNew, ArrowDownward, ArrowUpward, ArrowUpwardRounded, ControlPointRounded, DeleteForever, LockClock, ModeEdit, Refresh, Remove, Timer, TimerOutlined } from '@mui/icons-material';
import ModalCreateCameras from '../../modal/CreateCameras';
import { Card } from 'react-bootstrap';
import { svgCustom } from '../../../pages/util/svgcustom';
import NumberAnimate from '../../atoms/numberAnimate';
import { amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, indigo, lightGreen, lime, orange, pink, purple, red, teal, yellow } from '@mui/material/colors';
import Img_Linkedins from '../../../assets/images/linkedin-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHelmetSafety, faUser } from '@fortawesome/free-solid-svg-icons';
import { CrystalGlare, EarMuffs, Glasses, Gloves, Helmet, IoTLogo, NoData, Respirator, SafetyHarness, SafetyShoes, Wearpack } from '../../../assets';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import { ApexOptions} from 'apexcharts';
import Chart from 'apexcharts'
import ReactApexChart from 'react-apexcharts';
import AreaCamera from '../../chart/AreaCamera';
import { ProgressBar, RotatingLines } from 'react-loader-spinner';

import 'photoswipe/dist/photoswipe.css'

import { Gallery, Item } from 'react-photoswipe-gallery';
import { PhotoSwipeOptions } from 'photoswipe';
import ModalDetailInfoCamera from '../../modal/DetailInfoCamera';

const DashboardMain = () => {

  // for test button
    const [dis, setDis] = useState(false);

  // Total Camera render
    const [totalCamera, setTotalCamera] = useState(4);

    // Modal Detail Info Camera
    const [showModalLoader, setShowModalLoader] = useState(false);
    const [showModalImgDetailCamera, setShowModalImgDetailCamera] = useState(false);
    const [modalRow, setModalRow] = useState({});   // data parsing for edit row 

    // image gallery
    const [titleImageCamera, setTitleImageCamera] = useState(''); // Camera 1, Camera 2 in image gallery
    const [showImageGallery, setShowImageGallery] = useState(false);  // show image gallery when click info
    const [arrImageCamera, setArrImageCamera] = useState<any[]>([
      // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
      // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
      // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
      // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`},
      // {isLoading:true, url:`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`}
    ])

  // Setting Drag Scroll pada card container
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRefCard:any = useRef(null);
  // ... {end setting}

  // Setting Drag Scroll pada List Card Container
  const containerRefListCard:any = useRef(null);
  const [isDragginListCard, setIsDraggingListCard] = useState(false);
  const [startYListCard, setStartYListCard] = useState(0);
  const [scrollTopListCard, setScrollTopListCard] = useState(0);
  // ... {end setting}

  // State Data Stacked Chart
  const chartListRef:any = useRef(null);
  const [seriesStackChart, setSeriesStackChart] = useState<ApexOptions['series']|any>([]);
  const [optStackChart, setOptStackChart] = useState<ApexOptions>({});

  const [stackChart, setStackChart] = useState<any>({ 
    series: [
      {
        name:'Helmet',
        group: 'group-1',
        data: [170, 300, 150, 200, 100, 170]
      },
      {
        name:'Glasses',
        group: 'group-1',
        data: [200, 110, 120, 70, 80, 20]
      },
    ],
    options: {
      chart:{
        type:'bar',
        height: 350,
        stacked:true
      },
      stroke:{
        width:1,
        colors:['#fff']
      },
      dataLabels: {
        formatter: (val) => {
          return val
        }
      },
      plotOptions:{
        bar:{
          horizontal:false
        }
      },
      xaxis:{
        categories:['Cam 1', 'Cam 2', 'Cam 3', 'Cam 4', 'Cam 5', 'Cam 6']
      },
      fill:{opacity:1},
      yaxis:{
        show:true,
        align:'center',
        labels:{
          formatter: (val) => {
            return val;
          }
        }
      },
      legend:{
        position:'top',
        horizontalAlign: 'left'
      }
    }}
  );
  // ... end 

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
      //     time: '01 December 2023 15:00'
      // },
      // 'camera-2':{
      //     label: 'Camera 2',
      //     tools:{
      //       'helmet': {label:'Helmet', value:789, previousValue:9, avatarIcon:<Avatar src={Helmet} sx={{bgcolor:teal["200"]}} />, percent:'100%', bgColor: teal['200'], trenStatus:'up', trenIcon: <ArrowUpward sx={{color:'green'}} />},
      //       'glasses': {label:'Glasses', value:25, previousValue:50, avatarIcon:<Avatar src={Glasses} sx={{bgcolor:lightGreen["200"]}} />, percent:'50%', bgColor: lightGreen['200'], trenStatus:'down', trenIcon: <ArrowDownward sx={{color:'red'}} />},
      //       'earmuffs': {label:'Ear Muffs', value:78, previousValue:39, avatarIcon:<Avatar src={EarMuffs} sx={{bgcolor:yellow["A700"]}} />, percent:'70%', bgColor: lightGreen['200'], trenStatus:'down', trenIcon: <ArrowDownward sx={{color:'red'}} />}
      //     },
      //     time: '01 December 2023 15:00'
      // }
  });

  const generateObjCardList = () => {

    let objCardListFirst:any = {};

    // respirator (tidak dipakai)

    for (var i=1; i<=totalCamera; i++){
      objCardListFirst = {
        ...objCardListFirst,

        [`camera-${i}`]:{
            ...objCardListFirst?.[`camera-${i}`],
            label:`Camera ${i}`,
            tools:{
                'helmet': {label:'Helmet', value:null, previousValue:null, avatarIcon:<Avatar src={Helmet} sx={{bgcolor:teal["200"]}} />, percent:'0%', trenStatus:null, trenIcon: null},
                'glasses': {label:'Glasses', value:null, previousValue:null, avatarIcon:<Avatar src={Glasses} sx={{bgcolor:lightGreen["200"]}} />, percent:'0%', trenStatus:null, trenIcon: null},
                'earmuffs': {label:'Ear Muffs', value:null, previousValue:null, avatarIcon:<Avatar src={EarMuffs} sx={{bgcolor:yellow["A700"]}} />, percent:'0%',  trenStatus:null, trenIcon: null},
                // 'respirator': {label:'Respirator', value:null, previousValue:null, avatarIcon:<Avatar src={Respirator} sx={{bgcolor:purple["100"]}} />, percent:'0%', trenStatus:null, trenIcon: null},
                'wearpack': {label:'Wearpack', value:null, previousValue:null, avatarIcon:<Avatar src={Wearpack} sx={{bgcolor:orange["200"]}} />, percent:'0%', trenStatus:null, trenIcon: null},
                'harness': {label:'Safety Harness', value:null, previousValue:null, avatarIcon:<Avatar src={SafetyHarness} sx={{bgcolor:lime["700"]}} />, percent:'0%', trenStatus:null, trenIcon: null},
                'gloves': {label:'Gloves', value:null, previousValue:null, avatarIcon:<Avatar src={Gloves} sx={{bgcolor:cyan["100"]}} />, percent:'0%', trenStatus:null, trenIcon: null},
                'shoes': {label:'Safety Shoes', value:null, previousValue:null, avatarIcon:<Avatar src={SafetyShoes} sx={{bgcolor:yellow["400"]}} />, percent:'0%', trenStatus:null, trenIcon: null}
            }
        }

      }
    }

    setObjCardList({...objCardListFirst})
    console.log(objCardListFirst);
  }

  const stateStackChartMethod = () => {

    let categoryCamera:any = [];
    let dataCameraFirst:any = [];
    for (var i=1; i<=totalCamera; i++){
      categoryCamera = [...categoryCamera, `Cam ${i}`];
      dataCameraFirst = [...dataCameraFirst, 0];

    }

    // colors:['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
    let seriesOpt:ApexOptions['series'] = [
      {
          name:'Helmet',
          data: [...dataCameraFirst],
          group: 'group-1',
          color:'#80c7fd'
        },
        {
          name:'Glasses',
          data: [...dataCameraFirst],
          group: 'group-1',
          color:'#80f1cb'
        },
        {
          name:'Ear Muffs',
          data: [...dataCameraFirst],
          group: 'group-1',
          color:'#ffc552'
        },
        // {
        //   name:'Respirator',
        //   data: [...dataCameraFirst],
        //   group: 'group-2',
        //   color:'#008FFB'
        // },
        {
          name:'Wearpack',
          data: [...dataCameraFirst],
          group: 'group-2',
          color:'#00E396'
        },
        {
          name:'Safety Harness',
          data: [...dataCameraFirst],
          group: 'group-2',
          color:'#FEB019'
        },
        {
          name:'Gloves',
          data: [...dataCameraFirst],
          group: 'group-3',
          color:'#0068b8'
        },
        {
          name:'Safety Shoes',
          data: [...dataCameraFirst],
          group: 'group-3',
          color:'#00ad73'
        }
    ];
    

    let temp_obj_opt:ApexOptions = {
        chart:{
          type:'bar',
          stacked: true
        },
        stroke:{
          width:1,
          colors:['#fff']
        },
        dataLabels: {
          enabled: true,
          formatter: (val:any,opts:any) => {
            return val;
          },
          textAnchor:'middle',
          style:{
            fontSize:'10px',
            fontFamily:'FF_Din_Font',
            fontWeight:700
          },
          dropShadow:{
            color:'blue',
            enabled:true
          }
        },
        plotOptions:{
          bar:{
            horizontal:false,
            // columnWidth:100
          },
          pie:{
            donut:{
              size:'10%'
            }
          }
        },
        grid:{
          row:{
            colors:['#fff','#f2f2f2']
          }
        },
        xaxis:{
          categories:[...categoryCamera],
          labels:{
            rotate:-45,
            style:{
              // colors:['#ff0000','#00ff00'],
              fontSize:'12px',
              fontWeight:'500',
              fontFamily:'FF_Din_Font'
            }
          }
        },
        fill:{opacity:1},
        yaxis:{
          labels:{
            formatter: (val:any) => {
              return val;
            }
          }
        },
        legend:{
          position:'top',
          horizontalAlign: 'left'
        }
    }
    
    
    
    setTimeout(()=>{
      if (seriesOpt != null){
        setSeriesStackChart([...seriesOpt]);
      }

      setOptStackChart({...temp_obj_opt});

      setTimeout(()=>{
        try{
          let chartList = chartListRef.current.chart;
          chartList.showSeries('Helmet')
        }catch(e){}
      },1)
    })
  }

  const generateArrImageCameraFunc = () => {

    // jumlah gambar
    let randomJumlahImage = Math.floor(Math.random() * 10); // 0 - 9
    

    if (randomJumlahImage > 0){
      let arrImage:any[] = [];
      let arrImageTemp = new Array(randomJumlahImage).fill({isLoading: true});

      arrImage = arrImageTemp.map((val, idx)=>{
        return {
          // isLoading: true,
          isLoading: val?.['isLoading'],
          url: `https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`,

          tools:{ // deskripsi issue
            helmet: Math.floor(Math.random() * 101),
            glasses: Math.floor(Math.random() * 101),
            earmuffs: Math.floor(Math.random() * 101),
            gloves: Math.floor(Math.random() * 101),
            wearpack: Math.floor(Math.random() * 101),
            harness: Math.floor(Math.random() * 101),
            shoes: Math.floor(Math.random() * 101)
          }
        }
      })
      setArrImageCamera([...arrImage]);

    } else {
      // kalau tidak ada gambar, maka show image no data
      setArrImageCamera([]);
    }
  }

  useEffect(()=>{

      // generate Array Image Gallery
        generateArrImageCameraFunc();

      // generate object semua camera terlebih dahulu
        generateObjCardList();

        // set series and options to chart stacked
        stateStackChartMethod();

        setTimeout(()=>{
          // dispatch icon title
          storeMenu.dispatch({type:'titleicon', text: 'Main'})

          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Dashboard', value:'Dashboard'}, {key:'Main', value:'Main'}]})
          
        },100)

    },[])

    const [objCam, setObjCam] = useState({});
    const [num, setNum] = useState(0);

    let handleClick = () => {
      let randCam = Math.floor(Math.random() * 9) + 1;
      let randNum = Math.floor(Math.random()*1000);
      setObjCam((obj)=>{
        return {
          ...obj,
          [randCam]: randNum
        }
      })
    }

    const handleMouseDownCardContainer = (e) => {
        // e.pageX = e.clientX -> posisi cursor
        setIsDragging(true);
        let width_ContainerFromStart_To_Cursor = e.pageX - containerRefCard.current.offsetLeft;
        setStartX(width_ContainerFromStart_To_Cursor);

        setScrollLeft(containerRefCard.current.scrollLeft);
    }

    const handleMouseMoveCardContainer = (e) => {
        if (!isDragging) return;

        // hanya terhitung jika di drag
        let width_ContainerFromStart_To_Cursor_New = e.pageX - containerRefCard.current.offsetLeft;

        let selisih_Width_X = width_ContainerFromStart_To_Cursor_New - startX;
        let step_X = selisih_Width_X * 1.5;

        containerRefCard.current.scrollLeft = scrollLeft - step_X;
    }

    const handleMouseUpCardContainer = (e) => {
        setIsDragging(false);
    }


    const handleMouseDownListCard = (e) => {
        let height_ListY = e.pageY - containerRefListCard.current.offsetTop;
        setIsDraggingListCard(true);
        setStartYListCard(height_ListY);
        setScrollTopListCard(containerRefListCard.current.scrollTop);
    }
    const handleMouseMoveListCard = (e) => {
        
        if (!isDragginListCard) return;

        let height_ListY_New = e.pageY - containerRefListCard.current.offsetTop;
        let selisih = (height_ListY_New - startYListCard) * 1.5;
        containerRefListCard.current.scrollTop = scrollTopListCard - selisih;
    }
    
    const handleMouseUpListCard = (e) => {
        setIsDraggingListCard(false);
    }

    const updateToStackChart = (num_cam, val_tool_1,val_tool_2,val_tool_3,val_tool_4,val_tool_5
                                  ,val_tool_6,val_tool_7
                                ) => {

      // ['Helmet','Glasses','Ear Muffs','Respirator','Wearpack','Safety Harness','Gloves','Safety Shoes']
      // asumsi val_tool_1 -> helmet, val_tool_2 -> Glasses, dst...

      let arr_obj_series_card_list_temp:any = [...seriesStackChart];

      let arr_xaxis_categories:any[] = [];
      let xaxis_categories:any = optStackChart?.['xaxis']?.['categories'];

      // ambil category x axis
      if (typeof xaxis_categories != 'undefined' && xaxis_categories != null 
            && Array.isArray(xaxis_categories)){
        arr_xaxis_categories = [...optStackChart?.['xaxis']?.['categories']];
      }

      let findIndex_xaxis_cam:any = -1;
      if (arr_xaxis_categories.length > 0){
        // index camera dan data [0,0,0,...] dalam categories sama pada chart stack
        findIndex_xaxis_cam = arr_xaxis_categories.findIndex(x=>x == `Cam ${num_cam}`);
        
        // ==== HELMET ====
        // cari index helmet pada seriesStackChart
        let arr_tools = ['Helmet','Glasses','Ear Muffs','Wearpack','Safety Harness','Gloves','Safety Shoes'];
        arr_tools.forEach((val_tool, idx)=>{

            let findIndex_data_helmet = arr_obj_series_card_list_temp.findIndex(x=>x?.['name'] == val_tool);
            
            let data_helmet:any[] = [...arr_obj_series_card_list_temp?.[findIndex_data_helmet]?.['data']];
            
            if (findIndex_data_helmet != -1){
              // update nilai helmet rand_1 ke data_helmet
              
              // asumsi index tool terurut dari helmet sampai shoes
              let nilai_tool = val_tool == 'Helmet' ? val_tool_1 :
                                val_tool == 'Glasses' ? val_tool_2 :
                                val_tool == 'Ear Muffs' ? val_tool_3 :
                                // val_tool == 'Respirator' ? val_tool_4 :
                                val_tool == 'Wearpack' ? val_tool_4 :
                                val_tool == 'Safety Harness' ? val_tool_5 :
                                val_tool == 'Gloves' ? val_tool_6 :
                                val_tool == 'Safety Shoes' ? val_tool_7 : null

              data_helmet[findIndex_xaxis_cam] = nilai_tool;

              // update ke series temporary
              arr_obj_series_card_list_temp[findIndex_data_helmet] = {
                  ...arr_obj_series_card_list_temp[findIndex_data_helmet],
                  data: [...data_helmet]
              }
            }
        })
        

        // ... end === HELMET ===

        setSeriesStackChart([...arr_obj_series_card_list_temp]);
      }
    }

    const handleClickRandom = () => {
      // only for testing
      
      if (dis) return;

      setDis(true);

      let rand_cam = Math.floor(Math.random() * totalCamera) + 1;

      // hard code 
      // rand_cam = 1;

      console.log(rand_cam)

      let temp_obj = {...objCardList};

      let rand_1 = Math.floor(Math.random() * 101);
      let rand_2 = Math.floor(Math.random() * 101);
      let rand_3 = Math.floor(Math.random() * 101);
      let rand_4 = Math.floor(Math.random() * 101);
      let rand_5 = Math.floor(Math.random() * 101);
      let rand_6 = Math.floor(Math.random() * 101);
      let rand_7 = Math.floor(Math.random() * 101);
      // let rand_8 = Math.floor(Math.random() * 101);

      let cam_tools = temp_obj?.[`camera-${rand_cam}`]?.['tools'];

      let selisih_prevnew_1 = (rand_1 - cam_tools?.['helmet']?.['value']);
      let sign_1 = Math.sign(selisih_prevnew_1);
      let percent_1 = cam_tools?.['helmet']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_1 / cam_tools?.['helmet']?.['value']) * 100) * 100) / 100;

      let selisih_prevnew_2 = (rand_2 - cam_tools?.['glasses']?.['value']);
      let sign_2 = Math.sign(selisih_prevnew_2);
      let percent_2 = cam_tools?.['glasses']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_2 / cam_tools?.['glasses']?.['value']) * 100) * 100) / 100;

      let selisih_prevnew_3= (rand_3 - cam_tools?.['earmuffs']?.['value']);
      let sign_3 = Math.sign(selisih_prevnew_3);
      let percent_3 = cam_tools?.['earmuffs']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_3 / cam_tools?.['earmuffs']?.['value']) * 100) * 100) / 100;

      // let selisih_prevnew_4 = (rand_4 - cam_tools?.['respirator']?.['value']);
      // let sign_4 = Math.sign(selisih_prevnew_4);
      // let percent_4 = cam_tools?.['respirator']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_4 / cam_tools?.['respirator']?.['value']) * 100) * 100) / 100;

      let selisih_prevnew_4 = (rand_4 - cam_tools?.['wearpack']?.['value']);
      let sign_4 = Math.sign(selisih_prevnew_4);
      let percent_4 = cam_tools?.['wearpack']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_4 / cam_tools?.['wearpack']?.['value']) * 100) * 100) / 100;

      let selisih_prevnew_5 = (rand_5 - cam_tools?.['harness']?.['value']);
      let sign_5 = Math.sign(selisih_prevnew_5);
      let percent_5 = cam_tools?.['harness']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_5 / cam_tools?.['harness']?.['value']) * 100) * 100) / 100;

      let selisih_prevnew_6 = (rand_6 - cam_tools?.['gloves']?.['value']);
      let sign_6 = Math.sign(selisih_prevnew_6);
      let percent_6 = cam_tools?.['gloves']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_6 / cam_tools?.['gloves']?.['value']) * 100) * 100) / 100;

      let selisih_prevnew_7 = (rand_7 - cam_tools?.['shoes']?.['value']);
      let sign_7 = Math.sign(selisih_prevnew_7);
      let percent_7 = cam_tools?.['shoes']?.['value'] == 0 ? Infinity : Math.round(Math.abs((selisih_prevnew_7 / cam_tools?.['shoes']?.['value']) * 100) * 100) / 100;


      temp_obj = {
          ...temp_obj,
          [`camera-${rand_cam}`]:{
              label: `Camera ${rand_cam}`,
              tools:{
                  ...temp_obj?.[`camera-${rand_cam}`]?.['tools'],
                  'helmet':{
                    ...cam_tools?.['helmet'],
                    previousValue: cam_tools?.['helmet']?.['value'],
                    value: rand_1,
                    percent: percent_1 == Infinity ? '' : percent_1 + '%',
                    trenStatus: percent_1 == Infinity ? null : sign_1 == -1 ? 'down' : sign_1 == 1 ? 'up' : null,
                    trenIcon: percent_1 == Infinity ? null : sign_1 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_1 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
                  'glasses':{
                    ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['glasses'],
                    previousValue: cam_tools?.['glasses']?.['value'],
                    value: rand_2,
                    percent: percent_2 == Infinity ? '' : percent_2 + '%',
                    trenStatus: percent_2 == Infinity ? null : sign_2 == -1 ? 'down' : sign_2 == 1 ? 'up' : null,
                    trenIcon: percent_2 == Infinity ? null : sign_2 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_2 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
                  'earmuffs':{
                    ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['earmuffs'],
                    previousValue: temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['earmuffs']?.['value'],
                    value: rand_3,
                    percent: percent_3 == Infinity ? '' : percent_3 + '%',
                    trenStatus: percent_3 == Infinity ? null : sign_3 == -1 ? 'down' : sign_3 == 1 ? 'up' : null,
                    trenIcon: percent_3 == Infinity ? null : sign_3 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_3 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
                  // 'respirator':{
                  //   ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['respirator'],
                  //   previousValue: temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['respirator']?.['value'],
                  //   value: rand_4,
                  //   percent: percent_4 == Infinity ? '' : percent_4 + '%',
                  //   trenStatus: percent_4 == Infinity ? null : sign_4 == -1 ? 'down' : sign_4 == 1 ? 'up' : null,
                  //   trenIcon: percent_4 == Infinity ? null : sign_4 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_4 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  // },
                  'wearpack':{
                    ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['wearpack'],
                    previousValue: temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['wearpack']?.['value'],
                    value: rand_4,
                    percent: percent_4 == Infinity ? '' : percent_4 + '%',
                    trenStatus: percent_4 == Infinity ? null : sign_4 == -1 ? 'down' : sign_4 == 1 ? 'up' : null,
                    trenIcon: percent_4 == Infinity ? null : sign_4 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_4 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
                  'harness':{
                    ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['harness'],
                    previousValue: temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['harness']?.['value'],
                    value: rand_5,
                    percent: percent_5 == Infinity ? '' : percent_5 + '%',
                    trenStatus: percent_5 == Infinity ? null : sign_5 == -1 ? 'down' : sign_5 == 1 ? 'up' : null,
                    trenIcon: percent_5 == Infinity ? null : sign_5 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_5 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
                  'gloves':{
                    ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['gloves'],
                    previousValue: temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['gloves']?.['value'],
                    value: rand_6,
                    percent: percent_6 == Infinity ? '' : percent_6 + '%',
                    trenStatus: percent_6 == Infinity ? null : sign_6 == -1 ? 'down' : sign_6 == 1 ? 'up' : null,
                    trenIcon: percent_6 == Infinity ? null : sign_6 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_6 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
                  'shoes':{
                    ...temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['shoes'],
                    previousValue: temp_obj?.[`camera-${rand_cam}`]?.['tools']?.['shoes']?.['value'],
                    value: rand_7,
                    percent: percent_7 == Infinity ? '' : percent_7 + '%',
                    trenStatus: percent_7 == Infinity ? null : sign_7 == -1 ? 'down' : sign_7 == 1 ? 'up' : null,
                    trenIcon: percent_7 == Infinity ? null : sign_7 == -1 ? <ArrowDownward sx={{color:'red'}} /> : sign_7 == 1 ? <ArrowUpward sx={{color:'green'}} /> : null
                  },
              },
              time: format(new Date(),"dd MMMM yyyy hh:mm",{locale:idLocale}),
              time_real: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
              id_cam: `camera-${rand_cam}`
          }
      }

  
      setTimeout(()=>{
        // ----- Update data to "STACK CHART"
        updateToStackChart(rand_cam, rand_1, rand_2, rand_3, rand_4, rand_5, rand_6, rand_7);
  
        // ----- end Update
        
        // setSeriesStackChart
        setObjCardList({...temp_obj})

        console.log(temp_obj);

        // setTimeout(()=>{
          setDis(false);
        // },500)
        
      },900)

    }

    const handleLoadImg = (idx) => {
        let arrImageCam_Temp = [...arrImageCamera];
        arrImageCam_Temp[idx] = {...arrImageCam_Temp?.[idx], isLoading: false};

        setArrImageCamera([
          ...arrImageCam_Temp
        ]);
    }

    // modal detail info camera (event click)
    const handleClickDetailInfoCamera = (cam_id, row) => {

      setShowModalImgDetailCamera(true);

      setShowModalLoader(true);

      let tempRow = {};
      if (row){
        tempRow = {...row};
        tempRow = {...tempRow, camera_id: cam_id};
      }
      
      console.log("Temp Row");
      console.log(tempRow);

      setModalRow({...tempRow})

      setTimeout(()=>{
          setShowModalLoader(false);
      }, 500)
    }

    const modalOutChangeDetailInfoCamera = ({tipe, value, form}) => {
      if (form == 'infocamera'){
        if (tipe == 'close_modal'){
          setShowModalImgDetailCamera(value);
        }
      }
    }

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

    const handleClickInfoCard = (cam_id) => {

        setTitleImageCamera(`Camera ${cam_id}`);
        setShowImageGallery(true);

        // generate Array Image Gallery
        generateArrImageCameraFunc();
    }

    const handleClickInfoCardBack = () => {
        setShowImageGallery(false);
    }

    return (
      <>
        {/* RANDOM BUTTON */}

        {
          !showImageGallery && (

              <div className='mb-3 d-flex justify-content-start gap-3'>
                <button type="button" className='btn btn-outline-info' onClick={handleClickRandom} disabled={dis}>Random</button>

                {/* <div className='bg-info' style={{width:'100px'}}>
                  <NumberAnimate angka={objCardList?.[`camera-1`]?.['tools']?.['helmet']?.['value']} />
                </div> */}
              </div>
          )
        }
        

        {/* INFO CAMERA IMAGE GALLERY */}
        
        {
          showImageGallery && (
              <div className='ppe-card-dash-info-image'>
                  <div className='d-flex align-items-center ppe-card-dash-info-image-title'>

                      <div className='me-3'>
                          <div className='d-flex align-items-center p-1 text-white ppe-img-gallery-back'
                                onClick={handleClickInfoCardBack}
                                title="Back"
                                >
                                  
                                <ArrowBackIosNew />
                          </div>
                      </div>

                      <div className='d-flex align-items-center position-relative'>
                          <img src={CrystalGlare} className='image-glare'/>
                          {/* Camera 1, ... */}
                          <span>{titleImageCamera} </span>
                      </div>
                      
                  </div>

                  <hr style={{marginTop:'0.5rem'}}/>

                  <div className='mt-4'>
                      <div className='row px-2'>

                          {
                            arrImageCamera && arrImageCamera.length == 0 && (
                                <div key={`random-img-nodata`} className='col d-flex justify-content-center align-items-center'>
                                  <img src={NoData} height = "500" width="500"/>
                                </div>
                            )
                          }

                          <Gallery withCaption withDownloadButton options={photoSwpOpt}>
                              {
                                // new Array(Math.floor((Math.random()*10)+1)).fill(null).map((obj,idx)=>{
                                arrImageCamera.length > 0 &&
                                    arrImageCamera.map((objimg,idx)=>{
                                      return (
                                          <div key={`random-img-${idx}`} className='col-md-4 mt-0 py-1 px-1'>

                                              <div className='info-image ppe-random-img-container'>

                                                  {
                                                    arrImageCamera?.[idx]?.['isLoading'] && 
                                                      (
                                                        <div className='d-flex justify-content-center align-items-center' style={{height:'100%'}}>
                                                            {/* <ProgressBar barColor='blue' borderColor='lightblue'/> */}
                                                            <RotatingLines visible={true}
                                                                  width="96"
                                                                  strokeColor='darkcyan'
                                                                  animationDuration='0.75'
                                                            />
                                                        </div>

                                                      )
                                                  }

                                                  {
                                                      <div style={{
                                                                  height:'100%', 
                                                                  display: arrImageCamera?.[idx]?.['isLoading'] ? 'none':'block' }}>
                                                          {/* BANNER TOP */}
                                                            <div className='d-flex justify-content-end align-items-center ppe-random-img-banner'>
                                                                <div className='ppe-random-img-detail-text' onClick={()=>handleClickDetailInfoCamera(idx, arrImageCamera?.[idx])}> Detail </div>

                                                                {/* show Modal Detail Info */}
                                                                <ModalDetailInfoCamera 
                                                                      par_show={showModalImgDetailCamera} 
                                                                      par_statusLoader={showModalLoader}
                                                                      row = {modalRow}
                                                                      title={"Detail Info"}
                                                                      status = {"Detail"}
                                                                      outChange={modalOutChangeDetailInfoCamera}/>
                                                            </div>

                                                            <Item 
                                                                  key={`random-item-img-${idx}`} 
                                                                  original={`${objimg?.['url']}`}
                                                                  thumbnail={`${objimg?.['url']}`}
                                                                  width="1400"
                                                                  height="500"
                                                                  caption={`<div class="d-flex justify-content-center flex-column align-items-center" 
                                                                                  style="position:relative; margin-top:-80px; background-color:rgba(0,0,0,0.2)">

                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                  <div style="position:relative; width:250px; height:1px; background-color:white"></div> 
                                                                                  <div class="px-2">Gambar ${idx+1}</div> 
                                                                                  <div style="position:relative; width:250px; height:1px; background-color:white"></div> 
                                                                                </div>

                                                                                <div class="row">
                                                                                  <div class="col-4"> Helmet : ${objimg?.['tools']?.['helmet']}</div>
                                                                                  <div class="col-4"> Glasses : ${objimg?.['tools']?.['glasses']}</div>
                                                                                  <div class="col-4"> Ear muffs : ${objimg?.['tools']?.['earmuffs']}</div>
                                                                                  <div class="col-4"> Gloves : ${objimg?.['tools']?.['gloves']}</div>
                                                                                  <div class="col-4"> Wearpack : ${objimg?.['tools']?.['wearpack']}</div>
                                                                                  <div class="col-4"> Harness : ${objimg?.['tools']?.['harness']}</div>
                                                                                  <div class="col-4"> Shoes : ${objimg?.['tools']?.['shoes']}</div>
                                                                                </div>
                                                                            </div>
                                                                          `}
                                                                  
                                                            >
                                                                {({ref, open})=>(
                                                                  <img ref={ref} onClick={open} 
                                                                        onLoad={()=>handleLoadImg(idx)}
                                                                        src={`${objimg?.['url']}`} width={'100%'} height={'100%'} />
                                                                )}
                                                            </Item>


                                                            {/* <img src={`${objimg?.['url']}`} onLoad={()=>handleLoadImg(idx)} width={'100%'} height={'100%'} /> */}

                                                            {/* <img src={`https://picsum.photos/2000/${Math.floor((Math.random()*401)+400)}`} width={'100%'} height={200} /> */}
                                                      </div>
                                                  }

                                              </div>
                                          </div>
                                      )
                                    })
                              }

                          </Gallery>

                      </div>
                  </div>
              </div>
          )
        }

        {
          !showImageGallery && (
            <>
              {/* BLOK CARD TOP */}
              <div className={`ppe-card-dash-top ${isDragging ? 'isDragging' : ''}`}
                  onMouseDown={handleMouseDownCardContainer}
                  onMouseMove={handleMouseMoveCardContainer}
                  onMouseLeave={handleMouseUpCardContainer}
                  onMouseUp={handleMouseUpCardContainer}
                  ref={containerRefCard}>
                  {
                    // Array.from({length:totalCamera}).map((obj,idx)=>{
                    Object.keys(objCardList).map((obj, idx)=>{
                      return (
                          <div className='ppe-card-dash-top-sub' key={idx}>
                              <Card className={`ppe-card-dash-main ppe-card-idx-${idx}`}>
                                  <Card.Body className=''>
                                      {/* Blok ke-1 */}
                                      <div className='d-flex'>
                                          {/* 2 variabel ppe on top */}
                                          <div className='ppe-card-dash-tools w-100 ' 
                                                  // style={{flex:2}}
                                          >

                                            <div className='row'>

                                                <div className = 'col-4'>
                                                    <div className='text-center d-flex flex-column align-items-center'>
                                                        <div className='ppe-card-dash-subtools-subject mb-2'>Helmet</div>

                                                        {/* <h5 className='ppe-card-dash-subtools-number'>190</h5> */}

                                                        <div className='ppe-card-dash-subtools-number'>

                                                              {
                                                                  // null
                                                                  objCardList?.[`camera-${idx+1}`]?.['tools']?.['helmet']?.['value'] == null && (
                                                                    <span>-</span> 
                                                                  )
                                                              }

                                                              {
                                                                  // value exists
                                                                  objCardList?.[`camera-${idx+1}`]?.['tools']?.['helmet']?.['value'] != null && (
                                                                    
                                                                    <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['helmet']?.['value']} />
                                                                    // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['helmet']?.['value']}</div>
                                                                  )
                                                              }

                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div className = 'col-4'>
                                                    <div className='text-center d-flex flex-column align-items-center'>
                                                        <div className='ppe-card-dash-subtools-subject mb-2'>Glasses</div>

                                                        <div className='ppe-card-dash-subtools-number'>
                                                              {
                                                                  // null
                                                                  objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value'] == null && (
                                                                    <span>-</span> 
                                                                  )
                                                              }

                                                              {
                                                                  // value exists
                                                                  objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value'] != null && (
                                                                    <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value']} />
                                                                    // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value']}</div>
                                                                  )
                                                              }
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>

                                            
                                          </div>
                                          {/* ... {end 2 variabel ppe on top} */}

                                          {/* gambar dan id camera */}
                                          <div className='w-25' style={{position:'absolute', top:'10px', right:'15px'}}
                                                >
                                              <div className='ppe-card-dash-idcamera'>
                                                  {idx+1}
                                              </div>

                                              <div className='ppe-card-dash-iconcamera' 
                                                  // style={{flex:1, opacity:'0.7', position:'relative', top:'-20px', right:'-35px'}}
                                              >
                                                  {
                                                    svgCustom('cctv-2','',80)
                                                  }
                                              </div>

                                          </div>
                                      </div>

                                      {/* Blok ke-2 */}
                                      <div className='d-flex justify-content-end' onClick={()=>handleClickInfoCard(idx+1)}>
                                          <div className='ppe-card-dash-idcamera-info'>Info</div>
                                      </div>

                                      <hr style={{color:'grey',border:'1px solid white', margin:0}} />

                                      <div className='d-flex mt-1'>

                                          <div className='ppe-card-dash-tools w-100'>
                                                
                                              <div className='w-100'>
                                                  <table className='w-100' style={{borderCollapse:'collapse'}}>
                                                      <thead style={{borderBottom:'1px solid rgba(255,255,255,0)'}}>
                                                          <tr className='' style={{paddingBottom:'100px'}}>
                                                            <th className='ppe-card-dash-subtools-subject' style={{borderRight:'1px solid rgba(255,255,255,0.5)', paddingBottom:'10px', paddingTop:'10px', width:'33.33%',verticalAlign:'middle', textAlign:'center'}}><span>Ear Muffs</span></th>
                                                            <th className='ppe-card-dash-subtools-subject' style={{borderRight:'1px solid rgba(255,255,255,0.5)', width:'33.33%', verticalAlign:'middle', textAlign:'center'}}><span>Glasses</span></th>
                                                            <th className='ppe-card-dash-subtools-subject' style={{width:'33.33%', verticalAlign:'middle', textAlign:'center'}}><span>Wearpack</span></th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr>
                                                            <td style={{borderRight:'1px solid rgba(255,255,255,0.5)', width:'33.33%'}}>
                                                                  <div className='d-flex justify-content-center align-items-center ppe-card-dash-subtools-number'>
                                                                    {
                                                                        // null
                                                                        objCardList?.[`camera-${idx+1}`]?.['tools']?.['earmuffs']?.['value'] == null && (
                                                                          <span>-</span> 
                                                                        )
                                                                    }

                                                                    {
                                                                        // value exists
                                                                        objCardList?.[`camera-${idx+1}`]?.['tools']?.['earmuffs']?.['value'] != null && (
                                                                          <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['earmuffs']?.['value']} />
                                                                          // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['earmuffs']?.['value']}</div>
                                                                        )
                                                                    }
                                                                  </div>
                                                            </td>
                                                            <td style={{borderRight:'1px solid rgba(255,255,255,0.5)', width:'33.33%'}}>
                                                                  <div className='d-flex justify-content-center align-items-center ppe-card-dash-subtools-number'>
                                                                      {
                                                                          // null
                                                                          objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value'] == null && (
                                                                            <span>-</span> 
                                                                          )
                                                                      }

                                                                      {
                                                                          // value exists
                                                                          objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value'] != null && (
                                                                            <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value']} />
                                                                            // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['glasses']?.['value']}</div>
                                                                          )
                                                                      }
                                                                  </div>
                                                            </td>
                                                            <td style={{width:'33.33%'}}>
                                                                  <div className='d-flex justify-content-center align-items-center ppe-card-dash-subtools-number'>
                                                                      {
                                                                          // null
                                                                          objCardList?.[`camera-${idx+1}`]?.['tools']?.['wearpack']?.['value'] == null && (
                                                                            <span>-</span> 
                                                                          )
                                                                      }

                                                                      {
                                                                          // value exists
                                                                          objCardList?.[`camera-${idx+1}`]?.['tools']?.['wearpack']?.['value'] != null && (
                                                                            <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['wearpack']?.['value']} />
                                                                            // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['wearpack']?.['value']}</div>
                                                                          )
                                                                      }
                                                                  </div>
                                                            </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>

                                              {/* <div className='col-4 text-center d-flex flex-column align-items-center'>
                                                <div className='ppe-card-dash-subtools-subject mb-2'>Ear Muffs</div>

                                                <div className='ppe-card-dash-subtools-number'>
                                                      <NumberAnimate angka={objCam?.[idx+1]} />
                                                </div>
                                              </div>

                                              <div className='col-4 text-center d-flex flex-column align-items-center'>
                                                <div className='ppe-card-dash-subtools-subject mb-2'>Respirator</div>

                                                <div className='ppe-card-dash-subtools-number'>
                                                      <NumberAnimate angka={objCam?.[idx+1]} />
                                                </div>
                                              </div>

                                              <div className='col-4 text-center d-flex flex-column align-items-center'>
                                                <div className='ppe-card-dash-subtools-subject mb-2'>Wearpack</div>

                                                <div className='ppe-card-dash-subtools-number'>
                                                      <NumberAnimate angka={objCam?.[idx+1]} />
                                                </div>
                                              </div> */}
                                          </div>

                                      </div>
                                      {/* ... {end blok ke-2} */}


                                      {/* Blok ke-3 */}
                                      <div className='d-flex mt-3'>

                                          <div className='ppe-card-dash-tools w-100'>

                                              <div className='w-100'>
                                                  <table className='w-100' style={{borderCollapse:'collapse'}}>
                                                      <thead style={{borderBottom:'1px solid rgba(255,255,255,0)',borderTop:'1px solid rgba(255,255,255,0)'}}>
                                                          <tr >
                                                            <th className='ppe-card-dash-subtools-subject' style={{borderRight:'1px solid rgba(255,255,255,0.5)',  width:'33.33%',verticalAlign:'middle', textAlign:'center'}}><span>Safety Harness</span></th>
                                                            <th className='ppe-card-dash-subtools-subject' style={{borderRight:'1px solid rgba(255,255,255,0.5)', width:'33.33%', verticalAlign:'middle', textAlign:'center'}}><span>Gloves</span></th>
                                                            <th className='ppe-card-dash-subtools-subject' style={{width:'33.33%', verticalAlign:'middle', textAlign:'center'}}><span>Safety Shoes</span></th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr>
                                                            <td style={{paddingTop:'10px', borderRight:'1px solid rgba(255,255,255,0.5)', width:'33.33%'}}>
                                                                <div className='d-flex justify-content-center align-items-center ppe-card-dash-subtools-number'>
                                                                      {
                                                                          // null
                                                                          objCardList?.[`camera-${idx+1}`]?.['tools']?.['harness']?.['value'] == null && (
                                                                            <span>-</span> 
                                                                          )
                                                                      }

                                                                      {
                                                                          // value exists
                                                                          objCardList?.[`camera-${idx+1}`]?.['tools']?.['harness']?.['value'] != null && (
                                                                            <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['harness']?.['value']} />
                                                                            // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['harness']?.['value']}</div>
                                                                          )
                                                                      }
                                                                </div>
                                                            </td>
                                                            <td style={{paddingTop:'10px', borderRight:'1px solid rgba(255,255,255,0.5)', width:'33.33%'}}>
                                                                    <div className='d-flex justify-content-center align-items-cente ppe-card-dash-subtools-number'>
                                                                          {
                                                                              // null
                                                                              objCardList?.[`camera-${idx+1}`]?.['tools']?.['gloves']?.['value'] == null && (
                                                                                <span>-</span> 
                                                                              )
                                                                          }

                                                                          {
                                                                              // value exists
                                                                              objCardList?.[`camera-${idx+1}`]?.['tools']?.['gloves']?.['value'] != null && (

                                                                                <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['gloves']?.['value']} />
                                                                                // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['gloves']?.['value']}</div>
                                                                              )
                                                                          }
                                                                    </div>
                                                            </td>

                                                            <td style={{paddingTop:'10px', width:'33.33%'}}>
                                                                  <div className='d-flex justify-content-center align-items-center ppe-card-dash-subtools-number'>
                                                                          {
                                                                              // null
                                                                              objCardList?.[`camera-${idx+1}`]?.['tools']?.['shoes']?.['value'] == null && (
                                                                                <span>-</span> 
                                                                              )
                                                                          }

                                                                          {
                                                                              // value exists
                                                                              objCardList?.[`camera-${idx+1}`]?.['tools']?.['shoes']?.['value'] != null && (
                                                                                <NumberAnimate angka={objCardList?.[`camera-${idx+1}`]?.['tools']?.['shoes']?.['value']} />
                                                                                // <div>{objCardList?.[`camera-${idx+1}`]?.['tools']?.['shoes']?.['value']}</div>
                                                                              )
                                                                          }
                                                                  </div>
                                                            </td>
                                                          </tr>

                                                      </tbody>
                                                  </table>
                                              </div>

                                              {/* <div className='col-4 text-center d-flex flex-column align-items-center justify-content-center'>
                                                <div className='ppe-card-dash-subtools-subject mb-2'>Safety Harness</div>

                                                <div className='ppe-card-dash-subtools-number'>
                                                      <NumberAnimate angka={objCam?.[idx+1]} />
                                                </div>
                                              </div>

                                              <div className='col-4 text-center d-flex flex-column align-items-center justify-content-center'>
                                                <div className='ppe-card-dash-subtools-subject mb-2'>Gloves</div>

                                                <div className='ppe-card-dash-subtools-number'>
                                                      <NumberAnimate angka={objCam?.[idx+1]} />
                                                </div>
                                              </div>

                                              <div className='col-4 text-center d-flex flex-column align-items-center justify-content-center'>
                                                <div className='ppe-card-dash-subtools-subject mb-2'>Safety Shoes</div>

                                                <div className='ppe-card-dash-subtools-number'>
                                                      <NumberAnimate angka={objCam?.[idx+1]} />
                                                </div>
                                              </div> */}
                                          </div>

                                      </div>
                                      {/* ... {end blok ke-2} */}

                                  </Card.Body>
                                  <Card.Footer>
                                      <div className='d-flex justify-content-between align-items-center'>
                                          <div>
                                              <AccessTime sx={{fontSize:'17px'}} /> 
                                              <span className='ms-2 ppe-card-footer-datetime'>{objCardList?.[`camera-${idx+1}`]?.['time']} </span>
                                          </div>
                                          <div className='ppe-card-footer-cam'>
                                            Camera {idx+1}
                                          </div>
                                      </div>

                                  </Card.Footer>
                              </Card>
                          </div>
                      )

                    })
                  }
              </div>

              {/* BLOK ROW-2 STACK CHART - CARD LIST */}
              <div className='mt-3'>
                  <div className='row ppe-dash-main-blok2'>

                      <div className='col col-md-8'>
                          <ReactApexChart 
                                ref={chartListRef}
                                options={{...optStackChart}}
                                series={seriesStackChart}
                                type="bar"
                                height={500}
                                
                                />
                      </div>

                      {/* CARD LIST */}
                      <Card className='col-md-4 ppe-card-list-group ppe-card-list-group-fullblock'
                            ref={containerRefListCard}
                            onMouseDown={handleMouseDownListCard}
                            onMouseMove={handleMouseMoveListCard}
                            onMouseUp={handleMouseUpListCard}
                            onMouseLeave={handleMouseUpListCard}
                      >
                          {
                            Object.keys(objCardList).map((obj,idx)=>{
                              return (
                                  <div key={`card-list-${idx}`}>
                                      <Card.Header>
                                          {objCardList?.[obj]?.['label']}
                                      </Card.Header>
                                      <Card.Body>
                                          {
                                            Object.keys(objCardList?.[obj]?.['tools']).map((obj2, idx2)=>{
                                              return (
                                                  <div  key={`card-list-tools-${idx2}`} 
                                                      className={`d-flex gap-3 ${idx2 != 0 ? 'mt-3' : 'mt-1'}`}>

                                                      <div className='d-flex align-items-center'>
                                                          
                                                          {objCardList?.[obj]?.['tools']?.[obj2]?.['avatarIcon']}
                                                          {/* <Avatar src={objCardList?.[obj]?.['tools']?.[obj2]} sx={{bgcolor:teal["200"]}} /> */}

                                                      </div>
                                                      <div className='d-flex justify-content-between w-100'>
                                                          <div className='d-flex flex-column ppe-card-list-side-left'>
                                                              <span className='ppe-card-list-group-title'> {objCardList?.[obj]?.['tools']?.[obj2]?.['label']} </span>
                                                              <div className='ppe-card-list-group-subtitle'><span> Previous : {objCardList?.[obj]?.['tools']?.[obj2]?.['previousValue'] ?? '-'} </span></div>
                                                          </div>

                                                          <div className={`d-flex flex-column flex-md-row align-items-center gap-1 ppe-card-list-side-right
                                                                            ${objCardList?.[obj]?.['tools']?.[obj2]?.['trenStatus'] ? '':'justify-content-md-center'} 
                                                                            ${objCardList?.[obj]?.['tools']?.[obj2]?.['trenStatus'] ? '':'pe-4'}
                                                                        `}
                                                                  // style={{
                                                                          // width: objCardList?.[obj]?.['tools']?.[obj2]?.['trenStatus'] ? 'auto': 
                                                                          //         window.innerWidth > 767 ? '110px' : '82px' 
                                                                        // }}
                                                          >

                                                              {/* Value Camera */}
                                                              <div className='d-flex align-items-center ppe-card-list-side-right-value me-1' style={{width:'auto'}}>
                                                                  {
                                                                      objCardList?.[obj]?.['tools']?.[obj2]?.['value'] && (

                                                                        <NumberAnimate angka={objCardList?.[obj]?.['tools']?.[obj2]?.['value']} propStyle = {{textColor:'blueviolet'}} />
                                                                        // <div>{objCardList?.[obj]?.['tools']?.[obj2]?.['value']}</div>
                                                                      )
                                                                  }

                                                                  {/* jika 'null' pada value maka show '-' */}
                                                                  {
                                                                    objCardList?.[obj]?.['tools']?.[obj2]?.['value'] == null && (
                                                                      <span>-</span>
                                                                    )
                                                                  }
                                                              {/* {objCardList?.[obj]?.['tools']?.[obj2]?.['value']} */}
                                                              </div>
                                                              {/* <label className='ppe-card-list-side-right-value me-1 me-md-3'>
                                                                  70
                                                              </label> */}

                                                              <div className='d-flex justify-content-start align-items-center gap-1 ppe-card-list-side-right-icon-badge' 
                                                                      style={{width: objCardList?.[obj]?.['tools']?.[obj2]?.['trenStatus'] ? '80px' : '0' }}>
                                                                  {/* <ArrowUpward sx={{color:'green'}} /> */}
                                                                  {objCardList?.[obj]?.['tools']?.[obj2]?.['trenIcon']}
                                                                  
                                                                  {
                                                                    objCardList?.[obj]?.['tools']?.[obj2]?.['trenStatus'] == 'up' && 
                                                                    (
                                                                        <div className='d-flex align-items-center justify-content-center ppe-card-list-side-right-percent-up'>
                                                                            <span className='percent-up-number'>{objCardList?.[obj]?.['tools']?.[obj2]?.['percent']}</span>
                                                                        </div>
                                                                    )
                                                                  }
                                                                  {
                                                                    objCardList?.[obj]?.['tools']?.[obj2]?.['trenStatus'] == 'down' && 
                                                                    (
                                                                        <div className='d-flex align-items-center justify-content-center ppe-card-list-side-right-percent-down'>
                                                                            <span className='percent-up-number'>{objCardList?.[obj]?.['tools']?.[obj2]?.['percent']}</span>
                                                                        </div>
                                                                    )
                                                                  }
                                                              </div>


                                                              {/* <ArrowDownward sx={{color:'red'}} />
                                                              <div className='d-flex align-items-center justify-content-center ppe-card-list-side-right-percent-down'>
                                                                  <span className='percent-up-number'>100%</span>
                                                              </div> */}
                                                          </div>
                                                      </div>
                                                  </div>
                                              )
                                            })
                                          }
                                      </Card.Body>
                                  </div>
                              )
                            })
                          }

                          {/* GLASSES */}
                          {/* <div className='d-flex gap-3 mt-2'>
                              <div className='d-flex align-items-center'>

                                  <Avatar src={Glasses} sx={{bgcolor:lightGreen["200"]}} />

                              </div>
                              <div className='d-flex justify-content-between w-100'>

                                  <div className='d-flex flex-column ppe-card-list-side-left'>
                                      <span className='ppe-card-list-group-title'> Glasses </span>
                                      <div className='ppe-card-list-group-subtitle'><span> Previous : 50 </span></div>
                                  </div>

                                  <div className='d-flex flex-column flex-md-row align-items-center gap-1 ppe-card-list-side-right'>

                                      <div className='ppe-card-list-side-right-value me-1' style={{width:'auto'}}>
                                          25
                                      </div>

                                      <ArrowUpward sx={{color:'green', fontSize:'24px', fontWeight:'700'}} />
                                      <div className='d-flex align-items-center justify-content-center ppe-card-list-side-right-percent-up'>
                                          <span className='percent-up-number'>5%</span>
                                        </div>
                                      <div className='d-flex justify-content-start align-items-center gap-1 ppe-card-list-side-right-icon-badge' style={{width:'80px'}}>
                                          <ArrowDownward sx={{color:'red'}} />
                                          <div className='d-flex align-items-center justify-content-center ppe-card-list-side-right-percent-down'>
                                              <span className='percent-up-number'>100%</span>
                                          </div>
                                      </div>

                                  </div>
                              </div>
                          </div> */}

                      </Card>
                  </div>
              </div>

              {/* Area Camera Per Timeline */}
              <div className='mt-3'>
                
                  <div className='row'>
                      {

                        totalCamera > 0 && 
                          (
                            new Array(totalCamera).fill(null).map((num, idx)=>{
                                return (
                                    <div key={`time-camera-${idx}`} className={`col-12 mt-1 ${((idx+1) == totalCamera && ((idx+1)%2==1)) ? 'col-md-12' : 'col-md-6'}`}>
                                        <AreaCamera objCardList={objCardList?.[`camera-${idx+1}`]} title={`Camera ${idx+1}`}/>
                                    </div>
        
                                )
                            })
                          )
                      }

                  </div>

                  {/* <div className='row'>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-1']} title={'Camera 1'}/>
                      </div>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-2']} title={'Camera 2'}/>
                      </div>
                  </div>
                  <div className='row'>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-3']} title={'Camera 3'}/>
                      </div>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-4']} title={'Camera 4'}/>
                      </div>
                  </div>
                  <div className='row'>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-5']} title={'Camera 5'}/>
                      </div>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-6']} title={'Camera 6'}/>
                      </div>
                  </div>
                  <div className='row'>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-7']} title={'Camera 7'}/>
                      </div>
                      <div className='col-12 col-md-6 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-8']} title={'Camera 8'}/>
                      </div>
                  </div>
                  <div className='row'>
                      <div className='col-12 col-md-12 mt-1'>
                          <AreaCamera objCardList={objCardList?.['camera-9']} title={'Camera 9'}/>
                      </div>
                  </div> */}

                  {/* <div className='mb-3 d-flex justify-content-start'>
                    <button type="button" className='btn  btn-outline-info' onClick={handleClickRandom} disabled={dis}>Random</button>
                  </div> */}
              </div>

            </>
          )
        }

        <ToastContainer 
          draggable
          pauseOnHover
        />

      </>
    )
}

export default DashboardMain

// © Gunardi Halim