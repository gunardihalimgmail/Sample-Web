import { AppRegistration, Architecture, Assignment, BarChart, Build, BuildCircle, CellTower, Collections, ConnectedTv, Dashboard, DirectionsCar, DomainAdd, Engineering, HighlightAlt, Inventory, LinkedCamera, LocalGasStation, People, PlayCircle, QueryStats, Receipt, Settings, VideoStable } from '@mui/icons-material'
import { Breadcrumbs, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'

const BreadcrumbsCustom = (props) => {
  const { arrPath } = props;
  
  const [arrFinal, setArrFinal] = useState<any[]>([]);

  // let arrFinal:any[] = [
    // <Link underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Build sx={{mr: 0.7, fontSize: '18px', color:'grey'}}/> Maintenance</Link>
  // ]
  useEffect(()=>{
    let arrFinalTemp:any[] = [];
    if (Array.isArray(arrPath)){
      if (arrPath.length > 0){
        arrPath.forEach((obj, idx)=>{
          if (obj?.['key'] == 'Maintenance'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Build sx={{mr: 0.7, fontSize: '18px', color:'grey'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Users'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><People sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Cameras'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><LinkedCamera sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Features'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Architecture sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Results'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><AppRegistration sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Settings'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Settings sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }

          else if (obj?.['key'] == 'Dashboard'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Dashboard sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Main'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><BarChart sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Analitik'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><QueryStats sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'PPE'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Engineering sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Vehicle'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><DirectionsCar sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Monitoring'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><ConnectedTv sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Camera Online'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><CellTower sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Task'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Assignment sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Live View'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><PlayCircle sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Recordings'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><VideoStable sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'ROI'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><HighlightAlt sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Events'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Collections sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Sites'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><DomainAdd sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Places'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><LocalGasStation sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Penjualan'){
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Inventory sx={{mr: 0.7, fontSize: '18px'}}/> {obj?.['value']}</Link>];
          }
          else if (obj?.['key'] == 'Transaksi'){
            
            arrFinalTemp = [...arrFinalTemp, <Link key={idx} underline='none' sx={{display:'flex', alignItems:'center', color:'grey', fontSize:'14px'}}><Receipt sx={{mr: 0.7, fontSize: '18px', color:'grey'}}/> {obj?.['value']}</Link>];
          }
        })
        setArrFinal([...arrFinalTemp]);
      } else {
        setArrFinal([]);
      }
    } else {
      setArrFinal([]);
    }

  },[arrPath])

  return (
    <>
        <div style={{marginLeft:'0px', borderRadius:'15px', boxShadow:'0px 5px 8px -5px lightblue', padding:'7px', cursor:'pointer'}}>
            <Breadcrumbs separator="/">
                {
                  arrFinal && 
                      (
                        arrFinal.map((obj, idx)=>{
                          return (
                              obj
                          )
                        })
                      )
                }
            </Breadcrumbs>
        </div>
    </>
  )
}

export default BreadcrumbsCustom