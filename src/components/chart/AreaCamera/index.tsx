import { ApexOptions } from 'apexcharts';
import React, { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { formatDate } from '../../../services/functions';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';


const AreaCamera = ({...restProps}) => {

  const { objCardList, title } = restProps;
  const [seriesAreaCamera, setSeriesAreaCamera] = useState<ApexOptions['series']|any>([]);
  const [optAreaCamera, setOptAreaCamera] = useState<ApexOptions>({});

  const chartAreaCamera:any = useRef(null);

  const [arrSeriesTimeline,setArrSeriesTimeline] = useState<any>([]);
  
  // jika 'objCardList' update, maka trigger useEffect di bawah
  useEffect(()=>{

    if (typeof objCardList != 'undefined' && objCardList != null){
        // console.log("AREA CAMERA");
        // console.log(objCardList);

        let seriesTimeline_Temp:any = [...arrSeriesTimeline];
        
        let cam_label = objCardList?.['label']; // Camera 1
        let cam_time_real = objCardList?.['time_real']; // 2024-01-01 07:50:00
        let cam_id = objCardList?.['id_cam']; // camera-1
        let cam_tools = objCardList?.['tools']; // helmet, glasses, ...
        

        if (cam_id != null && typeof cam_id != 'undefined')
        {
          if (Object.keys(cam_tools).length > 0){
  
              Object.keys(cam_tools).forEach((item, idx)=>{

                  let cam_tool_label = objCardList?.['tools']?.[item]?.['label']; // Helmet, Glasses, dst...

                  let val = cam_tools?.[item]?.['value']
                  console.log(item + " - " + val)
  
                  // jika data array seriesTimeline kosong
                  if (seriesTimeline_Temp.length == 0){
                      let obj_temp = {
                        name: cam_tool_label,
                        data: [{x: new Date(cam_time_real).getTime(), y: val}]
                      }
                      seriesTimeline_Temp = [{...obj_temp}]
                      // console.log("seriesTimeline_Temp")
                      // console.log(seriesTimeline_Temp)
                  }
                  else if (seriesTimeline_Temp.length > 0){
                    
                      // cari index 'helmet' di dalam array series
                      let findIdxTool = seriesTimeline_Temp.findIndex(x=>x?.['name'] == cam_tool_label);  // Helmet
                      if (findIdxTool == -1){

                          // jika tidak ada, tambah object tool item baru
                          seriesTimeline_Temp = [...seriesTimeline_Temp, 
                                                  {name: cam_tool_label, 
                                                  data: [{x: new Date(cam_time_real).getTime(), y: val}]}
                                                ];
                          // console.error("TIDAK KETEMU : " + cam_tool_label);
                          // console.log(seriesTimeline_Temp);
                      }
                      else if (findIdxTool != -1){
                          // jika ada, maka update yang existing


                          // jika ada, maka timpa dan tambah yang sudah ada
                          let obj_temp = {
                              name: cam_tool_label,
                              data: [...seriesTimeline_Temp[findIdxTool]?.['data'],
                                      {x: new Date(cam_time_real).getTime(), y: val}]
                          }

                          if (obj_temp?.['data']. length > 20){
                            obj_temp['data'].shift();
                          }

                          seriesTimeline_Temp[findIdxTool] = {...obj_temp};

                          // console.error("KETEMU : " + cam_tool_label);
                          // console.log(seriesTimeline_Temp)
                      }

                  }


              })

              // seriesTimeline_Temp = [{...obj_temp}]
              // console.log("seriesTimeline_Temp FINAL")
              // console.log(seriesTimeline_Temp)

              setArrSeriesTimeline([...seriesTimeline_Temp]);

              setTimeout(()=>{
                let chartCurrentAreaCamera = chartAreaCamera.current.chart;
                chartCurrentAreaCamera.updateSeries([...seriesTimeline_Temp]);
              },10)
  
            // if (Array.isArray(seriesTimeline_Temp)){
            //     // alert(JSON.stringify(cam_tools))
            //     if (seriesTimeline_Temp.length == 0){
    
            //     }
            // }
  
          }
        }
    }

  },[objCardList])


  useEffect(()=>{
  
    let seriesTemp:ApexOptions['series']|any = [
        // {
        //   name: 'PRODUCT A',
        //   data:[]
          // data: [{x:new Date('2024-01-01 06:00:00').getTime(),y:10},{x:new Date('2024-01-01 06:01:00').getTime(),y:80}]
        // },
        // {
        //   name: 'PRODUCT B',
        //   data:[]
          // data: [{x:new Date('2024-01-01 06:00:00').getTime(),y:5},{x:new Date('2024-01-01 06:01:50').getTime(),y:80}]
        // }

        // {
        //   name: 'PRODUCT B',
        //   data: [{x:'2024-01-01 06:00',y:10},{x:'2024-01-01 06:02',y:80}]
        // }, {
        //   name: 'PRODUCT C',
        //   data: [{x:'2024-01-01 09:00',y:90},{x:'2024-01-01 09:50',y:90}]
        // }
        // {
        //   name: 'PRODUCT A',
        //   data: [{x:5,y:10},{x:7,y:10}]
        // }, {
        //   name: 'PRODUCT B',
        //   data: [{x:4,y:10},{x:8,y:80}]
        // }, {
        //   name: 'PRODUCT C',
        //   data: [{x:10,y:90}]
        // }
    ]
    
    let optTemp:ApexOptions = {
          
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          zoom: {
            enabled: true
          },
        },
        dataLabels: {
          enabled: true,
          formatter:(val:any, opts)=>{
              if (val != null){
                return (Math.round(val * 100)/100)
              }
              return val;
          },
        },
        markers: {
          size: 1,
        },
        fill: {
          type: 'gradient',
          gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.45,
              opacityTo: 0.05,
              stops: [20, 100, 100, 100]
            },
        },
        yaxis: {
          labels: {
              style: {
                  colors: '#8e8da4',
              },
              offsetX: 0,
              formatter: (val:any) => {
                return val;
              },
          },
          axisBorder: {
              show: false,
          },
          axisTicks: {
              show: false
          }
        },
        grid:{
          padding:{
            left: 35
          }
        },
        xaxis: {
          type: 'datetime',
          // tickAmount: 'dataPoints',
          // min: new Date("01/01/2023").getTime(),
          // max: new Date("12/20/2024").getTime(),
          labels: {
              rotate: -45,
              style:{
                // colors:['#ff0000','#00ff00'],
                fontSize:'12px',
                fontWeight:'500',
                fontFamily:'FF_Din_Font'
              },
              rotateAlways: true,
              formatter: (val:any, timestamp) => {
                if (!isNaN(val)){
                  try{
                    return format(new Date(val),'dd-MM-yy HH:mm:ss',{locale:idLocale})
                  }catch(e){}
                }
                return val;
              }
          }
        },
        title: {
          text: `${title}`, // Camera 1
          align: 'left',
          offsetX: 14
        },
        tooltip: {
          shared: false,
          x:{
            formatter:(val, opts) => {
                return format(new Date(val),'dd MMM yyyy  HH:mm:ss', {locale:idLocale});
            },
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          offsetX: -10
        }
    };

    setTimeout(()=>{
      setSeriesAreaCamera([...seriesTemp]);
      setOptAreaCamera({...optTemp})
    },100)
  },[])

  const handleClickAppend = (arrseries:any[]) => {
    
    let tambah_current = chartAreaCamera.current.chart;
    // let series_cam_temp = [...seriesAreaCamera];
    let series_cam_temp = [...arrseries];

    let data_cam_temp:any = series_cam_temp?.[0]?.['data'];

    series_cam_temp = [
      {
        name:'PRODUCT A',
        data: [...data_cam_temp, {x:new Date().getTime(), y:(Math.random() * 100)}]
      }
    ]
    tambah_current.updateSeries([...series_cam_temp])

    setSeriesAreaCamera(series_cam_temp);

    // console.log(series_cam_temp);

    // console.log(seriesAreaCamera)

    setTimeout(()=>{
        if (series_cam_temp?.[0]?.['data'].length <= 5){
          handleClickAppend(series_cam_temp)
        }
        
    },1000)
  }

  

  return (
    <>
    {/* <button type="button" className='btn btn-primary' onClick={()=>handleClickAppend([...seriesAreaCamera])}> Tes Tambah </button> */}
    
       <ReactApexChart
          ref={chartAreaCamera}
          options={{...optAreaCamera}}
          series={[...seriesAreaCamera]}
          type="area"
          height={500}
          
          />
    </>
  )
}

export default AreaCamera