import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.scss'
import ImgBoyWithRocketLight from '../assets/images/boy-with-rocket-light.png'
import InputText from '../../components/atoms/InputText';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import CheckBoxInput from '../../components/atoms/CheckBoxInput';
import {IoTLogo} from '../../assets'
import { PPE_getApiSync, URL_API_PPE, encryptCode, getValueFromLocalStorageFunc, keepToLocalStorageFunc, notify, removeFromLocalStorageFunc } from '../../services/functions';
import { ToastContainer } from 'react-toastify';
import * as CryptoJS from 'crypto-js'

const label = { inputProps: {'aria-label':'checkbox-mui'}}

const Login = () => {

  const navigate = useNavigate();

	const [message, setMessage] = useState("");
	const [status, setStatus] = useState(0);

	const [valInput, setValInput] = useState({});	// input form sign in
	const [valInputForgot, setValInputForgot] = useState({});	// input form forgot
  
  const [valReMe, setValReMe] = useState(()=>{
      let var_reme = true;
      try{
          if (localStorage.getItem("IOT_REME") != null){
            var_reme = CryptoJS.AES.decrypt(localStorage.getItem("IOT_REME"), encryptCode).toString(CryptoJS.enc.Utf8) == "true" ? true : false;
          }
      }catch(e){
          var_reme = true;
      }
      return var_reme
  });  // remember me

  const [valDefaultReMe, setValDefaultReMe] = useState(()=>{
      let var_reme = true;
      try{
          if (localStorage.getItem("IOT_REME") != null){
            var_reme = CryptoJS.AES.decrypt(localStorage.getItem("IOT_REME"), encryptCode).toString(CryptoJS.enc.Utf8) == "true" ? true : false;
          }
      }catch(e){
          var_reme = true;
      }
      return var_reme
  });  // remember me

  const [focusRun, setFocusRun] = useState(false);  // set focus ke 'username' jika ada error
  const [valDefault, setValDefault] = useState({}); // set value secara default, misal remember me di checklist

	const [statusFormShowSignIn, setStatusFormShowSignIn] = useState(true);
	const [statusFormShowForgot, setStatusFormShowForgot] = useState(false);

	const [errorMsgForgot, setErrorMsgForgot] = useState("");
  
  const [disabledProp, setDisabledProp] = useState(false);

	const [inputInvalid, setInputInvalid] = useState({
		'username': false,
		'password': false
	});
	const [inputForgotInvalid, setInputForgotInvalid] = useState({
		'email': false
	});

	useEffect(() => {

    // Set value default to username / password if remember me checked
    if (getValueFromLocalStorageFunc("IOT_REME") == "true"){
        let obj_valDefault = {};
        let iot_user = getValueFromLocalStorageFunc("IOT_USER");
        if (iot_user != null){
          obj_valDefault = {...obj_valDefault, 'username': iot_user}
        }

        let iot_pwd = getValueFromLocalStorageFunc("IOT_PWD");
        if (iot_pwd != null){
          obj_valDefault = {...obj_valDefault, 'password': iot_pwd}
        }
        setValDefault({...obj_valDefault})
        setValInput({...obj_valDefault})
    }

		return () => {
    }
	}, []);

	// const handleFinalFormSubmit = (values: any) => {

	// 	const { ...dataLogin } = values;
	// 	let newDataLogin = {
	// 		username: dataLogin.username,
	// 		password: dataLogin.password
	// 	};

	// 	const res = login(newDataLogin);
	// 	res.then(function (response) {
	// 		if (response.statusCode == 200) {
	// 			setStatus(0);
	// 			history.push("/");
	// 			window.location.reload();
	// 		} else {
	// 			setMessage(response.message)
	// 			setStatus(response.statusCode)
	// 		}
	// 	});
	// }

	const onChangeInput = (val:any, form:any) => {
		let obj:any = val;

    if (typeof (obj?.['name']) != 'undefined' && obj?.['name'] != null){
      if (obj?.['name'] == 'remember_me')
      {
        setValReMe(obj?.['value'])
      }
    }
    

		if (form == 'signin')
		{
			if (typeof (obj?.['name']) != 'undefined' &&
				typeof (obj?.['value']) != 'undefined'){

				let valInputTemp:any = {...valInput};	// copy ke variable temp
				valInputTemp[obj?.['name']] = obj?.['value'];
				setValInput(valInputTemp);
				// console.log(valInputTemp)
			}
		}
		else if (form == 'forgot')
		{
			if (typeof (obj?.['name']) != 'undefined' &&
				typeof (obj?.['value']) != 'undefined'){
	
				let valInputForgotTemp:any = {...valInputForgot};	// copy ke variable temp
				valInputForgotTemp[obj?.['name']] = obj?.['value'];
				setValInputForgot(valInputForgotTemp);
				// console.log(valInputForgotTemp)
			}
		}
	}

	const handleClickForgot = (jenisForm:any) => {
		if (jenisForm == 'forgot')
		{
			setStatusFormShowForgot(true);
			setStatusFormShowSignIn(false);
		}
		else if (jenisForm == 'back_to_login')
		{
			setStatusFormShowForgot(false);
			setStatusFormShowSignIn(true);
		}
	}

	const handleFinalSubmit = (form:any) => {

		if (form == 'signin')
		{
      
			let inputInvalidTemp = {...inputInvalid};
			Object.keys(inputInvalidTemp).forEach((key)=>{
				let val:any = valInput?.[key];
				if (val == null || typeof val == 'undefined' || val == ""){
					inputInvalidTemp[key] = true;
				}
				else {
					inputInvalidTemp[key] = false;
				}
			})
			setInputInvalid({
				...inputInvalidTemp
			});

			let findInvalid = Object.keys(inputInvalidTemp).find((x)=>{return inputInvalidTemp[x]})
			if (findInvalid){
				console.log("Invalid");
        setTimeout(()=>{
          setDisabledProp(false);
        },200)
				return
			}

      setDisabledProp(true);

      // notify("error","Credential Error","TOP_RIGHT");

      PPE_getApiSync(URL_API_PPE + "/v1/login/access-token",{
          'username': valInput?.['username'],
          'password': valInput?.['password']
      },"application/x-www-form-urlencoded","POST")
      .then( async(response)=>{

          let statusCodeError = response?.['statusCode']; // error dari internal
          if (typeof statusCodeError != 'undefined'){
              notify("error", response?.['msg'], "TOP_RIGHT");
              setTimeout(()=>{
                setDisabledProp(false);

                setTimeout(()=>{
                  setFocusRun(true);
                },10)

              },200)
              return
          }

          let accessToken = response?.['access_token'];

          if (typeof accessToken != 'undefined' && accessToken != null && accessToken != ""){

              let db_token = await PPE_getApiSync(URL_API_PPE + "/v1/users/me",
                                  null,"application/json","GET",
                                  accessToken.toString());
              
              keepToLocalStorageFunc("IOT_REME", valReMe.toString()); // remember me
              keepToLocalStorageFunc("IOT_TOKEN", accessToken.toString());  // access token
              keepToLocalStorageFunc("IOT_USER_ID", db_token?.['id'].toString());  // user id (untuk save data)
              keepToLocalStorageFunc("IOT_IS_SPUSR", db_token?.['is_superuser'].toString());  // superuser (true / false)

              if (valReMe){ // jika dichecklist remember me
                keepToLocalStorageFunc("IOT_USER", valInput?.['username']);
                keepToLocalStorageFunc("IOT_PWD", valInput?.['password']);
              } else {
                removeFromLocalStorageFunc("IOT_USER");
                removeFromLocalStorageFunc("IOT_PWD");
              }
              
              setTimeout(()=>{
                setDisabledProp(false);
                navigate("/dashboard");
              },200)
              // UPDATE LAGI : ISI TOKEN KE LOCAL STORAGE
              return
          }
          else {
            
              let statusCodeError = response?.['detail']; // error dari internal
              if (typeof statusCodeError != 'undefined'){
                  notify("error", response?.['detail'], "TOP_RIGHT");

                  setTimeout(()=>{
                    setDisabledProp(false);
                  },200)

                  setTimeout(()=>{
                    setFocusRun(true);
                  },250)

                  setTimeout(()=>{
                    setFocusRun(false);
                  },280)

                  return
              }
          }
          
          // alert(JSON.stringify(response))
      })

			// kondisi berhasil login
			// history.push("/main");
      // navigate('/');

		}
		else if (form == 'forgot')
		{
			let CekInvalid:boolean = false;
			let inputForgotInvalidTemp = {...inputForgotInvalid};
			Object.keys(inputForgotInvalidTemp).forEach((key)=>{
				let val:any = valInputForgot?.[key];
				if (val == null || typeof val == 'undefined' || val == ""){
					inputForgotInvalidTemp[key] = true;
					CekInvalid = true
				}
				else {
					inputForgotInvalidTemp[key] = false;
				}
			})
			setInputForgotInvalid(inputForgotInvalidTemp);
			
			// jika masih valid, maka cek apakah email valid
			if (!CekInvalid){
				let patt = new RegExp(/[a-zA-Z0-9-.,#$%^&]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}/gi);
				if (!patt.test(valInputForgot?.['email']))
				{
					setErrorMsgForgot("Email is invalid")
				}
				else {
					setErrorMsgForgot("");
				}
			}
			else{
				setErrorMsgForgot("Email is required")
			}

		}

	}

	return (
		<div>
			<div className='loginpage-wrapper'>  
				
				<div className='login-side-left'>
        

					{/* sign in */}
					<div className={`login-img-side-left ${statusFormShowSignIn ? 'show' : ''}`}></div>

					{/* forgot password */}
					<div className={`login-img-side-left-forgotpass ${statusFormShowForgot ? 'show' : ''}`}></div>
				</div>

          
        
				<div className='login-side-right d-flex align-items-center justify-content-center'>

					<div className='login-side-right-wrapper'>

						{/* Forgot Password */}
						<div className={`forgotpass ${statusFormShowForgot ? 'show' : ''}`}>

							<h5 className='login-side-right-title'>Forgot Password?</h5>
							<p className='login-side-right-p-forgot'>Enter your email and we'll send you instructions to reset your password</p>

							<form className='form-custom'
								onSubmit={(event)=>event?.preventDefault()}>

								<div className='form-group'>
									<React.Fragment>
										<InputText placehold={'Email'} heightType={'large'} inputType='text' 
												name = {"email"}
												maxLengthInput={150}
												outChange={(val)=>{onChangeInput(val,'forgot')}}
                        outKeyUp={(val)=>{handleFinalSubmit('forgot')}}
										/>

										<div className='text-danger'>
											{(inputForgotInvalid['email'] || errorMsgForgot.trim() != "") && (<span>{errorMsgForgot}</span>)}
										</div>
									</React.Fragment>

								</div>

								<div>
									<Button variant="contained" className='button-sign-in' onClick={()=>handleFinalSubmit('forgot')}>Send Reset Link</Button>
								</div>

								<div className='d-flex justify-content-center align-items-center'>

									<a className='back-to-login' onClick={()=>{handleClickForgot('back_to_login')}}>{'< Back to login'}</a>

								</div>

							</form>

						</div>


						{/* Sign In */}

						<div className={`signin ${statusFormShowSignIn ? 'show' : ''}`}>

              <div className='login-side-right-logo'>
                  <img className='logo-class' src={IoTLogo} width={170}/>
              </div>

							<h5 className='login-side-right-title'>Sign In</h5>
							<h6 className='login-side-right-subtitle'> Welcome !</h6>
							<p className='login-side-right-p'>Please sign-in to your account and start the adventure</p>

							<form className='form-custom'>
										
								<div className='form-group'>
									<React.Fragment>
										<InputText placehold={'Username'} heightType={'large'} inputType='text' 
												maxLengthInput={100}
                        focusProp={false}
                        focusRun={focusRun}
												outChange={(val)=>{onChangeInput(val,'signin')}}
                        outKeyUp={(val)=>{handleFinalSubmit('signin')}}
												name = {"username"}
                        value={valDefault?.['username']}
                        disabled={disabledProp}
										/>

										<div className='text-danger'>
											{inputInvalid['username'] && (<span>{'Username is required'}</span>)}
											{/* {meta.error && meta.touched && (<span>{meta.error}</span>)} */}
										</div>
									</React.Fragment>
								</div>

								<div className='form-group mt-3'>
									<React.Fragment>
										<InputText placehold={'Password'} heightType={'large'} inputType='password'
											maxLengthInput={100}
											name = "password"
                      focusProp={false}
											outChange={(val)=>{onChangeInput(val,'signin')}}
                      outKeyUp={(val)=>{handleFinalSubmit('signin')}}
                      disabled={disabledProp}
                      value={valDefault?.['password']}
										/>
										<div className='text-danger'>
											{inputInvalid['password'] && (<span>{'Password is required'}</span>)}
											{/* {meta.error && meta.touched && (<span>{meta.error}</span>)} */}
										</div>
									</React.Fragment>
								</div>

								<div className='d-flex justify-content-between align-items-center'>

									<CheckBoxInput labelCheck='Remember Me' name='remember_me' disabled={disabledProp} defaultChecked_par={valDefaultReMe} outChange={onChangeInput} />
									{/* <a className='forgot-password' onClick={()=>{handleClickForgot('forgot')}}>Forgot Password?</a> */}

								</div>

								<div>
									<Button variant="contained" className='button-sign-in' onClick={()=>handleFinalSubmit('signin')} disabled={disabledProp}>Sign In</Button>
								</div>

							</form>

							{/* <Form
								onSubmit={handleFinalFormSubmit}
								validate={(values) => {
									const errors: any = {};
									if (!values.username){
										errors.username = "Username is required";
									}
									if (!values.password){
										errors.password = "Password is required";
									}
									return errors;
								}}
								render={({ handleSubmit })=> (
									<form method="POST" 
											className='form-custom'
											onSubmit={handleSubmit}>
										<div className='form-group'>
											<Field name="username">
												{({input, meta})=> {
													return (
														<React.Fragment>
															<InputText placehold={'Username'} heightType={'large'} inputType='text' 
																	maxLengthInput={100}
																	outChange={onChangeInput}
																	name = {"username"}
															/>
															<input {...input} type="text" className='form-control' placeholder="Username" />

															<div className='text-danger'>
																<span>{meta.error}</span>
																{meta.error && meta.touched && (<span>{meta.error}</span>)}
															</div>
														</React.Fragment>
													)
												}}
											</Field>
										</div>
										<div className='form-group'>
											<Field name="password">
												{({input, meta})=>{
													return (
														<React.Fragment>
																<InputText placehold={'Password'} heightType={'large'} inputType='password'
																	maxLengthInput={100}
																	name = "password"
																	outChange={onChangeInput}
																/>
																<div className='text-danger'>
																	{meta.error && meta.touched && (<span>{meta.error}</span>)}
																</div>
														</React.Fragment>
													)
												}}
											</Field>
										</div>

									</form>
								)}
							>
							</Form> */}
						</div>

					</div>
				</div>

			</div>

      <ToastContainer 
          draggable
          pauseOnHover
      />

			{/* <img src={ImgBoyWithRocketLight} className='login-img-side-left' /> */}

			{/* <div className="gray-bg" style={{ height: "100vh" }}>
				<div className="loginColumns animated fadeInDown">
					<div className="col-md-12">
						<div className="row">
							<div className="col-md-12">
								<div className="ibox-content">
									{
										status != 0 ?
											<> <Alert message={message} status={status} /> </> : <> </>
									}
									<Form
										onSubmit={handleFinalFormSubmit}
										validate={(values: { username: any; password: any; }) => {
											const errors: any = {};
											if (!values.username) {
												errors.username = "Username is required";
											}

											if (!values.password) {
												errors.password = "Password is required";
											}
											return errors;
										}}
										render={({ handleSubmit }) => (
											<form className="m-t" method="POST" onSubmit={handleSubmit}>
												<div className="form-group">
													<Field name="username">
														{({ input, meta }) => {
															return (
																<React.Fragment>
																	<input {...input} type="text" className="form-control" placeholder="Username" />
																	<div className="text-danger">
																		{meta.error && meta.touched && (<span>{meta.error}</span>)}
																	</div>
																</React.Fragment>
															);
														}}
													</Field>
												</div>
												<div className="form-group">
													<Field name="password">
														{({ input, meta }) => {
															return (
																<React.Fragment>
																	<input {...input} type="password" className="form-control" placeholder="Password" />
																	<div className="text-danger">
																		{meta.error && meta.touched && (<span>{meta.error}</span>)}
																	</div>
																</React.Fragment>
															);
														}}
													</Field>
												</div>
												<button type="submit" className="ladda-button btn btn-primary block full-width m-b" data-style="zoom-in" >Login</button>
												
											</form>
										)}
									/>
								</div>
							</div>
						</div>
						<hr />
						<div className="row">
							<div className="col-md-6">
								PT Best Agro International
							</div>
							<div className="col-md-6 text-right">
								<small>© 2021</small>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</div>
	);
}

export default Login;