import { Button as ButtonPrime } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Linkedin, Linkedin as LinkedinIcon } from '../../../assets'
import { LinkedIn, useLinkedIn } from 'react-linkedin-login-oauth2';


const LoginLinkedin = () => {

  {/* https://www.linkedin.com/developers/apps/220764860/auth */} // to get appId

  // https://www.linkedin.com/developers/apps/220764860/products?refreshKey=0 
  //  --- > Tab Product -> 'Sign In with LinkedIn using OpenID Connect' -> Request Access to OpenID Connect
  //  ----> jika tidak di aktifkan OIDC, maka akan ada peringatan "Your LinkedIn Network Will Be Back Soon"
  

  const authHandler = (err, data) => {

    if (err){
      console.log("Error ", err);
    }
    else {
      console.log('Data ', data)
    }
    window.close();
  }

  // const { linkedInLogin } = useLinkedIn({
  //   clientId: '8691ybdvv2ofa4',
  //   redirectUri: `${window.location.origin}`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
  //   onSuccess: (code) => {
  //     console.log(code);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  return (
    <div className='d-flex'>

        <style>
          {`
              .button-login-custom {
                border-radius:50% !important;
                padding:0px;
                box-shadow:none;
              }
          `}
        </style>

        

        {/* <img
          onClick={linkedInLogin}
          src={Linkedin}
          alt="Sign in with Linked In"
          style={{ maxWidth: '180px', cursor: 'pointer' }}
        /> */}
  

        <LinkedIn 
              clientId='8691ybdvv2ofa4' 
              redirectUri={`https://localhost:3000/transaksi/penjualan/form`} 
              scope='r_emailaddress r_liteprofile'
              // state="random_unique_state"
              state={`${Math.random().toString(36).substring(2)}`}
              onSuccess={(code)=>{
                console.log("success login linkedin");
                console.log(code)
              }}
              onError={(error)=>{
                console.log(error);
              }}
          >
            {({linkedInLogin})=>(

              // <button
              //     onClick={() => {
              //       // Logout LinkedIn sebelum login ulang
              //       window.open('https://www.linkedin.com/m/logout/', '_blank');
              //       setTimeout(() => {
              //         linkedInLogin(); // Login ulang
              //       }, 2000); // Tunggu beberapa detik
              //     }}
              //   >
              //     Login with LinkedIn
              //   </button>

                <ButtonPrime outlined rounded severity='secondary'
                     style={{width:'50px', height:'50px', borderRadius:'50%'}}
                     className='ms-2 button-login-custom d-flex justify-content-center align-items-center'
                     onClick={linkedInLogin}
                 >
                     <img src={LinkedinIcon} width="100%" height="100%" />
         
                 </ButtonPrime>
            )}
        </LinkedIn>

    </div>
  )
}

export default LoginLinkedin