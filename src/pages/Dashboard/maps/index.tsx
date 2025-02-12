import React, { useState, useEffect } from 'react'
import './maps.scss'
// import * as mapboxgl from 'mapbox-gl';
import {Map} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'
// import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {ColumnLayer, TextLayer} from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import {BASEMAP} from '@deck.gl/carto';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowLeftLong, faArrowLeftRotate, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Source data CSV

// const DATA_URL =
  // 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});

const pointLight1 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51]
};

// const INITIAL_VIEW_STATE = {
//     // longitude: -1.415727,
//     // latitude: 52.232395,
//     longitude: -122.4,
//     latitude: 37.7,
//     zoom: 6.6,
//     minZoom: 1,
//     maxZoom: 15,
//     pitch: 40.5,
//     bearing: -27
// };

// https://github.com/visgl/deck.gl/blob/master/docs/api-reference/carto/basemap.md

// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';  // POSITRON
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';  // DARK MATTER with label
// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';  // VOYAGER
// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';  // POSITRON NOLABELS
// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';  // DARK MATTER with nolabels
// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json';  // VOYAGER_NOLABELS


// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'; // HEXAGON LAYER
// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'; //COLUMN LAYER

export const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];

function getTooltip({object}) {
    if (!object) {
        return null;
    }
    const lat = object.position[1];
    const lng = object.position[0];
    const count = object.points.length;
    console.log(JSON.stringify(object))

    return `\
        latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
        longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
        ${count} Accidents`;
}

// const data = [
//   {"colorValue":1,"elevationValue":10,"position":[-0.2266653190168401,51.58029959163221],
//     "points":[{"screenCoord":[255.69203973484528,341.9062337669563],
//     "source":[-0.21653456143689656,51.577062443952684],"index":4}],
//     "index":3,"filteredPoints":null}
// ]

// const data = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/hexagons.json'

let data = [
  // {"value":1,"centroid":[-122.403241,37.79088771],"vertices":[[-122.3993347,37.79178708],[-122.4021036,37.79398118],[-122.4060099,37.79308171],[-122.4071472,37.78998822],[-122.4043784,37.78779417],[-122.4004722,37.78869356]]},
  // {"value":0.3, "angka":500, "centroid":[-122.403241,37.79088771]}, // [longitude, latitude]

  // {"value":0.3, label_gl:'Tangki 1', angka:300, "centroid":[112.82396178746191,-2.2459264119923468], "centroid_text":[112.81996178746191,-2.2509264119923468]}, // [longitude, latitude]
  // {"value":0.5, label_gl:'Tangki 2', angka:500, "centroid":[112.82896178746191,-2.2459264119923468], "centroid_text":[112.82496178746191,-2.2509264119923468]},
  // {"value":0.9, label_gl:'Tangki 3', angka:900, "centroid":[112.83396178746191,-2.2459264119923468], "centroid_text":[112.82996178746191,-2.2509264119923468]},
  // {"value":0.6, label_gl:'Tangki 4', angka:600, "centroid":[112.83896178746191,-2.2459264119923468], "centroid_text":[112.83496178746191,-2.2509264119923468]},
]

let data_color_company = [
  // {id:1, company: 'PT. TASK 3', backgroundColor: [209, 38, 26], centroid: [112.80796178746191,-2.2339264119923468]},
  // {id:2, company: 'PT. TASK 1', backgroundColor: [170, 0, 100], centroid: [112.91337321337292,-1.8288906824033762]}
]


// const data = [
//   {COORDINATES:[-0.21653456143689656,51.577062443952684], 
//     value:10}
// ]
// const data = [
//     [-0.198465,51.505538],
//     // [-0.178838,51.491836],
//     [-0.205590,51.514910],
//     // [-0.208327,51.514952],
//     [-0.205590,51.514910],
//     [-0.41653456143689656,51.519062443952684],
//     [-0.21653456143689656,51.577062443952684]
// ]

// const data = [
//      {centroid: [-122.4, 37.7], value: 0.2}
//    ]

const MapsTangki = () => {

    // SESSION STORAGE DATA REAL TIME
    let getSession_obj = null;
    if (sessionStorage.getItem("BESTRTM") != null)
    {
          let getSession_Data_Realtime:any = sessionStorage.getItem("BESTRTM");
          try {
              getSession_obj = JSON.parse(getSession_Data_Realtime);
              if (Array.isArray(getSession_obj)){
                data = [...getSession_obj];
              }
          }catch(e){
              getSession_obj = null
              data = []
          }
          // console.log(getSession_obj)
    }

    // SESSION STORAGE DATA COMPANY
    if (sessionStorage.getItem("BESTCOM") != null)
    {
          let getSession_Data_Company:any = sessionStorage.getItem("BESTCOM");
          try {
              getSession_obj = JSON.parse(getSession_Data_Company);
              if (Array.isArray(getSession_obj)){
                data_color_company = [...getSession_obj];
              }
          }catch(e){
              getSession_obj = null
              data_color_company = []
          }
          // console.log(getSession_obj)
    }
    // ... <end> session storage
    

    const [stateZoom, setStateZoom] = useState(18);

    const INITIAL_VIEW_STATE = {
        // longitude: -122.4,
        // latitude: 37.7,
        longitude: 112.82396178746191,
        latitude: -2.2459264119923468,
        zoom: 7,
        minZoom:7,
        maxZoom: 15,
        pitch: 50,
        bearing: 0
    };

    // let conf:any = {
    //     data,
    //     mapStyle:MAP_STYLE,
    //     radius:1000,
    //     upperPercentile:100,
    //     coverage:1
    //   }

      // let coverage = 1;

      let layers:any = new ColumnLayer({
        id: 'ColumnLayer',
        colorRange,
        data,
        diskResolution: 50,   // default 12  (membentuk lingkaran / segitiga)
        radius: 250,
        extruded: true,
        pickable: true,
        coverage:0.7,
        elevationScale: 5000,
        getPosition: d => d.centroid,
        getFillColor: d => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        // getElevation: d => d.value * 50
        getElevation: d => d.value
      });

      // LAYER TEXT TANGKI
      let layers_text:any = new TextLayer({
        id: 'TextLayerTangki',
        data,
        pickable: false,
        coverage:0.7,
        elevationScale: 5000,
        background:true,
        getBackgroundColor:[127, 26, 209],
        getPosition: d => d.centroid_text,
        getText: d => d.label_gl,
        // getSize: 32,
        fontSettings:{
            sdf:true,
            smoothing:0.3,
        },
        getSize: stateZoom < 11 ? 0 : stateZoom,  // jika zoom di bawah 11, maka size font di nol kan, sebaliknya mengikuti font stateZoom
        getColor:d=>[255,255,255],
        getAngle: 60,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'top'
      });

      // LAYER TEXT COMPANY
      let layers_text_company:any = new TextLayer({
        id: 'TextLayerCompany',
        data: data_color_company,
        pickable: true,
        elevationScale: 5000,
        background:true,
        fontSettings:{
            sdf:true,
            smoothing:0.1,
        },
        getBackgroundColor: d => d.backgroundColor,
        getPosition: d => d.centroid,
        getText: d => d.company,
        getSize: 32,
        sizeMaxPixels: 23,
        getColor:d=>[255,255,255],
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'top'
      });

      // const layers = [
      //   new HexagonLayer({
      //     id: 'heatmap',
      //     colorRange,
      //     coverage: conf.coverage,    // coverage
      //     data: data,
      //     elevationRange: [0, 3000],
      //     elevationScale: data && data.length ? 50 : 0,
      //     extruded: true,
      //     getPosition: d => d,
      //     pickable: true,
      //     radius: conf.radius, //radius
      //     upperPercentile: conf.upperPercentile,   //upperPercentile
      //     material,
    
      //     transitions: {
      //       elevationScale: 3000
      //     }
      //   })
      // ];

      // --- BASEMAP
      // POSITRON
      // DARK_MATTER
      // VOYAGER
      // POSITRON_NOLABELS
      // DARK_MATTER_NOLABELS
      // VOYAGER_NOLABELS

  const  handleRequest = (viewState) =>{
    const { lat, lng, zoom} = viewState;

    setStateZoom(zoom)
  }
const navigate = useNavigate();

  const handleClickLink = (event) => {
    // event?.preventDefault();
    navigate({pathname: '/dashboard/tangki'})
  }

  

  return (
      <div>
          <Link to ={{
              pathname:'/dashboard/tangki'
          }}>
                <div className='map-back-link'>
                    <FontAwesomeIcon icon={faChevronLeft} fontSize={10}/>
                    <span className='ms-1'>Back</span>
                </div>
          </Link>

        <DeckGL 
            initialViewState={INITIAL_VIEW_STATE}
            layers={[layers, layers_text, layers_text_company]}
            controller={true}
            onViewStateChange={({viewState})=> handleRequest(viewState)}
            getTooltip={({object}) => {
                return (typeof object?.['company'] != 'undefined' && 
                    `${object?.['company']}`
                ) ||
                (
                  typeof object?.['label_gl'] != 'undefined' &&
                  `${'-'.repeat(10)} ${object?.['label_gl']} ${'-'.repeat(10)}\n` +
                  `Tinggi         : ${new Number(object?.['tinggi']).toLocaleString('en-US')} M\n` +
                  `Suhu           : ${new Number(object?.['suhu']).toLocaleString('en-US')} °C\n` +
                  `Volume Isi     : ${new Number(object?.['volume']).toLocaleString('en-US')} kg\n` +
                  `Volume Max     : ${new Number(object?.['volume_max']).toLocaleString('en-US')} kg\n` +
                  `Volume Isi (%) : ${new Number(object?.['volume_isi_percent']).toLocaleString('en-US')} %`
                )
              }} 
            >


          <Map reuseMaps mapLib={maplibregl} 
                // mapStyle={MAP_STYLE} 
                mapStyle={MAP_STYLE} 
                styleDiffing={true} 
            />
            </DeckGL>
      </div>
         
  )
}

{/* <DeckGL
            layers={layers}
            effects={[lightingEffect]}
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            getTooltip={getTooltip}
        >
            <Map reuseMaps mapLib={maplibregl} 
                mapStyle={MAP_STYLE} 
                styleDiffing={true} 
            />
        </DeckGL> */}

export default MapsTangki