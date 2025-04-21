import {v7 as uuidv7} from 'uuid';
import Trend from 'react-trend';
import React, { DOMElement, useContext, useEffect, useReducer, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import storeMenu from '../../../../stores'
import FormTemplate, { FinalSessionType, FormTemplate_MultiSelectType, FormTemplateInDataChangeType, FormTemplateType, PropConfigConfirmDialog, PropConfigConfirmDialogResponse, PropConfigType } from '../../../../components/atoms/FormTemplate'
import InfiniteSlider from '../../../../components/atoms/InfiniteSlider';
import './penjualan_form.scss';
import { Button as ButtonPrime } from 'primereact/button';
import { InputIcon } from 'primereact/inputicon';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { PPE_getApiSync } from '../../../../services/functions';
import { jwtDecode } from 'jwt-decode';
import { Google } from '../../../../assets';
import LoginGoogle from '../../../../components/atoms/LoginGoogle';
import LoginFacebook from '../../../../components/atoms/LoginFacebook';
import LoginTwitter from '../../../../components/atoms/LoginTwitter';
import LoginLinkedin from '../../../../components/atoms/LoginLinkedin';
import LoginAuth0 from '../../../../components/atoms/LoginAuth0';
import RichEditor from '../../../../components/atoms/RichEditor';
import CheckMarkAnimate from '../../../../components/atoms/FormTemplate/CheckMarkAnimate';
import { IconField } from 'primereact/iconfield';
import FormTemplateContextProv, { FormTemplateContext, FormTemplateContextInterface } from '../../../../components/atoms/FormTemplate/FormTemplateContext';
import MagnifyCustom from '../../../../components/atoms/MagnifyCustom';
import { Form } from 'react-bootstrap';
import { Toast } from 'primereact/toast';

import html2pdf from 'html2pdf.js';

// const ButtonProviderClick = ({param}) => {
//   const {dataContext, setDataContext} = useContext<FormTemplateContextInterface>(FormTemplateContext);

//   return (

//     <div>
//         <ButtonPrime color='warning'
//                           label={'Provider'}
//                           onClick={()=>setDataContext({tes: param })}
//                       />
//     </div>
//   )
// }


const NestingMenu = (props:{arr_menu:any[], index:number, item:any|null}) => {

  const [objIsOpen, setObjIsOpen] = useState<{[key:string]:boolean}>({}); // by item_id

  const containerMapRefs = useRef<Map<any, HTMLElement>>(new Map());
  const [renderComplete, setRenderComplete] = useState<boolean>(false);

  const containerRef = useRef<any>();

  // {'menu-1':'50px', 'menu-2':'70px'}
  // ** inti nya menyimpan height masing-masing container div / ul
  const offsetHeightContainerRef = useRef<any>();  // menyimpan style maxHeight yang tidak nol pada container

  const ulRef = useRef<any>({});

  const tempObjMenuRef = useRef<any>({});
  const arrItemMaxHeight = useRef<any[]>([]);

  const itemCurrentSelected = useRef<string>('');
  const currentTargetSelected = useRef<HTMLElement>();

  // const [maxHeightContainer, setMaxHeightContainer] = useState<number>(props?.max_height ?? 0);  // max height (paling tinggi) container untuk semua element

  // * Observer Class Mutation (class tidak bisa di ubah inspect element)
  // ** di pasang pada handleDivRender ref
  const mapObserversClass = useRef(new Map()); 

  useEffect(()=>{
    return () => {
      mapObserversClass.current.forEach((observer)=>observer.disconnect());
      mapObserversClass.current.clear();
    }
  },[])

  useEffect(()=>{
    
    
    if (ulRef.current){
      
        let nmContainerDOMRoot:any = document.querySelectorAll('.nm-container')[0];
        let nmContainerDOMChild:any = document.querySelectorAll('.nm-container');

        if (nmContainerDOMRoot.offsetHeight > 0) {

          for (let [idx,item] of Object.entries(nmContainerDOMChild)){
            if (parseFloat(idx) > 0){
              let item_temp:any = item;
              // item_temp.style.backgroundColor = "red"
              item_temp.style.maxHeight = nmContainerDOMRoot.offsetHeight + 'px';
            }
          }
  
        }


    }
  },[])

  const observeRef = useRef<any>();
  const [classNameState, setClassNameState] = useState<string>();

  // useEffect(()=>{

  //   // ** mendeteksi jika ada perubahan class, maka akan di reset lagi

  //     const observeCheck:MutationCallback = (mutations) =>{

  //       mutations.forEach((mutation)=>{
  //         console.log(mutation)
          
  //         if (mutation.type === 'attributes' && mutation.attributeName === 'class'){
          
  //             try {
  //                 const currentClass = observeRef.current.getAttribute('class');

  //                 if (!currentClass){

  //                     observerAttr.disconnect();
  //                     observeRef.current.className = mutation.oldValue;
  //                     // ** baru di observe lagi, supaya tidak menimbulkan loop infinite
  //                     observerAttr.observe(observeRef.current, {attributes: true,attributeOldValue:true});  

  //                 }
  //                 else {
  //                   if (observeRef.current.className) {

  //                     // setClassNameState(observeRef.current.className || 'tesaja mantap');

  //                     if (mutation.oldValue !== currentClass){

  //                       // ** di putus dulu 
  //                         observerAttr.disconnect();

  //                         // ** jika attribute class dihapus semua, maka oldvalue jadi 'null'
  //                         let valuelama = mutation.oldValue;
                          
  //                         if (valuelama == null) {
  //                           // alert(currentClass)
  //                         }
  //                         else {
  //                           // observeRef.current.className = "testing";
  //                           observeRef.current.className = mutation.oldValue;
  //                         }

  //                         // ** baru di observe lagi, supaya tidak menimbulkan loop infinite
  //                         observerAttr.observe(observeRef.current, {attributes: true,attributeOldValue:true});
  //                     }
  //                   }
                    
  //                 }
  //             }
  //             catch(e){
  //               // setClassNameState('class hilang')
  //               observeRef.current.className = 'class hilang try catch !!';
  //             }

  //         }
  //       })
  //     } 
  //     const observerAttr = new MutationObserver(observeCheck);

  //     observerAttr.observe(observeRef.current, 
  //             {attributes: true
  //               // ,attributeFilter:['class']
  //               ,attributeOldValue:true
  //             });

  //     return () => {
  //       observerAttr.disconnect();
  //     }
  // },[])


  const handle_click_direction = (event, item_id, source:'button'|'item-block') => {

    // *** bagian untuk manghapus efek warna sebelumnya yang sudah diklik, dan update efek pada item sekarang yang diklik
    // ** Efek dari rekursif untuk semua variabel di area coding tidak ada relasi dengan parent nya,
    // *** sehingga efek yang bisa diolah hanya yang satu level dengan item nya sendiri saja.

    // if (currentTargetSelected.current){
    //   currentTargetSelected.current.style.color = "#5B6670";
    //   currentTargetSelected.current.style.backgroundColor = "transparent";
    // }


    if (typeof item_id != 'undefined' && item_id !== null && item_id !== '') {

      let eventTarget = event.currentTarget;
      let eventTarget_NextElement = eventTarget.nextElementSibling;
      // let arrEventTarget_ClassList = eventTarget.classList;

      // let arrEventTarget_ConvertToArray = Array.from(arrEventTarget_ClassList); // konversi dom element ke array
      // let findClassItemId:any = arrEventTarget_ConvertToArray.find((item:any)=>item.includes('nm-item-block-id-')) ?? '';
      // if (findClassItemId){
      //   let getItemId = findClassItemId.replace('nm-item-block-id-', '');
        
      //   // ** kasih efek item yang di klik
        
      //   itemCurrentSelected.current = item_id;

      //   currentTargetSelected.current = eventTarget;  // event target saat ini disimpan, untuk nanti dihapus efeknya sebagai previous

      //   // alert(JSON.stringify(findClassItemId,null,2))
      // }
      // console.error("currentTargetSelected.current")
      // console.error(currentTargetSelected.current)

      if (eventTarget_NextElement === null || eventTarget_NextElement === '' ||
          typeof eventTarget_NextElement === 'undefined'
      ) {

            // ** hapus semua efek pada class 'nm-item-block' terlebih dahulu
            for (let [k,v] of Object.entries(document.querySelectorAll('.nm-item-block'))){
              let temp_v = v as HTMLElement;
              if (v instanceof HTMLElement){
                // temp_v.style.backgroundColor = 'transparent';
                // temp_v.style.color = '#5B6670';

                // ** gunakan removeProperty supaya efek dasar nya tidak hilang
                // ** jika style.color -> ini sudah hardcode
                temp_v.style.removeProperty('background-color');
                temp_v.style.removeProperty('color');
              }
            }


            // * hapus efek untuk icon samping kiri menu text
            for (let [k,v] of Object.entries(document.querySelectorAll('.nm-custom-menu'))){
              let temp_v = v as HTMLElement;
              if (v instanceof HTMLElement){
                temp_v.style.color = '#5b6670b5';
              }
            }

            // * buat efek untuk menu text yang terbaru
            eventTarget.style.color = "#FE9F43";
            eventTarget.style.backgroundColor = "rgba(254, 159, 67, 0.08)";
      
            // * buat efek untuk icon di samping kiri menu text yang terbaru
            eventTarget.firstChild.style.color = '#FE9F43';

      }
      
    }
    
    let refstyle = ulRef.current?.[item_id];
    if (refstyle){
      
      // console.log("Item ID : " + item_id)
      // console.log(ulRef.current[item_id])
      let next_element_sibling = ulRef.current?.[item_id].element;  // sudah next element dari ulRef terhadap item_id

      let firstChildEvtTarget:any;
      let firstChildClassList:any;
      
      if (source === 'button'){
        firstChildEvtTarget = event.currentTarget.firstChild;
        firstChildClassList = firstChildEvtTarget?.classList;
      }
      else if (source === 'item-block') {
        firstChildEvtTarget = event.currentTarget.lastChild.firstChild;
        firstChildClassList = firstChildEvtTarget?.classList;
        // console.log(firstChildEvtTarget)
      }

      

      // console.log(firstChildEvtTarget.classList);

      if (typeof firstChildClassList != 'undefined' && firstChildClassList != null){
        
        if(firstChildEvtTarget.classList.contains('pi-angle-up') != null && 
            firstChildEvtTarget.classList.contains('pi-angle-up')){

          firstChildEvtTarget.classList.remove('pi-angle-up');
          firstChildEvtTarget.classList.add('pi-angle-down');
        } else {
          firstChildEvtTarget.classList.remove('pi-angle-down');
          firstChildEvtTarget.classList.add('pi-angle-up');
        }
      }

    


      let next_element_maxHeight = next_element_sibling.style.maxHeight;

      if (next_element_maxHeight === null || 
          next_element_maxHeight === '' ||
          typeof next_element_maxHeight === 'undefined'
      ){
        next_element_sibling.style.maxHeight = "0px";

            // setObjIsOpen(prev=>{
            //   return {
            //     ...prev,
            //     [item_id]: false
            //   }
            // })
      }
      else if (next_element_maxHeight === '0px'){

          next_element_sibling.style.maxHeight = ulRef.current[item_id].height + 'px';

          // setObjIsOpen(prev=>{
          //   return {
          //     ...prev,
          //     [item_id]: true
          //   }
          // })

        // alert('masuk === 0 && height ulref : ' + ulRef.current[item_id].height)

      }
      else {
        // alert(offsetHeightContainerRef.current)
        next_element_sibling.style.maxHeight = "0px";

        // setObjIsOpen(prev=>{
        //   return {
        //     ...prev,
        //     [item_id]: false
        //   }
        // })
      }
    
    }
  }

  useEffect(()=>{
        // console.error('completed key')
        // console.error(containerMapRefs.current)
    // console.log(containerMapRefs.current.keys())

    // ** Fungsi untuk meng-collapse atau menutup semua menu submenu
    // *** variabel 'containerMapRefs' akan looping dari level kedalaman submenu terbawah

    if (containerMapRefs.current.size > 0) {
      containerMapRefs.current.forEach((ele, key)=>{
        if (ele){
          setTimeout(()=>{
            // console.error("ele")
            // console.error(ele)
            // console.error("key : " + key)
            ele.style.maxHeight = '0px'
          },50)
        }
      })
    }
  },[renderComplete])

  const handleDivRender = (ele:any, item_id) => {
    if (ele){
      if (item_id === null){
        // ** ukuran root parent keseluruhan 
        // offsetHeightContainerRef.current = ele.offsetHeight;
        // alert("dari handle : " + offsetHeightContainerRef.current)
        // console.log(item_id + ' -> ' + ele.offsetHeight)
      }
      else {
        
          if (ele.nextElementSibling != null){
            // ** element yang bersangkutan dan ambil container setelahnya
            // console.log(item_id + ': ' + ele.nextElementSibling)
            // console.log(ele.nextElementSibling.offsetHeight);
            ulRef.current[item_id] = {element: ele.nextElementSibling, height: ele.nextElementSibling.offsetHeight};


            containerMapRefs.current.set(item_id, ele.nextElementSibling);
            
            
            // if (containerMapRefs.current.size === props.arr_menu.length - 1) {
            //   alert('masuk')
            //   console.error("containerMapRefs")
            //   console.error(containerMapRefs.current)
            //   console.error("containerMapRefs.current.size")
            //   console.error(containerMapRefs.current.size)

            //   console.error("props.arr_menu.length")
            //   console.error(props.arr_menu.length)
            //   setRenderComplete(true);
            //   // console.error("ULREF CURRENT")
            //   // console.log(ulRef.current)
            // }

          }


          // ** logika mencegah class div ref diubah dari inspect element nya
          // *** jika diubah, maka class yang sebelumnya (asli) akan dikembalikan lagi
          let isInternalFlag:boolean = false;

          const observerCallback:MutationCallback = (mutations) => {
              mutations.forEach((mutation)=>{
                  if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    
                      if (isInternalFlag){
                        isInternalFlag = false;
                        return;
                      }

                      let currentClass = ele.getAttribute('class');

                      if (!currentClass) {                        
                        isInternalFlag = true;
                        // observer.disconnect();
                        
                        setTimeout(()=>{
                          ele.className = mutation.oldValue;
                        },10)

                        // observer.observe(ele, {attributes:true, attributeOldValue:true});
                      }
                      else {

                        if (ele.className) {
                          if (currentClass !== mutation.oldValue){
                            
                            isInternalFlag = true;
                            // observer.disconnect();
                            setTimeout(()=>{
                              ele.className = mutation.oldValue;
                            },10)
                            // observer.observe(ele, {attributes:true, attributeOldValue:true});
                          }
                        }
                      }
                  }

              })
          }

          const observer = new MutationObserver(observerCallback);
          observer.observe(ele, {attributes:true, attributeOldValue:true});

          mapObserversClass.current.set(item_id, observer);
        
      }
        // offsetHeightContainerRef.current = ele.offsetHeight;
    }
  }

  return ( 
      props?.arr_menu.length > 0 ? (
            
            <div className={`nm-container`} 
                  style={{overflow:'hidden',transition:'all 0.2s ease'
                    // , maxHeight: maxHeightContainer.toString() + 'px'
                  }}
                  ref={(ele)=>handleDivRender(ele, props?.item?.id ?? null)}
            >
        
                  {/* <div id="id-tes" className='tesaja mantap' ref={observeRef}>Tes Observe Mutation (Class tidak bisa diubah pada inspect element)</div> */}

{/* <h3>{JSON.stringify(objMaxHeight,null,2)}</h3>
<h3>dari {props?.item?.id ?? ''}</h3> */}
{/* <h1>{props?.item?.['id'] ? objMaxHeight?.[props.item.id] ?? '' :''}</h1> */}

                <ul style={{border:'0px solid blue'
                          ,listStyleType:'none'
                      // , maxHeight:`${500}px`
                    }}
                  // ref={(el)=> props?.item?.id ? ulRef.current[props.item?.id] = el : null}
                >
                  <style>
                      {`
                        .nm-container {

                          font-family:Nunito;

                          li {
                              padding:10px 0 0 0;
                              &::marker {  
                                color:#5B6670;

                              }

                              &:hover::marker {
                                  color:#FE9F43;
                              }

                              div {
                                cursor:pointer;
                                user-select:none;
                                -webkit-user-select:none;
                                -ms-user-select:none;

                                span {
                                  font-size:14px;
                                }

                                &.nm-item-block{

                                    color:#5B6670;
                                    
                                    .nm-custom-text-menu {
                                      overflow:hidden;
                                      text-overflow:ellipsis;
                                      white-space:nowrap;
                                      width:90%;
                                    }

                                    &:hover {

                                        color:#FE9F43;
                                        background:rgba(254, 159, 67, 0.08);

                                        .nm-custom-menu {
                                          color:#FE9F43; #orange
                                        }
                                    }

                                    .nm-custom-menu {
                                      color:#5b6670b5;
                                    }

                                }

                              }

                          }

                        }
                        .custom-prime-button-internal {
                          border-radius:50% !important;
                          border:0px solid transparent;

                          &:focus {
                            box-shadow:none
                          }
                        }

                      `}
                  </style>
                  
                  {
                    props.arr_menu.map((item:any, menuindex)=>{
                      return (
                        <li key={`nm-${item?.id}-${menuindex}`}
                        >
                            
                            <div className={`d-flex align-items-center nm-item-block nm-item-block-id-${item?.id}`}
                                ref={(el)=>handleDivRender(el, item.id)}
                                onClick={(event)=>{handle_click_direction(event, item.id, 'item-block')}}
                            >

                              {/* icon bullet */}
                                {
                                  typeof props?.index != 'undefined' && props?.index > 0 && (
                                    <InputIcon className='pi pi-circle-fill nm-custom-menu' 
                                          style={{fontSize:'6px', marginRight:'15px'}}></InputIcon>
                                  )
                                }

                                {
                                  typeof props?.index !== 'undefined' && props?.index === 0 && (
                                    typeof item?.icon !== 'undefined' && item?.icon && (
                                          item.icon // icon custom dari parameter array
                                    )
                                  )
                                }
                                
                                {/* menu name */}
                                <span className='nm-custom-text-menu'>{item.name}</span>
                                
                                {/* Button up and down */}
                                {
                                  item?.items && item.items.length > 0 && (
                                    <>
                                      <ButtonPrime icon={'pi pi-angle-up'} outlined rounded severity='secondary'
                                        className='ms-auto custom-prime-button-internal'
                                        style={{width:'25px', height:'25px'}}
                                        // onClick={(event)=>{handle_click_direction(event, item.id, 'button')}}
                                      />
                                    </>
                                  )
                                }
                                {/* is Open : {objIsOpen?.[item.id] ? 'true' : (objIsOpen?.[item.id])} */}
                            </div>

                            {
                              item?.items && item.items.length > 0 && <NestingMenu arr_menu={item.items} index={props.index+1} item={item}/>
                            }
                        </li>
                      )
                    })
                  }
                </ul>
            </div>
      )
      :
      <div>Nothing</div>
  )
}

const FormCustom:React.FC<any> = ({status, contextActionClick}) => {
  
  const uuid_detail = contextActionClick?.['config_obj_detail']?.['uuid'];  // uuid detail
  
  const cell = contextActionClick?.['cell'];
  const name_uuid_row = contextActionClick?.['config_obj_detail']?.['table']?.['set_new_key_row_uuid'];  // nama key uuid 'uuid'
  const uuid_row = cell?.row?.original?.[name_uuid_row];  // uuid per baris
  
  const action_name = contextActionClick?.['action_name'];  // Nama Icon yang di click Edit, Delete, ...
  const obj_action_selected_props = contextActionClick?.['action_selected_props'];  // {icon, name:'Edit', style:{backgroundColorHover:''}, tipe_form:'Custom', type:'custom_element_in_modal'}
  
  const column = contextActionClick?.['column'];
  const row = contextActionClick?.['row'];
  const table = contextActionClick?.['table'];

  // *** Variable Props
  const {setContextShowModal, setContextDataOperation} = useContext<FormTemplateContextInterface>(FormTemplateContext)
  const [valueInput, setValueInput] = useState<any>({});
  const toastProsesRef = useRef<any>();
  const refKodeProduk = useRef<any>(null);

  useEffect(()=>{
    if (typeof action_name !== 'undefined' && action_name === 'Edit')
    {
        const kode_produk = cell?.row.original?.['kode_produk'];
        const nama_produk = cell?.row.original?.['nama_produk'];
        setValueInput({
          'kode_produk': kode_produk,
          'nama_produk': nama_produk
        })
    }
  },[contextActionClick])

  useEffect(()=>{
    // setValueInput({
    //   'kode_produk':'',
    //   'nama_produk':''
    // })
  },[status])

  useEffect(()=>{
    if (refKodeProduk?.current){
      refKodeProduk?.current?.focus();
    }
  },[])

  const handleProses = (tipe_button:'cancel'|'save') => {

    if (tipe_button === 'save')
    {
        let arrInvalidInput:any[] = [];
        if (!valueInput?.['kode_produk'] ||
              valueInput?.['kode_produk'].toString().trim() === ''
        ){
          arrInvalidInput = [...arrInvalidInput, 'Kode Produk'];
        }

        if (arrInvalidInput.length > 0){
          toastProsesRef?.current.show({severity:'error', summary: 'Required'
            , detail:`${arrInvalidInput.join(', ')} harus di-input !`, life:2000});
          
          return
        }

        const obj_refDataChange = {
            'kode_produk': valueInput?.['kode_produk'],
            'nama_produk': valueInput?.['nama_produk']
        }

        const obj_refDataEditChange = {
            'kode_produk': valueInput?.['kode_produk'],
            'nama_produk': valueInput?.['nama_produk']
        }

        if (action_name.toString().toUpperCase() === 'EDIT')
        {

            setContextDataOperation({type:'Edit'
                                      , id_detail: uuid_detail, id_row: uuid_row
                                      , refDataChange: {...obj_refDataChange}
                                      , refDataEditChange:{...obj_refDataEditChange}});
        }
        

    }

    if (tipe_button === 'cancel')
    {
        setContextShowModal(prev=>{
            return {
              [uuid_detail]: {show:false}
            }
        })
    }
  }
  // ------

  return (
    <>
      <div className='row'>
          <div className='col'>
              <Form.Group>
                  <Form.Label className='input-required'
                        style={{fontFamily:'Nunito', fontWeight:'bold'}}>
                      Kode Produk
                  </Form.Label>
                  <Form.Control 
                      ref={refKodeProduk}
                      type='text'
                      name="name_kode_produk"
                      placeholder='Kode Produk'
                      value={valueInput?.["kode_produk"] ?? ''}
                      maxLength={10}
                      autoComplete={`off`}
                      autoCapitalize='off'
                      autoCorrect='off'
                      spellCheck='false'
                      onChange={(event)=>{
                          setValueInput(prev=>{
                              if (typeof prev !== 'undefined' && Object.keys(prev).length > 0)
                              {
                         
                                return {...prev, 'kode_produk': event.target.value}
                              }
                              else {
                                return {'kode_produk': event.target.value}
                              }
                          })
                      }}
                  />
              </Form.Group>
          </div>

          <div className='col'>
              <Form.Group>
                  <Form.Label style={{fontFamily:'Nunito', fontWeight:'bold'}}>
                      Nama Produk
                  </Form.Label>
                  <Form.Control 
                      type='text'
                      name="name_nama_produk"
                      placeholder='Nama Produk'
                      value={valueInput?.["nama_produk"] ?? ''}
                      maxLength={50}
                      autoComplete={`off`}
                      autoCapitalize='off'
                      autoCorrect='off'
                      spellCheck='false'
                      onChange={(event)=>{setValueInput(prev=>{
                          if (typeof prev !== 'undefined')
                          {
                            return {...prev, 'nama_produk': event.target.value}
                          }
                          else {
                            return {'nama_produk': event.target.value}
                          }
                      })}}
                  />
              </Form.Group>
          </div>
      </div>

      <div className='row mt-4'>
          <hr />
          <div className='col'>
              <div className='d-flex justify-content-end'>
                  <ButtonPrime className='fit-btn-prime fit-btn-prime-cancel fit-btn ms-1' style={{display: 'block'}} disabled={false} label='Cancel' onClick={()=>handleProses('cancel')} loading={false} />
                  <ButtonPrime className='fit-btn-prime fit-btn ms-1' style={{display: 'block'}} disabled={false} label='Save' onClick={()=>handleProses('save')} loading={false} severity={'info'} />
              </div>
          </div>
      </div>

      <Toast ref={toastProsesRef}
              className='fit-toast-position'/>

      {/* <h3>UUID Detail : {uuid_detail}</h3> */}
      {/* <h3>UUID Row : {uuid_row}</h3> */}
    </>
  )
}

const TransaksiPenjualanForm = () => {

  const prop_config_ref = useRef<FormTemplateType[]>([]);
  const final_session_ref = useRef<FinalSessionType>();
  // const [propConfig, setPropConfig] = useState<{FormTemplateType[]>([]);
  const [propConfig, setPropConfig] = useState<PropConfigType>({type:'Form', config:[]});
  const [finalSession, setFinalSession] = useState<FinalSessionType|null>(null);
  const [statusDone, setStatusDone] = useState<boolean>(false);
  const [arrDataEdit, setArrDataEdit] = useState<any>({});  // data edit
  const [inDataChangeState, setInDataChangeState] = useState<FormTemplateInDataChangeType>({set:[]});
  const [inConfirmDialog, setInConfirmDialog] = useState<PropConfigConfirmDialogResponse>({confirm: null}); // berikan jawaban respon ke form template yes / no (delete image or else)


  const {contextActionClick, setContextShowModal} = useContext<FormTemplateContextInterface>(FormTemplateContext);

  useEffect(()=>{
    if (contextActionClick !== null)
    {
      const uuid_detail = contextActionClick?.['config_obj_detail']?.['uuid'];
      const action_name = contextActionClick?.['action_name'];  // Edit, Delete, ...
      const obj_action_selected_props = contextActionClick?.['action_selected_props'];  // {icon, name:'Edit', style:{backgroundColorHover:''}, tipe_form:'Custom', type:'custom_element_in_modal'}
      const cell = contextActionClick?.['cell'];
      const column = contextActionClick?.['column'];
      const row = contextActionClick?.['row'];
      const table = contextActionClick?.['table'];


      if (typeof uuid_detail !== 'undefined' && uuid_detail !== null)
      {
        if (typeof action_name !== 'undefined' && action_name !== null)
        {
         
            if (action_name.toString().toUpperCase() === 'EDIT')
            {

                if (setContextShowModal)
                {

                  const formCustom:React.ReactElement = <FormCustom status='Edit' contextActionClick={contextActionClick}/>

                  setContextShowModal(prev=>{
                    if (typeof prev !== 'undefined')
                    {
                      return {
                        // ...prev,
                        [uuid_detail]: {show:true, props:{...obj_action_selected_props ?? {}}, form:{type:'Custom', form_custom: formCustom}  }
                      }
                    }
                    else {
                      return {
                        [uuid_detail]: {show:true, props:{...obj_action_selected_props ?? {}}, form:{type:'Custom', form_custom: formCustom}}
                      }
                    }
                  })
                }
            }
            else {
              alert('Action Delete')
            }
        }
      }
      console.log(contextActionClick);
    }
  },[contextActionClick])

  useEffect(()=>{

    const arrGender:FormTemplate_MultiSelectType[] = [{id:'Male',name:'Male'},{id:'Female',name:'Female'}]

    prop_config_ref.current = [
                                { section_id:'id_section1'
                                  , section_name:'name_section1'
                                  , class_add:'d-flex justify-content-center'
                                  , props:{
                                      header:{
                                        show:true,
                                        title:'Information',
                                        icon:<IconField className='pi pi-info-circle' style={{color:'#FF9F43'}} />
                                      } 
                                  }
                                  // , show_border: false
                                  , data_column:[
                                        {
                                          to:12,
                                          breakpoint:{
                                            to_sm:12,
                                            to_md:6
                                          },
                                          data_input:
                                          [
                                            {
                                              type:'text',
                                              id:'id_nofaktur',
                                              disabled: true,
                                              label:'Nomor Faktur',
                                              name:'name_nofaktur',
                                              placeholder:'Nomor Faktur',
                                              required:true,
                                              style:{
                                                background_color:'cornsilk',
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile: false // nonaktif inputgroup ukuran mobile
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'nomor_faktur'
                                              },
                                              save:{
                                                key_name:'faktur'
                                              }
                                            },
                                            {
                                              type:'text',
                                              id:'id_telepon',
                                              disabled: false,
                                              label:'Telepon',
                                              name:'name_telepon',
                                              placeholder:'Input Telepon',
                                              required:false,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'edit_telepon'
                                              },
                                              save:{
                                                key_name:'telepon'
                                              }
                                            },
                                            {
                                              type:'date',
                                              id:'id_tanggal',
                                              label:'Tanggal',
                                              name:'name_tanggal',
                                              placeholder:'Input Tanggal',
                                              required:true,
                                              disabled_days:{
                                                sunday: true,
                                                saturday: true
                                              },
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              save:{
                                                key_name:'tanggal',
                                                format:'dd MMMM yyyy'
                                              },
                                              edit:{
                                                key_name:'tanggal',
                                                format:'yyyy-MM-dd'
                                              },
                                              show:{
                                                format:'dd MMMM yyyy',
                                                month_year_picker:false
                                              }
                                            }
                                            ,{
                                              type:'date',
                                              id:'id_tanggal_check',
                                              label:'Tanggal Check',
                                              name:'name_tanggal_check',
                                              placeholder:'Input Tanggal',
                                              required:false,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              disabled:false,
                                              disabled_days:{
                                                sunday: true,
                                                saturday: true
                                              },
                                              save:{
                                                key_name:'tanggal_check',
                                                format:'dd MMMM yyyy'
                                              },
                                              edit:{
                                                key_name:'tanggal_check',
                                                format:'yyyy-MM-dd'
                                              },
                                              show:{
                                                format:'dd MMMM yyyy',
                                                month_year_picker:false
                                              }
                                            }
                                            ,{
                                              type:'multi-select',
                                              id:'id_topic',
                                              name:'name_topic',
                                              label:'Topic',
                                              placeholder:'Select a Topic',
                                              select_item_type:'single',
                                              required:true,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              on_change:{
                                                parse_value_to:{multi_select_name:['name_kategori', 'name_berita']}
                                              },
                                              data_source:{
                                                type:'api',
                                                url:'https://api-berita-indonesia.vercel.app/',
                                                key_id:'name', // 'name' = key sumber
                                                key_name:'name', // 'name' = key sumber
                                                fetching:{
                                                  type:'deep-search',
                                                  filter:{
                                                    indicator_key:'endpoints'
                                                  }
                                                  // type:'array-direct'  // langsung array
                                                }
                                              },
                                              edit:{
                                                key_name:'topic_id',
                                                key_value:'topic_name'
                                              },
                                              save:{
                                                key_name:'topic'
                                              }
                                            }
                                            ,{
                                              type:'multi-select',
                                              id:'id_kategori',
                                              name:'name_kategori',
                                              label:'Kategori',
                                              placeholder:'Select a Kategori',
                                              select_item_type:'single',
                                              required:true,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              on_change:{
                                                parse_value_to:{multi_select_name:['name_berita']}
                                              },
                                              data_source:{
                                                type:'api',
                                                url:'https://api-berita-indonesia.vercel.app/',
                                                key_id:'name', // 'name' = key sumber
                                                key_name:'name', // 'name' = key sumber
                                                fetching:{
                                                  type:'deep-search',
                                                  filter:{
                                                    indicator_key:'endpoints',
                                                    conditional_array:{
                                                        'name':{type:'equals_to', value:{type:'from_multi_select', input_name:'name_topic'}}  // key object 'name' dalam api dan value perbandingan nya di ambil dari 'name_topic'
                                                    }
                                                    ,filter:{
                                                      indicator_key:'paths' // indicator_key selalu array
                                                    }
                                                    // ,filter:{ // testing saja
                                                    //   indicator_key:'testing',
                                                    //   conditional_array:{
                                                    //     'subname':{type:'equals_to', value:{type:'from_multi_select', input_name:'name_subtopic'}}
                                                    //   }
                                                    // }
                                                  }
                                                  // type:'array-direct'  // langsung array
                                                }
                                              },
                                              edit:{
                                                key_name:'kategori_id',
                                                key_value:'kategori_name'
                                              },
                                              save:{
                                                key_name:'kategori'
                                              }
                                            }
                                            ,{
                                              type:'multi-select',
                                              id:'id_berita',
                                              name:'name_berita',
                                              label:'Berita',
                                              placeholder:'Select a Berita',
                                              select_item_type:'single',
                                              required:true,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              data_source:{
                                                type:'api',
                                                url:'https://api-berita-indonesia.vercel.app/{param1}/{param2}',
                                                key_id:'title', // 'name' = key sumber
                                                key_name:'title', // 'name' = key sumber
                                                param:{
                                                  'param1':{type:'from_multi_select', input_name:'name_topic'},
                                                  'param2':{type:'from_multi_select', input_name:'name_kategori'}
                                                },
                                                fetching:{  
                                                  type:'deep-search',
                                                  filter:{
                                                    indicator_key:'data'
                                                    ,filter:{
                                                      indicator_key:'posts' // indicator_key selalu array
                                                    }
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'berita_id',
                                                key_value:'berita_name'
                                              },
                                              save:{
                                                key_name:'berita'
                                              }
                                            }
                                            ,{
                                              type:'multi-select',
                                              id:'id_kategori_tribun',
                                              name:'name_kategori_tribun',
                                              label:'Kategori Tribun',
                                              placeholder:'Select a Kategori Tribun',
                                              select_item_type:'single',
                                              required:true,
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              data_source:{
                                                type:'api',
                                                url:'https://api-berita-indonesia.vercel.app/',
                                                key_id:'name',
                                                key_name:'name',
                                                fetching:{
                                                  type:'deep-search',
                                                  filter:{
                                                    indicator_key:'endpoints',
                                                    conditional_array:{
                                                                // 'name':{type:'equals_to',value:{type:'from_input_name', content:'name_topic'}}
                                                                'name':{type:'equals_to',value:{type:'hardcode', content:'tribun'}}
                                                                // ,'path':{type:'equals_to',value:{type:'from_multi_select', input_name:'topic'}}
                                                              }
                                                    ,filter:{
                                                      indicator_key:'paths'
                                                    }
                                                  }
                                                }
                                              },
                                              save:{
                                                key_name:'kategori_tribun'
                                              }
                                            }
                                            ,{
                                              type:'editor',
                                              id:'id_content',
                                              name:'name_content',
                                              label:'Content',
                                              placeholder:'Input Content',
                                              save:{
                                                key_name:'content'
                                              },
                                              edit:{
                                                key_name:'content'
                                              }
                                            }
                                            ,{
                                              type:'fileupload-image-single',
                                              type_upload:'single',
                                              class:'mt-0',
                                              id:'id_photo',
                                              shape:'circle',
                                              name:'name_photo',
                                              label:'Photo',
                                              placeholder:'Upload Photo',
                                              // max_size_in_byte: 10240,
                                              format:{
                                                type:'Image',
                                                // ext:'image/*'
                                                ext:['.jpg','.jpeg','.png', '.avif','.tiff','.gif']

                                                // type:'Document',
                                                // ext:['.csv','.doc', '.docx','.txt', '.ppt', '.pptx','.xls','.xlsx']
                                              },
                                              required: false,
                                              edit:{
                                                  // key dan value edit harus berbentuk -> 
                                                  // *** 'photo': {id:'...', file_name:'abc', file_size:123, file_url:'https://www.localhost.com/public/images/...'}
                                                  key_name:'photo',
                                                  obj_props:{
                                                    id:'id',  // nama key dari edit
                                                    file_name:'name', // nama key dari edit
                                                    file_size:'size',
                                                    file_unit:'unit',
                                                    file_type:'type', // 'Image/jpg, ...'
                                                    file_url:'url'
                                                  }
                                              },
                                              save:{
                                                  key_name:'photo',
                                                  obj_props:{
                                                    key_file_id:'id',
                                                    key_file_cid:'cid',
                                                    key_file_name:'name',
                                                    key_file_size:'size',
                                                    key_file_type:'type',
                                                    key_file_size_unit:'unit',
                                                    key_file_status:'status'
                                                  }
                                              }
                                            }
                                            
                                          ]
                                        }
                                        ,{
                                          to:12,
                                          breakpoint:{
                                            to_sm:12,
                                            to_md:6
                                          },
                                          data_input:
                                          [
                                            {
                                              type:'fileupload-image-single',
                                              type_upload:'multiple',
                                              multiple_props:{
                                                max_height:340
                                              },
                                              class:'mt-0',
                                              id:'id_file_product',
                                              shape:'circle',
                                              name:'name_file_product',
                                              label:'Product',
                                              placeholder:'Upload Product',
                                              max_size_in_byte: 10485760,  // 10 MB
                                              format:{
                                                type:'Image',
                                                ext:'image/*'
                                                // ext:['.jpg','.jpeg', '.avif','.tiff','.gif']

                                                // type:'Document',
                                                // ext:['.csv','.doc', '.docx','.txt', '.ppt', '.pptx', '.xls', '.xlsx']
                                              },
                                              required: false,
                                              edit:{
                                                  // key dan value edit harus berbentuk -> 
                                                  // *** 'photo': {id:'...', file_name:'abc', file_size:123, file_url:'https://www.localhost.com/public/images/...'}
                                                  key_name:'product',
                                                  obj_props:{
                                                    id:'id',  // nama key dari edit
                                                    file_name:'name', // nama key dari edit
                                                    file_size:'size',
                                                    file_unit:'unit',
                                                    file_type:'type', // 'Image/jpg, ...'
                                                    file_url:'url'
                                                  }
                                              },
                                              save:{
                                                  key_name:'product',
                                                  obj_props:{
                                                    key_file_id:'id', // id dari edit
                                                    key_file_cid:'cid', // id file berjalan (user klik upload)
                                                    key_file_name:'name',
                                                    key_file_size:'size',
                                                    key_file_type:'type',
                                                    key_file_size_unit:'unit',
                                                    key_file_status:'status'
                                                  }
                                              }
                                            }
                                            ,{
                                              type:'text',
                                              id:'id_customer',
                                              disabled: false,
                                              label:'Customer',
                                              max_length: 50,
                                              name:'name_customer',
                                              required:true,
                                              placeholder:'Input Customer',
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              save:{
                                                key_name:'customer'
                                              }
                                            },
                                            {
                                              type:'text',
                                              id:'id_keterangan',
                                              disabled: false,
                                              label:'Keterangan',
                                              name:'name_keterangan',
                                              placeholder:'Input Keterangan',
                                              style:{
                                                input_group:{
                                                  enabled:true,
                                                  display:{
                                                    mobile:false
                                                  }
                                                }
                                              },
                                              edit:{
                                                key_name:'keterangan'
                                              },
                                              save:{
                                                key_name:'keterangan'
                                              }
                                            }
                                            ,{
                                              type:'number',
                                              id:'id_umur',
                                              label:'Umur',
                                              name:'name_umur',
                                              placeholder:'Input Umur',
                                              required:true,
                                              disabled:false,
                                              save:{
                                                key_name:'umur'
                                              },
                                              edit:{
                                                key_name:'umur'
                                              },
                                              rules:{
                                                decimal_scale:2,
                                                min: -9999999,
                                                max: 9999999
                                              }
                                            }
                                            ,{
                                              type:'multi-select',
                                              id:'id_gender',
                                              name:'name_gender',
                                              label:'Gender',
                                              placeholder:'Select a Gender',
                                              select_item_type:'single',
                                              required:true,
                                              data_source:{
                                                type:'hardcode',
                                                data:[...arrGender]
                                              },
                                              edit:{
                                                key_name:'gender',  // 'id' dalam multi-select
                                                key_value:'gender'  // 'name' dalam multi-select
                                              },
                                              save:{
                                                key_name:'gender'
                                              }
                                            }
                                            ,{
                                              type:'password',
                                              id:'id_old_password',
                                              name:'name_old_password',
                                              label:'Old Password',
                                              placeholder:'Input Old Password',
                                              required:false,
                                              feedback:true,  // show meter strong, medium, weak                                             
                                              edit:{
                                                key_name:'password',
                                              },
                                              save:{
                                                key_name:'password'
                                              }
                                            }
                                            ,{
                                              type:'input-switch',
                                              id:'id_active',
                                              name:'name_active',
                                              label:'Status',
                                              placeholder:'Active',
                                              required:true,
                                              edit:{
                                                key_name:'active',
                                              },
                                              save:{
                                                key_name:'active'
                                              }
                                            }
                                            ,{
                                              type:'email',
                                              class:'mt-1',
                                              id:'id_email',
                                              name:'name_email',
                                              label:'Email',
                                              placeholder:'Input Email',
                                              required: false,
                                              edit:{
                                                key_name:'email',
                                              },
                                              save:{
                                                key_name:'email'
                                              }
                                            }
                                            ,{
                                              type:'chips',
                                              class:'mt-0',
                                              id:'id_tags',
                                              name:'name_tags',
                                              label:'Tags',
                                              placeholder:'Input Tags',
                                              required: false,
                                              edit:{
                                                key_name:'tags',
                                                split_string:','
                                              },
                                              save:{
                                                key_name:'tags',
                                                format:{
                                                  // type:'array'
                                                  type:'string',
                                                  join_separator:','
                                                }
                                              }
                                            }
                                            
                                          ]
                                        }
                                        
                                      ]
                                  , detail:[
                                    {
                                      type:'section_detail',
                                      name:'name_detail_transaksi', // harus unik antar detail - name
                                      title:'Detail',
                                      icon:<IconField className='pi pi-table' style={{color:'#4389ff'}} />
                                      , edit:{
                                        key_name: 'edit_detail_transaksi'
                                      }
                                      , save:{
                                          key_name: 'detail_transaksi'
                                      }
                                      , table:{
                                          set_new_key_row_id_edit:'id',
                                          set_new_key_row_uuid:'uuid',  // nama key baru by template uuid per baris data
                                          set_new_key_status_for_delete:'status_row', // key baru status 'DELETE' dalam tabel
                                          density:'compact',
                                          enableColumnResizing:true,
                                          data_column:[
                                            {
                                              accessorKey:'action',
                                              header:'Action',
                                              grow:false,
                                              custom_cell:{
                                                type:'actions',
                                                size:100,
                                                actions:[
                                                  // {type:'custom_element_in_modal', style:{backgroundColorHover:'#abeef0'}, icon:<IconField className='pi pi-file-edit' style={{color:'#4389ff'}} />}
                                                  // ,{type:'custom_element_in_modal', style:{backgroundColorHover:'#ffd7d7'}, icon:<IconField className='pi pi-trash' style={{color:'#FF0000'}} />}
                                                  {type:'custom_element_in_modal', name:'Edit', tipe_form:'Custom', style:{backgroundColorHover:'white'}
                                                    , icon:<IconField className='pi pi-file-edit' style={{color:'#4389ff'}} />
                                                    , icon_disabled:<IconField className='pi pi-file-edit' style={{color:'lightgrey'}} />
                                                    , modal:{enabled:true, header:{text:'Edit Item', backgroundColor:'cadetblue'}}
                                                  }
                                                  ,
                                                  {type:'custom_element_in_modal', name:'Delete', tipe_form:'Custom', style:{backgroundColorHover:'white'}
                                                    , icon:<IconField className='pi pi-trash' style={{color:'#FF0000'}} />
                                                    , icon_disabled:<IconField className='pi pi-trash' style={{color:'lightgrey'}} />
                                                  }
                                                ]
                                              }
                                            },
                                            {
                                              accessorKey:'nama_produk',  // tidak ada key nya
                                              header: 'Produk',
                                              grow:true,
                                              custom_cell:{
                                                type:'image_with_label',
                                                url:{key:'image_product'},
                                                label:{key:'nama_produk'},
                                                suffix:{key:'code'}
                                              }
                                            }
                                            ,{
                                              accessorKey:'kode_produk',
                                              header:'Kode Produk',
                                              grow:true
                                            }
                                            // ,{
                                            //   accessorKey:'nama_produk',
                                            //   header:'Nama Produk',
                                            //   grow:true
                                            // }
                                            ,{
                                              accessorKey:'1h',
                                              header:'1h%',
                                              grow:true,
                                              align:'right',
                                              custom_cell:{
                                                type:'trend_arrow_up_down',
                                                suffix:'%',
                                                rules:{
                                                  key: '1h_trend',
                                                  'up': 'naik',
                                                  'down':'turun'
                                                },
                                                // style:{
                                                //   type:'background-with-color'
                                                // }
                                              }
                                            }
                                            ,{
                                              accessorKey:'harga',
                                              header:'Harga',
                                              grow:true,
                                              custom_cell:{
                                                type:'currency',
                                                // align:{position:'right', gap:4},
                                                align:'space-between',
                                                prefix:'Rp',
                                                vertical_align:'sub'
                                              }
                                            }
                                            ,{
                                              accessorKey:'data_trend',
                                              header:'Trend',
                                              grow:true,
                                              custom_cell:{
                                                type:'trend_line',
                                                rules:{
                                                  comparison_start_end:true
                                                }
                                              }
                                            }
                                            ,{
                                              accessorKey:'status',
                                              header:'Status',
                                              grow:true,
                                              custom_cell:{
                                                type:'tag',
                                                rules:{
                                                  'Process':'warning',
                                                  'Completed':'success',
                                                  'Failed':'danger',
                                                  'Other':{other_color:'#f0f'}
                                                },
                                                align:'center'
                                              }
                                            }
                                          ]
                                      }
                                    }
                                  ]
                                }];

    // alert(JSON.stringify(data_source_temp.current))

    // for(let arr_temp of data_source_temp.current) {
    //   arr_temp['tes'] = 'good';
    // }

    // alert(JSON.stringify(data_source_temp.current))
    // console.log(data_source_temp.current)

    
    // setPropConfig([...prop_config_ref.current]);   // ** previous
    setPropConfig({type:'Form', config: [...prop_config_ref.current]});

    final_session_ref.current = {
      ...final_session_ref.current,
      button:{
        cancel:{
          enabled: true,
          show: true
        },
        save:{
          enabled: true,
          show: true
        }
      }
    };

    setFinalSession({...final_session_ref.current});

    setArrDataEdit({
        'nomor_faktur':'J-20241112-123-A879',
        'edit_telepon': '0561-12345678',
        'tanggal': '2024-12-01',
        'keterangan': 'Kirim ke sanggau',

        'topic_id':'antara',   // config : edit -> key_name
        'topic_name':'antara', // config : edit -> key_value

        'kategori_id':'terbaru',  // bisa berupa array ['terbaru','antara'], id dan name pada array harus sama jumlah item nya
        'kategori_name':'terbaru',  // key-value di pasangkan berdasarkan urutan index nya, contoh: id:['terbaru_id'], name:['terbaru_name']

        'berita_id':"Menteri ATR/BPN bersinergi dengan BUMN wujudkan swasembada energi",
        'berita_name':"Menteri ATR/BPN bersinergi dengan BUMN wujudkan swasembada energi",

        'active': true,
        'umur':198.23,

        // 'password':34535,
        'gender': 'Male'  // jika tipe nya single, maka string 'male'. jika multiple, maka array ['male','female']

        ,'email':'gunardihalim@gmail.com'
        // ,'tags':'abc, good,hello'
        ,'tags': 'Good,Better'
        ,'photo':{id:'id-gambar-1', name:'Modern-Technology.jpg', size:'199', type:'image/jpg', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
        ,'product':[
          // size di sini harus dalam bentuk bytes semua
          // * File yang multiple harus satu pilihan antara Document atau Image
          
                  {id:'id-file-1', name:'Modern-Technology.docx', size:'200.578', type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
                  ,{id:'id-file-2', name:'data_sales.doc', size:'500', type:'application/msword', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
                  ,{id:'id-file-3', name:'data_customer_list.xls', size:'150', type:'application/vnd.ms-excel', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
                  ,{id:'id-gambar-1', name:'Modern-Technology.jpg', size:'199', type:'image/jpg', unit:'KB', url:'https://www.techquintal.com/wp-content/uploads/2017/01/Modern-Technology.jpg'}
              ]

        // *** Detail Table 
        , 'edit_detail_transaksi':[
                {id:'1', kode_produk:'shell',  image_product:'https://wallpapers.com/images/hd/shell-logo-red-yellow-ylhb2f0hphp6ey09-ylhb2f0hphp6ey09.png', nama_produk:'Shell', code:'SHL', '1h':0.12, '1h_trend':'naik',  harga:125000, data_trend:randomNumberArray(30), status:'Failed'}
                ,{id:'2', kode_produk:'pepsi', image_product:'https://awsimages.detik.net.id/community/media/visual/2019/11/22/5046d875-0493-4a5e-9057-0d402c1d841e.jpeg?w=600&q=90', nama_produk:'Pepsi', code:'PSI', '1h':'5.00', '1h_trend':'turun', data_trend:randomNumberArray(50), harga:500500.19, status:'Completed'}
                ,{id:'3', kode_produk:'dior', image_product:'https(broken tes)://i.pinimg.com/736x/e0/08/c7/e008c74ffb23fdfcdf3ffdf39ba44b9b.jpg', nama_produk:'Dior', code:'DIR', '1h':10.58, '1h_trend':'turun', harga:75000, data_trend:randomNumberArray(50), status:'Process'}
                ,{id:'4', kode_produk:'coca-cola', image_product:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4bYOCRGoYXnHFtxxvhouF4dffr6IbIFkyzg&s', nama_produk:'Coca Cola', code:'CCL',  '1h':97.23, '1h_trend':'naik', harga:15750, data_trend:randomNumberArray(50), status:'Other'}
          ]

        , 'content':'Halo Dunia'
    })

    setTimeout(()=>{
      setStatusDone(true);
    },100)

  },[])


  useEffect(()=>{
    setTimeout(()=>{
      // dispatch icon title
      storeMenu.dispatch({type:'titleicon', text: 'Penjualan'})

      // dispatch breadcrumb path
      storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Transaksi', value:'Transaksi'}, {key:'Penjualan', value:'Penjualan'}]})
      
    },100)
  },[])


  const initialState:number = 0;
  const redus = (state, action:{type:string})=>{
    switch(action.type){
      case 'a':state += 1;break;
      case 'b':state += 2;break;
      case 'b':state += 3;break;
    }
    return state;
  }
  const [dataredus,dispatchredus] = useReducer(redus, initialState);

  const outChange = (obj, formData:FormData|null) => {

    // // * Tes Reducer
    // dispatchredus({type:'a'})

    // console.clear();
    console.log("Out Change");
    console.log(obj);

    if (formData !== null){
      console.log("Form Data");
      // console.log(formData)
      formData.forEach((value, key)=>{
        console.log(key);
        if (typeof value === 'string'){
          // console.log(JSON.stringify(JSON.parse(value),null,2));
        }
        else {
          // console.log(value)
        }
      })
    }

    if (
      obj?.['status_proses'] === 'process_out_change' && 
        obj?.['posisi_name_input_when_onchange'] != null
    ) {
        // isi kembali perubahan data ke form template karena kondisi tertentu

        let tempInDataChange:FormTemplateInDataChangeType = {set:[]};
        if (  
              // posisi input sedang di name_telepon
              obj?.['posisi_name_input_when_onchange'] === 'name_telepon' &&
              obj?.['data']?.['telepon']) {
    
              let prosesToSetState:boolean = false;
              if (obj?.['data']?.['telepon'] === '123') {

                tempInDataChange = {
                    set:[
                          {type:'value_input', data:[{name:'name_customer', value:'CUSTOMER IN data Change'}]},
                          {type:'value_input', data:[{name:'name_umur', value:9700.98}]},
                          {type:'date_input', data:[{name:'name_tanggal', value: new Date(2024,0,1)},
                                              {name:'name_tanggal_check', value: null}
                                              // {name:'name_tanggal_check', value: new Date(2024,1,1)}
                          ]}
                          ,{type:'multiselect_input', data:[{name:'name_gender', value:['Male']}]}  // perhatikan yang single atau multi input
                        ]
                }
                prosesToSetState = true;
              }
      
              if (prosesToSetState){
                setInDataChangeState({...tempInDataChange});
              }
            
        }
    }

  }

  const outConfirmDialogHandle:PropConfigConfirmDialog = (objElement, formData) => {

    if (objElement && objElement?.['index'] !== -1) {

      if (typeof objElement?.['type'] !== 'undefined') {
        if (objElement?.['type'] === 'Delete File') {
          
          // ** Kondisi Jika Klik Yes (Delete)

          if (objElement?.['obj_input']?.['name'] === 'name_photo'){  // posisi input
            setInConfirmDialog({confirm:true})
          }
          else if (objElement?.['obj_input']?.['name'] === 'name_file_product'){
            setInConfirmDialog({confirm:true})
          }

          // console.log(JSON.stringify(objElement, null, 2))
      
          // formData.forEach((value, key)=>{
          //   console.log(`Value ${key} : ${value}`)
          // })

        }
      }
    }

  }


  let sampleRef = useRef<any>(null);
  
  useEffect(()=>{

    const click_InfiniteSlider = (item) => {
      alert(item)
    }

    let idSlider = document.getElementById('samp-id-infinite-slider');
    if (idSlider 
        // && sampleRef.current
        )
    {

        let arrTemp:HTMLDivElement[] = [];

        // ** ReactDOM.render hanya bisa digunakan sampai react versi '17'
        // ReactDOM.render(<InfiniteSlider />, idSlider);

        for (let i=0; i<1; i++) {
          const divElement = document.createElement('div');
          // const divElement2 = document.createElement('div');

          const root = ReactDOM.createRoot(divElement); // buat parent
          root.render(<InfiniteSlider outputClick={click_InfiniteSlider}/>);  // masukkan child ke parent

          arrTemp = [...arrTemp, divElement];
        }

        // const root2 = ReactDOM.createRoot(divElement2); // parent
        // root2.render(<InfiniteSlider />);  // children

        // * jika mau menambahkan element yang sama harus buat createElement dua kali agar instance nya beda

        // *** bisa pakai useRef juga untuk appendChild (contoh berikut)
        // sampleRef.current.appendChild(divElement);
        // ***---

        // *** Looping berdasarkan element yang terisi dalam arrTemp
        // console.log(arrTemp)
        if (arrTemp.length > 0){
          for (let i=0;i<arrTemp.length;i++){
            idSlider.appendChild(arrTemp[i]);
          }
        }
        // idSlider.appendChild(divElement2);
    }
  },[])

  // useEffect(()=>{
  //   console.log(process.env.REACT_APP_HTTPS);
  //   console.log(process.env.REACT_APP_SSL_CRT_FILE);
  //   console.log(process.env.REACT_APP_SSL_KEY_FILE);
  // },[])

  const fetchApiData = () => {
    // jika pakai promise, di sini tidak perlu pakai async await lagi
    return new Promise((resolve, reject)=>{
      fetch('https://api-berita-indonesia.vercel.app/')
                        .then((response)=>response.json())
                        .then((data)=>resolve(data))
                        .catch(error=>reject(error))
    })
    
      // .then((data)=>{return data})

  }

  const handleClickTesElement = async (element:HTMLElement) => {

    element.style.backgroundColor = "red";
    element.style.color = "white";

    element.style.removeProperty("height");
    element.style.removeProperty("overflow");
    // element.style.height = "50px";

    
    // const a = element.nextElementSibling as HTMLElement;
    // a.style.color = "red";

    if (element?.nextElementSibling instanceof HTMLElement) {
      element.nextElementSibling.style.color = "red";
      element.nextElementSibling.style.fontWeight = "700";
    }
    console.log(element)

    // let tes_fetch_api = await fetchApiData();
    // alert(JSON.stringify(tes_fetch_api,null,2))
    // alert('Good')
  }

  useEffect(()=>{

    for (let i=0; i<3;i++){
      let elecont = document.createElement('div');
      elecont.textContent = "Halo Testing";
      elecont.style.transition = "all 1s ease-in-out";
      elecont.style.height = "0";
      elecont.style.overflow = 'hidden';
  
      document.getElementById('tes-element')?.appendChild(elecont);
  
      let button = document.createElement('button');
      button.textContent = "Klik"
      button.addEventListener('click', ()=>handleClickTesElement(elecont))
  
      document.getElementById('tes-element')?.appendChild(button);
    
    }


  },[])

  const [ringCheck, setRingCheck] = useState<boolean>(false);

  useEffect(()=>{
    const ringRekursif = () => {

      const check1 = document.querySelector('.check-container .check-idx-1');
      const check2 = document.querySelector('.check-container .check-idx-2');
      if (check1){
        if (!check1.classList.contains('check-line-1')){
          check1.classList.add('check-line-1');
        }
      }
      
      if (check2){
        if (!check2.classList.contains('check-line-2')){
          check2.classList.add('check-line-2');
        }
      }
      const timeout1 = setTimeout(()=>{
        // if (check1?.classList.contains('check-line-1')){
        //   check1.classList.remove('check-line-1');
        // }
        // if (check2?.classList.contains('check-line-2')){
        //   check2.classList.remove('check-line-2');
        // }

        const timeout2 = setTimeout(()=>{
          // ringRekursif();
          clearTimeout(timeout2);
        },100)
        clearTimeout(timeout1)
      },800)
    }
    // ringRekursif();

    const showRingCheck = () => {
        if (!ringCheck){
          setRingCheck(true);

          // setTimeout(()=>{
          //   setRingCheck(false);

          //   setTimeout(()=>{
          //     showRingCheck();
          //   },50)
          // },1500)
        }
    }

    showRingCheck();

    return ()=>{
      // ringRekursif();
    }

  },[])
  
  const randomNumberArray = (repeat:number) => {
    let numbers:number[] = [];
    for(let i=0;i < repeat; i++){
      numbers.push(Math.random() * 100);
    }
    return numbers;
  }

  const outBackTo = ({status}) => {
      if (status){
        alert("Back To List")
      }
  }

  const options_jspdf = {
    filename: 'my-document.pdf',
    margin:[10,10,20,10],
    image:{
            // type:'jpeg'
            type:'jpeg'
            , quality:0.98},
    html2canvas: {scale:3  // scale : tingkatkan kualitas tulisan agar tidak pecah
                , useCors: true // kalau pakai gambar eksternal
                }
    ,jsPDF:{
      unit:'mm',
      format:[210, 140],
      orientation:'landscape' // portrait or landscape
    },
    // pagebreak:{mode:['avoid-all', 'css', 'legacy']}  // strict
    pagebreak:{
      mode:['css', 'legacy']
      // ,before:'.page-break'  // Bisa pakai class untuk kontrol manual
    }
  }

  const elementRefFaktur = useRef<any>(null);
  const handleConvertToPdf = () => {
    html2pdf()
      .from(elementRefFaktur.current)
      .set(options_jspdf)
      .toPdf()
      .get('pdf')
      .then((pdf)=>{
        const totalPages = pdf.internal.getNumberOfPages();

        const lastPage = totalPages;
        const pageContent = pdf.internal.pages[4];
        // pdf.deletePage(lastPage);
        // alert(pageContent)
        // alert(pageContent.join('').trim() === '')

        for (let i=1;i<=totalPages;i++){
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(100);
          pdf.text(
            pdf.internal.pageSize.width - 50,
            pdf.internal.pageSize.height - 10,
            `Page ${i} of ${totalPages}`
          )
        }
        pdf.save('dokumentku.pdf');

      })
  }

  return (
    // <FormTemplateContextProv>

    <div>

      <div>
          <ButtonPrime 
              onClick={handleConvertToPdf}
              color='primary' severity='success' label='Print' icon={'pi pi-print'} rounded outlined/>
      </div>
      <div ref={elementRefFaktur} className='mb-2' 
            // style={{paddingBottom:'40px'}}
          style={{overflowWrap:'break-word', wordBreak:'break-word'}}
        >
        <h1>My Document</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia vel ipsa earum quos optio at ducimus, dolorum facere eius quod ad nihil dolores minus, tempora inventore molestias deleniti incidunt laborum in! Itaque placeat, eveniet ipsam sunt facilis praesentium non nisi porro quia iste, magni odio quam dicta quos voluptatum veniam eaque qui? Provident magnam obcaecati, alias libero ducimus dolorum molestias accusantium saepe pariatur ullam, harum maiores animi, adipisci numquam. Minus doloribus pariatur distinctio ex ducimus! Soluta voluptatem exercitationem ea unde ad fugit distinctio delectus repellendus, ratione magnam esse odio, nostrum quasi autem suscipit dolore voluptatum. Sint quisquam numquam quidem quibusdam.</p>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia vel ipsa earum quos optio at ducimus, dolorum facere eius quod ad nihil dolores minus, tempora inventore molestias deleniti incidunt laborum in! Itaque placeat, eveniet ipsam sunt facilis praesentium non nisi porro quia iste, magni odio quam dicta quos voluptatum veniam eaque qui? Provident magnam obcaecati, alias libero ducimus dolorum molestias accusantium saepe pariatur ullam, harum maiores animi, adipisci numquam. Minus doloribus pariatur distinctio ex ducimus! Soluta voluptatem exercitationem ea unde ad fugit distinctio delectus repellendus, ratione magnam esse odio, nostrum quasi autem suscipit dolore voluptatum. Sint quisquam numquam quidem quibusdam.            
        </p>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia vel ipsa earum quos optio at ducimus, dolorum facere eius quod ad nihil dolores minus, tempora inventore molestias deleniti incidunt laborum in! Itaque placeat, eveniet ipsam sunt facilis praesentium non nisi porro quia iste, magni odio quam dicta quos voluptatum veniam eaque qui? Provident magnam obcaecati, alias libero ducimus dolorum molestias accusantium saepe pariatur ullam, harum maiores animi, adipisci numquam. Minus doloribus pariatur distinctio ex ducimus! Soluta voluptatem exercitationem ea unde ad fugit distinctio delectus repellendus, ratione magnam esse odio, nostrum quasi autem suscipit dolore voluptatum. Sint quisquam numquam quidem quibusdam.</p>
      </div>

      {/* Magnify Custom */}
      {/* <div style={{width:'300px', height:'300px'}} className='mb-2'>
          <MagnifyCustom imgSrc={`https://cdn.britannica.com/08/187508-050-D6FB5173/Shanghai-Tower-Gensler-San-Francisco-world-Oriental-2015.jpg`} 
                      imgAlt={'City'}
                      zoomLevel={5}/>
      </div> */}
      {/* ------------ */}

      {/* Testing Provider */}
      
        {/* <ButtonProviderClick param='Hello World'/> */}

      {/* ------------- */}

          {/* <Trend 
                data={randomNumberArray(30)} 
                strokeWidth={2}
                strokeLinecap={'butt'}

                radius={0}
                smooth

                // gradient={['#0ff','#0F0', '#FF0']}
                gradient={['orange','red', '#FF0']}

                autoDraw
                autoDrawDuration={1000}
                autoDrawEasing='ease-in'
                /> */}

          {/* Full Screen hanya bekerja pada browser 'Edge', 'Chrome' -> jangan buka devtools F12 */}
          {/* <ButtonPrime label="Full Screen" onClick={()=>{

              const element = document.documentElement;
            
                element.requestFullscreen().catch((error) => {
                  console.error("Gagal masuk ke mode fullscreen:", error);
                });
          }}/> */}


          {/* ----- Check Mark */}
          {/* {
            ringCheck && (
                  <CheckMarkAnimate />
            )
          } */}

          {/* <div className='mt-4'></div> */}
          {/* ---------------- */}


          {/* <h1>State : {dataredus}</h1> */}


          {/* Testing Create Element by DOM */}

          {/* <div id = "tes-element">
              <div style = {{color:'grey', pointerEvents:'none', opacity:0, height: 0}}>
                  © Gunardi Halim
              </div>
          </div> */}

          <div
            className='fit-infinite-slider'
            style={{
              // border:'1px solid blue'
              // width:'500px'
            }}
            // id = "samp-id-infinite-slider" // "ReactDOM.createRoot -> Render"
            // ref={sampleRef}
          >
            {/* Render Element 'InfiniteSlider' secara dinamis dari useEffect */}
              {/* <InfiniteSlider /> */}

          </div>


          {/* <div className='my-3'>
            <RichEditor />
          </div> */}

          {/* Google Sign In  */}
          {/* <div className='my-1 w-100 d-flex align-items-center'>
              <code style={{fontSize:'20px',color:'grey'}}> SSO Manual </code>
              <LoginGoogle />
              <LoginFacebook />

          </div> */}

              {/* <LoginTwitter /> */}
              {/* <LoginLinkedin /> */}


          {/* <div className='mb-3 mt-2 d-flex align-items-center' style={{overflow:'auto'}}>
              <code style={{fontSize:'20px', color:'grey'}} className='me-2'> SSO Auth0 </code><LoginAuth0 />
          </div> */}


          {/* <div className='col-12 col-md-4'>
              <NestingMenu 
                    arr_menu={[
                                {id:'id-menu',name:'Menu-1'
                                  , icon: <InputIcon className='pi pi-objects-column nm-custom-menu' 
                                            style={{fontSize:'15px', marginRight:'15px'}}></InputIcon>
                                  , items:[
                                      {id:'id-menu11', name:'Menu-1-1'},
                                      {id:'id-menu12', name:'Menu-1-2'
                                          ,items:[
                                            {id:'id-menu121', name:'Menu-1-2-1'},
                                            {id:'id-menu122', name:'Menu-1-2-2'}
                                          ]
                                      },
                                      {id:'id-menu13', name:'Menu-1-3'}
                                    ]
                                },
                                {id:'id-menu2',name:'Menu-2'
                                  , icon: <InputIcon className='pi pi-receipt nm-custom-menu' 
                                            style={{fontSize:'15px', marginRight:'15px'}}></InputIcon>
                                  , items:[
                                      {id:'id-menu21', name:'Menu-2-1'},
                                      {id:'id-menu22', name:'Menu-2-2'},
                                      {id:'id-menu23', name:'Menu-2-3'},
                                      {id:'id-menu24', name:'Menu-2-4'},
                                      {id:'id-menu25', name:'Menu-2-5'},
                                      {id:'id-menu26', name:'Menu-2-6'},
                                      {id:'id-menu27', name:'Menu-2-7'},
                                      {id:'id-menu28', name:'Menu-2-8'},
                                      {id:'id-menu29', name:'Menu-2-9'},
                                      {id:'id-menu30', name:'Menu-3-0'}
                                    ]
                                  },
                                {id:'id-menu3',name:'Menu-3'
                                  , icon: <InputIcon className='pi pi-receipt nm-custom-menu' 
                                            style={{fontSize:'15px', marginRight:'15px'}}></InputIcon>
                                  , items:[
                                    {id:'id-menu31', name:'Menu-3-1'},
                                    {id:'id-menu32', name:'Menu-3-2'
                                        ,items:[
                                          {id:'id-menu321', name:'Menu-3-2-1'},
                                          {id:'id-menu322', name:'Menu-3-2-2',
                                            items:[
                                              {id:'id-menu3221', name:'Menu-3-2-2-1'},
                                              {id:'id-menu3222', name:'Menu-3-2-2-2'}
                                            ]
                                          }
                                        ]
                                    },
                                    {id:'id-menu33', name:'Menu-3-3'}
                                  ]
                                  }
                              ]
                            } 
                    index={0}
                    item={null}
                    />
          </div> */}

          {
            statusDone && (
                  <>
                    <FormTemplate 
                    
                        props={propConfig} 
                        // props={propConfig} 

                        style={{
                          show_border:true
                        }}

                        final_session={finalSession}
                        status={'edit'} 
                        edit_data={arrDataEdit}
                        inDataChange={inDataChangeState}
                        outDataChange={outChange}

                        inConfirmDialog={inConfirmDialog}
                        outConfirmDialog={outConfirmDialogHandle}

                        outBackTo={outBackTo}
                    />
                </>
            )
          }
      </div>
    // </FormTemplateContextProv>
  )
}

export default TransaksiPenjualanForm