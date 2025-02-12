import { toast, ToastContainer } from "react-toastify";
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {useEffect, useState} from 'react'
import { Outlet, useNavigate } from 'react-router'
import { IoTLogo, LogoBest } from '../../assets'
import { notify, getApiSync, generateExpiredDate, URL_API_LiVE } from '../../services/functions'
import './logincpo.scss'
import * as CryptoJS from 'crypto-js'
import Form from "react-bootstrap/Form";


const getSavedValue_Bool = (key, value) => {
    if (value != null){
      let dec_val = CryptoJS.AES.decrypt(value,"!otTIS88jkT").toString(CryptoJS.enc.Utf8);
      switch(dec_val){
          case 'false': 
              return false;
          case 'true':
              return true;
      }
    }
    else{
      return false;
    }
}

const getSavedValue_User_PWD = () => {
    // if (value != null){

      let obj_final = {};

      // BESTRM => Remember Me

      if (localStorage.getItem("BESTRM") == null)
      {
          obj_final = {
              ...obj_final,
              username: '',
              password: ''
          }
      }
      else
      if (localStorage.getItem("BESTRM") != null)
      {
          let dec_rm = ''
          if (localStorage.getItem("BESTRM") != null)
          {
            dec_rm = CryptoJS.AES.decrypt(localStorage.getItem("BESTRM"),"!otTIS88jkT").toString(CryptoJS.enc.Utf8);
          }
          else{
            dec_rm = '';
          }

          if (dec_rm == "true")
          {
              let dec_username = '';
              let dec_password = '';

              try {
                dec_username = CryptoJS.AES.decrypt(localStorage.getItem("BESTUSR"),"!otTIS88jkT").toString(CryptoJS.enc.Utf8);
                dec_password = CryptoJS.AES.decrypt(localStorage.getItem("BESTPWD"),"!otTIS88jkT").toString(CryptoJS.enc.Utf8);
              }catch(e){}

              obj_final = {
                  ...obj_final,
                  username: dec_username,
                  password: dec_password
              }
          }
          else{
              obj_final = {
                  ...obj_final,
                  username: '',
                  password: ''
              }
          }

          
      }

      return obj_final
    // }
    // else{
    //   return '';
    // }
}


const LoginCPO = () => {
  
  const navigate = useNavigate();

	let statusCheck:any;
  
  // cek jika bestlgn = "1", maka akan langsung redirect ke dashboard/tangki
  setTimeout(()=>{
      let dec_bestlgn = '';

      try {
          dec_bestlgn = CryptoJS.AES.decrypt(localStorage.getItem("BESTLGN"),'!otTIS88jkT').toString(CryptoJS.enc.Utf8);
          if (dec_bestlgn == "1")
          {
              // navigate({
              //   pathname:'/dashboard/tangki'
              // })
              navigate({
                pathname:'/dashboard/tangki'
              })
          }
          else{
           
          }
      }catch(e){
        dec_bestlgn = ''
      }
  },50)
  // ... end bestlgn

  useEffect(()=>{
    
    // DI PERIKSA JIKA SUDAH PERNAH LOGIN, MAKA AKAN LANGSUNG REDIRECT KE DASHBOARD/TANGKI
    if (localStorage.getItem("BESTLGN") != null)
		{
				try{
					let dec_bestlgn = CryptoJS.AES.decrypt(localStorage.getItem("BESTLGN"),'!otTIS88jkT').toString(CryptoJS.enc.Utf8);

					if (dec_bestlgn == "1"){
						// navigate("/dashboard/tangki")
            setTimeout(()=>{
              navigate({
                // pathname:'/dashboard/tangki'
                pathname:'/dashboard/tangki'
              })
            },50)
					}else{

              // HAPUS KEY EXPIRED
              if (localStorage.getItem("BESTEXP") != null){
                  localStorage.removeItem("BESTEXP")  
              }
          }
				}catch(e){}
    }
    else{
      // HAPUS KEY EXPIRED
      if (localStorage.getItem("BESTEXP") != null){
          localStorage.removeItem("BESTEXP")  
      }
    }

  
		if (localStorage.getItem("BESTRM") != null)
		{
				try{
					let dec_bestrm = CryptoJS.AES.decrypt(localStorage.getItem("BESTRM"),'!otTIS88jkT').toString(CryptoJS.enc.Utf8);
					if (dec_bestrm == "true"){
						statusCheck = "true"
					}
					else{
						statusCheck = "false"
					}
				}catch(e){ statusCheck = "false" }
		}
  })
  
  const [user, setUser] = useState(()=>{
      return getSavedValue_User_PWD()
  });

  const [checkRM, setCheckRM] = useState(()=>{
      // set default value untuk check remember me
      return getSavedValue_Bool("BESTRM", localStorage.getItem("BESTRM"))
  });
  
  const handleSubmit = () => {

    // alert(event.target.password.value)

    let inputValid:boolean = true;

    if (typeof(user?.['username']) == 'undefined' || user?.['username'].trim() == ""){
        document.getElementById("id-login-exclamation-username")!.style.visibility = "visible";
        document.getElementById("id-login-username")?.classList.add("alert-validate-username");
        inputValid = false;
    }
    if (typeof(user?.['password']) == 'undefined' || user?.['password'] == ""){
        document.getElementById("id-login-exclamation-password")!.style.visibility = "visible";
        document.getElementById("id-login-password")?.classList.add("alert-validate-password");
        inputValid = false;
    }

    if (!inputValid){
      return
    }
    
    getApiSync(URL_API_LiVE + "/login", null, null, {
              "username":user?.['username'],
              "password":user?.['password']
          }, 'application/x-www-form-urlencoded'
          , "POST"
    )
    .then((result)=>{
        if (result?.['statusCode'] == 200){

            let username = user?.['username'];
            let password = user?.['password'];
						let user_level = result?.['user_level'];
            let company_id_arr = JSON.stringify(result?.['company_id']);  //  [1,2,3,4]
            let company_select = JSON.stringify(result?.['company_select']);  //  [{"value": 1, "label": "PT. TASK 3"}]
            let device_arr = JSON.stringify(result?.['device_id']);  //  ["TANK12_HP_PAMALIAN", "TANK34_HP_PAMALIAN"]

            let statusKeep_User = keepToLocalStorage("BESTUSR", username);    // username
            let statusKeep_Pwd = keepToLocalStorage("BESTPWD", password);     // password

						let statusKeep_UserParsing = keepToLocalStorage("BESTUSRP", username);    // username parsing to dropdown title
            let statusKeep_Level = keepToLocalStorage("BESTLVL", user_level);     // user level (ADMIN, SUPER USER, USER)

            if (statusKeep_User && statusKeep_Pwd){
                let statusKeep_Login = keepToLocalStorage("BESTLGN", "1")  // status login '1'

                if (statusKeep_Login){
										if (statusCheck == "false")
										{
												localStorage.removeItem("BESTUSR")
												localStorage.removeItem("BESTPWD")
										}

                    let enc_time_exp = generateExpiredDate('hours',3);
                    if (localStorage.getItem("BESTEXP") == null) 
                    {
                        localStorage.setItem("BESTEXP", enc_time_exp)
                    }

                    // BESTCOMSEL => BEST COMPANY SELECT
                    let statusCompanyIDArr = keepToLocalStorage("BESTCOMID", company_id_arr);
                    let statusCompanySelectArr = keepToLocalStorage("BESTCOMSEL", company_select);
                    let statusDeviceIdArr = keepToLocalStorage("BESTDEVID", device_arr);
                    
                    // navigate("/dashboard/tangki")
                    navigate("/dashboard/tangki")
                }
            }
            else{
                removeFromLocalStorage("BESTLGN")  // hapus status login
                notify("error","Check your Local Storage !")  
            }
            
        }
        else
        {
            removeFromLocalStorage("BESTLGN")  // hapus status login
            if (typeof result?.['message'] != 'undefined' && result?.['message'] != null)
            {
                notify("error", result?.['message'])
            }
            else{
                notify("error","Check your Credential !")
            }
            return
        }
    })

    // navigate("/")   // redirect ke dashboard tangki

  }

  const handleChange = (event)=> {
    setUser({
        ...user,
        [event.target.name]: event.target.value
    })
  }  

  const handleKeyUp = (event) => {
      let username = user?.['username'];
      let password = user?.['password'];

      if (event.keyCode == 13)
      {

          if (typeof username != 'undefined' && username != '' &&
              typeof password != 'undefined' && password != '')
          {
            getApiSync(URL_API_LiVE + "/login", null, null, {
                      "username":username,
                      "password":password
                  }, 'application/x-www-form-urlencoded'
                  ,"POST"
            )
            .then((result)=>{
                
                if (result?.['statusCode'] == 200){
									
										let user_level = result?.['user_level'];
                    let company_id_arr = JSON.stringify(result?.['company_id']);  //  [1,2,3,4]
                    let company_select = JSON.stringify(result?.['company_select']);  //  [{"value": 1, "label": "PT. TASK 3"}]
                    let device_arr = JSON.stringify(result?.['device_id']);  //  ["TANK12_HP_PAMALIAN", "TANK34_HP_PAMALIAN"]

                    let statusKeep_User = keepToLocalStorage("BESTUSR", username);    // username
                    let statusKeep_Pwd = keepToLocalStorage("BESTPWD", password);     // password

                    let statusKeep_UserParsing = keepToLocalStorage("BESTUSRP", username);    // username parsing to dropdown title
										let statusKeep_Level = keepToLocalStorage("BESTLVL", user_level);     // user level (ADMIN, SUPER USER, USER)

                    if (statusKeep_User && statusKeep_Pwd){

												let statusKeep_Login = keepToLocalStorage("BESTLGN", "1")  // status login '1'

												if (statusKeep_Login){
														if (statusCheck == "false")
														{
																localStorage.removeItem("BESTUSR")
																localStorage.removeItem("BESTPWD")
														}

                            let enc_time_exp = generateExpiredDate('hours',3);
                            if (localStorage.getItem("BESTEXP") == null) 
                            {
                                localStorage.setItem("BESTEXP", enc_time_exp)
                            }
                            // BESTCOMSEL => BEST COMPANY SELECT
                            let statusCompanyIDArr = keepToLocalStorage("BESTCOMID", company_id_arr);
                            let statusCompanySelectArr = keepToLocalStorage("BESTCOMSEL", company_select);
                            let statusDeviceIdArr = keepToLocalStorage("BESTDEVID", device_arr);

														// navigate("/dashboard/tangki")
														navigate("/dashboard/tangki") 
												}
                    }
                    else{
												removeFromLocalStorage("BESTLGN")  // hapus status login
                        notify("error","Check your Local Storage !")  
                    }
                }
                else{
                    removeFromLocalStorage("BESTLGN")  // hapus status login
                    if (typeof result?.['message'] != 'undefined' && result?.['message'] != null)
                    {
                        notify("error", result?.['message'])
                    }
                    else{
                        notify("error","Check your Credential !")
                    }
                }
            })
          }
      }
  }

  const removeFromLocalStorage = (key:any) => {
        if (typeof key != 'undefined' && key != null){
            if (localStorage.getItem(key) != null){
                localStorage.removeItem(key)
            }
        }
  }

  const keepToLocalStorage = (key?:any, value?:any) => {
      if (typeof key != 'undefined' && typeof value != 'undefined' && 
          key != null && value != null){

        let chiperText = CryptoJS.AES.encrypt(value,"!otTIS88jkT").toString();
        // let originalText = CryptoJS.AES.decrypt(chiperText, "!otTIS88jkT").toString(CryptoJS.enc.Utf8)

        if (localStorage.getItem(key) != null){
            localStorage.removeItem(key)
        }

        localStorage.setItem(key, chiperText)
        
        return true
      }
      return false
      
  }

  const handleFocus = (event)=> {
    if (event.target.name == "username"){
        document.getElementById("id-login-exclamation-username")!.style.visibility = "hidden";
        document.getElementById("id-login-username")?.classList.remove("alert-validate-username");
    }
    if (event.target.name == "password"){
        document.getElementById("id-login-exclamation-password")!.style.visibility = "hidden";
        document.getElementById("id-login-password")?.classList.remove("alert-validate-password");
    }
  }  
  const handleBlur = (event)=> {
    if (event.target.name == "username"){
        document.getElementById("id-login-exclamation-username")!.style.visibility = "visible";
        document.getElementById("id-login-username")?.classList.add("alert-validate-username");
    }
    if (event.target.name == "password"){
        document.getElementById("id-login-exclamation-password")!.style.visibility = "visible";
        document.getElementById("id-login-password")?.classList.add("alert-validate-password");
    }
  }  

  // HIDE WARNING VALIDATION DI AWAL

  try {
    const intElement = setInterval(()=>{
      if (document.getElementById("id-login-username") != null && 
            document.getElementById("id-login-password") != null)
      {
          document.getElementById("id-login-exclamation-username")!.style.visibility = "hidden";
          document.getElementById("id-login-username")?.classList.remove("alert-validate-username");
        
          document.getElementById("id-login-exclamation-password")!.style.visibility = "hidden";
          document.getElementById("id-login-password")?.classList.remove("alert-validate-password");
          clearInterval(intElement)
      }
    })
  }catch(e){}

  const checkChange = (val, type:'remember') => {
      switch(type)
      {
        case 'remember':
            statusCheck = val.target.checked.toString();
            let enc_statusCheck = CryptoJS.AES.encrypt(statusCheck, "!otTIS88jkT").toString();
            
            keepToLocalStorage("BESTRM", statusCheck)
            
            // let dec_statusCheck = CryptoJS.AES.decrypt(enc_statusCheck, "!otTIS88jkT").toString(CryptoJS.enc.Utf8)
            break;
      }
  }

  return (

    <div className='login-container'>
        <div className='login-sub-container d-flex justify-content-center align-items-center'>

            <form className='form-login d-flex flex-column align-items-center'>

                  <div className='login-img-avatar'>
                        {/* <img src = {LogoBest} className='login-img-logo' /> */}
                        <img src = {IoTLogo} className='login-img-logo-iot' />
                  </div>
                  <span className='login-form-title'> Sign In </span>


                  <div className='login-input px-4 px-md-0 mb-2 alert-validate-username'
                            data-validate="Username is required"
                            id="id-login-username">

                      <input type = "text" className='login-input-style-username' 
                          name = "username" placeholder='Username'
                          defaultValue={user?.['username']}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onKeyUp={handleKeyUp}
                        />
                            
                      <span className='login-symbol-input'>
                            <FontAwesomeIcon icon = {faUser} />
                      </span>
                      {/* UNTUK EXCLAMATION JIKA TIDAK VALID */}
                      <span className='login-exclamation' id = "id-login-exclamation-username">
                      </span>
                  </div>

                  <div className='login-input px-4 px-md-0 alert-validate-password' 
                            data-validate="Password is required"
                            id="id-login-password">

                      <input type = "password" className='login-input-style-password' name = "password" placeholder='Password'  
                          defaultValue={user?.['password']}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onKeyUp={handleKeyUp}
                          />
                      <span className='login-symbol-input'>
                            <FontAwesomeIcon icon = {faLock} />
                      </span>
                      {/* UNTUK EXCLAMATION JIKA TIDAK VALID */}
                      <span className='login-exclamation' id = "id-login-exclamation-password">
                      </span>
                  </div>

                  <div className="px-4 px-md-2 d-flex justify-content-start w-100 mt-2 login-contain-check">

                        <Form.Check type={'checkbox'}>
                          {/* defaultChecked={this.state.chartTinggiModusJam.options.dataLabels.enabled} */}
                            <Form.Check.Input type={'checkbox'} 
                                className='login-border-check'
                                onChange={(val)=>{checkChange(val,'remember')}}
                                defaultChecked={checkRM}
                              />
                            <Form.Check.Label className='login-label-check-remember'>{`Remember Me`}</Form.Check.Label>
                            {/* <Form.Control.Feedback type="valid">
                              You did it! 
                            </Form.Control.Feedback> */}
                        </Form.Check>
                  </div>

                  <div className='login-submit-container mt-2 px-4 px-md-0'>
                      <button type = "button" className='login-btn-submit'
                          onClick={handleSubmit}>
                          Login
                      </button>
                  </div>

            </form>
        </div>

        <ToastContainer 
          draggable
          pauseOnHover
        />
    </div>
  )
}

export default LoginCPO