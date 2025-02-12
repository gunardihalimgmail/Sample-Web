import React, { useEffect, useRef, useState } from 'react'
import styles from './ROI.module.scss';
import './ROIGlobal.scss';
import storeMenu from '../../../stores'
import { FuturisticTest, ImageFolderAmico, Pencil, RandomLineGreen, RandomLineRed, TesROI } from '../../../assets'
import { Circle, Image, Layer, Line, Stage } from 'react-konva';
import useImage from 'use-image';
import Watermark from 'react-watermark-component';
import { ProgressBar, RotatingLines } from 'react-loader-spinner';
import { SelectButton } from 'primereact/selectbutton';
import { getValueFromLocalStorageFunc, handleSwal, notify, PPE_getApiSync, URL_API_PPE } from '../../../services/functions';
import { ToastContainer } from 'react-toastify';
import * as turf from '@turf/turf';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';
import { Button as ButtonPrime } from 'primereact/button';
import { SweetAlertResult } from 'sweetalert2';

import { Fieldset } from 'primereact/fieldset';
import { IconButton, ImageList, ImageListItem, ImageListItemBar, useMediaQuery, useTheme } from '@mui/material';
import { ConstructionOutlined, DateRangeRounded, Margin, Star, StarBorder, StarHalf } from '@mui/icons-material';
import ReactDatePicker from 'react-datepicker';
import { format, lastDayOfMonth } from 'date-fns';
import { MultiSelect } from 'primereact/multiselect';
import idLocale from 'date-fns/locale/id';


const ROI = () => {

    // const [imageUrl, setImageUrl] = useState<any>("https://static.vecteezy.com/system/resources/previews/036/772/888/non_2x/ai-generated-traffic-on-the-freeway-in-large-traffic-lights-free-photo.jpeg");
    // const [imageUrl, setImageUrl] = useState<any>("https://archive.shine.cn/newsimage/2016/03/22/020160322000524.jpg");
    const [imageUrl, setImageUrl] = useState<any>(null);
    // const [imageUrl, setImageUrl] = useState<any>(FuturisticTest);

    // const [image] = useImage("https://archive.shine.cn/newsimage/2016/03/22/020160322000524.jpg");
    // const [image] = useImage("https://static.vecteezy.com/system/resources/previews/036/772/888/non_2x/ai-generated-traffic-on-the-freeway-in-large-traffic-lights-free-photo.jpeg");
    // const [image] = useImage(FuturisticTest);

    const [image, status] = useImage(imageUrl); // bawaan dari konva (status, image)

    // const points = [{x:100, y:200}, {x:150, y:250}]}

    // * area Safe
    const [points, setPoints] = useState<any>([]);
    // * area danger
    const [pointsDanger, setPointsDanger] = useState<any>([]);

    const [originalSize, setOriginalSize] = useState({ width:1, height:1});

    const pointsRef = useRef<any>(points);

    const [isDrawing, setIsDrawing] = useState(false);  // drawing waktu klik stage (layar gambar utama)
    const [isDrawingCircle, setIsDrawingCircle] = useState(false);  // drawing waktu klik circle

    const [posisiMouseStage, setPosisiMouseStage] = useState<any>([]);

    const [statusImage, setStatusImage] = useState<'loading'|'failed'|'loaded'|'nothing'>("nothing"); // image konva

    // select button (Safe / Danger)
    const [valSelectArea, setValSelectArea] = useState("Safe");  // default Select Button

    const [indexCircle, setIndexCircle] = useState<any>(null);

    // message untuk pesan (warning)
    const msgs = useRef<any>(null);
    const msgsCari = useRef<any>(null);

    // *** pesan dalam fieldset
    const [fieldTextSafe, setFieldTextSafe] = useState<any>(null);   // safe fieldset
    const [fieldTextDanger, setFieldTextDanger] = useState<any>(null); // danger fieldset

    const [idImageSelected, setIdImageSelected] = useState<any>(null); // id image yang terpilih

    // *** sample -> [ {id:1, isLoading:true, url:`https://...`} ]
    const [arrImage, setArrImage] = useState<any>([]);
    
    // ** Kumpulan semua image (objImageDrawn, objImageDrawnFlatMap) **
    // *** contoh "objImageDrawn" : {1: {'safe': [ {x:1, y:2}, {x:2, y:3}, {x:5, y:6} ], 
    //                                    'danger': [ {x:1, y:2}, {x:2, y:3}, {x:5, y:6} ] 
    //                                  }
    //                              , 2: {'safe': [ {x:1, y:2}, {x:2, y:3}, {x:5, y:6} ] }}

    const [objImageDrawn, setObjImageDrawn] = useState<any>({});    // kumpulan object image yang sudah di draw based on 'id'

    // *** contoh "objImageDrawnFlatMap" : {1: {'safe': [ [1,2], [3,4], [5,6] ], 
    //                   'danger': [ [1,2], [3,4], [5,6] ] }
    //              , 2: {'safe': [ [1,2], [3,4], [5,6] ] }}

    const [objImageDrawnFlatMap, setObjImageDrawnFlatMap] = useState<any>({});    // kumpulan object image yang sudah di draw based on 'id' dan flat map

    // *** untuk memeriksa ukuran layar menggunakan mui/material
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [disabledCari, setDisabledCari] = useState(true);

    const [isFetching,  setIsFetching] = useState(false); // State untuk menandakan proses sedang berlangsung

    // Prime React Select Button Group (wajib ada 'value' sebagai relasi)
    const listGridOptions = [
        {value:'Safe'},
        {value:'Danger'}
    ];

    // ** Filter
    const [selectedSite, setSelectedSite] = useState<any>([]);
    const [selectedPlace, setSelectedPlace] = useState<any>([]);
    const [disabledPlace, setDisabledPlace] = useState(true);
    const [statusCari, setStatusCari] = useState(false);
    const [statusSubmit, setStatusSubmit] = useState(false);

    const [startDate, setStartDate] = useState<Date | any>(new Date(new Date().setDate(1)));
    const [endDate, setEndDate] = useState<Date | any>(lastDayOfMonth(new Date()));

    // Multi Select
    const [sites, setSites] = useState<any>([]);
    const [places, setPlaces] = useState<any>([]);

    // .. end Filter

    // ** Drag Image List
    const containerRefImageList:any = useRef<any>(null);
    const [imgListIsDragging, setImgListIsDragging] = useState(false);
    const [imgListStartY, setImgListStartY] = useState(0);
    const [imgListScrollTop, setImgListScrollTop] = useState(0);

    
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

          const data_sites = await getDataSitesApi() || [];
  
          setSites(data_sites.length > 0 ? [...data_sites] : []);
  
          // ...
      }
  
      fetchData();
    },[])

    const clearMessage = (section:'validasi'|'cari') => {
      if (section == 'cari') {
        if (msgsCari.current) {
          msgsCari.current.clear();
        }
      }
      else if (section == 'validasi') {
        if (msgs.current) {
          msgs.current.clear();
        }
      }
    }


    const showMessage = (severity?:'error'|'info'|'warn'|'success', message?:any, section?:'validasi'|'cari') => {

        // *** pakai prime message

        if (section == 'validasi') {
            if (msgs.current) {
              msgs.current.clear();
              // ** sticky membuat life tidak bekerja
              msgs.current.show([
                  {sticky:false, life:5000, severity:`${severity}`, summary:'Warning', detail:`${message}`, closable: true},
                  // {sticky:false, life:1500,severity:'info', summary:'Info', detail:'Message content', closable: true},
                  // {sticky:false, life:2000,severity:'success', summary:'Info', detail:'Message content', closable: true},
                  // {sticky:false, life:2500,severity:'warn', summary:'Info', detail:'Message content', closable: true},
              ])
            }
        }
        else if (section == 'cari') {
            if (msgsCari.current) {
              msgsCari.current.clear();
              // ** sticky membuat life tidak bekerja
              msgsCari.current.show([
                  {sticky:false, life:5000, severity:`${severity}`, summary:'Warning', detail:`${message}`, closable: true},
                  // {sticky:false, life:1500,severity:'info', summary:'Info', detail:'Message content', closable: true},
                  // {sticky:false, life:2000,severity:'success', summary:'Info', detail:'Message content', closable: true},
                  // {sticky:false, life:2500,severity:'warn', summary:'Info', detail:'Message content', closable: true},
              ])
            }
        }
    }
    
    // useMountEffect(()=>{
    //     if (msgs.current) {
    //         msgs.current.clear();
    //         msgs.current.show([
    //             {sticky:true, severity:'error', info:'Warning', detail:'Message content', closeable: true}
    //         ])
    //     }
    // })


    useEffect(()=>{
      if (image){

        // naturalWidth / naturalHeight sudah bawaan dari image HTMLImageElement nya
        setOriginalSize({width: image.naturalWidth, height: image.naturalHeight})
      }

    },[image])

    useEffect(()=>{
        // *** status progress dari image konva yang loading
        // *** 3 status -> failed, loading, loaded

        // *** for test only show loading (setTimeout)
        // if (status == 'loading') {
        //   setTimeout(()=>{
        if (imageUrl != null) {

          if (status == 'loaded') {
              //  ** ambil data safe dan danger sesuai id gambar
              
              // alert('load')

              let objImgDrawn_safe_temp:any = objImageDrawn?.[idImageSelected]?.['safe'] ?? [];
              if (Array.isArray(objImgDrawn_safe_temp)) {
                objImgDrawn_safe_temp = objImgDrawn_safe_temp.map((obj, idx)=>{
                                          return {
                                            x: obj?.['x'], 
                                            y: obj?.['y']
                                          }
                                        });
              }

              let objImgDrawn_danger_temp:any = objImageDrawn?.[idImageSelected]?.['danger'] ?? [];
              if (Array.isArray(objImgDrawn_danger_temp)) {
                objImgDrawn_danger_temp = objImgDrawn_danger_temp.map((obj, idx)=>{
                  return {
                    x: obj?.['x'], 
                    y: obj?.['y']
                  }
                });
              }

              setTimeout(()=>{

                  if (Array.isArray(objImgDrawn_safe_temp) && objImgDrawn_safe_temp) {

                    setTimeout(()=>{
                      setPoints([...objImgDrawn_safe_temp]);
                    }, 100)

                    if (objImgDrawn_safe_temp.length > 0) {
                      setFieldTextSafe(JSON.stringify([...objImgDrawn_safe_temp]));
                    } else {
                      setFieldTextSafe(null);
                    }
                  } else {
                    setFieldTextSafe(null);
                  }

                  if (Array.isArray(objImgDrawn_danger_temp) && objImgDrawn_danger_temp) {

                    setTimeout(()=>{
                      setPointsDanger([...objImgDrawn_danger_temp]);
                    }, 100)

                    if (objImgDrawn_danger_temp.length > 0) {
                      setFieldTextDanger(JSON.stringify([...objImgDrawn_danger_temp]));
                    } else {
                      setFieldTextDanger(null);
                    }
                  } else {
                    setFieldTextDanger(null);
                  }


                  // *** jika sudah load points dan pointsDanger, maka progress bar di hide pada area drawing
                  setTimeout(()=>{
                    setStatusImage(status);
                  },300)
                  
              }, 500)
          }

        } else {
          setStatusImage('nothing')
        }

        //   },500)
        // }
    },[status, idImageSelected]) // status dari konva


    useEffect(()=>{
      // id image yang ter-select akan di render ke area drawing
      if (idImageSelected != null){

        if (Array.isArray(arrImage)) {
          let findItem = arrImage.find(obj=>obj?.['id'] == idImageSelected);
          if (findItem) {
            if (!findItem?.['isLoading']){

              // setStatusImage('loading');
              setTimeout(()=>{
                
                setImageUrl(findItem['url'] ?? null);
                // * setelah ini harus nya masuk ke useEffect [status, idImageSelected] untuk setPoints
                // * karena load image men-trigger status useImage 
              }, 100)
            }
          }
        }

      }
    },[idImageSelected])


    useEffect(()=>{
      // useRef -> template penampungan data untuk bisa di detect di event addEventListener window
      // pointsRef.current = points;   // update ref pada saat points berubah
      // console.log(points)
    },[points])

    useEffect(()=>{
      const handleClickEsc = (e) => {
        if (e.key == 'Escape'){
          // alert(JSON.stringify(pointsRef.current))
          // alert(JSON.stringify(points))

          // *** clear point sebelumnya
          if (valSelectArea == null) {
            // notify('info','Pilih salah satu Area (Safe / Danger) terlebih dahulu !', 'TOP_CENTER');
            showMessage('warn', "Pilih salah satu Area (Safe / Danger) terlebih dahulu !",'validasi');
            return;
          };
          

          if (valSelectArea == 'Safe') {
            let arrNew = points.slice(0,-1);
            setPoints([...arrNew])

            // setPoints(prevPoints=>{
            //   return [...prevPoints.slice(0,-1)];
            // })

            // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
            handleSaveToObjImage('safe', [...arrNew]);
          }
          else if (valSelectArea == 'Danger') {

            
            let arrNew = pointsDanger.slice(0,-1);


            setPointsDanger([...arrNew]);

            // setPointsDanger(prevPoints=>{
            //   return [...prevPoints.slice(0,-1)];
            // })

            // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
            handleSaveToObjImage('danger', [...arrNew]);

          }
          
        }
      }
      window.addEventListener('keydown', handleClickEsc);

      return () => window.removeEventListener('keydown', handleClickEsc);

    },[points, pointsDanger, valSelectArea])

    // const points = [
    //   {x: 100, y: 100},
    //   {x: 200, y: 150},
    //   {x: 300, y: 200},
    //   {x: 400, y: 250},
    // ]

    // Fungsi untuk cek apakah titik berada dalam poligon


    // Fungsi untuk menghitung jarak antara dua titik
const distanceBetweenPoints = (point1, point2) => {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
};

// Fungsi untuk menghitung jarak dari titik ke garis (sisi dari poligon)
const distanceToLineSegment = (point, lineStart, lineEnd) => {
  const lengthSquared = distanceBetweenPoints(lineStart, lineEnd) ** 2;
  if (lengthSquared === 0) return distanceBetweenPoints(point, lineStart);
  
  let t = ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + 
           (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / lengthSquared;
  
  t = Math.max(0, Math.min(1, t));
  
  const projection = { 
      x: lineStart.x + t * (lineEnd.x - lineStart.x), 
      y: lineStart.y + t * (lineEnd.y - lineStart.y)
  };
  
  return distanceBetweenPoints(point, projection);
};

// Fungsi utama untuk memeriksa apakah titik berada di dalam poligon atau dalam jarak tertentu dari sisi
// const isPointInOrNearPolygon = (point, polygon, maxDistance) => {
//   if (isPointInPolygon(point, polygon)) {
//       return true;
//   }
  
//   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//       if (distanceToLineSegment(point, polygon[i], polygon[j]) <= maxDistance) {
//           return true;
//       }
//   }
  
//   return false;
// };


    // ** Cek Tumpang Tindih
    // const isPointInPolygon = (point, polygon) => {
    //   let isInside = false;
    //   let x = point.x, y = point.y;
      
    //   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    //       let xi = polygon[i].x, yi = polygon[i].y;
    //       let xj = polygon[j].x, yj = polygon[j].y;
  
    //       let intersect = ((yi > y) !== (yj > y)) &&
    //                       (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    //       if (intersect) isInside = !isInside;
    //   }
  
    //   return isInside;

    //   // let isInside = false;
    //   // let minX = polygon[0].x, maxX = polygon[0].x;
    //   // let minY = polygon[0].y, maxY = polygon[0].y;
      
    //   // for (let n = 1; n < polygon.length; n++) {
    //   //     const q = polygon[n];
    //   //     minX = Math.min(q.x, minX);
    //   //     maxX = Math.max(q.x, maxX);
    //   //     minY = Math.min(q.y, minY);
    //   //     maxY = Math.max(q.y, maxY);
    //   // }

    //   // if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
    //   //     return false;
    //   // }

    //   // // let i = 0, j = polygon.length - 1;
    //   // for (let i, j = polygon.length; i < polygon.length; j = i++) {
    //   //     if ( (polygon[i].y > point.y) != (polygon[j].y > point.y) &&
    //   //         point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y-polygon[i].y) + polygon[i].x ) {
    //   //         isInside = !isInside;
    //   //     }
    //   // }

    //   // return isInside;
    // }

    useEffect(()=>{
        console.log("objImageDrawn");
        console.log(objImageDrawn);
        console.log("objImageDrawnFlatMap");
        console.log(objImageDrawnFlatMap);

        // ** tampilkan titik koordinat 'safe' ke fieldset
        let field_safe_area:any = objImageDrawn?.[idImageSelected]?.['safe'];
        if (Array.isArray(field_safe_area)) {
          field_safe_area = field_safe_area.map((obj, idx)=>{
              return {
                x: obj?.['x'],
                y: obj?.['y']
              }
          })
        }

        if (field_safe_area && field_safe_area != null && field_safe_area.length > 0){
          setFieldTextSafe(JSON.stringify([...field_safe_area]));
        } else {
          setFieldTextSafe(null);
        }

        // ** tampilkan titik koordinat 'danger' ke fieldset
        let field_danger_area:any = objImageDrawn?.[idImageSelected]?.['danger'];
        if (Array.isArray(field_danger_area)) {
          field_danger_area = field_danger_area.map((obj, idx)=>{
              return {
                x: obj?.['x'],
                y: obj?.['y']
              }
          })
        }

        if (field_danger_area && field_danger_area != null && field_danger_area.length > 0){
          setFieldTextDanger(JSON.stringify([...field_danger_area]));
        } else {
          setFieldTextDanger(null);
        }

    },[objImageDrawn, objImageDrawnFlatMap])

    const handleSaveToObjImage = (area:'safe'|'danger', newPoints:any) => {

      // contoh newPoints (sudah di gabung point baru) -> [{x:100, y:200}, {x:150, y:250}]}

      if (idImageSelected != null) {
        let objImage:any = {...objImageDrawn};
        objImage[idImageSelected] = {...objImage[idImageSelected], [area]:[...newPoints] };
        setObjImageDrawn({...objImage});

        let objImageFlat:any = {...objImageDrawnFlatMap};
        objImageFlat[idImageSelected] = {...objImageFlat[idImageSelected]
                                      , [area]:[...newPoints.map(pt=>[pt.x, pt.y])]};
        setObjImageDrawnFlatMap({...objImageFlat});

      }
    }

    // *** Drag / Tarik Garis Lines
    const handleImgMouseDown = (event) => {

      if (statusImage == 'loaded') {

        // * harus klik kiri (0 -> kiri, 2 -> kanan)
        if (event.evt.button != 0) return;

        if (valSelectArea == null) {
          // notify('info','Pilih salah satu Area (Safe / Danger) terlebih dahulu !', 'TOP_CENTER');
          showMessage('warn', "Pilih salah satu Area (Safe / Danger) terlebih dahulu !", 'validasi');
          return;
        }

        if (valSelectArea == 'Safe') {

          const stage = event.target.getStage();
          const pointerPosition = stage.getPointerPosition();
          const newPoint = {x: Math.round(pointerPosition.x), y: Math.round(pointerPosition.y)};

          // if (pointsDanger.length > 0 && isPointInPolygon(newPoint, pointsDanger)) {
          // const maxDistance = 10; // Tentukan jarak maksimum yang diperbolehkan
          // if (pointsDanger.length > 0 && isPointInOrNearPolygon(newPoint, pointsDanger, maxDistance)) {
          //   notify('error', 'Titik berada di dalam area Danger!', 'TOP_CENTER');
          //   return;
          // }

          // console.log(points)
          // * jika sudah 5 (point akhir), maka tidak bisa di draw lagi
          if (points.length > 4) return; 
  
          setIsDrawing(true);
  

          if (points.length === 3) {

            // sebelum menuju 4 (akhir), maka akan di tambahkan lagi point awal agar tersambung ke awal
            let processPoints = points.concat([{...newPoint}]).concat([{...points[0]}]);
            // update point baru
            setPoints([...processPoints]);

            // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
            handleSaveToObjImage('safe', [...processPoints]);
            
          }
          else if (points.length < 3) {
            // update point baru
            let processPoints = points.concat([{...newPoint}]);

            setPoints([...processPoints]);
            // setPoints(prevPoint=> prevPoint.concat([{...newPoint}]));

            // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
            handleSaveToObjImage('safe', [...processPoints]);

          }
        } // .. end area Safe
        else if (valSelectArea == 'Danger') {
            
            const stage = event.target.getStage();
            const pointerPosition = stage.getPointerPosition();

            const shape = stage.getIntersection(pointerPosition);
            const fillColor = shape.getFill();

            const newPoint = {x: Math.round(pointerPosition.x), y: Math.round(pointerPosition.y), fillHover: fillColor};

            // if (points.length > 0 && isPointInPolygon(newPoint, points)) {

            // const maxDistance = 10; // Tentukan jarak maksimum yang diperbolehkan
            // if (points.length > 0 && isPointInOrNearPolygon(newPoint, points, maxDistance)) {
            //   alert('masuk')
            //   notify('error', 'Titik berada di dalam area Safe!', 'TOP_CENTER');
            //   return;
            // }

            // console.log(points)
            // * jika sudah 5 (point akhir), maka tidak bisa di draw lagi
            if (pointsDanger.length > 4) return; 

            setIsDrawing(true);
    
  
            if (pointsDanger.length === 3) {
              // sebelum menuju 4 (akhir), maka akan di tambahkan lagi point awal agar tersambung ke awal
              let processPoints = pointsDanger.concat([{...newPoint}]).concat([{...pointsDanger[0]}]);

              // update point baru
              setPointsDanger([...processPoints]);

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('danger', [...processPoints]);
            }
            else if (pointsDanger.length < 3) {

              let processPoints = pointsDanger.concat([{...newPoint}]);
              // update point baru
              setPointsDanger([...processPoints]);
              // setPointsDanger(prevPoint=> prevPoint.concat([{...newPoint}]));

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('danger', [...processPoints]);
            }
        }
      }

    }
    // ... 

    const handleImgMouseMove = (event) => {

        // ** isDrawingCircle -> pada saat klik 'circle' untuk merevisi perubahan
        if (isDrawingCircle) {

          const stage = event.target.getStage();
          const position = stage.getPointerPosition();

          // ** Dapatkan property Color untuk hover circle
          const shape = stage.getIntersection(position);
          const fillColor = shape.getFill();

          const newPoints = {x: Math.round(position.x), y: Math.round(position.y), fillHover: fillColor};

          if (indexCircle != null) {
              
              if (valSelectArea == 'Safe') {
                  if (indexCircle != 0 && indexCircle != points.length-1) {

                        let prevPoints:any = [...points]; 
                        prevPoints.splice(indexCircle, 1, {...newPoints});
      
                        requestAnimationFrame(()=>{
                          setPoints([...prevPoints]);  

                          // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
                          handleSaveToObjImage('safe', [...prevPoints]);
                        })

                  } else {

                        let prevPoints:any = [...points];
                        prevPoints[0] = {...newPoints};
                        prevPoints[prevPoints.length-1] = {...newPoints};
                        requestAnimationFrame(()=>{
                          setPoints([...prevPoints]);

                          // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
                          handleSaveToObjImage('safe', [...prevPoints]);
                        })
                  }
              }
              else if (valSelectArea == 'Danger') {

                  if (indexCircle != 0 && indexCircle != pointsDanger.length-1) {

                      let prevPoints:any = [...pointsDanger]; 
                      prevPoints.splice(indexCircle, 1, {...newPoints});
    
                      requestAnimationFrame(()=>{
                        setPointsDanger([...prevPoints]);  

                        // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
                        handleSaveToObjImage('danger', [...prevPoints]);
                      })

                  } else {

                      let prevPoints:any = [...pointsDanger];
                      prevPoints[0] = {...newPoints};
                      prevPoints[prevPoints.length-1] = {...newPoints};
                      requestAnimationFrame(()=>{
                        setPointsDanger([...prevPoints]);

                        // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
                        handleSaveToObjImage('danger', [...prevPoints]);
                      })
                  }
              }

          }

          // console.log("Circle Leave");
          // console.log(newPoints);
        }
        // ... *** end (klik Circle )isDrawingCircle

        if (!isDrawing) return;

        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        const shape = stage.getIntersection(pointerPosition);
        const fillColor = shape.getFill();

        const newPoints = {x: Math.round(pointerPosition.x), y: Math.round(pointerPosition.y), fillHover: fillColor};

        // *** ambil item terakhir dari array points untuk di timpa dengan yang baru
        // let lastLines = points[points.length-1];
        // lastLines = {...newPoints};      
        // let arrNew:any[] = points.slice(0, -1).concat([lastLines]);

        if (valSelectArea == 'Safe') {

            if (points.length == 4) {
      
              let arrNew:any = points.slice(0,-1).concat([newPoints]).concat([{...points[0]}]);
              setPoints([...arrNew]);

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('safe', [...arrNew]);
            }
            else if (points.length == 5) {
              // 5 menandakan sudah mencapai titik terakhir yaitu 4 (titik 5 adalah titik awal agar tersambung jadi segi empat)
    
              let arrNew:any[] = points.slice(0, -2).concat([newPoints]).concat([{...points[0]}]);
    
              setPoints([...arrNew]);

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('safe', [...arrNew]);
            }
            else if (points.length < 4) {

              let arrNew:any[] = points.slice(0,-1).concat([newPoints]);
              
              setPoints([...arrNew]);
              // setPoints(points.slice(0,-1).concat([newPoints]));

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('safe', [...arrNew]);
            }
            // ... end Safe
        }
        else if (valSelectArea == 'Danger') {

            if (pointsDanger.length == 4) {
    
              let arrNew:any = pointsDanger.slice(0,-1).concat([newPoints]).concat([{...pointsDanger[0]}]);
              setPointsDanger([...arrNew]);

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('danger', [...arrNew]);
            }
            else if (pointsDanger.length == 5) {
              // 5 menandakan sudah mencapai titik terakhir yaitu 4 (titik 5 adalah titik awal agar tersambung jadi segi empat)
    
              let arrNew:any[] = pointsDanger.slice(0, -2).concat([newPoints]).concat([{...pointsDanger[0]}]);
    
              setPointsDanger([...arrNew]);

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('danger', [...arrNew]);
            }
            else if (pointsDanger.length < 4) {

              let arrNew:any[] = pointsDanger.slice(0,-1).concat([newPoints]);

              setPointsDanger(pointsDanger.slice(0,-1).concat([newPoints]));

              // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
              handleSaveToObjImage('danger', [...arrNew]);
            }
        }
    }


    const handleImgMouseUp = (event) => {
      setIsDrawing(false);
      checkOverlap();
    }

    // *** Untuk Tes Click image membentuk titik dan lines (flat)
    // Konversi titik-titik menjadi array dari angka [x1, y1, x2, y2, ..., xn, yn]
    // const linePoints = points.flatMap(point => [point.x, point.y]);

    // const handleClick = (event) => {
    //   // jika selain klik kiri maka tidak diizinkan (kiri = 0, kanan = 2)
    //   if (event.evt.button != 0) return;

    //     const stage = even t?.target.getStage();
    //     const pointerPosition = stage.getPointerPosition();
    //     const newPoint = {x: pointerPosition.x, y: pointerPosition.y};

    //     setPoints((prevPoints)=>{
    //       let temp_new = [...prevPoints, newPoint];
    //       if (temp_new.length === 4) {
    //         return [...temp_new, temp_new[0]];
    //       }
    //       return [...temp_new];
    //     });
    // }

    useEffect(()=>{

      setTimeout(()=>{

        // storeMenu terhubung ke Menu Main

        // dispatch icon title
        storeMenu.dispatch({type:'titleicon', text: 'ROI'})

        // dispatch breadcrumb path
        storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Maintenance', value:'Maintenance'}, {key:'ROI', value:'ROI'}]})
        
      },100)

  },[])


  const justifyTemplate = (option) => {
      return (
        <div className='d-flex align-items-center justify-content-center gap-2'>
          {
            option.value == 'Safe' && (
              <>
                <div className={`${styles['roi-color-area-safe']}`}></div>
                <span className={`roi-color-area-text-safe`}>{option.value}</span>
                {/* <i className={ title={option.value}></i> */}
                <img src={RandomLineGreen} width={17} height={17}/>
              </>
            )
          }
          {
            option.value == 'Danger' && (
              <>
                <div className={`${styles['roi-color-area-danger']}`}></div>
                <span className={`roi-color-area-text-danger`}>{option.value}</span>
                {/* <i className={option.icon} title={option.value}></i> */}
                <img src={RandomLineRed} width={17} height={17}/>
              </>
            )
          }
        </div>
      )
  }

  const handleChangeSelectArea = (e) => {
    // ** agar efek aktif warna background tidak hilang
    // if (e.value != null){
    //   if (e.value != valSelectArea) {
        setValSelectArea(e.value)
    //   }
    // }
  }

  const checkOverlap = () => {
    // if (points.length > 3 && pointsDanger.length > 3) {
    if (points.length === 5 && pointsDanger.length === 5) {

      // const poly2 = turf.polygon([ [[10.123,10.34], [1,6], [5,1], [6,1], [10.123,10.34]] ])
      // const safePolygon = turf.polygon([points.map(p=>[p.x, p.y]).concat([points[0].x, points[0].y])]);

      // ** Testing
      // const poly1 = turf.polygon([ 
      //                               [[151.59999084472656, 41.399993896484375]
      //                             , [268.59999084472656, 50.399993896484375]
      //                             , [253.59999084472656, 155.39999389648438]
      //                             , [157.59999084472656, 191.39999389648438]
      //                             , [151.59999084472656, 121.39999389648438]
      //                             , [151.59999084472656, 41.399993896484375]] 
      //                           ])
      // console.log(poly1);
      
      let safePolygon = turf.polygon([ points.map(p=>[p.x, p.y]) ]);
      let dangerPolygon = turf.polygon([ pointsDanger.map(p=>[p.x, p.y]) ]);

      // overlap -> jika ada garis bersinggungan sehingga tumpang tindih
      if (turf.booleanOverlap(safePolygon, dangerPolygon)) {
        // notify('error', 'Overlap detected between Safe and Danger areas !','TOP_CENTER', 3000);
        showMessage('error', "Overlap terdeteksi ada di antara area 'Safe' dan 'Danger' !", "validasi");
        return true;
      }

      // ** area luar 'safe', area dalam 'danger'
      if (turf.booleanContains(safePolygon, dangerPolygon)) { // area besar di atas area kecil (alias danger di dalam safe area)
        // notify('error', 'Warning, Danger areas inside the Safe areas !','TOP_CENTER', 3000);
        showMessage('error', "Area 'Danger' ada di dalam area 'Safe' !", "validasi");
        return true;
      }

      // ** area dalam 'safe', area luar 'danger'
      if (turf.booleanWithin(safePolygon, dangerPolygon)) { // area kecil di dalam area besar (alias 'safe' di dalam 'danger')
        // notify('error', 'Warning, Safe areas inside the danger areas !','TOP_CENTER', 3000);
        showMessage('error', "Area 'Safe' ada di dalam area 'Danger' !", "validasi");
        return true;
      }

      return false;
    }
    else {
      return false;
    }
  }

  useEffect(()=>{
    // checkOverlap();
    // if (points.length == 5){
    //   console.log(points)
    // } 
    console.log("points")
    console.log(points)
  },[points, pointsDanger])

  const handleCircleMouseDown = (e, index, areaHover:'Safe'|'Danger') => {

    // * jika sedang submit / save, maka tidak boleh lanjut
    if (statusSubmit) {
      return;
    }

    // click circle untuk 'Safe / Danger Area'
    if (valSelectArea == 'Safe' || valSelectArea == 'Danger') {

      // const stage = e.target.getStage();
      // const position = stage.getPointerPosition();
      // const newPoints = {x: position.x, y: position.y};

      if (areaHover == 'Safe') {
        if (valSelectArea == 'Safe'){

            if (typeof points?.[index] != 'undefined' && points?.[index] != null) {
      
              setIsDrawingCircle(true);
              setIndexCircle(index);
            }
        } 
      }
      else if (areaHover == 'Danger') {
        if (valSelectArea == 'Danger'){

            if (typeof pointsDanger?.[index] != 'undefined' && pointsDanger?.[index] != null) {
        
              setIsDrawingCircle(true);
              setIndexCircle(index);
            }
        }
      }
    }
  }

  const handleCircleMouseMove = (e, index) => {

      if (!isDrawingCircle) return;

      // if (valSelectArea == 'Safe') {

      //     const stage = e.target.getStage();
      //     const position = stage.getPointerPosition();
      //     const newPoints = {x: position.x, y: position.y};

      //     // *** (kondisi 1) selain index pertama dan terakhir (nilai ini sama)
      //     if (index != 0 && index != points.length-1) {

      //         let prevPoints:any = [...points];
      //         prevPoints.splice(index, 1, {...newPoints});
      //         console.log(prevPoints);

      //         requestAnimationFrame(()=>{
      //           setPoints([...prevPoints]);  
      //         })
      //     } 
      //     else {
      //         // *** (kondisi 2) index pertama dan terakhir

      //         let prevPoints:any = [...points];
      //         prevPoints[0] = {...newPoints};
      //         prevPoints[prevPoints.length-1] = {...newPoints};
      //         requestAnimationFrame(()=>{
      //           setPoints([...prevPoints]);
      //         })
      //     }


      // }
  }

  // const handleCircleMouseLeave = (e, index) => {
  //     if (isDrawingCircle) {

  //       if (valSelectArea == 'Safe') {
  //         const stage = e.target.getStage();
  //         const position = stage.getPointerPosition();
  //         const newPoints = {x: position.x, y: position.y};

  //         if (index != 0 && index != points.length-1) {

  //             let prevPoints:any = [...points];
  //             prevPoints.splice(index, 1, {...newPoints});
  //             console.log(prevPoints);

  //             setPoints([...prevPoints]);  

  //             console.log("leave");
  //             console.log(newPoints);
  //         }
  //       }
          
  //     }
  // }

  const handleCircleMouseUp = () => {
    setIsDrawingCircle(false);
    setIndexCircle(null);
    console.log("Mouse UP : false ")
  }

const handleClearArea = (area:'Safe'|'Danger') => {
  if (area == 'Safe') {
    if (points.length > 0){
        handleSwal('Clear Safe Area', null, (result:SweetAlertResult)=>{
          if (result.isConfirmed) {
            setPoints([]);
            // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
            handleSaveToObjImage('safe', []);

            showMessage('success', "Area 'Safe' sudah di hapus !", "validasi");
          }
        })
    } else {
      showMessage('info', "Tidak ada Area 'Safe' yang terdeteksi !", "validasi");
    }
  }
  else if (area == 'Danger') {
    if (pointsDanger.length > 0){
      handleSwal('Clear Danger Area', null, (result:SweetAlertResult)=>{
        if (result.isConfirmed) {
          setPointsDanger([]);

          // *** simpan ke object 'objImageDrawn' dan 'objImageDrawnFlatMap'
          handleSaveToObjImage('danger', []);

          showMessage('success', "Area 'Danger' sudah di hapus !", "validasi");
        }
      })
    } else {
      showMessage('info', "Tidak ada Area 'Danger' yang terdeteksi !", "validasi");
    }
  }
}

useEffect(()=>{
  // getDataImage('new');
},[])

  const handle_onLoadListImage = (idx) => {
      if (idx != null) {
        setTimeout(()=>{
          setArrImage(prevImage=>{
            let tempImage:any = [...prevImage];
            tempImage[idx]['isLoading'] = false;
            return [...tempImage];
          })
        },100)
      }
  }

  const getDataImage = (tipe:'new'|'merge') => {

      // *** Data Dummy
      let intArrImage:number = arrImage.length;
      let arrImageDummy = Array(20).fill(null).map((obj ,idx)=>{
          return {
              id: intArrImage++,    // id gambar
              isLoading: true,
              // url: `https://picsum.photos/600/${Math.floor((Math.random()*401)+400)}`
              url: TesROI
          }
      });

      if (tipe == 'new') {
        setArrImage([...arrImageDummy]);
      } else if(tipe == 'merge') {
        setArrImage(prevArr => {
            let temp:any = [...prevArr];
            if (arrImageDummy.length > 0) {
              temp = [...temp, ...arrImageDummy];
            }

            return [...temp];
        })
      }

      setTimeout(()=>{
        setArrImage(prevImage=>{
          return prevImage.map((obj, idx)=>{
              return {
                  ...obj,
                  isLoading: false
              }
          })
        })
      },7000) // ** setelah 7 detik maka isLoading di off kan semua
  }

  const handleSubmit = () => {
    if (checkOverlap()) {
      // jika ada issue overlap, maka tidak diteruskan
      return true;
    }

    if (idImageSelected == null) {
      showMessage('error', "Tidak ada gambar yang terpilih !", "validasi");
      return;
    }

    // cek kelengkapan area safe dan danger
    // * jika safe dan danger di bawah 5 titik, maka block
    if (
          (
            typeof points == 'undefined' ||
            (Array.isArray(points) && points.length < 5)
          ) 
          && 
          (
            typeof pointsDanger == 'undefined' ||
            (Array.isArray(pointsDanger) && pointsDanger.length < 5)
          ) 
    ) 
    {
        showMessage('error', "Periksa kembali dan harus di lengkapi Area 'Safe' atau 'Danger' !", "validasi");
        return
    }

    // * semua titik area 'Safe' harus dilengkapi jika ada minimal 1 titik
    if (
      (
        typeof points != 'undefined' &&
        (Array.isArray(points) && points.length > 0 && points.length < 5)
      )) 
    {
      showMessage('error', "Semua titik koordinat Area 'Safe' harus dilengkapi !", "validasi");
      return
    }

    // * semua titik area 'Danger' harus dilengkapi jika ada minimal 1 titik
    if (
      (
        typeof pointsDanger != 'undefined' &&
        (Array.isArray(pointsDanger) && pointsDanger.length > 0 && pointsDanger.length < 5)
      )) 
    {
      showMessage('error', "Semua titik koordinat Area 'Danger' harus dilengkapi !", "validasi");
      return
    }


    // * pastikan variabel objImageDrawnFlatMap untuk image terpilih ada data
    if (typeof objImageDrawnFlatMap?.[idImageSelected] == 'undefined' ||
        objImageDrawnFlatMap?.[idImageSelected] == null
    )
    {
        showMessage('error', "Tidak ada data koordinat 'Safe' atau 'Danger' !", "validasi");
        return
    }


    // // cek kelengkapan safe area
    // if (
    //       (
    //         typeof points == 'undefined' ||
    //         (Array.isArray(points) && points.length < 5)
    //       ) 
    // ) 
    // {
    //     showMessage('error', "Periksa kembali dan harus di lengkapi Area 'Safe' !");
    //     return
    // }

    // // cek kelengkapan danger area
    // if (
    //       (
    //         typeof pointsDanger == 'undefined' ||
    //         (Array.isArray(pointsDanger) && pointsDanger.length < 5)
    //       )
    // ) 
    // {
    //     showMessage('error', "Periksa kembali dan harus di lengkapi Area 'Danger' !");
    //     return
    // }

    handleSwal('Create', `ID : ${idImageSelected}` , (result:SweetAlertResult)=>{

      if (result.isConfirmed) {

        setStatusSubmit(true);


        let objSubmitToAPI:any;
        
        let objImageDrawnFlatMap_temp:any = objImageDrawnFlatMap?.[idImageSelected] ?? {};
        let roi_temp:any = {};

        let flatMap_safe:any = objImageDrawnFlatMap_temp?.['safe'];

        if (typeof flatMap_safe != 'undefined' &&
            (Array.isArray(flatMap_safe) && flatMap_safe.length > 0)
        ) {
          roi_temp = {...roi_temp, 'safe':flatMap_safe};
        }

        let flatMap_danger:any = objImageDrawnFlatMap_temp?.['danger'];
        if (typeof flatMap_danger != 'undefined' &&
            (Array.isArray(flatMap_danger) && flatMap_danger.length > 0)
        ) {
          roi_temp = {...roi_temp, 'danger':flatMap_danger};
        }
        
        const flat_area_coord = JSON.stringify(roi_temp);
        // * replace tanda backslash petik dua (\") jadi petik dua ("")
        const flat_area_coord_rev = flat_area_coord.replace(/\"/gi,"'");

        objSubmitToAPI = {
          ...objSubmitToAPI,
          "id_camera": idImageSelected,
          "storage_name": "img",
          "roi": flat_area_coord_rev,
          "created_at": Math.floor(new Date().getTime() / 1000),
          "created_by": parseInt(getValueFromLocalStorageFunc('IOT_USER_ID')),
          "updated_at": Math.floor(new Date().getTime() / 1000),
          "updated_by": parseInt(getValueFromLocalStorageFunc('IOT_USER_ID')),
        }

        const endpoint = `${URL_API_PPE}/v1/settings/`;
        const methodhit = `POST`;

        PPE_getApiSync(endpoint,
            objSubmitToAPI ?? null,"application/json",methodhit,
            getValueFromLocalStorageFunc("IOT_TOKEN") ?? "")
        .then((response)=>{
    
          // setLoaderStatus(true);
    
          let statusCodeError = response?.['statusCode']; // error dari internal
          if (typeof statusCodeError != 'undefined'){                
    
              notify("error", response?.['msg'], "TOP_CENTER");
    
              setTimeout(()=>{
                setStatusSubmit(false);
                // setLoaderStatus(false);
              },200)
    
              return
          }
            
          if (typeof response?.['detail'] != 'undefined'){
    
              notify("error", response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? '', "TOP_CENTER");
    
              setTimeout(()=>{
                  setStatusSubmit(false);
              },200)
    
              return
          }
          else {
              // jika success
              notify("success", "Your data was saved!", "TOP_CENTER");
    
              showMessage('success', "Data sudah di simpan !", "validasi");

              setTimeout(()=>{

                setStatusSubmit(false);

                // setLoaderStatus(false);
                // setShow(false);
                // outChange({tipe:'close_after_success_save', value: false, form:'create'});
              },200)
          }
          
          // alert(JSON.stringify(response))
        })
        
      }
    })

  }

  const handleClick_ImgList = (id) => {

    // * hanya id image yang di klik berbeda dengan id sebelum nya, baru akan di proses loading nya
    if (id != idImageSelected && (statusImage != 'loading')) {
      console.log(status)
      // * jika image tidak loading, baru akan di load
        if (Array.isArray(arrImage)) {
          let findItem = arrImage.find(obj=>obj?.['id'] == id);
          if (findItem) {
            if (!findItem?.['isLoading']){
  
                setStatusImage('loading');

                // *** PIIS
              // ** urutan parsing gambar ( clear points -> cari id url gambar -> parsing points)
                setTimeout(()=>{
                  setPoints([]);
                  setPointsDanger([]);

                  setTimeout(()=>{
                    setIdImageSelected(id); // lari ke useEffect '[status, idImageSelected]'
                  },200)

                }, 100)
  
  
            }
          }
        }
    }
  }

  const handleScrollImageList = async(e) => {

      if (isFetching) return;

      let scrollHeight = e.target.scrollHeight;
      let scrollTop = e.target.scrollTop;
      let offsetHeight = e.target.offsetHeight;

      let threshold = scrollHeight - offsetHeight - 50;
      
      if (scrollTop >= threshold) {
        
        setIsFetching(true);

        // getDataImage('merge');

        setTimeout(()=>{
          setIsFetching(false);
        }, 300)
        
      }
  }

  const handleClick_Watermark = () => {
    if (idImageSelected == null) {
      showMessage('warn', "Pilih Gambar terlebih dahulu !", "validasi");
      return
    }
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
  
  const handleChangeSite = async(e) => {
    // e.value => {name:..., city:...}
    setSelectedPlace([]);

    if (e.value.length >= 1){

      let objSelected:any = {...e.value[e.value.length-1]};
      setSelectedSite([objSelected]);

      let data_places:any = await getDataPlacesApi(objSelected?.['id'] ?? null);

      setPlaces(data_places ? [...data_places] : []);

      if (e.value.length > 0 
            // && places.length > 0 
          // && startDate != null && endDate != null
      ) {
        // setDisabledCari(false);
        setDisabledPlace(false);
      }

      if (e.value.length > 0 && places.length > 0 ) {
        setDisabledCari(false);
      } else {
        setDisabledCari(true);
      }
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
        // && startDate != null && endDate != null
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

  
  const generateArrImageCameraFunc = async(tanggal_start?:Date|null, tanggal_end?:Date|null, place_id?:any ) => {

    // if (tanggal_start != null && tanggal_end != null && place_id != null)
    if (place_id != null)
    {
            // *** nanti tambahkan id camera jika API sudah ready (parameter results)
            let start_month, end_month, periode;  // periode -> "2024-06"

            // start_month = format(tanggal_start, "yyyy-MM-dd", {locale:idLocale});
            // end_month = format(tanggal_end, "yyyy-MM-dd", {locale: idLocale});

            // let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cctvresults/places/?skip=0&limit=100&place_id=${place_id}&start_month=${start_month}&end_month=${end_month}`
            let resultdata = await PPE_getApiSync(`${URL_API_PPE}/v1/cameras/thumbnail/?place_id=${place_id}`
                  , null
                  , 'application/json'
                  , 'GET'
                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
            
            let statusCodeError = resultdata?.['statusCode']; // error dari internal
            let responseDetail = resultdata?.['detail'] // error dari api

            let arrImageCamera_temp = [...arrImage];

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
                              'id': obj?.['id'],
                              'url': obj?.['thumbnail_base64'] != '' && obj?.['thumbnail_base64'] != null ? obj?.['thumbnail_base64'] : null,
                              isLoading: true
                            }
                      });

                      // ** filter hanya yang ada gambar yang di tampilkan
                      raw_data_modif = raw_data_modif.filter(obj=>obj?.['url'] != null)

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
            
            // *** Tunggu API baru aktifkan 
            // setArrImage([...arrImageCamera_temp]);

           

            return [...arrImageCamera_temp];
    }
    return
  }

  const handleCari = async() => {

      // setShowLoaderMain(true);

      setImageUrl(null);  // link nya ke "const [image, status]"
      setIdImageSelected(null);

      setStatusCari(true);

      if (selectedSite.length > 0 && selectedPlace.length > 0
            // && startDate != null && endDate != null
      ) {
        
          // get Data Camera By Place
          let place_id = selectedPlace?.[0]?.id;
          if (place_id != null) {
              // ** tidak ada filter tanggal
              // let result = await generateArrImageCameraFunc(startDate, endDate, place_id);
              let result = await generateArrImageCameraFunc(null, null, place_id);

              if (!Array.isArray(result) || 
                  result == null ||
                  (Array.isArray(result) && result.length == 0)) 
              {
                setArrImage([]); 
                setImageUrl(null);  // link nya ke "const [image, status]"
                setIdImageSelected(null);
                setObjImageDrawn({});
                setObjImageDrawnFlatMap({});
                setPoints([]);
                setPointsDanger([]);

                showMessage("error", "Data Gambar tidak ada !", "cari");
              }
              

              if (Array.isArray(result) && result.length > 0) {

                  setObjImageDrawn({});
                  setObjImageDrawnFlatMap({});
                  setPoints([]);
                  setPointsDanger([]);

                  setArrImage([...result]);

                  clearMessage('cari'); // hide pesan 'tidak ada gambar' yang sudah muncul sebelum nya

                 // setelah 5 detik, maka semua loading akan di-false
                  setTimeout(()=>{
                    setArrImage(prevImages=>{
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
              } else  {setArrImage([])}

          } else {
            // setDatas([]);
            setArrImage([]);
            setImageUrl(null);
            setIdImageSelected(null);
            setObjImageDrawn({});
            setObjImageDrawnFlatMap({});
            setPoints([]);
            setPointsDanger([]);
          }
          
          setTimeout(()=>{
            // setStatusAwal(false);
            setStatusCari(false);  // aktifkan cari sebagai flag kalau sudah klik cari
            // setShowLoaderMain(false);
          },300)
          
      } else {

          // setDatas([]);
          setArrImage([]);
          setImageUrl(null);
          setIdImageSelected(null);
          setObjImageDrawn({});
          setObjImageDrawnFlatMap({});
          setPoints([]);
          setPointsDanger([]);

          setTimeout(()=>{
            // setStatusAwal(false);
            setStatusCari(false);
            // setShowLoaderMain(false);
          },300)
      }
  }

  const handle_MouseDown_ImageList = (e) => {
    // ** buat bisa scroll dengan cara drag ke bawah atau atas
      // console.log(e.target.scrollTop)
      const imgListScrollTop = containerRefImageList.current.scrollTop;
      const imgListStartY = e.pageY - containerRefImageList.current.offsetTop;

      setImgListIsDragging(true);
      setImgListScrollTop(imgListScrollTop);
      setImgListStartY(imgListStartY);

      // console.log("Scroll Top handle_MouseDown_ImageList : " + imgListScrollTop)
      // console.log("Start Y handle_MouseDown_ImageList : " + imgListStartY)
      // console.log("Offset Top handle_MouseDown_ImageList : " + imgListScrollTop)
  }

  const handle_MouseMove_ImageList = (e) => {

      if (!imgListIsDragging) return;

      const new_imgListScrollTop = containerRefImageList.current.scrollTop;
      const new_imgListStartY = e.pageY - containerRefImageList.current.offsetTop;
      const selisih = (new_imgListStartY - imgListStartY) * 1.5;

      containerRefImageList.current.scrollTop = imgListScrollTop - selisih;
      
  }

  const handle_MouseUp_ImageList = () => {
      setImgListIsDragging(false);
  }

  // ** Efek warna circle ketika di hover
  const handle_MouseEnter_CircleProperty = (e, indexCircle, areaHover:'Safe'|'Danger') => {
    
    if (areaHover == 'Danger') {
      if (valSelectArea == 'Danger') {
        let pointsDanger_Arr:any = [...pointsDanger];
        pointsDanger_Arr[indexCircle] = {...pointsDanger_Arr[indexCircle], fillHover: '#ff983e', strokeWidthHover: 5}

        setPointsDanger([...pointsDanger_Arr]);

        // console.log("pointsDanger_Arr")
        // console.log(pointsDanger_Arr)
      }
    }
    else if (areaHover == 'Safe') {
      if (valSelectArea == 'Safe') {
          let points_Arr:any = [...points];
          points_Arr[indexCircle] = {...points_Arr[indexCircle], fillHover: 'lightgreen', strokeWidthHover: 5}
          setPoints([...points_Arr]);
      }
    }

  }

  const handle_MouseLeave_CircleProperty = (e, indexCircle, areaHover:'Safe'|'Danger') => {

      if (areaHover == 'Danger') {
        if (valSelectArea == 'Danger') {
          let pointsDanger_Arr:any = [...pointsDanger];
          pointsDanger_Arr[indexCircle] = {...pointsDanger_Arr[indexCircle], fillHover: '#ff3e3e', strokeWidthHover: 1}
          setPointsDanger([...pointsDanger_Arr]);

          // console.log("pointsDanger_Arr")
          // console.log(pointsDanger_Arr)
        }
      }
      else if (areaHover == 'Safe') {
        if (valSelectArea == 'Safe') {
          let points_Arr:any = [...points];
          points_Arr[indexCircle] = {...points_Arr[indexCircle], fillHover: '#538000', strokeWidthHover: 1}
          setPoints([...points_Arr]);
        }
      }
  }

  return (
    <>

      {/* *** Filter */}
      {/* Periode Date Picker */}

        <div className='d-flex flex-column flex-sm-column flex-md-row align-items-stretch gap-2 ppe-anly-datepicker'>

            {/* <div className='d-flex justify-content-start align-items-stretch ppe-anly-datepicker-container'>

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
            </div> */}

            {/* <div className='d-flex align-items-center justify-content-center recordings-strip-between-date'>
                <span>-</span>
            </div> */}

            {/* <div className='d-flex justify-content-start align-items-stretch ppe-anly-datepicker-container'>

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
            </div> */}

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
                    disabled={statusSubmit}
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
                    disabled={disabledPlace || statusSubmit}
                />
            </div>
            <div>
                <ButtonPrime label="Cari" disabled={disabledCari || statusSubmit} onClick={handleCari} loading={statusCari} icon='pi pi-search' iconPos='left' className='custom-prime-size-small w-100' outlined>
                </ButtonPrime>
            </div>


        </div>

        <div className='roi-custom-prime-msg'>
            <Messages ref={msgsCari} />
        </div>

        <hr />
      {/* ... end Filter */}


        <div className='d-flex flex-column flex-sm-column flex-md-row gap-2'>

          {/* *** Container Left Side */}
            <div className={`col-12 col-sm-12 col-md-3 d-flex flex-column gap-2`}>
                <div>
                  <ButtonPrime label="Simpan" disabled={idImageSelected == null || statusSubmit} onClick={handleSubmit} loading={statusSubmit} icon='pi pi-save' iconPos='right' className={`custom-prime-size-medium w-100`} outlined></ButtonPrime>
                </div>

                <div className={`${styles['roi-image-container']}`} 
                      key={`roi-key`}
        // *** PIIS
        >

                    <ImageList sx={{height:'95vh', width:'100%'}}
                            
                          // onMouseDown={handle_MouseDown_ImageList}
                          // onMouseMove={handle_MouseMove_ImageList}
                          // onMouseUp={handle_MouseUp_ImageList}

                            ref={containerRefImageList}
                            onScroll={handleScrollImageList} 

                            gap={3}
                            // * jika layar di bawah 'sm' maka set col dalam imageList adalah '1', sedangkan
                            // * selain itu jika data image kosong, maka col = '1' (grid-template-column:repeat(1, 1fr))
                            // * data image ada isi nya set col = '2' (grid-template-column:repeat(2, 1fr))
                            cols={isSmallScreen ? 1 : arrImage.length == 0 ? 1 : 2} 
                            // rowHeight={isSmallScreen ? 200 : 200}
                            // rowHeight={300}
                            style={{margin:'auto', 
                                  height:`${'100%'}`, 
                                  overflow:'auto'}}
                          >

                        {
                          // *** list gambar kosong, image 'no image'
                          arrImage.length == 0 && (
                            <div className={`col-12 d-flex flex-column justify-content-center align-items-center
                                    ${styles['roi-noimage']}
                              `}>                        
                              <img src={ImageFolderAmico} width={200} height={200} />

                              <h4 style={{color:'grey', paddingBottom: '20px'}}>No Image</h4>
                            </div>
                          )
                        }


                        {
                          // *** Gambar ada
                            arrImage.length > 0 &&
                            arrImage.map((objItem, index) => {

                              {/* // *** random rows (0 atau 1) */}
                                return (
                                    <ImageListItem 
                                            key={`roi-img-key-${index}`}
                                            onClick={()=> (statusImage == 'loaded' || statusImage == 'nothing') && !statusSubmit && handleClick_ImgList(objItem?.['id'])}
                                            cols={arrImage.length <= 5 ? 2 : 1} // 2 -> full horizontal, 1 -> setengah nya
                                            rows={ index%2 == 1 ? 1 : 2}
                                            style={{opacity: statusImage == 'loading' || statusSubmit ? 0.5 : 1
                                                  , height: arrImage.length <= 5 ? '20%' : 'auto'
                                                  , userSelect:'none', msUserSelect:'none', MozUserSelect:'none', WebkitUserSelect:'none'}}
                                            // rows={ Math.floor((Math.random()*2)+1) }
                                            >

                                              {/* <> */}
                                                  {objItem?.['isLoading'] && (

                                                      <div className='d-flex justify-content-center align-items-center' 
                                                                style={{height:'100%'}}>

                                                          <RotatingLines visible={true}
                                                                width="35"
                                                                strokeColor='darkcyan'
                                                                animationDuration='0.75'
                                                          />
                                                      </div>
                                                  )}

                                                  <img 
                                                        // src={objItem.url} 
                                                        srcSet={objItem.url} 
                                                        style={{display: objItem?.['isLoading'] ? 'none':'block',
                                                          boxShadow: arrImage.length <= 5 ? '0 1px 10px 2px lightblue' : 'none'
                                                        }}
                                                        onLoad={()=>handle_onLoadListImage(index)}
                                                  />

                                                  {/* buat banner */}
                                                  <ImageListItemBar
                                                      className='roi-custom-img-list-itembar'
                                                      style={{display: objItem?.['isLoading'] ? 'none':'flex'}}
                                                      sx={{
                                                        background:
                                                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                                          fontFamily:'FF_Din_Font',
                                                          display:objItem?.['isLoading'] ? 'none':'block'
                                                      }}
                                                      title={objItem?.['id']}
                                                      position='top'
                                                      actionIcon={
                                                        <IconButton
                                                            sx={{color:'yellow'}}
                                                            aria-label={`star-${objItem?.['id']}`}
                                                        >
                                                            {
                                                              // ** Jika ada area safe dan danger full (Star Penuh)

                                                                typeof objImageDrawn?.[objItem?.['id']]?.['safe'] != 'undefined' &&
                                                                objImageDrawn?.[objItem?.['id']]?.['safe'] && 
                                                                Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) && 
                                                                (Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) 
                                                                      && objImageDrawn?.[objItem?.['id']]?.['safe'].length === 5) 
                                                              && 
                                                                typeof objImageDrawn?.[objItem?.['id']]?.['danger'] != 'undefined' &&
                                                                objImageDrawn?.[objItem?.['id']]?.['danger'] && 
                                                                Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) && 
                                                                (Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) 
                                                                      && objImageDrawn?.[objItem?.['id']]?.['danger'].length === 5) && 
                                                              
                                                              (
                                                                <Star />
                                                              )
                                                            }

                                                            {
                                                              // ** Jika ada salah satu area safe atau danger full (setengah bintang)
                                                              (
                                                                  (
                                                                    (typeof objImageDrawn?.[objItem?.['id']]?.['safe'] != 'undefined' &&
                                                                      objImageDrawn?.[objItem?.['id']]?.['safe'] && 
                                                                      Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) && 
                                                                      (
                                                                        Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) &&
                                                                        objImageDrawn?.[objItem?.['id']]?.['safe'].length === 5
                                                                      )
                                                                    ) 
                                                                          ||
                                                                    (typeof objImageDrawn?.[objItem?.['id']]?.['danger'] != 'undefined' &&
                                                                        objImageDrawn?.[objItem?.['id']]?.['danger'] && 
                                                                        Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) && 
                                                                        (
                                                                          Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) &&
                                                                          objImageDrawn?.[objItem?.['id']]?.['danger'].length === 5
                                                                        )
                                                                    )
                                                                  ) &&
                                                                  (
                                                                    (
                                                                        (
                                                                          Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) &&
                                                                          objImageDrawn?.[objItem?.['id']]?.['safe'].length != 5
                                                                        ) 
                                                                          ||
                                                                        (
                                                                          typeof objImageDrawn?.[objItem?.['id']]?.['safe'] == 'undefined'
                                                                        )
                                                                    )
                                                                    ||
                                                                    (
                                                                        (
                                                                          Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) &&
                                                                          objImageDrawn?.[objItem?.['id']]?.['danger'].length != 5
                                                                        )
                                                                          ||
                                                                        (
                                                                          typeof objImageDrawn?.[objItem?.['id']]?.['danger'] == 'undefined'
                                                                        )
                                                                    )
                                                                  )
                                                              )
                                                              && 
                                                              (
                                                                <StarHalf />
                                                              )
                                                            }

                                                            {
                                                              // jika dua-dua nya tidak lengkap maka Star kosong
                                                              (
                                                                (
                                                                    typeof objImageDrawn?.[objItem?.['id']]?.['safe'] == 'undefined' &&
                                                                    typeof objImageDrawn?.[objItem?.['id']]?.['danger'] == 'undefined'
                                                                )
                                                                ||
                                                                (
                                                                    (typeof objImageDrawn?.[objItem?.['id']]?.['safe'] == 'undefined' ||
                                                                        (Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) &&
                                                                            objImageDrawn?.[objItem?.['id']]?.['safe'].length === 0
                                                                        ) ||
                                                                        (Array.isArray(objImageDrawn?.[objItem?.['id']]?.['safe']) 
                                                                            && objImageDrawn?.[objItem?.['id']]?.['safe'].length < 5)
                                                                    )
                                                                    &&
                                                                    (typeof objImageDrawn?.[objItem?.['id']]?.['danger'] == 'undefined' ||
                                                                      (Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) &&
                                                                          objImageDrawn?.[objItem?.['id']]?.['danger'].length === 0
                                                                      ) ||
                                                                      (Array.isArray(objImageDrawn?.[objItem?.['id']]?.['danger']) 
                                                                          && objImageDrawn?.[objItem?.['id']]?.['danger'].length < 5)
                                                                    )
                                                                )
                                                              )
                                                              && (
                                                                <StarBorder sx={{color:'white'}}/>
                                                              )
                                                            }
                                                        </IconButton>
                                                      }
                                                      actionPosition='left'
                                                  />

                                              {/* </> */}

                                        {/* <ImageListItemBar />     */}

                                    </ImageListItem>

                                )
                            })
                        }

                    </ImageList>
                </div>
            </div>
          {/* ... end Container Left Side */}


          {/* *** Container Right Side */}
            <div className='col-12 col-sm-12 col-md-9'>

                <div className='mb-2 d-flex'>
                    <SelectButton className={`roi-custom-selectbutton-group
                                d-flex flex-column flex-sm-column flex-md-row justify-content-center
                              `} value={valSelectArea} onChange={(e)=>handleChangeSelectArea(e)} optionLabel="value" options={listGridOptions} itemTemplate={justifyTemplate} 
                              disabled={statusSubmit}
                    />

                    <div className='ms-auto roi-custom-clear'>
                        <div className='d-flex gap-1 pe-2 flex-column flex-sm-column flex-md-row'>
                            <ButtonPrime 
                                  // label="" 
                                  // disabled={disabledCari} onClick={handleCari} loading={false} 
                                  icon='pi pi-eraser' 
                                  iconPos='left' 
                                  title='Clear Safe Area'
                                  className={`custom-prime-safe`}
                                  aria-label='Safe' 
                                  severity='success'
                                  onClick={()=>handleClearArea('Safe')}
                                  rounded
                                  outlined
                                  disabled={statusSubmit}
                                  >
                            </ButtonPrime>
                            <ButtonPrime 
                                  // label="Danger" 
                                  // disabled={disabledCari} onClick={handleCari} loading={false} 
                                  icon='pi pi-eraser' 
                                  iconPos='left' 
                                  title='Clear Danger Area'
                                  className={`custom-prime-danger`} 
                                  severity='danger'
                                  onClick={()=>handleClearArea('Danger')}
                                  rounded={true}
                                  disabled={statusSubmit}
                                  outlined>
                            </ButtonPrime>
                        </div>
                    </div>
                </div>

                <div className='roi-custom-prime-msg'>
                    <Messages ref={msgs} />
                </div>

                <div className='d-flex align-items-start justify-content-start' 
                    style={{width:'100%', height:'70vh', position:'relative'
                      , border:'3px dashed lightblue', borderRadius:10, 
                      overflow:statusImage == 'loading' ? 'hidden':'auto'
                     }}
                >

                    <div className={`${styles['watermark-container']}`}
                        onClick={handleClick_Watermark}
                    >
                      {/* Watermark akan ditempatkan di sini */}
                      {/* <img src={FuturisticTest} width={50} height={50}/> */}
                      <div className={`${styles['watermark-image']}`}></div>
                    </div>

                    {
                      statusImage == 'loading' && (
                        <div className={`${styles['roi-progress']}`}>
                            <ProgressBar 
                              visible={statusImage=='loading'}
                              barColor='darkcyan'
                              borderColor='darkcyan'
                              width={200}
                              height={200}
                            />
                        </div>
                      )
                    }

                    {
                        image != null && (
                            <Stage width={image?.naturalWidth ?? 1} height={image?.naturalHeight ?? 1}
                                    // onClick={handleClick}
                                    onMouseDown={handleImgMouseDown}
                                    onMouseMove={handleImgMouseMove}
                                    // onMouseLeave={handleStageMouseLeave}    // khusus untuk klik circle jika terlalu cepat dan lost dari event mousemove circle
                                    onMouseUp={handleImgMouseUp}
                                    style={{zIndex:1, padding:'5px'}}
                                >
                              <Layer>

                                {statusImage == 'loaded' && image != null && (
                                  <Image image={image} x={0} y={0} width={originalSize.width} height={originalSize.height} 
                                      opacity={1}
                                    />
                                )}

                                
                                {/* *---- Cara ini yaitu klik circle, kemudian klik sisi lain untuk buat circle baru, sehingga terbentuk line di antara 2 circle */}
                                  {/* Garis yang menghubungkan titik-titik */}

                                  {/* Area Safe */}
                                  {
                                      statusImage == 'loaded' &&
                                      typeof points != 'undefined' &&
                                      points != null &&
                                      (Array.isArray(points) && points.length > 0) &&
                                      (
                                        <Line
                                            // points={linePoints}  // titik lines flat yang saling terhubung [x1, y1, x2, y2, ...]
                                            points={
                                                    points.flatMap(point=>[point.x, point.y])
                                                  }
                                            stroke={"lightgreen"}
                                            strokeWidth={7}
                                            shadowColor='white'
                                            shadowOffsetX={1}
                                            shadowOffsetY={1}
                                            lineJoin='bevel'
                                            lineCap='square'
                                        />
                                        // {/* ... end Area Safe */}
                                      )
                                  }


                                  {/* Area Danger */}
                                  {
                                      statusImage == 'loaded' &&
                                      typeof pointsDanger != 'undefined' &&
                                      pointsDanger != null &&
                                      (Array.isArray(pointsDanger) && pointsDanger.length > 0) &&
                                      (
                                        <Line
                                            // points={linePoints}  // titik lines flat yang saling terhubung
                                            points={pointsDanger.flatMap(point=>[point.x, point.y])}
                                            stroke={"#f8a3a3"}
                                            strokeWidth={7}
                                            shadowColor='white'
                                            shadowOffsetX={1}
                                            shadowOffsetY={1}
                                            lineJoin='bevel'
                                            lineCap='square'
                                        />
                                        // {/* ... end Area Danger */}
                                      )
                                  }


                                    {/* <Circle
                                        key={2}
                                        x={80}
                                        y={90}
                                        radius={8}
                                        fill={"red"}
                                        stroke={"lightred"}
                                        strokeWidth={1}
                                        shadowBlur={0}
                                        // shadowColor='grey' // buat error (jika statis)
                                        // shadowOffsetX={1}  // buat error
                                        // shadowOffsetY={1}  // buat error
                                        lineJoin='miter'
                                        lineCap='square'
                                      /> */}

                                  {/* Titik-titik yang dibuat oleh pengguna */}
                                  
                                  {/* Danger Area */}
                                  {
                                      statusImage == 'loaded' &&
                                      typeof pointsDanger != 'undefined' &&
                                      pointsDanger != null &&
                                      (Array.isArray(pointsDanger) && pointsDanger.length > 0) &&
                                      pointsDanger.map((point, index)=>{

                                          try{

                                            if (point.x >= 0 && point.y >= 0){
                                              return (
                                                <Circle
                                                  key={index}
                                                  x={point.x}
                                                  y={point.y}
                                                  radius={8}
                                                  onMouseDown={(e)=>handleCircleMouseDown(e, index, 'Danger')}
                                                  onMouseMove={(e)=>handleCircleMouseMove(e, index)}
                                                  onMouseUp={handleCircleMouseUp}
                                                  fill={point?.['fillHover'] ?? "#ff3e3e"}
                                                  stroke={"#f8a3a3"}
                                                  strokeWidth={point?.['strokeWidthHover'] ?? 1}
                                                  shadowBlur={0}
                                                  shadowColor='grey'
                                                  shadowOffsetX={1}
                                                  shadowOffsetY={1}
                                                  lineJoin='miter'
                                                  lineCap='square'
                                                  onMouseEnter={(e)=>handle_MouseEnter_CircleProperty(e, index, 'Danger')}
                                                  onMouseLeave={(e)=>handle_MouseLeave_CircleProperty(e, index, 'Danger')}
                                                />
                                              )
                                            }
                                          }catch(e){
                                            console.error("------ERROR CIRCLE DANGER------")
                                          }

                                      })
                                  }

                                  {/* Safe Area */}
                                  {
                                      statusImage == 'loaded' &&
                                      typeof points != 'undefined' &&
                                      points != null &&
                                      (Array.isArray(points) && points.length > 0) &&
                                      points.map((point, index)=>{

                                        try{
                                          if (point.x >= 0 && point.y >= 0){
                                            return (
                                              <Circle
                                                key={index}
                                                x={point.x}
                                                y={point.y}
                                                onMouseDown={(e)=>handleCircleMouseDown(e, index, 'Safe')}
                                                onMouseMove={(e)=>handleCircleMouseMove(e, index)}
                                                // onMouseLeave={(e)=>handleCircleMouseLeave(e, index)}
                                                onMouseUp={handleCircleMouseUp}
                                                radius={8}
                                                fill={point?.['fillHover'] ?? "green"}
                                                stroke={"lightgreen"}
                                                strokeWidth={point?.['strokeWidthHover'] ?? 1}
                                                shadowBlur={0}
                                                shadowColor='grey'
                                                shadowOffsetX={1}
                                                shadowOffsetY={1}
                                                lineJoin='miter'
                                                lineCap='square'
                                                onMouseEnter={(e)=>handle_MouseEnter_CircleProperty(e, index, 'Safe')}
                                                onMouseLeave={(e)=>handle_MouseLeave_CircleProperty(e, index, 'Safe')}
                                              />
                                            )
                                          }
                                        }catch(e){
                                          console.error("------ERROR CIRCLE SAFE------")
                                        }
                                      })
                                  }
                                  
                              </Layer>
                            </Stage>
                        )
                    }
                </div>
              
                <div style={{marginTop:'-12px'}}>
                    <div className='d-flex flex-column flex-md-row gap-2'>

                        <div className='roi-fieldset-container fieldset-safe col-12 col-md-5'>

                            <Fieldset legend="Safe" className='prime-custom-fieldset'>
                                {
                                  fieldTextSafe != null && (
                                      <>
                                        <p className='pt-4'>
                                            {fieldTextSafe}

                                            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  */}
                                        </p>
                                        <hr style={{margin:0}} />
                                        <div className='d-flex justify-content-end'>ID : {idImageSelected} </div>
                                      </>
                                  )
                                }
                                {
                                  fieldTextSafe == null && (
                                      <div className='d-flex flex-column gap-2 justify-content-center align-items-center'
                                          style={{cursor:'default'}}
                                      >
                                          <img src={Pencil} width={30} height={30}/>
                                          <span>No Area Selected</span>
                                      </div>
                                  )
                                }
                            </Fieldset>
                        </div>

                        <div className='roi-fieldset-container fieldset-danger col-12 col-md-5'>

                            <Fieldset legend="Danger" className='prime-custom-fieldset'>
                                
                                {
                                  fieldTextDanger != null && (
                                    <>
                                        <p className='pt-4'>
                                            {fieldTextDanger}
                                            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  */}
                                        </p>
                                        <hr style={{margin:0}} />
                                        <div className='d-flex justify-content-end'>ID : {idImageSelected} </div>
                                    </>
                                  )
                                }

                                {
                                  fieldTextDanger == null && (
                                      <div className='d-flex flex-column gap-2 justify-content-center align-items-center'
                                            style={{cursor:'default'}}
                                      >
                                          <img src={Pencil} width={30} height={30}/>
                                          <span>No Area Selected</span>
                                      </div>
                                  )
                                }
                            </Fieldset>
                        </div>
                    </div>

                </div>

            </div>

        </div>

          <ToastContainer
            draggable
            pauseOnHover
          />
    </>
  )
}

export default ROI