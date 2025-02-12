import { Button as ButtonPrime } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Twitter } from '../../../assets'
// import FacebookLogin from 'react-facebook-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import TwitterLogin from 'react-twitter-login';


const LoginTwitter = () => {

  {/* https://developer.x.com/en/portal/projects/1871066569566273536/apps/29805188/settings */} // to get appId
  
  const [imgFB, setImgFB] = useState<any>(undefined);

  const authHandler = (err, data) => {

    if (err){
      console.log("Error ", err);
    }
    else {
      console.log('Data ', data)
    }
    window.close();
  }



  return (
    <div className='d-flex ms-2'>

        <style>
          {`
              .button-fb-login {
                border-radius:50% !important;
                padding:0px;
                box-shadow:none;
              }
          `}
        </style>

        
        {/* Api Key :
        RVXWoghyKIkcdO5xJcf8T4Zs4

        Api key secret :
        0tBP4CH74nJtBlcHYFjiLqDZ46AkIsciIj6PPF6jbWkvOuZCDx

        Access Token :
        1849804639782506496-1AWrpT7EepKFLiplM2qlrjq0xL0Kzo

        Access Token Secret :
        7O5efzXYkPCpGSBnZTKTCHV7vyfWDAhirKFBI6v0JBEcX

        Client ID : 
        V1l0blpCY0JxUG5tdUFuY29CLW46MTpjaQ

        Client Secret :
        XLRfAI5w1vtz4A7kswsXKCvCYYgwOfLICfwUUfV1rbZalnZ89q */}

        <TwitterLogin 
            authCallback={authHandler}
            consumerKey='RVXWoghyKIkcdO5xJcf8T4Zs4' // API key
            consumerSecret='0tBP4CH74nJtBlcHYFjiLqDZ46AkIsciIj6PPF6jbWkvOuZCDx' // API KEY Secret
            // callbackUrl='https://localhost:3000/transaksi/penjualan/form'  // tidak di support
            buttonTheme='light_short'  
        />

    </div>
  )
}

export default LoginTwitter