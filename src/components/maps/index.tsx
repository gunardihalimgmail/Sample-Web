import React, { useEffect, useRef, useState } from 'react'
import { GoogleMap, InfoBox, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api'
import { mapOptions_Aubergine, mapOptions_Dark, mapOptions_Night, mapOptions_Retro, mapOptions_Silver } from '../../services/mapstyle';
import './MapStyle.scss';
import { alertTitleClasses, Slider } from '@mui/material';
import { transform } from 'typescript';
import { CCTVSVG } from '../../assets';
import ReactHlsPlayer from 'react-hls-player';

interface MapComponentProps {
  type:'input'|'view_cctv'|'view_array_cctv',
  outChange:any,
  textStyle?:'dark'|'light',  // dark -> tulisan hitam, light -> tulisan putih
  defaultStyleMapNumber?:0|1|2|3|4|5,
  titleInfoWindow?:string,  // Title Info Window (e.g. CCTV Camera 1)
  urlVideo?:string, // URL Video Streaming CCTV
  array_video?: {
      camera_name?:string,
      camera_id?:number, 
      place_id?:number, // spbu
      endpoint?:string, // streaming video cctv
      latitude?:number,
      longitude?:number
  }[], // khusus utk view_array_cctv yg punya lebih dari satu video
  [key:string]:any
}

const MapComponent:React.FC<MapComponentProps> = ({type, outChange, textStyle, defaultStyleMapNumber, titleInfoWindow, urlVideo, array_video, ...props}) => {

  // tes info window
  const [pos, setPos] = useState<any>({lat:null, lng:null, camera_id:null});

  // array_video -> khusus untuk view_array_cctv

  const {lat, lng} = props;

  // lat -> latitude value
  // lng -> longitude value

  const [styleMapNumber, setStyleMapNumber] = useState<number>(4);  // style map berdasarkan option number (default ke aubergine)
  const [styleMap, setStyleMap] = useState<any|null>(null);  // style map dark, night, ...

  const {isLoaded, loadError} = useJsApiLoader({
    id:'google-map-script',
    googleMapsApiKey:'AIzaSyCFBk7EetvgE8Jut4FUlvmgTpLEzkd3HOw'
  })

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [showMap, setShowMap] = useState(true);

  // untuk streaming cctv
  const playerRef = useRef<HTMLVideoElement>(null);

  const [camerasArray, setCamerasArray] = useState<any>([]);
  const [playerRefArr, setPlayerRefArr] = useState<any>([]);

  
  useEffect(()=>{
    // generate ref only for view array cctv
    if (type == 'view_array_cctv') {
      if (Array.isArray(array_video)){
        let temp_arr_ref = Array.from({length: array_video.length},(_,idx)=>playerRefArr[idx] || React.createRef());
        setPlayerRefArr([...temp_arr_ref]);

        setCamerasArray([...array_video]);

      } else {
        setCamerasArray([]);
      }

      if (Array.isArray(array_video)){
        // khusus view_array_cctv, posisi awal lokasi zoom ambil index data pertama
        setSelectedLocation((objPrev)=>{
            return {
              ...objPrev,
              lat: array_video.length > 0 ? array_video[0]?.['latitude'] : -6.179390795905389,
              lng: array_video.length > 0 ? array_video[0]?.['longitude'] : 106.82778903999814,
            }
          });
      } else {
        setSelectedLocation((objPrev)=>{
          return {
            ...objPrev,
            lat: -6.179390795905389,
            lng: 106.82778903999814,
          }
        });
      }

    } else {setCamerasArray([])};

  },[array_video])


  useEffect(()=>{
    // kondisi awal default, set style map ke night

      styleMapFunc(styleMapNumber);

  },[styleMapNumber, styleMap])

  useEffect(()=>{
    if (defaultStyleMapNumber != null && defaultStyleMapNumber >= 0){
      styleMapFunc(defaultStyleMapNumber);
      setStyleMapNumber(defaultStyleMapNumber);
    }
  },[defaultStyleMapNumber])


  const styleMapFunc = (mapNumber:number) => {
    switch (mapNumber)
    {
        case 0: setStyleMap(null);break;  // standard
        case 1: setStyleMap(mapOptions_Silver); break; // silver
        case 2: setStyleMap(mapOptions_Retro); break; // retro
        case 3: setStyleMap(mapOptions_Dark); break; // dark
        case 4: setStyleMap(mapOptions_Night); break; // night
        case 5: setStyleMap(mapOptions_Aubergine); break; // aubergine
        default: setStyleMap(null); break;
    }
  }


  useEffect(()=>{

    // selain view_array_cctv, langsung set ke posisi indonesia saja
    if (type != 'view_array_cctv'){
      setSelectedLocation((objPrev)=>{
          return {
            ...objPrev,
            lat: lat
          }
        });
    }
  },[lat])

  // selain view_array_cctv, langsung set ke posisi indonesia saja
  useEffect(()=>{
    if (type != 'view_array_cctv'){
      setSelectedLocation((objPrev)=>{
        return {
          ...objPrev,
          lng: lng
        }
      });
    }
  },[lng])

  useEffect(()=>{
    return()=>{
      // reset ke lokasi indonesia
      setSelectedLocation({ // center
        lat: -6.179390795905389
        , lng: 106.82778903999814
      })
      
    }
  },[])

  
  const center = selectedLocation ? selectedLocation : {lat: -6.179390795905389, lng: 106.82778903999814};

  const handleMapClick = (event) => {

    if (type == 'input')
    {
      // console.log(event.latLng.lat())
      // console.log(event.latLng.lng())
      let latLng_temp = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
  
      setSelectedLocation({...latLng_temp});
  
      outChange({...latLng_temp})
  
      setPos({lat:null, lng:null})
    }
  };

  const [selectedMarker, setSelectedMarker] = useState(null);
  
  const markStyle = [
    {value:0, label:'Std.'},
    {value:1, label:'Silver'},
    {value:2, label:'Retro'},
    {value:3, label:'Dark'},
    {value:4, label:'Night'},
    {value:5, label:'Aubr.'}  //Aubergine
  ]

  const valueLabelFormat = (value:number) => {
    if (value == 0){
      return 'Standard'
    }
    if (value == 5){
      return 'Aubergine'
    } 
    return markStyle.find((mark)=>mark.value == value)?.['label'];
  }

  const handleChangeSlider = (event, newValue) => {
    // trigger ke useEffect
      setStyleMapNumber(newValue);
  }

  const handleMarker = (pos?) => {
    // variabel object pos -> 'lat, lng, camera_id (optional jika array baru dipakai)'

    // jika marker lebih dari satu (view_array_cctv), maka harus ada id yang bersangkutan yang muncul

    if (pos == null){
        setPos({lat:null, lng:null, camera_id:null})
        return
      }

      setPos({lat: pos.lat, lng: pos.lng, camera_id: pos?.['camera_id']});
      // setPos({...pos});

      // alert(pos.lng)
  }

  return isLoaded ? (
    <div style={{position:'relative', height:'80%'}} >
      
      {/* <div className={`ppe-maps-slider-style mb-2 px-3 px-md-0 ${textStyle ?? 'light'}`} */}
      <div className={`d-flex justify-content-end ppe-maps-slider-style mb-2 pe-3 ${textStyle ?? 'light'}`}
      > 
        <div style = {{width:'250px'}}>
            <Slider 
                aria-label="Map Style Slider"
                defaultValue={styleMapNumber}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay='auto'
                step={null}
                max={5}
                marks={markStyle}
                value={styleMapNumber}
                onChange={handleChangeSlider}
            />  
        </div>
      </div>

      {
        styleMapNumber > 0 && (
          <GoogleMap
              mapContainerStyle={{position:'relative', width:'100%', height:'100%', top:'10px', overflow:'hidden'}}
              center={center}
              zoom={5}
              onClick={handleMapClick}
              options={styleMap}
              clickableIcons={false} // click landmark (e.g. shop, ...)
              // onLoad={onLoad}
              // onUnmount={onUnmount}
          >
              {selectedLocation &&
                <>
                  { 
                    type == 'input' && 
                    (
                      <Marker key={1} position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                    )
                  }
                  {
                    type == 'view_cctv' && 
                    (
                        <>
                          <Marker key={2} position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} 
                            icon={{
                              url: CCTVSVG,
                              scaledSize: new window.google.maps.Size(50,50),
                              // origin: new window.google.maps.Point(0,0),
                              // anchor: new window.google.maps.Point(0,0)
                            }}
                            onClick={()=>handleMarker({ lat: selectedLocation.lat, lng: selectedLocation.lng })}
                          />
                          {
                            pos.lat && pos.lng && (
                              <InfoWindow
                                options={{ 
                                      maxWidth: 600,
                                      pixelOffset:new window.google.maps.Size(0, -50)
                                }}
                                position={pos}
                                onCloseClick={()=>handleMarker(null)}
                              >
                                  <div className='d-flex justify-content-start align-items-center flex-column' 
                                      style={{color:'black'}}>

                                      <h6 style={{backgroundColor:'lightblue', width:'100%', textAlign:'center'}} className='py-1'>CCTV - {titleInfoWindow ?? ''}</h6>
                                      
                                      {/* garis horizontal */}
                                      {/* <div style={{height:'2px', width:'100%',backgroundColor:'navy'}}></div> */}

                                      <div className='mt-0 w-100'>
                                        {/* // src={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"}
                                        // src={"https://cctvjss.jogjakota.go.id/atcs/ATCS_joktengkulon.stream/chunklist_w1632001161.m3u8"} */}
                                        <ReactHlsPlayer 
                                          src={`${urlVideo}`}
                                          width={'100%'}
                                          height={'100%'}
                                          autoPlay={true}
                                          controls={true}
                                          playerRef={playerRef}
                                         />
                                         
                                        {/* <iframe src={`${urlVideo}`} width="400" height="250" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe> */}
                                      </div>
                                      
                                  </div>
                              </InfoWindow>
                            )
                          }
                        </>
                    )
                  }

                  {
                    type == 'view_array_cctv' && 
                    (
                        <>
                          {
                              Array.isArray(camerasArray) && camerasArray.length > 0 && (
                                  <>
                                      {
                                          camerasArray.map((obj, idx)=>(

                                              <div key={`view-array-container-${idx}`}>
                                                  <Marker key={`view-array-cctv-key-${idx}`} position={{ lat: obj?.['latitude'] ?? 0, lng: obj?.['longitude'] ?? 0 }} 
                                                    // icon={{
                                                    //   url: CCTVSVG,
                                                    //   scaledSize: new window.google.maps.Size(50,50),
                                                    //   // origin: new window.google.maps.Point(0,0),
                                                    //   // anchor: new window.google.maps.Point(0,0)
                                                    // }}
                                                    onClick={()=>handleMarker({ lat: obj?.['latitude'] ?? 0, lng: obj?.['longitude'] ?? 0, camera_id: obj?.['camera_id'] })}
                                                  />
                                                  {
                                                    // *** hanya satu window yang muncul saja pada saat marker di klik
                                                    // *** variabel pos adalah global hanya satu titik yang di select
                                                      (pos?.['camera_id'] == obj?.['camera_id']) && pos?.['lat'] != null && pos?.['lng'] != null && (
                                                      <InfoWindow
                                                          options={{
                                                                  maxWidth: 600,
                                                                  pixelOffset:new window.google.maps.Size(0, -50)
                                                          }}
                                                          position={{lat: obj?.['latitude'], lng: obj?.['longitude']}}
                                                          onCloseClick={()=>handleMarker(null)}
                                                      >
                                                          <div className='d-flex justify-content-center align-items-center flex-column' 
                                                              style={{color:'black'}}>
                      
                                                              <h6 style={{backgroundColor:'lightblue', width:'100%', textAlign:'center'}} className='py-1'>CCTV - {titleInfoWindow ?? ''}</h6>
                                                              
                                                              {/* garis horizontal */}
                                                              {/* <div style={{height:'2px', width:'100%',backgroundColor:'navy'}}></div> */}
                      
                                                              <div className='mt-0 w-100'>
                                                                
                                                                <ReactHlsPlayer 
                                                                  src={`${obj?.['endpoint']}`}
                                                                  width={'100%'}
                                                                  height={'100%'}
                                                                  autoPlay={true}
                                                                  controls={true}
                                                                  playerRef={playerRefArr?.[idx]}
                                                                />
                                                                {/* <iframe src={`${urlVideo}`} width="400" height="250" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe> */}
                                                              </div>
                                                              
                                                          </div>
                                                      </InfoWindow>
                                                    )
                                                  }
                                              </div>
                                          ))
                                      }
                                  </>
                              )
                          }

                        </>
                    )
                  }
                </> 
              }
          </GoogleMap>
        )
      }

      {
        styleMapNumber == 0 && (
          <GoogleMap
              mapContainerStyle={{width:'100%', height:'100%', top:'10px'}}
              center={center}
              zoom={5}
              onClick={handleMapClick}
              clickableIcons={false} // click landmark (e.g. shop, ...)
              // onLoad={onLoad}
              // onUnmount={onUnmount}
          >
              {selectedLocation &&
                  <>
                    { 
                      type == 'input' && 
                      (
                        <Marker key={1} position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
                      )
                    }
                    {
                      type == 'view_cctv' && 
                      (
                          <>
                            <Marker key={2} position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} 
                              icon={{
                                url: CCTVSVG,
                                scaledSize: new window.google.maps.Size(50,50),
                                // origin: new window.google.maps.Point(0,0),
                                // anchor: new window.google.maps.Point(0,0)
                              }}
                              onClick={()=>handleMarker({ lat: selectedLocation.lat, lng: selectedLocation.lng })}
                            />
                            {
                              pos.lat && pos.lng && (
                                <InfoWindow
                                    options={{
                                            maxWidth: 600,
                                            pixelOffset:new window.google.maps.Size(0, -50)
                                    }}
                                    position={pos}
                                    onCloseClick={()=>handleMarker(null)}
                                >
                                    <div className='d-flex justify-content-center align-items-center flex-column' 
                                        style={{color:'black'}}>

                                        <h6 style={{backgroundColor:'lightblue', width:'100%', textAlign:'center'}} className='py-1'>CCTV - {titleInfoWindow ?? ''}</h6>
                                        
                                        {/* garis horizontal */}
                                        {/* <div style={{height:'2px', width:'100%',backgroundColor:'navy'}}></div> */}

                                        <div className='mt-0 w-100'>
                                          <ReactHlsPlayer 
                                            src={`${urlVideo}`}
                                            width={'100%'}
                                            height={'100%'}
                                            autoPlay={true}
                                            controls={true}
                                            playerRef={playerRef}
                                          />
                                          {/* <iframe src={`${urlVideo}`} width="400" height="250" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe> */}
                                        </div>
                                        
                                    </div>
                                </InfoWindow>
                              )
                            }
                          </>
                      )
                    }
                    {
                      type == 'view_array_cctv' && 
                      (
                          <>
                            {
                                Array.isArray(camerasArray) && camerasArray.length > 0 && (
                                    <>
                                        {
                                            camerasArray.map((obj, idx)=>(

                                                <div key={`view-array-container-${idx}`}>
                                                    <Marker key={`view-array-cctv-key-${idx}`} position={{ lat: obj?.['latitude'] ?? 0, lng: obj?.['longitude'] ?? 0 }} 
                                                      // icon={{
                                                      //   url: CCTVSVG,
                                                      //   scaledSize: new window.google.maps.Size(50,50),
                                                      //   // origin: new window.google.maps.Point(0,0),
                                                      //   // anchor: new window.google.maps.Point(0,0)
                                                      // }}
                                                      onClick={()=>handleMarker({ lat: obj?.['latitude'] ?? 0, lng: obj?.['longitude'] ?? 0, camera_id: obj?.['camera_id'] })}
                                                    />
                                                    {
                                                      // *** hanya satu window yang muncul saja pada saat marker di klik
                                                      // *** variabel pos adalah global hanya satu titik yang di select
                                                       (pos?.['camera_id'] == obj?.['camera_id']) && pos?.['lat'] != null && pos?.['lng'] != null && (
                                                        <InfoWindow
                                                            options={{
                                                                    maxWidth: 600,
                                                                    pixelOffset:new window.google.maps.Size(0, -50)
                                                            }}
                                                            position={{lat: obj?.['latitude'], lng: obj?.['longitude']}}
                                                            onCloseClick={()=>handleMarker(null)}
                                                        >
                                                            <div className='d-flex justify-content-center align-items-center flex-column' 
                                                                style={{color:'black'}}>
                        
                                                                <h6 style={{backgroundColor:'lightblue', width:'100%', textAlign:'center'}} className='py-1'>CCTV - {titleInfoWindow ?? ''}</h6>
                                                                
                                                                {/* garis horizontal */}
                                                                {/* <div style={{height:'2px', width:'100%',backgroundColor:'navy'}}></div> */}
                        
                                                                <div className='mt-0 w-100'>
                                                                  
                                                                  <ReactHlsPlayer 
                                                                    src={`${obj?.['endpoint']}`}
                                                                    width={'100%'}
                                                                    height={'100%'}
                                                                    autoPlay={true}
                                                                    controls={true}
                                                                    playerRef={playerRefArr?.[idx]}
                                                                  />
                                                                  {/* <iframe src={`${urlVideo}`} width="400" height="250" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe> */}
                                                                </div>
                                                                
                                                            </div>
                                                        </InfoWindow>
                                                      )
                                                    }
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                            }

                          </>
                      )
                    }
                  </> 
                // <Marker key={1} position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
              }
          </GoogleMap>
        )
      } 

    </div>
    
  ) : <div>Loading Maps ... </div>
}

export default MapComponent