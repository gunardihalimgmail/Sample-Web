import React from 'react'
import styles from './CheckMarkAnimate.module.scss';

const CheckMarkAnimate = () => {
  return (
      <div  
          style={{backgroundColor:'white', width:'80px', height:'80px', margin:'0 auto'}}
      >
          <div className={`${styles['check-container']} d-flex justify-content-center align-items-center`}>

              <div style={{border:'0px solid red', 
                  background:'transparent',
                  zIndex:3,
                    width:'100%', position:'relative', height:'5em'}}
              >

                  {/* Tampil lapis kedua*/}
                    <div className={`${styles['check-half-circle-right']}`}></div>
                    <div className={`${styles['check-half-circle-left']}`}></div>

                  {/* Tampil lapis ketiga di depan --check mark */}
                    <div className={`${styles['check-idx-1']} ${styles['check-line-1']}`}>
                        <div className={`${styles['check-idx-2']} ${styles['check-line-2']}`}></div>
                    </div>

                    <div className={`${styles['check-container-front']}`}></div>

              </div>
          </div>
      </div>
  )
}

export default CheckMarkAnimate