import React, { SyntheticEvent, useState } from 'react'
import './MagnifyCustom.scss'
import { TesROI } from '../../../assets'

const MagnifyCustom = ({imgSrc, imgAlt, zoomLevel = 1}) => {
  const [position, setPosition] = useState<{x:number, y:number}>({x:0, y:0})
  const [showZoom, setShowZoom] = useState<boolean>(false);

  const handleMouseMove = (e:React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const {left, top, width, height} = target.getBoundingClientRect();
      
      const position_x = ((e.pageX - left) / width) * 100;
      const position_y = ((e.pageY - top) / height) * 100;

      setPosition({x: position_x, y: position_y});

      setShowZoom(true);
  }

  const handleMouseLeave = (e:React.MouseEvent<HTMLDivElement>) => {
    setShowZoom(false);
  }

  return (
    <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
            border:'1px dashed lightgrey',
            borderRadius:'20px',
            width:`100%`,
            height:`100%`,
            position:'relative'
        }}
        
    >
        {
          imgSrc !== null && (
            <img src={imgSrc} width={`100%`} height={`100%`} style={{
              position:'absolute',left:0, top:0, borderRadius:'20px'
            }} />
          )
        }


        {
          imgSrc !== null &&
          showZoom && (
              <div 
                  className='magnify-custom-large'
                  style={{
                    borderRadius:'20px',
                    backgroundImage:`url(${imgSrc})`,
                    backgroundSize:`${zoomLevel * 100}% ${zoomLevel * 100}%`,  // background size harus lebih dari 100% misal 200%, 300% agar backgroundPosition bisa berjalan
                    backgroundPosition:`${position.x}% ${position.y}%`,
                    backgroundRepeat:'no-repeat',
                    width:'100%',
                    height:'100%',
                    position:'absolute',
                    left:0,
                    top:0,
                    zIndex:2
                  }}
              >
              </div>
          )
        }

        {
          // highlight
          imgSrc !== null &&
          showZoom && (
              <div 
                  style={{
                    backgroundColor:'rgba(249,236,176,0.5)',
                    width:`65px`,
                    height:'75px',
                    position:'absolute',
                    left:`calc(${position.x}%)`,
                    top:`calc(${position.y}%)`,
                    transform:'translate(-50%, -50%)',
                    pointerEvents:'none', // nonaktifkan interaksi mouse
                    zIndex:3
                  }}
              >
              </div>
          )
        }

    </div>
  )
}

export default MagnifyCustom