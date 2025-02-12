import { toast } from "react-toastify";
import { errorMonitor } from "stream";
import * as CryptoJS from 'crypto-js'
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export const encryptCode = '!otTIS88jkT';
// export const URL_API_LiVE = "http://localhost:3007";  // api lokal (not iot)
// export const URL_API_LiVE = "http://192.168.1.120:3007";  // api live (not iot)
// export const URL_API_IOT_LIVE = 'http://192.168.1.120:7004';  // api live (iot)
export const URL_API_LiVE = "http://localhost:3007";  // api live (not iot)
export const URL_API_IOT_LIVE = 'http://localhost:7004';  // api live (iot)

// export const URL_API_PPE = "https://services-ppe.gotos.id";  // api PPE
export const URL_API_PPE = process.env.REACT_APP_API_URL;  // api PPE : https://services-ppe.gotos.id


export const generateExpiredDate = (time_type:'hours'|'minutes'|'seconds', time_value?:number) => {
    // generate expired date
    let getDateNow = new Date().getTime();

    let param_time_final:any;
    if (typeof time_value == 'undefined' || time_value == null){
        notify('error', 'Time Value can\'t be empty !')
        return null
    }
    
    let expiredDate:any = null;
    let enc_expiredDate:any = null;

    if (typeof time_type != 'undefined' && time_type != null){
        param_time_final = time_value;
        
        switch(time_type)
        {
            case 'hours':
                expiredDate = getDateNow + (1000*60*60* time_value); // contoh 5 jam
                break;
            case 'minutes':
                expiredDate = getDateNow + (1000*60* time_value); //  contoh 5 menit
                break;
            case 'seconds':
                expiredDate = getDateNow + (1000* time_value); // contoh 5 detik
                break;
        }

        enc_expiredDate = CryptoJS.AES.encrypt(expiredDate.toString(), encryptCode).toString();
    }
    
    return enc_expiredDate
}

export const formatDate = (tanggal:any, format: 
                                "HH:mm:ss"|
                                "HH:mm"|"DD MMMM YYYY"|
                                "DD MMMM YYYY HH:mm:ss"|
                                "DD MMM YYYY HH:mm:ss" |
                                "YYYY-MM-DD" |
                                "YYYY-MM-DD HH:mm" |
                                "YYYY-MM-DDTHH:mm:ssZ" |
                                "YYYY-MM-DDTHH:mm:ss" |
                                "YYYY-MM-DD HH:mm:ss" |
                                "YYYY-MM-DD 00:00:00") => {
    let final_format:any = '';
    if (!isNaN(tanggal)){
        let month_arr = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        let tanggal_d:any = ("0" + tanggal.getDate()).slice(-2);
        let month_m:any = ("0" + (tanggal.getMonth()+1)).slice(-2);
        let date_d:any = ("0" + tanggal.getDate()).slice(-2);
        let month_idx:any = tanggal.getMonth();
        let year_y:any = tanggal.getFullYear();
        let hour_d:any = ("0" + tanggal.getHours()).slice(-2);
        let minutes_d:any = ("0" + tanggal.getMinutes()).slice(-2);
        let seconds_d:any = ("0" + tanggal.getSeconds()).slice(-2);

        switch(format){
            case 'HH:mm:ss':
                final_format = hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'HH:mm':
                final_format = hour_d + ":" + minutes_d;
                break;
            case 'DD MMMM YYYY':
                final_format = tanggal_d + " " + month_arr[month_idx] + " " + year_y;
                break;
            case 'DD MMMM YYYY HH:mm:ss':
                final_format = tanggal_d + " " + month_arr[month_idx] + " " + year_y
                               + " " + hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'DD MMM YYYY HH:mm:ss':
                final_format = tanggal_d + " " + month_m + " " + year_y
                               + " " + hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'YYYY-MM-DDTHH:mm:ssZ':
                final_format = year_y + "-" + month_m + "-" + date_d + "T" + hour_d + ":" + minutes_d + ":" + seconds_d + "Z";
                break;
            case 'YYYY-MM-DDTHH:mm:ss':
                final_format = year_y + "-" + month_m + "-" + date_d + "T" + hour_d + ":" + minutes_d + ":" + seconds_d + "+0000";
                break;
            case 'YYYY-MM-DD HH:mm:ss':
                final_format = year_y + "-" + month_m + "-" + date_d + " " + hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'YYYY-MM-DD HH:mm':
                final_format = year_y + "-" + month_m + "-" + date_d + " " + hour_d + ":" + minutes_d;
                break;
            case 'YYYY-MM-DD':
                final_format = year_y + "-" + month_m + "-" + date_d;
                break;
            case 'YYYY-MM-DD 00:00:00':
                final_format = year_y + "-" + month_m + "-" + date_d + " 00:00:00";
                break;
        }

    }
    return final_format
}

export const postApi = async (url?:any, param?:any, isAwait?:boolean, token_code?:any, body?:any, callback?:any) =>
{
  let obj_token_key:any = {
    "1":'$2a$04$1t8/RrKuG1aCdc820GzGWOptHHy67BPS9jjHfWQpdHKyIzkuNmPRW', // akun bestagro
    "2":"811aea285d3c31db515c56520ae369aded18a623"
  }

  let token_final:any = obj_token_key?.[token_code];
  
  const requestOptions = {
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(
        {
          ...body,
          // token_key: '811aea285d3c31db515c56520ae369aded18a623'
          // token_key:'$2a$04$1t8/RrKuG1aCdc820GzGWOptHHy67BPS9jjHfWQpdHKyIzkuNmPRW'
          token_key: token_final
        }
    )
  };

  
  if (!isAwait)
  {
    fetch(url,requestOptions)
      .then(response => response.json())
      .then(data => callback(data))
    }
  else
  {
    // alert(isAwait)
    const response = await (fetch(url, requestOptions).catch((err)=>{return err}));
    
    // jika error maka callback error
    if (response.toString().indexOf("TypeError") != -1){
      callback({
        statusCode:"400",
        msg:response.toString()
      })
    }

    const result = await response.json();
    // console.log(result)
    callback(result)
    // await fetch(url,requestOptions)
    //   .then(response => response.json())
    //   .then(data =>  console.log(data))
    //   .catch(err => alert(err))
  }
  return
}

// PPE
export const PPE_getApiSync = async (url?:any, body?:any, 
  body_type?:'application/json'|'application/x-www-form-urlencoded'
  , method?:any, token?:any, isReturnStatus?:Boolean) =>
{

  let searchParams;

  let requestOptions = {};

  if (body_type == 'application/x-www-form-urlencoded')
  {
    searchParams = new URLSearchParams({...body})

    requestOptions = {
        method,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            // 'Cache-Control':'no-cache'
        },
        // cache:'no-cache',
        body: searchParams
        // body: formBodyJoin
        // body: JSON.stringify(
        //   {
        //     ...body
        //   }
        // )
    };
  }
  else{
    searchParams = {...body}

    let bearerToken:any = '';

    if (token){
      bearerToken = token ?? getValueFromLocalStorageFunc("IOT_TOKEN") ?? '';
    }


    // method = "GET"
    requestOptions = {
        method,
        headers:{
          'Content-Type':'application/json'
        },
    }


    if (body) {
      requestOptions = {
        ...requestOptions,
        body: JSON.stringify({...searchParams})
      }
    }

    // jika ada token, masukkin token
    if (token) {
      requestOptions = {
        ...requestOptions,
        headers: {
            ...requestOptions?.['headers'],
            'Authorization':'Bearer ' + bearerToken
        }
      }
    }
    // ... end
  }

  let response = await fetch(url, requestOptions).catch((err)=>{return err});

  // jika error maka callback error
  if (response.toString().indexOf("TypeError") != -1){

      return {
        statusCode:"400",
        msg:"Response Error"
      }
  }
  

  let result;
  result = await response.json();

  let result_status = await response;

  if (typeof result_status == 'object'){
    if ((result_status?.['status'] == 403 && result_status?.['statusText'] == 'Forbidden') || 
        (result_status?.['status'] == 401 && result_status?.['statusText'] == 'Unauthorized')) {
      
        handleLogOutGlobal_PPE();
        
        window.location.href = "/login";
    }
  }

  if (isReturnStatus){
    return {result, http:{response}}
  }
  else {
    return result
  }

}


export const getApiSync = async (url?:any, param?:any, token_code?:any, body?:any, 
        body_type?:'application/json'|'application/x-www-form-urlencoded'
        , method?:any, callback?:any) =>
{
    // let bodyType = "application/json"
    // if (typeof body_type != 'undefined'){
    //   bodyType = body_type      // x-www-form-urlencoded
    // }

    let searchParams;
    // let method;

    let requestOptions = {};

    if (body_type == 'application/x-www-form-urlencoded')
    {
        searchParams = new URLSearchParams({...body})
        // searchParams = new URLSearchParams();
        // Object.entries(body).forEach(([key, value])=>searchParams.append(key, value))
        // console.log(searchParams)

        // let formBody:any = [];
        // for (var key in body){
        //   let encodedKey:any = encodeURIComponent(key)
        //   let encodedValue:any = encodeURIComponent(body[key])
        //   let gabung:any = encodedKey + '=' + encodedValue
        //   formBody.push(gabung)
        // }
        // let formBodyJoin = formBody.join("&")


        // method = "POST"
        // x-www-form-urlencoded -> harus menggunakan POST
        requestOptions = {
            method,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Cache-Control':'no-cache'
            },
            cache:'no-cache',
            body: searchParams
            // body: formBodyJoin
            // body: JSON.stringify(
            //   {
            //     ...body
            //   }
            // )
        };
    }
    else{
        searchParams = {...body}
        // method = "GET"
        requestOptions = {
            method,
            headers:{
              'Content-Type':'application/json',
              'Cache-Control':'no-cache'
            },
            cache:'no-cache'
        }
    }

    // let formData = new URLSearchParams()
    // formData.append("username","admin")
    // formData.append("password","admin1231")
    
    let response = await fetch(url, requestOptions).catch((err)=>{return err});
    
    // jika error maka callback error
    if (response.toString().indexOf("TypeError") != -1){

      return {
        statusCode:"400",
        msg:response.toString()
      }
    }

    let result = await response.json();
    return result

}

export const postApiSync = async (url?:any, param?:any, token_code?:any, body?:any, callback?:any) =>
{
  let obj_token_key:any = {
    "1":'$2a$04$1t8/RrKuG1aCdc820GzGWOptHHy67BPS9jjHfWQpdHKyIzkuNmPRW', // akun bestagro
    "2":"811aea285d3c31db515c56520ae369aded18a623"
  }

  let token_final:any = obj_token_key?.[token_code];
  
  const requestOptions = {
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(
        {
          ...body,
          token_key: token_final
        }
    )
  };

    // alert(isAwait)
    let response = await fetch(url, requestOptions).catch((err)=>{return err});
    
    // jika error maka callback error
    if (response.toString().indexOf("TypeError") != -1){
      return {
        statusCode:"400",
        msg:response.toString()
      }
    }

    let result = await response.json();
    return result
    // await fetch(url,requestOptions)
    //   .then(response => response.json())
    //   .then(data =>  console.log(data))
    //   .catch(err => alert(err))
  return
}

export const joinWithCommaNSuffixAnd = (arr:any[]) => {
    let msgReplace:any = '';
    if (!Array.isArray(arr)){
        notify('error', 'No Array Parameter');
        return
    }else{
        msgReplace = arr.join(", ").replace(/, ([^,]*)$/, ' dan $1');
    }
    return msgReplace;
}

export const notify = (type:'info'|'error'|'success'|'warning', msg?:any, position?:'TOP_CENTER'|'TOP_RIGHT', autoClose=1000) => {
  // React-toastify
  
  const obj_toastify:any = {
    position: position == 'TOP_CENTER' ? toast.POSITION.TOP_CENTER : position == 'TOP_RIGHT' ? toast.POSITION.TOP_RIGHT : toast.POSITION.TOP_CENTER,
    theme:"colored",
    autoClose: autoClose,
    hideProgressBar: false,
    newestOnTop:true,
    rtl:false,
    // closeOnClick:true,
    // pauseOnFocusLoss:true,
    // draggable:true,
    // pauseOnHover:true
  }
  switch(type){
    case 'info':
      toast.info(msg, {...obj_toastify});
      break;
    case 'error':
      toast.error(msg, {...obj_toastify});
      break;
    case 'success':
      toast.success(msg, {...obj_toastify});
      break;
    case 'warning':
      toast.warning(msg, {...obj_toastify});
      break;
  }
};

export const handleSwal = (tipe:'Delete'|'Clear Safe Area'|'Clear Danger Area'|'Create', item?, callback?) => {
  if (tipe == 'Delete')
  {
      Swal.fire({
        title:`Are you sure?`,
        text:'You won\'t be able to revert this !',
        icon:'warning',
        html: `<div> ` +
                `<div style='font-style:italic; font-size:20px; color:red'>"` + item + `"</div>` +
                `<div>You won\'t be able to revert this !</div>` +
              `</div>`
              ,
        showCancelButton:true,
        confirmButtonText:'Yes, Delete it!',
        confirmButtonColor:'red',
        cancelButtonText:`<span style='color:black, background-color:'lightgrey'>No, Cancel!</span>`,
        reverseButtons:true,
        // customClass:{
        //   confirmButton:'swal-confirm-button',
        //   cancelButton:'swal-cancel-button'
        // },
        showCloseButton:true
      })
      .then((result)=>{
        callback(result);
        // if (result.isConfirmed){
        //   Swal.fire('Deleted !', 
        //         `<div>` + 
        //             `<div style="font-style:italic; font-size:18px; color:cadetblue">"`+ item +`"</div>` + 
        //             `<div>Your file has been deleted.</div>` + 
        //         `</div>`,'success');
        // } else if (result.dismiss == Swal.DismissReason.cancel) {
        //   Swal.fire('Cancelled !', 'Your action has been cancelled.','info');
        // }
      })
  }
  else if (tipe == 'Clear Safe Area' || tipe == 'Clear Danger Area')
  {
      Swal.fire({
        title:`Are you sure to clear ?`,
        text:'You won\'t be able to revert this !',
        icon:'warning',
        html: `<div> ` +
                `<div style='font-style:italic; font-size:20px; color:red'>"` + 
                  `${tipe=='Clear Safe Area' ? 'Safe':tipe=='Clear Danger Area' ? 'Danger':''} Area`
                + `"</div>` +
                `<div>You won\'t be able to revert this !</div>` +
              `</div>`
              ,
        showCancelButton:true,
        confirmButtonText:'Yes, Clear it!',
        confirmButtonColor:'red',
        cancelButtonText:`<span style='color:black, background-color:'lightgrey'>No, Cancel!</span>`,
        reverseButtons:true,
        showCloseButton:true
      })
      .then((result)=>{
        callback(result);
      })
  }
  else if (tipe == 'Create') {
    Swal.fire({
      title:`Are you sure to save ?`,
      text:'You won\'t be able to revert this !',
      icon:'question',
      html: `<div> ` +
              `<div style='font-style:italic; font-size:20px; color:blue'>` + 
                `"${item}"`
              + `</div>` +
            `</div>`
            ,
      showCancelButton:true,
      confirmButtonText:'Yes, Save it!',
      confirmButtonColor:'darkcyan',
      cancelButtonText:`<span style='color:black, background-color:'lightgrey'>No, Cancel!</span>`,
      reverseButtons:true,
      showCloseButton:true
    })
    .then((result)=>{
      callback(result);
    })
  }
}

export const handleSwalResult = (tipe:'isConfirmed'|'cancelled', item?
        , statusAPI?:{endpoint, obj, body_type:'application/json'|'application/x-www-form-urlencoded', method, token}
        , callback?) => {
    if (tipe == 'isConfirmed')
    {
        Swal.fire({
          title:'Loading ...',
          icon:'info',
          html:`<div>` + 
                    `<div style="font-style:italic; font-size:18px; color:cadetblue">"Data is Processing !"</div>` + 
                `</div>`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
            
            if (statusAPI){

              PPE_getApiSync(statusAPI?.['endpoint']
                    , statusAPI?.['obj'] ?? null
                    , statusAPI?.['body_type']
                    , statusAPI?.['method']
                    , statusAPI?.['token'] ?? "")
              .then((response)=>{

                  let statusCodeError = response?.['statusCode']; // error dari internal
                  let responseDetail = response?.['detail'] // error dari api

                  setTimeout(()=>{
                      if (typeof statusCodeError != 'undefined'){
                          Swal.fire('Ooops !', 
                              `<div>
                                <div style="font-size:18px; color:cadetblue">Something went wrong. ${response?.['msg']}</div>
                              </div>`,
                              'error'
                          )
                          return
                      }
                      else if (typeof responseDetail != 'undefined'){
                          Swal.fire('Ooops !', 
                              `<div>
                                <div style="font-size:18px; color:cadetblue">"${responseDetail}"</div>
                              </div>`,
                              'error'
                          )
                          return
                      }
                      else {
                          Swal.fire('Deleted !', 
                                  `<div>` + 
                                      `<div style="font-style:italic; font-size:18px; color:cadetblue">"`+ item +`"</div>` + 
                                      // `<div>Your file has been deleted.</div>` + 
                                      `<div>${response?.['message']}</div>` + 
                                  `</div>`
                                  ,'success').then((resultDelete)=>{

                                      if (resultDelete.isConfirmed){
                                        callback({tipe:'close_after_success_save'})
                                      }
                                      
                                  });

                      }
                  },500)
              });
              
            }
            
          },
        })
    }
    else if (tipe == 'cancelled') {
        Swal.fire('Cancelled !', 'Your action has been cancelled.','info');
    }
}

export const handleLogOutGlobal = () => {

    if (localStorage.getItem("BESTLGN") != null){localStorage.removeItem("BESTLGN")}// // HAPUS KEY STATUS LOGIN
    if (localStorage.getItem("BESTEXP") != null){localStorage.removeItem("BESTEXP")}// // HAPUS KEY EXPIRED in miliseconds
    if (localStorage.getItem("BESTCOMID") != null){localStorage.removeItem("BESTCOMID")}// // HAPUS KEY COMPANY ID ARRAY
    if (localStorage.getItem("BESTCOMSEL") != null){localStorage.removeItem("BESTCOMSEL")}// // HAPUS KEY COMPANY SELECT (FOR DROPDOWN OPTION)
    if (localStorage.getItem("BESTDEVID") != null){localStorage.removeItem("BESTDEVID")}// // HAPUS KEY DEVICE ID  (TANK12_HP_PAMALIAN, TANK34_HP_PAMALIAN)
    if (localStorage.getItem("BESTLVL") != null){localStorage.removeItem("BESTLVL")}// // HAPUS KEY LEVEL
    if (localStorage.getItem("BESTUSRP") != null){localStorage.removeItem("BESTUSRP")}// // HAPUS USER TITLE

    if (sessionStorage.length > 0)
    {
      sessionStorage.clear()
    }
    
}

export const keepToLocalStorageFunc = (key?:any, value?:any) => {
  if (typeof key != 'undefined' && typeof value != 'undefined' && 
      key != null && value != null){

    let chiperText = CryptoJS.AES.encrypt(value, encryptCode).toString();
    // let originalText = CryptoJS.AES.decrypt(chiperText, "!otTIS88jkT").toString(CryptoJS.enc.Utf8)

    if (localStorage.getItem(key) != null){
        localStorage.removeItem(key)
    }

    localStorage.setItem(key, chiperText)
    
    return true
  }
  return false
  
}

export const removeFromLocalStorageFunc = (key:any) => {
  if (typeof key != 'undefined' && key != null){
      if (localStorage.getItem(key) != null){
          localStorage.removeItem(key)
      }
  }
}

export const getValueFromLocalStorageFunc = (key:any) => {

  if (typeof key != 'undefined' && key != null){
      if (localStorage.getItem(key) != null){
          let temp_var = CryptoJS.AES.decrypt(localStorage.getItem(key), encryptCode).toString(CryptoJS.enc.Utf8);
          return temp_var;
      }
      else {
        return null;
      }
  } else {
    return null;
  }
}

export const handleLogOutGlobal_PPE = () => {
  removeFromLocalStorageFunc("IOT_TOKEN");
  removeFromLocalStorageFunc("IOT_USER_ID");
  removeFromLocalStorageFunc("IOT_IS_SPUSR");
}