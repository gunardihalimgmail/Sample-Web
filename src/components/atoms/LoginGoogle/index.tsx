import React, { useEffect, useState } from 'react'
import { Button as ButtonPrime } from 'primereact/button';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Google } from '../../../assets';
import { jwtDecode } from 'jwt-decode';

const LoginGoogle = () => {

  const [nameEmail, setNameEmail] = useState<any>();

  const handleLoginSuccess = async(credentialResponse:any) => {
    
    // window.google.accounts.oauth2.initTokenClient({
    //     client_id: '994442954425-snhnca7f4itjpp9d12lribd7gcatrfes.apps.googleusercontent.com',
    //     scope: 'https://www.googleapis.com/auth/userinfo.profile',
    //     callback: async(response) => {
    //         // console.log('Access Token:', response.access_token);
    //         // console.log('Credential (token):', response?.['credential']);
    //         // alert(response?.access_token)



    //         // Simpan Access Token untuk nanti digunakan
    //     }
    // }).requestAccessToken();

    
    // ** ambil User Profile
    
    
    if (credentialResponse?.credential) {

      let decoded = jwtDecode(credentialResponse?.credential)
      console.log(decoded);
      setNameEmail(decoded?.['name']);

    //   let data = await PPE_getApiSync(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses`
    //     ,null,'application/json','GET'
    //     ,credentialResponse?.credential ?? null, true
    //   );
  
    //     let status_api:number = data?.['http']?.['response']?.['status'];
    //     let result_api:any = data?.['result'];
  
    //     if (typeof status_api !== 'undefined' && status_api === 200){
    //         alert(JSON.stringify(result_api))
    //         setNameEmail(result_api?.['name'] ?? '')
    //     }
    //   // ---
    }
    else {
      setNameEmail('');
    }

    console.log(credentialResponse)
  }
  
  useEffect(()=>{
    // untuk logout
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
      console.log('berhasil logout')
    }
      
  },[])

  // useEffect(() => {

  //   // * pakai javascript untuk generate button login

  //   console.log("window.google.accounts")
  //   console.log(window.google.accounts)
  //   // Inisialisasi Google Identity Services
  //   if (window.google && window.google.accounts) {
      
  //     window.google.accounts.id.initialize({
  //       client_id: "994442954425-snhnca7f4itjpp9d12lribd7gcatrfes.apps.googleusercontent.com",
  //       callback: (response) => {
  //         console.log("Login Success:", response);
  //       },
  //     });

  //     // Render tombol login Google
  //     window.google.accounts.id.renderButton(
  //       document.getElementById("google-button")!,
  //       { theme: "outline", size: "large" }
  //     );
  //   }
  // }, []);

  
  const handleLoginFailure  = () => {
    // ** tambahkan di index.html untuk google.accounts
    // <script src="https://accounts.google.com/gsi/client" async defer></script>

    console.log('Login Failed')
  }

  const handleLogoutGoogle = () => {
    
    // document.cookie = "username=JohnDoe; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "username=JohnDoe; expires=Thu, 19 Dec 2024 08:46:10 GMT; path=/";  // lebih cepat 7 jam (-7 dari jam sekarang)

    console.log(document.cookie)
    // document.cookie = "https://accounts.google.com=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    if (window.google && window.google?.accounts){
      window.google.accounts.id.disableAutoSelect();  // Menonaktifkan otomatis login
      window.google.accounts.oauth2.revoke('{{access_token}}', (response)=>{
        alert('berhasil logout')
      })
      
    }
  }

  
  const loginGoogleCustom = useGoogleLogin({
    onSuccess: async(responses:any) => {
      console.log("Login success:", responses);

      
      if (responses?.access_token) {
        
        // ** tidak butuh aktifkan google people api
        // const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${responses?.access_token}`);


        // ** butuh aktifkan 'google people api' pada library 'https://console.cloud.google.com/apis/library?inv=1&invt=Abki6A&project=affable-hydra-390405'

        const response = await fetch(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses`, {
                                  headers: {
                                    Authorization: `Bearer ${responses?.access_token}`,
                                  },
        });
        const userInfo = await response.json();

        console.log(userInfo)
        console.log(userInfo?.['names']?.[0]?.['displayName'])
        setNameEmail(userInfo?.['names']?.[0]?.['displayName']);

        // setNameEmail(decoded?.['name']);
      }
    },
    onError: (error) => {
      console.log("Login failed:", error);
    },
  })

  return (
    <div>
        {/* <GoogleOAuthProvider clientId='994442954425-1fp80jsabja5thco4fbbb30agnqralve.apps.googleusercontent.com'> */}
        <GoogleOAuthProvider clientId='994442954425-snhnca7f4itjpp9d12lribd7gcatrfes.apps.googleusercontent.com'>
    
            <div className='d-flex'>
                {/* <h3>Google Sign In</h3> */}
                
                {/* <GoogleLogin onSuccess={handleLoginSuccess}
                  onError={handleLoginFailure}
                  /> */}

                {/* <div id="google-button"></div> */}


                {/* Button Custom */}
                {/* <button
                  onClick={() => loginGoogleCustom()}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Login with Google
                </button> */}


                {/* Button Google Login */}
                <style>
                  {`
                      .button-gmail-login {
                        border-radius:50% !important;
                        padding:10px;
                        box-shadow:none;
                      }
                  `}
                </style>

                <ButtonPrime outlined rounded severity='secondary'
                    style={{width:'50px', height:'50px', borderRadius:'50%'}}
                    className='ms-2 button-gmail-login d-flex justify-content-center align-items-center'
                    onClick={(event)=>loginGoogleCustom()}
                >
                    <img src={Google} width="100%" height="100%" />

                </ButtonPrime>
                {/* --- Button Google Login */}

                {/* <h4 className='ps-2 text-secondary'>{nameEmail}</h4> */}
                
                {/* <ButtonPrime label='Logout' outlined onClick={handleLogoutGoogle}/> */}

            </div> 
        </GoogleOAuthProvider>
    </div>
  )
}

export default LoginGoogle