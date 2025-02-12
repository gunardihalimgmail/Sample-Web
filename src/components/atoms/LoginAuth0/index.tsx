import React, { useEffect, useState } from 'react'
import { Button as ButtonPrime } from 'primereact/button';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Apple, Facebook, Google, Microsoft, Twitter } from '../../../assets';
import { jwtDecode } from 'jwt-decode';
import { useAuth0 } from '@auth0/auth0-react';

const LoginAuth0 = () => {

  // ** Login pakai auth0 yang mempunyai banyak pilihan sosial media 
  // https://manage.auth0.com/ --> create app baru dan konfigurasi sosial media apa yang diinginkan

  // Domain :
  // dev-0dt7fzw8l3l4f37r.us.auth0.com

  // Client ID : 
  // aN0IU5yayjvLasw7DWOCsrkYcMgz1QoG

  // Client Secret :
  // P_TsRnlHYDO7BwaqdidmGZ8Hv0wSLeWiUZfqhbx9bBiPzIeFPP4ohQ7fGn-BjcSV

  const [nameEmail, setNameEmail] = useState<any>();

  const { loginWithPopup, loginWithRedirect, getAccessTokenWithPopup, logout, user, error, isAuthenticated } = useAuth0();

  // console.error('---cek----')
  


  const handleLoginWithConnect = async (connection_param:any) => {
    try{

      // localStorage.removeItem('auth0spajs');

      // const logoutParams = {
      //   returnTo: window.location.origin, // Halaman tujuan setelah logout
      //   client_id: 'aN0IU5yayjvLasw7DWOCsrkYcMgz1QoG', // ID klien aplikasi Auth0 Anda
      // };
    
      // const logoutUrl = `https://dev-0dt7fzw8l3l4f37r.us.auth0.com/v2/logout`;

      // await logout({ logoutParams: { returnTo: window.location.origin } });


      // window.open(logoutUrl + '?' + new URLSearchParams(logoutParams).toString(), 'Auth0 Logout', 'width=600,height=600');

      // await logout({logoutParams:{returnTo:window.location.origin}})
      // await loginWithRedirect({ authorizationParams: { connection:'google-oauth2'}}); // buka halaman baru, lalu balik ke redirect_uri nya
      // await loginWithPopup({ authorizationParams: { connection:'google-oauth2'}});  // tetap stay di halaman yang sama

      await loginWithPopup({ authorizationParams: {
                                  // connection:'google-oauth2'
                                  connection: connection_param
                          }});  // tetap stay di halaman yang sama

      // ** Update data user lihat di 'useEffect'. Jangan langsung digunakan di sini karena masih membaca data session sebelumnya



      // const token = await getAccessTokenWithPopup();
      // console.log("token")
      // console.log(token)

      // setTimeout(()=>{
      //   // console.log(user)
      //   // console.log(error)
      //   // console.log(isAuthenticated)
      //   console.log(JSON.stringify(data, null, 2))
      // },100)

    }catch(e){
      console.error("Google Login Failed ", e)
    }

  }

  useEffect(()=>{
    if (user){
      const data = user;
      console.log('Update User : ', data)
    }
  },[user])
  
  return (
    <div>
      
        <div className='d-flex'>

            {/* Button Google Login */}
            <style>
              {`
                  .button-gmail-login {
                    border-radius:50% !important;
                    padding:10px;
                    box-shadow:none;
                  }

                  .button-common-login {
                    border-radius:50% !important;
                    padding:0px;
                    box-shadow:none;
                  }
              `}
            </style>

            <ButtonPrime outlined rounded severity='secondary'
                style={{width:'50px', height:'50px', borderRadius:'50%'}}
                className='ms-2 button-gmail-login d-flex justify-content-center align-items-center'
                onClick={()=>handleLoginWithConnect('google-oauth2')}
            >
                <img src={Google} width="100%" height="100%" />

            </ButtonPrime>

            <ButtonPrime outlined rounded severity='secondary'
                style={{width:'50px', height:'50px', borderRadius:'50%'}}
                className='ms-2 button-common-login d-flex justify-content-center align-items-center'
                onClick={()=>handleLoginWithConnect('facebook')}
            >
                <img src={Facebook} width="100%" height="100%" />

            </ButtonPrime>

            <ButtonPrime outlined rounded severity='secondary'
                style={{width:'50px', height:'50px', borderRadius:'50%'}}
                className='ms-2 button-common-login d-flex justify-content-center align-items-center'
                onClick={()=>handleLoginWithConnect('twitter')}
            >
                <img src={Twitter} width="100%" height="100%" />

            </ButtonPrime>

            <ButtonPrime outlined rounded severity='secondary'
                style={{width:'50px', height:'50px', borderRadius:'50%', border:0}}
                className='ms-2 button-common-login d-flex justify-content-center align-items-center'
                onClick={()=>handleLoginWithConnect('windowslive')}
            >
                <img src={Microsoft} width="100%" height="100%" />

            </ButtonPrime>

            <ButtonPrime outlined rounded severity='secondary'
                style={{width:'50px', height:'50px', borderRadius:'50%', border:0}}
                className='ms-2 button-common-login d-flex justify-content-center align-items-center'
                onClick={()=>handleLoginWithConnect('apple')}
            >
                <img src={Apple} width="100%" height="100%" />

            </ButtonPrime>
            {/* --- Button Google Login */}

        </div> 
    </div>
  )
}

export default LoginAuth0