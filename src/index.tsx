import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStoreHook } from 'react-redux';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import { legacy_createStore as createStore }  from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'

import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css"
import "react-clock/dist/Clock.css"

// import 'react-notifications/lib/notifications.css';
// import { ToastProvider } from 'rc-toastr';

// toastr
// import "rc-toastr/dist/index.css" // import the css file
import 'react-toastify/dist/ReactToastify.css';
import storeMenu from './stores';

// import PrimeReact UI Component
import {PrimeReactProvider} from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';  // tema yang dipilih
import 'primereact/resources/primereact.min.css';   // gaya dasar PrimeReact
import 'primeicons/primeicons.css';   // Ikon PrimeIcons
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Auth0Provider } from '@auth0/auth0-react';


// Redux (penyimpanan data global)
// const createStores = createStore;

// const globalState = {
//   totalOrder: 0
// }

// const rootReducer = (state = globalState, action:any) => {
//     return state
// }
// const storeRedux = createStores(rootReducer)
// ... <end>

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// HIDE CONSOLE WHEN BUILD
if (process.env.NODE_ENV == 'production'){
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

root.render(
  // react.strictmode => make running twice when first load
  
  // <React.StrictMode>  
      <Provider store={storeMenu}>
        <PrimeReactProvider value={{ripple:true}}>
            {/* <HashRouter> */}
            <BrowserRouter basename='/Sample-Web'>
              <GoogleOAuthProvider clientId="994442954425-snhnca7f4itjpp9d12lribd7gcatrfes.apps.googleusercontent.com">

                <Auth0Provider 
                    domain='dev-0dt7fzw8l3l4f37r.us.auth0.com'
                    clientId='aN0IU5yayjvLasw7DWOCsrkYcMgz1QoG'
                    // authorizationParams={{redirect_uri:window.location.origin}}
                    // cacheLocation='localstorage'
                >
                    <App />
                </Auth0Provider>

              </GoogleOAuthProvider>
            </BrowserRouter>
            {/* </HashRouter> */}
        </PrimeReactProvider>
      </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// ===== Local Storage Setup =====
// - IOT_TOKEN = access_token (from login)
// - IOT_USER = username
// - IOT_USER_ID = id user
// - IOT_PWD = password
// - IOT_REME = Remember Me (true / false)
// - IOT_IS_SPUSR = is superuser (true / false)


// Creator : Gunardi Halim
// Email : gunardihalim@gmail.com