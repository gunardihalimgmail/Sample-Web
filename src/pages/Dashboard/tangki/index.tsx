import React, { createRef, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print'
// import ReactExport from 'react-export-excel-xlsx-fix'
import ReactExport from 'react-export-excel-xlsx-fix'
import Switch from 'react-switch'
import _ from 'lodash'

// amCharts
import * as am5 from "@amcharts/amcharts5";
import * as am5xy  from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// ... end amCharts

// import FusionCharts from 'fusioncharts';
// import Charts from 'fusioncharts/fusioncharts.charts';
// // import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
// import ReactFC from 'react-fusioncharts';

import FusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
// import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
// import gammel from 'fusioncharts/themes/fusioncharts.theme.gammel';


import './DashTangki.scss'
import Icon from '@mdi/react';
import { mdiHome, mdiChartLine, mdiOrnament, mdiGradientHorizontal, mdiThumbsUpDown, mdiConsoleNetworkOutline, mdiFolderHome, mdiViewDashboard, mdiViewDashboardVariant, mdiMonitorDashboard, mdiChartAreaspline, mdiChartAreasplineVariant, mdiChartDonutVariant, mdiChartBarStacked, mdiCogSyncOutline, mdiCommentSearchOutline, mdiInformation, mdiInformationOutline, mdiCogOutline, mdiContentSaveMoveOutline } from '@mdi/js';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import Card from 'react-bootstrap/esm/Card';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import { BlueWavyCurve, CardHeadingBootstrap, CuteArrow, Img_Facebook, MotionSensor, MotionSensorRed, No_Found, PassPNG, SVG_Circle, Tank, TermSensor, Thermometer, UserPNG, WarningIcon, WeightTank } from '../../../assets'
import ReactApexChart from 'react-apexcharts';

import ThermometerFC from '../thermometer';
import CylinderFC from '../cylinder';

import { formatDate, notify, postApi, postApiSync, getApiSync, 
          encryptCode, generateExpiredDate, URL_API_LiVE, URL_API_IOT_LIVE, joinWithCommaNSuffixAnd, handleLogOutGlobal } from '../../../services/functions';

import { ApexOptions } from 'apexcharts';

import { Audio, Blocks, Dna, Grid, ThreeCircles } from  'react-loader-spinner'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import DatePicker from "react-datepicker";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
// import TimeRange from 'react-time-range';
import moment from 'moment';
// import { Form } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Dropdown from "react-bootstrap/Dropdown";

import tangki_1_json from '../../../data/volume_tangki/tangki_1.json'
import tangki_2_json from '../../../data/volume_tangki/tangki_2.json'
import tangki_3_json from '../../../data/volume_tangki/tangki_3.json'
import tangki_4_json from '../../../data/volume_tangki/tangki_4.json'
import tangki_5_json from '../../../data/volume_tangki/tangki_5.json'
import tangki_6_json from '../../../data/volume_tangki/tangki_6.json'
import tangki_7_json from '../../../data/volume_tangki/tangki_7.json'
import tangki_8_json from '../../../data/volume_tangki/tangki_8.json'
import tangki_9_json from '../../../data/volume_tangki/tangki_9.json'
import tangki_10_json from '../../../data/volume_tangki/tangki_10.json'
import tangki_11_json from '../../../data/volume_tangki/tangki_11.json'
import tangki_12_json from '../../../data/volume_tangki/tangki_12.json'
import tangki_13_json from '../../../data/volume_tangki/tangki_13.json'
import tangki_14_json from '../../../data/volume_tangki/tangki_14.json'
import tangki_15_json from '../../../data/volume_tangki/tangki_15.json'

import berat_jenis_cpo_json from '../../../data/volume_tangki/berat_jenis_cpo.json'
import berat_jenis_pko_json from '../../../data/volume_tangki/berat_jenis_pko.json'
import berat_jenis_cpo_task1_json from '../../../data/volume_tangki/berat_jenis_cpo_task1.json'
import berat_jenis_pko_task1_json from '../../../data/volume_tangki/berat_jenis_pko_task1.json'

import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faOilWell, faUser, faPersonRunning, faUserPlus, faKey, faClone, faAdd, faClose, faAppleAlt, faCompass, faRoute, faMap, faMapLocationDot, faBuilding, faBuildingUser, faPenToSquare  } from '@fortawesome/free-solid-svg-icons';
import { createSearchParams, Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import * as CryptoJS from 'crypto-js'
import { EventEmitter } from 'stream';
import { findAllInRenderedTree } from 'react-dom/test-utils';
import { FloatingMenu, Directions, MainButton, ChildButton, ChildButtonProps } from 'react-floating-button-menu';
import { MultiSelect } from 'react-multi-select-component';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { NumericFormat, PatternFormat } from 'react-number-format';

import ExcelJS from 'exceljs';
import { Session } from 'inspector';
import HamburgerMenu from '../../layout/features/hamburgerMenu';
import NumberAnimate from '../../../components/atoms/numberAnimate';


// ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme)
// ReactFC.fcRoot(FusionCharts, thermometer);

ReactFC.fcRoot(FusionCharts, Widgets, charts);

charts(FusionCharts);

// column 3d

const dataSource = {
  chart: {
    // caption: "Countries with Highest Deforestation Rate",
    // subcaption: "For the year 2017",
    // yaxisname: "Deforested Area{br}(in Hectares)",
    thmFillColor: "#ff0000",
    decimals: "9",
    theme: "fusion"
  },
  data: [
    {
      label: "Brazil",
      value: "1466000"
    },
    {
      label: "Indonesia",
      value: "1147800"
    },
    {
      label: "Russian Federation",
      value: "532200"
    },
    {
      label: "Mexico",
      value: "395000"
    },
    {
      label: "Papua New Guinea",
      value: "250200"
    },
    {
      label: "Peru",
      value: "224600"
    },
    {
      label: "U.S.A",
      value: "215200"
    },
    {
      label: "Bolivia",
      value: "135200"
    },
    {
      label: "Sudan",
      value: "117807"
    },
    {
      label: "Nigeria",
      value: "82000"
    },

  ]
};
// ... <end> column 3d

;

class PanggilToast extends React.Component { 
  render(){
    return (
      <div style={{color:'red'}}>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit dignissimos soluta sapiente consectetur ad temporibus. Necessitatibus, eius minus placeat fuga sed enim aliquid molestias totam consectetur aut? Itaque perferendis quia ratione consectetur explicabo! Eum dolorum molestiae, animi, soluta quo temporibus accusantium magnam itaque consequuntur autem, minima quasi optio esse. Sunt nihil ex, sit tenetur, quasi nobis hic officiis earum reprehenderit animi harum, quos cumque unde incidunt eaque corporis provident ipsum ea quisquam natus laborum. Ut hic expedita sequi! Deserunt, dolorum aperiam! Maiores, est molestias neque nisi ipsa, consequuntur necessitatibus maxime numquam ut inventore quis similique dolorem repellat minima. Placeat, expedita. </div>
      </div>
    )
  }
}

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const animatedComponents = makeAnimated();

class DashboardTangki extends React.Component {
    
    intervalBox:any;  // object {} 

    user_title:any = '';
    user_level:any = '';  // kondisi awal set ke "", agar menu create user di non aktifkan terlebih dahulu jika account user yang login

    total_cpo:any = '0%'
    total_pko:any = '0%'

    data_Export:any = [];
    
    componentRef:any;

    global_arr_id_device:any[] = []; // ['TANK12_HP_PAMALIAN', 'TANK34_HP_PAMALIAN']

    // REF 
    refScroll_Card:any;
    refScroll_Tinggi:any;
    refScroll_Suhu:any;
    refScroll_Volume:any;
    // ... end REF

    // FOR FOCUS INPUT
    userNameInput:any;
    passwordInput:any;
    tanggalInput:any;
    refCompanyInput:any;
  
    chart:any; // untuk Chart Tinggi isi (AM Chart)

    root:any;
    chart_amColumn3d:any;

    getFirstTangki_Default:any = {};

    arr_tangki_last_from_dataHour:any = {};

  // ARRAY CPO & PKO berdasarkan tanggal berlaku
    arr_cpo_pko = [
      {name: 'tangki_1', jenis:'CPO', datebegin:'1970-01-01 00:00', datelast:'2023-02-20 23:59'},
      {name: 'tangki_1', jenis:'PKO', datebegin:'2023-02-21 00:00', datelast:''},

      {name: 'tangki_2', jenis:'PKO', datebegin:'1970-01-01 00:00', datelast:''},

      {name: 'tangki_3', jenis:'CPO', datebegin:'1970-01-01 00:00', datelast:'2023-01-27 23:59'},
      {name: 'tangki_3', jenis:'PKO', datebegin:'2023-01-28 00:00', datelast:'2023-02-03 23:59'},
      {name: 'tangki_3', jenis:'CPO', datebegin:'2023-02-04 00:00', datelast:''},

      {name: 'tangki_4', jenis:'CPO', datebegin:'1970-01-01 00:00', datelast:''},
    ]

    statusChecked:any = {
      jarak_sensor: true,
      tinggi: true,
      tinggi_modus: true,
      suhu: true,
      suhu_modus: true,
      suhu_tinggi: true,
      volume: true
    }
    
    options_filter:any = [
      { value: 'date', label: 'Date' },
      { value: 'time', label: 'Date Time' }
    ];

    options_filter_company:any = [
      // { label: 'PT. TASK 3', value: 1},
      // { label: 'PT. Task 1', value: 'task1'},
      // { label: 'PT. Dermaga Utama 1', value: 'du1'},
      // { label: 'PT. Dermaga Utama 2', value: 'du2'},
      // { label: 'PT. Dermaga Utama 3', value: 'du3'},
      // { label: 'PT. Dermaga Utama 4', value: 'du4'},
      // { label: 'PT. Dermaga Utama 5', value: 'du5'},
      // { label: 'PT. Dermaga Utama 6', value: 'du6'},
      // { label: 'PT. Dermaga Utama 7', value: 'du7'},
      // { label: 'PT. Dermaga Utama 8', value: 'du8'},
    ];
    options_filter_company_createuser:any = [];
    options_filter_company_updateusercompany:any = [];

    tanggal_max_tangki_last:any;
    // data JSON API
    arr_json_alldata:any = [];
    arr_json_tangki_last:any = {};
    arr_date_realtime:any = [];
    // ... <end>

    props:any;

    // master tinggi maksimal setiap tangki (volume maks)'
    mst_t_max:any;
    // mst_t_max = {
    //   'tangki_1': 5406469,
    //   'tangki_2': 5883034,
    //   'tangki_3': 6375939,
    //   'tangki_4': 6386468
    // }

    // satuan meter (not use)
    mst_t_lubang_ukur:any = {
      'tangki_1':12.890,
      'tangki_2':12.856,
      'tangki_3':13.173,
      'tangki_4':13.183
    };

    // hitung tinggi minyak (not use)
    mst_t_tangki:any;
    // mst_t_tangki:any = {
      // 'tangki_1':12.483,
      // 'tangki_2':12.489,
      // 'tangki_3':12.830,
      // 'tangki_4':12.827,
    // }

      // konstanta tinggi segitiga di atas tinggi tangki
      // new => rata-rata sampai 24 Jan '23 - 10 feb 2023

    // mst_avg_t_segitiga:any = {
    //   'tangki_1':0.4030,   // 0.49629, 0.4030 (prev old -> new) tgl 21 feb '23
    //   'tangki_2':0.6946,   // 0.71348, 0.70074, 0.69876, 0.69818, 0.69460, 0,6917, 0.6946 (prev) => TGL DIPAKAI *10 FEB - 21 FEB '23
    //   'tangki_3':0.4890,   // 0.54700, 0.48733, 0.48870, 0.4890  (prev) => TGL DIPAKAI *10 FEB '23 - 16 FEB '23
    //   'tangki_4':0.4734,   // 0.47460, 0.47229, 0.46792, 0.47070, 0.46650, 0.4708, 0.4734 (prev) => TGL DIPAKAI *10 feb '23 - 16 feb '23
    // }

    // Tinggi Profile
    // tangki_1 : 12.9016
    // tangki_2 : 13.1922
    // tangki_3 : 13.3218
    // tangki_4 : 13.2852

    mst_t_profile:any = {
      // 'tangki_1' : 12.9016,
      // 'tangki_2' : 13.1922,
      // 'tangki_3' : 13.3218,
      // 'tangki_4' : 13.2852
    }
    
    // TINGGI DELTA (not use)
    mst_avg_t_segitiga:any;
    // mst_avg_t_segitiga:any = {
      // 'tangki_1':0.4186,   // 0.49629, 0.4030 (prev old -> new) tgl 21 feb '23
      // 'tangki_2':0.7032,   // 0.71348, 0.70074, 0.69876, 0.69818, 0.69460, 0,6917, 0.6946 (prev) => TGL DIPAKAI *10 FEB - 21 FEB '23
      // 'tangki_3':0.4918,   // 0.54700, 0.48733, 0.48870, 0.4890  (prev) => TGL DIPAKAI *10 FEB '23 - 16 FEB '23
      // 'tangki_4':0.4582,   // 0.47460, 0.47229, 0.46792, 0.47070, 0.46650, 0.4708, 0.4734 (prev) => TGL DIPAKAI *10 feb '23 - 16 feb '23
    // }

    mst_t_kalibrasi:any;
    // mst_t_kalibrasi:any = {
    //   'tangki_1':1370,
    //   'tangki_2':1370,
    //   'tangki_3':1370,
    //   'tangki_4':1370,
    // }

    // MASTER CPO / PKO BERDASARKAN KETINGGIAN 1 M
    // PRIORITAS 2 (BY TINGGI 1 M)
    mst_1m_cpo_pko:any;
    // mst_1m_cpo_pko:any = {
    //   'tangki_1': '',  // PKO
    //   'tangki_2': '',  // PKO
    //   'tangki_3': '',  // CPO
    //   'tangki_4': ''   // CPO
    // }

    // PRIORITAS 1 (BY API)
    mst_jenis_by_api:any;
    // mst_jenis_by_api:any = {
    //   'tangki_1':'',    // PKO
    //   'tangki_2':'',    // PKO
    //   'tangki_3':'',    // CPO
    //   'tangki_4':''     // CPO
    // }

    // kondisi awal hit dari realtime, ada hitung per jam juga
    mst_jenis_by_api_perjam:any;
    // mst_jenis_by_api_perjam:any = {
    //   'tangki_1':'',    // PKO
    //   'tangki_2':'',    // PKO
    //   'tangki_3':'',    // CPO
    //   'tangki_4':''     // CPO
    // }

    // kondisi filter data per jam
    mst_1m_cpo_pko_filter:any;
    // mst_1m_cpo_pko_filter:any = {
    //   'tangki_1': '',  // PKO
    //   'tangki_2': '',  // PKO
    //   'tangki_3': '',  // CPO
    //   'tangki_4': ''   // CPO
    // }
    mst_suhu1titik:any = [];
    // mst_suhu1titik:any = [
    //   {company_id:1, tangki_id:1, level_isi_start:0.0000, level_isi_end: 4.9999, suhu_tinggi:0},
    //   {company_id:1, tangki_id:1, level_isi_start:5.0000, level_isi_end: 6.9999, suhu_tinggi:1},
    //   {company_id:1, tangki_id:1, level_isi_start:7.0000, level_isi_end: 8.9999, suhu_tinggi:3},
    //   {company_id:1, tangki_id:1, level_isi_start:9.0000, level_isi_end: 10.9999, suhu_tinggi:5},
    //   {company_id:1, tangki_id:1, level_isi_start:11.0000, level_isi_end: 999.9999, suhu_tinggi:7},
    //   {company_id:1, tangki_id:2, level_isi_start:0.0000, level_isi_end: 4.9999, suhu_tinggi:0},
    //   {company_id:1, tangki_id:2, level_isi_start:5.0000, level_isi_end: 6.9999, suhu_tinggi:1},
    //   {company_id:1, tangki_id:2, level_isi_start:7.0000, level_isi_end: 8.9999, suhu_tinggi:3},
    //   {company_id:1, tangki_id:2, level_isi_start:9.0000, level_isi_end: 10.9999, suhu_tinggi:5},
    //   {company_id:1, tangki_id:2, level_isi_start:11.0000, level_isi_end: 999.9999, suhu_tinggi:7}
    // ]

    // ... end


    // value & label untuk options filter pada suhu tinggi tangki
    mst_list_tangki = [
      {company: '', name:'', api:'', bgColor_Tangki:'', bgColor_Company:'', bgColor:'', title:'', value:'', label: '', 
        id_device:'',
        centroid: [0,0], centroid_text: [0,0],
        volume_maks:0, tinggi_tangki: 0, tinggi_delta:0, tinggi_profile:0, tinggi_kalibrasi:0}
      // {company: 'PT. TASK 3', name:'tangki_1', api:'tank 1', bgColor:'bg-gradient-danger', title:'Tangki 1', value:'Tangki 1', label: 'Tangki 1', id_device: 'TANK1_HP_PAMALIAN', centroid: [112.82396178746191,-2.2459264119923468], centroid_text: [112.81996178746191,-2.2509264119923468]},
      // {company: 'PT. TASK 3', name:'tangki_2', api:'tank 2', bgColor:'bg-gradient-info', title:'Tangki 2', value:'Tangki 2', label: 'Tangki 2', id_device: 'TANK2_HP_PAMALIAN', centroid: [112.82896178746191,-2.2459264119923468], centroid_text: [112.82496178746191,-2.2509264119923468]},
      // {company: 'PT. TASK 3', name:'tangki_3', api:'tank 3', bgColor:'bg-gradient-success',title:'Tangki 3', value:'Tangki 3', label: 'Tangki 3', id_device: 'TANK3_HP_PAMALIAN', centroid: [112.83396178746191,-2.2459264119923468], centroid_text: [112.82996178746191,-2.2509264119923468]},
      // {company: 'PT. TASK 3', name:'tangki_4', api:'tank 4', bgColor:'bg-gradient-warning',title:'Tangki 4', value:'Tangki 4', label: 'Tangki 4', id_device: 'TANK4_HP_PAMALIAN', centroid: [112.83896178746191,-2.2459264119923468], centroid_text: [112.83496178746191,-2.2509264119923468]}
    ]

    // [
    //    {name:'Tangki 1', data:[31, 40, 28, 51]}
    // ]
    data_jaraksensor_tangki_perjam_series:any = [];
    data_jaraksensor_tangki_perjam_categories:any = [];
    
    data_suhu_tangki_perjam_series:any = [];
    data_suhu_tangki_perjam_categories:any = [];

    data_tinggi_tangki_perjam_series:any = [];
    data_tinggi_tangki_perjam_categories:any = [];
    
    data_volume_tangki_perjam_series:any = [];
    data_volume_tangki_perjam_categories:any = [];

    // sample : 
    // { tangki_1: [{name:'1 M', data:[{x: '2022-01-01 06:00', y: 465 }]}]}
    obj_suhu_tinggi_tangki_perjam_series:any = {};
      
    tooltip_apex_data_jarak_sensor_jenis:any = {};     // CPO / PKO

    // chart 1 (Tinggi isi Tangki)
    setChartTinggi = {

        series: [{
          name: 'Tinggi Isi Tangki',
          data: []
        }], 

        options: {
          chart: {
            height: 350,
            type: 'bar',
            toolbar:{
              show:true,
              tools:{
                download:false,
              }
            },
            zoom:{
              enabled:false
            }
          },
          colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
              '#f48024', '#69d2e7'
          ],
          plotOptions: {
            bar: {
              columnWidth:'90%',
              borderRadius: 10,
              horizontal:false,
              distributed: false, // multicolor
              dataLabels: {
                position: 'top', // top, center, bottom
                // offsetX: 0,
                enabled:true,
                // enabledOnSeries: [1],
              },
            }
          },
          tooltip:{
            enabled:true
          },
          dataLabels: {
            enabled: true,
            formatter: (val:any) => {
              return val;
            },
            offsetY: 10,
            style: {
              fontSize: '12px',
              colors: ["#304758"]
            },
            background: {
                enabled: true,
                foreColor: '#ffff00',
                borderRadius: 2,
                padding: 4,
                opacity: 0.9,
                borderWidth: 1,
                borderColor: '#fff'
              },

            // textAnchor: 'end',
            
            dropShadow: {
                  enabled: true,
                  left: 1,
                  top: 2,
                  opacity: 0.3
              }          
          },
          
          xaxis: {
            // categories: ["Tangki 1", "Tangki 2", "Tangki 3", "Tangki 4"],
            categories:[],
            labels:{
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            position: 'top',
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 1,
                }
              },
              dropShadow: {
                  enabled: false,
                  top: 0,
                  left: 0,
                  blur: 1,
                  opacity: 0.4,
              },
            },
            tooltip: {
              enabled: true,
            }
          },
          yaxis: {
            axisBorder: {
              show: true
            },
            axisTicks: {
              show: true,
            },
            labels: {
              show: true,
              formatter: (val:any) => {
                return val + " m";
              }
            }
          
          },
          title: {
            // text: 'Data Real Time',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
              color: '#444'
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: "horizontal",
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 0.85,
              opacityTo: 0.85,
              stops: [50, 80, 100]
            },
          }
        },
    // ... end 
    }

    // contoh irregular Suhu Tangki (Jam)
    setChartSuhuJam_Irregular = {
      
      // series: [
      //   {
      //     name: 'Tangki 1',
      //     data: [31, 40, 28, 51, 42, 109, 100]
      //   }, 
      //   {
      //     name: 'Tangki 2',
      //     data: [11, 32, 45, 32, 34, 52, 41]
      //   },
      //   {
      //     name: 'Tangki 3',
      //     data: [15, 35, 70, 30, 45, 57, 47]
      //   },
      //   {
      //     name: 'Tangki 4',
      //     data: [17, 38, 95, 35, 39, 59, 43]
      //   },
      // ],
      // sini
      series: [
        {
          name: 'PRODUCT A',
          data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
        }, {
          name: 'PRODUCT B',
          data: [
            { x: '2014-01-01 07:00', y: 30 }, 
            { x: '2014-01-01 09:00', y: 30 }, 
            { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
        }, {
          name: 'PRODUCT C',
          data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
        }
      ],

      options: {
        chart: {
          height: 350,
          stacked:false,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + "°C";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          // type: 'category',
          type: 'datetime',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          min: new Date("01/01/2014 05:00").getTime(),
          max: new Date("01/01/2014 19:00").getTime(),
          categories: [],
          labels:{
            formatter:(val:any)=>{
              return formatDate(new Date(val), 'HH:mm')
              // return val
            }
          //   formatDate(
          //     (new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000)
          // ,'HH:mm')
          }
        },
        yaxis:{
          labels:{
            formatter: (val:any)=>{ return val + " °C" }
          }
        },
        tooltip: {
          enabled:true,
          x: {
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)
              // console.log(w.globals);

              return new Date(value)
              // let waktu:any = w.globals.categoryLabels[dataPointIndex];
              //   return waktu;
            }
            // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
            //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            //     return ''
            // }
          },
          y: {
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(w.globals);
              return value + " °C"
            },
            title: {
              formatter: (seriesName:any) => {
                return seriesName + " : "  // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    setChartSuhuJam = {

      statusFound: false,
      series: [
        // {
        //   name: 'Tangki 1',
        //   data: [31, 40, 28, 51, 42, 109, 100]
        // }, 
        // {
        //   name: 'Tangki 2',
        //   data: [11, 32, 45, 32, 34, 52, 41]
        // },
        // {
        //   name: 'Tangki 3',
        //   data: [15, 35, 70, 30, 45, 57, 47]
        // },
        // {
        //   name: 'Tangki 4',
        //   data: [17, 38, 95, 35, 39, 59, 43]
        // },
      ],
      // sini
      // series: [
      //   {
      //     name: 'PRODUCT A',
      //     data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      //   }, {
      //     name: 'PRODUCT B',
      //     data: [
      //       { x: '2014-01-01 07:00', y: 30 }, 
      //       { x: '2014-01-01 09:00', y: 30 }, 
      //       { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      //   }, {
      //     name: 'PRODUCT C',
      //     data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
      //   }
      // ],

      options: {
        chart: {
          height: 350,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + "°C";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          // type: 'category',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).getTime(),
          // max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).getTime(),
          // categories: [],

          labels:{
              rotate: -45,
              rotateAlways:true,
              formatter:(val:any)=>{
                return formatDate(new Date(val), 'HH:mm')
                // return val
              }
          //   formatDate(
          //     (new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000)
          // ,'HH:mm')
          }
        },
        yaxis:{
          labels:{
            formatter: (val:any)=>{ return parseInt(val) + " °C" }
          }
        },
        tooltip: {
          enabled:true,
          x: {
            show:true,
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm:ss')

              // let waktu:any = w.globals.categoryLabels[dataPointIndex];
                // return waktu;
            }
            // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
            //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            //     return ''
            // }
          },
          y: {
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(w.globals);
              return value + " °C"
            },
            title: {
              formatter: (seriesName:any, {series, seriesIndex, dataPointIndex, w }:any) => {
                // console.log(w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'])
                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];

                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '') 
                      + ' : '
                        // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    setChartSuhuModusJam = {

      statusFound: false,
      series: [
      ],
      // series: [
      //   {
      //     name: 'PRODUCT A',
      //     data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      //   }, {
      //     name: 'PRODUCT B',
      //     data: [
      //       { x: '2014-01-01 07:00', y: 30 }, 
      //       { x: '2014-01-01 09:00', y: 30 }, 
      //       { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      //   }, {
      //     name: 'PRODUCT C',
      //     data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
      //   }
      // ],

      options: {
        chart: {
          height: 350,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + "°C";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          // type: 'category',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).getTime(),
          // max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).getTime(),
          // categories: [],

          labels:{
              rotate: -45,
              rotateAlways:true,
              formatter:(val:any)=>{
                return formatDate(new Date(val), 'HH:mm')
                // return val
              }
          //   formatDate(
          //     (new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000)
          // ,'HH:mm')
          }
        },
        yaxis:{
          labels:{
            formatter: (val:any)=>{ return parseInt(val) + " °C" }
          }
        },
        tooltip: {
          enabled:true,
          x: {
            show:true,
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm:ss')

              // let waktu:any = w.globals.categoryLabels[dataPointIndex];
                // return waktu;
            }
            // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
            //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            //     return ''
            // }
          },
          y: {
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(w.globals);
              return value + " °C"
            },
            title: {
              formatter: (seriesName:any, {series, seriesIndex, dataPointIndex, w }:any) => {
                // console.log(w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'])
                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];

                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '') 
                      + ' : '
                        // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    setChartSuhuTinggiJam = {

      statusFound: false,
      isDisabled: true,
      suhuTinggiSelected:{},
      series: [
      ],
      // series: [
      //   {
      //     name: '1 M',
      //     data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      //   }, {
      //     name: '3 M',
      //     data: [
      //       { x: '2014-01-01 07:00', y: 30 }, 
      //       { x: '2014-01-01 09:00', y: 30 }, 
      //       { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      //   }, {
      //     name: '5 M',
      //     data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
      //   }
      // ],

      options: {
        chart: {
          height: 350,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + "°C";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          // type: 'category',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).getTime(),
          // max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).getTime(),
          // categories: [],

          labels:{
              rotate: -45,
              rotateAlways:true,
              formatter:(val:any)=>{
                return formatDate(new Date(val), 'HH:mm')
                // return val
              }
          //   formatDate(
          //     (new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000)
          // ,'HH:mm')
          }
        },
        yaxis:{
          labels:{
            formatter: (val:any)=>{ return parseInt(val) + " °C" }
          }
        },
        tooltip: {
          enabled:true,
          x: {
            show:true,
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm:ss')

              // let waktu:any = w.globals.categoryLabels[dataPointIndex];
                // return waktu;
            }
            // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
            //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            //     return ''
            // }
          },
          y: {
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(w.globals);
              return value + " °C"
            },
            title: {
              formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                // console.log(w.globals.initialSeries)

                return seriesName + " : "
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                    // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    // Volume Tangki (Jam)
    setChartVolumeJam = {

      statusFound: false,
      series: [
        // {
        // name: 'Tangki 1',
        // data: [31, 40, 28, 51, 42, 109, 100]
        // }, 
        // {
        //   name: 'Tangki 2',
        //   data: [11, 32, 45, 32, 34, 52, 41]
        // },
        // {
        //   name: 'Tangki 3',
        //   data: [15, 35, 70, 30, 45, 57, 47]
        // },
        // {
        //   name: 'Tangki 4',
        //   data: [17, 38, 95, 35, 39, 59, 43]
        // },
      ],
      // series: [{
      //   name: 'PRODUCT A',
      //   data: [{ x: '01/01/2014 06:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      // }, {
      //   name: 'PRODUCT B',
      //   data: [{ x: '01/01/2014 07:00', y: 30 }, { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      // }, {
      //   name: 'PRODUCT C',
      //   data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
      // }],

      options: {
        chart: {
          height: 350,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return new Number(val).toLocaleString('en-US') + " kg";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        yaxis: {
          labels: {
              style: {
                  colors: '#8e8da4',
              },
              offsetX: 0,
              formatter: (val:any) => {
                // return (val / 1000000).toFixed(2);
                // return parseFloat(val?.toFixed(3)) + " kg";
                return new Number(Math.round(parseFloat(val)*1000)/1000).toLocaleString('en-US') + " kg";
              },
          },
          axisBorder: {
              show: false,
          },
          axisTicks: {
              show: false
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
              rotate: -45,
              rotateAlways: true,
              formatter: (val:any) =>{
                return formatDate(new Date(val),'HH:mm')
                  // return (formatDate(new Date(timestamp),'HH:mm'))
                // return moment(new Date(timestamp)).format("DD MMM YYYY")
              }
          }
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
  
              return formatDate(new Date(value),'HH:mm:ss')
            }
          },
          y: {
            title: {
              formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                // console.log(w.globals.initialSeries)

                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                      + ' : '
                    // nama series pada tooltip sewaktu di hover
              }
            },
          }
        }
      }
        
  // ... end 
    }


    chartTinggiJam_OptionsChart = {
      chart: {
        type: 'area',
        // stacked: false,
        height: 350,
        toolbar:{
          show:true,
          tools:{
            download:false,
          //   zoomin:true,
          //   pan:true,
          //   reset:true,
          //   selection:true,
          //   zoom:true,
          //   zoomout:true
          }
        },
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: true,
        formatter:(val:any)=>{
          return !isNaN(val) ? ((Math.round(val * 1000)/1000) + " Cm") : ''  // PIIS
        }
        // style: {
        //   colors: ['#F44336', '#E91E63', '#9C27B0']
        // }
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100]
          },
      },
      yaxis: {
        labels: {
            style: {
                colors: '#8e8da4',
            },
            offsetX: 0,
            formatter: (val:any) => {
              // return (val / 1000000).toFixed(2);
              return (Math.round(parseFloat(val)*100)/100) + " Cm";
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        }
      },
      xaxis: {
        type: 'datetime',
        // type: 'category',
        // tickAmount:0,
        // categories:[],
        // categories:['2023-01-01 12:00:00','2023-01-01 13:00:00','2023-01-01 14:00:00'],
        // tickAmount: 24,
        // tickPlacement: 'on',
        // min: new Date("01/01/2014 05:00").getTime(),
        // max: new Date("01/01/2014 19:00").getTime(),
        labels: {
            rotate: -45,
            rotateAlways: true,
            formatter: (val:any) =>{
              return formatDate(new Date(val),'HH:mm')
                // return (formatDate(new Date(timestamp),'HH:mm'))
              // return moment(new Date(timestamp)).format("DD MMM YYYY")
            }
        }
      },
      title: {
        // text: 'Irregular Data in Time Series',
        align: 'left',
        offsetX: 14
      },
      tooltip: {
        shared: true,
        x: {
          show:true,
          format: 'dd MMM yy (HH:mm)',
          formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {

            return formatDate(new Date(value),'HH:mm:ss')

          }
          // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
          //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          //     return ''
          // }
        },
        y:{
            title:{
              formatter(seriesName, { series, seriesIndex, dataPointIndex, w }:any) {

                let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                      + ' : '
              },
            }
        }
        // y: {
        //     title: {
        //       formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

        //         let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
        //         // console.log(w.globals.initialSeries)

        //         return seriesName
        //               + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
        //               ? ' (' + jenis_tmp + ')'
        //               : '')
        //               + ' : '
        //             // nama series pada tooltip sewaktu di hover
        //       }
        //     },
        // }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    chartTinggiJam_Modus_OptionsChart = {
      chart: {
        type: 'area',
        // stacked: false,
        height: 350,
        toolbar:{
          show:true,
          tools:{
            download:false,
          //   zoomin:true,
          //   pan:true,
          //   reset:true,
          //   selection:true,
          //   zoom:true,
          //   zoomout:true
          }
        },
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: true,
        formatter:(val:any)=>{
          return !isNaN(val) ? ((Math.round(parseFloat(val)*1000)/1000) + " Cm") : ''
        }
        // style: {
        //   colors: ['#F44336', '#E91E63', '#9C27B0']
        // }
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100]
          },
      },
      yaxis: {
        labels: {
            style: {
                colors: '#8e8da4',
            },
            offsetX: 0,
            formatter: (val:any) => {
              // return (val / 1000000).toFixed(2);
              return (Math.round(parseFloat(val)*1000)/1000) + " Cm";
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        }
      },
      xaxis: {
        type: 'datetime',
        // type: 'category',
        // tickAmount:0,
        // categories:[],
        // categories:['2023-01-01 12:00:00','2023-01-01 13:00:00','2023-01-01 14:00:00'],
        // tickAmount: 24,
        // tickPlacement: 'on',
        // min: new Date("01/01/2014 05:00").getTime(),
        // max: new Date("01/01/2014 19:00").getTime(),
        labels: {
            rotate: -45,
            rotateAlways: true,
            formatter: (val:any) =>{
              return formatDate(new Date(val),'HH:mm')
                // return (formatDate(new Date(timestamp),'HH:mm'))
              // return moment(new Date(timestamp)).format("DD MMM YYYY")
            }
        }
      },
      title: {
        // text: 'Irregular Data in Time Series',
        align: 'left',
        offsetX: 14
      },
      tooltip: {
        shared: true,
        x: {
          show:true,
          format: 'dd MMM yy (HH:mm)',
          formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {

            return formatDate(new Date(value),'HH:mm:ss')

          }
          // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
          //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          //     return ''
          // }
        },
        y:{
            title:{
              formatter(seriesName, { series, seriesIndex, dataPointIndex, w }:any) {

                let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                      + ' : '
              },
            }
        }
        // y: {
        //     title: {
        //       formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

        //         let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
        //         // console.log(w.globals.initialSeries)

        //         return seriesName
        //               + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
        //               ? ' (' + jenis_tmp + ')'
        //               : '')
        //               + ' : '
        //             // nama series pada tooltip sewaktu di hover
        //       }
        //     },
        // }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    // chartJarakSensorJam_OptionsChart:ApexOptions = {
    chartJarakSensorJam_OptionsChart = {
      chart: {
        type: 'area',
        // stacked: false,
        height: 350,
        toolbar:{
          show:true,
          tools:{
            download:false,
          //   zoomin:true,
          //   pan:true,
          //   reset:true,
          //   selection:true,
          //   zoom:true,
          //   zoomout:true
          }
        },
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: true,
        formatter:(val:any)=>{
          return !isNaN(val) && val != null ? ((Math.round(val*1000)/1000).toString() + " m") : ''
        }
        // style: {
        //   colors: ['#F44336', '#E91E63', '#9C27B0']
        // }
      },
      markers: {
        size: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100]
          },
      },
      yaxis: {
        labels: {
            style: {
                colors: '#8e8da4',
            },
            offsetX: 0,
            formatter: (val:any) => {
              // return (val / 1000000).toFixed(2);
              return parseFloat(val?.toFixed(3)) + " m";
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        }
      },
      xaxis: {
        type: 'datetime',
        // type: 'category',
        // tickAmount:0,
        // categories:[],
        // categories:['2023-01-01 12:00:00','2023-01-01 13:00:00','2023-01-01 14:00:00'],
        // tickAmount: 24,
        // tickPlacement: 'on',
        // min: new Date("01/01/2014 05:00").getTime(),
        // max: new Date("01/01/2014 19:00").getTime(),
        labels: {
            rotate: -45,
            rotateAlways: true,
            formatter: (val:any) =>{
              return formatDate(new Date(val),'HH:mm:ss')
                // return (formatDate(new Date(timestamp),'HH:mm'))
              // return moment(new Date(timestamp)).format("DD MMM YYYY")
            }
        }
      },
      title: {
        // text: 'Irregular Data in Time Series',
        align: 'left',
        offsetX: 14
      },
      tooltip: {
        shared: true,
        x: {
          show:true,
          format: 'dd MMM yy (HH:mm)',
          formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {

            return formatDate(new Date(value),'HH:mm:ss')

          }
          // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
          //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          //     return ''
          // }
        },
        y:{
          title:{
            formatter(seriesName, { series, seriesIndex, dataPointIndex, w }:any) {

              // SINI BARU UPDATE
              // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
              // console.error(w.globals.initialSeries[seriesIndex].data[dataPointIndex])
              // let jenis = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'] ?? '';

              // w.globals menghasilkan nama tangki yang salah, pada saat irregular timeseries
              // misal seharus'y seriesname tangki 3, malah jadi tangki 1 karena tangki 1 dan 3 punya gap waktu
              // let tangki_nama = w.globals.initialSeries[seriesIndex]?.['name'];
              
              // let arr_initialSeries = w.globals.initialSeries;
              // console.log("arr initialseries")
              // console.log(arr_initialSeries)
              // console.log("arr series")
              // console.log(series)

              // console.error("W globals : " + tangki_nama)

              // pakai yg "seriesName", menghasilkan nama series yang benar
              // let tangki_nama_rev:any = seriesName;
              // console.error("Revisi : " + seriesName)

              // let tanggal = w.globals.initialSeries[seriesIndex]?.data[dataPointIndex]?.['x'];
              // console.error(tanggal)
              // console.log(w.globals)
              // console.log(w)
              // console.log("Series Index : " + seriesIndex)

              // let final = jenis != '' ?
              //         seriesName + ' (' + jenis + ')'
              //         : seriesName + ' : '
              // console.log("final")
              // console.log(final)
              return seriesName
                    // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                    // ? ' (' + jenis_tmp + ')'
                    // : '')
                    + ' : '
            },
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    setChartJarakSensorJam = {

      statusFound: false,
      series: [
        // {
        //   name: 'Tangki 1',
        //   data: [{ x: '12/01/2013 06:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
        // }, {
        //   name: 'Tangki 2',
        //   data: [{ x: '01/01/2014 07:00', y: 30 }, { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
        // , {
        //   name: 'Tangki 3',
        //   data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
        // }
        // , {
        //   name: 'Tangki 4',
        //   data: [{ x: '01/01/2014 06:00', y: 20 }, { x: '01/01/2014 14:00', y: 35 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
      ],
      options: {...this.chartJarakSensorJam_OptionsChart}
    }

    // Tinggi Isi Tangki (Jam) 
    setChartTinggiJam = {

      statusFound: false,
      series: [
        // {
        //   name:'Tangki 1',
        //   data:[30,50,60]
        // },
        // {
        //   name:'Tangki 2',
        //   data:[70,30,90]
        // }

        // {
        //   name: 'Tangki 1',
        //   data: [{ x: '12/01/2013 06:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
        // }, {
        //   name: 'Tangki 2',
        //   data: [{ x: '01/01/2014 07:00', y: 30 }, { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
        // , {
        //   name: 'Tangki 3',
        //   data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
        // }
        // , {
        //   name: 'Tangki 4',
        //   data: [{ x: '01/01/2014 06:00', y: 20 }, { x: '01/01/2014 14:00', y: 35 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
      ],
      options: {...this.chartTinggiJam_OptionsChart}
    }

    // Tinggi Isi Tangki (Jam) (Angka Modus / yang sering muncul)
    setChartTinggi_Modus_Jam = {

      statusFound: false,
      series: [
        // {
        //   name:'Tangki 1',
        //   data:[30,50,60]
        // },
        // {
        //   name:'Tangki 2',
        //   data:[70,30,90]
        // }

        // {
        //   name: 'Tangki 1',
        //   data: [{ x: '12/01/2013 06:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
        // }, {
        //   name: 'Tangki 2',
        //   data: [{ x: '01/01/2014 07:00', y: 30 }, { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
        // , {
        //   name: 'Tangki 3',
        //   data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
        // }
        // , {
        //   name: 'Tangki 4',
        //   data: [{ x: '01/01/2014 06:00', y: 20 }, { x: '01/01/2014 14:00', y: 35 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
      ],
      options: {...this.chartTinggiJam_Modus_OptionsChart}
    }

    // object untuk change password
    obj_password = {
        oldPass: '',
        newPass: '',
        confirmNewPass: ''
    }
    // object untuk create new user
    obj_createUser = {
        newUser: '',
        company: [],
        newPass: '',
        confirmNewPass: ''
    }

    // object untuk update user company
    obj_updateUserCompany:any = {
        user: {},
        company: [],
        created_user: ''
    }

    state:any = {
        numberAnimate:1300000,

        floatingMenu:{
          isOpen: false
        },
        filter_company:[], // untuk filter company di atas card
        filter_company_create_user:[],  // untuk filter company di menu create user
        filter_company_update_user_company:[], // untuk filter company di menu update user company
        mst_list_tangki:[],  // untuk parsing ke card
        mst_device_pattern:[],
        modal:{
          changePWD:{
            show: false,
            loader: false
          },
          createUser:{
            show: false,
            loader: false
          },
          updateJenis:{
            show: false,
            loader: false,
            input:{
              dateSelected: new Date(),
              filterOptions_Company: [],
              filterOptions_Tangki: [],
              filterOptions_Jenis: [
                {value:'CPO', label:'CPO'},
                {value:'PKO', label:'PKO'}
              ],
              company: {
                value: null,
                isLoading: true
              },
              tangki: {
                value: null,
                isLoading: true
              },
              jenis: {
                value: null,
                dataSaved:null    // untuk tampil di kanan bawah dari jenis sebagai informasi jenis yang sudah tersimpan (acuan'y tanggal, company_id, tangki_name)
              }
            },
          },
          updateProfileTangki:{
            show: false,
            loader: false,
            input:{
              filterOptions_Company: [],
              filterOptions_Tangki: [],
              company: {
                value: null,
                isLoading: true
              },
              tangki: {
                value: null,
                isLoading: true
              },
              tinggi_profile: {
                  value: null,
                  isLoading: true
              }
            },
          },
          updateUserCompany:{
              show: false,
              loader: false,
              checked_user_active: false,    // checked apakah status user boleh login 
              input:{
                  filterOptions_Company: [],
                  filterOptions_User: [],
                  user:{
                    value: null,
                    isLoading: true
                  },
                  company:{
                    value: null,
                    isLoading: true
                  }
              }
          }
        },

        dateSelected:new Date(),
        timeSelected:[null,null],
        show:{
          datepicker:false,
          timepicker:false,
          iconmap:false   // icon map deck.gl
        },
        waktu:{
          tanggal:'',
          tanggal_jam:''
        },
        realtime:{
          tangki_1:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
          tangki_2:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
          tangki_3:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
          tangki_4:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
        },

        loader:{
            jarak_sensor_jam: true,
            tinggi_isi: true,
            tinggi_isi_jam: true,
            tinggi_isi_modus_jam: true,
            suhu_tangki: true,
            suhu_tangki_modus_jam: true,
            suhu_tangki_jam: true,
            suhu_tinggi_tangki_jam:true,
            volume_isi: true,
            volume_tangki_jam: true,
        },
        chartJarakSensorJam:{...this.setChartJarakSensorJam},
        chartTinggi:{...this.setChartTinggi},
        chartTinggiJam:{...this.setChartTinggiJam},
        chartTinggiModusJam:{...this.setChartTinggi_Modus_Jam},
        chartSuhuJam:{...this.setChartSuhuJam},
        chartSuhuModusJam:{...this.setChartSuhuModusJam},
        chartSuhuTinggiJam:{...this.setChartSuhuTinggiJam},
        chartVolumeJam:{...this.setChartVolumeJam}
    };

    // chart termometer (fusionchart)
    // dataSource_Suhu = {

    //   chart: {
    //     caption: "Tangki 1",
    //     // subcaption: "(Real Time)",
    //     lowerlimit: "0",
    //     upperlimit: "100",
    //     numbersuffix: "°C",
    //     thmfillcolor: "#008ee4",
    //     showgaugeborder: "1",
    //     gaugebordercolor: "#008ee4",
    //     gaugeborderthickness: "2",
    //     plottooltext: "Temperature: <b>$datavalue</b> ",
    //     theme: "gammel",
    //     showvalue: "1",
    //     // "bgColor": "EEEEEE,CCCCCC",
    //     "bgColor": "ffffff",
    //     // "bgColor": "f0f8ff",
    //     // "borderColor": "#666666",
    //     "borderThickness": "4",
    //     // "borderAlpha": "80",
    //     showBorder:"0",
    //     thmFillColor: "#29C3BE",
    //     "showhovereffect": "1",
    //     "plotFillHoverColor": "ff0000",
    //     "baseFont": "Verdana",
    //     "baseFontSize": "8",
    //     // "baseFontColor": "#0066cc"
    //   },
    //   value: "0"
    // };
    // ... <end>

    // chartConfigs_Suhu = {
    //   type: 'thermometer',
    //   width: 150,
    //   height: 300,
    //   dataFormat: 'JSON',
    //   dataSource: this.dataSource_Suhu
    // };
    
    // CUSTOM STYLE <SELECT />
    customStyle_SuhuTinggiTangki = {
        control: base => ({
            ...base,
            height:35,
            minHeight:35,
            fontSize:15,
            paddingTop:0,
            paddingBottom:0
        })
    }

    // menampung info detail per company (pure api dari company/tangki)
    arr_company_list:any = [];

    generateExcel = async () => {

      let workbook = new ExcelJS.Workbook();
      let worksheet = workbook.addWorksheet('Result')
      let excelRowReq:any = worksheet.addRow([
                'Tangki', 'Tanggal', 'Jenis', 'Jarak Sensor (Cm)', 'Suhu 1 (°C)'
                , 'Suhu 2 (°C)', 'Suhu 3 (°C)', 'Suhu 4 (°C)', 'Suhu 5 (°C)'
                , 'Tinggi Suhu 1', 'Tinggi Suhu 2', 'Tinggi Suhu 3', 'Tinggi Suhu 4', 'Tinggi Suhu 5'
                , 'Titik Terambil', 'Suhu Average (°C)', 'Tinggi (Cm)', 'Volume (kg)'
              ])
      excelRowReq.eachCell((cell, cekl)=>{
          cell.font = {
            bold:true
          }
      })


      let data:any = [];

      if (Array.isArray(this.data_Export))
      {
          this.data_Export.map((obj, idx)=>{

              let data_temp:any = [];
              
              data_temp = [obj?.['tangki'], obj?.['tanggal']
                            , obj?.['jenis']
                            , typeof (obj?.['data_jarak_sensor']) != 'undefined' && obj?.['data_jarak_sensor'] != null ? parseFloat(obj?.['data_jarak_sensor']) : null
                            , obj?.['suhu_1_m'] ?? null
                            , obj?.['suhu_3_m'] ?? null
                            , obj?.['suhu_5_m'] ?? null
                            , obj?.['suhu_7_m'] ?? null
                            , obj?.['suhu_10_m'] ?? null
                            , obj?.['data_suhu_tank_num']?.[0] ?? null
                            , obj?.['data_suhu_tank_num']?.[1] ?? null
                            , obj?.['data_suhu_tank_num']?.[2] ?? null
                            , obj?.['data_suhu_tank_num']?.[3] ?? null
                            , obj?.['data_suhu_tank_num']?.[4] ?? null
                            , obj?.['suhu_1titik_getTinggiSuhu'] ?? null
                            , obj?.['suhu'] ?? null
                            , obj?.['tinggi'] ?? null
                            , obj?.['volume'] ?? null
                          ];

              data = [
                ...data,
                data_temp
              ]
          })
      }

      data.forEach((row,idx)=>{
        let excelRow:any = worksheet.addRow(row);
        
        let avg_tinggi_suhu_PositionIdx:any;
        avg_tinggi_suhu_PositionIdx = (this.data_Export[idx]?.['suhu_1titik_getTinggiSuhu']);
        let findIdx_SuhuTankNum = this.data_Export[idx]?.['data_suhu_tank_num'].findIndex(val=>val == avg_tinggi_suhu_PositionIdx);

        let posisi_Cell:any = 5;
        if (findIdx_SuhuTankNum != -1){
            posisi_Cell += findIdx_SuhuTankNum;
        }else{
            posisi_Cell += 0
        }

        for (var i=5;i<=posisi_Cell;i++)
        {
            let suhu1Cell:any = excelRow.getCell(i);
            if (suhu1Cell != null){
                suhu1Cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb:'FFFF00'}
                }
            }
        }
        
        // console.log(avg_tinggi_suhu_PositionIdx);


        // let suhu1Cell:any = excelRow.getCell(3);
        // if (parseFloat(excelRow.getCell(3)) >= 25){
        //   suhu1Cell.font = {
        //     color: { argb: 'FFFFFF'}
        //   }
        //   suhu1Cell.fill = {
        //     type:'pattern',
        //     pattern:'solid',
        //     fgColor:{argb:'FF00FF'},
        //   }
        // }

      })

      
      // auto stretch columns
      worksheet.columns.forEach((column, i)=>{
          let maxLength = 0;
          if (typeof (column?.["eachCell"]) != 'undefined'){
            column?.["eachCell"]({includeEmpty:true}, (cell, rownumber) => {
                let cellValue = cell.value?.toString();
                let columnLength = cellValue ? cellValue.length : 0;

                if (columnLength > maxLength){
                  maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 1;
          }
      })

      let buffer = await workbook.xlsx.writeBuffer();
      let blob = new Blob([buffer], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      let url = URL.createObjectURL(blob);

      let a = document.createElement("a")
      a.href = url;
      a.download = 'data.xlsx';
      a.click();

      URL.revokeObjectURL(url);
    }

    // Cari Range Waktu 10 menit yang dipakai untuk cari tinggi modus
    // jika waktu 07:19, maka range menit 0 - 9
    // jika waktu 07:20, maka range menit 10 -19
    range_waktu:any = [
        {start:0, end:9},
        {start:10, end:19},
        {start:20, end:29},
        {start:30, end:39},
        {start:40, end:49},
        {start:50, end:59}
    ];

    
    constructor(props:any){
        super(props)

        // filter item
        // let cari = _.filter(users, function(e){
        //   return e.age < 40
        // })


        // frequent item 
          // let arr:any = []
          // const arr2 = [{tinggi:12.34},{tinggi:12.34}, {tinggi:9.560}, {tinggi:9.56}, {tinggi:12.40}]
          // // // const bc = _.maxBy(arr,'length')
          
          // arr = arr2.map((ele)=>{
          //   return ele.tinggi   // [12.34, 12.40, 9.56]
          // })

          // let arr_countBy = []
          // let max_countBy_brief_all = _.countBy(arr);
          // let max_countBy_brief = _(arr).countBy().entries().maxBy(_.last);

          // let managecountby = _.countBy(arr);
          // let manageentries = _.entries(managecountby);

          // console.error(manageentries)

          // console.error("MAX COUNT BY BRIEF")
          // console.error(max_countBy_brief_all)
          // console.error(max_countBy_brief)
          // if (max_countBy_brief.length >= 1){
          //     // bila ada occurance (kemunculan) yang sama, maka ambil angka paling maksimal
          //     let obj_values_brief_all = Object.entries(max_countBy_brief_all);

          //     // filter yang memiliki kemunculan angka yang sama (misal, [[12.34, 2], [9.56, 2]]) == [2]
          //     let filter_values_brief_all = obj_values_brief_all.filter(elefil=>elefil[1] == max_countBy_brief[1]);

          //     let arr_getMax_Values = filter_values_brief_all.map((ele_max,idx_max)=>{
          //         return parseFloat(ele_max[0])
          //     })
          //     // ambil angka yang paling maksimal
          //     let getMax_Value = Math.max.apply(null, arr_getMax_Values)

          //     console.error(obj_values_brief_all)
          //     console.error(filter_values_brief_all)
          //     console.error(arr_getMax_Values)
          //     console.error(getMax_Value)
          // }

        // ... <END>

        // const tes:any = [['11',2], ['10',1], ['3',5]]
        // console.error(tes)
        // console.error(_(tes).maxBy(_.last))

        // let tes3 = _.maxBy(_.last(tes))
        // console.error(tes3)
        // let getdata:any = _.maxBy(_.first(tes))
        // console.error(getdata) 

        // console.error(max_countBy)

        // console.error(max_2)

        // ... <end frequent item>

        // this.buttonPlus = this.buttonPlus.bind(this);

        // start chart

        // this.state = {
        //     chartTinggi: {...setChartTinggi}
        // }
        // this.state = {
        //     // chartTinggi: {...setChartTinggi}
        //     // chartTinggi:  {
            
        //         series: [{
        //           name: 'Ketinggian Isi Tangki',
        //           data: [2.3, 3.1, 4.0, 10.1]
        //         }],
        //         options: {
        //           chart: {
        //             height: 350,
        //             type: 'bar',
        //           },
        //           plotOptions: {
        //             bar: {
        //               borderRadius: 20,
        //               dataLabels: {
        //                 position: 'top', // top, center, bottom
        //               },
        //             }
        //           },
        //           dataLabels: {
        //             enabled: true,
        //             formatter: (val:any) => {
        //               return val + "%";
        //             },
        //             offsetY: -20,
        //             style: {
        //               fontSize: '12px',
        //               colors: ["#304758"]
        //             }
        //           },
                  
        //           xaxis: {
        //             categories: ["Tangki 1", "Tangki 2", "Tangki 3", "Tangki 4"],
        //             position: 'top',
        //             axisBorder: {
        //               show: false
        //             },
        //             axisTicks: {
        //               show: false
        //             },
        //             crosshairs: {
        //               fill: {
        //                 type: 'gradient',
        //                 gradient: {
        //                   colorFrom: '#D8E3F0',
        //                   colorTo: '#BED1E6',
        //                   stops: [0, 100],
        //                   opacityFrom: 0.4,
        //                   opacityTo: 0.5,
        //                 }
        //               }
        //             },
        //             tooltip: {
        //               enabled: true,
        //             }
        //           },
        //           yaxis: {
        //             axisBorder: {
        //               show: false
        //             },
        //             axisTicks: {
        //               show: false,
        //             },
        //             labels: {
        //               show: false,
        //               formatter: (val:any) => {
        //                 return val + "%";
        //               }
        //             }
                  
        //           },
        //           title: {
        //             text: 'Monthly Inflation in Argentina, 2002',
        //             floating: true,
        //             offsetY: 330,
        //             align: 'center',
        //             style: {
        //               color: '#444'
        //             }
        //           }
        //         },
        //     // ... end 
            
        // }
        
    }

    removeFromLocalStorage(key:any){
          if (typeof key != 'undefined' && key != null){
              if (localStorage.getItem(key) != null){
                  localStorage.removeItem(key)
              }
          }
    }

    buttonPlus(){

        this.setState({
            chartTinggi:{
                ...this.state.chartTinggi,
                options:{
                    ...this.state.chartTinggi.options,
                    plotOptions: {
                        ...this.state.chartTinggi.options.plotOptions,
                        bar: {
                            ...this.state.chartTinggi.options.plotOptions.bar,
                            borderRadius: 80,
                            dataLabels: {
                                position: 'bottom', // top, center, bottom
                            },
                        }
                    },
    
                }
            }
        })
    }


    update_to_arr_json_tangki_last(data_arr:any, ele:any, tangki_name:any, tangki_api:any){

        let findTank = Object.keys(data_arr).findIndex((res)=>
            {
                let patt = new RegExp(/[tT]ank [0-9]+/,'gi');
                let match = patt.exec(res);

                // res.toLowerCase().indexOf(tangki_api) !== -1  // ada kekurangan kalau tank 1, maka terambil tank 10,11,12,13,14,15,dst...
                if (typeof match?.[0] != 'undefined' && match?.[0] != null && match?.[0] != '')
                {
                    return match?.[0].toLowerCase() == tangki_api.toLowerCase()
                }

            }
        );

        if (findTank != -1){
            // let findIdx = Object.keys(this.arr_json_tangki_last).findIndex(res=>res == tangki_name);
            // if (findIdx == -1){

                let sub_obj_keys = Object.keys(data_arr);
                sub_obj_keys.forEach((ele_for)=>{
                  if (ele_for.toLowerCase().indexOf(tangki_api) != -1){
                      // console.log(data_arr?.[ele_for])
                      // contoh tangki_name => 'tangki_4'
                      this.arr_json_tangki_last[tangki_name] = {
                          ...this.arr_json_tangki_last[tangki_name],
                          [ele_for]: data_arr?.[ele_for]
                      }
                  }
                })

                this.arr_json_tangki_last[tangki_name]['time'] = ele?.['time'];
                this.arr_json_tangki_last[tangki_name]['id_device'] = ele?.['id_device'];
                this.arr_json_tangki_last[tangki_name]['rawData'] = ele?.['rawData'];
            // }
        }
    }

    componentWillUnmount(): void {
      // amcharts
      if (this.root){
        this.root.dispose();
      }
    }

    generateAMChart(){
        // amCharts
        const root = am5.Root.new("chartdiv");

        this.root = root;

        root.setThemes([
          am5themes_Animated.new(root)
        ]);
    
        let chart = root.container.children.push( 
          am5xy.XYChart.new(root, {
            panY: false,
            layout: root.verticalLayout
          }) 
        );

        // Define data
        let data = [{
          category: "Research",
          value1: 1000,
          value2: 588
        }, {
          category: "Marketing",
          value1: 1200,
          value2: 1800
        }, {
          category: "Sales",
          value1: 850,
          value2: 1230
        }];

         // Create Y-axis
        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
          })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
            categoryField: "category"
          })
        );
        xAxis.data.setAll(data);

         // Create series
        let series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value1",
            categoryXField: "category"
          })
        );
        series1.data.setAll(data);

        let series2 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value2",
            categoryXField: "category"
          })
        );
        series2.data.setAll(data);

         // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

          // Add cursor
          chart.set("cursor", am5xy.XYCursor.new(root, {}));

          this.root = root;
    }

    generateAMChart_Column3D(data:any){
      
      am4core.useTheme(am4themes_animated);
      let chart = am4core.create("chartdiv", am4charts.XYChart3D);

      chart.paddingBottom = 25;
      chart.angle = 70

      // chart.cursor.behavior = "none";

      // Add data
      // data = [{
      //   "country":"USA",
      //   "visits":4025
      // }
      // ,{
      //   "country": "China",
      //   "visits": 1882
      // }, {
      //   "country": "Japan",
      //   "visits": 1809
      // }, {
      //   "country": "Germany",
      //   "visits": 1322
      // }
      // ]
      chart.data = [...data];

      // chart.data = [{
      //   "country": "USA",
      //   "visits": 4025
      // }, {
      //   "country": "China",
      //   "visits": 1882
      // }, {
      //   "country": "Japan",
      //   "visits": 1809
      // }, {
      //   "country": "Germany",
      //   "visits": 1322
      // }
      // // , {
      // //   "country": "UK",
      // //   "visits": 1122
      // // }, {
      // //   "country": "France",
      // //   "visits": 1114
      // // }, {
      // //   "country": "India",
      // //   "visits": 984
      // // }, {
      // //   "country": "Spain",
      // //   "visits": 711
      // // }, {
      // //   "country": "Netherlands",
      // //   "visits": 665
      // // }, {
      // //   "country": "Russia",
      // //   "visits": 580
      // // }, {
      // //   "country": "South Korea",
      // //   "visits": 443
      // // }, {
      // //   "country": "Canada",
      // //   "visits": 441
      // // }, {
      // //   "country": "Brazil",
      // //   "visits": 395
      // // }, {
      // //   "country": "Italy",
      // //   "visits": 386
      // // }, {
      // //   "country": "Australia",
      // //   "visits": 384
      // // }, {
      // //   "country": "Taiwan",
      // //   "visits": 338
      // // }, {
      // //   "country": "Poland",
      // //   "visits": 328
      // // }
      // ];

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "tank_x";
      categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.labels.template.horizontalCenter = "left";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.labels.template.inside = false;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.fontFamily = "Arial";
      categoryAxis.renderer.labels.template.fill = am4core.color("#000000");

      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.inside = true;
      categoryAxis.renderer.grid.template.disabled = true;
      
      categoryAxis!.tooltip!.label!.rotation = 270;
      categoryAxis!.tooltip!.label!.horizontalCenter = "right";
      categoryAxis!.tooltip!.label!.verticalCenter = "middle";
      

      // let labelTemplate = categoryAxis.renderer.labels.template;
      // labelTemplate.rotation = 270;
      // labelTemplate.hideOversized  = false;
      // labelTemplate.horizontalCenter = "right";
      // labelTemplate.verticalCenter = "middle";
      // labelTemplate.dy = 10; // moves it a bit down;
      // labelTemplate.inside = false; 

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = false;
      // valueAxis.title.fontSize = 9;
      // valueAxis.title.text = "Meter";
      // valueAxis.title.fontWeight = "bold";

      // categoryAxis.renderer.labels.template.rotation = -90;
      // categoryAxis.renderer.grid.template.location = 0;
      // // categoryAxis.renderer.labels.template.hideOversized = false;
      // categoryAxis.renderer.minGridDistance = 20;
      // categoryAxis.renderer.labels.template.horizontalCenter = "left";
      // categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.labels.template.dy = 10;
      // categoryAxis.renderer.inside = false;

      // categoryAxis.tooltip.label.rotation = 270;
      // categoryAxis.tooltip.label.horizontalCenter = "right";
      // categoryAxis.tooltip.label.verticalCenter = "middle";

      // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.title.text = "Meter";
      // valueAxis.title.fontWeight = "bold";
      // valueAxis.renderer.grid.template.disabled = false;

      // Create series
      // chart.numberFormatter.numberFormat = "[green]#,###|[red](#,###)|[#ccc]'-'";

      chart.numberFormatter.numberFormat = "#.##";

      let series = chart.series.push(new am4charts.ColumnSeries3D());
      series.dataFields.valueY = "tank_value";
      series.dataFields.categoryX = "tank_x";
      series.name = "Tank";
      series.tooltipText = `{categoryX}: [bold]{valueY} Cm [/]`;
      series.columns.template.fillOpacity = 1;    // opacity bar column
      
      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 0;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target!.dataItem!.index);
      })

      columnTemplate.adapter.add("stroke", function(stroke, target:any) {
        return chart.colors.getIndex(target!.dataItem!.index);
      })

//       let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// valueAxis.renderer.grid.template.disabled = true;


      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 1;

      chart.cursor.xAxis = categoryAxis;
      // chart.cursor.fullWidthLineX = true;
      // chart.cursor.lineX.strokeWidth = 0;
      // chart.cursor.lineX.fill = am4core.color("#8F3985");
      // chart.cursor.lineX.fillOpacity = 0;

      // disable zoom in
      chart.cursor.behavior = "none";
      // chart.colors.list = [
      //   am4core.color("#fe7096"),
      //   am4core.color("#90caf9"),
      //   am4core.color("#84d9d2"),
      //   am4core.color("#b9dd77"),
        // am4core.color("#845EC2"),
        // am4core.color("#D65DB1"),
        // am4core.color("#FF6F91"),
        // am4core.color("#FF9671"),
        // am4core.color("#FFC75F"),
        // am4core.color("#F9F871")
      // ];
      
    
      this.chart_amColumn3d = chart;
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {

        this.hide_amlogo();

        // UPDATE PLACEHOLDER pada <MultiSelect> dari "Select..." ke "Company..."
        if (this.state?.['filter_company'].length == 0){
          this.updatePlaceholderDropdown(false,'cardtop');
        }
    }



    updatePlaceholderDropdown(allSelected?:boolean, nama_form?:'create-user'|'cardtop'|'update-user-company'){
      if (!allSelected)
      {
          setTimeout(()=>{
            let dropdownHeading:any;
            if (nama_form == 'create-user'){
                dropdownHeading = document.querySelectorAll(".multi-select-filter-company.create-user .dropdown-heading-value span");
            }
            else if (nama_form == 'cardtop'){               
                dropdownHeading = document.querySelectorAll(".multi-select-filter-company.cardtop .dropdown-heading-value span");
            }
            else if (nama_form == 'update-user-company'){               
                dropdownHeading = document.querySelectorAll(".multi-select-filter-company.update-user-company .dropdown-heading-value span");
            }
            

            dropdownHeading.forEach((ele,idx)=>{
              ele.textContent = "Company..."
            })
          },10)
      }
      else{
          // JIKA TIDAK SEMUA TER-SELECT, MAKA ubah kata placeholder
          // dari 'All items are selected.' -> 'All companies are selected.'
          setTimeout(()=>{
            let dropdownHeading:any;
            if (nama_form == 'create-user'){
                dropdownHeading = document.querySelectorAll(".multi-select-filter-company.create-user .dropdown-heading-value span");
            }
            else if (nama_form == 'cardtop'){               
                dropdownHeading = document.querySelectorAll(".multi-select-filter-company.cardtop .dropdown-heading-value span");
            }
            else if (nama_form == 'update-user-company'){               
                dropdownHeading = document.querySelectorAll(".multi-select-filter-company.update-user-company .dropdown-heading-value span");
            }

            dropdownHeading.forEach((ele,idx)=>{
              ele.textContent = "All companies are selected."
            })
          },10)
      }
    }

    getListUser = async(user_level, user_level_parent, callback)=>{

        let result_tmp:any;
        let arr_user_tmp:any = [];

        await getApiSync(URL_API_LiVE + "/list/user?user_level=" + user_level, null, null, 
                      null, 'application/json'
                    ,"GET"
        ).then((result)=>{
  
            if (typeof result?.['status'] != 'undefined' &&
                  result?.['status'] == 'failed')
            {
                if (typeof result?.['message'] != 'undefined' && 
                    result?.['message'] != null)
                {
                    result_tmp = [];
                    notify('error', result?.['message']);
                    return
                }
                return
            }
            else{
              
                if (Array.isArray(result)){
                  if (result.length > 0){

                      arr_user_tmp = result.map((val, idx)=>{
                          return {
                              value: val?.['username'],
                              label: val?.['username']
                          }
                      });

                      this.setState({
                        ...this.state,
                        modal:{
                            ...this.state.modal,
                            updateUserCompany: {
                                ...this.state.modal.updateUserCompany,
                                input: {
                                    ...this.state.modal.updateUserCompany.input,
                                    filterOptions_User: [...arr_user_tmp]
                                }
                            }
                        }
                      })

                      result_tmp = arr_user_tmp;
                  }
                  else{
                    result_tmp = [];
                  }
                }
            }
          })
        
        
        if (user_level_parent == 'ADMIN')
        {
          // KHUSUS ADMIN TAMPILKAN SAMPAI SUPER USER -> USER

          await getApiSync(URL_API_LiVE + "/list/user?user_level=USER", null, null, 
                            null, 'application/json'
                          ,"GET"
          ).then((result)=>{
              if (Array.isArray(result))
              {
                if (result.length > 0){


                    let arr_user_tmp_user = result.map((val, idx)=>{
                        return {
                            value: val?.['username'],
                            label: val?.['username']
                        }
                    });
                    arr_user_tmp = [
                        ...arr_user_tmp,
                        ...arr_user_tmp_user
                    ]

                    this.setState({
                      ...this.state,
                      modal:{
                          ...this.state.modal,
                          updateUserCompany: {
                              ...this.state.modal.updateUserCompany,
                              input: {
                                  ...this.state.modal.updateUserCompany.input,
                                  filterOptions_User: [...arr_user_tmp]
                              }
                          }
                      }
                    })

                    result_tmp = arr_user_tmp;
                }
              }
            })
        }

          await new Promise(resolve => setTimeout(resolve, 10));
          // alert(JSON.stringify(result_tmp));
          callback(result_tmp)
    }

    get_DeviceValidPattern = async() => {

        let result_tmp:any;

        await getApiSync(URL_API_LiVE + "/get/devicevalidpattern", null, null, 
                      null, 'application/json'
                    ,"GET"
        ).then((result)=>{
  
            if (typeof result?.['status'] != 'undefined' &&
                  result?.['status'] == 'failed')
            {
                if (typeof result?.['message'] != 'undefined' && 
                    result?.['message'] != null)
                {
                    result_tmp = [];
                    notify('error', result?.['message']);
                    return
                }
                return
            }
            else{
              
                if (Array.isArray(result)){
                  if (result.length > 0){
                      
                      result_tmp = [...result];

                      this.setState({
                        ...this.state,
                        mst_device_pattern:[...result]
                      })

                  }
                  else{
                    result_tmp = [];
                  }
                }
            }
        })

        await new Promise(resolve => setTimeout(resolve, 10));

        return result_tmp;

    }

    get_company(callback){
      getApiSync(URL_API_LiVE + "/company", null, null, 
                    null, 'application/json'
                  ,"GET"
      ).then((result)=>{

          if (typeof result?.['status'] != 'undefined' &&
                result?.['status'] == 'failed')
          {
              if (typeof result?.['message'] != 'undefined' && 
                  result?.['message'] != null)
              {
                  notify('error', result?.['message']);
                  return
              }
          }
          else{
            
            if (Array.isArray(result)){
              if (result.length > 0){

                  let arr_company:any = [];
                  arr_company = result.map((ele,idx)=>{
                      return {
                          id: ele?.['id'],
                          company: ele?.['company_name'],
                          backgroundColor: ele?.['bgcolor_gl'] != null ? JSON.parse(ele?.['bgcolor_gl']) : [],    // cth : [255,255,255]
                          centroid: [ele?.['centroid_lng'], ele?.['centroid_lat']]  // [longitude, latitude]
                      }
                  })

                  let localstor:any = localStorage.getItem("BESTCOMID");
                  if (typeof localstor != 'undefined' && localstor != null){
                      localstor = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("BESTCOMID"),encryptCode).toString(CryptoJS.enc.Utf8));
                      let arr_company_temp = [];

                      // cari sesuai yang ada di BESTCOMID
                      arr_company_temp = arr_company.filter((res,idx)=>{
                          let findItem = localstor.find(x => x == res?.['id']);
                          if (findItem){ return true}
                      })
                      arr_company = [...arr_company_temp];
                  }
                  if (arr_company.length == 0){
                      this.handleLogOut();
                      window.location.href = "/login";
                  }


                  // ISI DATA MASTER COMPANY KE options_filter_company 
                  // (Filter Company di atas Card)
                  if (arr_company.length > 0){

                      this.options_filter_company = arr_company.map((ele,idx)=>{
                          return {
                              label: ele?.['company'],
                              value: ele?.['id']
                          }
                      })
                      this.options_filter_company_createuser = arr_company.map((ele,idx)=>{
                          return {
                              label: ele?.['company'],
                              value: ele?.['id']
                          }
                      })
                      this.options_filter_company_updateusercompany = arr_company.map((ele,idx)=>{
                          return {
                              label: ele?.['company'],
                              value: ele?.['id']
                          }
                      })
                  }else{
                      this.options_filter_company = [];
                      this.options_filter_company_createuser = [];
                      this.options_filter_company_updateusercompany = []
                  }
                  // ... end Isi Data Master Company


                  // SIMPAN ARRAY COMPANY KE SESSION STORAGE BESTCOM
                  if (sessionStorage.getItem("BESTCOM") != null)
                  {
                    sessionStorage.removeItem('BESTCOM'); // BESTCOM -> BEST COMPANY
                  }
                  sessionStorage.setItem("BESTCOM", JSON.stringify(arr_company));

              }
            }
            
            callback(result)
          }
      })
    }

    // GET JENIS BY API DARI DATA TERAKHIR
    get_jenis_by_api_lastdata(arr_json_tangki_last, callback){
        // dapatkan jenis cpo / pko dari api (di prioritaskan utama)

        let arr_json_tangki_last_length = Object.keys(arr_json_tangki_last).length;
        let obj_keys_last_onprogress_1m = 0;

        let breakException = {};
        let all_done = false

        let arr_temp_jenis = {};  // isi dengan 'tangki_1':'PKO', 'tangki_2':'PKO'

        try{

          Object.keys(arr_json_tangki_last).forEach((tank_name,idx)=>{

              let datebegin = formatDate(new Date(arr_json_tangki_last?.[tank_name]?.['time']),'YYYY-MM-DD');
              let tangki_id = tank_name;

              getApiSync(URL_API_LiVE + "/getJenisByDatentank?tanggal=" + datebegin + "&tangki_id=" + tangki_id, null, null, 
                    null, 'application/json'
                  ,"GET"
              )
              .then((result)=>{

                  if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
                  {
                      if (result?.['status'].toString().toLowerCase() == 'success')
                      {
                        // notify('error', result?.['message'])

                        let arr_data = result?.['data'];
                        if (arr_data.length > 0)
                        {
                            for (let obj_data of arr_data)
                            {
                                let time_obj_api = formatDate(new Date(obj_data?.['tanggal']),'YYYY-MM-DD');
                                let tangki_id = obj_data?.['tangki_id'];
                                let jenis = obj_data?.['jenis'];

                                // TANGKI ID HARUS UNIK DALAM TABLE (TANGKI ADALAH PEMBANDING SELAIN COMPANY)
                                if (datebegin == time_obj_api &&
                                  tank_name == tangki_id)
                                {

                                    let temp_jenis = arr_temp_jenis?.[tank_name];

                                    if (typeof temp_jenis == 'undefined' || temp_jenis == null)
                                    {
                                          arr_temp_jenis = {
                                              ...arr_temp_jenis,
                                              [tank_name]: jenis
                                          }
                                    }
                                }

                            }
                        }
                      }

                  }

                      // alert(JSON.stringify(result))
                  obj_keys_last_onprogress_1m++;
              })
          })
        }catch(e){
            // throw(e)
            if (e != breakException){
              throw e
            }
        }

        // TUNGGU HINGGA SELESAI
        let intLast = setInterval(()=>{
            if (arr_json_tangki_last_length == obj_keys_last_onprogress_1m){
                // console.error("ARR JSON TANGKI LAST LENGTH : ");
                // console.error(arr_temp_jenis)
                if (Object.keys(arr_temp_jenis).length > 0)
                {
                    this.mst_jenis_by_api = {...arr_temp_jenis}
                }
                else{
                    this.mst_jenis_by_api = {}                  
                }

                clearInterval(intLast)
                callback(arr_temp_jenis);
            }
        })


    }


    // GET JENIS BY API DARI ALL DATA PER JAM
    get_jenis_by_api_filter(tanggal_filter, callback){
        // dapatkan jenis cpo / pko dari api (di prioritaskan utama)

        let breakException = {};
        let all_done = false

        let arr_temp_jenis = {};  // isi dengan 'tangki_1':'PKO', 'tangki_2':'PKO'

        try{

          // Object.keys(arr_json_tangki_last).forEach((tank_name,idx)=>{

              let datebegin = formatDate(new Date(tanggal_filter),'YYYY-MM-DD');

              getApiSync(URL_API_LiVE + "/getJenisByDate?tanggal=" + datebegin, null, null,
                    null, 'application/json'
                  ,"GET"
              )
              .then((result)=>{

                  if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
                  {
                      if (result?.['status'].toString().toLowerCase() == 'success')
                      {
                        // notify('error', result?.['message'])

                        let arr_data = result?.['data'];
                        if (arr_data.length > 0)
                        {
                            for (let obj_data of arr_data)
                            {
                                let time_obj_api = formatDate(new Date(obj_data?.['tanggal']),'YYYY-MM-DD');
                                let tangki_id = obj_data?.['tangki_id'];
                                let jenis = obj_data?.['jenis'];

                                // TANGKI ID HARUS UNIK DALAM TABLE (TANGKI ADALAH PEMBANDING SELAIN COMPANY)
                                if (datebegin == time_obj_api)
                                {
                                    let temp_jenis = arr_temp_jenis?.[tangki_id];

                                    if (typeof temp_jenis == 'undefined' || temp_jenis == null)
                                    {
                                          arr_temp_jenis = {
                                              ...arr_temp_jenis,
                                              [tangki_id]: jenis
                                          }
                                    }
                                }
                            }
                            callback(arr_temp_jenis)
                        }
                        else{
                            arr_temp_jenis = {}
                            callback(arr_temp_jenis)
                        }
                      }
                      else{
                          arr_temp_jenis = {}
                          callback(arr_temp_jenis)
                      }

                  }
                  else{
                      arr_temp_jenis = {}
                      callback(arr_temp_jenis)
                  }

                      // alert(JSON.stringify(result))
                  // obj_keys_last_onprogress_1m++;
              })
          // })
        }catch(e){
            // throw(e)
            if (e != breakException){
              throw e
            }
        }

        // TUNGGU HINGGA SELESAI
        // let intLast = setInterval(()=>{
        //     if (arr_json_tangki_last_length == obj_keys_last_onprogress_1m)
        //     {
        //         // console.error("ARR JSON TANGKI LAST LENGTH : ");
        //         // console.error(arr_temp_jenis)
        //         if (Object.keys(arr_temp_jenis).length > 0)
        //         {
        //             this.mst_jenis_by_api = {...arr_temp_jenis}
        //         }
        //         else{
        //             this.mst_jenis_by_api = {}                  
        //         }

        //         clearInterval(intLast)
        //         callback(arr_temp_jenis);
        //     }
        // })


    }


    get_suhu1M_CPO_PKO(arr_json_tangki_last, callback){
      // DAPATKAN STATUS CPO / PKO dari ketinggian suhu 1 M
        // console.error("(GET SUHU 1M CPO PKO)")
        // console.error(arr_json_tangki_last)

        let arr_raw_all_suhu1m = {};
        let obj_keys_last_onprogress = 0;

        let arr_json_tangki_last_length = Object.keys(arr_json_tangki_last).length;

        console.error ("GET SUHU 1M CPO PKO")

        let obj_keys_last_onprogress_1m = 0;

        let breakException = {};
        let all_done = false

        try{
            Object.keys(arr_json_tangki_last).forEach((tank_name,idx)=>{
                            
                let datebegin = formatDate(new Date(arr_json_tangki_last?.[tank_name]?.['time']),'YYYY-MM-DD');
                let hourbegin = '07:30' 
                let hourlast = '08:00'
    
                this.getDataHour_Await(datebegin, hourbegin, hourlast, null, (res_data)=>{
                    // console.error("RES DATA (GET SUHU 1M CPO PKO)")
                    // console.log(res_data)
                    if (res_data?.['responseCode'] == "200"){

                        // looping array

                        res_data?.['data'].forEach((ele_obj,idx_obj)=>{
                          
                            // console.error("all_done REVISI")
                            // console.error(all_done)
                            // if (all_done){
                            //     console.error(this.mst_1m_cpo_pko)
                            //     throw breakException
                            // }
    
                          // looping array data[0] hanya ada 1 data

                            ele_obj?.['data'].forEach((ele_obj_key, idx_obj_key)=>{
                                // let val = ele_obj_key?.['data'][0];

                                    Object.keys(ele_obj_key).forEach((ele_key, idx_key)=>{
        
                                        let patt = new RegExp(/Temperature Tank [0-9]+.*[0-9]+.*M/,'gi')
                                        let match = patt.exec(ele_key);
                                        if (match != null){
        
                                            let patt_tank = new RegExp(/Tank [0-9]+/,'gi')
                                            let match_tank = patt_tank.exec(match?.['input'])
                                            if (match_tank != null){
        
                                                let tangki_name = '';
        
                                                let find_tank_in_list = this.mst_list_tangki.find(ele=>ele?.['api'].toLowerCase() == match_tank?.[0].toLowerCase())
                                                if (find_tank_in_list){
        
                                                    tangki_name = find_tank_in_list?.['name'];
                                                    // console.log("find_tank_in_list?.['name']")
                                                    // console.log(find_tank_in_list?.['name'])
                                                }
        
                                                // console.log("Hasil PATT EXEC TANK")
                                                // console.log(match_tank[0])
        
                                                let patt_tinggi = new RegExp(/tinggi [0-9]+.*M/,'gi')
                                                let match_patt_tinggi = patt_tinggi.exec(match?.['input'])
                                                if (match_patt_tinggi != null){
        
                                                    let suhu_tinggi_num = parseFloat(match_patt_tinggi[0].replace(/(tinggi|M)/gi,''));
        
                                                    // HARUS AMBIL YANG KETINGGIAN 1 METER
                                                    if (suhu_tinggi_num == 1){
                                                        
                                                        let suhu_1m_val = ele_obj_key?.[ele_key];
        
                                                        // CEK APAKAH (mst_1m_cpo_pko) UNTUK SEMUA TANGKI SUDAH TERISI CPO / PKO
        
                                                        let findTank_1mCpoPko = Object.keys(this.mst_1m_cpo_pko).find(ele=>ele == tangki_name);
                                                        if (findTank_1mCpoPko){
        
                                                            if (this.mst_1m_cpo_pko?.[tangki_name] == '' ||
                                                                this.mst_1m_cpo_pko?.[tangki_name] == null){
                                                                  
                                                                  // [tangki_name]: Math.floor(parseFloat(suhu_1m_val)) <= 39.9999 ? 'PKO' : 'CPO'
                                                                this.mst_1m_cpo_pko = {
                                                                    ...this.mst_1m_cpo_pko, 
                                                                    [tangki_name]: parseFloat(suhu_1m_val) <= 39.9999 ? 'PKO' : 'CPO'
                                                                }
        
                                                                // CEK APAKAH (mst_1m_cpo_pko) UNTUK SEMUA TANGKI SUDAH TERISI CPO / PKO
                                                                
                                                                let all_done_tmp = true;
                                                                // Object.keys(this.mst_1m_cpo_pko).forEach((ele_tank_name)=>{
                                                                //     if (this.mst_1m_cpo_pko[ele_tank_name] == ''){
                                                                //         all_done_tmp = false
                                                                //     }
                                                                // })
                                                                let findEmpty = Object.values(this.mst_1m_cpo_pko).find(ele=>ele == '')
                                                                if (!findEmpty){
                                                                      all_done = true
                                                                      console.error(Object.values(this.mst_1m_cpo_pko))
                                                                }
                                                                // if (all_done_tmp){
                                                                //     all_done = all_done_tmp
                                                                //     console.log(all_done)
                                                                // }
                                                                // ... cek all done
                                                            }
                                                        }
      
        
                                                        // console.log("mst_1m_cpo_pko")
                                                        // console.log(this.mst_1m_cpo_pko)
                                                        // console.log("ele_obj_key[ele_key] : " + ele_obj_key[ele_key])
                                                    }
                                                }
                                            }
        
                                        }
        
                                    })
                                
    
                            })
                        })
                      
    
                    }
    
                    obj_keys_last_onprogress_1m++;
                })
            })
        }catch(e){
            // throw(e)
            if (e != breakException){
              throw e
            }
        }

        // TUNGGU HINGGA SELESAI
        let intLast = setInterval(()=>{
            if (arr_json_tangki_last_length == obj_keys_last_onprogress_1m){
                console.error("ARR JSON TANGKI LAST LENGTH : ");
                clearInterval(intLast)
                callback(this.mst_1m_cpo_pko);
            }
        })

        // this.getDataHour_Await(new Date(), '07:30', '08:00', (res_data)=>{

        //     if (res_data?.['responseCode'] == "200"){
        //       console.log("res data NEW")
        //       console.log(res_data)
        //       arr_raw_all_suhu1m = [
        //           ...arr_raw_all_suhu1m,
        //           ...res_data?.['data']
        //       ]
        //     }
        //     obj_keys_last_onprogress++;
        //     // console.error(obj_keys_last_onprogress)
        // });
    }

  counterNumber(objCounterId,start,end,duration, attr_str1?, status_progress?:boolean, prefix_str?, total_round?){
      // COUNTER NUMBER ANIMATION
        let startTimestamp:any = null;
        
        let count = 0;

        // alert(objCounterId)
        let step = (timestamp) => {
            if (!startTimestamp || startTimestamp == null) {
              startTimestamp = timestamp;
            }

            let progress = Math.min((timestamp - startTimestamp) / duration,1);
            let totalround = total_round ?? 2;
            let totalround_final = Math.pow(10, totalround)
            let value_final = Math.round(((progress * (end - start)) + start) * totalround_final) / totalround_final;

            if (!status_progress)
            {
                if (objCounterId){
                    objCounterId!.innerHTML = 
                        (prefix_str ?? '') +
                        (value_final ? 
                        new Number(value_final).toLocaleString('en-US')
                        // new Number(value_final).toLocaleString('id-ID')
                        : '-') + ' ' + attr_str1;
                }
            }
            else{
                try {
                  if (objCounterId){
                    objCounterId!.style.width = end.toString() + "%"
                  }
                }catch(e){}
            }

            if (progress < 1){
              window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step)
    }

    

    getCompanyList(companyId, callback){
        getApiSync(URL_API_LiVE + "/company/tangki?company_id=" + companyId, null, null, 
              null, 'application/json'
            ,"GET"
        )
        .then((result)=>{
            callback(result)
        })
    }

    

    async processRealTimeNHour(){

      // GET USERNAME LIST (FOR UPDATE USER COMPANY)
      // LEVEL 'ADMIN' DAPAT SET COMPANY USER LEVEL -> 'SUPER USER'
      // LEVEL 'SUPER USER' DAPAT SET COMPANY USER LEVLE -> 'USER'
      // LEVEL 'USER' TIDAK DAPAT MENGATUR USER SIAPAPUN

      let user_level_child = '';
      switch(this.user_level){
        case 'ADMIN': user_level_child = 'SUPER USER'; break;
        case 'SUPER USER': user_level_child = 'USER'; break;
        default: user_level_child = ''
      }

      if (this.user_level != '' && 
          (this.user_level == 'ADMIN' || this.user_level == 'SUPER USER'))
      {
        await this.getListUser(user_level_child, this.user_level, (resultCB)=>{});
      }
    

      let getDeviceValidPattern:any = await this.get_DeviceValidPattern();

      // alert(JSON.stringify(getDevicePattern));

      this.get_company((result_company)=>{

        // set nilai awal untuk "filter company" di atas
        
        this.setDefaultFilterCompany();

        // cari company yang ter-select dari sessionStorage
        // result : 1,2,3 (value tangki)
        let selected_company_str:any;
        if (sessionStorage.getItem("BESTFCOM") != null){
            let bestfcom:any = sessionStorage.getItem("BESTFCOM");
            bestfcom = JSON.parse(bestfcom);

            selected_company_str = bestfcom.map(ele=>ele.value)   // 1,2
        }
        // ... end < Company selected >

        // RESET BEBERAPA DATA MASTER TANGKI
        this.mst_t_max = {};  // volume maksimal
        this.mst_t_tangki = {};  // master tinggi tangki (not use)
        this.mst_t_profile = {};  // master tinggi profile
        this.mst_avg_t_segitiga = {}; // tinggi delta (not use)
        this.mst_t_kalibrasi = {};  // tinggi kalibrasi, acuan sensor off
        this.mst_1m_cpo_pko = {}; // master cpo / pko by suhu ketinggian 1 M
        this.mst_jenis_by_api = {}; // master jenis by api
        this.mst_jenis_by_api_perjam = {}; // kondisi awal hit dari realtime, ada hitung per jam juga
        this.mst_suhu1titik = [];   // master suhu 1 titik

        // GET MASTER data API SUHU 1 TITIK
        this.getAPI_Suhu1Titik(selected_company_str, (resultCB_Suhu)=>{
            
            if (Array.isArray(resultCB_Suhu)){
              this.mst_suhu1titik = [...resultCB_Suhu]
            }
            
            this.getCompanyList(selected_company_str, (resultCB)=>{

              // HANYA AMBIL ID_DEVICE ter-select (MISAL : TANK12_HP_PAMALIAN, TANK34_HP_PAMALIAN)
              // arr_id_device => bisa duplikat data

                this.arr_company_list = [...resultCB];

                let arr_id_device = resultCB.map((ele_gcl,idx_gcl)=>{
                    return ele_gcl?.['id_device']
                })
                // grouping hasil yang duplikat
                let arr_id_device_group = arr_id_device.reduce((arr_tmp, new_val)=>{
                    if (!arr_tmp.includes(new_val)){
                      return [...arr_tmp, new_val]
                    }
                    else{
                      return [...arr_tmp]
                    }
                },[])

                this.global_arr_id_device = [...arr_id_device_group]
                
              // ... end 
    
              // isi mst_list_tangki dari API
                this.mst_list_tangki = [];
      
                if (typeof resultCB?.['statusCode'] != 'undefined' && resultCB?.['statusCode'] != null){
                    let message:any = resultCB?.['msg'] ?? resultCB?.['message'] ?? '';
                    
                    notify('error', message)
                    return
                }
                
                if (Array.isArray(resultCB)){
                  if (resultCB.length > 0){
                      resultCB.forEach((ele_cb,idx_cb)=>{
    
                          // master isi volume maksimal
                          this.mst_t_max = {
                            ...this.mst_t_max,
                            [ele_cb?.['tangki_id']]: ele_cb?.['volume_maks']
                          }
    
                          // master tinggi tangki
                          this.mst_t_tangki = {
                            ...this.mst_t_tangki,
                            [ele_cb?.['tangki_id']]: ele_cb?.['tinggi_tangki']
                          }
    
                          // master tinggi profile
                          this.mst_t_profile = {
                            ...this.mst_t_profile,
                            [ele_cb?.['tangki_id']]: ele_cb?.['tinggi_profile']
                          }
    
                          // master tinggi delta
                          this.mst_avg_t_segitiga = {
                            ...this.mst_avg_t_segitiga,
                            [ele_cb?.['tangki_id']]: ele_cb?.['tinggi_delta']
                          }
    
                          // master tinggi kalibrasi
                          this.mst_t_kalibrasi = {
                            ...this.mst_t_kalibrasi,
                            [ele_cb?.['tangki_id']]: ele_cb?.['tinggi_kalibrasi']
                          }
                          
                          // master jenis by api
                          this.mst_jenis_by_api = {
                            ...this.mst_jenis_by_api,
                            [ele_cb?.['tangki_id']]: ''
                          }
    
                          // master jenis by api
                          this.mst_1m_cpo_pko = {
                            ...this.mst_1m_cpo_pko,
                            [ele_cb?.['tangki_id']]: ''
                          }
    
                          // master jenis by api per jam kondisi awal
                          this.mst_jenis_by_api_perjam = {
                            ...this.mst_jenis_by_api,
                            [ele_cb?.['tangki_id']]: ''
                          }
    
                          // kondisi filter per jam
                          this.mst_1m_cpo_pko_filter = {
                            ...this.mst_1m_cpo_pko_filter,
                            [ele_cb?.['tangki_id']]: ''
                          }
                          
                          this.mst_list_tangki = [
                              ...this.mst_list_tangki,
                              {company: ele_cb?.['company_name'], 
                                name: ele_cb?.['tangki_id'], 
                                api: ele_cb?.['api'], 
                                bgColor_Tangki: ele_cb?.['bg_color_tangki'],
                                bgColor_Company: ele_cb?.['bg_color_company'],
                                bgColor: ele_cb?.['bg_color'],
                                title: ele_cb?.['tangki_name'],
                                value: ele_cb?.['tangki_name'],
                                label: ele_cb?.['tangki_name'],
                                id_device: ele_cb?.['id_device'],
                                centroid: [ele_cb?.['centroid_lng'], ele_cb?.['centroid_lat']],
                                centroid_text: [ele_cb?.['centroid_text_lng'], ele_cb?.['centroid_text_lat']],
                                volume_maks: ele_cb?.['volume_maks'],
                                tinggi_tangki: ele_cb?.['tinggi_tangki'],
                                tinggi_delta: ele_cb?.['tinggi_delta'],
                                tinggi_profile: ele_cb?.['tinggi_profile'],
                                tinggi_kalibrasi: ele_cb?.['tinggi_kalibrasi']
                              }
                          ]
                      })
      
                      this.setState({
                        ...this.state,
                        mst_list_tangki: [...this.mst_list_tangki]
                      })
                  }
                }

              
      
                let length_mst_list_tangki:any = this.mst_list_tangki.length;
      
                postApi(URL_API_IOT_LIVE + "/api-v1/getLastData",null,true,'2',
                {
                  "idDevice": [...this.global_arr_id_device]
                },(res:any)=>{
      
                  if (res?.['responseCode'] == "200"){
                      let res_data:any = res?.['data'];
        
                      if (typeof res_data != 'undefined' && res_data != null){
        
                          // ambil data dengan id devices "BESTAGRO"
                          this.arr_json_alldata = [...
                              res_data.filter((res:any)=>{
        
                                  // const device_patt = new RegExp(/BESTAGRO_[0-9]+_NEW/,'gi')
                                  // penamaan device baru => BESTAGRO_001_NEW
                                
                                  if (typeof res?.['id_device'] != 'undefined' &&
                                      res?.['id_device'] != null && 
                                      (
                                          getDeviceValidPattern.find((val, idx)=> res?.['id_device'].toString().toUpperCase().indexOf(val) != -1)
                                          // HP_PAMALIAN => devices baru
                                          // res?.['id_device'].toString().toUpperCase().indexOf("BESTAGRO") != -1 ||
                                          // res?.['id_device'].toString().toUpperCase().indexOf("HP_PAMALIAN") != -1 ||
                                          // res?.['id_device'].toString().toUpperCase().indexOf("WSSLTANK") != -1 ||
                                          // res?.['id_device'].toString().toUpperCase().indexOf("TASK1TANK") != -1
                                      )
                                  )
                                      // device_patt.test(res?.['id_device']))
                                  {
                                      return true
                                  }
                              })
                          ]
        
                          // isi data paling uptodate per tangki
                          this.arr_json_alldata.forEach((ele:any) => {
                              let data_arr:any = (ele?.['data']?.[0]);

        
                              // last tangki 4
                              // console.log("ini element ")
                              // console.log(ele)


                              for (let mst_list_tangki of this.mst_list_tangki){
                                // sample : update_to_arr_json_tangki_last (
                                                  // ele?.['data']?.[0], 
                                                  // {data:[{}], id_device:"BESTAGRO_002", rawData:"477|478|431|428|431|445|428|430|432|426|429|816", time:"2023-01-29 19:27:40" }
                                                  // "tangki_4",
                                                  // "tank 4"
                                            // )
                                  this.update_to_arr_json_tangki_last(data_arr, ele, mst_list_tangki?.['name'], mst_list_tangki?.['api']);
                              }
        
                              if (Object.keys(this.arr_json_tangki_last).length == length_mst_list_tangki){
                                  return
                              }
        
                          });
        
                          console.log("array json tangki last")
                          console.log(this.arr_json_alldata)
                          console.log(this.arr_json_tangki_last);
                      }
        
                      // ===== MODUS DATA REAL TIME =====
        
                      // AMBIL DATA YANG PALING SERING MUNCUL UNTUK MASING-MASING TANGKI
                      // AMBIL KELIPATAN 10 MENIT TERAKHIR
                      // MISAL : WAKTU 07:26, AMBIL 07:11 - 07:20
                      // MISAL : WAKTU 07:00, AMBIL 06:41 - 06:50
        
                      
                      // GET COMPANY LIST BY API
                      // this.get_company((result_company)=>{
      
                          // GET JENIS BY API (di utamakan)
                
                          // console.log(this.arr_json_tangki_last)

                          // console.log(this.arr_company_list)
                          // console.log(this.state?.['filter_company'])
                          // console.log(this.arr_json_tangki_last)

                          let arr_json_tangki_last_filter:any = {};

                          if (Array.isArray(this.state?.['filter_company']))
                          {
                            this.state?.['filter_company'].forEach((obj, idx)=>{
                                let findCompanyId = this.arr_company_list.filter(x => x.company_id == obj?.['value'])
                                if (findCompanyId.length > 0){

                                    findCompanyId.forEach((obj2, idx2) => {
                                        let tangki_id = obj2?.['tangki_id'];

                                        arr_json_tangki_last_filter = {
                                            ...arr_json_tangki_last_filter,
                                            [tangki_id]:this.arr_json_tangki_last?.[tangki_id]
                                        }
                                    })

                                }
                            });

                            this.arr_json_tangki_last = {...arr_json_tangki_last_filter};

                            console.error("REVISI BARU")
                            console.error(arr_json_tangki_last_filter)
                            console.error("==== REVISI BARU")
                          }

                          
           
                          // console.error(this.arr_json_tangki_last)

                          this.get_jenis_by_api_lastdata(this.arr_json_tangki_last, (result_getjenis)=>{
            
                              // KARENA DATA REAL TIME, MAKA LANGSUNG DI COPY KE VARIABLE mst_jenis_by_api_perjam 
                              this.mst_jenis_by_api_perjam = {...this.mst_jenis_by_api};
            
                              this.processPreviousMinTank_fromLast(this.arr_json_tangki_last)

                          })
                      // })
        
        
                      this.hide_amlogo();
                      
                      // return
                      // ===== <END MODUS DATA> =====
        
                      
                      // ISI DATA arr_json_tangki_last (di proses pada kalkulasi tinggi)
                      // 
                      // this.kalkulasi_tinggi_tangki(()=>{
                      //   this.kalkulasi_suhu_tangki(()=>{
                      //     this.kalkulasi_set_others_tangki(()=>{
                      //       this.kalkulasi_volume_tangki(()=>{
        
                      //           let getFirstTangkiList = this.mst_list_tangki.length > 0 ? {...this.mst_list_tangki[0]} : {}
                      //           this.getFirstTangki_Default = {...getFirstTangkiList}
                        
                      //           this.setState({
                      //             ...this.state,
                      //             chartSuhuTinggiJam: {
                      //                   ...this.state.chartSuhuTinggiJam,
                      //                   suhuTinggiSelected: {...getFirstTangkiList}
                      //             }
                      //           })
        
                      //           this.getDateMax_From_TangkiLast();
        
                      //           setTimeout(()=>{
                      //             this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last);
                      //           },100)
        
                      //       })
                      //     });
                      //   });
                      // });
                  }
                  else if (res?.['statusCode'] == '400'){
                    notify('error',res?.['msg'])
                  }
                })
      
            })
        })
      })
    }

    getAPI_Suhu1Titik(companyId, callback){
        getApiSync(URL_API_LiVE + "/company/tangki/suhu1titik?company_id=" + companyId, null, null, 
              null, 'application/json'
            ,"GET"
        )
        .then((result)=>{
            let statusCode:any = result?.['statusCode'];
            if (typeof statusCode != 'undefined' && statusCode.toString() != "200"){
                notify('error', result?.['message'])
                return
            }
          
            callback(result)
        })
    }

    resetState(callback){

      document.getElementById("angka-id-percent-cpo")!.innerHTML = "- %"
      document.getElementById("angka-id-percent-pko")!.innerHTML = "- %"
      document.getElementById("angka-id-cpo")!.innerHTML = "- kg"
      document.getElementById("angka-id-pko")!.innerHTML = "- kg"
      document.getElementById("progress-bar-custom-width-cpo")!.style.width = "0%" 
      document.getElementById("progress-bar-custom-width-pko")!.style.width = "0%" 

      this.data_jaraksensor_tangki_perjam_series = []
      this.data_jaraksensor_tangki_perjam_categories = []
      this.data_suhu_tangki_perjam_series = []
      this.data_suhu_tangki_perjam_categories = []
      this.data_tinggi_tangki_perjam_categories = []
      this.data_tinggi_tangki_perjam_series = []
      this.data_volume_tangki_perjam_categories = []
      this.data_volume_tangki_perjam_series = []


      // filter_company tidak boleh di reset karena sebagai variabel company yang ter-select
      setTimeout(()=>{
          this.setState({
              floatingMenu:{
                isOpen: false
              },
              mst_list_tangki:[],  // untuk parsing ke card
              modal:{
                ...this.state.modal,
                changePWD:{
                  show: false,
                  loader: false
                },
                createUser:{
                  show: false,
                  loader: false
                },
                updateJenis:{
                  show: false,
                  loader: false,
                  input:{
                    dateSelected: new Date(),
                    filterOptions_Company: [],
                    filterOptions_Tangki: [],
                    filterOptions_Jenis: [
                      {value:'CPO', label:'CPO'},
                      {value:'PKO', label:'PKO'}
                    ],
                    company: {
                      value: null,
                      isLoading: true
                    },
                    tangki: {
                      value: null,
                      isLoading: true
                    },
                    jenis: {
                      value: null,
                      dataSaved:null    // untuk tampil di kanan bawah dari jenis sebagai informasi jenis yang sudah tersimpan (acuan'y tanggal, company_id, tangki_name)
                    }
                  },
                }
              },
    
              dateSelected:new Date(),
              timeSelected:[null,null],
              show:{
                datepicker:false,
                timepicker:false,
                iconmap:false   // icon map deck.gl
              },
              waktu:{
                tanggal:'',
                tanggal_jam:''
              },
              realtime:{
                tangki_1:{
                  tanggal:'',
                  tanggal_jam:'',
                  tinggi:'-',
                  suhu:'-',
                  volume:'-'
                },
                tangki_2:{
                  tanggal:'',
                  tanggal_jam:'',
                  tinggi:'-',
                  suhu:'-',
                  volume:'-'
                },
                tangki_3:{
                  tanggal:'',
                  tanggal_jam:'',
                  tinggi:'-',
                  suhu:'-',
                  volume:'-'
                },
                tangki_4:{
                  tanggal:'',
                  tanggal_jam:'',
                  tinggi:'-',
                  suhu:'-',
                  volume:'-'
                },
              },
    
              loader:{
                  jarak_sensor_jam: true,
                  tinggi_isi: true,
                  tinggi_isi_jam: true,
                  tinggi_isi_modus_jam: true,
                  suhu_tangki: true,
                  suhu_tangki_modus_jam: true,
                  suhu_tangki_jam: true,
                  suhu_tinggi_tangki_jam:true,
                  volume_tangki_jam: true,
                  volume_isi: true
              },
              chartJarakSensorJam:{...this.setChartJarakSensorJam},
              chartTinggi:{...this.setChartTinggi},
              chartTinggiJam:{...this.setChartTinggiJam},
              chartTinggiModusJam:{...this.setChartTinggi_Modus_Jam},
              chartSuhuJam:{...this.setChartSuhuJam},
              chartSuhuModusJam:{...this.setChartSuhuModusJam},
              chartSuhuTinggiJam:{...this.setChartSuhuTinggiJam},
              chartVolumeJam:{...this.setChartVolumeJam}
          });
      },50)

      setTimeout(()=>{
          callback()
      },70)
    }

    
    intervalShowHideBox(param_TangkiName:any){

        let currentVal:any=1;
        let prevVal:any=2;
        let awalCondition:boolean = true;

        this.intervalBox = {
            ...this.intervalBox,
            [param_TangkiName]:setInterval(()=>{
                // console.log("Previous Value : " + prevVal);
                // console.log("Current Value : " + currentVal);

                if (!awalCondition){

                    // PREVIOUS BOX
                    prevVal = currentVal;

                    if ((currentVal+1) > 2){
                        currentVal = 1
                    }else{
                        currentVal += 1
                    }

                        // hide / show previous box
                    let prevClassNamaSubSubInfo:any;

                    if (prevVal == 1){
                        prevClassNamaSubSubInfo = ".box-subsubinfo-1"
                    }else if (prevVal == 2){
                        prevClassNamaSubSubInfo = ".box-subsubinfo-2"
                    }

                    // BARIS 1 BOX 1 (TINGGI PROFILE -> VOLUME LITER)
                    var prevClassName = "." + param_TangkiName + " .box-info-1 .box-subinfo-1 " + prevClassNamaSubSubInfo;
                    let prevClass = document.querySelector(prevClassName);

                    prevClass?.classList.remove("box-hide");
                    prevClass?.classList.remove("box-show");
                    prevClass?.classList.add("box-hide");

                    // BARIS 1 BOX 2 (BEDA LITER)
                    var prevClassName2 = "." + param_TangkiName + " .box-info-1 .box-subinfo-2 " + prevClassNamaSubSubInfo;
                    let prevClass2 = document.querySelector(prevClassName2);

                    prevClass2?.classList.remove("box-hide");
                    prevClass2?.classList.remove("box-show");
                    prevClass2?.classList.add("box-hide");

                    // BARIS 2 BOX 1 (BEDA LITER)
                    var prevClassName3 = "." + param_TangkiName + " .box-info-2 .box-subinfo-1 " + prevClassNamaSubSubInfo;
                    let prevClass3 = document.querySelector(prevClassName3);

                    prevClass3?.classList.remove("box-hide");
                    prevClass3?.classList.remove("box-show");
                    prevClass3?.classList.add("box-hide");

                    // CURRENT BOX
                    let curClassNamaSubSubInfo:any;

                    if (currentVal == 1){
                        curClassNamaSubSubInfo = ".box-subsubinfo-1"
                    }else if (currentVal == 2){
                        curClassNamaSubSubInfo = ".box-subsubinfo-2"
                    }

                    // BARIS 1 BOX 1
                    var curClassName = "." + param_TangkiName + " .box-info-1 .box-subinfo-1 " + curClassNamaSubSubInfo;
                    let curClass = document.querySelector(curClassName);

                    if (curClass?.classList.contains("box-hide")){
                      curClass?.classList.remove("box-hide");
                    }
                    if (curClass?.classList.contains("box-show")){
                      curClass?.classList.remove("box-show");
                    }
                    curClass?.classList.add("box-show");

                    setTimeout(()=>{
                      if (prevClass?.classList.contains("box-hide")){
                        prevClass?.classList.remove("box-hide");
                      }
                    },2000)


                    // BARIS 1 BOX 2
                    var curClassName2 = "." + param_TangkiName + " .box-info-1 .box-subinfo-2 " + curClassNamaSubSubInfo;
                    let curClass2 = document.querySelector(curClassName2);
                    if (curClass2?.classList.contains("box-hide")){
                      curClass2?.classList.remove("box-hide");
                    }
                    if (curClass2?.classList.contains("box-show")){
                      curClass2?.classList.remove("box-show");
                    }
                    curClass2?.classList.add("box-show");
                    setTimeout(()=>{
                      if (prevClass2?.classList.contains("box-hide")){
                        prevClass2?.classList.remove("box-hide");
                      }
                    },2000)

                    // BARIS 2 BOX 1
                    var curClassName3 = "." + param_TangkiName + " .box-info-2 .box-subinfo-1 " + curClassNamaSubSubInfo;
                    let curClass3 = document.querySelector(curClassName3);
                    if (curClass3?.classList.contains("box-hide")){
                      curClass3?.classList.remove("box-hide");
                    }
                    if (curClass3?.classList.contains("box-show")){
                      curClass3?.classList.remove("box-show");
                    }
                    curClass3?.classList.add("box-show");
                    setTimeout(()=>{
                      if (prevClass3?.classList.contains("box-hide")){
                        prevClass3?.classList.remove("box-hide");
                      }
                    },2000)

                    // clearInterval(this.intervalBox?.[param_TangkiName]);
                }
                awalCondition = !awalCondition;
            },3000)
        }
    }

    async componentDidMount() {
  
      // }
      // let obj = document.getElementById("angka-id");
      // this.counterNumber(obj, 0, 100000, 3000)


      // BESTLGN => STATUS LOGIN (1 => 'VALID LOGIN')
      if (localStorage.getItem("BESTLGN") == null){

          // HAPUS KEY EXPIRED
          if (localStorage.getItem("BESTEXP") != null){
              localStorage.removeItem("BESTEXP")  
          }

          window.location.href = "/login"
      }
      else{
          try {
            let dec_bestlgn = CryptoJS.AES.decrypt(localStorage.getItem("BESTLGN"),encryptCode).toString(CryptoJS.enc.Utf8);
            if (dec_bestlgn != "1"){
                // HAPUS KEY EXPIRED
                if (localStorage.getItem("BESTEXP") != null){
                    localStorage.removeItem("BESTEXP")  
                }
                window.location.href = "/login"
            }
          }catch(e){
              // HAPUS KEY EXPIRED
              if (localStorage.getItem("BESTEXP") != null){
                  localStorage.removeItem("BESTEXP")  
              }
              window.location.href = "/login"
          }
      }

      // TANGGAL EXPIRED (JIKA EXPIRED, OTOMATIS BALIK KE LOGIN)
      // BESTEXP => EXPIRED DATE
      // jika tidak ada di localstorage, maka akan di buatkan otomatis localstorage nya (di tambah 3 jam dari sekarang)

      if (localStorage.getItem("BESTEXP") == null){
          let enc_time_exp = generateExpiredDate('hours',3);
          if (localStorage.getItem("BESTEXP") == null) 
          {
              localStorage.setItem("BESTEXP", enc_time_exp)
          }
      }
      else{
          let enc_bestexp = localStorage.getItem("BESTEXP");
          if (enc_bestexp != null){

              let dec_bestexp = Number(CryptoJS.AES.decrypt(enc_bestexp, encryptCode).toString(CryptoJS.enc.Utf8));
              if (new Date(dec_bestexp) <= new Date()){

                  if (localStorage.getItem("BESTLGN") != null){
                      localStorage.removeItem("BESTLGN")
                  }

                  window.location.href = "/login"
              }
          }
      }
      
      // USER PARSING TO DROPDOWN TITLE
      if (localStorage.getItem("BESTUSRP") != null){
          try {
            let dec_bestusrp = CryptoJS.AES.decrypt(localStorage.getItem("BESTUSRP"),encryptCode).toString(CryptoJS.enc.Utf8);
            if (dec_bestusrp != ""){
                this.user_title = dec_bestusrp[0].toUpperCase() + dec_bestusrp.slice(1).toLowerCase();
            }
          }catch(e){this.user_title = '';}
      }

      // LEVEL TO DROPDOWN FOOTER
      if (localStorage.getItem("BESTLVL") != null){
          try {
            let dec_bestlevel = CryptoJS.AES.decrypt(localStorage.getItem("BESTLVL"),encryptCode).toString(CryptoJS.enc.Utf8);
            if (dec_bestlevel != ""){
                this.user_level = dec_bestlevel;
            }
          }catch(e){this.user_level = '';}
      }


      this.processRealTimeNHour()

      // SAMPLE EXPORT TO EXCEL
        // this.data_Export = [
        //   {
        //     name: "Johson",
        //     amount: 500,
        //     sex: 'M',
        //     is_married: true
        // },
        // {
        //     name: "Monika",
        //     amount: 355000,
        //     sex: 'F',
        //     is_married: false
        // },
        // {
        //     name: "John",
        //     amount: 250000,
        //     sex: 'M',
        //     is_married: false
        // },
        // {
        //     name: "Josef",
        //     amount: "450500",
        //     sex: 'M',
        //     is_married: true
        // }

        //   // {
        //   //   columns:[
        //   //     {
        //   //       value: "Headings",
        //   //       widthPx: 100,
        //   //       style: { font: { sz: "20", bold:true}}
        //   //     },
        //   //     {
        //   //       value: "Text Style",
        //   //       widthPx: 100,
        //   //       style: { font: { sz: "24", bold:true}}
        //   //     },
        //   //     {
        //   //       value: "Colors",
        //   //       widthPx: 100,
        //   //       style: { font: { sz: "40", bold:true}}
        //   //     }
        //   //   ],
        //   //   data: [
        //   //     [
        //   //       { value: "H1", style: {font: {sz: "40", bold:true}}},
        //   //       { value: 50, style: {font: {bold:true}}},
        //   //       { value: "Red", style: {fill: 
        //   //                                   {patternType:"solid", fgColor: { rgb: "FF0000"},
        //   //                                   bgColor: { rgb: "FF0000"}}
        //   //                               }}
        //   //     ],
        //   //     [
        //   //       { value: "H2", style: {font: {sz: "18", bold:true}}},
        //   //       { value: 10},
        //   //       { value: "Blue", style: {fill: 
        //   //                                   {patternType:"solid", fgColor: { rgb: "FF00FF"},
        //   //                                   bgColor: { rgb: "FF00FF"}}
        //   //                               }
        //   //       }
        //   //     ]
        //   //   ]
        //   // }
        // //   // {
        // //   //   // xSteps: 0,
        // //   //   // ySteps: 3,
        // //   //   columns:[
        // //   //     {
        // //   //       value: "Headings",
        // //   //       width: {wch:200},
        // //   //       style: { font: { sz: "20", bold:true}}
        // //   //     },
        // //   //     {
        // //   //       value: "Text Style",
        // //   //       widthPx: 180,
        // //   //       style: { font: { sz: "24", bold:true}}
        // //   //     },
        // //   //     {
        // //   //       value: "Colors",
        // //   //       widthPx: 180,
        // //   //       style: { font: { sz: "40", bold:true}}
        // //   //     }
        // //   //   ],
        // //   //   data: [
        // //   //     [
        // //   //       { value: "H1", style: {font: {sz: "40", bold:true}}},
        // //   //       { value: "Bold", style: {font: {bold:true}}},
        // //   //       { value: "Red", style: {fill: 
        // //   //                                   {patternType:"solid", fgColor: { rgb: "FFFF0000"},
        // //   //                                   bgColor: { rgb: "FFFF0000"}}
        // //   //                               }}
        // //   //     ],
        // //   //     [
        // //   //       { value: "H2", style: {font: {sz: "18", bold:true}}},
        // //   //       { value: "Underline", style: {font: {underline:true}}},
        // //   //       { value: "Blue", style: {fill: 
        // //   //                                   {patternType:"solid", fgColor: { rgb: "FFFFAA00"},
        // //   //                                   bgColor: { rgb: "FFFFAA00"}}
        // //   //                               }}
        // //   //     ]
        // //   //   ]
        // //   // }
        // ] 

        // this.setState({ 
        //   waktu:{
        //     tanggal:formatDate(new Date(),'DD MMMM YYYY'),
        //     tanggal_jam:formatDate(new Date(),'DD MMMM YYYY HH:mm:ss')
        //   }
        // })

        // this.generateAMChart_Column3D(
        //   [
        //     {
        //       "country": "USA",
        //       "visits": 4025
        //     }, {
        //       "country": "China",
        //       "visits": 1882
        //     }
        //   ]
        // )
        


        // hit api yang getAllData
        // await postApi("https://platform.iotsolution.id:7004/api-v1/getLastData",null,true,'2',null,(res:any)=>{


        // dapatkan tanggal terakhir dari semua tangki yang ter-update
        // this.getDateMax_From_TangkiLast();
        // untuk chart per jam
        
        // alert(JSON.stringify(this.state.chartSuhuTinggiJam.suhuTinggiSelected))
        // alert(JSON.stringify(this.getFirstTangki_Default))

        // setTimeout(()=>{
        //   this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last);
        // },100)

        
        // alert(formatDate(new Date(),'HH:mm'))
        return
    }

    setDefaultFilterCompany(){
        // check di sessionStorage utk company yang di pilih 
        // "BESTFCOM" // BEST FILTER COMPANY

        // options_filter_company => variable yang berisi semua company dari database

        if (sessionStorage.getItem("BESTFCOM") == null)
        {
            // jika null, maka di set secara default value untuk company index pertama 
            if (this.options_filter_company.length > 0)
            {
                this.setState({
                  ...this.state,
                  filter_company: [{...this.options_filter_company[0]}]
                })
                
                sessionStorage.setItem("BESTFCOM", JSON.stringify([{...this.options_filter_company[0]}]))
            }
            // if (this.options_filter_company)
        }
        else{

            if (sessionStorage.getItem("BESTFCOM") != null){
              let bestfcom:any = sessionStorage.getItem("BESTFCOM") ?? [];
              bestfcom = JSON.parse(bestfcom);

              // jika jumlah data di sessionstorage lebih besar dari database company,
              // maka ambil yang options_filter_company (dari database)
              if (bestfcom.length > this.options_filter_company.length){
                  this.setState({
                    ...this.state,
                    filter_company: [{...this.options_filter_company[0]}]
                  })
                  // set ulang sessionStorage
                  if (sessionStorage.getItem("BESTFCOM") != null){
                      sessionStorage.removeItem("BESTFCOM")
                  }
                  sessionStorage.setItem("BESTFCOM", JSON.stringify([{...this.options_filter_company[0]}]))
              }
              else{
                // JIKA TIDAK ADA DATA BESFCOM atau posisi index pertama "{}", 
                // maka di paksa data pertama options_filter_company

                  if (bestfcom.length == 0 ||
                      (bestfcom.length > 0 && 
                        JSON.stringify(bestfcom[0]) == "{}"
                      )
                  )
                  {
                    sessionStorage.setItem("BESTFCOM", JSON.stringify([{...this.options_filter_company[0]}]))
                  }
                  
                  this.setState({
                      ...this.state,
                      filter_company: [...bestfcom]
                  })
              }

            }
        }
        // ... end BESTFCOM
    }

    hide_amlogo(){
      // HILANGKAN LOGO AM CHARTS KIRI BAWAH
      setTimeout(()=>{
          let am_logo = document.querySelectorAll('#chartdiv svg g[aria-labelledby]')
          let g_idx_length:number = am_logo.length-1;

          // console.log("am_logo[g_idx_length-1]")
          // console.log(am_logo[g_idx_length])
        
          if (am_logo?.[g_idx_length] != null){
            // document.getElementById('#chartdiv')!.style .display = "none"

            am_logo.forEach((ele,idx)=>{
                if (idx == g_idx_length){
                  // SET ID DAHULU, agar bisa dihapus
                    ele.setAttribute("id", "amchart-custom-" + idx.toString())
                }
            })

            // am_logo[g_idx_length].style.display = "none";
          }

          let am_logos = document.querySelectorAll('#chartdiv svg g[aria-labelledby]')
          am_logos.forEach((ele,idx)=>{
              if (idx == g_idx_length){
                  // console.error("ini")
                  // console.error(ele.id);
                  document.getElementById(ele.id)!.style.display = "none";
              }
          })

          // am_logo.forEach((ele)=>{
          //   console.log(ele)
          // })
      },10)
    }

    processPreviousMinTank_fromLast(arr_json_tangki_last:any){
        // array json tangki last (REAL TIME)
        console.error(arr_json_tangki_last)

        this.arr_tangki_last_from_dataHour = {};

        // variable menampung data semua array based on looping nama tangki (ada 4), ada kemungkinan double
        let arr_raw_all:any = [];

        // LOOPING NAMA TANGKI (KEY PERTAMA)
        let obj_keys_last:any = Object.keys(arr_json_tangki_last);


        // panjang tangki obj_keys_last
        let obj_keys_last_length:any = obj_keys_last.length;
        let obj_keys_last_onprogress:any = 0;


        obj_keys_last.forEach((ele_name, idx_rec)=>{

            let time_tank:any;

            try {
              time_tank = new Date(arr_json_tangki_last[ele_name]?.['time']);
            }catch(e){
              time_tank = null
            }
            
            // FOR TEST
            // 23 feb '23 jam 7:30
            // time_tank = new Date(2023,1,23, 7,30,0)

            if (time_tank != null){

              // **UPDATE KE HITUNG-AN TER-UPDATE
              //  //  === Mode Hitung Waktu *baru => 0-9 menit (tot:10), 10-19 (tot:10), 20-29 (tot:10), 30-39 (tot:10), 40-49 (tot:10), 50-59 (tot:10)
              // console.error('Time Tank, Tangki : ', ele_name ,'\n ', time_tank)

              let get_timetank_minus10:any = time_tank.getTime() - (10 * 60 * 1000);  // waktu tangki last data dikurangi 10 menit
              let get_timetank_minus10_Minute:any = new Date(get_timetank_minus10).getMinutes(); // ambil Menit
              
              let range_waktu_min:any, range_waktu_max:any;
              
              let find_range_waktu = this.range_waktu.find(x => x.start <= get_timetank_minus10_Minute && x.end >= get_timetank_minus10_Minute);
              if (find_range_waktu){

                let time_tank_range:any = new Date(get_timetank_minus10);  // new Date copy independen agar tidak sinkron dengan time_tank

                range_waktu_min = new Date(new Date(time_tank_range.setMinutes(find_range_waktu?.['start'])).setSeconds(0));
                range_waktu_max = new Date(new Date(time_tank_range.setMinutes(find_range_waktu?.['end'])).setSeconds(59));
              }

              let time_tank_time_begin:any, time_tank_time_last:any;  // tanggal yg di filter sudah fix begin dan last
              time_tank_time_begin = range_waktu_min;
              time_tank_time_last = range_waktu_max;

              let datebegin:any = formatDate(time_tank_time_begin,'YYYY-MM-DD');

              let hourbegin = !isNaN(time_tank_time_begin) ? formatDate(time_tank_time_begin,'HH:mm') : '';
              let hourlast = !isNaN(time_tank_time_last) ? formatDate(time_tank_time_last,'HH:mm') : '';
              
              // console.log("==== MODEL BARU ====")
              // console.log('Tangki : ', ele_name ,' ,\nTime Tank : ', time_tank, ' ,\nTime Minus 10 Menit : ', new Date(get_timetank_minus10));
              // console.log('Time Tank minus 10 : ', new Date(get_timetank_minus10));
              // console.log('\nget_timetank_minus10_Minute : ', get_timetank_minus10_Minute)
              // console.log('Range Waktu Minimal : ', range_waktu_min, '\n');
              // console.log('Range Waktu Maksimal : ', range_waktu_max, '\n');
              // console.log("====> MODEL BARU <====")
              

              // // // === Mode Hitung Waktu *lama => 0-10 menit (total 11), 11-20 (tot:10), 21-30 (tot:10), 31-40 (tot:10), 41-50 (tot:10), 51-59 (tot:9)
              //   // jika tanggal, maka di proses
              //   // let ten_fold_prior:any = 1000 * 60 * 
              //   let time_tank_getMinutes:any = time_tank.getMinutes();    //menit : 41
              //   let mod_ten:any = time_tank_getMinutes % 10;        //mod : 1
              //   let time_tank_dispute:any = time_tank_getMinutes - mod_ten; // 41-1=40

              //   let time_tank_substract_minutes:any;
              //   let time_tank_time_begin:any, time_tank_time_last:any;  // tanggal yg di filter sudah fix begin dan last

              //   let time_tank_setmin_new:any;   // set minute
              //   let time_tank_setmin_dispute:any;

              //   if (time_tank_dispute == time_tank_getMinutes){
              //     // jika menit nya sama, maka kurangi 19 menit (00:00, 10:00, 20:00)
              //     // jika tidak, maka kurangi 9 menit
              //       time_tank_substract_minutes = 19 * 60 * 1000    // 19 menit
              //   }
              //   else{
              //       time_tank_substract_minutes = 9 * 60 * 1000     // 9 menit

              //       // time_tank_time_begin = new Date(time_tank_time_begin.setSeconds(0));
              //   }

              //     time_tank_setmin_new = time_tank   // ambil master 07:41
              //     time_tank_setmin_new = new Date(time_tank_setmin_new).setMinutes(time_tank_dispute)    // set ke 07:40

              //     // time START *
              //     // misal tgl 25 feb 2023 00:05:00, 
              //     //  maka time begin nya harusnya menjadi 24 feb 2023 23:51
              //     time_tank_time_begin = new Date(time_tank_setmin_new - time_tank_substract_minutes);    // 07:40 kurang 9 menit atau 07:00 kurang 19 menit
              //     time_tank_time_begin = new Date(time_tank_time_begin.setSeconds(0));

              //     // time END * (ditambah 9 menit dari time start)
              //     let time_minutes_add_9:any = 9 * 60 * 1000; 
              //     let time_minutes_add_8:any = 8 * 60 * 1000;   // tambah 8 menit
              //     // jika setelah ditambah 9 menit menjadi 00 (pindah tanggal berikutnya), maka di tambah 8 menit saja
              //     // misal tgl 25 feb 2023 00:05:00, 
              //     //  maka time last nya harusnya menjadi 24 feb 2023 23:59

              //     let time_tank_begin_plus_9 = new Date(parseFloat(time_tank_time_begin.getTime()) + parseFloat(time_minutes_add_9));
              //     if (time_tank_begin_plus_9.getMinutes() == 0){
              //         time_tank_time_last = new Date(parseFloat(time_tank_time_begin.getTime()) + parseFloat(time_minutes_add_8));
              //     }
              //     else{
              //         time_tank_time_last = new Date(parseFloat(time_tank_time_begin.getTime()) + parseFloat(time_minutes_add_9));
              //     }
              //     // set sampai detik 59
              //     time_tank_time_last = new Date(time_tank_time_last.setSeconds(59));

              //     // time_tank_time_last.setMinutes(59);
              //     // alert(time_tank_time_last
                  
              //     let datebegin:any = formatDate(time_tank_time_begin,'YYYY-MM-DD');

              //     if (time_tank_time_begin.getMinutes() == 1){
              //         time_tank_time_begin = new Date(time_tank_time_begin.setMinutes(0));
              //     }
                  
              //     let hourbegin = formatDate(time_tank_time_begin,'HH:mm');
              //     let hourlast = formatDate(time_tank_time_last,'HH:mm');
                  
              //   //  //  === end Mode Hitung *lama ===


                  // simpan data tanggal realtime beserta jam
                  // [{datebegin:..., datelast:..., hourbegin:..., hourlast:...}]
                  this.arr_date_realtime = [
                    ...this.arr_date_realtime,
                    {
                      time_tank,
                      time_tank_getTime: !isNaN(time_tank) ? time_tank.getTime() : 0,
                      datebegin: time_tank_time_begin,
                      datelast: time_tank_time_last,
                      hourbegin,
                      hourlast
                    }
                  ]

                  // masukkan datebegin, datelast, hourbegin, hourlast ke arr_json_tangki_last
                  this.arr_json_tangki_last[ele_name] = {
                      ...this.arr_json_tangki_last[ele_name],
                      datebegin: time_tank_time_begin,
                      datelast: time_tank_time_last,
                      hourbegin,
                      hourlast
                  }

                  // alert(hourbegin + '\n' + hourlast)

                  console.error('Time Master : ' + time_tank + 
                        '\nTime Start : ' + time_tank_time_begin + 
                        '\nTime End : ' + time_tank_time_last)
                    
                  let idDevice:any = null;

                  let find_idDevice_Tangki = this.mst_list_tangki.find(v => v.name == ele_name);
                  if (find_idDevice_Tangki){
                      idDevice = find_idDevice_Tangki?.['id_device']
                  }


                  this.getDataHour_Await(datebegin, hourbegin, hourlast, idDevice, (res_data)=>{
                      // console.error("SELESAI AWAIT POST API " + ele_name)
                      // console.error("getDataHour_Await Data:")
                      // console.error(res_data)

                      // console.log(res_data?.['data'])
                      
                      if (res_data?.['responseCode'] == "200"){
                        console.log("res data NEW")
                        console.log(res_data)
                        arr_raw_all = [
                            ...arr_raw_all,
                            ...res_data?.['data']
                        ]
                      }
                      obj_keys_last_onprogress++;
                      // console.error(obj_keys_last_onprogress)
                      
                    });

                // alert(time_tank_getMinutes + ' -> ' + mod_ten + ' -> ' +
                //       time_tank_dispute + ' -> \n Time Begin : ' + time_tank_time_begin + 
                //       '\nTime Master : ' + new Date(time_tank))
            }
        })

        let intOnProgress = setInterval(()=>{
            
            if (obj_keys_last_onprogress == obj_keys_last_length){
              // console.error(' ==== ARR RAW ALL ====')
              // console.error(arr_raw_all)

              let arr_raw_reduce:any = this.grouping_Data_Raw(arr_raw_all);

              // *** REALTIME (kondisi jika tidak ada data 10 menit terakhir, maka pakai last data) ***
              // jika sekumpulan data realtime (10 menit terakhir) kosong,
              //    maka pakai yang last data tangki (tanpa bandingkan terbesar karena cuma satu data)

              if (Array.isArray(arr_raw_reduce))
              {
                  if (arr_raw_reduce.length === 0)
                  {
                      Object.keys(this.arr_json_tangki_last).forEach((ele_name,idx_name)=>{
                          let temp_obj = {};
                          temp_obj = {
                              ...temp_obj,
                              data: [
                                  {...this.arr_json_tangki_last?.[ele_name]}
                              ],
                              id_device: this.arr_json_tangki_last?.[ele_name]?.['id_device'],
                              rawData: this.arr_json_tangki_last?.[ele_name]?.['rawData'],
                              time: this.arr_json_tangki_last?.[ele_name]?.['time']
                          }
                          arr_raw_reduce = [
                              ...arr_raw_reduce,
                              {...temp_obj}
                          ]
                      })
                  }
                  else
                  {
                      // cek di object tangki last (id_device)
                      let arr_json_tangki_last_tankname = Object.keys(this.arr_json_tangki_last);
                      if (arr_json_tangki_last_tankname.length > 0){
                        
                          let arr_temp_device:any = [];
                          // grouping id device dari last data
                          // e.g. ['TANK12_HP_PAMALIAN', 'TANK34_HP_PAMALIAN']

                          arr_json_tangki_last_tankname.forEach((ele,idx)=>{
                              let id_device = this.arr_json_tangki_last?.[ele]?.['id_device'];
                              if (!arr_temp_device.includes(id_device)){
                                  arr_temp_device = [
                                      ...arr_temp_device,
                                      id_device
                                  ]
                              }
                          })
                          // ... end grouping id device

                          // cari apakah device yang diloop sudah ada dalam arr_raw_reduce,
                          // jika belum ada, maka di masukkan semua id_device (last data) ke arr_raw_reduce
                          arr_temp_device.forEach((ele_device, idx_device)=>{

                              let find_dev_inraw = arr_raw_reduce.find(ele=>ele?.['id_device'] == ele_device);
                              if (!find_dev_inraw){
                                
                                // looping data last untuk masukkan data sesuai id_device
                                  Object.keys(this.arr_json_tangki_last).forEach((ele_tank,idx_tank)=>{
                                      let tank_data = this.arr_json_tangki_last?.[ele_tank];
                                      if (tank_data?.['id_device'] == ele_device){

                                          let temp_obj = {};
                                          temp_obj = {
                                              ...temp_obj,
                                              data: [
                                                  {...this.arr_json_tangki_last?.[ele_tank]}
                                              ],
                                              id_device: this.arr_json_tangki_last?.[ele_tank]?.['id_device'],
                                              rawData: this.arr_json_tangki_last?.[ele_tank]?.['rawData'],
                                              time: this.arr_json_tangki_last?.[ele_tank]?.['time']
                                          }
                                          arr_raw_reduce = [
                                              ...arr_raw_reduce,
                                              {...temp_obj}
                                          ]
                                      }

                                  })

                              }
                          })

                          // console.log("arr_temp_device")
                          // console.log(arr_temp_device)
                      }
                  }
              }
              
              // console.log("ARR RAW REDUCE")
              // console.log(arr_raw_reduce)
              // ... end 


              // kosongkan data master 1m cpo / pko
              let kosongkan_data_mst_1m_cpopko = {}

              Object.keys(this.mst_1m_cpo_pko).forEach((ele_tank_name,idx)=>{
                  kosongkan_data_mst_1m_cpopko = {
                      ...kosongkan_data_mst_1m_cpopko,
                      [ele_tank_name]: ''
                  }
              })
              this.mst_1m_cpo_pko = {...kosongkan_data_mst_1m_cpopko}

              console.error("KOSONGKAN DATA")
              console.error(kosongkan_data_mst_1m_cpopko)

              // // GET SUHU 1M PENENTUAN BERAT JENIS (CPO / PKO)
              // this.get_suhu1M_CPO_PKO(this.arr_json_tangki_last, (resp_mst_1m_cpo_pko)=>{  // jam 7:30

                // UPDATE REALTIME OBJECT DI funcSeparateTank
                  this.funcSeparateTank(arr_raw_reduce, ()=>{

                        let getFirstTangkiList = this.mst_list_tangki.length > 0 ? {...this.mst_list_tangki[0]} : {}
                        this.getFirstTangki_Default = {...getFirstTangkiList}
            
                        this.setState({
                          ...this.state,
                          chartSuhuTinggiJam: {
                                ...this.state.chartSuhuTinggiJam,
                                suhuTinggiSelected: {...getFirstTangkiList}
                          }
                        })

                        this.getDateMax_From_TangkiLast();
                        
                            console.error("MST 1M CPO PKO")
                            console.error(this.mst_1m_cpo_pko)

                            setTimeout(()=>{
                              console.error("GET DATE MAX FROM TANGKI LAST NEW ===")
                              console.error(this.arr_json_tangki_last)
        
                              let arr_maxDate_ForPerHour:any;
                              let maxDate_ForPerHour:any;
                              let get_maxDate_ForPerHour:any;
                              let get_hourbegin_ForPerHour:any;
                              let get_hourlast_ForPerHour:any;
        
                              if (typeof this.arr_date_realtime != 'undefined' && this.arr_date_realtime != null){
                                arr_maxDate_ForPerHour = this.arr_date_realtime.map(ele=>ele?.['time_tank_getTime']);
                                maxDate_ForPerHour = Math.max.apply(null, arr_maxDate_ForPerHour);
                                get_maxDate_ForPerHour = this.arr_date_realtime.filter(ele=>ele?.['time_tank_getTime'] == maxDate_ForPerHour)[0];
                                get_hourbegin_ForPerHour = get_maxDate_ForPerHour?.['hourbegin'];
                                get_hourlast_ForPerHour = get_maxDate_ForPerHour?.['hourlast'];
                              }
                              
                              // console.error(get_maxDate_ForPerHour)
                              // console.error(maxDate_ForPerHour)
        
                              console.error("... end arr_json_tangki_last")
        
                              // GETALLDATA + MST_1M_CPO_PKO (SUHU 1 M)
                            
                              // INTERVAL SHOW HIDE / SHOW BOX SUCH AS TINGGI PROFILE
                              // this.intervalShowHideBox("tangki_1");
                              // this.intervalShowHideBox("tangki_2");
                              // this.intervalShowHideBox("tangki_3");
                              // this.intervalShowHideBox("tangki_4");
                            
                              this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last,
                                              get_hourbegin_ForPerHour, get_hourlast_ForPerHour,
                                              this.mst_1m_cpo_pko);
                            },100)
                        // });
                        // ... end SUHU 1M PENENTUAN BERAT JENIS
                  });
              // });

              clearInterval(intOnProgress)
            }
        })
    }

    grouping_Data_Raw(arr_raw_all:any){
        // HILANGKAN DATA DOUBLE
        let arr_raw_all_reduce:any = [];

        if (Array.isArray(arr_raw_all)){
          if (arr_raw_all.length > 0){

              arr_raw_all_reduce = arr_raw_all.reduce((arr_tmp, new_obj)=>{

                  let findItem = arr_tmp.find((ele)=>{
                      if (ele?.['time'] == new_obj?.['time'] &&
                          ele?.['id_device'] == new_obj?.['id_device'])
                      {
                          return true
                      }
                  })
                  if (!findItem){
                      return [...arr_tmp, {...new_obj}]
                  }else{
                    return [...arr_tmp]
                  }

              }, [])

          }
        }
        // console.error("ARR RAW ALL REDUCE (FINAL)")
        // console.error(arr_raw_all_reduce)

        return arr_raw_all_reduce
    }

    getLastDate_obj_tank(obj_tank_var){
        let obj_tank_temp = JSON.parse(JSON.stringify(obj_tank_var));
        let arr_tank_date:any = {};
        let obj_tank_maxdate:any = {};
        let obj_tank_temp_final = {};

        if (typeof obj_tank_temp == 'object')
        {

          if (Object.keys(obj_tank_temp).length > 0){

            Object.keys(obj_tank_temp).forEach((ele_tank_name,idx_tank)=>{

                for (let [i, v] of obj_tank_temp[ele_tank_name].entries())
                {
                    let time:any = v?.['time'];
                    let time_conv_date:any, time_conv_date_final:any;

                    if (time != null)
                    {
                        time_conv_date = new Date(time);
                        time_conv_date_final = formatDate(time_conv_date, 'YYYY-MM-DD 00:00:00')
                    }

                    obj_tank_temp[ele_tank_name][i] = {
                        ...obj_tank_temp[ele_tank_name][i],
                        date: time_conv_date_final,
                        date_getTime: new Date(time_conv_date_final).getTime()
                    }

                    // push ke 'arr_tank_date', 
                    // tangki_1 : [1679590800000, 1679590800000, 1679590800000, ...]
                    if (typeof arr_tank_date?.[ele_tank_name] != 'undefined')
                    {
                        arr_tank_date[ele_tank_name] = 
                            [
                              ...arr_tank_date[ele_tank_name],
                              new Date(time_conv_date_final).getTime()
                            ]
                    }
                    else{
                        arr_tank_date[ele_tank_name] = [
                            new Date(time_conv_date_final).getTime()
                        ]
                    }
                    // ... end      
                }

            })

            // looping arr_tank_date
            Object.keys(arr_tank_date).forEach((ele_tank_name, idx_tank_name)=>{
                
                let max_date:any = Math.max.apply(null, arr_tank_date?.[ele_tank_name]);
                obj_tank_maxdate = {
                    ...obj_tank_maxdate,
                    [ele_tank_name]: max_date
                }

            })

            // tampung data yang paling maksimal di satu variabel

            Object.keys(obj_tank_temp).forEach((ele_tank_name2, idx_tank_name)=>{
                let filter_temp = _.filter(obj_tank_temp?.[ele_tank_name2], {'date_getTime':obj_tank_maxdate?.[ele_tank_name2]})

                obj_tank_temp_final = {
                    ...obj_tank_temp_final,
                    [ele_tank_name2]: filter_temp
                }
            })

            // ... end looping arr_tank_date
            
            console.error("ARR TANK !!!")
            console.error(obj_tank_temp)

          }
        }

        return obj_tank_temp_final
    }

    funcSeparateTank(arr_raw_alls:any, callback){
        let obj_tank:any = {};

        // menghitung total cpo / pko
        let obj_tank_total = {
            "PKO":0,
            "CPO":0
        }
        let obj_tank_max_total = {
            "PKO":0,
            "CPO":0
        }
        let obj_tank_total_percent = {
            "PKO":0,
            "CPO":0
        }

        // function untuk memisahkan tangki ke masing-masing key
        // obj = {tangki_1: {'volume isi tank 1':'...', 'Jarak Sensor dengan permukaan Tank 1' : '774.91', 'id_device':"BESTAGRO_002_NEW"}}
        //       ,{tangki_2: {'volume isi tank 2':'...', 'Jarak Sensor dengan permukaan Tank 2' : '203.77', 'id_device':"BESTAGRO_002_NEW"}}
        //       ,{tangki_3: {'volume isi tank 3':'...', 'Jarak Sensor dengan permukaan Tank 3' : '1033.42', 'id_device':"BESTAGRO_001"}}
        //       ,{tangki_4: {'volume isi tank 4':'...', 'Jarak Sensor dengan permukaan Tank 4' : '617.36', 'id_device':"BESTAGRO_001"}}
        
        console.error("ARR RAW ALL REDUCE (FINAL)")

        console.log("arr_raw_alls BEST ")
        console.log(arr_raw_alls)
        
        for (let [i, v] of arr_raw_alls.entries()){
              // index (i), values (v)

            // console.error(i, v)
            let data_arr:any = v?.['data']?.[0];

            let time:any = v?.['time'] ?? '';
            let time_getTime:any = v?.['time'] != null ? new Date(v?.['time']).getTime() : 0;
            let id_device:any = v?.['id_device'] ?? '';
            let rawData:any = v?.['rawData'];
            // console.error(data_arr)

            // ambil dan simpan masing-masing tangki
            // looping dalam object data_arr

            let obj_store_temp:any = {};
            let obj_store_suhu_temp:any = {};


            Object.keys(data_arr).forEach((ele_attr:any)=>{

                let patt_tank = new RegExp(/(Tank [0-9]+)/,'gi');
                let patt_tank_exec = patt_tank.exec(ele_attr);
                if (patt_tank_exec != null){

                  let data_tank:any = patt_tank_exec[0];

                  let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                  if (find_mst_list){
                      // nama tangki harus ada dalam list master, baru dapat disimpan
                        let nama_tangki:any = find_mst_list?.['name'] ?? '';
                        let title_tangki:any = find_mst_list?.['title'] ?? '';

                      // ** HITUNG TINGGI CPO / PKO **

                        let patt_tinggi = new RegExp(/(Jarak Sensor dengan permukaan Tank [0-9]+)/,'gi')
                        let patt_tinggi_exec = patt_tinggi.exec(ele_attr);
                        
                        let tangki_jarak_sensor:any;
                        let tinggi_hitung:any   // tinggi cpo / pko

                        // console.error("patt_tinggi_exec")
                        // console.error(patt_tinggi_exec)

                        if (patt_tinggi_exec != null){

                            let data_jarak_sensor:any = patt_tinggi_exec['input'];

                             tangki_jarak_sensor =  data_arr?.[data_jarak_sensor];

                             if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                                if (typeof tangki_jarak_sensor == 'string'){
                                  tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100);
                                  // tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                                }else{
                                  // tangki_jarak_sensor = (tangki_jarak_sensor / 100).toFixed(2);
                                  tangki_jarak_sensor = (tangki_jarak_sensor / 100);
                                }
                            }else{tangki_jarak_sensor = 0}


                            // === CARI TINGGI MINYAK MENGGUNAKAN TINGGI DELTA ===
                              // let ruang_kosong:any = (tangki_jarak_sensor - this.mst_avg_t_segitiga?.[nama_tangki]);
                              // tinggi_hitung = Math.round((this.mst_t_tangki?.[nama_tangki] - ruang_kosong) * 1000) / 1000;
                            // ... end <TINGGI DELTA>

                            // === CARI TINGGI MINYAK MENGGUNAKAN TINGGI PROFILE ===
                            tinggi_hitung = 0;
                            if (typeof this.mst_t_profile?.[nama_tangki] != 'undefined' &&
                                  this.mst_t_profile?.[nama_tangki] != null)
                            {
                                tinggi_hitung = Math.round((this.mst_t_profile?.[nama_tangki] - tangki_jarak_sensor) * 1000) / 1000;
                            }
                            // ... end <TINGGI PROFILE>

                            if (tinggi_hitung < 0){
                              tinggi_hitung = 0;
                            }

                        }

                      // ... ** end TINGGI CPO / PKO

                      // ** SET SUHU TINGGI **
                        let patt_tank_tinggi_num_exec_final:any;
                        let data_temperature:any;

                        let patt_suhu = new RegExp(/(Temperature Tank [0-9]+)/,'gi')
                        let patt_suhu_exec = patt_suhu.exec(ele_attr);
                        if (patt_suhu_exec != null){
                            data_temperature = patt_suhu_exec['input'];

                            // let patt_tank_number = new RegExp(/(tinggi [0-9]+.?M)/,'gi')
                            let patt_tank_number = new RegExp(/(tinggi [0-9]+(\.?[0-9]+)?.?M)/,'gi')    // bisa jadi ada koma misal 0.2 M
                            let patt_tank_number_exec = patt_tank_number.exec(ele_attr) ?? -1

                            patt_tank_tinggi_num_exec_final = patt_tank_number_exec != null 
                                          ? parseFloat(patt_tank_number_exec[0].replace(/(tinggi|M)/gi,'').trim())
                                          : null
                            
                            // SET SUHU SEMENTARA DI obj_store_suhu_temp per SATU DATA ARR object
                            if (typeof obj_store_suhu_temp?.[nama_tangki] == 'undefined' ||
                                obj_store_suhu_temp?.[nama_tangki] == null)
                            {
                                obj_store_suhu_temp[nama_tangki] = 
                                {
                                    data_suhu: [data_arr?.[data_temperature]],
                                    data_suhu_tank_num: [patt_tank_tinggi_num_exec_final]
                                }
                            }
                            else{
                                obj_store_suhu_temp[nama_tangki] = 
                                {
                                  ...obj_store_suhu_temp[nama_tangki],
                                  data_suhu: [...obj_store_suhu_temp[nama_tangki]['data_suhu'], 
                                                data_arr?.[data_temperature]
                                            ],
                                  data_suhu_tank_num: [...obj_store_suhu_temp[nama_tangki]['data_suhu_tank_num'], 
                                                          patt_tank_tinggi_num_exec_final
                                                      ],
                                }
                            }
                        }
                      // ... ** end SET SUHU TINGGI **



                      if (typeof obj_store_temp?.[nama_tangki] == 'undefined' ||
                            obj_store_temp?.[nama_tangki] == null)
                      {
                          // jika tidak ada key tangki nya
                          obj_store_temp[nama_tangki] = 
                            {
                              [ele_attr]: data_arr[ele_attr],
                              data_suhu: obj_store_suhu_temp[nama_tangki]['data_suhu'],
                              data_suhu_tank_num: obj_store_suhu_temp[nama_tangki]['data_suhu_tank_num'],
                              time,
                              time_getTime,
                              id_device,
                              rawData
                            }

                            // console.error("OBJ STORE TEMP TANGKI")
                            // console.error(obj_store_temp)

                          // ** HITUNG TINGGI CPO / PKO
                          if (typeof tangki_jarak_sensor != 'undefined'){
                              obj_store_temp[nama_tangki]['tinggi_minyak'] = tinggi_hitung;
                          }
                          // ... end ** HITUNG TINGGI CPO / PKO
                          
                      }
                      else{
                          // jika ada key tangki nya
                          obj_store_temp[nama_tangki] = 
                              {
                                ...obj_store_temp[nama_tangki],
                                [ele_attr]: data_arr[ele_attr],
                                data_suhu: obj_store_suhu_temp[nama_tangki]['data_suhu'],
                                data_suhu_tank_num: obj_store_suhu_temp[nama_tangki]['data_suhu_tank_num'],
                                time,
                                time_getTime,
                                id_device,
                                rawData
                              }

                          // ** HITUNG TINGGI CPO / PKO
                          if (typeof tangki_jarak_sensor != 'undefined'){
                              obj_store_temp[nama_tangki]['tinggi_minyak'] = tinggi_hitung;
                          }
                          // ... end ** HITUNG TINGGI CPO / PKO

                      }
                      
                  }
                }
            })
            // ... end looping dalam object data_arr key

            // simpan hasil kumpulan key ke obj_tank (final)
            Object.keys(obj_store_temp).forEach((ele_nama_tangki,idx_store)=>{

                let arr_tinggi_suhu_tmp:any = [];
                let arr_tinggi_suhu_val_tmp:any = [];

                let volume_tbl:any = 0;
                let volume_prev:any;
                let beda_liter_hitung_StoreToObj:any;
                let volume_tbl_plus_beda_liter:any;
                let faktor_koreksi_temp:any;
                let find_berat_jenis:any

                let arr_obj_tmp_tank_data:any = obj_store_suhu_temp[ele_nama_tangki]['data_suhu'];

                // REVISI KETINGGIAN SUHU yang KE CELUP  20 feb '23
                let obj_tmp_tank_tinggi_minyak:any = parseFloat(obj_store_temp[ele_nama_tangki]['tinggi_minyak']);
                if (obj_tmp_tank_tinggi_minyak >= 1){

                  if (arr_obj_tmp_tank_data.length > 0){
                      arr_obj_tmp_tank_data.forEach((ele_suhu_num,idx)=>{
                          // [1, 3, 5, 7, 10]
                          let data_suhu_tank_num_idx:any = obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx];
                          if (obj_tmp_tank_tinggi_minyak < 4)
                          {
                              // jika tinggi di bawah 4 m, maka ambil ketinggian suhu [1]
                              if (data_suhu_tank_num_idx == 1){
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 4 && obj_tmp_tank_tinggi_minyak < 6){
                              // jika tinggi di bawah 4 m s/d 5.99, maka ambil ketinggian suhu [1,3]
                              if (data_suhu_tank_num_idx <= 3){    // ambil [1,3]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 6 && obj_tmp_tank_tinggi_minyak < 8){
                              // jika tinggi di bawah 6 m s/d 7.99, maka ambil ketinggian suhu [1,3,5]
                              if (data_suhu_tank_num_idx <= 5){    // ambil [1,3,5]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 8 && obj_tmp_tank_tinggi_minyak < 10){
                              // jika tinggi di bawah 8 m s/d 9.99, maka ambil ketinggian suhu [1,3,5,7]
                              if (data_suhu_tank_num_idx <= 7){    // ambil [1,3,5,7]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 10){
                              // jika tinggi di bawah 10 m, maka ambil ketinggian suhu [1,3,5,7,10]
                              if (data_suhu_tank_num_idx <= 10){    // ambil [1,3,5,7,10]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }

                      })
                  }
                }
                else{
                  // JIKA MINUS, MAKA INJECT KETINGGIAN 1 M
                  if (obj_tmp_tank_tinggi_minyak < 1){

                    let arr_obj_tmp_tank_data:any = obj_store_suhu_temp[ele_nama_tangki]['data_suhu_tank_num'];
                    let findIdx = arr_obj_tmp_tank_data.findIndex(ele=>ele == 1);
                    if (findIdx != -1){
                        arr_tinggi_suhu_tmp.push(1);
                        arr_tinggi_suhu_val_tmp.push(obj_store_suhu_temp[ele_nama_tangki]['data_suhu'][findIdx]);
                    }
                  }
                    // arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[1]);
                }
                // ... <end REVISI KETINGGIAN>

                // let total:any = obj_temp_tank[ele_tank_name]['data'].reduce((tmp:any, val:any)=>{
                let total:any = arr_tinggi_suhu_val_tmp.reduce((tmp:any, val:any)=>{
                  return tmp + parseFloat(val);
                },0)

                // (tidak pakai suhu rata-rata) average / rata-rata per tangki
                // let avg_tank:any = (total / arr_tinggi_suhu_val_tmp.length).toFixed(3);
                // ... end average / rata-rata per tangki

                
                // (PAKAI SUHU SATU TITIK) REVISI TANGGAL 29 MARET 2023
                // *** ambil suhu di satu titik saja ***
                //     acuan ke "suhu_tank_num" & "suhu_tank_num_raw"
                //     perhitungan di plus 4
                // obj_tmp_tank_tinggi_minyak
                let suhu_1titik_level_minyak = parseFloat(obj_store_temp?.[ele_nama_tangki]?.['tinggi_minyak']);
                let arr_suhu_1titik_suhu_tank_num = obj_store_temp?.[ele_nama_tangki]?.['data_suhu'];    // ['40.63', '38.91', '37.91', '28.59', '27.97']
                let arr_suhu_1titik_suhu_tank_num_raw = obj_store_temp?.[ele_nama_tangki]?.['data_suhu_tank_num']; // [1, 3, 5, 7, 10]
                let suhu_1titik_getTinggiSuhu;
                let suhu_1titik_getTinggiSuhu_Val;

                // CARI SUHU 1 TITIK DARI DATABASE dalam array "mst_suhu1titik"
                let findSuhu1Titik:any = this.mst_suhu1titik.find((ele_suhu1titik,idx_suhu1titik)=>{
                    if (ele_suhu1titik?.['tangki_id'] == ele_nama_tangki &&
                        ele_suhu1titik?.['level_isi_start'] <= suhu_1titik_level_minyak &&
                        ele_suhu1titik?.['level_isi_end'] >= suhu_1titik_level_minyak)
                    {
                        return true 
                    }
                })

                suhu_1titik_getTinggiSuhu = findSuhu1Titik?.['suhu_tinggi'];

                // if (suhu_1titik_level_minyak < 5){
                //     suhu_1titik_getTinggiSuhu = 0;
                // }
                // else if (suhu_1titik_level_minyak >= 5 && suhu_1titik_level_minyak < 7){
                //     suhu_1titik_getTinggiSuhu = 1;
                // }
                // else if (suhu_1titik_level_minyak >= 7 && suhu_1titik_level_minyak < 9){
                //     suhu_1titik_getTinggiSuhu = 3;
                // }
                // else if (suhu_1titik_level_minyak >= 9 && suhu_1titik_level_minyak < 11){
                //     suhu_1titik_getTinggiSuhu = 5;
                // }
                // else if (suhu_1titik_level_minyak >= 11){
                //     suhu_1titik_getTinggiSuhu = 7;
                // }
                
                  //    level suhu tinggi 10 M tidak di pakai
                let findIdx = arr_suhu_1titik_suhu_tank_num_raw.findIndex(ele_raw=>parseFloat(ele_raw) == parseFloat(suhu_1titik_getTinggiSuhu))
                if (findIdx != -1){
                    try {
                      suhu_1titik_getTinggiSuhu_Val = arr_suhu_1titik_suhu_tank_num?.[findIdx];
                    }catch(e){
                      suhu_1titik_getTinggiSuhu_Val = 0;
                    }
                }else{
                    suhu_1titik_getTinggiSuhu_Val = 0;
                }

                let avg_tank:any = suhu_1titik_getTinggiSuhu_Val;

                // ... end <satu titik>

                // VOLUME TANGKI
                let tinggi_tmp:any = parseFloat(obj_store_temp[ele_nama_tangki]['tinggi_minyak']).toFixed(3);
                let avg_tmp:any = parseFloat(avg_tank);

                // PIIS SINI (AVERAGE SUHU TANGKI)
                // console.error("TES ELE NAMA TANGKI"); 
                // console.log(obj_store_temp[ele_nama_tangki]);
                // console.error("====> DATA SUHU "); 
                // console.log(obj_store_temp[ele_nama_tangki]?.['data_suhu'])
                // console.log(obj_store_temp[ele_nama_tangki]?.['data_suhu_tank_num'])
                // console.log("suhu_1titik_getTinggiSuhu : ",  suhu_1titik_getTinggiSuhu)
                // console.log("suhu_1titik_getTinggiSuhu_Val : ",  suhu_1titik_getTinggiSuhu_Val)
                // console.log("FIND INDEX : ",  findIdx)

                let data_suhu_slice:any = []; 
                let data_suhu_slice_sum:any = 0;
                let data_suhu_slice_sum_avg:any = 0;

                // Average-kan data suhu
                if (Array.isArray(obj_store_temp[ele_nama_tangki]?.['data_suhu'])
                    && findIdx >= 0)
                {
                    if (obj_store_temp[ele_nama_tangki]?.['data_suhu'].length > 0)
                    {
                        data_suhu_slice = obj_store_temp[ele_nama_tangki]?.['data_suhu'].slice(0, findIdx + 1);

                        data_suhu_slice_sum = data_suhu_slice.reduce((tmp, val)=>{
                            return parseFloat(tmp) + parseFloat(val);
                        },0)

                        data_suhu_slice_sum_avg = data_suhu_slice_sum / data_suhu_slice.length;

                        avg_tank = data_suhu_slice_sum_avg;
                        avg_tmp = data_suhu_slice_sum_avg;
                        
                        // console.log("data_suhu_slice");
                        // console.log(data_suhu_slice);
                        // console.log("data_suhu_slice_sum");
                        // console.log(data_suhu_slice_sum);
                        // console.log("data_suhu_slice_sum_avg");
                        // console.log(data_suhu_slice_sum_avg);
                    }
                }
                else
                {
                  avg_tank = 0;
                  avg_tmp = 0;
                }

                // console.log("SETELAH SLICE")
                // console.log(obj_store_temp[ele_nama_tangki]?.['data_suhu']);


                let jenis:any = ''; // cpo atau pko

                if (tinggi_tmp != null){

                    // REVISI VOLUME BEDA LITER
                    let tinggi_tmp_floor:any = Math.floor(parseFloat(tinggi_tmp) * 100); // angka floor ( 1010 )
                    let tinggi_tmp_all:any = parseFloat((parseFloat(tinggi_tmp) * 100).toFixed(3));   // angka plus decimal ( 1010,7 )
                    let tinggi_tmp_dec:any = (Math.round((tinggi_tmp_all - tinggi_tmp_floor) * 1000)) / 1000;   // (1010,7777 - 1010 = 0,778)
                    // ... end <REVISI VOLUME BEDA LITER>
                    
                    // panggil array json tabel volume tangki yang sesuai
                    let arr_volume:any = this.json_arr_volume_tangki(ele_nama_tangki);

                    let findItem:any = arr_volume.find(res=>
                          // parseInt(res.tinggi) == Math.round(tinggi_tmp.toFixed(2) * 100)
                          // in chrome toFixed not rounding (.5) => misal: 5.335 -> 5.33; 5.336 -> 5.34
                          // parseInt(res.tinggi) == Math.round(parseFloat(parseFloat(tinggi_tmp).toFixed(2))*100)
                          // parseInt(res.tinggi) == Math.round(parseFloat(tinggi_tmp)*100)
                          parseInt(res.tinggi) == tinggi_tmp_floor
                    )

                    let tanggal_tangki:any = new Date(obj_store_temp[ele_nama_tangki]['time']);
                    
                    let findCpoPko = this.arr_cpo_pko.find(res=>
                            res.name == ele_nama_tangki &&
                            (
                              (new Date(res.datebegin) <= tanggal_tangki
                                  && (res.datelast != '' && res.datelast != null && new Date(res.datelast) >= tanggal_tangki)
                              )
                              ||
                              (
                                (new Date(res.datebegin) <= tanggal_tangki)
                                  && (res.datelast == '' || res.datelast == null)
                              )
                            ) 
                            // && 
                            // (res.datelast == null || res.datelast == '' || new Date(res.datelast) >= tanggal_tangki)
                    )

                    // SUHU 1 M JENIS
                    // acuan utama jika suhu 1m kosong, maka akan mengambil object tanggal berlaku utk dapat "jenis"
                    // jika sudah ada jenis dalam object "mst_1m_cpo_pko", maka acuannya ke object tersebut.
                    // *** DIUTAMAKAN suhu ketinggian 1m ***
                    // *function "get_suhu1M_CPO_PKO" utk mst_1m_cpo_pko
                    if (this.mst_1m_cpo_pko?.[ele_nama_tangki] == "")
                    {
                        if (findCpoPko){
                            // TANGGAL BERLAKU
                            jenis = findCpoPko?.['jenis'];
                        }
                    }
                    else{
                        // DI UTAMAKAN SUHU KETINGGIAN 1 M
                        // JAM 7:30 - 8:00
                        jenis = this.mst_1m_cpo_pko?.[ele_nama_tangki]
                    }

                    // *** UBAH JENIS BASED ON API (get_jenis_by_api) ***

                    let jenisExistsInDB:boolean = false;

                    Object.keys(this.mst_jenis_by_api).forEach((ele_tank_api, idx_tank_api)=>{

                        if (ele_tank_api == ele_nama_tangki)
                        {
                          if (this.mst_jenis_by_api?.[ele_tank_api] != '' &&
                              this.mst_jenis_by_api?.[ele_tank_api] != null)
                          {
                              jenis = this.mst_jenis_by_api?.[ele_tank_api];
                              jenisExistsInDB = true;
                          }
                        }
                    })
                    if (!jenisExistsInDB){

                        // PRIORITAS JENIS (CPO / PKO)
                        // -> 1. Database (api : getJenisByDatentank)
                        // -> 2. Langsung ditentukan suhu 1 titik yang diambil apakah <= 39.9999 atau > 39.9999
                        // -> x 3. mst_1m_cpo_pko (titik 1 M jam 7:30 - 8:00) (tidak terpakai)
                        // -> x 4. arr_cpo_pko (tanggal berlaku) (tidak terpakai)
    
                        // UPDATE TERBARU (PENENTUAN CPO / PKO DARI SUHU YANG DI AMBIL)
                        // JIKA SUHU 1 TITIK <= 39.9999, MAKA DIANGGAP "PKO", SEBALIKNYA JIKA > 39.9999 MAKA DIANGGAP "CPO" 
                        // jenis = Math.floor(avg_tmp) <= 39.9999 ? "PKO" : "CPO";
                        jenis = avg_tmp <= 39.9999 ? "PKO" : "CPO";
                        // ... <end>
                    }


                    if (findItem){
                  
                      let beda_liter_mst:any = 0;
                      let beda_liter_hitung:any = 0;

                      // VOLUME LITER ATAU KG tangki
                      volume_tbl = parseFloat(findItem.volume);
                      beda_liter_mst = parseFloat(findItem.beda_liter);

                      beda_liter_hitung = Math.round((beda_liter_mst * tinggi_tmp_dec) * 1000) / 1000; // cth : (dari 1010,7) 0.7 * 4613 => 3229,1 

                      beda_liter_hitung_StoreToObj = beda_liter_hitung; // untuk di tampilkan di box rolling

                      volume_prev = volume_tbl;

                      if (typeof findItem?.['volume'] != 'undefined' &&
                            findItem?.['volume'] != null)
                      {
                          volume_tbl_plus_beda_liter = volume_tbl + beda_liter_hitung;
                      }

                      volume_tbl = volume_tbl_plus_beda_liter;


                      if (jenis != '' && jenis != null){
                          let arr_berat_jenis:any = this.json_arr_berat_jenis_tangki(jenis, ele_nama_tangki);

                          // === UPDATE BERAT JENIS ===
                          find_berat_jenis = arr_berat_jenis.find(res=>
                              // Math.round(parseFloat(res.temperature)) == Math.round(avg_tmp)
                              Math.round(parseFloat(res.temperature)) == Math.floor(avg_tmp)  // "avg_tmp" tidak perlu dibulatkan
                          );
                          if (find_berat_jenis){
                              volume_tbl = volume_tbl * find_berat_jenis?.['berat_jenis'];
                              // volume_prev = volume_tbl;   // just info volume sebelumnya
                          }

                          // faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.round(parseFloat(avg_tmp)));
                          faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.floor(parseFloat(avg_tmp))); // tidak perlu dibulatkan
                          if (faktor_koreksi_temp != null){
                              // console.error('volume tbl ',volume_tbl)
                              // console.log(tangki_name)
                              // console.error('faktor koreksi : ',faktor_koreksi_temp)
                              // console.error('volume tbl :  ',volume_tbl)
                              volume_tbl *= faktor_koreksi_temp;
                              // console.error('volume tbl (final) :  ',volume_tbl)

                              // console.error(find_berat_jenis?.['berat_jenis'])
                          }


                      }


                    }

                }


                // (SUHU 1 TITIK) jika 1 titik suhu di dapat 0 / di bawah 5 M, maka volume langsung di set 0
                if (suhu_1titik_getTinggiSuhu == 0)
                {
                    volume_tbl = 0;
                }

                // ... END VOLUME TANGKI

                if (typeof obj_tank?.[ele_nama_tangki] == 'undefined' ||
                    obj_tank?.[ele_nama_tangki] == null)
                {
                    obj_tank[ele_nama_tangki] = [
                        {...obj_store_temp[ele_nama_tangki],
                          avg: avg_tank,
                          data_suhu_slice,
                          data_suhu_slice_sum,
                          data_suhu_slice_sum_avg,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp],
                          beda_liter: beda_liter_hitung_StoreToObj,
                          volume_prev,    // volume master
                          volume_tbl_plus_beda_liter,
                          volume: volume_tbl,
                          volume_faktor_koreksi: faktor_koreksi_temp,
                          volume_berat_jenis: find_berat_jenis?.['berat_jenis'],
                          jenis
                        }
                    ]
                }
                else{
                    obj_tank[ele_nama_tangki] = [
                        ...obj_tank[ele_nama_tangki],
                        {...obj_store_temp[ele_nama_tangki],
                          avg: avg_tank,
                          data_suhu_slice,
                          data_suhu_slice_sum,
                          data_suhu_slice_sum_avg,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp],
                          beda_liter: beda_liter_hitung_StoreToObj,
                          volume_prev,    // volume master
                          volume_tbl_plus_beda_liter,
                          volume: volume_tbl,
                          volume_faktor_koreksi: faktor_koreksi_temp,
                          volume_berat_jenis: find_berat_jenis?.['berat_jenis'],
                          jenis
                        }
                    ]
                }
            })
            // ... end obj_store_temp            

            // ... end looping dalam object data_arr
            
        }
        // ... end arr_raw_alls

        // console.error("obj_tank")
        // console.error(obj_tank)
        // AMBIL DATA TANGGAL TERAKHIR SAJA UNTUK REALTIME
        // MISAL di obj_tank ada tanggal 24-Mar-2023 & 25-Mar-2023, maka ambil yg 25-Mar-2023
        // console.clear()

        
        obj_tank = this.getLastDate_obj_tank(obj_tank)
        console.error("OBJ TANK TERBARU")
        console.log(obj_tank)

        // console.error("==== OBJ TANK FINAL ====")
        // console.error(obj_tank)

        // ... end <obj_tank>


        // ... end <TANGGAL TERAKHIR REALTIME>

        // AMBIL MODUS (TINGGI TERBANYAK) masing-masing tangki
        let obj_tank_modus:any = {};
        let obj_temp_tinggi_map:any = [];
        let obj_tinggi_map:any = {};
        let obj_tinggi_modus:any = {};
        let obj_tinggi_modus_filter:any = {};
        let obj_tinggi_tank_modus_filter_single:any = {};

        Object.keys(obj_tank).forEach((ele_nama_tangki, idx_obj_tank)=>{

            // [11.16, 11.10, 11.16, 11.16]
            obj_temp_tinggi_map = obj_tank?.[ele_nama_tangki].map((ele_key, idx_key)=>{
              return ele_key?.['tinggi_minyak']
            })
            // ... end []

            if (typeof obj_tinggi_map?.[ele_nama_tangki] == 'undefined'){
                // console.error(ele_nama_tangki)
                // console.error(obj_temp_tinggi_map)
                // console.error(obj_tinggi_map?.[ele_nama_tangki])

                // {'tangki_1' : [11.16, 11.10, 11.16, 11.16]}
                obj_tinggi_map = {
                  ...obj_tinggi_map,
                  [ele_nama_tangki]: [...obj_temp_tinggi_map]
                }
                // ... end {}

                if (typeof obj_tinggi_modus?.[ele_nama_tangki] == 'undefined')
                {

                    // single data yang sering keluar
                    let getFrequentItem:any = _(obj_temp_tinggi_map)
                          .countBy()
                          .entries()
                          .maxBy(_.last)

                    // hanya sebagai referensi master countBy
                    let obj_temp_tinggi_map_countBy = _.countBy(obj_temp_tinggi_map);

                    if (getFrequentItem.length >= 1){

                        let arr_val_y_countBy_entries = Object.entries(obj_temp_tinggi_map_countBy);

                        // filter yang memiliki kemunculan angka yang sama (misal, [[12.34, 2], [9.56, 2]]) => [2] == [2]
                        let filter_val_y_countBy_entries = arr_val_y_countBy_entries.filter(elefil => elefil[1] == getFrequentItem[1]);

                        let arr_getMax_Values = filter_val_y_countBy_entries.map((ele_max,idx_max)=>{
                            return parseFloat(ele_max[0])
                        })

                        // ambil angka tinggi yang paling maksimal (misal : 12.34)
                        let getMax_Value:any = Math.max.apply(null, arr_getMax_Values)

                        // console.error("obj_temp_tinggi_map_countBy")
                        // console.error(obj_temp_tinggi_map_countBy)
                        // console.error("getFrequentItem")
                        // console.error(getFrequentItem)
                        getFrequentItem = [[getMax_Value, getFrequentItem[1]]]
                        // console.error("getFrequentItem")
                        // console.error(getFrequentItem)
                    }
                    
                    // {tangki_1: ['3.853',8],
                    // tangki_2: ['11.146',8],
                    // tangki_3: ['0',9],
                    // tangki_3: ['1.621',7]}

                    obj_tinggi_modus = {
                      ...obj_tinggi_modus,
                      [ele_nama_tangki]: getFrequentItem
                    }
                    // console.error("obj_tinggi_modus")
                    // console.error(obj_tinggi_modus)

                    // filter yang ter banyak dari obj_tinggi_modus
                    if (typeof obj_tinggi_modus_filter?.[ele_nama_tangki] == 'undefined')
                    {
                        // console.error("PARSE FLOAT getFrequentItem")
                        // console.error(parseFloat(getFrequentItem[0])) // [1.621, 7] => 1.621

                        let arr_filter_temp = obj_tank?.[ele_nama_tangki].filter((ele,idx)=>{
                          return parseFloat(ele?.['tinggi_minyak']) == parseFloat(getFrequentItem[0])
                        })

                        // multi data yang terbanyak (beda jam dengan satu ketinggian)
                        obj_tinggi_modus_filter = {
                          ...obj_tinggi_modus_filter,
                          [ele_nama_tangki]: [...arr_filter_temp]
                        }

                        // single data (cari time yang paling max)
                        let arr_map_time_data:any = arr_filter_temp.map((ele,idx)=>{
                            return ele?.['time_getTime']
                        })

                        let arr_map_time_data_max:any = Math.max.apply(null, arr_map_time_data);
                        // ... end tanggal max

                        // console.log("arr_map_time_data MAX")
                        // console.log(arr_map_time_data_max)

                        // cari yang last update (tanggal ter-update)
                        let filter_single_modus:any = obj_tinggi_modus_filter[ele_nama_tangki].filter((ele,idx)=>{
                            return ele?.['time_getTime'] == arr_map_time_data_max
                        })


                        if (filter_single_modus.length > 0)
                        {

                            if (typeof obj_tinggi_tank_modus_filter_single?.[ele_nama_tangki] == 'undefined')
                            {

                              let jarak_sensor_val:any = 0;
                              let find_jarak_sensor_inobj = Object.keys(filter_single_modus?.[0]).find(ele=>ele.toLowerCase().indexOf("jarak sensor") != -1);

                              if (find_jarak_sensor_inobj){
                                
                                  jarak_sensor_val = parseFloat(filter_single_modus?.[0]?.[find_jarak_sensor_inobj])
                              }

                              // hanya menampung satu data tanggal terakhir per tangki
                                obj_tinggi_tank_modus_filter_single = {
                                    ...obj_tinggi_tank_modus_filter_single,
                                    [ele_nama_tangki]: {
                                      jarak_sensor: jarak_sensor_val,
                                      sensor_off: jarak_sensor_val >= parseFloat(this.mst_t_kalibrasi[ele_nama_tangki]) ? true : false,
                                      ...filter_single_modus?.[0]
                                    }
                                }
                            }
                        }
                        
                        // ... end cari last update

                        // console.clear()

                        console.log("arr_map_time_data")
                        console.log(arr_map_time_data)
                        console.log("obj_tinggi_tank_modus_filter_single")
                        console.log(obj_tinggi_tank_modus_filter_single)

                        
                    }
                }

            }
        })
        // ... end obj_tank (per tangki_name)

        // UPDATE KE REALTIME
        let temp_updatedState_global:any = {};

        // inject dulu data dari this.state 
        temp_updatedState_global['realtime'] = {
            ...this.state['realtime']
        }

        let arr_tangki_name:any = [];
        let arr_tangki_tinggi:any = [];

        let arr_tangki_temp:any = [];

        
        // LOOPING obj_tinggi_tank_modus_filter_single
        Object.keys(obj_tinggi_tank_modus_filter_single).forEach((ele_tank_name,idx_tank_name)=>{

            let volume_final = Math.round(parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume']) * 100) / 100;
            let val_max_tangki = this.mst_t_max?.[ele_tank_name] ?? 0;

            // UPDATE TOTAL VOLUME CPO / PKO
            let jenis_update = obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['jenis'];
    
            // CARI APA ADA DATA JENIS YG SAMA, CPO ATAU PKO
            let findTotalJenis = Object.keys(obj_tank_total).find((ele_jenis,idx_jenis)=>ele_jenis.toUpperCase() == jenis_update.toUpperCase());
            if (findTotalJenis){
                obj_tank_total[findTotalJenis] = obj_tank_total[findTotalJenis] + volume_final;
                obj_tank_max_total[findTotalJenis] = obj_tank_max_total[findTotalJenis] + val_max_tangki;
            }
            else{
                // JIKA TIDAK ADA DATA, MAKA DI TAMBAHKAN BARU
                obj_tank_total = {
                    ...obj_tank_total,
                    [jenis_update]: volume_final
                }

                obj_tank_max_total = {
                    ...obj_tank_max_total,
                    [jenis_update]: val_max_tangki
                }

            }

            // ... <end> UPDATE TOTAL VOLUME

            Object.keys(obj_tank_total).forEach((ele_jenis2,idx_jenis2)=>{
                let hitung_percent = (obj_tank_total?.[ele_jenis2] / obj_tank_max_total?.[ele_jenis2]) * 100;
                obj_tank_total_percent = {
                    ...obj_tank_total_percent,
                    [ele_jenis2]: !isNaN(hitung_percent) ? Math.round(hitung_percent * 100) / 100 : '-'
                }
            })

            
            // REVISI TANGGAL 29 MARET 2023 (SUHU SATU TITIK)
            // *** ambil suhu di satu titik saja ***
            //     acuan ke "suhu_tank_num" & "suhu_tank_num_raw"
            //     perhitungan di plus 4

            let suhu_1titik_level_minyak = parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['tinggi_minyak']);
            let arr_suhu_1titik_suhu_tank_num = obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['data_suhu'];    // ['40.63', '38.91', '37.91', '28.59', '27.97']
            let arr_suhu_1titik_suhu_tank_num_raw = obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['data_suhu_tank_num']; // [1, 3, 5, 7, 10]
            let suhu_1titik_getTinggiSuhu;
            let suhu_1titik_getTinggiSuhu_Val;

            // CARI SUHU 1 TITIK DARI DATABASE dalam array "mst_suhu1titik"
            let findSuhu1Titik:any = this.mst_suhu1titik.find((ele_suhu1titik,idx_suhu1titik)=>{
                if (ele_suhu1titik?.['tangki_id'] == ele_tank_name &&
                    ele_suhu1titik?.['level_isi_start'] <= suhu_1titik_level_minyak &&
                    ele_suhu1titik?.['level_isi_end'] >= suhu_1titik_level_minyak)
                {
                    return true 
                }
            })

            suhu_1titik_getTinggiSuhu = findSuhu1Titik?.['suhu_tinggi'];

            // if (suhu_1titik_level_minyak < 5){
            //     suhu_1titik_getTinggiSuhu = 0;
            // }
            // else if (suhu_1titik_level_minyak >= 5 && suhu_1titik_level_minyak < 7){
            //     suhu_1titik_getTinggiSuhu = 1;
            // }
            // else if (suhu_1titik_level_minyak >= 7 && suhu_1titik_level_minyak < 9){
            //     suhu_1titik_getTinggiSuhu = 3;
            // }
            // else if (suhu_1titik_level_minyak >= 9 && suhu_1titik_level_minyak < 11){
            //     suhu_1titik_getTinggiSuhu = 5;
            // }
            // else if (suhu_1titik_level_minyak >= 11){
            //     suhu_1titik_getTinggiSuhu = 7;
            // }
              //    level suhu tinggi 7 & 10 M tidak di pakai

            let findIdx = arr_suhu_1titik_suhu_tank_num_raw.findIndex(ele_raw=>parseFloat(ele_raw) == parseFloat(suhu_1titik_getTinggiSuhu))
            if (findIdx != -1){
                try {
                  suhu_1titik_getTinggiSuhu_Val = arr_suhu_1titik_suhu_tank_num?.[findIdx];
                }catch(e){
                  suhu_1titik_getTinggiSuhu_Val = 0;
                }
            }else{
                suhu_1titik_getTinggiSuhu_Val = 0;
            }

            // (SUHU 1 TITIK) jika 1 titik suhu di dapat 0 / di bawah 5 M, maka volume langsung di set 0
            let volume_final_rev:any;
            if (suhu_1titik_getTinggiSuhu == 0)
            {
                volume_final_rev = 0
            }
            else{
                volume_final_rev = Math.round(parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume']) * 100) / 100
            }

            // ... end <satu titik>

            // taruh di temp dahulu, baru di store ke setState (karena setState tidak bisa update di looping multi data)

            // konversi Tinggi Profile (Cm)
            let tinggi_profile_cm:any;
            if (!isNaN(this.mst_t_profile?.[ele_tank_name])){
                tinggi_profile_cm = parseFloat(this.mst_t_profile?.[ele_tank_name]) * 100; // 1017.6399999
                tinggi_profile_cm = Math.round(tinggi_profile_cm * 100) / 100;  // 1017.634
            }else{tinggi_profile_cm = 0}

            temp_updatedState_global['realtime'] = {
                ...temp_updatedState_global['realtime'],
                [ele_tank_name]: {
                    ...this.state.realtime[ele_tank_name],
                    beda_liter: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['beda_liter'] ?? '-',
                    jarak_sensor: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['jarak_sensor'],
                    sensor_off: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['sensor_off'],
                    // tinggi: parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['tinggi_minyak']),   // meter
                    tinggi: (parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['tinggi_minyak'])) * 100,    // centimeter
                    tinggi_profile: tinggi_profile_cm,  // tinggi profile
                    // suhu: suhu_1titik_getTinggiSuhu_Val,
                    suhu: parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg']),  // card suhu realtime (revisi ambil average)
                    suhu_avg: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg'],
                    suhu_tank_num: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['data_suhu'],
                    suhu_tank_num_raw: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['data_suhu_tank_num'],
                    avg_tinggi_suhu: [...obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg_tinggi_suhu']],
                    avg_tinggi_suhu_val: [...obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg_tinggi_suhu_val']],
                    volume: volume_final_rev,
                    volume_prev: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_prev'] ?? '-',
                    volume_tbl_plus_beda_liter: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_tbl_plus_beda_liter'],
                    volume_berat_jenis: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_berat_jenis'] ?? '-',
                    volume_faktor_koreksi: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_faktor_koreksi'] ?? '-',
                    tanggal: formatDate(new Date(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['time']), 'DD MMMM YYYY'),
                    tanggal_jam: formatDate(new Date(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['time']), 'DD MMMM YYYY HH:mm:ss'),
                    jenis: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['jenis'],
                    max_tangki: val_max_tangki
                }
            }

            // TITLE TINGGI ISI TANGKI (m)
            let find_tangki_title:any = this.mst_list_tangki.find(res_tank=>res_tank.name == ele_tank_name);
            if (find_tangki_title){
              arr_tangki_name.push(
                  // [find_tangki_title['title'], tanggal, jam]
                  find_tangki_title['title']
              );
            }
            arr_tangki_tinggi.push(parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['tinggi_minyak']));
        })

        
        // variabel untuk simpan session storage
        let sessionStorage_obj_realtime:any = [];

        // UPDATE COUNTER NUMBER REAL TIME
        Object.keys(temp_updatedState_global?.['realtime']).forEach((ele_tank,idx_tank)=>{

            let max_angka_volume = temp_updatedState_global?.['realtime'][ele_tank]?.['volume'];
            let max_angka_suhu = temp_updatedState_global?.['realtime'][ele_tank]?.['suhu'];
            let max_angka_tinggi = temp_updatedState_global?.['realtime'][ele_tank]?.['tinggi'];
            
            let max_tangki:any = this.mst_t_max?.[ele_tank];
            let max_angka_volume_percent:any = 0;
            let max_angka_volume_percent_noround:any = 0;

            if (typeof max_tangki != 'undefined' && max_tangki != null){
                max_angka_volume_percent = Math.round((max_angka_volume / max_tangki) * 100) / 100;
                // hitungan percent volume isi hanya dibulatkan 2 decimal
                max_angka_volume_percent_noround = Math.round((max_angka_volume / max_tangki) * 10000) / 100;
            }

            // simpan ke Session Storage
            let find_Tank = this.mst_list_tangki.find(ele=>ele?.['name'] == ele_tank)
            if (find_Tank){

                sessionStorage_obj_realtime = [
                    ...sessionStorage_obj_realtime,
                    {
                        name: find_Tank?.['name'],
                        api: find_Tank?.['api'],
                        bgColor: find_Tank?.['bgColor'],
                        title: find_Tank?.['title'],
                        label_gl: find_Tank?.['label'],
                        centroid: find_Tank?.['centroid'],
                        centroid_text: find_Tank?.['centroid_text'],
                        value: Number(max_angka_volume_percent),  // volume percent
                        tinggi: Number(max_angka_tinggi),
                        suhu: Number(max_angka_suhu),
                        volume: Number(max_angka_volume),
                        volume_max: Number(max_tangki),
                        volume_isi_percent: Number(max_angka_volume_percent_noround)
                    }
                ]
            }

            
            // ... <end> session storage

            // VOLUME CARD TANGKI
            setTimeout(()=>{
              let objCounter_volume = document.getElementById("angka-id-card-volume-" + ele_tank);
              if (!isNaN(max_angka_volume)){
                this.counterNumber(objCounter_volume, 0, max_angka_volume, 3000, 'kg', false, 'Volume : ', 2)
              }
            })

            // SUHU CARD TANGKI
            setTimeout(()=>{
              let objCounter_suhu = document.getElementById("angka-id-card-suhu-" + ele_tank);
              
              if (!isNaN(max_angka_suhu)){
                this.counterNumber(objCounter_suhu, 0, max_angka_suhu, 3000, '°C', false, 'Suhu : ', 2)
              }
            })

            // TINGGI CARD TANGKI
            
            setTimeout(()=>{
              let objCounter_tinggi = document.getElementById("angka-id-card-tinggi-" + ele_tank);
              if (!isNaN(max_angka_tinggi)){
                  this.counterNumber(objCounter_tinggi, 0, max_angka_tinggi, 3000, 'Cm', false, 'Tinggi : ', 3)
              }
            })
        })

        // STORE VARIABLE ANGKA REAL TIME KE 'SESSION STORAGE'
          // KAPASITAS SESSION STORAGE TERGANTUNG DARI SYSTEM MEMORY (TASK MANAGER RAM)
        if (Object.keys(sessionStorage_obj_realtime).length > 0)
        {
          // alert(JSON.stringify(sessionStorage_obj_realtime))
          if (sessionStorage.getItem("BESTRTM") != null)
          {
            sessionStorage.removeItem('BESTRTM'); // BESTRTM -> BEST REAL TIME
          }
          sessionStorage.setItem("BESTRTM", JSON.stringify(sessionStorage_obj_realtime));
        }
        
            // BESTRTM -> BEST REAL TIME
        
        // sessionStorage.setItem("BESTRTM", )

        // ... <end>


        // LOOPING AND PARSE DATA TOTAL CPO / PKO
        Object.keys(obj_tank_total).forEach((jenis_animate, idx_jenis)=>{

            // VOLUME KG (TOTAL CPO / PKO)
            let objCounter = document.getElementById("angka-id-" + jenis_animate.toLowerCase());
            this.counterNumber(objCounter, 0, obj_tank_total?.[jenis_animate.toUpperCase()], 5000, 'kg', false)

            // PERCENT (TOTAL CPO / PKO)
            let objCounterPercent = document.getElementById("angka-id-percent-" + jenis_animate.toLowerCase());
            this.counterNumber(objCounterPercent, 0, obj_tank_total_percent?.[jenis_animate.toUpperCase()], 5000, '%', false)

            // PROGRESS BAR (TOTAL)
            let objCounterProgress = document.getElementById("progress-bar-custom-width-" + jenis_animate.toLowerCase());
            objCounterProgress?.classList.add('progress-bar-add-move')
            this.counterNumber(objCounterProgress, 0, obj_tank_total_percent?.[jenis_animate.toUpperCase()], 5000, '', true)
        })

        setTimeout(()=>{
          this.setState({
            ...this.state,
            show:{
                ...this.state.show,
                iconmap: true   // show icon map di kanan atas card
            }
          })
        },5000)


        // ... end LOOPING obj_tinggi_tank_modus_filter_single

        arr_tangki_name.forEach((ele, idx)=>{

            let patt = new RegExp(/([0-9]+)/,'gi');
            let match:any = patt.exec(ele);
            let angka_temp:any = 0;
            if (match){
              angka_temp = match[0];
            }

            arr_tangki_temp.push(
              {x: ele, y: arr_tangki_tinggi[idx], 
                tangki_num: parseFloat(angka_temp)}
            )
        })

        // sort
        if (arr_tangki_temp){
          arr_tangki_temp.sort((a,b)=>{
            return a['tangki_num'] - b['tangki_num']
          })
        }
        // ... end sort

          this.setState({
            ...this.state,
            loader:{
                ...this.state.loader,
                tinggi_isi:false,
                suhu_tangki: false,
                suhu_tangki_modus_jam: false,
                volume_isi: false
            },
            chartTinggi:{
                ...this.state.chartTinggi,
                options:{
                    ...this.state.chartTinggi.options,
                    xaxis:{
                      ...this.state.chartTinggi.options.xaxis,
                      // categories: [...arr_tangki_name]    // ["Tangki 1","Tangki 2","Tangki 3","Tangki 4"]
                    }
                },
                series: [
                  {
                    // data:[...arr_tangki_tinggi],  // [4.55, 8.81, ...]
                    data:[...arr_tangki_temp], 
                    name: "Tinggi Isi Tangki"}
                ]
            },
            total: {...obj_tank_total},
            total_max_tangki: {...obj_tank_max_total},
            total_percent: {...obj_tank_total_percent},
            ...temp_updatedState_global
          })


        setTimeout(()=>{
          console.error("HASIL TOTAL VOLUME")
          console.error(this.state)
        },100)

        let obj_tinggi_isi_amchart:any = [];

        Object.keys(temp_updatedState_global?.['realtime']).forEach((ele_tank_name,idx_tank)=>{
            let find_mst_tangki = this.mst_list_tangki.find(ele_tank=>ele_tank?.['name'] == ele_tank_name)
            let title_tangki = find_mst_tangki ? find_mst_tangki?.['title'] : '';

            obj_tinggi_isi_amchart = [
              ...obj_tinggi_isi_amchart,
              { 
                tank_x: title_tangki,
                tank_value: isNaN(temp_updatedState_global?.['realtime']?.[ele_tank_name]?.['tinggi']) ? 
                          0
                        :
                        temp_updatedState_global?.['realtime']?.[ele_tank_name]?.['tinggi']
              }
            ]
        })

        
        setTimeout(()=>{
          console.log("obj_tinggi_isi_amchart")
          console.log(obj_tinggi_isi_amchart)

          // Filter untuk tank_x yang tidak kosong
          let obj_tinggi_isi_amchart_temp = obj_tinggi_isi_amchart.filter((obj, idx)=>{
            return typeof(obj?.['tank_x']) != 'undefined' && obj?.['tank_x'] != '' && obj?.['tank_x'] != null
          })

          // Urutkan Tinggi Isi Tangki dan di sorting
          // // tambahkan key-value baru untuk tank yang ada angka nya, misal "DU. Tank 1" => 1

          let obj_tinggi_isi_amchart_temp_patt_num = obj_tinggi_isi_amchart_temp.map((obj, idx)=>{
              // let obj_patt = new RegExp(/Tank [0-9]+/,'gi');
              // let obj_patt_num = obj_patt.exec(obj?.['tank_x']);
              let find_tank_name = this.mst_list_tangki.find((val, idx)=> {return val['label'] == obj?.['tank_x']})
              
              let nomor_tangki:any = 0;
              if (find_tank_name){
                  let nama_tank:any = '';
                  nama_tank = find_tank_name?.['name'];

                  let tank_name_patt:any;
                  tank_name_patt = new RegExp(/[0-9]+/,'gi');
                  let tank_name_getVal:any = tank_name_patt.exec(nama_tank);
                  if (tank_name_getVal){
                    nomor_tangki = parseFloat(tank_name_getVal[0]);
                  }
              }

              // tank_num: obj_patt_num != null && typeof(obj_patt_num) != 'undefined' ? parseFloat(obj_patt_num[0].replace(/Tank\s+/gi,"").trim()) : 0
              return {
                  ...obj,
                  tank_num: nomor_tangki
              }
          })
          // // Urutkan Tangki tersebut secara ascending
          let obj_tinggi_isi_amchart_temp_sort = obj_tinggi_isi_amchart_temp_patt_num.sort((a,b)=>{return a['tank_num'] - b['tank_num']});

          console.log("obj_tinggi_isi_amchart_temp_sort")
          console.log(obj_tinggi_isi_amchart_temp_sort)
          
          this.generateAMChart_Column3D(obj_tinggi_isi_amchart_temp_sort)
          callback()
        })

        // ... end UPDATE KE REALTIME

          // console.error("obj_tinggi_map")
          // console.error(obj_tinggi_map)
          // console.error(obj_tinggi_modus)
          // console.error("obj_tinggi_modus_filter")
          // console.error(obj_tinggi_modus_filter)



        // ... END END MODUS

    }

    getDataHour_Await(datebegin, hourbegin, hourlast, id_device, callback){

        let data_temp:any = [];

        // postApiSync("https://platform.iotsolution.id:7004/api-v1/getDataHour?sort=ASC",null,'1',

        let id_device_final:any;
        if (id_device != null){
            // kalau ada parameter nya maka hanya ambil satu tangki saja
            id_device_final = [id_device];
        }else{
            // kalau tidak ada, maka ambil semua tangki
            id_device_final = [...this.global_arr_id_device]
        }

        postApiSync(URL_API_IOT_LIVE + "/api-v1/getDataHour?sort=ASC",null,'2',
          {
            "date":formatDate(new Date(datebegin),'YYYY-MM-DD'),
            // "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '00:00' : hourbegin,
            "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '06:00' : hourbegin,
            // "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '23:59' : hourlast,
            "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '06:30' : hourlast,
            "minutes":true,
            "idDevice": id_device_final
            // "idDevice": [...this.global_arr_id_device]
          }
        )
        .then(result=>{
            data_temp = JSON.parse(JSON.stringify(result))
            callback(data_temp)
        })
      
      // (res:any)=>{

      //     if (res?.['responseCode'] == "404"
      //       || 
      //       (res?.['responseCode'] == "200" && res?.['data'].length == 0))
      //     {
      //       // jika data kosong, maka nanti munculkan icon no data found
      //       // notify("error", res?.['responseDesc']);
      //     }

      //     if (res?.['responseCode'] == "200"){
      //       let res_data:any = res?.['data'];
      //       // console.error("await post api ")
      //       callback(res_data)
      //     }
      // })
    }

    getDateMax_From_TangkiLast(){
        console.log("JSON TANGKI LAST")
        console.log(this.arr_json_tangki_last)

        let arr_time_timestamp:any[] = [];
        Object.keys(this.arr_json_tangki_last).forEach((ele:any)=>{
            let time_temp:any = new Date(this.arr_json_tangki_last?.[ele]?.['time']).getTime();
            arr_time_timestamp.push(time_temp)
        })

        this.tanggal_max_tangki_last = null;

        if (arr_time_timestamp.length > 0){

            console.log("TANGGAL MAX TANGKI LAST")
            console.log(arr_time_timestamp)
            this.tanggal_max_tangki_last = Math.max.apply(null, arr_time_timestamp)
            console.log(new Date(this.tanggal_max_tangki_last))
        }
    }

    updateSuhuTinggiTangki_PerJam(nama_tangki:any, patt_exec:any, time_tank:any, data_arr:any, data_temperature:any, obj_temp_tank?:any){

      // let patt_tinggi_tangki:any = new RegExp(/tinggi [0-9]+.?M/,'gi')
      let patt_tinggi_tangki:any = new RegExp(/tinggi [0-9]+(\.?[0-9]+)?.?M/,'gi')

      // patt_exec['input'] = "Temperature Tank 1 BA tinggi 7 M"
      let result_tinggi_tangki:any = patt_tinggi_tangki.exec(patt_exec['input']);
      if (typeof result_tinggi_tangki?.[0] != 'undefined' &&
            result_tinggi_tangki?.[0] != '')
      {
          let patt_final_tinggi:any = new RegExp(/[0-9]+\.?[0-9]*.?M/,'gi')   // 0.2 M
          let result_final_tinggi:any = patt_final_tinggi.exec(result_tinggi_tangki?.[0]);
          let tanggal_format:any;
          tanggal_format = formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss');

          if (typeof result_final_tinggi?.[0] != 'undefined' && result_final_tinggi?.[0] != null){

            // isi suhu tinggi tangki ke dalam obj_suhu_tinggi_tangki_perjam_series

            // result_final_tinggi[0] => 1 M, 3 M, 5 M, 7 M, 10 M

            let obj_keys_suhutinggi:any = Object.keys(this.obj_suhu_tinggi_tangki_perjam_series);
            let obj_keys_suhutinggi_cek:any = this.obj_suhu_tinggi_tangki_perjam_series?.[nama_tangki];

            if (typeof obj_keys_suhutinggi_cek == 'undefined' ||
                  obj_keys_suhutinggi_cek == null)
            {
                // JIKA DATA TIDAK ADA 
                // console.error("DATA TEMPERATURE TANK")
                // console.log(data_temperature)   // Temperature Tank 2 BA tinggi 3 M
                // console.log(result_tinggi_tangki)   // json {0, input}

                // console.log(data_arr?.[data_temperature])   // 43.31
                // console.log(tanggal_format)   // 2023-02-08 09:00:57
                // console.log(result_final_tinggi[0])   // 5 M

                this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki] = [
                  {
                    name: result_final_tinggi[0],
                    data: [
                      {
                        x: tanggal_format,
                        y: data_arr?.[data_temperature],
                        x_time: new Date(tanggal_format).getTime(),
                        jenis: obj_temp_tank?.[nama_tangki]?.['jenis']
                      }
                    ]
                  }
                ]
            }
            else
            {
                // JIKA DATA TANGKI SUDAH ADA SEBELUMNYA, MAKA TINGGAL DI PUSH
                // cari yang misal '1 M' == '1 M'
                let findIdx:any = this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki].findIndex(res=>res.name == result_final_tinggi[0]);
                if (findIdx == -1){
                    // jika tidak ada, maka di push semua name dan data
                    this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki].push(
                      {
                          name: result_final_tinggi[0], // 1 M
                          data: [
                            {
                              x: tanggal_format,
                              y: data_arr?.[data_temperature],
                              x_time: new Date(tanggal_format).getTime(),
                              jenis: obj_temp_tank?.[nama_tangki]?.['jenis']
                            }
                          ]
                      }
                    )
                }
                else{
                  // jika exists, maka di push data saja
                  this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki][findIdx]['data'].push(
                      {
                        x: tanggal_format,
                        y: data_arr?.[data_temperature],
                        x_time: new Date(tanggal_format).getTime(),
                        jenis: obj_temp_tank?.[nama_tangki]?.['jenis']
                      }
                  )
                }

                // console.log(this.obj_suhu_tinggi_tangki_perjam_series)

              }

          }
      }
    }

    async getAllData(datebegin:any, datelast:any, hourbegin?:any, hourlast?:any, var_mst_1m_cpo_pko?:any){

        // GET ALL DATA PER JAM (SUHU, TINGGI)
      // await postApi("https://platform.iotsolution.id:7004/api-v1/getAllData",null,true,'1',(res:any)=>{

      // await postApi("https://platform.iotsolution.id:7004/api-v1/getDataDate?sort=ASC",null,true,'1',
      // "dateBegin":formatDate(new Date(datebegin),'YYYY-MM-DD'),
      // "dateLast":formatDate(new Date(datelast),'YYYY-MM-DD')

      let getDeviceValidPattern:any = await this.get_DeviceValidPattern();
      
      // LAGI FIXING PAK BAYU getDataHour banyak yg NaN
      await postApi(URL_API_IOT_LIVE + "/api-v1/getDataHour?sort=ASC",null,true,'2',
      // await postApi("https://platform.iotsolution.id:7004/api-v1/getDataHour?sort=ASC",null,true,'1',
        {
          "date":formatDate(new Date(datebegin),'YYYY-MM-DD'),
          // // === BALIKKIN LAGI ===
          // "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '00:00' : hourbegin,
          "hourBegin": (typeof hourbegin == 'undefined' || hourbegin == null) ? '06:00' : hourbegin,
          // "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '23:59' : hourlast,
          "hourLast": (typeof hourlast == 'undefined' || hourlast == null) ? '07:10' : hourlast,
          "minutes":true,
          "idDevice": [...this.global_arr_id_device]
        },
      (res:any)=>{
        
        console.log("post api await per jam")
        console.log(res)

        if (res?.['responseCode'] == "404"
            || 
            (res?.['responseCode'] == "200" && res?.['data'].length == 0)){
            
            if (res?.['responseCode'] == "404"){
                notify("error", res?.['responseDesc']);
            }


            this.setChartJarakSensorJam = {
              ...this.setChartJarakSensorJam,
              statusFound: false
            }

            this.setChartTinggiJam = {
              ...this.setChartTinggiJam,
              statusFound: false
            }

            this.setChartTinggi_Modus_Jam = {
              ...this.setChartTinggi_Modus_Jam,
              statusFound: false
            }

            this.setChartSuhuJam = {
              ...this.setChartSuhuJam,
              statusFound: false
            }

            this.setChartSuhuModusJam = {
              ...this.setChartSuhuModusJam,
              statusFound: false
            }

            this.setChartSuhuTinggiJam = {
              ...this.setChartSuhuTinggiJam,
              statusFound: false
            }

            this.setChartVolumeJam = {
              ...this.setChartVolumeJam,
              statusFound: false
            }


            this.setState({
              ...this.state,
              loader:{
                ...this.state.loader,
                jarak_sensor_jam: false,
                tinggi_isi_jam: false,
                tinggi_isi_modus_jam: false,
                suhu_tangki_jam: false,
                suhu_tangki_modus_jam: false,
                suhu_tinggi_tangki_jam: false,
                volume_tangki_jam: false
              },
              chartJarakSensorJam: {...this.setChartJarakSensorJam},
              chartTinggiJam: {...this.setChartTinggiJam},
              chartTinggiModusJam: {...this.setChartTinggi_Modus_Jam},
              chartSuhuJam:{...this.setChartSuhuJam},
              chartSuhuModusJam:{...this.setChartSuhuModusJam},
              chartSuhuTinggiJam: {...this.setChartSuhuTinggiJam},
              chartVolumeJam:{...this.setChartVolumeJam}
            })
            
            return
        }

        
        if (res?.['responseCode'] == "200"){
          this.obj_suhu_tinggi_tangki_perjam_series = {};

          let res_data:any = res?.['data'];

          let obj_temp_tank_forExcel:any;


          if (typeof res_data != 'undefined' && res_data != null){


              // ambil data dengan id devices "BESTAGRO" (lama) / "HP_PAMALIAN" (baru)
              this.arr_json_alldata = [...
                  res_data.filter((res:any)=>{
                      if (typeof res?.['id_device'] != 'undefined' &&
                          res?.['id_device'] != null && 
                          (
                            getDeviceValidPattern.find((val, idx)=> res?.['id_device'].toString().toUpperCase().indexOf(val) != -1)
                            // res?.['id_device'].toString().toUpperCase().indexOf("BESTAGRO") != -1 ||
                            // res?.['id_device'].toString().toUpperCase().indexOf("HP_PAMALIAN") != -1 ||
                            // res?.['id_device'].toString().toUpperCase().indexOf("WSSLTANK") != -1 ||
                            // res?.['id_device'].toString().toUpperCase().indexOf("TASK1TANK") != -1
                          )
                      )
                      {
                          return true
                      }
                  })
              ]

              // isi data suhu semua jam
              this.data_suhu_tangki_perjam_categories = [];
              
              let time_tank:any = '';
              let time_first:any = '';
              // loop json all data
              
              this.arr_json_alldata.forEach((ele:any, index:any) => {
                  let data_arr:any = (ele?.['data']?.[0]);

                  if (index == 0){
                    time_first = ele?.['time'] ?? '';
                  }

                  //2023-01-31 03:05:03
                  time_tank = ele?.['time'] ?? '';  
                  // let a = Date.parse(formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'));
                  // console.log(new Date(new Date(a).toUTCString()).getHours())

                  // untuk menampung data sementara per tangki
                  // perhitungan average suhu di lihat dari object ini
                  let obj_temp_tank:any = {}

                  let obj_keys_suhu = Object.keys(data_arr);

                  // LOOPING obj_keys_suhu (Object.keys(data_arr))
                  // console.log(data_arr)

                  // UPDATE TINGGI MINYAK
                  let tinggi_hitung:any = '';

                  obj_keys_suhu.forEach((ele_attr:any)=>{

                    // UPDATE SUHU TANGKI
                    let patt = new RegExp(/(Temperature Tank [0-9]+)/,'gi')
                    let patt_exec = patt.exec(ele_attr);

                    if (patt_exec != null){ 
                        // console.log("patt_exec temperature tank")
                        // patt_exec['input'] => Temperature Tank 1 BA tinggi 1 M
                        let data_temperature:any = patt_exec['input'];
                        // console.log(data_temperature)
                        // console.log(time_tank);

                        let patt_tank = new RegExp(/(Tank [0-9]+)/,'gi')
                        let patt_tank_exec = patt_tank.exec(patt_exec[0])

                        if (patt_tank_exec != null){
                          // console.log("regexp")
                          // console.log(patt_tank_exec[0])
                          // patt_tank_exec[0] => Tank 1, Tank 2, dst...
                          let data_tank:any = patt_tank_exec[0];


                          if (patt_tank_exec[0] != null){

                              let nama_tangki:any = '';
                              let title_tangki:any = '';

                              let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                              if (find_mst_list){
                                
                                  nama_tangki = find_mst_list?.['name'] ?? '';
                                  title_tangki = find_mst_list?.['title'] ?? '';

                                  let patt_tank_number = new RegExp(/([0-9]+)/,'gi')
                                  let patt_tank_number_exec = patt_tank_number.exec(patt_tank_exec[0]) ?? -1
                                  
                                  // SHOW
                                  // SUHU BERDASARKAN TINGGI
                                  // let patt_tank_tinggi_num = new RegExp(/(tinggi [0-9]+.?M)/,'gi')
                                  let patt_tank_tinggi_num = new RegExp(/(tinggi [0-9]+(\.?[0-9]+)?.?M)/,'gi')
                                  let patt_tank_tinggi_num_exec = patt_tank_tinggi_num.exec(data_temperature);
                                  
                                  let patt_tank_tinggi_num_exec_final = patt_tank_tinggi_num_exec != null 
                                          ? parseFloat(patt_tank_tinggi_num_exec[0].replace(/(tinggi|M)/gi,'').trim())
                                          : null

                                  // push data temperature ke dalam variable obj_temp_tank

                                  // key "data" & "data_suhu_tank_num" mempunyai urutan yang sama secara suhu
                                  // misal  => data : ['34.84', '32.66', '32.97', '36.09', '36.09']
                                  //        => data : [10, 7, 5, 3, 1]
                                  
                                  obj_temp_tank[nama_tangki] = {
                                      ...obj_temp_tank[nama_tangki],
                                      title: title_tangki,
                                      tanggal: time_tank,
                                      tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                                      // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                      // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                      // tanggal_tz: new Date(time_tank).getTime() + new Date(time_tank).getTimezoneOffset() * 60000,
                                      // tanggal_tz: new Date(time_tank),
                                      data: obj_temp_tank[nama_tangki]?.['data'] == null ? 
                                            [data_arr?.[data_temperature]] 
                                            : [...obj_temp_tank[nama_tangki]?.['data'], data_arr?.[data_temperature]],

                                      data_suhu_tank_num: obj_temp_tank[nama_tangki]?.['data_suhu_tank_num'] == null ? 
                                            [patt_tank_tinggi_num_exec_final] 
                                            : [...obj_temp_tank[nama_tangki]?.['data_suhu_tank_num'], patt_tank_tinggi_num_exec_final]
                                  }

                                  // AMBIL label tinggi (etc: 1 M, 3 M, 5 M, 7 M, 10 M)

                                  // UPDATE SUHU TINGGI TANGKI
                                  this.updateSuhuTinggiTangki_PerJam(nama_tangki, patt_exec, time_tank, data_arr, data_temperature, obj_temp_tank);
                                  // ... end UPDATE SUHU TINGGI TANGKI
                                  

                                  // console.log(new Date(time_tank).getTime() + new Date(time_tank).getTimezoneOffset() * 60000);
                                  // console.log(new Date(time_tank));
                                  // console.log(time_tank)

                                  // obj_temp_tank[nama_tangki]['data'].push(
                                  //   data_arr?.[data_temperature]
                                  // )
                                  // console.log(nama_tangki)
                              }
                          }
                        }

                    }


                    // ... <end SUHU TANGKI>


                    // === BALIKKIN LAGI (JARAK SENSOR) ===
                    let patt_tinggi = new RegExp(/(Jarak Sensor dengan permukaan Tank [0-9]+)/,'gi')
                    let patt_tinggi_exec = patt_tinggi.exec(ele_attr);
                    if (patt_tinggi_exec != null){

                        let data_jarak_sensor:any = patt_tinggi_exec['input'];

                        let patt_tank = new RegExp(/(Tank [0-9]+)/,'gi')
                        let patt_tank_exec = patt_tank.exec(patt_tinggi_exec[0])
                        // console.log("PATT TANK EXEC")
                        // console.log(patt_tank_exec)

                        if (patt_tank_exec != null){
                            // console.log("regexp")
                            // console.log(patt_tank_exec[0])
                            // patt_tank_exec[0] => Tank 1, Tank 2, dst...
                            let data_tank:any = patt_tank_exec[0];

                            if (patt_tank_exec[0] != null){
                                let nama_tangki:any = '';
                                let title_tangki:any = '';
                                
                                // UPDATE TINGGI MINYAK 
                                let tinggi_hitung:any = '';
                                
                                let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                                if (find_mst_list){

                                      nama_tangki = find_mst_list?.['name'] ?? '';
                                      title_tangki = find_mst_list?.['title'] ?? '';

                                      // cari tinggi minyak
                                      let tangki_jarak_sensor:any =  data_arr?.[data_jarak_sensor];

                                      // if (nama_tangki == 'tangki_2'){
                                        // INI BARU UPDATE (NANTI AKAN DIHAPUS)
                                          // console.log("INI BARU TANGKI 2, " + time_tank + " -> " + tangki_jarak_sensor)
                                          // console.log("INI BARU TANGKI 2")
                                          // console.log(tangki_jarak_sensor)
                                      // }

                                      if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                                          if (typeof tangki_jarak_sensor == 'string'){
                                            tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100);
                                            // tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                                          }else{
                                            // tangki_jarak_sensor = (tangki_jarak_sensor / 100).toFixed(2);
                                            tangki_jarak_sensor = (tangki_jarak_sensor / 100);
                                          }
                                      }else{tangki_jarak_sensor = 0}

                                      // === CARI TINGGI MINYAK PAKAI TINGGI DELTA ===

                                      // // let ruang_kosong:any = (parseFloat(data_arr?.[data_jarak_sensor]) / 100) - this.mst_avg_t_segitiga?.[nama_tangki];
                                      // // let ruang_kosong:any = (tangki_jarak_sensor - this.mst_avg_t_segitiga?.[nama_tangki]).toFixed(2);
                                      // let ruang_kosong:any = (tangki_jarak_sensor - this.mst_avg_t_segitiga?.[nama_tangki]);
                                      
                                      // // tinggi_hitung = (this.mst_t_tangki?.[nama_tangki] - ruang_kosong).toFixed(3);
                                      // // REVISI TINGGI MINYAK PEMBULATAN tiga decimal (TGL 22 FEB '23)
                                      // let tinggi_hitung:any = Math.round((this.mst_t_tangki?.[nama_tangki] - ruang_kosong) * 1000) / 1000;

                                      // ... end <TINGGI DELTA>


                                      // === CARI TINGGI MINYAK PAKAI TINGGI PROFILE ===
                                      tinggi_hitung = 0;
                                      if (typeof this.mst_t_profile?.[nama_tangki] != 'undefined' &&
                                            this.mst_t_profile?.[nama_tangki] != null)
                                      {
                                          tinggi_hitung = Math.round((this.mst_t_profile?.[nama_tangki] - tangki_jarak_sensor) * 1000) / 1000;
                                      }
                                      // ... end <TINGGI PROFILE>
                                      
                                      // ... end tinggi minyak

                                      // JIKA HASIL NYA MINUS, maka di nol kan saja 
                                      // REVISI (TGL 22 FEB '23)
                                      if (tinggi_hitung < 0){
                                        tinggi_hitung = 0;
                                      }


                                      obj_temp_tank[nama_tangki] = {
                                          ...obj_temp_tank[nama_tangki],
                                          title: title_tangki,
                                          tanggal: time_tank,
                                          tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                                          // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                          // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                          // tanggal_tz: new Date(time_tank).getTime() + new Date(time_tank).getTimezoneOffset() * 60000,
                                          // tanggal_tz: new Date(time_tank),
                                          data_jarak_sensor: data_arr?.[data_jarak_sensor],
                                          data_jarak_sensor_m: tangki_jarak_sensor,
                                          tinggi_minyak_cm: parseFloat(tinggi_hitung) * 100,
                                          tinggi_minyak: tinggi_hitung   // satuan meter (m)   PIIS
                                          // tinggi_minyak: parseFloat(tinggi_hitung) * 100  // jadikan cm (satuan cm)
                                          // tinggi_minyak: data
                                          // data_jarak_sensor: obj_temp_tank[nama_tangki]?.['data_jarak_sensor'] == null ?
                                          //       [data_arr?.[data_jarak_sensor]]
                                          //       : [...obj_temp_tank[nama_tangki]?.['data_jarak_sensor'], data_arr?.[data_jarak_sensor]]
                                    }
                                }
                            }

                        }
                    }
                    

                  // LOOPING obj_keys_tinggi (Object.keys(data_arr))

                  })

                  // console.error("(TES) OBJECT TEMP")
                  // console.log(obj_temp_tank)

                  // ... end LOOPING obj_keys_suhu (Object.keys(data_arr))

                  // hitung rata-rata tangki "obj_temp_tank"
                  // === BALIKKIN LAGI (JARAK SENSOR) ===
                  let arr_obj_keys_avg = Object.keys(obj_temp_tank);
                  arr_obj_keys_avg.forEach((ele_tank_name:any) => {

                    // AMBIL DATA SUHU BERDASARKAN KETINGGIAN MINYAK CPO
                    // data_suhu_tank_num
                      let arr_tinggi_suhu_tmp:any = [];
                      let arr_tinggi_suhu_val_tmp:any = [];
                      let arr_obj_tmp_tank_data:any = obj_temp_tank[ele_tank_name]['data'];

                      // let obj_tmp_tank_tinggi_minyak:any = Math.floor(parseFloat(obj_temp_tank[ele_tank_name]['tinggi_minyak']));

                      // REVISI KETINGGIAN SUHU yang KE CELUP  20 feb '23
                      let obj_tmp_tank_tinggi_minyak:any = parseFloat(obj_temp_tank[ele_tank_name]['tinggi_minyak']);
                      // ... <end REVISI KETINGGIAN>

                      if (obj_tmp_tank_tinggi_minyak >= 1){

                          if (arr_obj_tmp_tank_data.length > 0){
                              arr_obj_tmp_tank_data.forEach((ele_suhu_num,idx)=>{

                                // [1, 3, 5, 7, 10]
                                let data_suhu_tank_num_idx:any = obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx];

                                // REVISI KETINGGIAN SUHU yang KE CELUP 20 feb '23

                                  if (obj_tmp_tank_tinggi_minyak < 4)
                                  {
                                      // jika tinggi di bawah 4 m, maka ambil ketinggian suhu [1]
                                      if (data_suhu_tank_num_idx == 1){
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  } 
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 4 && obj_tmp_tank_tinggi_minyak < 6){
                                      // jika tinggi di bawah 4 m s/d 5.99, maka ambil ketinggian suhu [1,3]
                                      if (data_suhu_tank_num_idx <= 3){    // ambil [1,3]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 6 && obj_tmp_tank_tinggi_minyak < 8){
                                      // jika tinggi di bawah 6 m s/d 7.99, maka ambil ketinggian suhu [1,3,5]
                                      if (data_suhu_tank_num_idx <= 5){    // ambil [1,3,5]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 8 && obj_tmp_tank_tinggi_minyak < 10){
                                      // jika tinggi di bawah 8 m s/d 9.99, maka ambil ketinggian suhu [1,3,5,7]
                                      if (data_suhu_tank_num_idx <= 7){    // ambil [1,3,5,7]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 10){
                                      // jika tinggi di bawah 10 m, maka ambil ketinggian suhu [1,3,5,7,10]
                                      if (data_suhu_tank_num_idx <= 10){    // ambil [1,3,5,7,10]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }

                                // ... <end REVISI KETINGGIAN>


                                  // if (obj_tmp_tank_tinggi_minyak >= obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]
                                  //     ){
                                  //     arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                  //     arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                  // }
                              })
                          }
                      }else{
                        // JIKA MINUS, MAKA INJECT KETINGGIAN 1 M
                        if (obj_tmp_tank_tinggi_minyak < 1){

                          let arr_obj_tmp_tank_data:any = obj_temp_tank[ele_tank_name]['data_suhu_tank_num'];
                          let findIdx = arr_obj_tmp_tank_data.findIndex(ele=>ele == 1);
                          if (findIdx != -1){
                              arr_tinggi_suhu_tmp.push(1);
                              arr_tinggi_suhu_val_tmp.push(obj_temp_tank[ele_tank_name]['data'][findIdx]);
                          }
                          // arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[1]);
                        }
                      }
                    // ... END AMBIL DATA SUHU BERDASARKAN KETINGGIAN MINYAK CPO


                      // let total:any = obj_temp_tank[ele_tank_name]['data'].reduce((tmp:any, val:any)=>{
                      let total:any = arr_tinggi_suhu_val_tmp.reduce((tmp:any, val:any)=>{
                          return tmp + parseFloat(val);
                      },0)

                      // (TIDAK DI PAKAI SUHU RATA-RATA)
                      // let avg_tank:any = (total / obj_temp_tank[ele_tank_name]['data'].length).toFixed(3);
                      // let avg_tank:any = (total / arr_tinggi_suhu_val_tmp.length).toFixed(3);
                      obj_temp_tank[ele_tank_name] = {
                          ...obj_temp_tank[ele_tank_name],
                          // avg: avg_tank,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp]
                      }
                  });
                  // ... <end>

                  
                  // === UPDATE VOLUME TANGKI MINYAK ===
                  // console.log("Tinggi Hitung (VOLUME)")
                  // console.log(obj_temp_tank)

                  
                  // === BALIKKIN LAGI (VOLUME TANGKI) ===
                  let arr_obj_keys_vol = Object.keys(obj_temp_tank);

                  arr_obj_keys_vol.forEach((tangki_name:any)=>{
                    
                    // console.error("HALO TINGGI MINYAK TANGKIIIIIIIIIIII")
                    //   console.error(parseFloat(obj_temp_tank[tangki_name]['tinggi_minyak']).toFixed(3))

                      let tinggi_tmp:any = parseFloat(obj_temp_tank[tangki_name]['tinggi_minyak']).toFixed(3);

                      // TIDAK PAKAI INI (SUHU RATA-RATA)
                      // let avg_tmp:any = parseFloat(obj_temp_tank[tangki_name]['avg']);
                      // ... end

                      // REVISI TANGGAL 29 MARET 2023 (SUHU SATU TITIK)
                      // *** ambil suhu di satu titik saja ***
                      //     acuan ke "suhu_tank_num" & "suhu_tank_num_raw"
                      //     perhitungan di plus 4

                      let suhu_1titik_level_minyak = parseFloat(obj_temp_tank?.[tangki_name]?.['tinggi_minyak']);
                      let arr_suhu_1titik_suhu_tank_num = obj_temp_tank?.[tangki_name]?.['data'];    // ['40.63', '38.91', '37.91', '28.59', '27.97']

                      let arr_suhu_1titik_suhu_tank_num_raw = obj_temp_tank?.[tangki_name]?.['data_suhu_tank_num']; // [1, 3, 5, 7, 10]
                      let suhu_1titik_getTinggiSuhu;
                      let suhu_1titik_getTinggiSuhu_Val;

                      // CARI SUHU 1 TITIK DARI DATABASE dalam array "mst_suhu1titik"
                      let findSuhu1Titik:any = this.mst_suhu1titik.find((ele_suhu1titik,idx_suhu1titik)=>{
                          if (ele_suhu1titik?.['tangki_id'] == tangki_name &&
                              ele_suhu1titik?.['level_isi_start'] <= suhu_1titik_level_minyak &&
                              ele_suhu1titik?.['level_isi_end'] >= suhu_1titik_level_minyak)
                          {
                              return true 
                          }
                      })
                      suhu_1titik_getTinggiSuhu = findSuhu1Titik?.['suhu_tinggi'];

                      // if (suhu_1titik_level_minyak < 5){
                      //     suhu_1titik_getTinggiSuhu = 0;
                      // }
                      // else if (suhu_1titik_level_minyak >= 5 && suhu_1titik_level_minyak < 7){
                      //     suhu_1titik_getTinggiSuhu = 1;
                      // }
                      // else if (suhu_1titik_level_minyak >= 7 && suhu_1titik_level_minyak < 9){
                      //     suhu_1titik_getTinggiSuhu = 3;
                      // }
                      // else if (suhu_1titik_level_minyak >= 9 && suhu_1titik_level_minyak < 11){
                      //     suhu_1titik_getTinggiSuhu = 5;
                      // }
                      // else if (suhu_1titik_level_minyak >= 11){
                      //     suhu_1titik_getTinggiSuhu = 7;
                      // }

                        //    level suhu tinggi 7 & 10 M tidak di pakai
                      let findIdx = arr_suhu_1titik_suhu_tank_num_raw.findIndex(ele_raw=>parseFloat(ele_raw) == parseFloat(suhu_1titik_getTinggiSuhu))
                      if (findIdx != -1){
                          try {
                            suhu_1titik_getTinggiSuhu_Val = arr_suhu_1titik_suhu_tank_num?.[findIdx];
                          }catch(e){
                            suhu_1titik_getTinggiSuhu_Val = 0;
                          }
                      }else{
                          suhu_1titik_getTinggiSuhu_Val = 0;
                      }

                      let avg_tmp:any = suhu_1titik_getTinggiSuhu_Val;

                      let data_suhu_slice:any = []; 
                      let data_suhu_slice_sum:any = 0;
                      let data_suhu_slice_sum_avg:any = 0;

                      // Average-kan data suhu
                      if (Array.isArray(obj_temp_tank[tangki_name]?.['data'])
                        && findIdx >= 0)
                        {
                            if (obj_temp_tank[tangki_name]?.['data'].length > 0)
                            {
                                data_suhu_slice = obj_temp_tank[tangki_name]?.['data'].slice(0, findIdx + 1);

                                data_suhu_slice_sum = data_suhu_slice.reduce((tmp, val)=>{
                                    return parseFloat(tmp) + parseFloat(val);
                                },0)

                                data_suhu_slice_sum_avg = Math.round((data_suhu_slice_sum / data_suhu_slice.length) * 100) / 100;

                                // avg_tank = data_suhu_slice_sum_avg;
                                avg_tmp = data_suhu_slice_sum_avg;
                                
                                // console.log("data_suhu_slice");
                                // console.log(data_suhu_slice);
                                // console.log("data_suhu_slice_sum");
                                // console.log(data_suhu_slice_sum);
                                // console.log("data_suhu_slice_sum_avg");
                                // console.log(data_suhu_slice_sum_avg);
                            }
                        }
                        else
                        {
                          // avg_tank = 0;
                          avg_tmp = 0;
                        }



                      obj_temp_tank[tangki_name] = {
                          ...obj_temp_tank[tangki_name],
                          avg: avg_tmp
                      }

                      // ... end <satu titik>

                      if (tinggi_tmp != null){
                          
                          // REVISI TINGGI FLOOR
                          // tinggi cpo jangan di bulatkan, ambil floor utk perhitungan volume
                          // 1010,7 -> 1010, sisa desimal 0,7 dikali beda liter

                          // REVISI VOLUME BEDA LITER
                          let tinggi_tmp_floor:any = Math.floor(parseFloat(tinggi_tmp) * 100); // angka floor ( 1010 )
                          let tinggi_tmp_all:any = parseFloat((parseFloat(tinggi_tmp) * 100).toFixed(3));   // angka plus decimal ( 1010,7 )
                          let tinggi_tmp_dec:any = (Math.round((tinggi_tmp_all - tinggi_tmp_floor) * 1000)) / 1000;   // (1010,7777 - 1010 = 0,778)
                          // ... end <REVISI VOLUME BEDA LITER>

                          // if (tinggi_tmp_dec < 1){
                          //     console.error("TINGGI TMP DEC")
                          //     console.error(tinggi_tmp_floor) 
                          //     console.error(tinggi_tmp_all)
                          //     console.error(tinggi_tmp_dec)
                          // }
                          // END REVISI


                          // panggil array json tabel volume tangki yang sesuai

                          let arr_volume:any = this.json_arr_volume_tangki(tangki_name);

                          let findItem:any = arr_volume.find(res=>
                                // parseInt(res.tinggi) == Math.round(tinggi_tmp.toFixed(2) * 100)
                                // in chrome toFixed not rounding (.5) => misal: 5.335 -> 5.33; 5.336 -> 5.34
                                // parseInt(res.tinggi) == Math.round(parseFloat(parseFloat(tinggi_tmp).toFixed(2))*100)
                                // parseInt(res.tinggi) == Math.round(parseFloat(tinggi_tmp)*100)
                                parseInt(res.tinggi) == tinggi_tmp_floor
                          )
                          // console.error("FIND ITEM MATH ROUND")
                          // console.error(findItem)

                          let tanggal_tangki:any = new Date(obj_temp_tank[tangki_name]['tanggal']);

                          let jenis:any = '';
                          
                          let findCpoPko = this.arr_cpo_pko.find(res=>
                                    res.name == tangki_name &&
                                    (
                                      (new Date(res.datebegin) <= tanggal_tangki
                                          && (res.datelast != '' && res.datelast != null && new Date(res.datelast) >= tanggal_tangki)
                                      )
                                      ||
                                      (
                                        (new Date(res.datebegin) <= tanggal_tangki)
                                          && (res.datelast == '' || res.datelast == null)
                                      )
                                    ) 
                                    // && 
                                    // (res.datelast == null || res.datelast == '' || new Date(res.datelast) >= tanggal_tangki)
                          )

                          
                          // CARI CPO / PKO DARI arr_cpo_pko
                          // acuan utama jika suhu 1m kosong, maka akan mengambil object tanggal berlaku utk dapat "jenis"
                          // jika sudah ada jenis dalam object "mst_1m_cpo_pko", maka acuannya ke object tersebut.
                          // *** DIUTAMAKAN suhu ketinggian 1m ***
                          // *function "get_suhu1M_CPO_PKO" utk mst_1m_cpo_pko

                          if (typeof var_mst_1m_cpo_pko != 'undefined' &&
                                var_mst_1m_cpo_pko != null)
                          {
                              if (var_mst_1m_cpo_pko?.[tangki_name] == '')
                              {
                                  if (findCpoPko){
                                      jenis = findCpoPko?.['jenis']
                                  }
                              }
                              else{
                                  // DI UTAMAKAN SUHU KETINGGIAN 1 M
                                  jenis = var_mst_1m_cpo_pko?.[tangki_name];
                              }
                          }
                          else{
                            if (findCpoPko){
                                jenis = findCpoPko?.['jenis']
                            }
                          }


                          // *** (PRIORITAS SUHU) UBAH JENIS BASED ON API (get_jenis_by_api) ***

                          let jenisExistsInDB:boolean = false;

                          Object.keys(this.mst_jenis_by_api_perjam).forEach((ele_tank_api, idx_tank_api)=>{

                              if (ele_tank_api == tangki_name)
                              {
                                if (this.mst_jenis_by_api_perjam?.[ele_tank_api] != '' &&
                                    this.mst_jenis_by_api_perjam?.[ele_tank_api] != null)
                                {
                                    jenis = this.mst_jenis_by_api_perjam?.[ele_tank_api];
                                    jenisExistsInDB = true;
                                }
                              }
                          })

                          if (!jenisExistsInDB){

                            // PRIORITAS JENIS (CPO / PKO)
                            // -> 1. Langsung ditentukan suhu 1 titik yang diambil apakah <= 39.9999 atau > 39.9999
                            // -> 2. Database (api : getJenisByDatentank)
                            // -> 3. mst_1m_cpo_pko (titik 1 M jam 7:30 - 8:00)
                            // -> 4. arr_cpo_pko (tanggal berlaku)

                            // UPDATE TERBARU (PENENTUAN CPO / PKO DARI SUHU YANG DI AMBIL)
                            // JIKA SUHU 1 TITIK <= 39.9999, MAKA DIANGGAP "PKO", SEBALIKNYA JIKA > 39.9999 MAKA DIANGGAP "CPO" 

                            // jenis = Math.floor(avg_tmp) <= 39.9999 ? "PKO" : "CPO";
                            jenis = avg_tmp <= 39.9999 ? "PKO" : "CPO";
                            // ... <end>
                          }

                          // if (this.mst_1m_cpo_pko?.[tangki_name] == "")
                          // {
                              // jika pakai tanggal berlaku
                              // if (findCpoPko){
                              //     jenis = findCpoPko?.['jenis'];

                                  // console.log("kalkulasi_volume_tangki findCpoPko");
                                  // console.log(findCpoPko)
                              // }
                              // ... <end> pakai tanggal berlaku
                          // }
                          // else{
                              // jenis = this.mst_1m_cpo_pko?.[tangki_name];
                              // jenis = "halo"
                              // alert(jenis)
                          // }
                          
                          if (findItem){
                  
                              let volume_tbl:any = 0;
                              let beda_liter_mst:any = 0;
                              let beda_liter_hitung:any = 0;

                              // VOLUME LITER ATAU KG tangki
                              volume_tbl = parseFloat(findItem.volume);
                              beda_liter_mst = parseFloat(findItem.beda_liter);

                              // * 1000 / 1000 => tujuan nya decimal 5 bisa dibulatkan
                              beda_liter_hitung = Math.round((beda_liter_mst * tinggi_tmp_dec) * 1000) / 1000; // cth : (dari 1010,7) 0.7 * 4613 => 3229,1 
                              // dikali dengan berat jenis nya apakah cpo atau pko

                              let faktor_koreksi_temp:any;
                              let volume_prev:any = volume_tbl;

                              // REVISI VOLUME BEDA LITER

                              let volume_tbl_plus_beda_liter:any;
                              if (typeof findItem?.['volume'] != 'undefined' &&
                                    findItem?.['volume'] != null)
                              {
                                  volume_tbl_plus_beda_liter = volume_tbl + beda_liter_hitung;
                              }

                              volume_tbl = volume_tbl_plus_beda_liter;

                              // end <REVISI VOLUME BEDA LITER>

                              
                              
                              if (jenis != '' && jenis != null){
                                  let arr_berat_jenis:any = this.json_arr_berat_jenis_tangki(jenis, tangki_name);

                                  // === UPDATE BERAT JENIS ===
                                  let find_berat_jenis:any = arr_berat_jenis.find(res=>
                                        // Math.round(parseFloat(res.temperature)) == Math.round(avg_tmp)
                                        Math.round(parseFloat(res.temperature)) == Math.floor(avg_tmp)
                                    );


                                  // if (tangki_name == "tangki_3"){
                                    // console.error("tinggi tmp tangki_3 : " + tinggi_tmp)
                                    // console.error("tanggal jam tmp tangki_3 : " + formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'))
                                    // console.error("volume tbl tangki_3 : " + volume_tbl)
                                    // console.error("berat jenis tangki_3 : " + find_berat_jenis?.['berat_jenis'])
                                  // }

                                  // console.error("CEK SINI GET ALL DATA (VOLUME PREV)")
                                  // console.error(volume_tbl)

                                  if (find_berat_jenis){
                                      volume_tbl = volume_tbl * find_berat_jenis?.['berat_jenis'];
                                      // volume_prev = volume_tbl;   // just info volume sebelumnya
                                  }

                                    // console.error("CEK SINI GET ALL DATA")
                                    // console.error(findItem)
                                    
                                    // console.error("CEK SINI GET ALL DATA (TIME TANK)")
                                    // console.error(time_tank)
                                    // console.error("CEK SINI GET ALL BERAT JENIS")
                                    // console.error(find_berat_jenis)
                                    // console.error("CEK SINI GET ALL VOLUME TBL x BERAT JENIS")
                                    // console.error(volume_tbl)

                                  // faktor koreksi
                                  // console.error("CEK SINI GET ALL ERROR avg_tmp")
                                  // console.error(Math.round(parseFloat(avg_tmp)))

                                  // faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.round(parseFloat(avg_tmp)));
                                  faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.floor(parseFloat(avg_tmp)));
                                  if (faktor_koreksi_temp != null){
                                      // console.error('volume tbl ',volume_tbl)
                                      // console.log(tangki_name)
                                      // console.error('faktor koreksi : ',faktor_koreksi_temp)
                                      // console.error('volume tbl :  ',volume_tbl)
                                      volume_tbl *= faktor_koreksi_temp;
                                      // console.error('volume tbl (final) :  ',volume_tbl)
                                  }

                                  // (SUHU 1 TITIK) jika 1 titik suhu di dapat 0 / di bawah 5 M, maka volume langsung di set 0
                                  let volume_final:any;
                                  if (suhu_1titik_getTinggiSuhu == 0)
                                  {
                                      volume_final = 0;
                                  }
                                  else{
                                      volume_final = typeof(volume_tbl) != 'undefined' && volume_tbl != null ? Math.round(parseFloat(volume_tbl) * 100) / 100 : 0
                                  }

                                  obj_temp_tank[tangki_name] = {
                                      ...obj_temp_tank[tangki_name],
                                      volume_prev,    // volume master
                                      volume_tbl_plus_beda_liter,
                                      berat_jenis: find_berat_jenis?.['berat_jenis'],
                                      faktor_koreksi: faktor_koreksi_temp,
                                      tinggi_tmp_floor,
                                      tinggi_tmp_all,
                                      tinggi_tmp_dec,
                                      beda_liter_mst,
                                      beda_liter_hitung,
                                      // volume: volume_tbl.toFixed(2),
                                      volume: volume_final,
                                      jenis,
                                      suhu_1titik_getTinggiSuhu
                                  }


                                  // if (tangki_name == "tangki_3"){
                                  //   console.error(obj_temp_tank[tangki_name])
                                  // }
                                  
                                  // alert(JSON.stringify(arr_berat_jenis))
                                  // volume_tbl => volume dari tabel
                                  
                              }

                            // ... end (dikali dengan berat jenis nya apakah cpo atau pko)

                          }
                          else{
                            // jika tinggi tidak ketemu di volume, tetap update jenis cpo / pko
                            obj_temp_tank[tangki_name] = {
                              ...obj_temp_tank[tangki_name],
                              jenis
                            }
                          }
                          // else{
                          //     console.error("NAN VOLUME TABLE")
                          //     console.log(tangki_name)
                          //     console.log(tinggi_tmp.toFixed(2) * 100)
                          //     console.log(Math.round(tinggi_tmp.toFixed(2) * 100))
                          // }

                      }
                      

                  })
                  // ... end BALIKKIN

                  // === FOR EXCEL EXPORT ===

                  Object.keys(obj_temp_tank).forEach((ele_tank_name,idx_tank_name)=>{

                      if (typeof obj_temp_tank_forExcel != 'undefined' &&
                          obj_temp_tank_forExcel != null)
                      {
                          obj_temp_tank_forExcel = [
                              ...obj_temp_tank_forExcel,
                              {
                                ...obj_temp_tank[ele_tank_name],
                                tangki: ele_tank_name
                              }
                          ]

                          // JIKA MAU OBJECT, {tangki_1: [{...}]}
                          // obj_temp_tank_forExcel = {
                          //     ...obj_temp_tank_forExcel,
                          //     [ele_tank_name]: [
                          //         ...obj_temp_tank_forExcel[ele_tank_name],
                          //         {
                          //           tangki: ele_tank_name,
                          //           ...obj_temp_tank[ele_tank_name]
                          //         }
                          //     ]
                          // }
                      }
                      else{

                          obj_temp_tank_forExcel = [
                              {
                                ...obj_temp_tank[ele_tank_name],
                                tangki: ele_tank_name
                              }
                          ]

                          // JIKA MAU OBJECT, {tangki_1: [{...}]}
                          // obj_temp_tank_forExcel = {
                          //     ...obj_temp_tank_forExcel,
                          //     [ele_tank_name]: [
                          //         {
                          //           ...obj_temp_tank[ele_tank_name],
                          //           tangki: ele_tank_name
                          //         }
                          //     ]
                          //     // [tangki_name]: {...obj_temp_tank[tangki_name]}
                          // }
                      }
                    
                  })
                  
                  // FOR EXCEL ARRAY
                  // console.clear();
                  // console.error("==== OBJ TEMP TANK FOR EXCEL ====")
                  // console.log(obj_temp_tank_forExcel);

                  this.data_Export = obj_temp_tank_forExcel.map((ele,idx)=>{

                      // let suhu_1_m:any = '', suhu_3_m = '', suhu_5_m = '', suhu_7_m = '', suhu_10_m = '';
                      let avg_tinggi_suhu:any = ele?.['avg_tinggi_suhu'];
                      
                      let avg_tinggi_suhu_val:any = ele?.['avg_tinggi_suhu_val'];
                      avg_tinggi_suhu_val = avg_tinggi_suhu_val.map((ele_suhu)=>{
                        return parseFloat(ele_suhu)
                      })

                      // hanya isi titik suhu yang sesuai
                      // if (Array.isArray(avg_tinggi_suhu)){
                      //     if (avg_tinggi_suhu.length > 0){
                      //         avg_tinggi_suhu.forEach((ele_tinggi_suhu,idx_tinggi_suhu)=>{
                      //             switch(ele_tinggi_suhu){
                      //               case 1 : suhu_1_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                      //               case 3 : suhu_3_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                      //               case 5 : suhu_5_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                      //               case 7 : suhu_7_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                      //               case 10 : suhu_10_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                      //             }
                      //         })
                      //     }
                      // }

                      // semua titik suhu terisi
                      let suhu_1_m:any = 0, suhu_3_m = 0, suhu_5_m = 0, suhu_7_m = 0, suhu_10_m = 0;
                      if (Array.isArray(ele?.['data']))
                      {
                        if (typeof (ele?.['data']?.[0]) != 'undefined' && ele?.['data']?.[0] != null)
                        {
                          suhu_1_m = parseFloat(ele?.['data']?.[0]);
                        }
                        if (typeof (ele?.['data']?.[1]) != 'undefined' && ele?.['data']?.[1] != null)
                        {
                          suhu_3_m = parseFloat(ele?.['data']?.[1]);
                        }
                        if (typeof (ele?.['data']?.[2]) != 'undefined' && ele?.['data']?.[2] != null)
                        {
                          suhu_5_m = parseFloat(ele?.['data']?.[2]);
                        }
                        if (typeof (ele?.['data']?.[3]) != 'undefined' && ele?.['data']?.[3] != null)
                        {
                          suhu_7_m = parseFloat(ele?.['data']?.[3]);
                        }
                        if (typeof (ele?.['data']?.[4]) != 'undefined' && ele?.['data']?.[4] != null)
                        {
                          suhu_10_m = parseFloat(ele?.['data']?.[4]);
                        }
                      }

                      return {
                          tangki: ele?.['title'],
                          tanggal: ele?.['tanggal'],
                          jenis: ele?.['jenis'],
                          data_jarak_sensor: ele?.['data_jarak_sensor'],
                          data_jarak_sensor_m: ele?.['data_jarak_sensor_m'],
                          suhu_1_m,
                          suhu_3_m,
                          suhu_5_m,
                          suhu_7_m,
                          suhu_10_m,  
                          // tinggi: ele?.['tinggi_minyak'],
                          tinggi: ele?.['tinggi_minyak_cm'],    // PIIS
                          suhu: parseFloat(ele?.['avg']),
                          volume: ele?.['volume'] ?? 0,

                          avg_tinggi_suhu: ele?.['avg_tinggi_suhu'] ?? [],
                          avg_tinggi_suhu_val: ele?.['avg_tinggi_suhu_val'] ?? [],
                          data: ele?.['data'],
                          data_suhu_tank_num: ele?.['data_suhu_tank_num'],
                          suhu_1titik_getTinggiSuhu: ele?.['suhu_1titik_getTinggiSuhu'] ?? null,

                      }
                  })

                  // ... end === FOR EXCEL EXPORT ===
                  // console.log("FOR EXCEL EXPORT ====")
                  // console.log(obj_temp_tank_forExcel)
                  // console.log(this.data_Export)




                  // ... end <VOLUME TANGKI>

                  // taruh hasil rata-rata nya ke data_suhu_tangki_per_jam
                  // looping obj_temp_tank

                  // === BALIKKIN LAGI (JARAK SENSOR) ===
                  let obj_keys_obj_temp_tank:any = Object.keys(obj_temp_tank);
                  obj_keys_obj_temp_tank.forEach((tangki_name:any) => {

                    // START LOOPING
                      let data_temp:any = [];

                      let title_tangki:any = obj_temp_tank[tangki_name]['title'];
                      let tangki_exists:boolean = false;
                      let idx_arr_perjam_series:any = -1;

                      let jenis_rev = obj_temp_tank?.[tangki_name]?.['jenis'] ? 
                            (' (' + obj_temp_tank?.[tangki_name]?.['jenis'] + ')') : ''


                      // SUHU TANGKI PER JAM
                      let findIdx:any = this.data_suhu_tangki_perjam_series.findIndex((res:any)=>res.name == (obj_temp_tank[tangki_name]?.['title'] + jenis_rev));
                      if (findIdx != -1){
                          tangki_exists = true;
                          data_temp = [...this.data_suhu_tangki_perjam_series[findIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findIdx;
                      }

                      data_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['avg']),
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
                          }
                      );

                      // SORTING data_tinggi_temp
                      if (data_temp.length > 0) {

                        data_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })

                      }
                      // ... end sorting 

                      
                      // store data ke "data_suhu_tangki_perjam_series" untuk nanti di simpan ke setChartSuhuJam
                      if (!tangki_exists){
                        this.data_suhu_tangki_perjam_series.push(
                            {name:title_tangki + jenis_rev
                              , data:[...data_temp]}
                        )
                      }else{
                          this.data_suhu_tangki_perjam_series[idx_arr_perjam_series] = {
                              ...this.data_suhu_tangki_perjam_series[idx_arr_perjam_series],
                              data: [...data_temp]
                          }
                      }
                      // ... end <SUHU TANGKI PER JAM>


                      // TINGGI TANGKI PER JAM
                      idx_arr_perjam_series = -1
                      
                      let data_tinggi_temp:any = [];

                      let tangki_tinggi_exists:boolean = false

                      // let jenis_revisi = obj_temp_tank?.[tangki_name]?.['jenis'] ?? ''

                      let findTinggiIdx:any = this.data_tinggi_tangki_perjam_series.findIndex((res:any)=>
                                  res.name == (obj_temp_tank[tangki_name]?.['title'] + jenis_rev)
                              );
                      if (findTinggiIdx != -1){
                          tangki_tinggi_exists = true;
                          data_tinggi_temp = [...this.data_tinggi_tangki_perjam_series[findIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findTinggiIdx;
                      }

                      data_tinggi_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            // y: parseFloat(obj_temp_tank?.[tangki_name]?.['tinggi_minyak']),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['tinggi_minyak_cm']),
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
                          }
                      );
                      // SORTING data_tinggi_temp
                      if (data_tinggi_temp.length > 0) {

                        data_tinggi_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })

                      }

                      // ... end sorting 

                      // console.log("DATA TINGGI TEMP")
                      // console.log(data_tinggi_temp)

                       // store data ke "data_tinggi_tangki_perjam_series" untuk nanti di simpan ke setChartTinggiJam
                      //  alert(title_tangki + jenis_rev)
                       if (!tangki_tinggi_exists){
                            this.data_tinggi_tangki_perjam_series.push(
                                {name:title_tangki + jenis_rev, 
                                  data:[...data_tinggi_temp]}
                            )
                        }else{
                            this.data_tinggi_tangki_perjam_series[idx_arr_perjam_series] = {
                                ...this.data_tinggi_tangki_perjam_series[idx_arr_perjam_series],
                                data: [...data_tinggi_temp]
                            }
                        }
                      // ... end <TINGGI TANGKI PER JAM>

                      
                      // JARAK SENSOR TANGKI

                      idx_arr_perjam_series = -1
                      let data_jarak_sensor_temp:any = [];

                      let tangki_jarak_sensor_exists:boolean = false
                      

                      let findJarakSensorIdx:any = this.data_jaraksensor_tangki_perjam_series.findIndex((res:any)=>res.name == (obj_temp_tank[tangki_name]?.['title'] + jenis_rev));
                      if (findJarakSensorIdx != -1){
                          tangki_jarak_sensor_exists = true;
                          data_jarak_sensor_temp = [...this.data_jaraksensor_tangki_perjam_series[findJarakSensorIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findJarakSensorIdx;
                      }
                      data_jarak_sensor_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['data_jarak_sensor_m']),
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis'] ?? ''
                          }
                      );

                      // if (typeof this.tooltip_apex_data_jarak_sensor_jenis?.[tangki_name] == 'undefined'){

                      // SINI BARU UPDATE
                          // let tooltip_format_time_tank = formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss');

                          // this.tooltip_apex_data_jarak_sensor_jenis = {
                          //     ...this.tooltip_apex_data_jarak_sensor_jenis,
                          //     [tangki_name]: {
                          //         ...this.tooltip_apex_data_jarak_sensor_jenis?.[tangki_name],
                          //         [tooltip_format_time_tank]: obj_temp_tank?.[tangki_name]?.['jenis'] ?? ''
                          //     }
                          // }

                          // console.log('TOOLTIP APEX DATA JARAK SENSOR')
                          // console.log(this.tooltip_apex_data_jarak_sensor_jenis)
                      // }


                       // SORTING data_tinggi_temp
                       if (data_jarak_sensor_temp.length > 0) {

                        data_jarak_sensor_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })
                      }
                      // if (title_tangki == "Tangki 3"){
                        // if (jenis_rev == ""){
                        //   console.log("OBJ TEMP TANK TANGKI 3 JENIS REV")
                        //   console.log(obj_temp_tank?.[tangki_name])
                        //   console.info("Tangki 3 " + jenis_rev)
                        //   console.info("Tangki 3 (TANGGAL TANGKI) " + new Date(obj_temp_tank[tangki_name]['tanggal']))
                        // }
                        // else
                        // {
                          // console.log("OBJ TEMP TANK TANGKI 3 JENIS REV (OK)")
                          // console.log(obj_temp_tank?.[tangki_name])
                          // console.info("Tangki 3 " + jenis_rev)
                        // }
                      // }
                      // store data ke "data_jaraksensor_tangki_perjam_series" untuk nanti di simpan ke setChartJarakSensorJam
                        if (!tangki_tinggi_exists){
                          this.data_jaraksensor_tangki_perjam_series.push(
                              {name:title_tangki + jenis_rev
                                , data:[...data_jarak_sensor_temp]}
                          )
                      }else{
                          this.data_jaraksensor_tangki_perjam_series[idx_arr_perjam_series] = {
                              ...this.data_jaraksensor_tangki_perjam_series[idx_arr_perjam_series],
                              data: [...data_jarak_sensor_temp]
                          }
                      }

                      // ... end sorting 



                      // ...end <JARAK SENSOR TANGKI PER JAM>
                      

                      // VOLUME TANGKI PER JAM

                      idx_arr_perjam_series = -1
                      let data_volume_temp:any = [];

                      let tangki_volume_exists:boolean = false
                      let findVolumeIdx:any = this.data_volume_tangki_perjam_series.findIndex((res:any)=>res.name == (obj_temp_tank[tangki_name]?.['title'] + jenis_rev));
                      if (findVolumeIdx != -1){
                          tangki_volume_exists = true;
                          data_volume_temp = [...this.data_volume_tangki_perjam_series[findVolumeIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findVolumeIdx;
                      }

                      data_volume_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: typeof (obj_temp_tank?.[tangki_name]?.['volume']) != 'undefined' &&
                                 (obj_temp_tank?.[tangki_name]?.['volume']) != null 
                                ? 
                                  parseFloat(obj_temp_tank?.[tangki_name]?.['volume'])
                                : 0,
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
                          }
                      );

                      // SORTING data_tinggi_temp
                      if (data_volume_temp.length > 0) {

                        data_volume_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })

                      }
                      // ... end sorting 

                      // store data ke "data_volume_tangki_perjam_series" untuk nanti di simpan ke setChartVolumeJam
                      if (!tangki_volume_exists){
                          this.data_volume_tangki_perjam_series.push(
                              {name:title_tangki + jenis_rev
                                , data:[...data_volume_temp]}
                          )
                      }else{
                          this.data_volume_tangki_perjam_series[idx_arr_perjam_series] = {
                              ...this.data_volume_tangki_perjam_series[idx_arr_perjam_series],
                              data: [...data_volume_temp] 
                          }
                      }

                      // console.error("!!!! OBJ TEMP TANK DATA VOLUME TANGKI PER JAM SERIES !!!!")
                      // console.log(this.data_volume_tangki_perjam_series)

                      // ... end VOLUME TANGKI PER JAM

                  });

                  // ... end BALIKKIN


                  // ... end obj_temp_tank

                  // push categories (tanggal tz ke array "data_suhu_tangki_perjam_categories")
                  // this.data_suhu_tangki_perjam_categories.push(time_tank);
                  // this.data_tinggi_tangki_perjam_categories.push(time_tank);

                  // REVISI UNTUK IRREGULAR SERIES ({x:..., y: ....})

                  // === BALIKKIN LAGI (JARAK SENSOR) ===
                  this.data_suhu_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime());
                  this.data_tinggi_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime());
                  this.data_volume_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime());
                  ;
                  // ... end BALIKKIN

                  
                  // reverse
                  // let temp_reverse = this.data_suhu_tangki_perjam_categories.reverse();
                  // this.data_suhu_tangki_perjam_categories = [...temp_reverse];
                  

                  // this.data_suhu_tangki_per_jam[]

                  // console.log("OBJ TEMP TANGKI")
                  // console.log(obj_temp_tank)

                  // console.log("ini element ")
                  // console.log(ele)

                  // for (let mst_list_tangki of this.mst_list_tangki){
                  //     alert(mst_list_tangki)
                  // }

              });
              // ... <end> json all data

              // // === BALIKKIN LAGI (JARAK SENSOR) ===
              // console.log("DATA SUHU TANGKI PER JAM SERIES")
              // console.log(this.data_suhu_tangki_perjam_series)
              
              // console.log("DATA TINGGI TANGKI PER JAM CATEGORIES")
              // console.log(this.data_tinggi_tangki_perjam_categories)

              // console.log("DATA VOLUME TANGKI PER JAM CATEGORIES")
              // console.log(this.data_volume_tangki_perjam_categories)
              // ... END BALIKKIN

              // let min_tgl:any = null;
              // let max_tgl:any = null;

              // let min_suhu_tgl:any = null;
              // let max_suhu_tgl:any = null;

              // if (this.data_tinggi_tangki_perjam_categories.length > 0){
              //     min_tgl = Math.min.apply(null, this.data_tinggi_tangki_perjam_categories)
              //     max_tgl = Math.max.apply(null, this.data_tinggi_tangki_perjam_categories)
              // }
              // if (this.data_suhu_tangki_perjam_categories.length > 0){
              //     min_suhu_tgl = Math.min.apply(null, this.data_suhu_tangki_perjam_categories)
              //     max_suhu_tgl = Math.max.apply(null, this.data_suhu_tangki_perjam_categories)
              // }
              // if (this.data_volume_tangki_perjam_categories.length > 0){
              //     min_suhu_tgl = Math.min.apply(null, this.data_volume_tangki_perjam_categories)
              //     max_suhu_tgl = Math.max.apply(null, this.data_volume_tangki_perjam_categories)
              // }

              // === BALIKKIN LAGI (JARAK SENSOR) ===
              // SET CHART SUHU JAM

              console.error("*** ======== TES DATA SUHU TANGKI PER JAM SERIES ====== ***")
              console.error(this.data_suhu_tangki_perjam_series)

              let data_suhu_tangki_perjam_series_filter = this.data_suhu_tangki_perjam_series.filter((obj, idx)=>{
                  let nama_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
                  let findInCompList = this.arr_company_list.find(res=>res?.['tangki_name'] == nama_rev)
                  let idDevice:any = '';
                  if (findInCompList){
                      idDevice = findInCompList['id_device']
                  }
                  let findInArrDevice = this.global_arr_id_device.find(idDev=>idDev == idDevice);
                  if (findInArrDevice){
                    return true
                  }
              })

              // untuk "Sorting" tangki_id, maka mapping dulu tangki_id dari "arr_company_list"
              let data_suhu_tangki_perjam_series_filter_temp = data_suhu_tangki_perjam_series_filter.map((obj, idx)=>{
                let name_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/gi,'').trim();
                let find_tangki_id = this.arr_company_list.find((val, idx)=>{return val?.['tangki_name'].trim() == name_rev})
                let tangki_id_final:any = null;
                if (find_tangki_id){
                    tangki_id_final = find_tangki_id?.['tangki_id']
                }

                return {
                      ...obj,
                      name_rev,
                      tangki_id: tangki_id_final,
                      tangki_num: parseFloat(tangki_id_final.replace(/tangki_/gi,'').trim())
                  }
                })
                
                let data_suhu_tangki_perjam_series_filter_sort = data_suhu_tangki_perjam_series_filter_temp.sort((a,b)=>{
                    return a['tangki_num'] - b['tangki_num']
                })
              

              console.error("*** ======== (FILTER) TES DATA SUHU TANGKI PER JAM SERIES ====== ***")
              console.error(data_suhu_tangki_perjam_series_filter)

              // let data_suhu_tangki_perjam_series_map = this.data_suhu_tangki_perjam_series.map((obj, idx)=>{
              //   return {
              //       ...obj, 
              //       name_rev: obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
              //   }
              // })

              // console.log(this.state.filter_company)
              // console.log(this.global_arr_id_device)
              // console.error(data_suhu_tangki_perjam_series_map)


              this.setChartSuhuJam = {
                ...this.setChartSuhuJam,
                // statusFound: this.data_suhu_tangki_perjam_series.length > 0 ? true : false,
                statusFound: data_suhu_tangki_perjam_series_filter.length > 0 ? true : false,
                // series: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_series)),
                // series: JSON.parse(JSON.stringify(data_suhu_tangki_perjam_series_filter)),
                series: JSON.parse(JSON.stringify(data_suhu_tangki_perjam_series_filter_sort)),
                options:{
                    ...this.setChartSuhuJam.options,
                    xaxis:{
                      ...this.setChartSuhuJam.options.xaxis,
                      // min: typeof min_suhu_tgl != 'undefined' && min_suhu_tgl != null ? new Date(min_suhu_tgl).getTime() : 0,
                      // max: typeof max_suhu_tgl != 'undefined' && max_suhu_tgl != null ? new Date(max_suhu_tgl).getTime() : 0
                      // type:'datetime',
                      // categories: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartSuhuJam.options.dataLabels,
                      enabled: this.statusChecked?.['suhu'] ?? false
                    }
                }
              }

              // Filter Company yang Ter-Filter (Jarak Sensor per jam)
              let data_jaraksensor_tangki_perjam_series_filter = this.data_jaraksensor_tangki_perjam_series.filter((obj, idx)=>{
                  let nama_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
                  let findInCompList = this.arr_company_list.find(res=>res?.['tangki_name'] == nama_rev)
                  let idDevice:any = '';
                  if (findInCompList){
                      idDevice = findInCompList['id_device']
                  }
                  let findInArrDevice = this.global_arr_id_device.find(idDev=>idDev == idDevice);
                  if (findInArrDevice){
                    return true
                  }
              })

              // untuk "Sorting" tangki_id, maka mapping dulu tangki_id dari "arr_company_list"
              let data_jaraksensor_tangki_perjam_series_filter_temp = data_jaraksensor_tangki_perjam_series_filter.map((obj, idx)=>{
                let name_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/gi,'').trim();
                let find_tangki_id = this.arr_company_list.find((val, idx)=>{return val?.['tangki_name'].trim() == name_rev})
                let tangki_id_final:any = null;
                if (find_tangki_id){
                    tangki_id_final = find_tangki_id?.['tangki_id']
                }

                return {
                      ...obj,
                      name_rev,
                      tangki_id: tangki_id_final,
                      tangki_num: parseFloat(tangki_id_final.replace(/tangki_/gi,'').trim())
                  }
                })
                
                let data_jaraksensor_tangki_perjam_series_filter_sort = data_jaraksensor_tangki_perjam_series_filter_temp.sort((a,b)=>{
                    return a['tangki_num'] - b['tangki_num']
                })


              // SET CHART TINGGI JAM
              this.setChartJarakSensorJam = {
                ...this.setChartJarakSensorJam,
                // statusFound: this.data_jaraksensor_tangki_perjam_series.length > 0 ? true : false,
                statusFound: data_jaraksensor_tangki_perjam_series_filter.length > 0 ? true : false,
                // series: JSON.parse(JSON.stringify(data_jaraksensor_tangki_perjam_series_filter)),
                series: JSON.parse(JSON.stringify(data_jaraksensor_tangki_perjam_series_filter_sort)),
                options:{
                    ...this.setChartJarakSensorJam.options,
                    xaxis:{
                      ...this.setChartJarakSensorJam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartJarakSensorJam.options.dataLabels,
                      enabled: this.statusChecked?.['jarak_sensor'] ?? false
                    }
                }
              }

              // Filter Company yang Ter-Filter (Tinggi Tangki per jam)
              let data_tinggi_tangki_perjam_series_filter = this.data_tinggi_tangki_perjam_series.filter((obj, idx)=>{
                  let nama_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
                  let findInCompList = this.arr_company_list.find(res=>res?.['tangki_name'] == nama_rev)
                  let idDevice:any = '';
                  if (findInCompList){
                      idDevice = findInCompList['id_device']
                  }
                  let findInArrDevice = this.global_arr_id_device.find(idDev=>idDev == idDevice);
                  if (findInArrDevice){
                    return true
                  }
              })

              // alert(JSON.stringify(data_tinggi_tangki_perjam_series_filter))
          
              // untuk "Sorting" tangki_id, maka mapping dulu tangki_id dari "arr_company_list"
              let data_tinggi_tangki_perjam_series_filter_temp = data_tinggi_tangki_perjam_series_filter.map((obj, idx)=>{
                  let name_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/gi,'').trim();
                  let find_tangki_id = this.arr_company_list.find((val, idx)=>{return val?.['tangki_name'].trim() == name_rev})
                  let tangki_id_final:any = null;
                  if (find_tangki_id){
                      tangki_id_final = find_tangki_id?.['tangki_id']
                  }

                  return {
                      ...obj,
                      name_rev,
                      tangki_id: tangki_id_final,
                      tangki_num: parseFloat(tangki_id_final.replace(/tangki_/gi,'').trim())
                  }
              })
              
              let data_tinggi_tangki_perjam_series_filter_sort = data_tinggi_tangki_perjam_series_filter_temp.sort((a,b)=>{
                  return a['tangki_num'] - b['tangki_num']
              })

              
              // SET CHART TINGGI JAM
              this.setChartTinggiJam = {
                ...this.setChartTinggiJam,
                // statusFound: this.data_tinggi_tangki_perjam_series.length > 0 ? true : false,
                statusFound: data_tinggi_tangki_perjam_series_filter.length > 0 ? true : false,
                // series: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_series)),
                // series: JSON.parse(JSON.stringify(data_tinggi_tangki_perjam_series_filter)),
                series: JSON.parse(JSON.stringify(data_tinggi_tangki_perjam_series_filter_sort)),
                options:{
                    ...this.setChartTinggiJam.options,
                    xaxis:{
                      ...this.setChartTinggiJam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartTinggiJam.options.dataLabels,
                      enabled: this.statusChecked?.['tinggi'] ?? false
                    }
                }
              }

              // SET CHART TINGGI MODUS JAM (angka yang sering muncul)

              // DATA MODUS (DATA YANG SERING MUNCUL)
              // getAllData_Modus => ambil data value y yang paling sering muncul

              // TINGGI MODUS
              let arr_tinggi_modus_jam_series:any = this.getAllData_Modus(this.data_tinggi_tangki_perjam_series)
              // console.error("ARR TINGGI MODUS JAM FINAL")
              // console.error(arr_tinggi_modus_jam_series)
              if (arr_tinggi_modus_jam_series.length == 0){
                arr_tinggi_modus_jam_series = []
              }else{
                arr_tinggi_modus_jam_series = JSON.parse(JSON.stringify(arr_tinggi_modus_jam_series));
              }
              
              // SUHU MODUS 

              let arr_suhu_modus_jam_series:any = this.getAllData_Suhu_Modus(arr_tinggi_modus_jam_series, this.data_suhu_tangki_perjam_series)

              // let status_process_suhuModus:boolean = false;

              if (arr_suhu_modus_jam_series.length == 0){
                arr_suhu_modus_jam_series = []
                // status_process_suhuModus = true
              }else{
                arr_suhu_modus_jam_series = JSON.parse(JSON.stringify(arr_suhu_modus_jam_series));
                // status_process_suhuModus = true
              }

              // console.error('ARR SUHU MODUS JAM FINAL')
              // console.error(this.data_suhu_tangki_perjam_series)

              // Filter Company yang Ter-Filter (Tinggi Tangki per jam)
              let arr_tinggi_modus_jam_series_filter = arr_tinggi_modus_jam_series.filter((obj, idx)=>{
                  let nama_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
                  let findInCompList = this.arr_company_list.find(res=>res?.['tangki_name'] == nama_rev)
                  let idDevice:any = '';
                  if (findInCompList){
                      idDevice = findInCompList['id_device']
                  }
                  let findInArrDevice = this.global_arr_id_device.find(idDev=>idDev == idDevice);
                  if (findInArrDevice){
                    return true
                  }
              })

              // untuk "Sorting" tangki_id, maka mapping dulu tangki_id dari "arr_company_list"
              let arr_tinggi_modus_jam_series_filter_temp = arr_tinggi_modus_jam_series_filter.map((obj, idx)=>{
                let name_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/gi,'').trim();
                let find_tangki_id = this.arr_company_list.find((val, idx)=>{return val?.['tangki_name'].trim() == name_rev})
                let tangki_id_final:any = null;
                if (find_tangki_id){
                    tangki_id_final = find_tangki_id?.['tangki_id']
                }

                return {
                      ...obj,
                      name_rev,
                      tangki_id: tangki_id_final,
                      tangki_num: parseFloat(tangki_id_final.replace(/tangki_/gi,'').trim())
                  }
                })
                
                let arr_tinggi_modus_jam_series_filter_sort = arr_tinggi_modus_jam_series_filter_temp.sort((a,b)=>{
                    return a['tangki_num'] - b['tangki_num']
                })

              this.setChartTinggi_Modus_Jam = {
                ...this.setChartTinggi_Modus_Jam,
                // statusFound: arr_tinggi_modus_jam_series.length > 0 ? true : false,
                statusFound: arr_tinggi_modus_jam_series_filter.length > 0 ? true : false,
                // series: JSON.parse(JSON.stringify(arr_tinggi_modus_jam_series)),
                // series: arr_tinggi_modus_jam_series,
                // series: arr_tinggi_modus_jam_series_filter,
                series: arr_tinggi_modus_jam_series_filter_sort,
                options:{
                    ...this.setChartTinggi_Modus_Jam.options,
                    xaxis:{
                      ...this.setChartTinggi_Modus_Jam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartTinggi_Modus_Jam.options.dataLabels,
                      enabled: this.statusChecked?.['tinggi_modus'] ?? false
                    }
                }
              }

              
              // Filter Company yang Ter-Filter (Tinggi Tangki per jam)
              let arr_suhu_modus_jam_series_filter = arr_suhu_modus_jam_series.filter((obj, idx)=>{
                  let nama_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
                  let findInCompList = this.arr_company_list.find(res=>res?.['tangki_name'] == nama_rev)
                  let idDevice:any = '';
                  if (findInCompList){
                      idDevice = findInCompList['id_device']
                  }
                  let findInArrDevice = this.global_arr_id_device.find(idDev=>idDev == idDevice);
                  if (findInArrDevice){
                    return true
                  }
              })

              
              // untuk "Sorting" tangki_id, maka mapping dulu tangki_id dari "arr_company_list"
              let arr_suhu_modus_jam_series_filter_temp = arr_suhu_modus_jam_series_filter.map((obj, idx)=>{
                  let name_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/gi,'').trim();
                  let find_tangki_id = this.arr_company_list.find((val, idx)=>{return val?.['tangki_name'].trim() == name_rev})
                  let tangki_id_final:any = null;
                  if (find_tangki_id){
                      tangki_id_final = find_tangki_id?.['tangki_id']
                  }

                  return {
                      ...obj,
                      name_rev,
                      tangki_id: tangki_id_final,
                      tangki_num: parseFloat(tangki_id_final.replace(/tangki_/gi,'').trim())
                  }
              })
            
              let arr_suhu_modus_jam_series_filter_sort = arr_suhu_modus_jam_series_filter_temp.sort((a,b)=>{
                  return a['tangki_num'] - b['tangki_num']
              })

              // series: JSON.parse(JSON.stringify(arr_suhu_modus_jam_series)),
              this.setChartSuhuModusJam = {
                ...this.setChartSuhuModusJam,
                // statusFound: arr_suhu_modus_jam_series.length > 0 ? true : false,
                statusFound: arr_suhu_modus_jam_series_filter.length > 0 ? true : false,
                // series: arr_suhu_modus_jam_series,
                // series: arr_suhu_modus_jam_series_filter,
                series: arr_suhu_modus_jam_series_filter_sort,
                options:{
                    ...this.setChartSuhuModusJam.options,
                    xaxis:{
                      ...this.setChartSuhuModusJam.options.xaxis,
                      // min: typeof min_suhu_tgl != 'undefined' && min_suhu_tgl != null ? new Date(min_suhu_tgl).getTime() : 0,
                      // max: typeof max_suhu_tgl != 'undefined' && max_suhu_tgl != null ? new Date(max_suhu_tgl).getTime() : 0
                      // type:'datetime',
                      // categories: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartSuhuModusJam.options.dataLabels,
                      enabled: this.statusChecked?.['suhu_modus'] ?? false
                    }
                }
              }

              // SET CHART VOLUME JAM

              // Filter Company yang Ter-Filter (Tinggi Tangki per jam)
              let data_volume_tangki_perjam_series_filter = this.data_volume_tangki_perjam_series.filter((obj, idx)=>{
                  let nama_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/g,'').trim()
                  let findInCompList = this.arr_company_list.find(res=>res?.['tangki_name'] == nama_rev)
                  let idDevice:any = '';
                  if (findInCompList){
                      idDevice = findInCompList['id_device']
                  }
                  let findInArrDevice = this.global_arr_id_device.find(idDev=>idDev == idDevice);
                  if (findInArrDevice){
                    return true
                  }
              })

              // untuk "Sorting" tangki_id, maka mapping dulu tangki_id dari "arr_company_list"
              let data_volume_tangki_perjam_series_filter_temp = data_volume_tangki_perjam_series_filter.map((obj, idx)=>{
                  let name_rev = obj?.['name'].replace(/(\(CPO\)|\(PKO\))/gi,'').trim();
                  let find_tangki_id = this.arr_company_list.find((val, idx)=>{return val?.['tangki_name'].trim() == name_rev})
                  let tangki_id_final:any = null;
                  if (find_tangki_id){
                      tangki_id_final = find_tangki_id?.['tangki_id']
                  }

                  return {
                      ...obj,
                      name_rev,
                      tangki_id: tangki_id_final,
                      tangki_num: parseFloat(tangki_id_final.replace(/tangki_/gi,'').trim())
                  }
              })
          
              let data_volume_tangki_perjam_series_filter_sort = data_volume_tangki_perjam_series_filter_temp.sort((a,b)=>{
                  return a['tangki_num'] - b['tangki_num']
              })
              
              this.setChartVolumeJam = {
                ...this.setChartVolumeJam,
                // statusFound: this.data_volume_tangki_perjam_series.length > 0 ? true : false,
                statusFound: data_volume_tangki_perjam_series_filter.length > 0 ? true : false,
                // series: JSON.parse(JSON.stringify(this.data_volume_tangki_perjam_series)),
                // series: JSON.parse(JSON.stringify(data_volume_tangki_perjam_series_filter)),
                series: JSON.parse(JSON.stringify(data_volume_tangki_perjam_series_filter_sort)),
                options:{
                    ...this.setChartVolumeJam.options,
                    xaxis:{
                      ...this.setChartVolumeJam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartVolumeJam.options.dataLabels,
                      enabled: this.statusChecked?.['volume'] ?? false
                    }
                }
              }
              // ... END BALIKKIN

              // console.log("setChartSuhuJam")
              // console.log(this.setChartSuhuJam)

              // // === BALIKKIN LAGI (JARAK SENSOR) ===


              // SET SUHU TINGGI 
              let suhu_tinggi_tangki_name_selected:any = this.state.chartSuhuTinggiJam.suhuTinggiSelected.name;
              let arr_final_suhutinggi_tangki_selected:any = [];
              
              let found_suhu_Tinggi:boolean = false;

              if (typeof suhu_tinggi_tangki_name_selected != 'undefined' &&
                  typeof this.obj_suhu_tinggi_tangki_perjam_series?.[suhu_tinggi_tangki_name_selected] != 'undefined'){

                  arr_final_suhutinggi_tangki_selected = [...this.obj_suhu_tinggi_tangki_perjam_series[suhu_tinggi_tangki_name_selected]];
              }

              if (Object.keys(this.obj_suhu_tinggi_tangki_perjam_series).length > 0){
                  found_suhu_Tinggi = true;
              }


              // alert(JSON.stringify(arr_final_suhutinggi_tangki_selected))

              // this.setState({
              //     ...this.state,
              //     loader:{
              //         ...this.state.loader,
              //         suhu_tinggi_tangki_jam: false,
              //     },
              //     waktu:{
              //       tanggal: formatDate(new Date(time_first),'DD MMMM YYYY'),
              //       tanggal_jam: formatDate(new Date(time_first),'DD MMMM YYYY HH:mm:ss')
              //     },
              //     chartSuhuTinggiJam: {
              //       ...this.state.chartSuhuTinggiJam,
              //       statusFound: true,
              //       isDisabled: false,
              //       suhuTinggiSelected:{
              //         ...this.state.chartSuhuTinggiJam.suhuTinggiSelected
              //       },
              //       series:[
              //         ...arr_final_suhutinggi_tangki_selected
              //       ],
              //       options:{
              //           ...this.state.chartSuhuTinggiJam.options,
              //           dataLabels:{
              //               ...this.state.chartSuhuTinggiJam.options.dataLabels,
              //               enabled: this.statusChecked?.['suhu_tinggi'] ?? false
              //           }
              //       }
              //     }
              // })  

                this.setState({
                  ...this.state,
                  loader:{
                    ...this.state.loader,
                    jarak_sensor_jam: false,
                    suhu_tangki_jam: false,
                    suhu_tangki_modus_jam: false,
                    suhu_tinggi_tangki_jam: false,
                    tinggi_isi_jam: false,
                    tinggi_isi_modus_jam: false,
                    volume_tangki_jam: false
                  },
                  waktu:{
                      tanggal: formatDate(new Date(time_first),'DD MMMM YYYY'),
                      tanggal_jam: formatDate(new Date(time_first),'DD MMMM YYYY HH:mm:ss')
                  },
                  chartJarakSensorJam: {...this.setChartJarakSensorJam},
                  chartSuhuJam: {...this.setChartSuhuJam},
                  chartSuhuModusJam: {...this.setChartSuhuModusJam},
                  chartTinggiJam: {...this.setChartTinggiJam},
                  chartTinggiModusJam: {...this.setChartTinggi_Modus_Jam},
                  chartVolumeJam: {...this.setChartVolumeJam},
                  chartSuhuTinggiJam: {
                    ...this.state.chartSuhuTinggiJam,
                    statusFound: found_suhu_Tinggi,
                    isDisabled: false,
                    suhuTinggiSelected:{
                      ...this.state.chartSuhuTinggiJam.suhuTinggiSelected
                    },
                    series:[
                      ...arr_final_suhutinggi_tangki_selected
                    ],
                    options:{
                        ...this.state.chartSuhuTinggiJam.options,
                        dataLabels:{
                            ...this.state.chartSuhuTinggiJam.options.dataLabels,
                            enabled: this.statusChecked?.['suhu_tinggi'] ?? false
                        }
                    }
                  }
                })

                setTimeout(()=>{
                  console.error("FINAL SET STATE")
                  console.error(this.state)
                  console.log("obj_temp_tank_forExcel")
                  console.log(obj_temp_tank_forExcel)

                  // console.log("data_jaraksensor_tangki_perjam_series")
                  // console.log(this.data_jaraksensor_tangki_perjam_series)
                  // console.log("data_tinggi_tangki_perjam_series")
                  // console.log(this.data_tinggi_tangki_perjam_series)

                  // console.log(_.MER)

                },100)

              // ... END BALIKKIN

              // console.log(this.obj_suhu_tinggi_tangki_perjam_series)


              // console.log("INI ADALAH TIME TANK")
              // console.log(time_tank)

              // setTimeout(()=>{
                // console.log("CHART TINGGI JAM")
                // console.log(this.state.chartTinggiJam)

                // console.log("set chart suhu jam")
                // console.log(this.data_suhu_tangki_perjam_categories)
                // console.log(min_tgl)
                // console.log(max_tgl)


                // console.error("===DATA VOLUME TANGKI PER JAM SERIES===")
                // console.error(this.data_volume_tangki_perjam_series)
              // },500)

              // console.log("array json tangki ALL DATA")
              // console.log(this.arr_json_alldata)
              // console.log(this.arr_json_tangki_last);
          }
        }
      })
    }

    getAllData_Suhu_Modus(arr_tinggi:any, arr_suhu_param:any){
        // ambil suhu data berdasarkan tinggi cpo / pko
        let arr_temp:any = [];
        console.error("GET ALL TINGGI MODUS")
        console.error(arr_tinggi)
        console.error("GET ALL SUHU MODUS")
        console.error(arr_suhu_param)

        let arr_suhu_param_filter:any = [];

        if (Array.isArray(arr_suhu_param)){

            arr_suhu_param.forEach((elefor,idxfor)=>{
                let nama_tangki_suhu:any = elefor?.['name']
                let data_tangki_suhu:any = elefor?.['data']
                
                let filter_tangki_tinggi:any = arr_tinggi.filter(elefil=>elefil?.['name'] == nama_tangki_suhu);

                // COCOKKIN HASIL FILTER TINGGI DENGAN SUHU DARI SISI TANGGAL (x_time)
                

                data_tangki_suhu.forEach((elesuhu, idxsuhu)=>{

                  let find_xtime_tinggi:any = filter_tangki_tinggi[0]['data'].find(eletinggifind=>eletinggifind?.['x_time'] == elesuhu?.['x_time'])
                  if (find_xtime_tinggi){
                      // console.error("FILTER TANGKI TINGGI")
                      // console.error(find_xtime_tinggi)

                      // cari jika ada nama tangki yang sama, maka tinggal push ke data
                      let findIdxTangki_inSuhu = arr_temp.findIndex(elesuhu => elesuhu?.['name'] == nama_tangki_suhu)
                      if (findIdxTangki_inSuhu == -1){
                          // jika tidak ada, create nama tangki baru
                          arr_temp = [
                            ...arr_temp,
                            {
                              name: nama_tangki_suhu,
                              data: [{...elesuhu}]
                            }
                          ]
                      }
                      else
                      {
                          arr_temp[findIdxTangki_inSuhu]['data'] = [
                              ...arr_temp[findIdxTangki_inSuhu]['data'],
                              {...elesuhu}
                          ]
                      }
                  }
                })

                console.error("INJECT KE ARR_TEMP SUHU")
                console.error(arr_temp)
                // console.error(filter_tangki_tinggi)
            })

        }

        console.error("GET ALL SUHU MODUS (FILTER)")
        console.error(arr_temp)

        return arr_temp;
        
    }

    getAllData_Modus(arr_param:any){
        console.error("=== MODUS MODUS MODUS DATA ===")
        console.log(arr_param)

        let arr_temp:any = [];

        // === SAMPLE DATA ===
        // [{name : 'Tangki 1', 
        //  data :
        //    [ 
        //      {jenis: "PKO", x: "2023-02-23 06:00:13", x_time: 1677106813000, y: 3.861},
        //      {jenis: "PKO", x: "2023-02-23 06:01:18", x_time: 1677106878000, y: 3.844}
        //    ]
        // },
        // {name : 'Tangki 2', 
        //  data :
        //    [ 
        //      {jenis: "PKO", x: "2023-02-23 06:00:13", x_time: 1677106813000, y: 3.861},
        //      {jenis: "PKO", x: "2023-02-23 06:01:18", x_time: 1677106878000, y: 3.844}
        //    ]
        // }]
        
        if (Array.isArray(arr_param)){

            if (arr_param.length > 0){

              arr_param.forEach((ele,idx)=>{

                  // nama tangki 
                  let ele_name:any = ele?.['name'];
                  // data array tangki
                  let ele_data:any = ele?.['data'];

                  if (typeof ele_name != 'undefined' && ele_name != null){

                      if (Array.isArray(ele_data)){
                          if (ele_data.length > 0){

                              // ambil semua angka y di simpan single ke array
                              let arr_val_y:any = ele_data.map((ele_val, idx_val) => {
                                  return parseFloat(ele_val?.['y'])
                              })

                              // hanya sebagai referensi master
                              let arr_val_y_countBy = _.countBy(arr_val_y);

                              // hanya menghasilkan satu record array yang paling maksimal
                              let getFrequentItem:any = _(arr_val_y)
                                                  .countBy()
                                                  .entries()
                                                  .maxBy(_.last)
                                                  ;
                              
                              if (getFrequentItem.length >= 1){
                                  // bila ada occurance (kemunculan) yang sama, maka ambil angka paling maksimal
                                  let arr_val_y_countBy_entries = Object.entries(arr_val_y_countBy);

                                  // filter yang memiliki kemunculan angka yang sama (misal, [[12.34, 2], [9.56, 2]]) => [2] == [2]
                                  let filter_val_y_countBy_entries = arr_val_y_countBy_entries.filter(elefil => elefil[1] == getFrequentItem[1]);

                                  let arr_getMax_Values = filter_val_y_countBy_entries.map((ele_max,idx_max)=>{
                                      return parseFloat(ele_max[0])
                                  })

                                  // ambil angka yang paling maksimal (misal : 12.34)
                                  let getMax_Value:any = Math.max.apply(null, arr_getMax_Values)

                                  // ambil data lengkap object key lainnya berdasarkan angka maksimal
                                  // hanya ada satu angka saja yang akan di ambil
                                  let filter_getMax_Value = ele_data.filter((elemax) => parseFloat(elemax?.['y']) == parseFloat(getMax_Value));

                                  // console.error("arr_val_y")
                                  // console.error(arr_val_y)
                                  // console.error("arr_val_y_countBy")
                                  // console.error(arr_val_y_countBy)
                                  // console.error("getFrequentItem")
                                  // console.error(getFrequentItem)
                                  // console.error("filter_val_y_countBy_entries")
                                  // console.error(filter_val_y_countBy_entries)
                                  
                                  // console.error("arr_getMax_Values")
                                  // console.error(arr_getMax_Values)
                                  // console.error("getMax_Value")
                                  // console.error(getMax_Value)

                                  // console.error("filter_getMax_Value")
                                  // console.error(filter_getMax_Value)

                                  arr_temp.push(
                                    {
                                      name: ele_name,
                                      data: JSON.parse(JSON.stringify(filter_getMax_Value))
                                    }
                                  )
                                  // masukkan data tangki dalam bentuk object
                                  // if (typeof arr_temp?.[ele_name] == 'undefined' || 
                                  //      arr_temp?.[ele_name] == null)
                                  // {
                                      // arr_temp[ele_name] = JSON.parse(JSON.stringify(filter_getMax_Value));
                                  // }

                              }


                          }
                      }
                  }
              })

              // console.error("ARR TEMP FINAL")
              // console.error(arr_temp)

              return arr_temp

            }
        }

    }

    kalkulasi_tinggi_tangki(callback:any){
        let obj_keys:any = Object.keys(this.arr_json_tangki_last);

        let arr_tangki_name:any = [];
        let arr_tangki_tinggi:any = [];

        let arr_tangki_temp:any = [];

        if (obj_keys.length > 0){

          let temp_updatedState_tinggi:any = {};

            // inject dulu data dari this.state 
            temp_updatedState_tinggi['realtime'] = {

                ...this.state['realtime']
            }

            obj_keys.forEach((tangki_name:any) => {

                let obj_keys_tangki:any = Object.keys(this.arr_json_tangki_last?.[tangki_name]);
                let findJarakSensor = obj_keys_tangki.find((res:any)=>res.toLowerCase().indexOf("jarak sensor") != -1);
                if (findJarakSensor){

                    let time_json_tangki_last:any = this.arr_json_tangki_last[tangki_name]?.['time'];

                    let mst_t_lubang_ukur_temp = this.mst_t_lubang_ukur?.[tangki_name];

                    let mst_t_tangki_temp:any = this.mst_t_tangki?.[tangki_name];
                    let mst_avg_t_segitiga_temp:any = this.mst_avg_t_segitiga?.[tangki_name];

                    // JARAK SENSOR
                    let tangki_jarak_sensor:any =  this.arr_json_tangki_last?.[tangki_name]?.[findJarakSensor];

                    // if (nama_tangki == 'tangki_2'){
                    // INI BARU UPDATE (NANTI AKAN DIHAPUS)
                      // console.log("INI BARU TANGKI 2, " + time_tank + " -> " + tangki_jarak_sensor)
                      // console.log("INI BARU TANGKI 2")
                      // console.log(tangki_jarak_sensor)
                    // }
                    
                    
                    if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                        if (typeof tangki_jarak_sensor == 'string'){
                          // tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                          tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100);
                        }else{
                          // tangki_jarak_sensor = (tangki_jarak_sensor / 100).toFixed(2);
                          tangki_jarak_sensor = (tangki_jarak_sensor / 100);
                        }
                    }else{tangki_jarak_sensor = 0}

                    // === CARI TINGGI MINYAK PAKAI TINGGI DELTA ===
                    // // let ruang_kosong_tangki:any = (tangki_jarak_sensor - mst_avg_t_segitiga_temp).toFixed(2);
                    // let ruang_kosong_tangki:any = (tangki_jarak_sensor - mst_avg_t_segitiga_temp);
                    // // let tinggi_minyak:any = (mst_t_tangki_temp - ruang_kosong_tangki).toFixed(2);

                    // // let tinggi_minyak:any = (mst_t_tangki_temp - ruang_kosong_tangki).toFixed(3);

                    // // REVISI TINGGI MINYAK PEMBULATAN tiga decimal (TGL 22 FEB '23)
                    // let tinggi_minyak:any = Math.round((mst_t_tangki_temp - ruang_kosong_tangki) * 1000) / 1000;
                    // end <TINGGI DELTA>

                    // === CARI TINGGI MINYAK PAKAI TINGGI PROFILE ===
                    let tinggi_minyak:any = 0;
                    if (typeof this.mst_t_profile?.[tangki_name] != 'undefined' &&
                          this.mst_t_profile?.[tangki_name] != null)
                    {
                        tinggi_minyak = Math.round((this.mst_t_profile?.[tangki_name] - tangki_jarak_sensor) * 1000) / 1000;
                    }
                    // ... end <TINGGI PROFILE>

                    // JIKA HASIL NYA MINUS, maka di nol kan saja 
                    // REVISI (TGL 22 FEB '23)
                    if (tinggi_minyak < 0){
                      tinggi_minyak = 0;
                    }

                    this.arr_json_tangki_last[tangki_name]['jarak_sensor'] = tinggi_minyak;

                    // taruh di temp dahulu, baru di store ke setState (karena setState tidak bisa update di looping multi data)
                    temp_updatedState_tinggi['realtime'] = {

                        ...temp_updatedState_tinggi['realtime'],
                        [tangki_name]: {
                            ...this.state.realtime[tangki_name],
                            tinggi: parseFloat(tinggi_minyak),
                        }
                    }
                    // console.log("KONDISI REAL TIME")
                    // console.log("Jarak Sensor : " + tangki_jarak_sensor)
                    // console.log("Avg Delta Temp : " + mst_avg_t_segitiga_temp)

                    // console.log("Mst Tinggi Tangki Temp : " + mst_t_tangki_temp)
                    // console.log("Ruang kosong Tangki : " + ruang_kosong_tangki)
                    // console.log(temp_updatedState_tinggi)
                    
                    // cari title tangki (Tangki 1, Tangki 2, dst...)
                    let find_tangki_title:any = this.mst_list_tangki.find(res_tank=>res_tank.name == tangki_name);
                    if (find_tangki_title){
                      let tanggal:any = formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']),'DD MMMM YYYY');
                      let jam:any = formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']),'HH:mm');

                      // TITLE TINGGI ISI TANGKI (m)
                      arr_tangki_name.push(
                          // [find_tangki_title['title'], tanggal, jam]
                          find_tangki_title['title']
                      );

                    }
                    arr_tangki_tinggi.push(parseFloat(tinggi_minyak));

                    // ... <end>
                  
                }

            })

            arr_tangki_name.forEach((ele, idx)=>{
                let patt = new RegExp(/([0-9]+)/,'gi');
                let match:any = patt.exec(ele[0]);
                let angka_temp:any = 0;
                if (match){
                  angka_temp = match[0];
                }

                arr_tangki_temp.push(
                  {x: ele, y: arr_tangki_tinggi[idx], 
                    tangki_num: parseFloat(angka_temp)}
                ) 
                
            })

            // sort
            if (arr_tangki_temp){
              arr_tangki_temp.sort((a,b)=>{
                return a['tangki_num'] - b['tangki_num']
              })
            }
            // ... end sort

              // alert(JSON.stringify(arr_tangki_temp))

              this.setState({
                ...this.state,
                loader:{
                    ...this.state.loader,
                    tinggi_isi:false
                },
                chartTinggi:{
                    ...this.state.chartTinggi,
                    options:{
                        ...this.state.chartTinggi.options,
                        xaxis:{
                          ...this.state.chartTinggi.options.xaxis,
                          // categories: [...arr_tangki_name]    // ["Tangki 1","Tangki 2","Tangki 3","Tangki 4"]
                        }
                    },
                    series: [
                      {
                        // data:[...arr_tangki_tinggi],  // [4.55, 8.81, ...]
                        data:[...arr_tangki_temp], 
                        name: "Tinggi Isi Tangki"}
                    ]
                },
                ...temp_updatedState_tinggi
                // realtime:{
                //     ...this.state.realtime,
                //     [tangki_name]:{
                //       ...this.state.realtime[tangki_name],
                //       tinggi: parseFloat(selisih_t_lubang_vs_jrk_sensor)
                //     }
                //   }
              })

              setTimeout(()=>{
                console.log("ini adalah state (KALKULASI TINGGI TANGKI)")
                console.log(this.state)
                callback()
              })

      }
    }
          
    kalkulasi_volume_tangki(callback:any){
        // console.log("TINGGI MINYAK REAL TIME")
        let realtime:any = this.state?.['realtime'];
        console.log("VOLUME TANGKI")
        console.log(realtime)

        // LOOPING TANGKI NAME (realtime)
        let temp_update_volume:any = {};
        
        temp_update_volume['realtime'] = {

            ...this.state['realtime']
        }

        Object.keys(realtime).forEach((tangki_name:any)=>{

            // let tinggi:any = realtime?.[tangki_name]?.['tinggi'] ?? null;
            let tinggi:any = realtime?.[tangki_name]?.['tinggi'] != null 
                  ? parseFloat(realtime?.[tangki_name]?.['tinggi']).toFixed(3)
                  : null

            // REVISI VOLUME BEDA LITER
            let tinggi_tmp_floor:any = Math.floor(parseFloat(tinggi) * 100); // angka floor ( 1010 )
            let tinggi_tmp_all:any = parseFloat((parseFloat(tinggi) * 100).toFixed(3));   // angka plus decimal ( 1010,7 )
            let tinggi_tmp_dec:any = (Math.round((tinggi_tmp_all - tinggi_tmp_floor) * 1000)) / 1000;   // (1010,7777 - 1010 = 0,778)
            // ... end <REVISI VOLUME BEDA LITER>

            if (tinggi != null && tinggi != "-" && tinggi != ""){
                // panggil array json tabel volume tangki yang sesuai
                let arr_volume:any = this.json_arr_volume_tangki(tangki_name);
                

                let findItem:any = arr_volume.find(res=>
                      // parseInt(res.tinggi) == Math.round(tinggi.toFixed(2) * 100)
                      // parseInt(res.tinggi) == Math.round(parseFloat(parseFloat(tinggi).toFixed(2))*100)
                      // parseInt(res.tinggi) == Math.round(parseFloat(tinggi)*100)
                      parseInt(res.tinggi) == tinggi_tmp_floor
                )

                // this.arr_cpo_pko
                console.log("REAL TIME STATE : ===")
                console.log(this.state.realtime)
                
                let tanggal_tangki:any = new Date(this.arr_json_tangki_last[tangki_name]['time']);

                let jenis:any = '';

                let findCpoPko = this.arr_cpo_pko.find(res=>
                          res.name == tangki_name &&
                          (
                            (new Date(res.datebegin) <= tanggal_tangki
                                && (res.datelast != '' && res.datelast != null && new Date(res.datelast) >= tanggal_tangki)
                            )
                            ||
                            (
                              (new Date(res.datebegin) <= tanggal_tangki)
                                && (res.datelast == '' || res.datelast == null)
                            )
                          ) 
                          // && 
                          // (res.datelast == null || res.datelast == '' || new Date(res.datelast) >= tanggal_tangki)
                )
                if (findCpoPko){
                    jenis = findCpoPko?.['jenis'];
                    console.log("kalkulasi_volume_tangki findCpoPko");
                    console.log(findCpoPko)
                }

                // let arr_beratjenis:any = this.json_arr_berat_jenis_tangki()


                if (findItem){
                  
                  let volume_tbl:any = 0;
                  let beda_liter_mst:any = 0;
                  let beda_liter_hitung:any = 0;

                  let berat_jenis:any;

                  // VOLUME LITER ATAU KG tangki
                  volume_tbl = parseFloat(findItem.volume);
                  beda_liter_mst = parseFloat(findItem.beda_liter);

                  // * 1000 / 1000 => tujuan nya decimal 5 bisa dibulatkan
                  beda_liter_hitung = Math.round((beda_liter_mst * tinggi_tmp_dec) * 1000) / 1000; // cth : (dari 1010,7) 0.7 * 4613 => 3229,1 
                  // dikali dengan berat jenis nya apakah cpo atau pko

                  let faktor_koreksi_temp:any;
                  let volume_prev:any = volume_tbl;

                  // REVISI VOLUME BEDA LITER

                  let volume_tbl_plus_beda_liter:any;
                  if (typeof findItem?.['volume'] != 'undefined' &&
                        findItem?.['volume'] != null)
                  {
                      volume_tbl_plus_beda_liter = volume_tbl + beda_liter_hitung;
                  }

                  volume_tbl = volume_tbl_plus_beda_liter;

                  // end <REVISI VOLUME BEDA LITER>

                  if (jenis != '' && jenis != null){
                      let arr_berat_jenis:any = this.json_arr_berat_jenis_tangki(jenis, tangki_name);

                      let suhu_last:any = this.state.realtime?.[tangki_name]?.['suhu'];

                      let find_berat_jenis:any = arr_berat_jenis.find(res=>
                            // Math.round(parseFloat(res.temperature)) == Math.round(parseFloat(suhu_last))
                            Math.round(parseFloat(res.temperature)) == Math.floor(suhu_last)
                        );


                      if (find_berat_jenis){
                        volume_tbl = volume_tbl * find_berat_jenis?.['berat_jenis'];

                        berat_jenis = find_berat_jenis?.['berat_jenis'];
                        // volume_prev = volume_tbl;   // just info volume sebelumnya
                      }

                      // SINI SINI
                      // console.error("CEK SINI GET REAL TIME")
                      // console.error(findItem)
                      // console.error("CEK SINI GET REAL TIME BERAT JENIS")
                      // console.error(find_berat_jenis)
                      // console.error("CEK SINI GET VOLUME TBL x BERAT JENIS")
                      // console.error(volume_tbl)

                      // faktor koreksi

                      // faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.round(parseFloat(suhu_last)));
                      faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.floor(parseFloat(suhu_last)));
                      if (faktor_koreksi_temp != null){
                          // volume_tbl *= faktor_koreksi_temp.toFixed(2);
                          volume_tbl *= faktor_koreksi_temp;
                      }
                      
                      // alert(JSON.stringify(arr_berat_jenis))
                      // volume_tbl => volume dari tabel
                      
                  }
                  // ... end (dikali dengan berat jenis nya apakah cpo atau pko)

                  
                  temp_update_volume['realtime'] = {
                      ...temp_update_volume['realtime'],
                      [tangki_name]: {
                        ...this.state.realtime?.[tangki_name],
                        volume_prev,
                        volume_tbl_plus_beda_liter,
                        berat_jenis,
                        faktor_koreksi: faktor_koreksi_temp,
                        tinggi_tmp_floor,
                        tinggi_tmp_all,
                        tinggi_tmp_dec,
                        beda_liter_mst,
                        beda_liter_hitung,
                        volume: volume_tbl.toFixed(2),
                        jenis
                      }
                  }

                }
            }
        })

        // end LOOPING TANGKI NAME (realtime)

        // UPDATE DI STATE


        setTimeout(()=>{

          this.setState({
            ...this.state,
            ...temp_update_volume
          })

          setTimeout(()=>{
            console.log("REALTIME STATE (VOLUME)")
            console.log(this.state.realtime)
            callback()
          },100)
        })
      }


    faktor_koreksi(volume:any, suhu:any){
        if (volume == null || suhu == null ||
            typeof volume == 'undefined' ||
            typeof suhu == 'undefined'){
            return null
        }


        if (typeof volume == 'number' && 
            typeof suhu == 'number'){

            let lambda:any = 0.0000348;
            let hitung_koreksi:any;
            hitung_koreksi = 1 + (lambda * (suhu - 36));

            return hitung_koreksi;
        }

        return null
    }


    fungsi(){
      // this.setState({
      //   ...this.state,
      //   realtime:{
      //       ...this.state.realtime,
      //       'tangki_1':{
      //           ...this.state.realtime.tangki_1,
      //           volume:123456
      //       },
      //       'tes':'wefw'
      //   }
      // })

      console.log("STATE")
      console.log(this.state)
    }

    json_arr_berat_jenis_tangki(jenis:any, tangki?:any)
    {
        let arr_temp:any = [];
      
        switch (tangki.toLowerCase()){
            case 'tangki_5': case 'tangki_6': case 'tangki_7':
                switch (jenis.toLowerCase()){
                  case 'cpo':
                      arr_temp = JSON.parse(JSON.stringify(berat_jenis_cpo_task1_json));
                      break;
                  case 'pko':
                      arr_temp = JSON.parse(JSON.stringify(berat_jenis_pko_task1_json));
                      break;
                }
                break;
            default:
                switch (jenis.toLowerCase()){
                  case 'cpo':
                      arr_temp = JSON.parse(JSON.stringify(berat_jenis_cpo_json));
                      break;
                  case 'pko':
                      arr_temp = JSON.parse(JSON.stringify(berat_jenis_pko_json));
                      break;
                }

        }

        // switch (jenis.toLowerCase()){
        //   case 'cpo':
        //       arr_temp = JSON.parse(JSON.stringify(berat_jenis_cpo_json));
        //       break;
        //   case 'pko':
        //       arr_temp = JSON.parse(JSON.stringify(berat_jenis_pko_json));
        //       break;
        // }

        return arr_temp;
    }

    json_arr_volume_tangki(tangki_name:any){
        let arr_temp:any = [];

        switch (tangki_name){
          case 'tangki_1':
              arr_temp = JSON.parse(JSON.stringify(tangki_1_json));
              break;
          case 'tangki_2':
              arr_temp = JSON.parse(JSON.stringify(tangki_2_json));
              break;
          case 'tangki_3':
              arr_temp = JSON.parse(JSON.stringify(tangki_3_json));
              break;
          case 'tangki_4':
              arr_temp = JSON.parse(JSON.stringify(tangki_4_json));
              break;
          case 'tangki_5':
              arr_temp = JSON.parse(JSON.stringify(tangki_5_json));
              break;
          case 'tangki_6':
              arr_temp = JSON.parse(JSON.stringify(tangki_6_json));
              break;
          case 'tangki_7':
              arr_temp = JSON.parse(JSON.stringify(tangki_7_json));
              break;
          case 'tangki_8':
              arr_temp = JSON.parse(JSON.stringify(tangki_8_json));
              break;
          case 'tangki_9':
              arr_temp = JSON.parse(JSON.stringify(tangki_9_json));
              break;
          case 'tangki_10':
              arr_temp = JSON.parse(JSON.stringify(tangki_10_json));
              break;
          case 'tangki_11':
              arr_temp = JSON.parse(JSON.stringify(tangki_11_json));
              break;
          case 'tangki_12':
              arr_temp = JSON.parse(JSON.stringify(tangki_12_json));
              break;
          case 'tangki_13':
              arr_temp = JSON.parse(JSON.stringify(tangki_13_json));
              break;
          case 'tangki_14':
              arr_temp = JSON.parse(JSON.stringify(tangki_14_json));
              break;
          case 'tangki_15':
              arr_temp = JSON.parse(JSON.stringify(tangki_15_json));
              break;

        }

        return arr_temp;
    } 

    kalkulasi_suhu_tangki(callback:any){

        let obj_keys:any = Object.keys(this.arr_json_tangki_last);

        let temp_arr:any = [];

        if (obj_keys.length > 0){

          let temp_updatedState_suhu:any = {};

          temp_updatedState_suhu['realtime'] = {

              ...this.state['realtime']
          }

            // loop
            obj_keys.forEach((tangki_name:any) => {
                
                let obj_keys_tangki:any = Object.keys(this.arr_json_tangki_last?.[tangki_name]);

                temp_arr = [];
                let temp_arr_suhu_num_exec_final:any = [];
                let temp_arr_suhu_num_all_raw:any = []; // semua data [13,15,17,19,21]

                let arr_tinggi_suhu_tmp:any = [];
                let arr_tinggi_suhu_val_tmp:any = [];

                // cari ada kata "Temperature Tank"
                obj_keys_tangki.forEach((temperat:any)=>{
                    if (temperat.toLowerCase().indexOf("temperature tank") != -1){

                        // SUHU BERDASARKAN TINGGI
                        // let patt_tank_tinggi_num = new RegExp(/(tinggi [0-9]+.?M)/,'gi')
                        let patt_tank_tinggi_num = new RegExp(/(tinggi [0-9]+(\.?[0-9]+)?.?M)/,'gi')
                        let patt_tank_tinggi_num_exec = patt_tank_tinggi_num.exec(temperat);

                        let patt_tank_tinggi_num_exec_final = patt_tank_tinggi_num_exec != null 
                                          ? parseFloat(patt_tank_tinggi_num_exec[0].replace(/(tinggi|M)/gi,'').trim())
                                          : null
                        
                        temp_arr_suhu_num_exec_final.push(patt_tank_tinggi_num_exec_final);

                        temp_arr_suhu_num_all_raw.push(this.arr_json_tangki_last?.[tangki_name]?.[temperat]);

                        // ... END
                        
                        // temp_arr.push(parseFloat(this.arr_json_tangki_last[tangki_name][temperat]));

                    }
                })
                
                if (temp_arr_suhu_num_all_raw.length > 0){

                    let obj_tmp_tank_tinggi_minyak:any = Math.floor(parseFloat(temp_updatedState_suhu['realtime']?.[tangki_name]?.['tinggi']));

                    // console.error(temp_updatedState_suhu)
                    // console.error(this.arr_json_tangki_last[tangki_name])

                    // BERDASARKAN KETINGGIAN SUHU
                    if (obj_tmp_tank_tinggi_minyak >= 1){

                        if (temp_arr_suhu_num_exec_final.length > 0){
                            temp_arr_suhu_num_exec_final.forEach((ele_suhu_num,idx)=>{

                                // REVISI KETINGGIAN SUHU yang KE CELUP 20 feb '23

                                if (obj_tmp_tank_tinggi_minyak < 4)
                                {
                                    // jika tinggi di bawah 4 m, maka ambil ketinggian suhu [1]
                                    if (temp_arr_suhu_num_exec_final[idx] == 1){
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 4 && obj_tmp_tank_tinggi_minyak < 6){
                                    // jika tinggi di bawah 4 m s/d 5.99, maka ambil ketinggian suhu [1,3]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 3){    // ambil [1,3]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 6 && obj_tmp_tank_tinggi_minyak < 8){
                                    // jika tinggi di bawah 6 m s/d 7.99, maka ambil ketinggian suhu [1,3,5]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 5){    // ambil [1,3,5]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 8 && obj_tmp_tank_tinggi_minyak < 10){
                                    // jika tinggi di bawah 8 m s/d 9.99, maka ambil ketinggian suhu [1,3,5,7]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 7){    // ambil [1,3,5,7]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 10){
                                    // jika tinggi di bawah 10 m, maka ambil ketinggian suhu [1,3,5,7,10]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 10){    // ambil [1,3,5,7,10]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                // ... <end REVISI KETINGGIAN>
                                  
                                // if (obj_tmp_tank_tinggi_minyak >= temp_arr_suhu_num_exec_final[idx])
                                // {
                                //     arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                //     arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                // }
                            })  
                        }
                    }
                    else{
                        // JIKA MINUS, MAKA INJECT KETINGGIAN 1 M
                        if (obj_tmp_tank_tinggi_minyak < 1){

                          let arr_obj_tmp_tank_data:any = temp_arr_suhu_num_exec_final;
                          let findIdx = arr_obj_tmp_tank_data.findIndex(ele=>ele == 1);
                          if (findIdx != -1){
                              arr_tinggi_suhu_tmp.push(1);
                              arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[findIdx]);
                          }
                          // arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[1]);
                        }
                    }

                    // totalkan semua 
                    // let total_temp_arr = temp_arr.reduce((acc:any, val:any)=>{
                    //     return acc + val
                    // },0)

                    // total SUHU BERDASARKAN TINGGI
                    let total_temp_arr = arr_tinggi_suhu_val_tmp.reduce((tmp:any, val:any)=>{
                        return tmp + parseFloat(val)
                    },0)
                    
                    // di rata-ratakan
                    // let avg_temp_arr = (total_temp_arr / temp_arr.length).toFixed(3);
                    let avg_temp_arr = (total_temp_arr / arr_tinggi_suhu_val_tmp.length).toFixed(3);

                    temp_updatedState_suhu['realtime'] = {
                        ...temp_updatedState_suhu['realtime'],
                        [tangki_name]: {
                          ...this.state['realtime'][tangki_name],
                          suhu: avg_temp_arr,
                          suhu_tank_num: temp_arr_suhu_num_exec_final,
                          suhu_tank_num_raw: temp_arr_suhu_num_all_raw,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp]
                      }
                    }
                }
                
            })
            // ... <end loop>


              this.setState({
                ...this.state,
                loader:{
                  ...this.state.loader,
                  suhu_tangki:false,
                  suhu_tangki_modus_jam: false,
                },
                ...temp_updatedState_suhu
              })

              setTimeout(()=>{
                // console.log(temp_updatedState_suhu)
                console.log("(temp_updatedState_suhu) suhu tangki")
                console.log(temp_updatedState_suhu)
                console.log("(state) suhu tangki")
                console.log(this.state)
                callback()
              })
        }
    }

    kalkulasi_set_others_tangki(callback:any){
      let obj_keys:any = Object.keys(this.arr_json_tangki_last);

      let temp_arr:any = [];

      if (obj_keys.length > 0){

        let temp_updatedState_tanggal:any = {};

        temp_updatedState_tanggal['realtime'] = {

            ...this.state['realtime']
        }

          // loop
          obj_keys.forEach((tangki_name:any) => {
              
                // let obj_keys_tangki:any = Object.keys(this.arr_json_tangki_last?.[tangki_name]);

                temp_updatedState_tanggal['realtime'] = {

                    ...temp_updatedState_tanggal['realtime'],
                    [tangki_name]: {

                        ...this.state['realtime'][tangki_name],
                        tanggal: formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']), 'DD MMMM YYYY'),
                        tanggal_jam: formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']), 'DD MMMM YYYY HH:mm:ss')
                  }
                }
              
          })
          // ... <end loop>


            this.setState({
              ...this.state,
              ...temp_updatedState_tanggal
            })

            setTimeout(()=>{
              // console.log(temp_updatedState_suhu)
              console.log("temp_updatedState_tanggal")
              console.log(temp_updatedState_tanggal)
              callback();
            })
      }
  }


  onChangeSelectSuhuTinggiFilter(e:any, action:any){

    if (action != 'clear'){

      let getFirstTangkiList:any = this.mst_list_tangki.length > 0 ? 
            {...this.mst_list_tangki.filter(res=>res.value == e.value)[0]} 
            : {}

      this.getFirstTangki_Default = {...getFirstTangkiList}
      
      let arr_final_suhutinggi_tangki_selected:any = [];
      let obj_selected:any = this.obj_suhu_tinggi_tangki_perjam_series?.[this.getFirstTangki_Default.name];
      if (typeof obj_selected == 'undefined' || obj_selected == null)
      {
          notify('error', e.value + ' tidak ada !')
          return
      }


      arr_final_suhutinggi_tangki_selected = [...this.obj_suhu_tinggi_tangki_perjam_series[this.getFirstTangki_Default.name]];

      this.setState({
        ...this.state,
        chartSuhuTinggiJam: {
              ...this.state.chartSuhuTinggiJam,
              series:[
                  ...arr_final_suhutinggi_tangki_selected
              ],
              suhuTinggiSelected: {...getFirstTangkiList}
        }
      })

    }
    else
    {
        this.setState({
          ...this.state,
          chartSuhuTinggiJam: {
                ...this.state.chartSuhuTinggiJam,
                series:[],
                suhuTinggiSelected: {}
          }
        })
    }
  }

  onChangeSelectMulti(e:any, action:any){
    let arr_selected = e
  }

  onChangeSelectMultiComponent_CreateUser(e:any){
      // react-multi-select di menu create user
      let arr_selected:any = e;
      if (e.length == 0){
          this.updatePlaceholderDropdown(false, 'create-user')
      }
      this.setState({
        ...this.state,
        filter_company_create_user: [...arr_selected]
      })

      // object untuk simpan 'newUser, company, newPass, confirmNewPass'
      this.obj_createUser = {
          ...this.obj_createUser,
          'company': arr_selected
      }

      console.log("Company Select in Create User");
      console.log(this.obj_createUser);

      if (this.options_filter_company_createuser.length > 0){
        if (this.options_filter_company_createuser.length == arr_selected.length)
        {
          this.updatePlaceholderDropdown(true, 'create-user')
        }
      }

  }

  onChangeSelectMultiComponent_UpdateUserCompany(e:any){
      // react-multi-select di menu create user
      let arr_selected:any = e;
      if (e.length == 0){
          this.updatePlaceholderDropdown(false, 'update-user-company')
      }

      this.setState({
        ...this.state,
        filter_company_update_user_company: [...arr_selected]
      })

      // object untuk simpan 'newUser, company, newPass, confirmNewPass'
      this.obj_updateUserCompany = {
          ...this.obj_updateUserCompany,
          'company': arr_selected
      }

      console.log("Company Select in Update User Company");
      console.log(this.obj_updateUserCompany);

      if (this.options_filter_company_updateusercompany.length > 0){
        if (this.options_filter_company_updateusercompany.length == arr_selected.length)
        {
          this.updatePlaceholderDropdown(true, 'update-user-company')
        }
      }

  }

  onChangeSelectMultiComponent(e:any){
    let arr_selected:any = e
    if (e.length == 0){
        this.updatePlaceholderDropdown(false, 'cardtop')
    }
    this.setState({
        ...this.state,
        filter_company: [...arr_selected]
    })

    // jika jumlah options_filter_company (master company) sama dengan company yang di select,
    // maka kata placeholder diganti yg items ke companies

    if (this.options_filter_company.length > 0)
    {
        if (this.options_filter_company.length == arr_selected.length)
        {
            this.updatePlaceholderDropdown(true, 'cardtop')
        }
    }

  }

  getStatusActiveUser = async(user) => {
      let arr_tmp:any = {};

      await getApiSync(URL_API_LiVE + "/getStatusActive?user=" + user, null, null, 
                    null, 'application/json'
                  ,"GET"
      ).then((result)=>{

          if (typeof result == 'object'){

            arr_tmp = {...result};
          }
      })

      await new Promise(resolve => setTimeout(resolve, 10));
      
      return arr_tmp;
    
  }

  getListCompanyByUser = async(user) => {
      let arr_tmp:any = [];

      // hasil api sudah berupa label dan value, jadi bisa langsung di parsing ke MultiSelect Company
      await getApiSync(URL_API_LiVE + "/getListCompanyByUser?user=" + user, null, null, 
                    null, 'application/json'
                  ,"GET"
      ).then((result)=>{

          if (Array.isArray(result)){

            if (result.length > 0){
                arr_tmp = [...result];
            }  
          }
      })

      await new Promise(resolve => setTimeout(resolve, 10));
      
      return arr_tmp;
    
  }


  async onChangeSelectFilterModal(e:any, action:any, input_name:any)
  {
      let val = e?.['value']
      let obj_single = e;

      if (typeof val != 'undefined' && val != null)
      {

          if (input_name == 'updateUserCompany_user')
          { 
            
              let user_selected:any = obj_single?.['value']
            
              let default_comp_selected_arr:any = await this.getListCompanyByUser(user_selected);
              let obj_status_active_user:any = await this.getStatusActiveUser(user_selected);
              
              let hasilValCheck:any = 0;
              if (typeof obj_status_active_user?.['active'] != 'undefined' &&
                  obj_status_active_user?.['active'] != null)
              {
                  hasilValCheck = obj_status_active_user?.['active'];
              }
              else{
                  hasilValCheck = 0;
              }
              
              this.obj_updateUserCompany = {
                  ...this.obj_updateUserCompany,
                  'company': [...default_comp_selected_arr],
                  'user': obj_single,
                  'active': hasilValCheck == 1 ? true : false
              }

              this.setState({
                ...this.state,
                filter_company_update_user_company: [...default_comp_selected_arr],   // company yang teregis di database
                modal:{
                  ...this.state.modal,
                  updateUserCompany:{
                      ...this.state.modal.updateUserCompany,
                      checked_user_active: hasilValCheck == 1 ? true : false,
                      input:{
                          ...this.state.modal.updateUserCompany.input,
                          user:{
                            ...this.state.modal.updateUserCompany.input.user,
                            value: obj_single
                          }
                      }
                  }
                }
              })
          }

          if (input_name == 'updateUserCompany_company')
          {
              this.setState({
                ...this.state,
                modal:{
                  ...this.state.modal,
                  updateUserCompany:{
                      ...this.state.modal.updateUserCompany,
                      input:{
                          ...this.state.modal.updateUserCompany.input,
                          company:{
                            ...this.state.modal.updateUserCompany.input.company,
                            value: obj_single
                          }
                      }
                  }
                }
              })
          }

          if (input_name == 'updateProfileTangki_company'){
              this.setState({
                ...this.state,
                modal:{
                  ...this.state.modal,
                  updateProfileTangki:{
                      ...this.state.modal.updateProfileTangki,
                      input:{
                          ...this.state.modal.updateProfileTangki.input,
                          filterOptions_Tangki: [],
                          company:{
                            ...this.state.modal.updateProfileTangki.input.company,
                            value: obj_single
                          },
                          tangki:{
                            ...this.state.modal.updateProfileTangki.input.tangki,
                            isLoading: true
                          }
                      }
                  }
                }
              })

              getApiSync(URL_API_LiVE + "/company/tangki?company_id=" + val, null, null, 
                    null, 'application/json'
                  ,"GET"
              )
              .then((result)=>{
                  if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
                  {
                    if (result?.['status'].toString().toLowerCase() == 'failed'){
                      notify('error', result?.['message'])
                    }
                  }
                  else{
                    if (Array.isArray(result)){
                      if (result.length > 0){
                          let tangki_temp:any = [];
                          tangki_temp = result.map((ele_tangki, idx_tangki)=>{
                              return {
                                  value: ele_tangki?.['tangki_id'],
                                  label: ele_tangki?.['tangki_name']
                              }
                          })

                          this.setState({
                            ...this.state,
                            modal:{
                              ...this.state.modal,
                              updateProfileTangki:{
                                  ...this.state.modal.updateProfileTangki,
                                  input:{
                                      ...this.state.modal.updateProfileTangki.input,
                                      filterOptions_Tangki: [...tangki_temp],
                                      tangki:{
                                        ...this.state.modal.updateProfileTangki.input.tangki,
                                        isLoading: false
                                      }
                                  }
                              }
                            }
                          })
                      }
                    }
                  }
              })
          }

          if (input_name == 'updatejenis_company')
          {
              this.setState({
                ...this.state,
                modal:{
                  ...this.state.modal,
                  updateJenis:{
                      ...this.state.modal.updateJenis,
                      input:{
                          ...this.state.modal.updateJenis.input,
                          filterOptions_Tangki: [],
                          company:{
                            ...this.state.modal.updateJenis.input.company,
                            value: obj_single
                          },
                          tangki:{
                            ...this.state.modal.updateJenis.input.tangki,
                            isLoading: true
                          }
                      }
                  }
                }
              })

              getApiSync(URL_API_LiVE + "/company/tangki?company_id=" + val, null, null, 
                    null, 'application/json'
                  ,"GET"
              )
              .then((result)=>{
                  if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
                  {
                    if (result?.['status'].toString().toLowerCase() == 'failed'){
                      notify('error', result?.['message'])
                    }
                  }
                  else{
                    if (Array.isArray(result)){
                      if (result.length > 0){
                          let tangki_temp:any = [];
                          tangki_temp = result.map((ele_tangki, idx_tangki)=>{
                              return {
                                  value: ele_tangki?.['tangki_id'],
                                  label: ele_tangki?.['tangki_name']
                              }
                          })

                          this.setState({
                            ...this.state,
                            modal:{
                              ...this.state.modal,
                              updateJenis:{
                                  ...this.state.modal.updateJenis,
                                  input:{
                                      ...this.state.modal.updateJenis.input,
                                      filterOptions_Tangki: [...tangki_temp],
                                      tangki:{
                                        ...this.state.modal.updateJenis.input.tangki,
                                        isLoading: false
                                      }
                                  }
                              }
                            }
                          })

                          setTimeout(()=>{
                            // cek jika sudah ada jenis sebelum nya tersimpan, maka di tampilkan di kanan bawah select "Jenis"
                            this.updateJenis_DataSavedLabel()
                          },50)

                          // this.updateJenis_DataSavedLabel()
                      }
                    }
                  }
              })
          }

          if (input_name == 'updateProfileTangki_tangki')
          {
              // parsing value yang di pilih pada select 'tangki'
              this.setState({
                ...this.state,
                modal:{
                  ...this.state.modal,
                  updateProfileTangki:{
                      ...this.state.modal.updateProfileTangki,
                      input:{
                          ...this.state.modal.updateProfileTangki.input,
                          tangki:{
                            ...this.state.modal.updateProfileTangki.input.tangki,
                            value: obj_single
                          }
                      }
                  }
                }
              })

              let valCompany_toApi:any = this.state.modal.updateProfileTangki.input.company.value?.['value'];

              // get tinggi profile tangki
              getApiSync(URL_API_LiVE + "/get/profiletangki?company_id=" + valCompany_toApi + "&tangki_id=" + val, null, null, 
                    null, 'application/json'
                  ,"GET"
              )
              .then((result)=>{
                  if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
                  {
                    if (result?.['status'].toString().toLowerCase() == 'failed'){
                      notify('error', result?.['message'])
                      return
                    }
                  }
                  
                  let get_tinggi_profile:any = result?.['result']?.['tinggi_profile'];

                  this.setState({
                    ...this.state,
                    modal:{
                      ...this.state.modal,
                      updateProfileTangki:{
                        ...this.state.modal.updateProfileTangki,
                        input:{
                          ...this.state.modal.updateProfileTangki.input,
                          tinggi_profile:{
                            ...this.state.modal.updateProfileTangki.input.tinggi_profile,
                            value: get_tinggi_profile
                          }
                        }
                      }
                    }
                  })
                  
              })

          }

          if (input_name == 'updatejenis_tangki')
          {
            // parsing value yang di pilih pada select 'tangki'
            this.setState({
              ...this.state,
              modal:{
                ...this.state.modal,
                updateJenis:{
                    ...this.state.modal.updateJenis,
                    input:{
                        ...this.state.modal.updateJenis.input,
                        tangki:{
                          ...this.state.modal.updateJenis.input.tangki,
                          value: obj_single
                        }
                    }
                }
              }
            })

            setTimeout(()=>{
              // cek jika sudah ada jenis sebelum nya tersimpan, maka di tampilkan di kanan bawah select "Jenis"
              this.updateJenis_DataSavedLabel()
            },50)
          }

          if (input_name == 'updatejenis_jenis')
          {
            this.setState({
              ...this.state,
              modal:{
                ...this.state.modal,
                updateJenis:{
                    ...this.state.modal.updateJenis,
                    input:{
                        ...this.state.modal.updateJenis.input,
                        jenis:{
                          ...this.state.modal.updateJenis.input.jenis,
                          value: obj_single
                        }
                    }
                }
              }
            })
          }

      }
      else
      // VAL BERNILAI NULL ATAU DIKOSONGKAN
      if (typeof val == 'undefined' || val == null)
      {
          if (input_name == 'updateProfileTangki_company'){
              if (action == "clear"){

                this.setState({
                  ...this.state,
                  modal:{
                    ...this.state.modal,
                    updateProfileTangki:{
                        ...this.state.modal.updateProfileTangki,
                        input:{
                            ...this.state.modal.updateProfileTangki.input,
                            filterOptions_Tangki: [],
                            company:{
                                ...this.state.modal.updateProfileTangki.input.company,
                                value:null
                            },
                            tangki:{
                              ...this.state.modal.updateProfileTangki.input.tangki,
                              isLoading: false,
                              value: null
                            }
                        }
                    }
                  }
                })
              }
          }

          if (input_name == 'updateProfileTangki_tangki'){
              if (action == "clear"){

                this.setState({
                  ...this.state,
                  modal:{
                    ...this.state.modal,
                    updateProfileTangki:{
                        ...this.state.modal.updateProfileTangki,
                        input:{
                            ...this.state.modal.updateProfileTangki.input,
                            tangki:{
                              ...this.state.modal.updateProfileTangki.input.tangki,
                              isLoading: false,
                              value: null
                            }
                        }
                    }
                  }
                })
              }
          }

        // clear updatejenis_company
          if (input_name == 'updatejenis_company')
          {
            if (action == "clear"){
              this.setState({
                ...this.state,
                modal:{
                  ...this.state.modal,
                  updateJenis:{
                      ...this.state.modal.updateJenis,
                      input:{
                          ...this.state.modal.updateJenis.input,
                          filterOptions_Tangki: [],
                          company:{
                              ...this.state.modal.updateJenis.input.company,
                              value:null
                          },
                          tangki:{
                            ...this.state.modal.updateJenis.input.tangki,
                            isLoading: false,
                            value: null
                          }
                      }
                  }
                }
              })

              setTimeout(()=>{
                // cek jika sudah ada jenis sebelum nya tersimpan, maka di tampilkan di kanan bawah select "Jenis"
                this.updateJenis_DataSavedLabel()
              },50)
            }
          }
          // ... <end> clear updatejenis_company

          // clear updatejenis_tangki
          if (input_name == 'updatejenis_tangki')
          {
            if (action == "clear")
            {
                this.setState({
                  ...this.state,
                  modal:{
                    ...this.state.modal,
                    updateJenis:{
                        ...this.state.modal.updateJenis,
                        input:{
                            ...this.state.modal.updateJenis.input,
                            tangki:{
                              ...this.state.modal.updateJenis.input.tangki,
                              value: null
                            }
                        }
                    }
                  }
                })

                setTimeout(()=>{
                  // cek jika sudah ada jenis sebelum nya tersimpan, maka di tampilkan di kanan bawah select "Jenis"
                  this.updateJenis_DataSavedLabel()
                },50)

                return
            }
          }
          // ... end clear updatejenis_tangki

          // clear updatejenis_jenis
          if (input_name == 'updatejenis_jenis')
          {
            if (action == "clear")
            {
                this.setState({
                  ...this.state,
                  modal:{
                    ...this.state.modal,
                    updateJenis:{
                        ...this.state.modal.updateJenis,
                        input:{
                            ...this.state.modal.updateJenis.input,
                            jenis:{
                              ...this.state.modal.updateJenis.input.jenis,
                              value: null
                            }
                        }
                    }
                  }
                })
                return
            }
          }
          // ... end clear updatejenis_tangki

          // clear updatejenis_company
          if (input_name == 'updateUserCompany_user')
          {
            if (action == "clear")
            {
                this.obj_updateUserCompany = {
                    ...this.obj_updateUserCompany,
                    'user': {}
                }

                this.setState({
                  ...this.state,
                  filter_company_update_user_company: [], // clear selected company when user is not selected
                  modal:{
                    ...this.state.modal,
                    updateUserCompany:{
                        ...this.state.modal.updateUserCompany,
                        checked_user_active: false,
                        input:{
                            ...this.state.modal.updateUserCompany.input,
                            user:{
                                ...this.state.modal.updateUserCompany.input.user,
                                isLoading: false,
                                value: null
                            },
                            // company:{
                            //     ...this.state.modal.updateUserCompany.input.company,
                            //     isLoading: false,
                            //     value: null
                            // }
                        }
                    }
                  }
                })
                return
            }
          }
          // ... end clear updatejenis_tangki
      }
      
  }

  onChangeSelectFilter(e:any, action:any){
    if (action == 'clear'){
      this.setState({
        ...this.state,
        show:{
          ...this.state.show,
          datepicker:false,
          timepicker:false
        }
      }) 
      return
    }

    switch (e.value){
      case 'date':
            this.setState({
              ...this.state,
              show:{
                ...this.state.show,
                datepicker:true,
                timepicker:false
              }
            })
            break;
      case 'time':
            this.setState({
              ...this.state,
              show:{
                ...this.state.show,
                datepicker:true,
                timepicker:true
              }
            })
            break;
    }

    console.log(e.value)
  }

  setFilterDate(date:any, tipe:'filterJam'|'updateJenis'){
    if (tipe == 'filterJam')
    {
      this.setState({
        ...this.state,
        dateSelected: date
      })
    }
    else if (tipe == 'updateJenis'){
      this.setState({
        ...this.state,
        modal:{
            ...this.state.modal,
            updateJenis:{
                ...this.state.modal.updateJenis,
                input:{
                  ...this.state.modal.updateJenis.input,
                  dateSelected: date
                }
            }
        }
      })

      setTimeout(()=>{
        this.updateJenis_DataSavedLabel()
      },50)
    }
  }

  get_Suhu1M_From_Filter(tanggal, callback){

      // kosongkan data master 1m cpo / pko
      let kosongkan_data_mst_1m_cpopko = {}

      let arr_json_tangki_last_length = Object.keys(this.mst_1m_cpo_pko_filter).length;

      Object.keys(this.mst_1m_cpo_pko_filter).forEach((ele_tank_name,idx)=>{
          kosongkan_data_mst_1m_cpopko = {
              ...kosongkan_data_mst_1m_cpopko,
              [ele_tank_name]: ''
          }
      })
      this.mst_1m_cpo_pko_filter = {...kosongkan_data_mst_1m_cpopko}
      // ... <end> kosongkan

      let status_done = false;

      this.getDataHour_Await(tanggal, '07:30', '08:00', null, (res_data)=>{
          if (res_data?.['responseCode'] == "200"){

              if (res_data?.['data'].length > 0)
              {
                  res_data?.['data'].forEach((ele_obj,idx_obj)=>{
    
                      ele_obj?.['data'].forEach((ele_obj_key, idx_obj_key)=>{
    
                          Object.keys(ele_obj_key).forEach((ele_key, idx_key)=>{
                              let patt = new RegExp(/Temperature Tank [0-9]+.*M/,'gi')
                              let match = patt.exec(ele_key);
                              
                              if (match != null){
            
                                let patt_tank = new RegExp(/Tank [0-9]+/,'gi')
                                let match_tank = patt_tank.exec(match?.['input'])
                                if (match_tank != null)
                                {
                                      let tangki_name = '';
    
                                      let find_tank_in_list = this.mst_list_tangki.find(ele=>ele?.['api'].toLowerCase() == match_tank?.[0].toLowerCase())
                                      if (find_tank_in_list){
    
                                          tangki_name = find_tank_in_list?.['name'];
                                          // console.log("find_tank_in_list?.['name']")
                                          // console.log(find_tank_in_list?.['name'])
                                      }
    
                                      // console.log("Hasil PATT EXEC TANK")
                                      // console.log(match_tank[0])
    
                                      let patt_tinggi = new RegExp(/tinggi [0-9]+.*M/,'gi')
                                      let match_patt_tinggi = patt_tinggi.exec(match?.['input'])
                                      if (match_patt_tinggi != null){

                                          let suhu_tinggi_num = parseFloat(match_patt_tinggi[0].replace(/(tinggi|M)/gi,''));
    
                                          // HARUS AMBIL YANG KETINGGIAN 1 METER
                                          if (suhu_tinggi_num == 1 || suhu_tinggi_num == 0.2){
                                              
                                              let suhu_1m_val = ele_obj_key?.[ele_key];
    
                                              // CEK APAKAH (mst_1m_cpo_pko) UNTUK SEMUA TANGKI SUDAH TERISI CPO / PKO
    
                                              let findTank_1mCpoPko = Object.keys(this.mst_1m_cpo_pko_filter).find(ele=>ele == tangki_name);
                                              if (findTank_1mCpoPko){
    
                                                  if (this.mst_1m_cpo_pko_filter?.[tangki_name] == '' ||
                                                      this.mst_1m_cpo_pko_filter?.[tangki_name] == null){
    
                                                      // [tangki_name]: Math.floor(parseFloat(suhu_1m_val)) <= 39.9999 ? 'PKO' : 'CPO'
                                                      this.mst_1m_cpo_pko_filter = {
                                                          ...this.mst_1m_cpo_pko_filter, 
                                                          [tangki_name]: parseFloat(suhu_1m_val) <= 39.9999 ? 'PKO' : 'CPO'
                                                        }
                                                      

                                                      let findEmpty = Object.values(this.mst_1m_cpo_pko_filter).find(ele=>ele == '')
                                                      if (!findEmpty){
                                                            status_done = true
                                                            console.error(Object.values(this.mst_1m_cpo_pko_filter))
                                                      }
    
                                                  }
                                              }
                                          }
                                      }
                                }
    
                              }
    
                          })
                      })
                  })
              }
              else{
                  status_done = true
              }
          }
          else{
            status_done = true
          }
      })

      // TUNGGU HINGGA SELESAI
      let intLast = setInterval(()=>{
          if (status_done){
              clearInterval(intLast)
              callback(this.mst_1m_cpo_pko_filter);
          }
      })
  }

  clickFilterCompany(){
    // function untuk mapping beberapa value company jadi satu array
    //  misal : [1,2,3]

      document.getElementById("angka-id-percent-cpo")!.innerHTML = "- %"
      document.getElementById("angka-id-percent-pko")!.innerHTML = "- %"
      document.getElementById("angka-id-cpo")!.innerHTML = "- kg"
      document.getElementById("angka-id-pko")!.innerHTML = "- kg"
      document.getElementById("progress-bar-custom-width-cpo")!.style.width = "0%" 
      document.getElementById("progress-bar-custom-width-pko")!.style.width = "0%" 

      let arr_company_list:any = this.state?.['filter_company'];
      let arr_company_list_final:any = [];
      arr_company_list_final = arr_company_list.map(ele=> Number(ele.value));
      
      if (sessionStorage.getItem("BESTFCOM") != null){
          sessionStorage.removeItem("BESTFCOM")
      }
      if (Array.isArray(this.state.filter_company)){
        sessionStorage.setItem("BESTFCOM", JSON.stringify(this.state?.['filter_company']))
      }

      // RESET STATE UNTUK ME-RESET variable state
      this.resetState((CB_Reset)=>{
        this.processRealTimeNHour();
      });

  }

  clickFilter(){
      let dateSelected:any = this.state.dateSelected;
      let timeSelected:any = this.state.timeSelected;
      
      if (this.state.show.datepicker || this.state.show.timepicker){

          if (this.state.show.datepicker && dateSelected == null){
              notify("error","Tanggal harus di isi !");
              return
          }

          if (this.state.show.timepicker && (timeSelected[0] == null
                || timeSelected[1] == null)
              )
          {
              notify("error","Waktu harus di isi !");
              return
          }
          if (this.state.show.timepicker){
              let firstDate:any = formatDate(new Date(),'YYYY-MM-DD') + ' ' + timeSelected[0];
              let secondDate:any = formatDate(new Date(),'YYYY-MM-DD') + ' ' + timeSelected[1];
              if (firstDate > secondDate){
                notify("error","Waktu Kedua harus lebih besar dari Waktu Pertama !")
                return
              }
          }

          if (dateSelected != null || timeSelected != null)
          {

            if (this.state.show.datepicker && !this.state.show.timepicker){

                this.data_jaraksensor_tangki_perjam_series = []
                this.data_jaraksensor_tangki_perjam_categories = []
                this.data_suhu_tangki_perjam_series = []
                this.data_suhu_tangki_perjam_categories = []
                this.data_tinggi_tangki_perjam_categories = []
                this.data_tinggi_tangki_perjam_series = []
                this.data_volume_tangki_perjam_categories = []
                this.data_volume_tangki_perjam_series = []

                this.obj_suhu_tinggi_tangki_perjam_series = {};

                this.setState({
                  ...this.state,
                  loader:{
                    ...this.state.loader,
                    jarak_sensor_jam: true,
                    tinggi_isi_jam: true,
                    tinggi_isi_modus_jam: true,
                    suhu_tangki_jam: true,
                    suhu_tangki_modus_jam: true,
                    suhu_tinggi_tangki_jam: true,
                    volume_tangki_jam: true
                  },
                });

                setTimeout(()=>{
                  
                    this.get_Suhu1M_From_Filter(formatDate(this.state.dateSelected,'YYYY-MM-DD'), (obj_mst_1m_cpo_pko_filter)=>{
                        // alert(JSON.stringify(obj_mst_1m_cpo_pko_filter))

                        // get jenis by api filter per jam
                        this.get_jenis_by_api_filter(this.state.dateSelected, (result_getjenis)=>{

                            this.mst_jenis_by_api_perjam = {...result_getjenis}

                            this.getAllData(this.state.dateSelected, this.state.dateSelected,'00:00','23:59', obj_mst_1m_cpo_pko_filter)
                        })
                    })

                },200)
            }
            else
            {
              if (this.state.show.datepicker && this.state.show.timepicker){
                if (dateSelected != null && 
                        timeSelected[0] != null &&
                        timeSelected[1] != null){
                    
                    this.data_jaraksensor_tangki_perjam_series = []
                    this.data_jaraksensor_tangki_perjam_categories = []
                    this.data_suhu_tangki_perjam_series = []
                    this.data_suhu_tangki_perjam_categories = []
                    this.data_tinggi_tangki_perjam_categories = []
                    this.data_tinggi_tangki_perjam_series = []
                    this.data_volume_tangki_perjam_categories = []
                    this.data_volume_tangki_perjam_series = []

                    this.obj_suhu_tinggi_tangki_perjam_series = {};

                    this.setState({
                      ...this.state,
                      loader:{
                        ...this.state.loader,
                        jarak_sensor_jam: true,
                        tinggi_isi_jam: true,
                        tinggi_isi_modus_jam: true,
                        suhu_tangki_jam: true,
                        suhu_tangki_modus_jam: true,
                        suhu_tinggi_tangki_jam: true,
                        volume_tangki_jam: true
                      },
                    });

                    setTimeout(()=>{

                      this.get_Suhu1M_From_Filter(formatDate(this.state.dateSelected,'YYYY-MM-DD'), (obj_mst_1m_cpo_pko_filter)=>{
                          
                          // get jenis by api filter per jam
                          this.get_jenis_by_api_filter(this.state.dateSelected, (result_getjenis)=>{

                              this.mst_jenis_by_api_perjam = {...result_getjenis}
                            
                              this.getAllData(dateSelected, dateSelected, timeSelected[0], timeSelected[1], obj_mst_1m_cpo_pko_filter);
                          })

                      })

                    },200)
                }
              }
            }


            console.log(dateSelected)
            console.log(timeSelected)
          }
      }
      else{
        // reset yang perjam
        this.data_jaraksensor_tangki_perjam_series = []
        this.data_jaraksensor_tangki_perjam_categories = []
        this.data_suhu_tangki_perjam_series = []
        this.data_suhu_tangki_perjam_categories = []
        this.data_tinggi_tangki_perjam_categories = []
        this.data_tinggi_tangki_perjam_series = []
        this.data_volume_tangki_perjam_categories = []
        this.data_volume_tangki_perjam_series = []

        this.obj_suhu_tinggi_tangki_perjam_series = {};

        this.setState({
          ...this.state,
          loader:{
            ...this.state.loader,
            jarak_sensor_jam: true,
            tinggi_isi_jam: true,
            tinggi_isi_modus_jam: true,
            suhu_tangki_jam: true,
            suhu_tangki_modus_jam: true,
            suhu_tinggi_tangki_jam: true,
            volume_tangki_jam: true
          },
          // chartTinggiJam: {
          //   ...this.state.chartTinggiJam,
          //   series:[]
          // },
          // chartSuhuJam: {
          //   ...this.state.chartSuhuJam,
          //   series:[],
          //   options:{
          //     ...this.state.chartSuhuJam.options,
          //     xaxis:{
          //       ...this.state.chartSuhuJam.options.xaxis,
          //       categories:[]
          //     }
          //   }
          // }
        })

        setTimeout(()=>{
          console.log(this.state)

          let arr_maxDate_ForPerHour:any;
          let maxDate_ForPerHour:any;
          let get_maxDate_ForPerHour:any;
          let get_hourbegin_ForPerHour:any;
          let get_hourlast_ForPerHour:any;

          if (typeof this.arr_date_realtime != 'undefined' && this.arr_date_realtime != null){
            arr_maxDate_ForPerHour = this.arr_date_realtime.map(ele=>ele?.['time_tank_getTime']);
            maxDate_ForPerHour = Math.max.apply(null, arr_maxDate_ForPerHour);
            get_maxDate_ForPerHour = this.arr_date_realtime.filter(ele=>ele?.['time_tank_getTime'] == maxDate_ForPerHour)[0];
            get_hourbegin_ForPerHour = get_maxDate_ForPerHour?.['hourbegin'];
            get_hourlast_ForPerHour = get_maxDate_ForPerHour?.['hourlast'];
          }

          this.get_Suhu1M_From_Filter(formatDate(this.state.dateSelected,'YYYY-MM-DD'), (obj_mst_1m_cpo_pko_filter)=>{

              this.get_jenis_by_api_filter(this.tanggal_max_tangki_last, (result_getjenis)=>{

                  this.mst_jenis_by_api_perjam = {...result_getjenis}

                  this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last
                                , get_hourbegin_ForPerHour, get_hourlast_ForPerHour,
                                obj_mst_1m_cpo_pko_filter
                            )
              })
          })
        },200)
      }
      
      
  }

  onChangeTimePicker(e:any){
      // alert(JSON.stringify(e))
      // console.log(e)
      try{
        this.setState({
          timeSelected:[e[0], e[1]]
        })
      }catch(err:any){
        this.setState({
          timeSelected:[null, null]
        })
      }
  }
  onBlurTimePicker(e:any){
    // console.log(e)
  }

  onStartTimeClick(e:any){
    // alert(JSON.stringify(e))
  }

  checkChartJam(val:any, type:'jarak_sensor'|'tinggi'|'suhu_jam'|'volume_jam'|'suhu_tinggi_jam'|
                'tinggi_modus'|'suhu_modus'){
    
    // console.log(val.target.checked)
    // if (val.target.checked){
      // this.chartTinggiJam_OptionsChart = {
      //   ...this.chartTinggiJam_OptionsChart,
      //   dataLabels:{
      //     ...this.chartTinggiJam_OptionsChart.dataLabels,
      //     enabled: val.target.checked
      //   }
      // }

      // this.setChartTinggiJam = {
      //   ...this.setChartTinggiJam,
      //   options:{...this.state.chartTinggiJam.options}
      // }

      if (type == 'tinggi'){
          this.statusChecked['tinggi'] = val.target.checked

          console.log('check chart JAM')
          console.log(this.state)
          this.setState({
            ...this.state,
            chartTinggiJam: {
                ...this.state.chartTinggiJam,
                options:{
                  ...this.state.chartTinggiJam.options,
                  xaxis:{
                    ...this.state.chartTinggiJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartTinggiJam.options.dataLabels,
                    formatter:(val:any)=>{
                      return !isNaN(val) ? (Math.round(parseFloat(val)*1000)/1000) + " m" : ''
                    },
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if (type == 'tinggi_modus'){
          this.statusChecked['tinggi_modus'] = val.target.checked

          console.log('check chart JAM')
          console.log(this.state)
          this.setState({
            ...this.state,
            chartTinggiModusJam: {
                ...this.state.chartTinggiModusJam,
                options:{
                  ...this.state.chartTinggiModusJam.options,
                  xaxis:{
                    ...this.state.chartTinggiModusJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartTinggiModusJam.options.dataLabels,
                    formatter:(val:any)=>{
                      return !isNaN(val) ? (Math.round(parseFloat(val)*1000)/1000) + " m" : ''
                    },
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'suhu_jam'){
          this.statusChecked['suhu'] = val.target.checked

          this.setState({
            ...this.state,
            chartSuhuJam: {
                ...this.state.chartSuhuJam,
                options:{
                  ...this.state.chartSuhuJam.options,
                  xaxis:{
                    ...this.state.chartSuhuJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartSuhuJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'suhu_modus'){
          this.statusChecked['suhu_modus'] = val.target.checked

          this.setState({
            ...this.state,
            chartSuhuModusJam: {
                ...this.state.chartSuhuModusJam,
                options:{
                  ...this.state.chartSuhuModusJam.options,
                  xaxis:{
                    ...this.state.chartSuhuModusJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartSuhuModusJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'suhu_tinggi_jam'){
          this.statusChecked['suhu_tinggi'] = val.target.checked

          this.setState({
            ...this.state,
            chartSuhuTinggiJam: {
                ...this.state.chartSuhuTinggiJam,
                options:{
                  ...this.state.chartSuhuTinggiJam.options,
                  xaxis:{
                    ...this.state.chartSuhuTinggiJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartSuhuTinggiJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'jarak_sensor'){
          this.statusChecked['jarak_sensor'] = val.target.checked

          this.setState({
            ...this.state,
            chartJarakSensorJam: {
                ...this.state.chartJarakSensorJam,
                options:{
                  ...this.state.chartJarakSensorJam.options,
                  xaxis:{
                    ...this.state.chartJarakSensorJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartJarakSensorJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'volume_jam'){
          this.statusChecked['volume'] = val.target.checked

          this.setState({
            ...this.state,
            chartVolumeJam: {
                ...this.state.chartVolumeJam,
                options:{
                  ...this.state.chartVolumeJam.options,
                  xaxis:{
                    ...this.state.chartVolumeJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartVolumeJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
    
    // }
  }

  handleLogOut(){

      handleLogOutGlobal();
      // if (localStorage.getItem("BESTLGN") != null){localStorage.removeItem("BESTLGN")}// // HAPUS KEY STATUS LOGIN
      // if (localStorage.getItem("BESTEXP") != null){localStorage.removeItem("BESTEXP")}// // HAPUS KEY EXPIRED in miliseconds
      // if (localStorage.getItem("BESTCOMID") != null){localStorage.removeItem("BESTCOMID")}// // HAPUS KEY COMPANY ID ARRAY
      // if (localStorage.getItem("BESTCOMSEL") != null){localStorage.removeItem("BESTCOMSEL")}// // HAPUS KEY COMPANY SELECT (FOR DROPDOWN OPTION)
      // if (localStorage.getItem("BESTDEVID") != null){localStorage.removeItem("BESTDEVID")}// // HAPUS KEY DEVICE ID  (TANK12_HP_PAMALIAN, TANK34_HP_PAMALIAN)
      // if (localStorage.getItem("BESTLVL") != null){localStorage.removeItem("BESTLVL")}// // HAPUS KEY LEVEL
      // if (localStorage.getItem("BESTUSRP") != null){localStorage.removeItem("BESTUSRP")}// // HAPUS USER TITLE

      // if (sessionStorage.length > 0)
      // {
      //   sessionStorage.clear()
      // }
  }

  handleClick_CloseModal(tipe:'updateJenis'|'updateUserCompany'|'updateProfileTangki') {

    this.setState({
      ...this.state,
      modal:{
        ...this.state.modal,
        [tipe]:{
            ...this.state.modal?.[tipe],
            show: false
        }
      }
    })
  }

  handleClick_ChangePWD(showModal:boolean, tipe:'changePWD'|'createUser'|'updateJenis'|'updateUserCompany'|
                      'updateProfileTangki'){
      // document.getElementsByClassName("modal-content")[0]
      let menu_selected:any = '';

      if (tipe == 'changePWD'){
          menu_selected = 'changePWD'
          setTimeout(()=>{
            try{
              this.passwordInput.focus();
            }catch(e){}
          },100)
      }
      else if (tipe == 'createUser'){
          menu_selected = 'createUser'

          this.obj_createUser = {
            newUser:'',
            company:[],
            newPass:'',
            confirmNewPass:''
          };

          setTimeout(()=>{
            try{
              this.userNameInput.focus();
            }catch(e){}
          },100)
      }
      else if (tipe == 'updateUserCompany'){
          menu_selected = 'updateUserCompany'

          this.obj_updateUserCompany = {
              user: {},
              company: [],
              created_user: '',
              active: false
          }

          let company_temp:any = [];
          company_temp = [...this.options_filter_company];

          this.setState({
              ...this.state,
              filter_company_update_user_company: [],
              modal:{
                  ...this.state.modal,
                  updateUserCompany:{
                      ...this.state.modal.updateUserCompany,
                      show: true,
                      checked_user_active: false,
                      input:{
                        ...this.state.modal.updateUserCompany.input,
                        filterOptions_Company: [...company_temp],
                        user:{
                            value:null,
                            isLoading: false
                        },
                        company:{
                            value: null,
                            isLoading: false
                        }
                      }
                  },
              }
          })
      }
      else if (tipe == 'updateProfileTangki'){

        menu_selected = 'updateProfileTangki'

        setTimeout(()=>{
          try{
            this.refCompanyInput.focus();
          }catch(e){}
        },100)

          this.setState({
            ...this.state,
            modal:{
              ...this.state.modal,
              updateProfileTangki:{
                  ...this.state.modal.updateProfileTangki,
                  show: true,
                  input:{
                      ...this.state.modal.updateProfileTangki.input,
                      filterOptions_Company: [],
                      tangki:{
                        ...this.state.modal.updateProfileTangki.input.tangki,
                        value: null
                      },
                      company: {
                        ...this.state.modal.updateProfileTangki.input.company,
                        value:null,
                        isLoading: true
                      }
                  }
              }
            }
          })

          let company_temp:any = [];
          company_temp = [...this.options_filter_company];

          this.setState({
            ...this.state,
            modal:{
              ...this.state.modal,
              updateProfileTangki:{
                  ...this.state.modal.updateProfileTangki,
                  show: showModal,
                  input:{
                      ...this.state.modal.updateProfileTangki.input,
                      filterOptions_Company: [...company_temp],
                      filterOptions_Tangki: [],
                      company:{
                        ...this.state.modal.updateProfileTangki.input.company,
                        isLoading: false,
                        value: null
                      },
                      tangki:{
                        ...this.state.modal.updateProfileTangki.input.tangki,
                        value: null
                      },
                      tinggi_profile: {
                        ...this.state.modal.updateProfileTangki.input.tinggi_profile,
                        value: null,
                      }
                  }
              }
            }
          })
      }
      else if (tipe == 'updateJenis'){
          menu_selected = 'updateJenis'

            this.setState({
              ...this.state,
              modal:{
                ...this.state.modal,
                updateJenis:{
                    ...this.state.modal.updateJenis,
                    show: true,
                    input:{
                        ...this.state.modal.updateJenis.input,
                        filterOptions_Company: [],
                        tangki:{
                          ...this.state.modal.updateJenis.input.tangki,
                          value: null
                        },
                        company: {
                          ...this.state.modal.updateJenis.input.company,
                          value:null,
                          isLoading: true
                        },
                        jenis: {
                          ...this.state.modal.updateJenis.input.jenis,
                          value:null,
                          dataSaved: null
                        }
                    }
                }
              }
            })

          // setTimeout(()=>{
          //   getApiSync(URL_API_LiVE + "/company", null, null, 
          //         null, 'application/json'
          //       ,"GET"
          //   )
          //   .then((result)=>{
          //       if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
          //       {
          //         if (result?.['status'].toString().toLowerCase() == 'failed'){
          //           notify('error', result?.['message'])
          //         }
          //       }
                // else{
                    // if (Array.isArray(result)){
                      // if (result.length > 0){
                          let company_temp:any = [];
                          company_temp = [...this.options_filter_company];

                          // company_temp = result.map((ele_company, idx_company)=>{
                          //     return {
                          //         value: ele_company?.['id'],
                          //         label: ele_company?.['company_name']
                          //     }
                          // })

                          this.setState({
                            ...this.state,
                            modal:{
                              ...this.state.modal,
                              updateJenis:{
                                  ...this.state.modal.updateJenis,
                                  show: showModal,
                                  input:{
                                      ...this.state.modal.updateJenis.input,
                                      filterOptions_Company: [...company_temp],
                                      filterOptions_Tangki: [],
                                      company:{
                                        ...this.state.modal.updateJenis.input.company,
                                        isLoading: false,
                                        value: null
                                      },
                                      tangki:{
                                        ...this.state.modal.updateJenis.input.tangki,
                                        value: null
                                      },
                                      jenis: {
                                        ...this.state.modal.updateJenis.input.jenis,
                                        value:null,
                                        dataSaved: null
                                      }
                                  }
                              }
                            }
                          })
                      // }
                    // }
                    // if (result?.[''])
                }
      //       })
      //     },100)
      // }

      if (tipe == 'changePWD' || tipe == 'createUser')
      {
        this.setState({
            ...this.state,
            filter_company_create_user:[],
            modal:{
              ...this.state.modal,  
              [menu_selected]:{
                  ...this.state.modal?.[menu_selected],
                  show: showModal
              }
            }
        })
      }

      // TAMBAHKAN EFFECT SHOW MODAL SCALE 0 -> 1
      setTimeout(()=>{
        var classWillShowAll = document.querySelectorAll(".modal-will-show .modal-dialog");
        classWillShowAll.forEach((element) => {
             element.classList.add("modal-did-show")
        });   
      },10)

  }

  changePWD_ShowForm(showInput, showLoader, tipe:'changePWD'|'createUser'|'updateJenis'|'updateUserCompany'
                |'updateProfileTangki') {
      this.setState({
          ...this.state,
          modal:{
              ...this.state.modal,
              [tipe]:{
                  ...this.state.modal?.[tipe],
                  show: showInput,
                  loader: showLoader
              }
          }
      })
  }

  handleSaveUpdateProfileTangki(){
      
    let arr_ele_empty:any = []

    let username:any = localStorage.getItem("BESTUSR");
    if (typeof username != 'undefined' && username != null){
        try{
            username = CryptoJS.AES.decrypt(username, encryptCode).toString(CryptoJS.enc.Utf8);
        }catch(e){
            username = null
        }
    }

    if (typeof username == 'undefined' || username == null){
        notify('error', `Username is not identified from storage.\nTry to Login again !`)
        return
    }

    let obj_updateData = {};
    obj_updateData = { 
        username,
        company: this.state.modal.updateProfileTangki.input.company.value?.['value'],
        tangki: this.state.modal.updateProfileTangki.input.tangki.value?.['value'],
        tinggi_profile: this.state.modal.updateProfileTangki.input.tinggi_profile.value
    }

    Object.keys(obj_updateData).forEach((ele,idx)=>{
        if (obj_updateData[ele] == "" || 
            obj_updateData[ele] == null){

            if (ele == 'company'){
              arr_ele_empty.push("Company")
            }
            if (ele == 'tangki'){
              arr_ele_empty.push("Tangki")
            }
            if (ele == 'tinggi_profile'){
              arr_ele_empty.push("Tinggi Profile")
            }

        }
    })

    if (arr_ele_empty.length > 0)
    {
      // notify('error', arr_ele_empty.join(", ").replace(/, ([^,]*)$/, ' and $1') 
      //       + ' can\'t be empty !')
      notify('error', joinWithCommaNSuffixAnd(arr_ele_empty)  + ' can\'t be empty !')
      
      return
    }

    console.log(obj_updateData)

    this.changePWD_ShowForm(true, true, 'updateProfileTangki');
    
    getApiSync(URL_API_LiVE + "/update/profiletangki", null, null, {
              ...obj_updateData
            }, 'application/x-www-form-urlencoded'
            ,"POST"
    )
    .then((result)=>{
        if (typeof result?.['status'] != 'undefined' &&
            result?.['status'] != null)
        {
            if (result?.['status'].toString().toLowerCase() == 'failed')
            {
                notify('error', result?.['message'])
                setTimeout(()=>{
                  this.changePWD_ShowForm(true, false, 'updateProfileTangki')
                },1500)
            }
            else
            {
                notify('success', "Data Saved !")
                
                obj_updateData = {
                    username,
                    company: '',
                    tangki: '',
                    tinggi_profile: 0
                }
  
                setTimeout(()=>{
                  this.changePWD_ShowForm(false, false, 'updateProfileTangki')
                },2000)
            }

        }
    })

  }

  handleSaveCreateUser(){

      let arr_ele_empty:any = []

      Object.keys(this.obj_createUser).forEach((ele,idx)=>{
          if (ele == 'newUser'){
              if (this.obj_createUser[ele].trim() == ""){
                  arr_ele_empty.push("User")
              }
          }
          if (ele == 'company'){
              if (Array.isArray(this.obj_createUser[ele])){
                if (this.obj_createUser[ele].length == 0){
                  arr_ele_empty.push("Company")
                }
              }
              else if (this.obj_createUser[ele] == null){
                  arr_ele_empty.push("Company")
              }
          }
          
          if (this.obj_createUser[ele] == ""){
              if (ele == 'newPass'){
                arr_ele_empty.push("New Pass")
              }
              if (ele == 'confirmNewPass'){
                arr_ele_empty.push("Confirm New Pass")
              }
          }
          
      })

      if (arr_ele_empty.length > 0){

        // notify('error', arr_ele_empty.join(", ").replace(/, ([^,]*)$/, ' and $1') 
        //       + ' can\'t be empty !')
        notify('error', joinWithCommaNSuffixAnd(arr_ele_empty) + ' can\'t be empty !')
        
        return
      }

      if (this.obj_createUser?.['newPass'] != this.obj_createUser?.['confirmNewPass'])
      {
        notify('error', 'New and Confirm Password are not match !')
        return 
      }

      let username = this.obj_createUser?.['newUser'];
      let company = this.obj_createUser?.['company'];
      let enc_newpass = CryptoJS.AES.encrypt(this.obj_createUser?.['newPass'],encryptCode).toString();
      let enc_chiper = CryptoJS.AES.encrypt("!otTIS88jkT",encryptCode).toString()

      let parent_user_level = '';
      let parent_user_level_enc:any = '';

      try {
          parent_user_level = CryptoJS.AES.decrypt(localStorage.getItem("BESTLVL"),encryptCode).toString(CryptoJS.enc.Utf8);
          parent_user_level_enc = localStorage.getItem("BESTLVL");
      }catch(e){
          parent_user_level = ''
          parent_user_level_enc = ''
      }
      
      let created_user = '';
      try {
          created_user = CryptoJS.AES.decrypt(localStorage.getItem("BESTUSRP"),encryptCode).toString(CryptoJS.enc.Utf8);
      }catch(e){
          created_user = ''
      }

      let new_user_level = '';
      let enc_new_user_level = '';
      if (parent_user_level == ''){
          notify("error","Session User Level is not found !")
          return
      }
      else{
          switch (parent_user_level.toUpperCase()){
            case 'ADMIN': new_user_level = 'SUPER USER'; break;
            case 'SUPER USER': new_user_level = 'USER'; break;
          }
          enc_new_user_level = CryptoJS.AES.encrypt(new_user_level,encryptCode).toString();
      }
      
      // alert(company)
      // return

      this.changePWD_ShowForm(true, true, 'createUser');

      let company_final_to_api:any[] = company.map((res_com, idx_com)=>{
        return res_com?.['value']
      })

      getApiSync(URL_API_LiVE + "/user/create", null, null, {
                  "created_user": created_user,
                  "username": username,
                  "company": JSON.stringify(company_final_to_api),
                  "password": enc_newpass,
                  "chiper_code": enc_chiper,
                  "user_level": enc_new_user_level,       // level untuk user baru
                  "parent_user_level": parent_user_level_enc    // level dari parent user
              }, 'application/x-www-form-urlencoded'
              ,"POST"
          )
      .then((result)=>{
          if (result?.['status'].toLowerCase() == 'failed')
          {
              notify('error', result?.['message'])
              setTimeout(()=>{
                this.changePWD_ShowForm(true, false, 'createUser')
                setTimeout(()=>{
                  try{
                    this.userNameInput.focus();
                  }catch(e){}
                },100)
              },1500)
          }
          else
          {
              notify('success', "Data Saved !")
              
              this.obj_createUser = {
                  newUser: '',
                  company: [],
                  newPass: '',
                  confirmNewPass: ''
              }

              setTimeout(()=>{
                this.changePWD_ShowForm(false, false, 'createUser')
              },2000)
          }
      })

  }


  updateJenis_DataSavedLabel(){
    // (form Update Jenis) dapatkan "jenis" berdasarkan parameter tanggal, company dan tangki 

      let tanggal = this.state.modal.updateJenis.input.dateSelected;
      let company = this.state.modal.updateJenis.input.company.value?.['value'] ?? '';
      let tangki = this.state.modal.updateJenis.input.tangki.value?.['value'] ?? '';

      if (typeof tanggal == 'undefined' || tanggal == null){
          tanggal = ''
      }else{
        if (!isNaN(tanggal)){
          try{
            tanggal = formatDate(new Date(tanggal),'YYYY-MM-DD');
          }catch(e){
            tanggal = '';
          }
        }
      }
      
      let dataSaved_status = true;
      if (tanggal == '' || company == '' || tangki == '' ||
          tanggal == null || company == null || tangki == null)
      {
          dataSaved_status = false;
      }
      this.setState({
        ...this.state,
        modal:{
          ...this.state.modal,
          updateJenis:{
            ...this.state.modal.updateJenis,
            input:{
              ...this.state.modal.updateJenis.input,
              jenis:{
                ...this.state.modal.updateJenis.input.jenis,
                dataSaved:null
              }
            }
          }
        }
      })

      if (!dataSaved_status){
          // jika ada yang kosong maka tidak boleh hit api
          return
      }

      getApiSync(URL_API_LiVE + "/company/tangki/jenis?tanggal=" + tanggal + "&company_id=" + company + "&tangki_id=" + tangki, null, null, 
                    null, 'application/json'
                  ,"GET"
              )
      .then((result)=>{
          if (typeof result?.['status'] != 'undefined' && result?.['status'] != null)
          {
              let dataSaved_parse:any = ''
              if (result?.['status'] == 'Success')
              {
                  dataSaved_parse = 'Data Saved : ' + result?.['data']?.['jenis'];
              }
              else{
                  dataSaved_parse = null;
              }

              this.setState({
                ...this.state,
                modal:{
                  ...this.state.modal,
                  updateJenis:{
                    ...this.state.modal.updateJenis,
                    input:{
                      ...this.state.modal.updateJenis.input,
                      jenis:{
                        ...this.state.modal.updateJenis.input.jenis,
                        dataSaved: dataSaved_parse
                      }
                    }
                  }
                }
              })
          }
      })

  }


  handleSaveUpdateUserCompany(){
      let arr_ele_empty:any = [];

      Object.keys(this.obj_updateUserCompany).forEach((ele,idx)=>{

          if (typeof this.obj_updateUserCompany[ele] == 'object'){
              // OBJECT {}
              if (!Array.isArray(this.obj_updateUserCompany[ele]))
              {
                  if (Object.keys(this.obj_updateUserCompany[ele]).length == 0)
                  {
                      if (ele == 'user'){
                        arr_ele_empty.push("User");
                      }
                  }
              }
              // Jika company kosong dianggap hapus semua company untuk user terkait
          }
          else 
          if (this.obj_updateUserCompany[ele] == "" || 
              this.obj_updateUserCompany[ele] == null)
          {
              if (ele == 'user'){
                arr_ele_empty.push("User")
              }
          }
      })

      if (arr_ele_empty.length > 0)
      {
          notify('error', joinWithCommaNSuffixAnd(arr_ele_empty)  + ' can\'t be empty !')
        
          return
      }

      let created_user = '';
      try {
          created_user = CryptoJS.AES.decrypt(localStorage.getItem("BESTUSRP"),encryptCode).toString(CryptoJS.enc.Utf8);
      }catch(e){
          created_user = ''
      }
      this.obj_updateUserCompany = {
          ...this.obj_updateUserCompany,
          "created_user": created_user
      }

      let obj_updateUserCompany_ParseApi = {
          "user": JSON.stringify(this.obj_updateUserCompany?.['user']),
          "company": JSON.stringify(this.obj_updateUserCompany?.['company']),
          "created_user": created_user,
          "active": this.obj_updateUserCompany?.['active']
      }

      // alert(JSON.stringify(this.obj_updateUserCompany))

      this.changePWD_ShowForm(true, true, 'updateUserCompany');
      
      getApiSync(URL_API_LiVE + "/usercompany/update", null, null
                , {...obj_updateUserCompany_ParseApi}
                , 'application/x-www-form-urlencoded'
                , "POST"
      ).then((result)=>{
          if (result?.['status'].toLowerCase() == 'failed')
          {
              notify('error', result?.['message'])
              setTimeout(()=>{
                this.changePWD_ShowForm(true, false, 'updateUserCompany')
                setTimeout(()=>{
                  try{
                    this.userNameInput.focus();
                  }catch(e){}
                },100)
              },1500)
          }
          else
          {
              notify('success', "Data Saved !")
              
              this.obj_updateUserCompany = {
                  user: {},
                  company: [],
                  created_user: '',
                  active: false
              }

              setTimeout(()=>{
                this.changePWD_ShowForm(false, false, 'updateUserCompany')
              },2000)
          }
      })

  }

  handleSaveUpdateJenis(){

      let arr_ele_empty:any = []

      let username:any = localStorage.getItem("BESTUSR");
      if (typeof username != 'undefined' && username != null){
          try{
              username = CryptoJS.AES.decrypt(username, encryptCode).toString(CryptoJS.enc.Utf8);
          }catch(e){
              username = null
          }
      }

      if (typeof username == 'undefined' || username == null){
          notify('error', `Username is not identified from storage.\nTry to Login again !`)
          return
      }

      let obj_updateJenis = {};
      obj_updateJenis = { 
          username,
          tanggal: this.state.modal.updateJenis.input.dateSelected,
          company: this.state.modal.updateJenis.input.company.value?.['value'],
          tangki: this.state.modal.updateJenis.input.tangki.value?.['value'],
          jenis: this.state.modal.updateJenis.input.jenis.value?.['value']
      }

      try {
        obj_updateJenis["tanggal"] = formatDate(new Date(obj_updateJenis["tanggal"]),'YYYY-MM-DD')
      }catch(e){
        obj_updateJenis["tanggal"] = ""
      }

      Object.keys(obj_updateJenis).forEach((ele,idx)=>{
          if (obj_updateJenis[ele] == "" || 
              obj_updateJenis[ele] == null){
              if (ele == 'tanggal'){
                arr_ele_empty.push("Tanggal")
              }
              if (ele == 'company'){
                arr_ele_empty.push("Company")
              }
              if (ele == 'tangki'){
                arr_ele_empty.push("Tangki")
              }
              if (ele == 'jenis'){
                arr_ele_empty.push("Jenis")
              }
          }
      })

      if (arr_ele_empty.length > 0)
      {
        // notify('error', arr_ele_empty.join(", ").replace(/, ([^,]*)$/, ' and $1') 
        //       + ' can\'t be empty !')
        notify('error', joinWithCommaNSuffixAnd(arr_ele_empty)  + ' can\'t be empty !')
        
        return
      }


      this.changePWD_ShowForm(true, true, 'updateJenis');
      
      getApiSync(URL_API_LiVE + "/update/jenis", null, null, {
                ...obj_updateJenis
              }, 'application/x-www-form-urlencoded'
              ,"POST"
      )
      .then((result)=>{
          if (typeof result?.['status'] != 'undefined' &&
              result?.['status'] != null)
          {
              if (result?.['status'].toString().toLowerCase() == 'failed')
              {
                  notify('error', result?.['message'])
                  setTimeout(()=>{
                    this.changePWD_ShowForm(true, false, 'updateJenis')
                    // setTimeout(()=>{
                      // try{
                      //   this.userNameInput.focus();
                      // }catch(e){}
                    // },100)
                  },1500)
              }
              else
              {
                  notify('success', "Data Saved !")
                  
                  obj_updateJenis = {
                      username,
                      tanggal: '',
                      company: '',
                      tangki: '',
                      jenis: ''
                  }
    
                  setTimeout(()=>{
                    this.changePWD_ShowForm(false, false, 'updateJenis')
                  },2000)
              }

          }
      })

  }

  handleSavePassword(){

      let arr_ele_empty:any = []

      Object.keys(this.obj_password).forEach((ele,idx)=>{
          if (this.obj_password[ele] == ""){
              if (ele == 'oldPass'){
                arr_ele_empty.push("Current")
              }
              if (ele == 'newPass'){
                arr_ele_empty.push("New")
              }
              if (ele == 'confirmNewPass'){
                arr_ele_empty.push("Confirm New")
              }
          }
      })
  
      if (arr_ele_empty.length > 0){

        // notify('error', arr_ele_empty.join(", ").replace(/, ([^,]*)$/, ' and $1') 
              // + ' Password can\'t be empty !')
        notify('error', joinWithCommaNSuffixAnd(arr_ele_empty) + ' Password can\'t be empty !')
        
        return
      }

      if (this.obj_password?.['newPass'] != this.obj_password?.['confirmNewPass'])
      {

        notify('error', 'New and Confirm Password are not match !')

        setTimeout(()=>{
          this.changePWD_ShowForm(true, false,'changePWD')
        },1500)

        return 
      }

      this.setState({
          ...this.state,
          modal:{
              ...this.state.modal,
              changePWD:{
                  ...this.state.modal.changePWD,
                  loader: true
              }
          }
      })

      let username = localStorage.getItem("BESTUSRP")
      if (username != null){

          let dec_username = CryptoJS.AES.decrypt(username, encryptCode).toString(CryptoJS.enc.Utf8);
          let enc_pass = CryptoJS.AES.encrypt(this.obj_password?.['oldPass'],encryptCode).toString();
          let enc_newpass = CryptoJS.AES.encrypt(this.obj_password?.['newPass'],encryptCode).toString();
          let enc_chiper = CryptoJS.AES.encrypt("!otTIS88jkT",encryptCode).toString()

          // console.log(dec_username)
          // let dec_pass = CryptoJS.AES.decrypt(enc_pass,'!otTIS88jkT').toString(CryptoJS.enc.Utf8);
          // console.log(dec_pass)

          // console.log(enc_pass)
          // console.log(enc_chiper)

          // CEK APAKAH PASSWORD DAN USERNAME VALID
          getApiSync(URL_API_LiVE + "/login/check", null, null, {
                  "username":dec_username,
                  "password":enc_pass,
                  "chiper_code":enc_chiper
              }, 'application/x-www-form-urlencoded'
              ,"POST"
          )
          .then((result)=>{
              if (result?.['status'].toLowerCase() == 'failed')
              {
                  notify('error', result?.['message'])
                  setTimeout(()=>{
                    this.changePWD_ShowForm(true, false, 'changePWD')
                    setTimeout(()=>{
                        try {
                          this.passwordInput.focus()
                        }catch(e){}
                    },100)
                  },1500)
              }
              else if (result?.['status'].toLowerCase() == 'success')
              {
                  getApiSync(URL_API_LiVE + "/login/changepwd", null, null, {
                          "username":dec_username,
                          "password":enc_newpass
                          // "chiper_code":enc_chiper
                      }, 'application/x-www-form-urlencoded'
                      ,"POST"
                  ).then((result)=>{
                      if (result?.['status'].toLowerCase() == "success"){
                          notify('success', "Data Saved !")
                          
                          this.obj_password = {
                              oldPass: '',
                              newPass: '',
                              confirmNewPass: ''
                          }

                          setTimeout(()=>{
                            this.changePWD_ShowForm(false, false, 'changePWD')
                          },2000)
                      }
                      else{
                          notify('error','Data failed to save !')
                          setTimeout(()=>{
                            this.changePWD_ShowForm(true, false, 'changePWD')
                          },1500)
                      }
                  })
              }
              
          })
      }

      
  }

  handleValueChangeProfileTangki(event:any, attr: 'tinggi_profile'){
      let formattedValue = event?.['formattedValue']; // ex: "1,234.99"
      let floatValue = event?.['floatValue'] ?? 0; // ex: 1234.99
      let value = event?.['value'];   // ex: "1234.99"

      this.setState({
        ...this.state,
        modal:{
          ...this.state.modal,
          updateProfileTangki: {
            ...this.state.modal.updateProfileTangki,
            input:{
              ...this.state.modal.updateProfileTangki.input,
              tinggi_profile:{
                  ...this.state.modal.updateProfileTangki.input.tinggi_profile,
                  value: floatValue
              }
            }
          }
        }
      })

      // setTimeout(()=>{
      //   console.log(this.state.modal.updateProfileTangki.input)
      // })
  }

  handleCreateNewUser(event:any, attr: 'newUser'|'newPass'|'confirmNewPass')
  {
      let val = event.target.value;
        
      if (attr == 'newUser')
      {
        this.obj_createUser = {
            ...this.obj_createUser,
            'newUser': val
        }
      }
      else
      if (attr == 'newPass'){
        this.obj_createUser = {
            ...this.obj_createUser,
            'newPass': val
        }
      }
      else
      if (attr == 'confirmNewPass'){
        this.obj_createUser = {
            ...this.obj_createUser,
            'confirmNewPass': val
        }
      }
  }

  handleChangePassword(event:any, attr:'oldPass'|'newPass'|'confirmNewPass'){

    let val = event.target.value;

    if (attr == 'oldPass')
    {
      this.obj_password = {
          ...this.obj_password,
          'oldPass': val
      }
    }
    else
    if (attr == 'newPass'){
      this.obj_password = {
          ...this.obj_password,
          'newPass': val
      }
    }
    else
    if (attr == 'confirmNewPass'){
      this.obj_password = {
          ...this.obj_password,
          'confirmNewPass': val
      }
    }
  }


  funcScrollIntoView(refScroll:any){
      // fungsi untuk scroll ke suatu element
      if (typeof refScroll != 'undefined' && refScroll != null){
          refScroll.scrollIntoView();
      }
  }

  // searchparams:any = [
  //   ['sort', 'date'],
  //   ['order', 'newest']
  // ]
  searchparams:any = {sort:'date', order:{tes:'1', tes2: 'halo'}}


  handleClickBoxInfo(tangki_name:any) {
      // alert(tangki_name)
      if (this.intervalBox?.[tangki_name]){
          clearInterval(this.intervalBox?.[tangki_name]);
      }

      if (this.state.realtime?.[tangki_name]?.['showBoxInfo']){
          this.setState({
              ...this.state,
              realtime:{
                  ...this.state.realtime,
                  [tangki_name]: {
                      ...this.state.realtime?.[tangki_name],
                      showBoxInfo: false
                  }
              }
          })

          setTimeout(()=>{
              let max_angka_volume = this.state?.['realtime'][tangki_name]?.['volume'];
              let max_angka_suhu = this.state?.['realtime'][tangki_name]?.['suhu'];
              let max_angka_tinggi = this.state?.['realtime'][tangki_name]?.['tinggi'];
    
              // VOLUME CARD TANGKI
              let objCounter_volume = document.getElementById("angka-id-card-volume-" + tangki_name);
              this.counterNumber(objCounter_volume, 0, max_angka_volume, 1000, 'kg', false, 'Volume : ', 2)
              
              // SUHU CARD TANGKI
              let objCounter_suhu = document.getElementById("angka-id-card-suhu-" + tangki_name);
              this.counterNumber(objCounter_suhu, 0, max_angka_suhu, 1000, '°C', false, 'Suhu : ', 2)
    
              // TINGGI CARD TANGKI
              let objCounter_tinggi = document.getElementById("angka-id-card-tinggi-" + tangki_name);
              this.counterNumber(objCounter_tinggi, 0, max_angka_tinggi, 1000, 'Cm', false, 'Tinggi : ', 3)
          },100)

      }else{
          this.setState({
              ...this.state,
              realtime:{
                  ...this.state.realtime,
                  [tangki_name]: {
                      ...this.state.realtime?.[tangki_name],
                      showBoxInfo: true
                  }
              }
          })

          this.intervalShowHideBox(tangki_name);
      }

  }

  handleChangeSwitchChecked = (valCheck) => {
    
      this.setState({
        ...this.state,
        modal:{
          ...this.state.modal,
          updateUserCompany:{
              ...this.state.modal.updateUserCompany,
              checked_user_active: valCheck
          }
        }
      })

      this.obj_updateUserCompany = {
          ...this.obj_updateUserCompany,
          'active': valCheck ? true : false
      }

  }

  
  render(){
      
      return (
            <div className='dashboard-tangki-main-container'>
              
                <div className='dash-tangki-floating'>
                    <FloatingMenu
                        slideSpeed={500}
                        spacing={8}
                        direction={Directions.Up}
                        isOpen={this.state.floatingMenu.isOpen}
                    >
                        <MainButton
                            iconResting={<FontAwesomeIcon icon={faRoute} />}
                            iconActive={<FontAwesomeIcon icon={faClose} />}
                            background='#ffffff10'
                            onClick={()=>{
                                this.setState({...this.state, 
                                  floatingMenu:{
                                      ...this.state.floatingMenu,
                                      isOpen: !this.state.floatingMenu.isOpen
                                  }
                                })
                            }}
                            size={40}
                        />

                        <ChildButton
                            icon={<img title="Volume" src = {WeightTank} width="25" height="25" />}
                            background='#ffffff10'
                            size={40}
                            onClick={()=>this.funcScrollIntoView(this.refScroll_Volume)}
                        />

                        <ChildButton
                            icon={<img title="Suhu" src = {TermSensor} width="25" height="25" />}
                            background='#ffffff10'
                            size={40}
                            onClick={()=>this.funcScrollIntoView(this.refScroll_Suhu)}
                        />

                        <ChildButton
                            icon={<img title="Tinggi Isi" src = {Tank} width="25" height="25" />}
                            background='#ffffff10'
                            size={40}
                            onClick={()=>this.funcScrollIntoView(this.refScroll_Tinggi)}
                        />

                        <ChildButton
                            icon={<img title="Card" src = {CardHeadingBootstrap} width="25" height="25" />}
                            background='#ffffff10'
                            size={40}
                            onClick={()=>this.funcScrollIntoView(this.refScroll_Card)}
                        />

                    </FloatingMenu>
                </div>

                {/* <div className='tesfontawesome-css'>
                   <FontAwesomeIcon icon = {faShoppingCart} size = "3x" />
                </div> */}

                {/* <div className='progress'>
                    <div className='progress-bar bg-success progress-bar-striped' 
                          style = {{width:'75%'}}
                          role="progressbar" data-width="50%" 
                    > 
                      </div>
                </div> */}


                {/* <PanggilToast ref={(response)=>(this.componentRef = response)} /> */}

                {/* <ReactToPrint
                  trigger={()=>{
                    return <a href="#">Print this out !</a>;
                  }}
                  content={()=>this.componentRef}
                /> */}

              <ToastContainer 
                draggable
                pauseOnHover
              />

              {/* <ToastContainer 
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
              /> */}

              {/* <button onClick={()=>this.fungsi()}> Click </button> */}
              {/* <TimeRange
                  startMoment={this.state.startTime}
                  endMoment={this.state.endTime}
                  onChange={this.returnFunction}
              /> */}
              {/* <Row className='mt-5'>
                    <Col>
                      
                            <div className='d-flex justify-content-center'>
                                <button className='btn btn-sm btn-block btn-primary'
                                    onClick={()=>this.buttonPlus()}>Click sini</button>
                                    
                            </div>
                      
                    </Col>
              </Row> */}

                {/* <Container className='dashtangki-contain-wrapper' fluid> */}
              

                
                    <div className='dashtangki-contain-wrapper'
                            ref={(input)=>this.refScroll_Card=input}>

                        <div className='dashtangki-subcontain'>
                                <div className='header-banner'>
                                      {/* <img src={BlueWavyCurve} 
                                          className='header-banner-img'/> */}
                                </div>
                                <Row className='dashtangki-row-1'>
                                    <Col>
                                        <Row>
                                            <Col className='d-flex justify-content-between'>
                                                <h3 className='dashtangki-page-title'>
                                                    <HamburgerMenu />
                                                    <span className='bg-gradient-primary dashtangki-mdi-span ms-3'>
                                                        <Icon path={mdiChartBarStacked} size={1} color= "white"/>
                                                    </span>
                                                    Dashboard

                                                    {/* <div>
                                                      <Link to = {{
                                                          pathname:'/dashboard/tangki/maps',
                                                          search: `?${createSearchParams(this.searchparams)}`
                                                      }}>Click maps</Link>
                                                    </div> */}

                                                    {/* <span className='ms-5' id = "angka-id"> Angka </span> */}
                                                </h3>

                                                <div className='d-flex align-items-center'>
                                                  <span className='dash-welcome-title'>{`${this.user_title  }`}</span>

                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="secondary" id = "dropdown-basic-user">
                                                            <span className='dashboard-dropdown-basic-user-fauser'>
                                                                <FontAwesomeIcon icon = {faUser} />
                                                            </span>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>

                                                            <Dropdown.Header className='text-right login-dropdown-header-container'>
                                                                <span className='login-dropdown-header'>{`${this.user_level}`}</span>
                                                            </Dropdown.Header>

                                                            {/* {
                                                                this.user_level != 'USER' &&
                                                                this.user_level != '' &&  */}
                                                                <div className='dash-link-dropdown' onClick={()=>this.handleClick_ChangePWD(true,'updateJenis')}>
                                                                    <FontAwesomeIcon icon = {faClone} className='login-dropdown-icon' color={'navy'} />
                                                                    <span className='login-dropdown-content'>Update Jenis</span>
                                                                </div>
                                                            {/* } */}

                                                            {
                                                                this.user_level != 'USER' &&
                                                                this.user_level != '' && 
                                                                <div className='dash-link-dropdown' onClick={()=>this.handleClick_ChangePWD(true,'updateUserCompany')}>
                                                                    <FontAwesomeIcon icon = {faBuildingUser} className='login-dropdown-icon' color={'navy'} />
                                                                    <span className='login-dropdown-content'>Update User Company</span>
                                                                </div>
                                                            }

                                                            {
                                                                this.user_level != 'USER' &&
                                                                this.user_level != '' && 
                                                                <div className='dash-link-dropdown' onClick={()=>this.handleClick_ChangePWD(true,'updateProfileTangki')}>
                                                                    <FontAwesomeIcon icon = {faPenToSquare} className='login-dropdown-icon' color={'navy'} />
                                                                    <span className='login-dropdown-content'>Update Profile Tangki</span>
                                                                </div>
                                                            }

                                                            {
                                                                this.user_level != 'USER' &&
                                                                this.user_level != '' && 
                                                                <div className='dash-link-dropdown' onClick={()=>this.handleClick_ChangePWD(true,'createUser')}>
                                                                    <FontAwesomeIcon icon = {faUserPlus} className='login-dropdown-icon' color={'darkgreen'} />
                                                                    <span className='login-dropdown-content'>Create User</span>
                                                                </div>
                                                            }
                                                            
                                                            <div className='dash-link-dropdown' onClick={()=>this.handleClick_ChangePWD(true,'changePWD')}>
                                                                <FontAwesomeIcon icon = {faKey} className='login-dropdown-icon' color={'darkgreen'} />
                                                                <span className='login-dropdown-content'>Change Password</span>
                                                            </div>

                                                            <Dropdown.Divider />
                                                            <Link to = "/login" onClick={this.handleLogOut} className='dash-link-dropdown dash-link-logout'>  
                                                              {/* <Dropdown.Item> */}
                                                                <FontAwesomeIcon icon = {faPersonRunning} className='login-dropdown-icon' color={'red'} />
                                                                <span className='login-dropdown-content'>Log Out</span>
                                                              {/* </Dropdown.Item> */}
                                                            </Link>
                                                            
                                                        </Dropdown.Menu>
                                                    </Dropdown>

                                                </div>
                                            </Col>
                                        </Row>

                                      {/* MAPS ICON*/}

                                        <Row className='mt-5 mb-2 '>
                                            <Col className='px-2'>

                                                <div className='d-flex flex-column flex-md-row align-items-end align-items-md-center justify-content-md-between'>
                                                    <div className='d-flex align-items-center flex-row flex-wrap gap-2 w-100'>

                                                        <div className='dash-multi-select-custom-props'>

                                                              <MultiSelect
                                                                className='multi-select-filter-company cardtop'
                                                                options={this.options_filter_company}
                                                                value={this.state.filter_company}
                                                                hasSelectAll={false}  
                                                                onChange={(e)=>this.onChangeSelectMultiComponent(e)}
                                                                labelledBy="Select"
                                                              />
                                                            {/* <Select options={this.options_filter} 
                                                                isMulti
                                                                placeholder="Company..."
                                                                closeMenuOnSelect={false}
                                                                className="select-class-filter-company"
                                                                components={animatedComponents}
                                                                // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                                                tabSelectsValue={false} 
                                                                isClearable={true}
                                                                onChange={(e, {action})=>this.onChangeSelectMulti(e, action)}
                                                            /> */}

                                                        </div>

                                                        <div className='flex-grow-1 flex-md-grow-0'>
                                                            <button className='btn btn-sm btn-outline-primary mediaClassFilterMultiCompany' 
                                                                onClick={()=>this.clickFilterCompany()}
                                                                disabled={this.state.filter_company.length > 0 ? false : true}>Filter</button>
                                                        </div>
                                                    </div>

                                                    <div className='dashtangki-iconmap'>
                                                        {
                                                            this.state.show.iconmap && 
                                                              <Link to = {{
                                                                    pathname: '/dashboard/tangki/maps'
                                                              }}>
                                                                  <FontAwesomeIcon title="Map" icon={faMapLocationDot} color='navy' className='iconMap'
                                                                  />
                                                              </Link>
                                                        }
                                                    </div>
                                                  
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* <Row className='mt-5'>
                                            <Col>
                                                <div><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div>
                                            </Col>
                                        </Row> */}

                                        
                                        <Row className='mt-3 d-flex flex-nowrap customclass-snap'>
                                              {
                                                  // this.mst_list_tangki.map((ele, idx)=>{
                                                  this.state?.['mst_list_tangki'].length > 0 && 
                                                  this.state?.['mst_list_tangki'].map((ele, idx)=>{
                                                    return (
                                                      <Col className='snap-col' key={ele.name} style={{marginBottom:'0px', 
                                                            marginRight:`${idx > 0}` ? '-10px' : '0px'
                                                          }}
                                                      >
                                                          
                                                          <Card className={`${ele.bgColor} dash-card`} style = {{height:'95%'}}
                                                                >

                                                              <Card.Body className='mb-3 dash-card-realtime'>
                                                                  <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                                  <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                                      <div>
                                                                          {
                                                                            // typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' 
                                                                            ele?.['title']
                                                                            + 
                                                                              (
                                                                                !this.state.realtime?.[ele.name]?.['sensor_off'] && 
                                                                                typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' &&
                                                                                this.state.realtime?.[ele.name]?.['jenis'] != null 
                                                                              ? ' (' + this.state.realtime?.[ele.name]?.['jenis'] + ')'
                                                                              : '')
                                                                            }
                                                                      </div>
                                                                      {/* <Icon path={mdiChartLine} size = {1} className="float-right" /> */}
                                                                      <div className='icon-info' onClick={()=>{this.handleClickBoxInfo(ele.name)}}>
                                                                          <Icon path={mdiInformationOutline} size = {1} className="icon-subinfo float-right" />
                                                                      </div>
                                                                  </h4>
                                                                  <div className  ='dashtangki-subtitle-card mb-3'>
                                                                      {
                                                                          typeof this.state.realtime?.[ele.name] != 'undefined' &&
                                                                          (!this.state.realtime?.[ele.name]?.['sensor_off'] &&
                                                                              typeof this.state.realtime?.[ele.name]?.['tanggal_jam'] != 'undefined' && 
                                                                              this.state.realtime?.[ele.name]?.['tanggal_jam'] != '' &&
                                                                              this.state.realtime?.[ele.name]?.['tanggal_jam'] != null 
                                                                              ?
                                                                              
                                                                                <span className='dashtangki-subtitle text-white'>
                                                                                      ({this.state.realtime?.[ele.name]?.['tanggal_jam']})
                                                                                </span>
                                                                              :
                                                                                <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                                </div>
                                                                          )
                                                                      }
                                                                  </div>

                                                                  {
                                                                    typeof this.state.realtime?.[ele.name] != 'undefined' &&
                                                                      (this.state.realtime?.[ele.name]?.['sensor_off'] && 
                                                                        (
                                                                            <div style={{position:'relative', zIndex:2}} className="sensor-off-label">
                                                                                <img src = {WarningIcon} width={35} height = {35}
                                                                                    />
                                                                                <h4 style = {{zIndex:3}}>Sensor Off</h4>
                                                                                <img src = {WarningIcon} width={35} height = {35}
                                                                                  style = {{transform:'rotateY(180deg)'}}
                                                                                    />
                                                                            </div>
                                                                        )
                                                                      )
                                                                  }

                                                                  
                                                                    {/* {
                                                                      (
                                                                        <>
                                                                          <div className='d-flex justify-content-start border border dark'>
                                                                              <div className='d-flex align-items-center border border-danger gap-1'>
                                                                                  <NumberAnimate key={idx} angka={this.state.numberAnimate}/>
                                                                                  <div style={{zIndex:10, fontWeight:'500', fontSize:'20px'}} className='text-white'>kg</div>
                                                                              </div>
                                                                          </div>
                                                                        </>
                                                                      )
                                                                    } */}
                                                                    
                                                                  
                                                                  {
                                                                    typeof this.state.realtime?.[ele.name] != 'undefined' &&
                                                                    (!this.state.realtime?.[ele.name]?.['sensor_off'] && 
                                                                      !this.state.realtime?.[ele.name]?.['showBoxInfo'] &&
                                                                      (
                                                                        <div style={{position:'relative', zIndex:2}}>
                                                                          <h4 className='text-white' id={'angka-id-card-tinggi-' + ele.name}>Tinggi : - Cm</h4>
                                                                          <h4 className='text-white' id={'angka-id-card-suhu-' + ele.name}>Suhu : - °C</h4>
                                                                          <h4 className='text-white' id={'angka-id-card-volume-' + ele.name}>Volume : - kg</h4>
                                                                        </div>
                                                                      )
                                                                    )
                                                                  }

                                                                  {/* <h4 className='text-white' id={'angka-id-card-tinggi-' + ele.name}>Tinggi : {this.state.realtime?.[ele.name].tinggi} M</h4> */}
                                                                  {/* <h4 className='text-white' id={'angka-id-card-suhu-' + ele.name}>Suhu : {this.state.realtime?.[ele.name].suhu} °C</h4> */}
                                                                  {/* <h4 className='text-white' id={'angka-id-card-volume-' + ele.name}>Volume : { this.state.realtime?.[ele.name].volume != "-" ? new Number(this.state.realtime?.[ele.name].volume).toLocaleString('en-us') : '-'} kg</h4> */}

                                                                  {
                                                                    typeof this.state.realtime?.[ele.name] != 'undefined' &&
                                                                    (!this.state.realtime?.[ele.name]?.['sensor_off'] && 
                                                                      this.state.realtime?.[ele.name]?.['showBoxInfo'] &&
                                                                      (
                                                                        <div key={ele.name} className={`${ele.name}`}>
                                                                            <div className='box-info-1'>
                                                                              
                                                                              {/* BOX 1 (TINGGI PROFILE -> VOLUME LITER) */}
                                                                                <div className='box-subinfo-1'>

                                                                                    <div className='box-subsubinfo-1 box-show'>
                                                                                        <h6 className='label-subinfo text-white'> <u>Tinggi Profile </u></h6>
                                                                                        <h6 className='label-subinfo-2'>{
                                                                                            this.state.realtime?.[ele.name]?.['tinggi_profile'] ?
                                                                                              this.state.realtime?.[ele.name]?.['tinggi_profile'] + ' Cm'
                                                                                              : '- Cm'
                                                                                          }
                                                                                        </h6>
                                                                                    </div>

                                                                                    <div className='box-subsubinfo-2'>
                                                                                        <h6 className='label-subinfo text-white'> <u>Berat Jenis </u></h6>
                                                                                        <h6 className='label-subinfo-2'>{
                                                                                            this.state.realtime?.[ele.name]?.['volume_berat_jenis'] ? 
                                                                                              this.state.realtime?.[ele.name]?.['volume_berat_jenis'] + ' gr/ml'
                                                                                              : '- gr/ml'
                                                                                          } 
                                                                                        </h6>
                                                                                    </div>

                                                                                </div>

                                                                                {/* BOX 2 (BEDA LITER -> INI LITER) */}
                                                                                <div className='box-subinfo-2'>

                                                                                    <div className='box-subsubinfo-1 box-show'>
                                                                                        <h6 className='label-subinfo text-white'> <u>Volume Tabel </u></h6>

                                                                                        <h6 className='label-subinfo-2'>
                                                                                          {
                                                                                            !isNaN(this.state.realtime?.[ele.name]?.['volume_prev']) ? 
                                                                                              new Number(this.state.realtime?.[ele.name]?.['volume_prev']).toLocaleString('en-US') + ' kg'
                                                                                              : '- kg'
                                                                                          }
                                                                                        </h6>
                                                                                    </div>

                                                                                    <div className='box-subsubinfo-2'>
                                                                                        <h6 className='label-subinfo text-white'> <u>Faktor Koreksi </u></h6>
                                                                                        <h6 className='label-subinfo-2'>
                                                                                            {
                                                                                            !isNaN(this.state.realtime?.[ele.name]?.['volume_faktor_koreksi']) ? 
                                                                                              this.state.realtime?.[ele.name]?.['volume_faktor_koreksi']
                                                                                              : '-'
                                                                                            }
                                                                                        </h6>
                                                                                    </div>

                                                                                </div>
                                                                            </div>

                                                                            <div className='box-info-2'>
                                                                                <div className='box-subinfo-1'>
                                                                                    
                                                                                    <div className='box-subsubinfo-1 box-show'>
                                                                                        <h6 className='label-subinfo text-white'> <u>Beda Liter </u></h6>
                                                                                        <h6 className='label-subinfo-2'>
                                                                                            {
                                                                                              !isNaN(this.state.realtime?.[ele.name]?.['beda_liter']) ? 
                                                                                                new Number(this.state.realtime?.[ele.name]?.['beda_liter']).toLocaleString('en-US') + ' kg'
                                                                                                : '- kg'
                                                                                            }
                                                                                        </h6>
                                                                                    </div>

                                                                                    <div className='box-subsubinfo-2'>
                                                                                        <h6 className='label-subinfo text-white'> <u>Max Tangki </u></h6>
                                                                                        <h6 className='label-subinfo-2'>
                                                                                            {
                                                                                              !isNaN(this.state.realtime?.[ele.name]?.['max_tangki']) ? 
                                                                                                new Number(this.state.realtime?.[ele.name]?.['max_tangki']).toLocaleString('en-US') + ' kg'
                                                                                                : '- kg'
                                                                                            }
                                                                                        </h6>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        // ... end show box info

                                                                      )
                                                                    )
                                                                  }

                                                                  <div className='d-flex justify-content-end dash-card-company'>

                                                                      <div className={`ribbon ${ele.bgColor}`}></div>

                                                                      <span>{ele?.['company']}</span>
                                                                  </div>

                                                              </Card.Body>
                                                          </Card>
                                                      </Col>
                                                      )
                                                  })
                                              }
                                        </Row>

                                        {/* <Row className='mt-1 d-flex flex-nowrap customclass-snap'>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-danger'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 1
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                            {
                                                              typeof this.state.realtime?.['tangki_1']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_1']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_1']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_1']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                            }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_1.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_1.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_1.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-info'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 2
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                            {
                                                              typeof this.state.realtime?.['tangki_2']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_2']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_2']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_2']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                            }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_2.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_2.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_2.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-success'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 3
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                            {
                                                              typeof this.state.realtime?.['tangki_3']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_3']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_3']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_3']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                            }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_3.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_3.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_3.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-warning'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 4
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                          {
                                                              typeof this.state.realtime?.['tangki_4']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_4']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_4']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_4']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                          }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_4.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_4.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_4.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                        </Row> */}

                                        <Row className='mt-4'>
                                            <div className='d-flex flex-column flex-md-row '>

                                                <div className='width-tinggi-isi class-col-totalcpopko'>

                                                    <div className='card card-total-1 l-bg-blue'>
                                                          <div className='card-statistic-3 p-4'>

                                                              <div className='card-icon card-icon-large'>
                                                                  <FontAwesomeIcon icon = {faOilWell} className='class-fa-shop' />
                                                              </div>  

                                                              <div className='mb-4'>

                                                                  <div className='row mb-3'>
                                                                      <h5>Total CPO</h5>
                                                                  </div>

                                                                  <div className='row'>
                                                                      <div className='col-8'>
                                                                          <h4 className='d-flex align-items-center mb-2 dash-tangki-font-num' id='angka-id-cpo'>
                                                                              {/* {this.state.total?.['CPO'] ? 
                                                                                  new Number(this.state.total?.['CPO']).toLocaleString('en-US') 
                                                                                  : '-'} kg */}
                                                                          </h4>
                                                                      </div>
                                                                      <div className='col-4 d-flex justify-content-end align-items-end'>
                                                                          <h5 style = {{fontStyle:'italic', opacity:1, zIndex: 1}} className='dash-tangki-font-percent'
                                                                                id='angka-id-percent-cpo'>
                                                                              {/* {this.state?.['total_percent']?.['CPO']} % */}
                                                                          </h5>
                                                                      </div>
                                                                  </div>

                                                                  <div>
                                                                      <div className='progress' >
                                                                          <div className='progress-bar l-bg-green' role='progressbar'
                                                                                id="progress-bar-custom-width-cpo"
                                                                                aria-valuemin={0} aria-valuemax={100}
                                                                                // style = {{width:`${this.state?.['total_percent']?.['CPO']}%`}}
                                                                            >
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>


                                                          </div>
                                                    </div>

                                                    <div className='card card-total-2 l-bg-cherry'>
                                                          <div className='card-statistic-3 p-4'>
                                                              <div className='card-icon card-icon-large'>
                                                                  <FontAwesomeIcon icon = {faLayerGroup} className='class-fa-shop' />
                                                              </div>  

                                                              <div className='mb-4'>
                                                                  <h5>Total PKO</h5>
                                                              </div>

                                                              <div className='row'>
                                                                  <div className='col-8'>
                                                                      <h4 className='d-flex align-items-center mb-2 dash-tangki-font-num' id='angka-id-pko'>
                                                                          {/* {this.state.total?.['PKO'] ? new Number(this.state.total?.['PKO']).toLocaleString('en-US') : '-'} kg */}
                                                                      </h4>
                                                                  </div>
                                                                  <div className='col-4 d-flex justify-content-end align-items-end'>
                                                                      <h5 style = {{fontStyle:'italic', opacity:1, zIndex: 1}} className='dash-tangki-font-percent'
                                                                              id='angka-id-percent-pko'>
                                                                            {/* {this.state?.['total_percent']?.['PKO']} % */}
                                                                      </h5>
                                                                  </div>
                                                              </div>

                                                              <div>
                                                                  <div className='progress'>
                                                                      <div className='progress-bar l-bg-cyan' role='progressbar'
                                                                            id="progress-bar-custom-width-pko"
                                                                            aria-valuemin={0} aria-valuemax={100}
                                                                            // style = {{transition:'all .5s', width:`${this.state?.['total_percent']?.['PKO']}%`}}
                                                                            >
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                    </div>
                                                </div>

                                                <div className='width-suhu-tangki realtime-suhu-tangki-prop pl-3'>
                                                    <h5 className='dashtangki-title'>Suhu Tangki ( °C )</h5>
                                                    {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}
                                                    {this.state.loader.suhu_tangki && 
                                                        (
                                                          <div className='realtime-suhu-tangki-loader'>
                                                              <Col className='d-flex align-items-center justify-content-center w-100 h-100'>
                                                                <ThreeCircles
                                                                      height="100"
                                                                      width="100"
                                                                      color="#4fa94d"
                                                                      wrapperStyle={{}}
                                                                      wrapperClass=""
                                                                      visible={this.state.loader.suhu_tangki}
                                                                      ariaLabel="three-circles-rotating"
                                                                      outerCircleColor="#008ffb"
                                                                      innerCircleColor="#00e396"
                                                                      middleCircleColor="#feb019"
                                                                />
                                                              </Col>
                                                          </div>
                                                        )
                                                    }
                                                    <div className='d-flex justify-content-start flex-nowrap customclass-snap'>

                                                        {
                                                          !this.state.loader.suhu_tangki && 
                                                              this.mst_list_tangki.map((ele,idx)=>{
                                                                return (
                                                                  <div className='snap-col' key = {ele.name}>
                                                                    <ThermometerFC 
                                                                          caption = {
                                                                                ele.title + 
                                                                                (typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' &&
                                                                                this.state.realtime?.[ele.name]?.['jenis'] != null 
                                                                                ? ' (' + this.state.realtime?.[ele.name]?.['jenis'] + ')'
                                                                                : '')
                                                                          } 
                                                                          subcaption2={this.state.realtime?.[ele.name]?.['tanggal_jam']}
                                                                          subcaption={this.state.realtime?.[ele.name]?.['tanggal']} 
                                                                          value={parseFloat(this.state.realtime?.[ele.name]?.['suhu'])}/>
                                                                  </div>
                                                                )
                                                              })
                                                        } 
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </Row>

                                        <Row className='mt-4'>
                                            <div className='d-flex flex-column flex-md-row'>
                                                <div className='width-tinggi-isi'>
                                                    <h5 className='dashtangki-title'>Tinggi Isi Tangki ( Cm )</h5>
                                                    {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}
                                                    <Col>
                                                        
                                                        <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                            {/* <ReactFC
                                                                type="column3d"
                                                                width="100%"
                                                                height="30%"
                                                                dataFormat="JSON"
                                                                dataSource={dataSource}
                                                            /> */}

                                                            {/* <Audio
                                                              height="150"
                                                              width="150"
                                                              color="red"
                                                              ariaLabel="audio-loading"
                                                              wrapperStyle={{}}
                                                              wrapperClass="wrapper-class"
                                                              visible={this.state.loader.tinggi_isi}
                                                            /> */}
                                                            <ThreeCircles
                                                                height="100"
                                                                width="100"
                                                                color="#4fa94d"
                                                                wrapperStyle={{}}
                                                                wrapperClass="classTinggiIsi"
                                                                visible={this.state.loader.tinggi_isi}
                                                                ariaLabel="three-circles-rotating"
                                                                outerCircleColor="#008ffb"
                                                                innerCircleColor="#00e396"
                                                                middleCircleColor="#feb019"
                                                              />

                                                            {/* <Dna
                                                              height = "200"
                                                              width = "200"
                                                              ariaLabel = 'dna-loading'
                                                              wrapperStyle={{}}
                                                              wrapperClass="wrapper-class"
                                                              visible={this.state.loader.tinggi_isi}
                                                            /> */}

                                                            {
                                                              (<div id = "chartdiv" style={{width:"100%", height:"300px",
                                                                opacity:!this.state.loader.tinggi_isi ? 1 : 0}}></div>)
                                                            }
                                                            {/* { 
                                                              !this.state.loader.tinggi_isi &&
                                                                (<div className='w-100 '>
                                                                  <ReactApexChart 
                                                                          options={this.state.chartTinggi.options} 
                                                                          series={this.state.chartTinggi.series} 
                                                                          type="bar" height={350}
                                                                  />
                                                                </div>)
                                                            } */}

                                                        </div>
                                                    </Col>
                                                </div>

                                                <div className='width-volume-isi'>
                                                    <h5 className='dashtangki-title'>Volume Tangki ( kg )</h5>
                                                    {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}

                                                    <Col className='d-flex flex-nowrap customclass-snap h-100'>
                                                        {/* <ReactFC {...this.chartConfigs_Suhu}/>
                                                        <ReactFC {...this.chartConfigs_Suhu}/>
                                                        <ReactFC {...this.chartConfigs_Suhu}/>
                                                        <ReactFC {...this.chartConfigs_Suhu}/> */}

                                                        {
                                                          this.state.loader.volume_isi &&
                                                          (
                                                            <div className='d-flex justify-content-center align-items-center w-100'>
                                                                <ThreeCircles
                                                                    height="100"
                                                                    width="100"
                                                                    color="#4fa94d"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass=""
                                                                    visible={this.state.loader.volume_isi}
                                                                    ariaLabel="three-circles-rotating"
                                                                    outerCircleColor="#008ffb"
                                                                    innerCircleColor="#00e396"
                                                                    middleCircleColor="#feb019"
                                                                />
                                                            </div>
                                                          )
                                                        }

                                                        {
                                                          !this.state.loader.volume_isi &&

                                                            this.mst_list_tangki.map((ele,idx)=>{
                                                              return (
                                                                <div className='snap-col' key = {ele.name}>
                                                                    <CylinderFC
                                                                          caption = {ele.title + 
                                                                                  (typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' &&
                                                                                  this.state.realtime?.[ele.name]?.['jenis'] != null 
                                                                                  ? ' (' + this.state.realtime?.[ele.name]?.['jenis'] + ')'
                                                                                  : '')
                                                                                } 
                                                                          subcaption2={this.state.realtime?.[ele.name]?.['tanggal_jam']}
                                                                          subcaption={this.state.realtime?.[ele.name]?.['tanggal']} 
                                                                          value={this.state.realtime?.[ele.name]?.['volume']} plottooltext_hover="Volume"/>
                                                                </div>
                                                              )
                                                            })
                                                        }
                                                          
                                                        {/* <div className='snap-col'>
                                                            <CylinderFC caption = "Tangki 2" value={4774841.53} plottooltext_hover="Volume"/>
                                                        </div>
                                                        <div className='snap-col'>
                                                            <CylinderFC caption = "Tangki 3" value={0} plottooltext_hover="Volume"/>
                                                        </div>
                                                        <div className='snap-col'>
                                                            <CylinderFC caption = "Tangki 4" value={3028794.28} plottooltext_hover="Volume"/>
                                                        </div> */}

                                                        {/* <ReactFusioncharts
                                                            type="thermometer"
                                                            width="100%"
                                                            height="100%"
                                                            dataFormat="JSON"
                                                            dataSource={dataSource}
                                                          /> */}
                                                    </Col>
                                                </div>
                                            </div>
                                        </Row>

                                        {/* <Row className='mt-3'>
                                          
                                            <Col className='d-flex justify-content-start flex-nowrap customclass-snap'>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                               
                                                <div className='snap-col'>
                                                    <ThermometerFC caption = "Tangki 2" value={50}/>
                                                </div>
                                                <div className='snap-col'>
                                                    <ThermometerFC caption = "Tangki 3" value={80}/>
                                                </div>
                                                <div className='snap-col'>
                                                    <ThermometerFC caption = "Tangki 4" value={25}/>
                                                </div>

                                                <ReactFusioncharts
                                                    type="thermometer"
                                                    width="100%"
                                                    height="100%"
                                                    dataFormat="JSON"
                                                    dataSource={dataSource}
                                                  />
                                            </Col>
                                        </Row> */}

                                        {/* <Row className='mt-4'>
                                            VOLUME (KG) previous
                                        </Row> */}

                                        <Row className='mt-5'>
                                            {/* <hr></hr> */}
                                            <Col> 
                                                <div className='d-flex flex-md-row flex-column justify-content-start align-items-start'> 

                                                    <div className='d-flex justify-content-center filter-css-titles mb-2 mb-md-0'>
                                                        <div className='filter-css-title'>Filter :</div>
                                                        <Select options={this.options_filter} 
                                                            className="select-class filter-date-time"
                                                            components={animatedComponents}
                                                            // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                                            tabSelectsValue={false} isClearable={true}
                                                            onChange={(e, {action})=>this.onChangeSelectFilter(e, action)}
                                                        />
                                                    </div>

                                                    {
                                                      this.state.show.datepicker && 
                                                        <div className='d-flex mb-2 mb-lg-0'>
                                                          <div className='d-block d-md-none filter-css-title'>Tanggal :</div>
                                                          <DatePicker 
                                                            dateFormat="dd MMMM yyyy"
                                                            selected={this.state.dateSelected} 
                                                            onChange={(date) => this.setFilterDate(date, 'filterJam')}
                                                          />
                                                        </div>
                                                    }

                                                    {
                                                      this.state.show.timepicker && 
                                                        // <TimeRange 
                                                        //         onChange={(e)=>{this.onChangeTimePicker(e)}} 
                                                        //         onStartTimeChange={(e)=>{this.onStartTimeClick(e)}}
                                                        //         startMoment={this.state.timeSelected.startMoment} 
                                                        //         endMoment={this.state.timeSelected.endMoment} 
                                                        // />
                                                        <div className='d-flex mb-2 mb-lg-0'>
                                                            <div className='d-block d-md-none filter-css-title'>Waktu :</div>
                                                            <TimeRangePicker 
                                                              locale="id"
                                                              minTime="00:00:00"
                                                              maxTime="23:59:59"
                                                              minutePlaceholder="mm"
                                                              hourPlaceholder="hh"
                                                              required={true}
                                                              openClockOnFocus = {false}
                                                              onChange={(e)=>{this.onChangeTimePicker(e)}} 
                                                              value={this.state.timeSelected}
                                                              onBlur={(e)=>{this.onBlurTimePicker(e)}}/>
                                                        </div>
                                                    }

                                                    <div className=' btn-filter-ml w-100 mb-2 mb-md-0 mt-3 mt-md-0'>
                                                      <button className='btn btn-sm btn-primary mediaClassFilter' onClick={()=>this.clickFilter()}>Filter</button>
                                                    </div>

                                                    <div className='w-100 d-flex justify-content-end align-items-center btn-filter-ml'>
                                                      
                                                      <div className='d-flex custom-btn-print'>
                                                          <ReactToPrint
                                                              content={() => this.componentRef}
                                                              // concept create watermark
                                                              //   const PrintElem = document.createElement('div');
                                                              //   const header = 
                                                              //     `<img src="${Img_Facebook}" alt="" class="watermark"/>` + 
                                                              //     `<div class="page-footer">I'm The Footer</div>`;
                                                              //   PrintElem.innerHTML = header;
                                                              //   return PrintElem;
                                                              // }}
                                                              trigger={() => <button className="btn btn-sm btn-success mediaClassFilter custom-btn-pdf">PDF</button>}
                                                          />

                                                          <div style={{marginLeft:'5px'}} className='custom-btn-excel-parent'>

                                                                <button className=  "btn btn-sm btn-success custom-btn-excel"
                                                                    onClick={this.generateExcel}>Excel</button>

                                                                {/* <ExcelFile filename={'Tangki_' + formatDate(new Date(),'YYYY-MM-DD HH:mm:ss').toString()} element={<button className="btn btn-sm btn-success custom-btn-excel">Excel</button>}>

                                                                    <ExcelSheet data={this.data_Export} name="Result">
                                                                        <ExcelColumn label="Tangki" value="tangki" />
                                                                        <ExcelColumn label="Tanggal" value="tanggal" />
                                                                        <ExcelColumn label="Jenis" value="jenis"/>
                                                                        <ExcelColumn label="Jarak Sensor (m)" value="data_jarak_sensor_m"/>
                                                                        <ExcelColumn label="Suhu 1 (°C)" value="suhu_1_m"/>
                                                                        <ExcelColumn label="Suhu 2 (°C)" value="suhu_3_m"/>
                                                                        <ExcelColumn label="Suhu 3 (°C)" value="suhu_5_m"/>
                                                                        <ExcelColumn label="Suhu 4 (°C)" value="suhu_7_m"/>
                                                                        <ExcelColumn label="Suhu 5 (°C)" value="suhu_10_m"/>
                                                                        <ExcelColumn label="Suhu Average (°C)" value="suhu"/>
                                                                        <ExcelColumn label="Tinggi (Cm)" value="tinggi"/>
                                                                        <ExcelColumn label="Volume (kg)" value="volume"/>

                                                                    </ExcelSheet>
                                                                </ExcelFile> */}
                                                          </div>
                                                      </div>

                                                    </div>


                                                </div>
                                            </Col>

                                            {/* <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m / jam )</h5> */}
                                            {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div> */}
                                        </Row>

                                        <div 
                                              ref={(response)=>this.componentRef=response}>

                                            {/* TINGGI MODUS JAM */}
                                            <Row className='mt-2'>
                                                <hr></hr>
                                                <div className='d-flex flex-nowrap customclass-snap gap-3'>

                                                    <div className='modus-flex'>
                                                        <div className='d-flex justify-content-between'>

                                                            <div className='d-flex justify-content-start align-items-start gap-2'
                                                                    style={{width:'100%'}}>
                                                              <div className='d-flex justify-content-center align-items-start'>
                                                                  <img src = {Tank} width="30" height="30" />
                                                              </div>
                                                              <div className='dashtangki-title-width'>
                                                                {/* MODUS TINGGI */}
                                                                  <h5 className='dashtangki-title'>Tinggi Isi Tangki</h5>
                                                                  <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                                  <div className='d-flex justify-content-end checkbox-shift'>

                                                                      <Form.Check type={'checkbox'}>
                                                                          <Form.Check.Input type={'checkbox'} 
                                                                              onChange={(val)=>{this.checkChartJam(val,'tinggi_modus')}} 
                                                                              defaultChecked={this.state.chartTinggiModusJam.options.dataLabels.enabled}/>
                                                                          <Form.Check.Label className='show-data-label-font'>{`Show Data Label`}</Form.Check.Label>
                                                                          {/* <Form.Control.Feedback type="valid">
                                                                            You did it! 
                                                                          </Form.Control.Feedback> */}
                                                                      </Form.Check>
                                                                  </div>
                                                              </div>
                                                            </div>

                                                            <div>
                                                                    {/* <Form.Check
                                                                      inline
                                                                      label="1"
                                                                      name="group1"
                                                                      type='checkbox'
                                                                      id={`inline-${'1'}-1`}
                                                                    /> */}
                                                                    
                                                            </div>


                                                        </div>
                                                        <Col> 
                                                            <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                              <ThreeCircles
                                                                    height="100"
                                                                    width="100"
                                                                    color="#4fa94d"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass="mb-3"
                                                                    visible={this.state.loader.tinggi_isi_jam}
                                                                    ariaLabel="three-circles-rotating"
                                                                    outerCircleColor="#008ffb"
                                                                    innerCircleColor="#00e396"
                                                                    middleCircleColor="#feb019"
                                                                />

                                                                { 
                                                                    !this.state.loader.tinggi_isi_modus_jam &&
                                                                    this.state.chartTinggiModusJam.statusFound &&
                                                                    <div className='w-100'>
                                                                        <ReactApexChart 
                                                                              options={this.state.chartTinggiModusJam.options} 
                                                                              series={this.state.chartTinggiModusJam.series} 
                                                                              type="area" 
                                                                              height={350} />
                                                                    </div>
                                                                }

                                                                {
                                                                    !this.state.loader.tinggi_isi_modus_jam &&
                                                                    !this.state.chartTinggiModusJam.statusFound &&
                                                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                        <img src = {No_Found} className="nofound-class" />
                                                                        <div className='nofound-label'> No Data Found </div>
                                                                    </div>
                                                                }

                                                                
                                                            </div>
                                                        </Col>
                                                    </div>

                                                    <div className='modus-flex'>

                                                        <div className='d-flex justify-content-between'>

                                                            <div className='d-flex justify-content-start align-items-start gap-2'
                                                                    style={{width:'100%'}}>
                                                              <div className='d-flex justify-content-center align-items-start'>
                                                                  <img src = {TermSensor} width="30" height="30" />
                                                              </div>
                                                              <div className='dashtangki-title-width'>
                                                                {/* MODUS SUHU*/}
                                                                  <h5 className='dashtangki-title'>Suhu Tangki</h5>
                                                                  <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                                  <div className='d-flex justify-content-end checkbox-shift'>

                                                                      <Form.Check type={'checkbox'}>
                                                                          <Form.Check.Input type={'checkbox'} 
                                                                                onChange={(val)=>{this.checkChartJam(val,'suhu_modus')}}
                                                                                defaultChecked={this.state.chartSuhuModusJam.options.dataLabels.enabled}
                                                                          />
                                                                          <Form.Check.Label className='show-data-label-font'>{`Show Data Label`}</Form.Check.Label>
                                                                          {/* <Form.Control.Feedback type="valid">
                                                                            You did it! 
                                                                          </Form.Control.Feedback> */}
                                                                      </Form.Check>
                                                                  </div>
                                                              </div>
                                                            </div>

                                                            <div>
                                                                    {/* <Form.Check
                                                                      inline
                                                                      label="1"
                                                                      name="group1"
                                                                      type='checkbox'
                                                                      id={`inline-${'1'}-1`}
                                                                    /> */}
                                                                    
                                                            </div>


                                                        </div>
                                                        <Col> 
                                                            <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                              <ThreeCircles
                                                                    height="100"
                                                                    width="100"
                                                                    color="#4fa94d"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass=""
                                                                    visible={this.state.loader.tinggi_isi_jam}
                                                                    ariaLabel="three-circles-rotating"
                                                                    outerCircleColor="#008ffb"
                                                                    innerCircleColor="#00e396"
                                                                    middleCircleColor="#feb019"
                                                                />

                                                                { 
                                                                    // !this.state.loader.suhu_tangki_modus_jam &&
                                                                    !this.state.loader.tinggi_isi_jam &&
                                                                    this.state.chartSuhuModusJam.statusFound &&
                                                                    <div className='w-100'>
                                                                        <ReactApexChart 
                                                                              options={this.state.chartSuhuModusJam.options} 
                                                                              series={this.state.chartSuhuModusJam.series} 
                                                                              type="area" 
                                                                              height={350} />
                                                                    </div>
                                                                }

                                                                {
                                                                    // !this.state.loader.suhu_tangki_modus_jam &&
                                                                    // !this.state.chartSuhuModusJam.statusFound &&

                                                                    // LOADER MENGIKUTI TINGGI MODUS TANGKI
                                                                    !this.state.loader.tinggi_isi_modus_jam &&
                                                                    !this.state.chartTinggiModusJam.statusFound &&
                                                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                        <img src = {No_Found} className="nofound-class" />
                                                                        <div className='nofound-label'> No Data Found </div>
                                                                    </div>
                                                                }

                                                                
                                                            </div>
                                                        </Col>
                                                    </div>
                                                </div>

                                            </Row>
                                            {/* ... end <TINGGI MODUS JAM> */}

                                            <Row className='mt-2'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between flex-column flex-md-row '>

                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <img src = {MotionSensorRed} width="30" height="30" />
                                                        </div>
                                                        <div>
                                                            <h5 className='dashtangki-title'>Jarak Sensor ( m / jam )</h5>
                                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                        </div>
                                                    </div>

                                                    <div className='checkPerJam'>
                                                            {/* <Form.Check
                                                              inline
                                                              label="1"
                                                              name="group1"
                                                              type='checkbox'
                                                              id={`inline-${'1'}-1`}
                                                            /> */}
                                                            <Form.Check type={'checkbox'} inline>
                                                                <Form.Check.Input type={'checkbox'} 
                                                                    onChange={(val)=>{this.checkChartJam(val,'jarak_sensor')}}
                                                                    defaultChecked={this.state.chartSuhuModusJam.options.dataLabels.enabled}
                                                                />
                                                                <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                                {/* <Form.Control.Feedback type="valid">
                                                                  You did it! 
                                                                </Form.Control.Feedback> */}
                                                            </Form.Check>
                                                    </div>


                                                </div>

                                                <Col> 
                                                    <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                      <ThreeCircles
                                                            height="100"
                                                            width="100"
                                                            color="#4fa94d"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            visible={this.state.loader.jarak_sensor_jam}
                                                            ariaLabel="three-circles-rotating"
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        {
                                                            !this.state.loader.jarak_sensor_jam &&
                                                            this.state.chartJarakSensorJam.statusFound &&

                                                            <div className='w-100'>
                                                                <ReactApexChart 
                                                                      options={this.state.chartJarakSensorJam.options} 
                                                                      series={this.state.chartJarakSensorJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.jarak_sensor_jam &&
                                                            !this.state.chartJarakSensorJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                        
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-2'
                                                ref={(input)=>this.refScroll_Tinggi=input}>

                                                <hr></hr>
                                                <div className='d-flex justify-content-between flex-column flex-md-row'>

                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                      <div className='d-flex justify-content-start align-items-center'>
                                                          <img src = {Tank} width="30" height="30" />
                                                      </div>
                                                      <div>
                                                          <h5 className='dashtangki-title'>Tinggi Isi Tangki ( Cm / jam )</h5>
                                                          <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                      </div>
                                                    </div>

                                                    <div className='checkPerJam'>
                                                            {/* <Form.Check
                                                              inline
                                                              label="1"
                                                              name="group1"
                                                              type='checkbox'
                                                              id={`inline-${'1'}-1`}
                                                            /> */}
                                                            <Form.Check type={'checkbox'} inline>
                                                                <Form.Check.Input 
                                                                    type={'checkbox'} 
                                                                    onChange={(val)=>{this.checkChartJam(val,'tinggi')}}
                                                                    defaultChecked={this.state.chartTinggiJam.options.dataLabels.enabled}
                                                                />
                                                                <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                                {/* <Form.Control.Feedback type="valid">
                                                                  You did it! 
                                                                </Form.Control.Feedback> */}
                                                            </Form.Check>
                                                    </div>


                                                </div>

                                                <Col> 
                                                    <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                      <ThreeCircles
                                                            height="100"
                                                            width="100"
                                                            color="#4fa94d"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            visible={this.state.loader.tinggi_isi_jam}
                                                            ariaLabel="three-circles-rotating"
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.tinggi_isi_jam &&
                                                            this.state.chartJarakSensorJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart 
                                                                      options={this.state.chartTinggiJam.options} 
                                                                      series={this.state.chartTinggiJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.tinggi_isi_jam &&
                                                            !this.state.chartJarakSensorJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                        
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-3'
                                                  ref={(input)=>this.refScroll_Suhu=input}>

                                                <hr></hr>
                                                <div className='d-flex justify-content-between flex-column flex-md-row'>

                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <img src = {TermSensor} width="30" height="30" />
                                                        </div>
                                                        <div>
                                                            <h5 className='dashtangki-title'>Suhu Tangki ( °C / jam )</h5>
                                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                        </div>
                                                    </div>

                                                    <div className='checkPerJam'>
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input 
                                                                  type={'checkbox'} 
                                                                  onChange={(val)=>{this.checkChartJam(val,'suhu_jam')}}
                                                                  defaultChecked={this.state.chartSuhuJam.options.dataLabels.enabled}
                                                            />
                                                            <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                            {/* <Form.Control.Feedback type="valid">
                                                              You did it! 
                                                            </Form.Control.Feedback> */}
                                                        </Form.Check>
                                                    </div>
                                                </div>

                                                <Col> 
                                                    <div id="chart" className='d-flex justify-content-center'>

                                                        <ThreeCircles
                                                            height="100"
                                                            width="100"
                                                            color="#4fa94d"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            visible={this.state.loader.suhu_tangki_jam}
                                                            ariaLabel="three-circles-rotating"
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.suhu_tangki_jam &&
                                                            this.state.chartSuhuJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart options={this.state.chartSuhuJam.options} 
                                                                      series={this.state.chartSuhuJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.suhu_tangki_jam &&
                                                            !this.state.chartSuhuJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </Col>
                                            </Row>

                                            {/* SUHU TANGKI ( KETINGGIAN )*/}
                                            <Row className='mt-3'
                                                  >

                                                <hr></hr>
                                                <div className='d-flex justify-content-between flex-column flex-md-row'>
                                                    <div>
                                                        <div className='d-flex justify-content-start align-items-center gap-2'>
                                                            <div className='d-flex justify-content-start align-items-center'>
                                                                <img src = {Thermometer} width="30" height="30" />
                                                            </div>
                                                            <div>
                                                                <h5 className='dashtangki-title'>Suhu Tinggi Tangki ( °C / jam )</h5>
                                                                <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                            </div>
                                                        </div>


                                                        {/* FILTER TANGKI */}
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <div className='filter-subcap-css-title'>Filter : </div>
                                                            <Select options={this.mst_list_tangki} 
                                                                className="select-class"
                                                                isDisabled={this.state.chartSuhuTinggiJam.isDisabled}
                                                                // styles={this.customStyle_SuhuTinggiTangki}
                                                                // defaultValue={this.state.chartSuhuTinggiJam.suhuTinggiSelected} // set default value
                                                                // value={{"name":"tangki_1","api":"tank 1","bgColor":"bg-gradient-danger","title":"Tangki 1","value":"Tangki 1","label":"Tangki 1"}} // set default value
                                                                value={this.state.chartSuhuTinggiJam.suhuTinggiSelected} // set default value
                                                                tabSelectsValue={false} isClearable={true}
                                                                onChange={(e, {action})=>this.onChangeSelectSuhuTinggiFilter(e, action)}
                                                            />
                                                        </div>

                                                    </div>
                                                    <div className='checkPerJam mt-2'>
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input 
                                                                type={'checkbox'} 
                                                                onChange={(val)=>{this.checkChartJam(val,'suhu_tinggi_jam')}}
                                                                defaultChecked={this.state.chartSuhuTinggiJam.options.dataLabels.enabled}
                                                            />
                                                            <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                            {/* <Form.Control.Feedback type="valid">
                                                              You did it! 
                                                            </Form.Control.Feedback> */}
                                                        </Form.Check>
                                                    </div>
                                                </div>

                                                <Col> 
                                                    <div id="chart" className='d-flex justify-content-center mt-3'>

                                                        <ThreeCircles
                                                            height="100"
                                                            width="100"
                                                            color="#4fa94d"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            visible={this.state.loader.suhu_tinggi_tangki_jam}
                                                            ariaLabel="three-circles-rotating"
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.suhu_tinggi_tangki_jam &&
                                                            this.state.chartSuhuTinggiJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart options={this.state.chartSuhuTinggiJam.options} 
                                                                      series={this.state.chartSuhuTinggiJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.suhu_tinggi_tangki_jam &&
                                                            !this.state.chartSuhuTinggiJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-3'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between flex-column flex-md-row'
                                                      ref={(input)=>this.refScroll_Volume=input}>

                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <img src = {WeightTank} width="30" height="30" />
                                                        </div>
                                                        <div>
                                                            <h5 className='dashtangki-title'>Volume Tangki ( kg / jam )</h5>
                                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                        </div>
                                                    </div>

                                                    <div className='checkPerJam'>
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input 
                                                                defaultChecked={this.state.chartVolumeJam.options.dataLabels.enabled}
                                                                type={'checkbox'} 
                                                                onChange={(val)=>{this.checkChartJam(val,'volume_jam')}}/>
                                                            <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                            {/* <Form.Control.Feedback type="valid">
                                                              You did it! 
                                                            </Form.Control.Feedback> */}
                                                        </Form.Check>
                                                    </div>
                                                </div>
                                                <Col> 
                                                    <div id="chart" className='d-flex justify-content-center'>

                                                        <ThreeCircles
                                                              height="100"
                                                              width="100"
                                                              color="#4fa94d"
                                                              wrapperStyle={{}}
                                                              wrapperClass=""
                                                              visible={this.state.loader.volume_tangki_jam}
                                                              ariaLabel="three-circles-rotating"
                                                              outerCircleColor="#008ffb"
                                                              innerCircleColor="#00e396"
                                                              middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.volume_tangki_jam &&
                                                            this.state.chartVolumeJam.statusFound &&
                                                            <div className='w-100'
                                                            >
                                                                      {/* ref={(input)=>this.refScroll_Volume=input} */}
                                                                <ReactApexChart 
                                                                      options={this.state.chartVolumeJam.options} 
                                                                      series={this.state.chartVolumeJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.volume_tangki_jam &&
                                                            !this.state.chartVolumeJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                        {/* <ReactApexChart options={this.state.chartVolumeJam.options} series={this.state.chartVolumeJam.series} type="area" height={350} /> */}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                    </Col>
                                </Row>                                

                        </div>
                    </div>
                

                {/* </Container> */}
                {/* onHide : untuk hide modal jika click outside dari modal */}
                {/* onHide={()=>this.handleClick_CreateUser(false)} */}

                {/* MODAL CHANGE PASSWORD */}
                <Modal show={this.state.modal.changePWD.show} 
                        centered = {true}
                        size="sm"
                        className='modal-will-show'
                >

                    <Modal.Header className='modalheader modal-change-password'>
                        <Modal.Title className='dashboard-modal-title'>
                          
                            <FontAwesomeIcon icon = {faKey} className='login-dropdown-icon' color={'darkgreen'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                            {/* <img src = {PassPNG} width = {80} height = {80}
                                style = {{position:'absolute', zIndex:0, top:-30, right:0}}/> */}
                            
                            {/* <FontAwesomeIcon icon = {faKey} color = {"green"}/> */}
                            <span className='login-icon-modal-title'>Change Password</span>

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
                                  visible={this.state.modal.changePWD.loader}
                                  ariaLabel="blocks-wrapper"
                            />
                        </div>

                        {
                            // !this.state.modal.changePWD.loader
                            // &&
                            <div
                                style={{display: this.state.modal.changePWD.loader ? 'none' : 'block'}}>
                                <Form.Group className='mb-2' controlId='formBasicOldPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Current Password</Form.Label>
                                    <Form.Control type = "password" placeholder="Enter Current Password" 
                                        ref={(input)=>{this.passwordInput = input;}}
                                        onChange={(event)=>this.handleChangePassword(event, 'oldPass')}/>
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='formBasicNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>New Password</Form.Label>
                                    <Form.Control type = "password" placeholder="Enter New Password" 
                                        onChange={(event)=>this.handleChangePassword(event, 'newPass')}/>
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Confirm New Password</Form.Label>
                                    <Form.Control type = "password" placeholder="Confirm New Password" 
                                        onChange={(event)=>this.handleChangePassword(event, 'confirmNewPass')}/>
                                </Form.Group>
                            </div>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant = "secondary" onClick={()=>this.handleClick_ChangePWD(false,'changePWD')} disabled={this.state.modal.changePWD.loader}>Close</Button>
                        <Button variant = "primary" onClick={()=>this.handleSavePassword()} disabled={this.state.modal.changePWD.loader}>Save</Button>
                    </Modal.Footer>

                </Modal>

                {/* MODAL CREATE USER */}
                <Modal show={this.state.modal.createUser.show} 
                        centered = {false}
                        size="sm"
                        className='modal-will-show'
                >

                    <Modal.Header className='modalheader modal-create-user'>
                        <Modal.Title className='dashboard-modal-title'>

                            <FontAwesomeIcon icon = {faUserPlus} className='login-dropdown-icon' color={'navy'} 
                                      style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>

                            {/* <img src = {UserPNG} width = {100} height = {80}
                                style = {{position:'absolute', zIndex:0, top:-20, right:0}}/> */}

                            {/* <FontAwesomeIcon icon = {faUserPlus} color={"blue"} /> */}
                            <span className='login-icon-modal-title'>Create User</span>
                        </Modal.Title>
                        {/* <span className='dashboard-modal-close'
                          onClick={()=>this.handleClick_ChangePWD(false,'createUser')}>X</span> */}
                    </Modal.Header>

                    <Modal.Body>

                        <div className='d-flex justify-content-center align-items-center'>
                            <Blocks
                                  height="100"
                                  width="100"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                  visible={this.state.modal.createUser.loader}
                                  ariaLabel="blocks-wrapper"
                            />
                        </div>

                        {
                            // !this.state.modal.createUser.loader
                            // &&
                            <div
                              style={{display: this.state.modal.createUser.loader ? 'none' : 'block'}}>
                                <Form.Group className='mb-1' controlId='formBasicOldPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>New User</Form.Label>
                                    <Form.Control type = "text" placeholder="Enter New User"
                                        maxLength={50}
                                        ref={(input)=>{this.userNameInput = input;}}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'newUser')}/>
                                </Form.Group>

                                <Form.Group className='mb-1'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Company</Form.Label>

                                    <MultiSelect
                                        className='multi-select-filter-company size-sm create-user'
                                        options={this.options_filter_company_createuser}
                                        value={this.state.filter_company_create_user}
                                        hasSelectAll={true}  
                                        closeOnChangedValue={false}
                                        onChange={(e)=>this.onChangeSelectMultiComponent_CreateUser(e)}
                                        labelledBy="Select"
                                      />
                                </Form.Group>

                                <Form.Group className='mb-1' controlId='formBasicNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>New Password</Form.Label>
                                    <Form.Control type = "password" placeholder="Enter New Password" 
                                        maxLength={50}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'newPass')}/>
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Confirm New Password</Form.Label>
                                    <Form.Control type = "password" placeholder="Confirm New Password" 
                                        maxLength={50}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'confirmNewPass')}/>
                                </Form.Group>
                            </div>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant = "secondary" onClick={()=>this.handleClick_ChangePWD(false,'createUser')} disabled={this.state.modal.createUser.loader}>Close</Button>
                        <Button variant = "primary" onClick={()=>this.handleSaveCreateUser()} disabled={this.state.modal.createUser.loader}>Save</Button>
                    </Modal.Footer>

                </Modal>


                {/* MODAL UPDATE JENIS CPO / PKO */}
                <Modal show={this.state.modal.updateJenis.show} 
                        centered = {true}
                        size="sm"
                        className='modal-will-show'
                >

                    <Modal.Header className='modalheader modal-update-jenis'>
                        <Modal.Title className='dashboard-modal-title'>

                            <FontAwesomeIcon icon = {faClone} className='login-dropdown-icon' color={'navy'} 
                                    style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>

                            {/* <img src = {CuteArrow} width = {50} height = {50}
                                style = {{position:'absolute', zIndex:0, top:5, right:5}}/> */}

                            {/* <FontAwesomeIcon icon = {faUserPlus} color={"blue"} /> */}
                            <span className='login-icon-modal-title'>Update Jenis</span>
                        </Modal.Title>
                        {/* <span className='dashboard-modal-close'
                          onClick={()=>this.handleClick_ChangePWD(false,'updateJenis')}>X</span> */}
                    </Modal.Header>

                    <Modal.Body>

                        <div className='d-flex justify-content-center align-items-center'>
                            <Blocks
                                  height="100"
                                  width="100"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                  visible={this.state.modal.updateJenis.loader}
                                  ariaLabel="blocks-wrapper"
                            />
                        </div>

                        {
                            // !this.state.modal.createUser.loader
                            // &&
                            <div
                              style={{display: this.state.modal.updateJenis.loader ? 'none' : 'block'}}>
                                <Form.Group className='mb-2 customDatePickerWidth' controlId='formBasicTanggal'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Tanggal</Form.Label>

                                    <DatePicker 
                                      ref={(input)=>{this.tanggalInput = input;}}
                                      dateFormat="dd MMMM yyyy"
                                      selected={this.state.modal.updateJenis.input.dateSelected} 
                                      onChange={(date) => this.setFilterDate(date, 'updateJenis')}
                                    />
                                    {/* <Form.Control type = "text" placeholder="Enter New User"
                                        maxLength={50}
                                        ref={(input)=>{this.userNameInput = input;}}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'newUser')}/> */}
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='formBasicNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Company</Form.Label>

                                    <Select options={this.state.modal.updateJenis.input.filterOptions_Company} 
                                        className="select-class-modal-company"
                                        value={this.state.modal.updateJenis.input.company.value}
                                        // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                        isLoading = {this.state.modal.updateJenis.input.company.isLoading}
                                        tabSelectsValue={false} isClearable={true}  
                                        onChange={(e, {action})=>this.onChangeSelectFilterModal(e, action, 'updatejenis_company')}
                                    />

                                    {/* <Form.Control type = "password" placeholder="Enter New Password" 
                                        maxLength={50}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'newPass')}/> */}
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Tangki</Form.Label>

                                    <Select options={this.state.modal.updateJenis.input.filterOptions_Tangki} 
                                        className="select-class-modal-tangki"
                                        value={this.state.modal.updateJenis.input.tangki.value}
                                        // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                        tabSelectsValue={false} isClearable={true}
                                        onChange={(e, {action})=>this.onChangeSelectFilterModal(e, action, 'updatejenis_tangki')}
                                    />
                                    {/* <Form.Control type = "password" placeholder="Confirm New Password" 
                                        maxLength={50}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'confirmNewPass')}/> */}
                                </Form.Group>

                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Jenis</Form.Label>

                                    <Select options={this.state.modal.updateJenis.input.filterOptions_Jenis} 
                                        className="select-class-modal-jenis"
                                        value={this.state.modal.updateJenis.input.jenis.value}
                                        // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                        tabSelectsValue={false} isClearable={true}
                                        onChange={(e, {action})=>this.onChangeSelectFilterModal(e, action, 'updatejenis_jenis')}
                                    />
                                    <span className='dash-data-saved-jenis'>{this.state.modal.updateJenis.input.jenis.dataSaved}</span>
                                    {/* <Form.Control type = "password" placeholder="Confirm New Password" 
                                        maxLength={50}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'confirmNewPass')}/> */}
                                </Form.Group>
                            </div>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant = "secondary" onClick={()=>this.handleClick_CloseModal('updateJenis')} disabled={this.state.modal.updateJenis.loader}>Close</Button>
                        <Button variant = "primary" onClick={()=>this.handleSaveUpdateJenis()} disabled={this.state.modal.updateJenis.loader}>Save</Button>
                    </Modal.Footer>

                </Modal>


                {/* MODAL UPDATE PROFILE TANGKI */}
                <Modal show={this.state.modal.updateProfileTangki.show} 
                        centered = {true}
                        size="sm"
                        className='modal-will-show'
                >

                    <Modal.Header className='modalheader modal-update-profile'>
                        <Modal.Title className='dashboard-modal-title'>

                            <FontAwesomeIcon icon = {faPenToSquare} className='login-dropdown-icon' color={'navy'} 
                                    style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>

                            {/* <img src = {CuteArrow} width = {50} height = {50}
                                style = {{position:'absolute', zIndex:0, top:5, right:5}}/> */}

                            {/* <FontAwesomeIcon icon = {faUserPlus} color={"blue"} /> */}
                            <span className='login-icon-modal-title'>Update Profile Tangki</span>
                        </Modal.Title>
                        {/* <span className='dashboard-modal-close'
                          onClick={()=>this.handleClick_ChangePWD(false,'updateJenis')}>X</span> */}
                    </Modal.Header>

                    <Modal.Body>

                        <div className='d-flex justify-content-center align-items-center'>
                            <Blocks
                                  height="100"
                                  width="100"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                  visible={this.state.modal.updateProfileTangki.loader}
                                  ariaLabel="blocks-wrapper"
                            />
                        </div>

                        {
                            // !this.state.modal.createUser.loader
                            // &&
                            <div
                              style={{display: this.state.modal.updateProfileTangki.loader ? 'none' : 'block'}}>

                                <Form.Group className='mb-2' controlId='formBasicNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Company</Form.Label>

                                    <Select options={this.state.modal.updateProfileTangki.input.filterOptions_Company} 
                                        className="select-class-modal-company"
                                        ref={(input)=>{this.refCompanyInput = input;}}
                                        value={this.state.modal.updateProfileTangki.input.company.value}
                                        // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                        isLoading = {this.state.modal.updateProfileTangki.input.company.isLoading}
                                        tabSelectsValue={false} isClearable={true}  
                                        onChange={(e, {action})=>this.onChangeSelectFilterModal(e, action, 'updateProfileTangki_company')}
                                    />
                                </Form.Group>
                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Tangki</Form.Label>

                                    <Select options={this.state.modal.updateProfileTangki.input.filterOptions_Tangki} 
                                        className="select-class-modal-tangki"
                                        value={this.state.modal.updateProfileTangki.input.tangki.value}
                                        // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                        tabSelectsValue={false} isClearable={true}
                                        onChange={(e, {action})=>this.onChangeSelectFilterModal(e, action, 'updateProfileTangki_tangki')}
                                    />
                                    {/* <Form.Control type = "password" placeholder="Confirm New Password" 
                                        maxLength={50}
                                        onChange={(event)=>this.handleCreateNewUser(event, 'confirmNewPass')}/> */}
                                </Form.Group>

                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>Tinggi Profile (Cm) </Form.Label>

                                    <div>
                                        <NumericFormat  
                                                decimalScale={2} 
                                                className='numeric-format'
                                                allowNegative={false}
                                                value={this.state.modal.updateProfileTangki.input.tinggi_profile.value}
                                                // suffix=' Cm'
                                                isAllowed={(values)=>{
                                                    const { floatValue } = values;
                                                    return (floatValue??0) <= 9999.99;
                                                }}
                                                onValueChange={(event)=>this.handleValueChangeProfileTangki(event, 'tinggi_profile')}
                                                thousandSeparator />
                                    </div> 

                                </Form.Group>
                            </div>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant = "secondary" onClick={()=>this.handleClick_CloseModal('updateProfileTangki')} disabled={this.state.modal.updateProfileTangki.loader}>Close</Button>
                        <Button variant = "primary" onClick={()=>this.handleSaveUpdateProfileTangki()} disabled={this.state.modal.updateProfileTangki.loader}>Save</Button>
                    </Modal.Footer>

                </Modal>

                {/* MODAL UPDATE USER COMPANY */}
                <Modal 
                        // show = {true}
                        show={this.state.modal.updateUserCompany.show} 
                        centered = {true}
                        size="sm"
                        className='modal-will-show'
                >

                    <Modal.Header className='modalheader modal-update-user-company'>
                        <Modal.Title className='dashboard-modal-title'>

                            <FontAwesomeIcon icon = {faBuildingUser} className='login-dropdown-icon' color={'navy'} 
                                style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                            {/* <img src = {CuteArrow} width = {50} height = {50}
                                style = {{position:'absolute', zIndex:0, top:5, right:5}}/> */}

                            {/* <FontAwesomeIcon icon = {faUserPlus} color={"blue"} /> */}
                            <span className='login-icon-modal-title'>Update User Company</span>
                        </Modal.Title>
                        {/* <span className='dashboard-modal-close'
                          onClick={()=>this.handleClick_ChangePWD(false,'updateJenis')}>X</span> */}
                    </Modal.Header>

                    <Modal.Body>

                        <div className='d-flex justify-content-center align-items-center'>
                            <Blocks
                                  height="100"
                                  width="100"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                  visible={this.state.modal.updateUserCompany.loader}
                                  ariaLabel="blocks-wrapper"
                            />
                        </div>

                        {
                            // !this.state.modal.updateUserCompany.loader
                            // &&
                            <div
                              style={{display: this.state.modal.updateUserCompany.loader ? 'none' : 'block'}}>

                                <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label required'>User</Form.Label>

                                    <Select options={this.state.modal.updateUserCompany.input.filterOptions_User} 
                                        className="select-class-modal-user"
                                        autoFocus={true}
                                        // menuIsOpen={true}
                                        maxMenuHeight={250} 
                                        ref={(input)=>{this.userNameInput = input;}}
                                        value={this.state.modal.updateUserCompany.input.user.value}
                                        // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                        tabSelectsValue={false} isClearable={true}
                                        onChange={(e, {action})=>this.onChangeSelectFilterModal(e, action, 'updateUserCompany_user')}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-2' controlId='formBasicNewPasssword'>
                                    <Form.Label className='mb-1 dash-modal-form-label'>Company</Form.Label>

                                    <MultiSelect
                                        className='multi-select-filter-company size-sm update-user-company'
                                        options={this.options_filter_company_updateusercompany}
                                        value={this.state.filter_company_update_user_company}
                                        hasSelectAll={true}  
                                        closeOnChangedValue={false}
                                        onChange={(e)=>this.onChangeSelectMultiComponent_UpdateUserCompany(e)}
                                        labelledBy="Select"
                                      />
                                </Form.Group>

                                <Form.Group className='mb-2' controlId='formBasicActiveUser'>
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
                                                onChange={this.handleChangeSwitchChecked} 
                                                checked = {this.state.modal.updateUserCompany.checked_user_active}
                                            />
                                        </label>
                                    </div>
                                </Form.Group>
                                

                            </div>
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant = "secondary" onClick={()=>this.handleClick_CloseModal('updateUserCompany')} disabled={this.state.modal.updateUserCompany.loader}>Close</Button>
                        <Button variant = "primary" onClick={()=>this.handleSaveUpdateUserCompany()} disabled={this.state.modal.updateUserCompany.loader}>Save</Button>
                    </Modal.Footer>

                </Modal>

            </div>
            
        )
    }
}


export default DashboardTangki;