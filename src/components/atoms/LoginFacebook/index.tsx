import { Button as ButtonPrime } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Facebook } from '../../../assets'
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


const LoginFacebook = () => {

  {/* https://developers.facebook.com/apps/ */} // to get appId Facebook
  
  const [imgFB, setImgFB] = useState<any>(undefined);

  const responseFB = (response) => {
    if (response?.accessToken){
      console.log("response")
      console.log(response)
      
      if (response?.picture?.data?.url) {
        setImgFB(response.picture.data.url);
      }
    }
    else {
      // console.error('LOGIN FAILED--------------')
      setImgFB(undefined);
    }
  }


  return (
    <div className='d-flex'>

        <style>
          {`
              .button-fb-login {
                border-radius:50% !important;
                padding:0px;
                box-shadow:none;
              }
          `}
        </style>

        

        <FacebookLogin 
            appId={process.env.REACT_APP_FACEBOOK_APP_ID} 
            autoLoad={false} 
            fields="name,email,picture" 
            callback={responseFB}
            disableMobileRedirect={true}
            // textButton={`Login With Facebook`}
            render={(renderProps)=>{
              return (
                <ButtonPrime outlined rounded severity='secondary'
                      style={{width:'50px', height:'50px', borderRadius:'50%'}}
                      className='ms-2 button-fb-login d-flex justify-content-center align-items-center'
                      onClick={renderProps.onClick}
                  >
                      <img src={Facebook} width="100%" height="100%" />
          
                  </ButtonPrime>
              )
            }}
        />

        {/* {
          imgFB && (
              <img src={imgFB} width={50} height={50} />
          )
        } */}
    </div>
  )
}

export default LoginFacebook