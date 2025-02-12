import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './numberAnimate.scss'
import {v4 as uuidV4} from 'uuid'

interface modelParamNumberAnimate {
  angka:number,
  propStyle?: {
    backgroundColorAnimate?: string;  // lightblue  (warna background setelah selesai rolling)
    textColor?: string;   // blueviolet   (warna text color)
    fontSize?: string;    // 1.7rem   (font size)
  },
  [key:string]:any
}

const NumberAnimate:React.FC<modelParamNumberAnimate> = ({angka, propStyle, ...restPropStyle}) => {

  const { backgroundColorAnimate, textColor, fontSize } = propStyle || {};

  // propStyle={backgroundColorAnimate:"lightblue", textColor="white"}

  // --> restPropStyle?.propStyle?.['backgroundColorAnimate']
  // backgroundColorAnimate -> warna efek background setelah suatu angka utama selesai di rolling (warna sesuai style css)
  // --> restPropStyle?.propStyle?.['textColor']
  // textColor -> warna efek tulisan setelah suatu angka utama selesai di rolling (warna sesuai style css)  (blueviolet)
  // fontSize -> ukuran font size angka (1.7rem)

  const [angkaStr, setAngkaStr] = useState('');
  const [uuid, setUUID] = useState('');
  const [objAngka, setObjAngka] = useState({});
  const [objSeqShow, setObjSeqShow] = useState({});
  const [objSeqHide, setObjSeqHide] = useState({});
  
  const [showAnim, setShowAnim] = useState(false);

  const [statusDisabled, setStatusDisabled] = useState(false);

  const [propStyleState, setPropStyleState] = useState({backgroundColorAnimate:"lightblue", textColor:"white", fontSize:'1.7rem'});

  const containerRef = useRef(null);

  let var_setObjSeqShow:any = {}; // nilai saat ini / current yg tampil di box
  let var_setObjSeqHide:any = {};

  let uuid_temp = '';

  // variabel object pembanding
  let objAngkaTemp:any = {};
  
  let angka_temp = '';


  const konversiAngkaToLocal = (angka) => {

      if (typeof angka == 'number'){
        angka_temp = new Number(angka).toLocaleString('id-ID', {style:'decimal'});
      } else {
        angka_temp = parseFloat(angka).toLocaleString('id-ID', {style:'decimal'});

        if (angka_temp == 'NaN')
        {
          angka_temp = "0";
        }
      }
      return angka_temp;
  }

  const setPropStyleFunc = (callback) => {

      let propStyleTemp = {...propStyleState};

      // let var_backColorAnimate = restPropStyle?.propStyle?.['backgroundColorAnimate'];
      // let var_textColor = restPropStyle?.propStyle?.['textColor'];
      let var_backColorAnimate = backgroundColorAnimate;
      let var_textColor = textColor;
      let var_fontSize = fontSize;

      propStyleTemp = var_backColorAnimate ? {...propStyleTemp, 'backgroundColorAnimate': var_backColorAnimate} : {...propStyleTemp};
      propStyleTemp = var_textColor ? {...propStyleTemp, 'textColor': var_textColor} : {...propStyleTemp};
      propStyleTemp = var_fontSize ? {...propStyleTemp, 'fontSize': var_fontSize} : {...propStyleTemp};
      
      setPropStyleState(propStyleTemp);
      callback(propStyleTemp);
  }

  useEffect(()=>{
    uuid_temp = "nuid-" + uuidV4();
    setUUID(uuid_temp);
    // console.log(uuid_temp)

    // set kembali style custom


    // set id unique for each card
  
    // jadikan bentuk angka_temp => 1000000 -> 1.000.000

    // if (typeof angka == 'number'){
    //   angka_temp = new Number(angka).toLocaleString('id-ID', {style:'decimal'});
    // } else {
    //   angka_temp = parseFloat(angka).toLocaleString('id-ID', {style:'decimal'});

    //   if (angka_temp == 'NaN')
    //   {
    //     angka_temp = "0";
    //   }
    // }
    angka_temp = konversiAngkaToLocal(angka);

    // let tesunik = document.querySelectorAll(".na-headersub-seq");
    // tesunik.forEach((obj, idx)=>{
    //   let obju = obj as HTMLElement;
    //   obju.style.top = "100%";
    // })
    
    setAngkaStr(angka_temp);

    var_setObjSeqShow = {
        ...var_setObjSeqShow
        // ,'.na-headersub-idx-8':'1',
        // '.na-headersub-idx-7':'.',
        // '.na-headersub-idx-6':'5',
        // '.na-headersub-idx-5':'0',
        // '.na-headersub-idx-4':'0',
        // '.na-headersub-idx-3':'.',
        // '.na-headersub-idx-2':'0',
        // '.na-headersub-idx-1':'0',
        // '.na-headersub-idx-0':'0'
    }

    // render angka dan animasi rolling
    // setObjSeqShow({...var_setObjSeqShow});

    // var_setObjSeqHide = {
    //     ...var_setObjSeqHide
        // '.na-headersub-idx-8':'1',
        // '.na-headersub-idx-7':'0'
    // }
    // setObjSeqHide({...var_setObjSeqHide});

    // setTimeout(()=>{
    //   if (uuid_temp){
    //     alert(angka_temp)
    //     setPropStyleFunc((cbStyle)=>{
    //       // {"backgroundColorAnimate":"lightblue","textColor":"black"}
    //       countShowNA(uuid_temp, angka_temp, var_setObjSeqShow, cbStyle);
    //     });
    //   }
    // },1)

  },[])
  
  const [angkaLama, setAngkaLama] = useState(0);
  const [angkaRealTime, setAngkaRealTime] = useState(0);
  const [statusCheckCompleted, setStatusCheckCompleted] = useState(false);
  // let simpanAngkaBaru:any = null;

  // let interval_CheckAgainNewAngka:any;

  useEffect(()=>{

    setTimeout(()=>{
      if (statusCheckCompleted)
      {
        // mencegah data tidak tampil terbaru
        if (angkaRealTime !=  angkaLama)
        {
            if (uuid){

                // console.error("STATUS CHECKED COMPLETED : " + statusCheckCompleted);
            
                // console.error("ANGKA REAL TIME : %d", angkaRealTime);
                // console.error("ANGKA LAMA : %d", angkaLama)
                
                setPropStyleFunc((cbStyle)=>{
                  angka_temp = konversiAngkaToLocal(angkaRealTime);
  
                  // console.error('HALO INI BARU REAL TIME : %d', angkaRealTime)
                  // console.error('HALO INI BARU REAL TIME (String) : %s', angka_temp)
                  // console.error('status disabled ' + statusDisabled)
                  countShowNA(uuid, angka_temp, objSeqShow, cbStyle, angkaRealTime);

                })
              }

          }
        }
    },100)

  },[statusCheckCompleted, angkaRealTime, angkaLama])



  useEffect(()=>{

      angka_temp = konversiAngkaToLocal(angka);

    
      setTimeout(()=>{
        if (uuid){
          setPropStyleFunc((cbStyle)=>{
            countShowNA(uuid, angka_temp, objSeqShow, cbStyle, angka);
          })
        }
      },1)
    
  }, [angka, uuid, angkaStr])

  useEffect(()=>{

    // alert("berubah objSeqShow : " + JSON.stringify(objS  eqShow))
    window.addEventListener('resize', handleResize);
      
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);

      // document.documentElement.style.removeProperty('--na-sub-count');
    }
  },[objSeqShow, statusDisabled])

  const handleResize = () => {

    // let naHeadersubs = document.querySelectorAll('.na-headersub');
    // console.log('resize')

    let temp_objSeqShow = {...objSeqShow};
    
    let keyHeaderSub = Object.keys(objSeqShow);

    if (keyHeaderSub.length > 0)
    {

        keyHeaderSub.forEach((key, idx)=>{
            let idxforValue = temp_objSeqShow?.[key];
            // if (temp_objSeqShow?.[key] == "."){
            //     idxforValue = "0";
            // }
            if (parseInt(temp_objSeqShow?.[key]).toString() == "NaN"){
                idxforValue = "0";
            }

            let valueHeaderSub = `.na-seq-idx-${idxforValue}`;

            let size_classNameHeaderSubIdx_Temp = document.querySelector(`.${uuid} ${key}`) as HTMLElement;  // ukuran kotak utama
            let size_classNameValueIdx_Selected = document.querySelector(`.${uuid} ${key} ${valueHeaderSub}`) as HTMLElement; // ukuran kotak value yang terpilih

            size_classNameHeaderSubIdx_Temp.style.width = "1ch";

            if (size_classNameValueIdx_Selected){
              // setTimeout(()=>{
                size_classNameHeaderSubIdx_Temp.style.width = (size_classNameValueIdx_Selected.offsetWidth-0.5) + "px";
                // if (size_classNameValueIdx_Selected.innerText == '.'){
                //   size_classNameHeaderSubIdx_Temp.style.width = (6) + "px";
                  // size_classNameHeaderSubIdx_Temp.style.display = "contents";
                // } else {
                  // size_classNameHeaderSubIdx_Temp.style.width = (11) + "px";
                  // size_classNameHeaderSubIdx_Temp.style.display = "contents";
                // }


                size_classNameHeaderSubIdx_Temp.style.height = (size_classNameValueIdx_Selected.offsetHeight ?? 0) + "px";
                // size_classNameHeaderSubIdx_Temp.style.width = "1ch";
                // size_classNameHeaderSubIdx_Temp.style.height = "auto";
              // },100)
            }
            // console.log(`.${uuid} ${key} ${valueHeaderSub}`)
        })  
    }
    
    // console.log(keyHeaderSub)

    // naHeadersubs.forEach((obj, idx)=>{
    //   let naHeadersub = obj as HTMLElement;
      // let naHeaderSubSeq_Show = obj.querySelectorAll('.na-headersub-seq.na-show');  // angka || '.'
      // alert(naHeaderSubSeq_Show.length)
      // if (naHeaderSubSeq_Show){
      //     if (naHeaderSubSeq_Show.length > 0)
      //     {
      //         if (naHeaderSubSeq_Show){
      //             naHeaderSubSeq_Show.forEach((eleSeq, idxSeq) => {
      //               let eleSeqHTML = eleSeq as HTMLElement;
                    
      //               // buat animation delay berbeda setiap angka

      //               // let pattSeqIndex = new RegExp(/na-seq-show-[0-9]+/gi);
      //               // let textSeqIndex = pattSeqIndex.exec(eleSeqHTML.classList.toString());
      //               // if (textSeqIndex){

      //               //     let patt_getNumSeqIndex = new RegExp(/[0-9]+/gi);
      //               //     let text_getNumSeqIndex:any = patt_getNumSeqIndex.exec(textSeqIndex.toString())?.[0];

      //               //     eleSeqHTML.style.animationDelay = (parseFloat(text_getNumSeqIndex) * 0.07) + "s";

      //               //     // console.log(text_getNumSeqIndex)
      //               //     // console.log(textSeqIndex?.[0])
      //               // }

      //               naHeadersub.style.width = eleSeqHTML.offsetWidth + "px";
      //               naHeadersub.style.height = eleSeqHTML.offsetHeight + "px";
                  
      //             })
        
      //           // naHeadersub.style.width = naHeaderSubSeq_Show.offsetWidth + "px";
      //           // naHeadersub.style.height = naHeaderSubSeq_Show.offsetHeight + "px";
      //           // naHeaderSubSeq_Show.style.animationDelay = (idx * 0.8) + "s";
      //           // console.log(naHeaderSubSeq_Show.offsetWidth);
      //         }
      //     }
      // }

    // })

  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const checkCompleted = (objSeqShow_Temp, angka_split) => {

    let statusCompleted = true;

    if (Array.isArray(angka_split))
    {
        if (angka_split.length > 0) {
            // console.error("----> angka_split ", angka_split);
            // console.error("----> objSeqShow_Temp ", objSeqShow_Temp);

            for (var i=0; i<angka_split.length; i++)
            {
                let curAngkaIdx = (angka_split.length - 1) - i; // dari belakang index arrary
                let val_curAngkaIdx = angka_split?.[curAngkaIdx];

                let naHeadersubClass = `.na-headersub-idx-${i.toString()}`;
                let val_naHeaderSubClass = objSeqShow_Temp?.[naHeadersubClass];

                // console.error("----> newValue vs Terisi ", val_curAngkaIdx, " vs ", val_naHeaderSubClass);

                if (!val_naHeaderSubClass){
                    statusCompleted = false;
                    break;
                } 
                else if (parseInt(val_naHeaderSubClass).toString() != "NaN"){

                    if (val_naHeaderSubClass.toString() != val_curAngkaIdx.toString()){
                        // contoh case : '.'
                        statusCompleted = false;
                        break;
                    }
                }
                else if (parseInt(val_naHeaderSubClass).toString() == "NaN" && 
                          parseInt(val_curAngkaIdx).toString() == "NaN"){

                    if (val_naHeaderSubClass.toString() != val_curAngkaIdx.toString()) {
                        statusCompleted = false;
                        break;
                    } 
                    
                }
                else if (parseInt(val_naHeaderSubClass) != parseInt(val_curAngkaIdx)){
                    statusCompleted = false;
                    break;
                }

            }
            
            // console.log("----> STATUS COMPLETED : ", statusCompleted.toString())
        }

        if (statusCompleted){
          setStatusDisabled(false);
          ShowOrHideBox(uuid, objSeqShow_Temp, false);
          // console.error("(CHECKED COMP) SUDAH FALSE");

          setTimeout(()=>{
            setStatusCheckCompleted(true);
          },100)
          
          // console.error("PENGECEKKAN LAGI (CHECKED COMPLETED");

          // console.error("angka REAL TIME : " + angkaRun_WhenDisabled);
          // console.error("HALO ANGKA LAMA (Checked method) : " + angka);

          // console.error("angka TAMPIL : " + angka_split);

          // console.log("----> ENDDDDDDDD ", statusCompleted.toString());
        }
    }
    // console.error("===****>OBJSEQSHOW_TEMP ", uuid)
    // console.error(objSeqShow_Temp)

    // console.error("===****>ANGKA_SPLIT ", uuid)
    // console.error(angka_split)
  }

  const ShowOrHideBox =  (uuid, objSeqShow, displayHide:boolean) => {
    
    // displayHide = false, tidak mau tampilkan hide supaya bisa di blok kotak utama

      let arr_objSeqShow_keys = Object.keys(objSeqShow);
      arr_objSeqShow_keys.forEach((obj, idx)=>{

          if (!displayHide)
          {
            // hide
            let class_hide = `.${uuid} .na-header ${obj} .na-headersub-seq:not(.na-show)`;
  
            let loop_hide = document.querySelectorAll(class_hide);
            loop_hide.forEach((objhs, idxhs) => {
                let ele = objhs as HTMLElement;
                ele.style.display = "none";
            })
          }
          else if (displayHide)
          {
            // hide
            let class_hide = `.${uuid} .na-header ${obj} .na-headersub-seq:not(.na-show)`;
  
            let loop_hide = document.querySelectorAll(class_hide);
            loop_hide.forEach((objhs, idxhs) => {
                let ele = objhs as HTMLElement;
                ele.style.display = "block";
            })
          }

          // show
          let class_show = `.${uuid} .na-header ${obj} .na-headersub-seq.na-show`;

          let loop_show = document.querySelectorAll(class_show);
          loop_show.forEach((objhs, idxhs) => {
              let ele = objhs as HTMLElement;
              ele.style.display = "block";
              // ele.style.display = "contents";
              ele.style.backgroundColor = "transparent";
          })
      })      
  }


  const createElementFunc = (uuid_temp, angka_temp, var_setObjSeqShow, par_propStyle, callback) => {

      // angka_temp -> value angka baru yang masuk
      // var_setObjSeqShow -> object yang menampung data yang tersimpan (sudah exists)

      let angka_split:any[];
      if (angka_temp != "")
      {
          angka_split = angka_temp.split("");
          
          let var_setObjSeqShow_len = Object.keys(var_setObjSeqShow).length;
          let angka_split_len = angka_split.length;

          let selisih_len = 0;
          if (var_setObjSeqShow_len != angka_split_len)
          {
              // panjang data baru dikurangi panjang data existing
              selisih_len = angka_split_len - var_setObjSeqShow_len;
              
              if (selisih_len > 0)
              {

                  let classNaHeader = document.querySelector(`.${uuid_temp} .na-header`) as HTMLElement;

                  for (var j=var_setObjSeqShow_len; j<angka_split_len; j++)
                  // for (var j=angka_split_len; j>=(var_setObjSeqShow_len+1); j--)
                  {
                      let createEle_NaHeaderSubIdx = document.createElement('div');
                      createEle_NaHeaderSubIdx.classList.add('na-headersub');
                      createEle_NaHeaderSubIdx.classList.add(`na-headersub-idx-${j.toString()}`);
                      createEle_NaHeaderSubIdx.style.color = propStyleState?.textColor;
                      

                      // buat index nomor (0 - 9) atau 0 saja (kalau simbol)
                      
                      if (parseInt(angka_split[angka_split_len-1-j]).toString() == 'NaN'){  // kalau simbol hanya satu kotak (0)

                        let createEle_seqIdx = document.createElement('div');
                        createEle_seqIdx.classList.add('na-headersub-seq');
                        createEle_seqIdx.classList.add('na-seq-idx-0');

                        createEle_seqIdx.style.color = propStyleState?.textColor;
                        createEle_seqIdx.style.fontSize = par_propStyle?.['fontSize']; // font size angka
                        
                        createEle_seqIdx.innerText = angka_split[angka_split_len-1-j];

                        createEle_NaHeaderSubIdx.appendChild(createEle_seqIdx);
                      }
                      else
                      {
                          for (var k=0; k<=9; k++)
                          {
                              let createEle_seqIdx = document.createElement('div');
                              createEle_seqIdx.classList.add('na-headersub-seq');
                              createEle_seqIdx.classList.add(`na-seq-idx-${k.toString()}`);

                              createEle_seqIdx.style.color = propStyleState?.textColor; // warna 
                              createEle_seqIdx.style.fontSize = par_propStyle?.['fontSize']; // contoh : 1.7rem

                              createEle_seqIdx.innerText = k.toString();

                              createEle_NaHeaderSubIdx.appendChild(createEle_seqIdx);
                          }
                      }
                      // ... end buat index nomor

                      if (classNaHeader.children.length == 0)
                      {
                          classNaHeader.insertBefore(createEle_NaHeaderSubIdx, null);
                      }
                      else {
                          classNaHeader.insertBefore(createEle_NaHeaderSubIdx, classNaHeader.children[0]);
                      }
                      
                  }
                  // ... end For Selisih
                  callback(var_setObjSeqShow)
              }
              else if (selisih_len < 0) 
              {
                  
                  let var_setObjSeqShow_temp = {...var_setObjSeqShow};
                  for (var j=0; j<Math.abs(selisih_len); j++)
                  {
                      // hapus children pertama dari dalam class na-header
                      let classNaHeader = document.querySelector(`.${uuid_temp} .na-header`) as HTMLElement;
                      let classNaHeader_child = classNaHeader.children[0].classList;

                      let patt_class = new RegExp(/na-headersub-idx-[0-9]+/gi);
                      let patt_exec = patt_class.exec(classNaHeader_child.toString());
                      if (patt_exec){
                          if (("." + patt_exec) in var_setObjSeqShow_temp){
                              
                              delete var_setObjSeqShow_temp[("." + patt_exec)];
                              classNaHeader.children[0].remove();

                          }
                          
                      }
                  }
                  // alert(JSON.stringify(var_setObjSeqShow_temp))
                  setObjSeqShow({...var_setObjSeqShow_temp});
                  callback(var_setObjSeqShow_temp)

              }
          }
          else 
          {
              callback(var_setObjSeqShow)
          }

      }
      else {
          callback(var_setObjSeqShow)
      }

  }

  const countShowNA = async(uuid_temp, angka_temp, var_setObjSeqShow, par_propStyle, angkaRun_WhenDisabled) => {

      // angkaRun_WhenDisabled -> angka yang terbaru pada saat ter-disabled tapi menerima angka baru (parameter)
      // angka Baru Real Time

      setStatusCheckCompleted(false);
      setAngkaRealTime(angka_temp)

      if (statusDisabled){

        // if (interval_CheckAgainNewAngka){
        //   try{
        //     clearInterval(interval_CheckAgainNewAngka);
        //   }catch(e){}
        // }
        return
      }

      setStatusDisabled(true);

      setAngkaLama(angka_temp);

      // Create element secara dinamis

      createElementFunc(uuid_temp, angka_temp, var_setObjSeqShow, par_propStyle, (objSeqShow_New)=>{
          
          let var_setObjSeqShow_Rev = {...objSeqShow_New};

          // console.log("var_setObjSeqShow_Rev")
          // console.log(var_setObjSeqShow_Rev)

          ShowOrHideBox(uuid_temp, var_setObjSeqShow_Rev, true);
    
          // tugas function ini : split urut terbalik (dari paling ujung ke awal), ada fungsi animasi untuk rolling nomor per kotak satu per satu ke atas / bawah
    
          // {  HARUS ADA CREATE ELEMENT DAHULU 
          //    "MENYUSUL..."
          // }
          
          // if (containerRef.current){
          //   let curRef:any = containerRef.current;
          //   let naShowArr = curRef.querySelectorAll(`.${uuid_temp} .na-header .na-headersub .na-headersub-seq.na-show`);
          //   // console.log(uuid_temp);
          //   // console.log(naShowArr);
          // }
    
          // (TES) buat element baru
            // let elebaru = document.createElement("div");
            // let textbaru = document.createTextNode(var_setObjSeqShow?.['.na-headersub-idx-0']);
            // elebaru.className = `test ${var_setObjSeqShow?.['.na-headersub-idx-0'] == '1' ? 'na-show' : ''}`
            // elebaru.style.position = "absolute";
            // elebaru.style.background = "red";
            // elebaru.appendChild(textbaru);
            
            // document.querySelector(`.${uuid_temp} .buat-element`)?.appendChild(elebaru);
    
          // ...
    
          // ex: 1.500.000 => ['1','.','5','0',...]
            let angka_split:any[] = angka_temp.split("");
            if (angka_split.length > 0)
            {

              // set value nya berapa untuk per satu kotak na-headersub-idx
              let objSeqShowTemp = objSeqShow;
      
              // looping angka
              let objSeqShow_Temp = {...var_setObjSeqShow_Rev};
      
              for (var i=0;i<angka_split.length;i++)
              {
      
                  let startFocusIdx = (angka_split.length - 1) - i  // misal 9-1-0=8 (paling belakang), 9-1-1=7
      
                  // Cari kotak header nya dahulu
                  let classNameHeaderSubIdx = '.na-headersub-idx-' + i.toString();
                  
                  // let delay_classNameHeaderSubIdx_Temp = document.querySelector(`.${uuid_temp} .na-header ${classNameHeaderSubIdx} .na-headersub-seq`) as HTMLElement;  // ukuran kotak utama
                  // delay_classNameHeaderSubIdx_Temp.style.transitionDelay = (Math.random()) + "s";
                  
                  // baca karakter dari paling belakang
                  let newValueAngka:any = angka_split?.[startFocusIdx];
      
                  // rolling / putar angka value sesuai index paling belakang
      
      
                  let currentValBox;  // tentukan nilai awal value
                  // jika tidak ada di object var_setObjSeqShow, maka set dari 0
                  if (!var_setObjSeqShow?.[classNameHeaderSubIdx])
                  {
                      currentValBox = '';
                  }else{
                      currentValBox = var_setObjSeqShow?.[classNameHeaderSubIdx];
                  }
      
                  // hanya di rolling kalau nilai current dan value baru tidak sama
                  if (currentValBox.toString() != newValueAngka.toString())
                  {
                      // console.log("NEW VALUE ANGKA : ",newValueAngka)
                      
                      let j_current = currentValBox == '' || currentValBox == '.' ? 0 : parseInt(currentValBox);
      
                      let j_next = j_current;
                      let awal = true;
      
                      let stepRol = (timestamp) => {
      
                        // console.log("============-> ", uuid_temp)
                        // console.log("Current : ", j_current);
                        // console.log("Next : ", j_next);
      
                          let className_NextValueIdx_RollingSeq = `.na-seq-idx-${j_next}`;
      
                          // atur lebar 
                          
                          let size_classNameHeaderSubIdx_Temp = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx}`) as HTMLElement;  // ukuran kotak utama
                          let size_classNameValueIdx_Selected = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx} ${className_NextValueIdx_RollingSeq}`) as HTMLElement; // ukuran kotak value yang terpilih
      
                          // size_classNameHeaderSubIdx_Temp.style.width = (size_classNameValueIdx_Selected.offsetWidth) + "px";
                          
                          size_classNameHeaderSubIdx_Temp.style.height = (size_classNameValueIdx_Selected.offsetHeight ?? 0) + "px";

                          // size_classNameHeaderSubIdx_Temp.style.height = (23) + "px";
                          // size_classNameHeaderSubIdx_Temp.style.height = "auto";
                          // size_classNameHeaderSubIdx_Temp.style.width = "1ch";

                          size_classNameHeaderSubIdx_Temp.style.width = (size_classNameValueIdx_Selected.offsetWidth-0.5) + "px";

                          if (size_classNameHeaderSubIdx_Temp.innerText == '.'){
                              // size_classNameHeaderSubIdx_Temp.style.width = (6) + "px";
                          } else {

                              // size_classNameHeaderSubIdx_Temp.style.width = (11) + "px";
                          }

                          // let classNameValueIdx_RollingSeq_Prev = `.na-seq-idx-${j_start - 1 }`;
                          // let angkaHide = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx} .na-headersub-seq${classNameValueIdx_RollingSeq}`)  as HTMLElement;
                          // angkaHide.style.top = "0px";
      
                          let angkaShow = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx} .na-headersub-seq${className_NextValueIdx_RollingSeq}`)  as HTMLElement;
                          angkaShow.style.top = "0px";
                          angkaShow.style.opacity = "1";
                          angkaShow.style.color = par_propStyle?.textColor;
                          angkaShow.classList.add('na-show');
                          
      
                          let currentVal_diAwal = (parseInt(currentValBox).toString() == 'NaN' ? 0 : parseInt(currentValBox));
                          let newVal_diAwal = (parseInt(newValueAngka).toString() == 'NaN' ? 0 : parseInt(newValueAngka));
      
                          if (!awal)
                          {
                                let className_CurrValueIdx_RollingSeq = `.na-seq-idx-${j_current}`;
      
                                let angkaHide = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx} .na-headersub-seq${className_CurrValueIdx_RollingSeq}`)  as HTMLElement;
      
                                // kalau current < value baru, maka yang di hide akan ke atas
                                if (currentVal_diAwal < newVal_diAwal) {
                                  angkaHide.style.top = "-100%";
                                  angkaHide.style.opacity = "0.5";
                                  angkaHide.style.textShadow = "none";
                                } 
                                else if (currentValBox > newValueAngka) {
                                  angkaHide.style.top = "100%";
                                  angkaHide.style.opacity = "0.5";
                                  angkaHide.style.textShadow = "none";
                                }
                          }
      
                          j_current = j_next;
      
                          // console.log("currentVal_diAwal")
                          // console.log(currentVal_diAwal)
                          // console.log("newVal_diAwal")
                          // console.log(newVal_diAwal)
      
      
                              if (currentVal_diAwal < newVal_diAwal)  // jika nilai current < nilai yang baru
                              {
          
                                  // console.log("j_next : ", classNameHeaderSubIdx, " -> ", (j_current + 1))
                                  // console.log("newValueAngka : ", classNameHeaderSubIdx, " -> ", (newValueAngka))
      
                                  if ((j_current+1) <= parseInt(newValueAngka))
                                  {
      
                                    if (awal){
                                      awal = false;
                                    }
                                    angkaShow.classList.remove('na-show');  // hapus class na-show posisi current
                                    j_next = j_current + 1;
                                    
                                    setTimeout(()=>{
              
                                      // console.log("---> Masuk Perbandingan  (j_cur + 1) <= newValueAngka : ", classNameHeaderSubIdx, " , j_next -> ",j_next)
                                      window.requestAnimationFrame(stepRol);
                                    },100)
                                  }
                                  else 
                                  {
                                      // angkaShow.style.textShadow = "0 0 70px gold";
                                      // angkaShow.style.boxShadow = "0 0 20px 5px lightgoldenrodyellow";

                                      // angkaShow.style.backgroundColor = "lightblue";
                                      angkaShow.style.backgroundColor = propStyleState?.backgroundColorAnimate;
                                      
                                      setTimeout(()=>{
                                        angkaShow.style.backgroundColor = "transparent";
                                        angkaShow.style.boxShadow = "none";
                                      },450)
          
                                      // console.log('SELESAI STEP ROL')
          
                                      objSeqShow_Temp = {
                                          ...objSeqShow_Temp,
                                          [classNameHeaderSubIdx]: newValueAngka.toString()
                                      }
                                      // console.log("=======> OBJ SEQ SHOW : " + classNameHeaderSubIdx)
      
                                      // console.log(objSeqShow_Temp)
                                      setObjSeqShow(
                                        {...objSeqShow_Temp}
                                      )
      
                                      // update status disabled
                                      checkCompleted(objSeqShow_Temp, angka_split);
      
                                  }
                              }
                              else if (currentVal_diAwal > newVal_diAwal)  // jika nilai current > nilai yang baru
                              {
                                  if ((j_current-1) >= parseInt(newValueAngka))
                                  {
      
                                    if (awal){
                                      awal = false;
                                    }
                                    angkaShow.classList.remove('na-show');  // hapus class na-show posisi current
                                    j_next = j_current - 1;
      
                                    setTimeout(()=>{
      
                                      // console.log("---> Masuk Perbandingan  (j_cur + 1) <= newValueAngka : ", classNameHeaderSubIdx, " , j_next -> ",j_next)
              
                                      window.requestAnimationFrame(stepRol);
                                    },100)
                                  }
                                  else 
                                  {
                                      // angkaShow.style.boxShadow = "0 0 20px 5px lightgoldenrodyellow";
      
                                      // angkaShow.style.backgroundColor = "lightblue";
                                      angkaShow.style.backgroundColor = propStyleState.backgroundColorAnimate;
                                      
                                      setTimeout(()=>{
                                        angkaShow.style.backgroundColor = "transparent";
                                        angkaShow.style.boxShadow = "none";
                                      },400)
          
                                      objSeqShow_Temp = {
                                          ...objSeqShow_Temp,
                                          [classNameHeaderSubIdx]: newValueAngka.toString()
                                      }
                                      // console.log("=======> OBJ SEQ SHOW : " + classNameHeaderSubIdx)
      
                                      // console.log(objSeqShow_Temp)
                                      setObjSeqShow(
                                        {...objSeqShow_Temp}
                                      )
      
                                      // update status disabled
                                      checkCompleted(objSeqShow_Temp, angka_split);
                              
                                  }
                              }
                              else if (currentVal_diAwal == newVal_diAwal)
                              {
                                  objSeqShow_Temp = {
                                      ...objSeqShow_Temp,
                                      [classNameHeaderSubIdx]: newValueAngka.toString()
                                  }
                                  // console.log("=======> OBJ SEQ SHOW : " + classNameHeaderSubIdx)
      
                                  // console.log(objSeqShow_Temp)
                                  setObjSeqShow(
                                    {...objSeqShow_Temp}
                                  )
      
                                  
                                  // update status disabled
                                  checkCompleted(objSeqShow_Temp, angka_split);
                                  
                              }
      
                      }
      
                      
                      if (uuid_temp)
                      {
                        window.requestAnimationFrame(stepRol);
                      }
                      // ... end <stepRol>
      
                  }
                  else {
                      // jika nilai nya sama, maka tidak perlu rolling untuk satu box utama
      
                      let j_current = currentValBox == '' || currentValBox == '.' ? 0 : currentValBox;
      
                      let className_CurrValueIdx_RollingSeq = `.na-seq-idx-${j_current}`;
      
                      let classNameHeaderSubIdx = '.na-headersub-idx-' + i.toString();
      
                      let ele_classNameHeaderSubIdx_Temp = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx}`) as HTMLElement;  // ukuran kotak utama
                      let ele_classNameValueIdx_Selected = document.querySelector(`.${uuid_temp} ${classNameHeaderSubIdx} ${className_CurrValueIdx_RollingSeq}`) as HTMLElement; // ukuran kotak value saat ini
                      
                      if (!ele_classNameValueIdx_Selected.classList.contains('na-show')){
                        ele_classNameValueIdx_Selected.style.top = "0px";
                        ele_classNameValueIdx_Selected.classList.add('na-show');
                      }
      
                      objSeqShow_Temp = {
                          ...objSeqShow_Temp,
                          [classNameHeaderSubIdx]: newValueAngka.toString()
                      }
                      setObjSeqShow(
                        {...objSeqShow_Temp}
                      )
      
                      // update status disabled
                      checkCompleted(objSeqShow_Temp, angka_split);
                  }
      
                }
      
                // console.error('--> SET OBJ SEQ SHOW handleClick < --')
                // console.error(objSeqShow)
      
                // Index urutan kotak
                // await delay(1000);
                // for (var i=0;i<angka_split.length;i++)
                // {
                //     let startFocusIdx = (angka_split.length - 1) - i  // misal 9-1-0=8 (paling belakang), 9-1-1=7
                //     let classNameHeaderSubIdx = '.na-headersub-idx-' + i.toString();
      
                //     // baca karakter dari paling belakang
                //     let newValueAngka:any = angka_split?.[startFocusIdx];
                //     if (parseInt(newValueAngka).toString() != "NaN"){
                //         // hanya angka yang di bandingkan
                //         let mulai;
                //         let akhir;
                //         let topFinal;
      
                //         let classHeaderSub = `.na-headersub-idx-${i.toString()}`;
      
                //         let naSeqIdx2 = document.querySelector(`.${uuid_temp} ${classHeaderSub} .na-headersub-seq`) as HTMLElement;
                //         naSeqIdx2.style.transition = "none";
      
      
                //         let naSeqIdxMuncul = document.querySelector(`.${uuid_temp} ${classHeaderSub} .na-headersub-seq.na-seq-idx-${newValueAngka.toString()}`) as HTMLElement;
                //         naSeqIdxMuncul.style.top = "0%";
                //         naSeqIdxMuncul.style.transition = "none";
      
                //         if (parseInt(newValueAngka) == 0 || 
                //             parseInt(newValueAngka) == 9){
                //             if (parseInt(newValueAngka) == 0){
                //                 mulai = 1; akhir = 9; topFinal = "100%";
                //             } else if (parseInt(newValueAngka) == 9) {
                //                 mulai = 0; akhir = 8; topFinal = "-100%";
                //             }
                            
                //             for (var j=mulai; j<=akhir;j++){
                //                 let classHeaderSub = `.na-headersub-idx-${i.toString()}`;
                //                 let naSeqIdx = document.querySelector(`.${uuid_temp} ${classHeaderSub} .na-headersub-seq.na-seq-idx-${j.toString()}`) as HTMLElement;
                //                 naSeqIdx.style.top = topFinal;
                //             }
                //         } else {
      
                //             for (var k=0; k<parseInt(newValueAngka);k++){
                //                 let classHeaderSub = `.na-headersub-idx-${i.toString()}`;
                //                 let naSeqIdx2 = document.querySelector(`.${uuid_temp} ${classHeaderSub} .na-headersub-seq.na-seq-idx-${k.toString()}`) as HTMLElement;
                //                 naSeqIdx2.style.top = "-100%";
                //             }
                //             for (var l=parseInt(newValueAngka)+1; l<9; l++){
                //                 let classHeaderSub = `.na-headersub-idx-${i.toString()}`;
                //                 let naSeqIdx2 = document.querySelector(`.${uuid_temp} ${classHeaderSub} .na-headersub-seq.na-seq-idx-${l.toString()}`) as HTMLElement;
                //                 naSeqIdx2.style.top = "100%";
                //             }
                //         }
      
                //     }
      
                //   }
      
                  // console.error("angka_split")
                  // console.error(angka_split)
      
                // ... end for angka_split
      
            }
      });

      // show kan semua box baik termasuk yang ter-hide

  }


  const handleClickTes = () => {
    
    // setObjSeqShow({
    //             '.na-headersub-idx-8':'2',
    //             '.na-headersub-idx-7':'0',
    //             '.na-headersub-idx-6':'3'});
    var_setObjSeqShow = {
      ...var_setObjSeqShow,
      '.na-headersub-idx-8':'1',
      '.na-headersub-idx-6':'3',
      '.na-headersub-idx-0':'1'
    }
    setObjSeqShow(var_setObjSeqShow)

    // let ates = document.querySelector(`.${uuid} .buat-element .test`);
    // ates!.textContent = var_setObjSeqShow?.['.na-headersub-idx-0'];
    // ates?.classList.add(var_setObjSeqShow?.['.na-headersub-idx-0'] == '1' ? 'na-show' : '');
  }

  const handleClick = () => {
    // let classNameHeaderSubIdx = '.na-headersub-idx-8';

    // let notHideClass = `.na-headersub-seq:not(.na-seq-idx-1)`;
    // let arr_classNameCheckToHideAll = document.querySelectorAll(`.${uuid} ${classNameHeaderSubIdx} ${notHideClass}`); // ukuran kotak value yang terpilih

    // arr_classNameCheckToHideAll.forEach((obj_checkhide, idx_checkhide)=>{
    //   console.log(obj_checkhide)
    //   let obj_checkhide_selected = obj_checkhide as HTMLElement;
    //   obj_checkhide_selected.style.backgroundColor = "maroon"
    //   obj_checkhide_selected.style.top = "-100%";
    // })

    // return

    // console.log("HANDLE CLICK")
    // console.log(var_setObjSeqShow)

    // var_setObjSeqShow = {
    //   ...var_setObjSeqShow
    //   ,'.na-headersub-idx-8':'1',
    //   '.na-headersub-idx-7':'.',
    //   '.na-headersub-idx-6':'5',
    //   '.na-headersub-idx-5':'0',
    //   '.na-headersub-idx-4':'0',
    //   '.na-headersub-idx-3':'.',
    //   '.na-headersub-idx-2':'0',
    //   '.na-headersub-idx-1':'0',
    //   '.na-headersub-idx-0':'0'
    // }
    
      var_setObjSeqShow = {...objSeqShow}

      // console.log("var_setObjSeqShow_Rev (SEBELUM CLICK)")
      // console.log(var_setObjSeqShow)

      // console.log(objSeqShow)

      // let randomAngka_selisih = new Number(Math.floor((Math.random() * (9999999-1000000+1))+1000000)).toLocaleString('id-ID',{style:'decimal'})
      let randomAngka_selisih = new Number(Math.floor(Math.random() * 1000000)).toLocaleString('id-ID',{style:'decimal'})
      // console.log(randomAngka_selisih)

      // countShowNA(uuid, "1.500.000" ,var_setObjSeqShow)

      // countShowNA(uuid, randomAngka_selisih ,var_setObjSeqShow)
    
  }

  return (
      <>

        {/* <button className='btn btn-primary mb-2' style={{zIndex:99}} onClick={handleClick}>Primary</button> */}

        <div ref={containerRef} className={`na-custom-font ${uuid}`} style = {{position:'relative', zIndex:2}}>

            <div className='na-header'>

                {/* na-headersub-idx-{index} harus di generate otomatis */}
              
                {/* <div className='na-headersub na-headersub-idx-8'>
                    <div className={`na-headersub-seq na-seq-idx-0`}>0</div>
                    <div className={`na-headersub-seq na-seq-idx-1`}>1</div>
                    <div className={`na-headersub-seq na-seq-idx-2`}>2</div>
                    <div className={`na-headersub-seq na-seq-idx-3`}>3</div>
                    <div className={`na-headersub-seq na-seq-idx-4`}>4</div>
                    <div className={`na-headersub-seq na-seq-idx-5`}>5</div>
                    <div className={`na-headersub-seq na-seq-idx-6`}>6</div>
                    <div className={`na-headersub-seq na-seq-idx-7`}>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>
                </div>

                <div className='na-headersub na-headersub-idx-7'>
                    <div className={`na-headersub-seq na-seq-idx-0`}>.</div>
                </div>

                <div className='na-headersub na-headersub-idx-6'>

                    <div className={`na-headersub-seq na-seq-idx-0`}>0</div>
                    <div className={`na-headersub-seq na-seq-idx-1`}>1</div>
                    <div className={`na-headersub-seq na-seq-idx-2`}>2</div>
                    <div className={`na-headersub-seq na-seq-idx-3`}>3</div>
                    <div className={`na-headersub-seq na-seq-idx-4`}>4</div>
                    <div className={`na-headersub-seq na-seq-idx-5`}>5</div>
                    <div className={`na-headersub-seq na-seq-idx-6`}>6</div>
                    <div className={`na-headersub-seq na-seq-idx-7`}>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>

                </div>
                <div className='na-headersub na-headersub-idx-5'>
                    <div className='na-headersub-seq na-seq-idx-0'>0</div>
                    <div className='na-headersub-seq na-seq-idx-1'>1</div>
                    <div className='na-headersub-seq na-seq-idx-2'>2</div>
                    <div className='na-headersub-seq na-seq-idx-3'>3</div>
                    <div className='na-headersub-seq na-seq-idx-4'>4</div>
                    <div className='na-headersub-seq na-seq-idx-5'>5</div>
                    <div className='na-headersub-seq na-seq-idx-6'>6</div>
                    <div className='na-headersub-seq na-seq-idx-7'>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>
                </div>
                <div className='na-headersub na-headersub-idx-4'>
                    <div className='na-headersub-seq na-seq-idx-0'>0</div>
                    <div className='na-headersub-seq na-seq-idx-1'>1</div>
                    <div className='na-headersub-seq na-seq-idx-2'>2</div>
                    <div className='na-headersub-seq na-seq-idx-3'>3</div>
                    <div className='na-headersub-seq na-seq-idx-4'>4</div>
                    <div className='na-headersub-seq na-seq-idx-5'>5</div>
                    <div className='na-headersub-seq na-seq-idx-6'>6</div>
                    <div className='na-headersub-seq na-seq-idx-7'>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>
                </div>

                <div className='na-headersub na-headersub-idx-3'>
                    <div className='na-headersub-seq na-seq-idx-0'>.</div>
                </div>

                <div className='na-headersub na-headersub-idx-2'>
                    <div className='na-headersub-seq na-seq-idx-0'>0</div>
                    <div className='na-headersub-seq na-seq-idx-1'>1</div>
                    <div className='na-headersub-seq na-seq-idx-2'>2</div>
                    <div className='na-headersub-seq na-seq-idx-3'>3</div>
                    <div className='na-headersub-seq na-seq-idx-4'>4</div>
                    <div className='na-headersub-seq na-seq-idx-5'>5</div>
                    <div className='na-headersub-seq na-seq-idx-6'>6</div>
                    <div className='na-headersub-seq na-seq-idx-7'>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>
                </div>
                <div className='na-headersub na-headersub-idx-1'>
                    <div className='na-headersub-seq na-seq-idx-0'>0</div>
                    <div className='na-headersub-seq na-seq-idx-1'>1</div>
                    <div className='na-headersub-seq na-seq-idx-2'>2</div>
                    <div className='na-headersub-seq na-seq-idx-3'>3</div>
                    <div className='na-headersub-seq na-seq-idx-4'>4</div>
                    <div className='na-headersub-seq na-seq-idx-5'>5</div>
                    <div className='na-headersub-seq na-seq-idx-6'>6</div>
                    <div className='na-headersub-seq na-seq-idx-7'>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>
                </div>
                <div className='na-headersub na-headersub-idx-0'>
                    <div className='na-headersub-seq na-seq-idx-0'>0</div>
                    <div className='na-headersub-seq na-seq-idx-1'>1</div>
                    <div className='na-headersub-seq na-seq-idx-2'>2</div>
                    <div className='na-headersub-seq na-seq-idx-3'>3</div>
                    <div className='na-headersub-seq na-seq-idx-4'>4</div>
                    <div className='na-headersub-seq na-seq-idx-5'>5</div>
                    <div className='na-headersub-seq na-seq-idx-6'>6</div>
                    <div className='na-headersub-seq na-seq-idx-7'>7</div>
                    <div className='na-headersub-seq na-seq-idx-8'>8</div>
                    <div className='na-headersub-seq na-seq-idx-9'>9</div>
                </div> */}
            </div>
        </div>
      </>
  )
}

export default NumberAnimate