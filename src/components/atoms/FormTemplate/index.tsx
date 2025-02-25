import React, { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Trend from 'react-trend';
import styles from './FormTemplate.module.scss';
import './FormTemplate.scss';
import { v7 as uuidv7, v6 as uuidv6 } from 'uuid';
import { Button, Form, Modal } from 'react-bootstrap';
import {Button as ButtonPrime} from 'primereact/button';
import {Toast} from 'primereact/toast';
import { Message } from 'primereact/message';
import _ from 'lodash';
import { Bug, Ext_Csv, Ext_Doc, Ext_Docx, Ext_Ppt, Ext_Pptx, Ext_Txt, Ext_Xls, Ext_Xlsx, NoData } from '../../../assets';
import { Bars } from 'react-loader-spinner';
import { CollectionsOutlined, ConstructionOutlined, CrisisAlert, DateRangeRounded, MusicNote } from '@mui/icons-material';
import ReactDatePicker from 'react-datepicker';
import {format, subDays} from 'date-fns';
import { Ripple } from 'react-ripple-click';
import 'react-ripple-click/dist/index.css'
import { NumericFormat } from 'react-number-format';
import { MultiSelect } from 'primereact/multiselect';
import { PPE_getApiSync } from '../../../services/functions';
import { Password } from 'primereact/password';
import { InputSwitch } from 'primereact/inputswitch';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Image } from 'primereact/image';
import { PrimeReactContext } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import CheckMarkAnimate from './CheckMarkAnimate';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MaterialReactTable, MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import { FormTemplateContext, FormTemplateContextInterface } from './FormTemplateContext';
// import { format } from 'date-fns';

export type FormatDateFormTemplate = 'dd MMMM yyyy'|'yyyy-MM-dd';
export type StatusProsesDataChangeType = 'process_out_change'|'not_enter_element';

type Edit_FileUpload_Image_Single_Type = {
  [key_name:string]:{ // nama key edit
    file_name:string; // nama file
    file_size:string; // ukurang file
    file_url:string;  // url link photo gambar
  }; 
}

// type SingleKey = {
//   [key: string]:{
//     file_name: string;
//     file_size: string;
//     file_url: string;
//   };
// } 
// & {
//   [K in keyof any]: K extends string ? Record<K, any> : never;
// };

// type SingleKey<T extends Record<string, { file_name: string; file_size: string; file_url: string }>> = 
//   keyof T extends infer K
//     ? K extends string
//       ? { [key in K]: T[K] } & (Exclude<keyof T, K> extends never ? {} : never)
//       : never
//     : never

// Tipe untuk memastikan hanya satu key yang diperbolehkan
// type SingleKey<T extends Record<string, { file_name: string; file_size: string; file_url: string }>> =
//   keyof T extends string
//     ? { [K in keyof T]: K extends string ? T[K] : never } // Memastikan hanya satu key yang ada
//     : never;

type SingleKey<T extends Record<string, { file_name: string; file_size: string; file_url: string }>> =
  keyof T extends string
    ? { [K in keyof T]: T[K] } // Hanya satu key yang bisa ada
    : never;

type EditType = SingleKey<{
  [key: string]: {
    file_name: string;
    file_size: string;
    file_url: string;
  };
}>

// umum nya di gunakan untuk multi-select fetch api atau object data
type FormTemplate_ConfigFilterRekursif = {
  indicator_key:string;
  conditional_array?:{  // kondisi filter array setelah terambil berdasarkan indicator_key
    // [key:string] -> key dalam object hasil api
    [key:string]:{type:'equals_to', value: {type:'hardcode', content:string|number} // 'hardcode' langsung suatu string tertentu
                                        |{type:'from_multi_select', input_name:string} // 'from_multi_select', value dari multi select yang di tentukan (khusus kondisi 'Edit')
                } 
  }
  ;filter?:FormTemplate_ConfigFilterRekursif
}

export type FormTemplateDataInputType = {
                                            type:'text';
                                            edit?:{
                                              key_name:string   // sumber data dari object 'edit'
                                            },
                                            disabled?:boolean;
                                            id:string;
                                            label:string;
                                            max_length?:number;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            style?:{
                                              background_color?:'cornsilk';
                                              input_group?:{
                                                enabled:boolean;  // model class inputgroup nya primereact
                                                display?:{
                                                  mobile?:boolean;    // apakah mau pakai inputgroup untuk ukuran mobile
                                                }
                                              };
                                            };
                                            save:{
                                              key_name:string
                                            }
                                          }
                                          |{
                                            type:'date';
                                            edit?:{
                                              key_name:string;
                                              format:FormatDateFormTemplate;
                                            };
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            disabled?:boolean;
                                            disabled_days?:{
                                              saturday?:boolean;
                                              sunday?:boolean
                                            };
                                            style?:{
                                              input_group?:{
                                                enabled:boolean;  // model class inputgroup nya primereact
                                                display?:{
                                                  mobile?:boolean;    // apakah mau pakai inputgroup untuk ukuran mobile
                                                }
                                              };
                                            };
                                            save:{
                                              key_name:string;
                                              format:FormatDateFormTemplate|'MMMM yyyy';
                                            };
                                            show?:{
                                              format:FormatDateFormTemplate|'MMMM yyyy';
                                              month_year_picker?:boolean;
                                            }
                                          }
                                          |{
                                            type:'number';
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            disabled?:boolean;
                                            rules?:{
                                              decimal_scale?:0|1|2|3|4|5|6|7;
                                              min?:number;
                                              max?:number;
                                            };
                                            edit?:{
                                              key_name:string
                                            };
                                            save:{
                                              key_name:string;
                                            };
                                          }
                                          |{
                                            type:'multi-select';
                                            select_item_type:'single'|'multiple';
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string;
                                            required?:boolean;
                                            style?:{
                                              input_group?:{
                                                enabled:boolean;  // model class inputgroup nya primereact
                                                display?:{
                                                  mobile?:boolean;    // apakah mau pakai inputgroup untuk ukuran mobile
                                                }
                                              };
                                            };
                                            on_change?:{
                                                parse_value_to:{multi_select_name:string[]}  // hanya khusus input multi-select
                                            };
                                            data_source?:{
                                                  type:'hardcode';
                                                  data:FormTemplate_MultiSelectType[];
                                                }|{
                                                  type:'api';
                                                  url:string; // url bisa berisi parameter yang di apit dengan "{ }" -> "{param1}". jika ada param, wajib definisikan property param nya dari mana sumber input.
                                                  key_id:string;  // key yang menjadi 'id' dari object api sumber yang di get
                                                  key_name:string;   // key yang menjadi 'name' dari object api sumber yang di get
                                                  param?:{  // nama 'param_key' harus sama dengan param di url
                                                      [param_key:string]:{type:'from_multi_select'; input_name:string}  // input name sumber hanya berlaku untuk multi-select
                                                  };
                                                  fetching:{  // cara mengambil data
                                                    type:'deep-search'; // hasil output api yang masih perlu diolah lagi
                                                    filter:FormTemplate_ConfigFilterRekursif
                                                  }
                                                  |{
                                                    type:'array-direct'  // hasil output api langsung berupa array
                                                  }
                                                    
                                                };
                                            edit?:{
                                              key_name:string;
                                              key_value:string;
                                            };
                                            save:{
                                              key_name:string;
                                            };
                                          }
                                          |{
                                            type:'password';
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            disabled?:boolean;
                                            feedback?:boolean;
                                            edit?:{
                                              key_name:string
                                            };
                                            save:{
                                              key_name:string;
                                            };
                                          }
                                          |{
                                            type:'input-switch';
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            disabled?:boolean;
                                            edit?:{
                                              key_name:string
                                            };
                                            save:{
                                              key_name:string;
                                            };
                                          }
                                          |{
                                            type:'email';
                                            class?:string;
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            disabled?:boolean;
                                            edit?:{
                                              key_name:string
                                            };
                                            save:{
                                              key_name:string;
                                            };
                                          }
                                          |{
                                            type:'chips';
                                            class?:string;
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            required?:boolean;
                                            disabled?:boolean;
                                            edit?:{
                                              key_name:string;
                                              split_string:string;  // selain array, tentukan char indikator split nya misal ','. Bisa terima 2 kondisi 'string' atau 'array'
                                            };
                                            save:{
                                              key_name:string;
                                              format:{
                                                  type:'array'
                                                }
                                                |{
                                                  type:'string';
                                                  join_separator:string;  // contoh : ',' jadi 'string1, string2'
                                                }
                                            };
                                          }
                                          |{
                                            // *** PIIIS
                                            type:'fileupload-image-single';
                                            type_upload:'single'|'multiple';
                                            multiple_props?:{
                                              max_height?:number;  // max height content item yang tampil (khusus type_upload = 'multiple')
                                            },
                                            class?:string;
                                            shape?:'circle'|'square';
                                            id:string;
                                            label:string;
                                            name:string;
                                            placeholder:string|null;
                                            max_size_in_byte?:number;  // size dalam bentuk byte
                                            format:{
                                                type:'Image',
                                                ext:'image/*'|UploadFormatExtensionImages[]
                                              }|{
                                                type:'Document',
                                                ext:UploadFormatExtensionDocument[]
                                              };
                                            required?:boolean;
                                            disabled?:boolean;
                                            edit?: {
                                              // key dan value edit harus berbentuk -> 
                                              // *** 'photo': {file_name:'abc', file_size:123, file_url:'https://www.localhost.com/public/images/...'}
                                              key_name:string;
                                              obj_props:{
                                                  id: string|null; // id file dari database (id gambar), jika bukan edit value nya 'null'
                                                  file_name:string
                                                  ; file_size:string
                                                  ; file_unit:string  // B, KB, MB, ...
                                                  ; file_type:string  // Image/Jpg, ...
                                                  ; file_url:string // endpoint file
                                              };
                                            };
                                            save:{
                                              // ** Output save berbentuk Object -> {'photo':{name:'photo_profile', size:12.89, unit:'KB'}}
                                              key_name:string;  // nama key utama
                                              obj_props:{
                                                // ** Semua nama key di bawah harus unik
                                                key_file_id:string; // nama id key dari edit
                                                key_file_cid:string; // nama cid key file baru (bukan id edit)
                                                key_file_name:string; // nama key untuk nama file upload
                                                key_file_size:string; // nama key size file upload
                                                key_file_size_unit:string;  // B, KB, MB, GB
                                                key_file_type:string; // type file (image/png, ...)
                                                key_file_status:string; // nama key status  (secara value terdiri dari 4 -> 'NEW','UPDATE','DELETE',NULL
                                              }
                                            };
                                          }


// jika terjadi perubahan data dari luar form ke dalam template, maka gunakan interface 'FormTemplateInDataChangeType'
export interface FormTemplateInDataChangeType {
  set:Array<
        |{
          type:'value_input';   // type -> 'text', 'number'
          data:{name:string; value:string|number|boolean}[]
        }
        |{
          type:'date_input';  // type -> 'date'
          data:{name:string; value:Date|null}[]
        }
        |{
          type:'multiselect_input';
          data:{name:string; value:Array<|string|number>}[]
        }

      >
}


type FormTemplate_DetailTable_CustomCell = {
  type:'tag';
  rules:{
    [value:string]: 'success'|'warning'|'danger'| {other_color:string}; // pakai element 'Tag'
  };
  align?:'left'|'center'|'right'
}|{
  type:'currency';
  align:'space-between'|{position:'left', gap?:1|2|3|4|5|6|7|8|9}|{position:'right', gap?:1|2|3|4|5|6|7|8|9};
  prefix?:'Rp'|'$';
  vertical_align?: 'sup'|'sub'; // superscript | subscript
}
|{
  type:'trend_arrow_up_down';
  suffix?:'%'|{other_suffix:string};
  rules:{
    key: string;  // key object yang jadi text up dan down
    'up': string;   // jika key 'up', value di object harus bernilai apa (misal: bawah/atas, turun/naik, up/down)
    'down': string;
  },
  style?:{
    type:'background-with-color';   // tipe yang tidak pakai arrow, tapi pakai pewarnaan background
  }
}
|{
  type:'image_with_label';
  url?:{key:string};
  label:{key:string}; // (eg. 'Bitcoin')
  suffix?:{key:string};   // code label (eg. 'BTC' dari 'Bitcoin')
}
|{
  type:'trend_line';
  rules?:{
    comparison_start_end:boolean; // perbandingan nilai start dan end (jika nilai akhir > awal maka hijau, sebaliknya merah)
  }
}
|{
  type:'actions'; // edit, custom actions, dst...
  size?:number;  // ukuran width kolom
  actions:Array<|{type:'custom_element_in_modal'; style?:{backgroundColorHover?:string}; icon:React.ReactElement}>
}


// * Type untuk struktur template detail table
type FormTemplate_DetailTable = {
  accessorKey:string; // key object data
  header:string;
  grow?:boolean; // grow column size (default true)
  align?:'left'|'center'|'right';
  custom_cell?:FormTemplate_DetailTable_CustomCell;
}

type FormTemplate_Detail = {
    name:string;  // harus unik setiap detail
    title:string;
    icon?:React.ReactElement;
    table?:{
      density?:'comfortable' | 'compact' | 'spacious';
      enableColumnResizing?:boolean; // column bisa di resize
      data_column?:FormTemplate_DetailTable[]
    }
}

export interface FormTemplateType{
  section_name:string;
  section_id:string;
  props?:{
    header?:{
      show:boolean; // default false
      title:string; // title header
      icon?:React.ReactElement; // icon di samping kiri title
    }
  };
  class_add?:string;  // tambahan class name untuk misal mengatur column ke posisi tengah
  // show_border?:boolean; // menampilkan border dan box shadow pada section (default = true)
  data_column:
        {
          to:1|2|3|4|5|6|7|8|9|10|11|12;
          breakpoint?:
              {to_sm:1|2|3|4|5|6|7|8|9|10|11|12;}
              |{to_md:1|2|3|4|5|6|7|8|9|10|11|12;}
              |{to_lg:1|2|3|4|5|6|7|8|9|10|11|12;}
              |{to_xl:1|2|3|4|5|6|7|8|9|10|11|12;};
          data_input:Array<
                |FormTemplateDataInputType
            >
        }[]
  ; detail?:FormTemplate_Detail[]
}


export interface FinalSessionType {
  button:{
    cancel?:{
      enabled?: boolean;
      show: boolean;
    };
    save?:{
      enabled?:boolean;
      show: boolean;
    }
  }
}

export interface FormTemplate_MultiSelectType {
  id:string;
  name:string;
  [key:string]:any;
}


export type PropConfigType = {type:'Form', config:FormTemplateType[]} // section versi form utama. Nanti nya ada detail table
                      |{type:'Modal', config:FormTemplateType[]}  // section versi yang modal detail (rencana nya tidak ada detail tabel lagi). Nanti config diganti yang baru versi modal tanpa detail


export type PropConfigConfirmDialog = (element:{source:'Form'|'Modal', type:'Delete File', obj_input:any}, formData:FormData) => void;
export type PropConfigConfirmDialogResponse = {confirm:boolean|null};

type UploadFormatExtensionDocument = '.csv'|'.txt'|'.doc'|'.docx'|'.xls'|'.xlsx'|'.ppt'|'.pptx';
type UploadFormatExtensionImages = '.tiff'|'.jfif'|'.bmp'|'.pjp'|'.apng'|'.jpeg'|'.png'|'.webp'|'.svgz'|'.jpg'|'.heic'|'.gif'|'.svg'|'.heif'|'.ico'|'.xbm'|'.dib'|'.tif'|'.pjpeg'|'.avif';

interface ParamLocal{
  children?:React.ReactNode;
  // props:FormTemplateType[];
  props:PropConfigType;

  style?:{show_border:boolean};

  final_session?:FinalSessionType|null;
  status:'new'|'edit';
  edit_data?:any;
  inDataChange?:FormTemplateInDataChangeType;

  // data_with_key_edit : isi 'data change dari input' yang key dan format nya sesuai dengan kondisi 'edit' dan nama key dari 'edit -> key_name'
  // ---- isi data nya harus nya sama dengan parameter 'data'
  outDataChange:(element:{data:any; data_with_key_edit?:any; posisi_name_input_when_onchange:string|null; status_proses:StatusProsesDataChangeType}, formData:FormData|null)=>void;  // formData khusus jika ada file upload terdeteksi

  inConfirmDialog?:PropConfigConfirmDialogResponse;  
  outConfirmDialog?:PropConfigConfirmDialog; // konfirmasi delete atau lainnya jika ada dialog confirmation (user yang menentukan apa mau disetujui atau tidak)

  [key:string]:any;
}

const FormTemplate:React.FC<ParamLocal> = ({children, props, style, final_session, status, edit_data, inDataChange, outDataChange, inConfirmDialog, outConfirmDialog, ...rest}) => {

  const {dataContext, setDataContext} = useContext<FormTemplateContextInterface>(FormTemplateContext);

  

  // outDataChange -> output result to other form

  // *** Ganti Thema Primereact
  const { changeTheme } = useContext(PrimeReactContext)

  useEffect(()=>{
    
    // *** Switch Theme Primereact dari cyan ke amber
  
     // Membuat elemen link dengan id "theme-link"

     let themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    if (!themeLink){
      themeLink = document.createElement("link");
      themeLink.id = "theme-link";
      themeLink.rel = "stylesheet";
      // Sample-Web -> dari BrowserRouter basename
      // href -> mengarah ke folder public
      themeLink.href = `/Sample-Web/resources/themes/lara-light-amber/theme.css`;
      document.head.appendChild(themeLink);
    }

    if (changeTheme){
      // theme lara-light-cyan,lara-light-amber, dan lainnya harus di copy dari "node_modules/primereact/resources/themes" ke folder "public/resources/themes/..."
      changeTheme('lara-light-cyan', 'lara-light-amber', 'theme-link', ()=>{
          console.log('Theme Change to Amber')
      })
    }

     return () => {
      if (changeTheme){
        // *** Jika sudah keluar dari form, maka change theme ke posisi 'cyan' lagi
        changeTheme('lara-light-amber', 'lara-light-cyan', 'theme-link', ()=>{
          console.log('Theme Change to Cyan')
        })
      }
      themeLink.remove();
    };
    
    // import("primereact/resources/themes/saga-orange/theme.css")

    // ** Import Module Thema Amber\
    // perlu declare *.css di "css.d.ts" agar typescript mengenali css
    // const loadTheme = async() => {
    //   await import("primereact/resources/themes/lara-light-amber/theme.css");
    // }

    // loadTheme();


  },[])

  
  // *** (untuk Header Template Upload) Object File Upload untuk informasi size upload dan max size (Multiple) by name
  const [ objUploadSizeLimit, setObjUploadSizeLimit ] = useState<{[name:string]:{size_in_byte?:string, size?:string, size_unit?:string, max_size?:string, max_size_unit?:string}}|null>(null);

  const [propertyConfig, setPropertyConfig] = useState<FormTemplateType[]>([]);
  const [finalSessionConfig, setFinalSessionConfig] = useState<FinalSessionType|null>(null);
  const [inputRefs, setInputRefs] = useState<any[]>([]);
  
  const sectionElementRef = useRef<{
            [key:string]:{element:HTMLElement, height?:number}
          }|null>(null);  // by section-name (generate dari sistem `ref-section-0`)

  // outConfirmDialog -> minta konfirmasi user (delete dan lainnya)
  // --- set posisi status_now saat ini (misal sedang delete file image)
  // --- source dari 'Form' atau 'Modal'
  // --- obj_input yang berisikan konfigurasi input yang terpilih
  // *** Simpan konfigurasi saat ini untuk confirmation dialog
  // *** "multiple:{props:any, file:File}" -> hapus per item (type upload 'multiple')
  const confirmUserPropsRef = useRef<{status_now:'Save', source:'Form'|'Modal'}
                                    |{status_now:'Add Item Table', source:'Modal'}  // form nya dari modal ke tabel yang di form
                                    |{status_now:'Delete File', source:'Form'|'Modal', index_input:number, obj_input:FormTemplateDataInputType, multiple?:{type:'per-item', props:any, file:File}|{type:'all'}}
                                    |null>(null); 
  // ...

  // contoh : {0: 'Nomor Faktur is required', ...}
  const [invalidInput, setInvalidInput] = useState<any>({});  // message input yang invalid (update ke view) (eg: required, dst...)

  // contoh : [{type:'duplicate_name', description: 'Check invalid config at 'name' : nomor_faktur, name_customer'}]
  const [arrErrorConfig, setArrErrorConfig] = useState<any[]>([]);  // kumpulan data configurasi yang error (contoh: duplicate name, dst...)
  const arrErrorConfigRef = useRef<any>([]);  // isi nya sama seperti 'setArrErrorConfig', hanya pengaturan secara global

  // contoh : {0: true, 1: false}
  // disabled input by index
  const [objDisabled, setObjDisabled] = useState<any>({});

  // contoh: {0: true, 1:true, ...}
  // disabled semua input dan button pada saat proses submit
  const [objDisabledForProses, setObjDisabledForProses] = useState<any>({});

  const [loading, setLoading] = useState<boolean>(true);  // loading proses generate form
  
  // Data Change (*** Date ***)
  const [objInputDate, setObjInputDate] = useState<any>({});  // kumpulan semua input data dengan type date
  
  // Data Change (*** Number ***)
  const [objInputNumber, setObjInputNumber] = useState<any>({});  // kumpulan semua input data dengan type number

  // Data Change (*** Multi Select ***)
  const temp_objSelectedMultiSelect = useRef<{[index:number]:FormTemplate_MultiSelectType[]}>({}); // temporary menampung data selected sebelum di simpan ke 'setObjSelected_MultiSelect' (kondisi inDataChange)
  const [objSelected_MultiSelect, setObjSelected_MultiSelect] = useState<{[index:number]:FormTemplate_MultiSelectType[]}>({});  // object yang diselect by index, diparsing ke 'value' MultiSelect

  // Data Change (*** Password ***)
  const [objInputPassword, setObjInputPassword] = useState<any>({}); // kumpulan semua input data dengan type password

  // Data Change (*** Teks Others (Email) ***)
  const [objInputTextOthers, setObjInputTextOthers] = useState<any>({}); // kumpulan semua input data text selain type 'text' seperti 'email', dan lain-lain

  // Data Change (*** Input Switch ***)
  const [objInputSwitch, setObjInputSwitch] = useState<{[name:string]:boolean}>({}); // kumpulan semua input data dengan type switch

  // Data Change (*** File Upload Gambar dan lain-lain ***)
  const [objFileUpload, setObjFileUpload] = useState<{[name:string]:any}>({}); // kumpulan semua input data dengan type upload file

  // *** objFileUploadDescription (khusus single file upload), berbentuk Object
  const [objFileUploadDescription, setObjFileUploadDescription] = useState<{[key:string]:{cid:string, name:string, type:string, size:string, unit:string}|null}>({}); // cid (content-id / id unik gambar yang di generate auto), name dan size file yang akan tampil di bawah button 'Browse'

  // *** objFileUploadMultipleDescription (khusus multiple file upload), berbentuk Array
  const [objFileUploadMultipleDescription, setObjFileUploadMultipleDescription] = useState<{[key:string]:{cid:string, name:string, type:string, size:string, unit:string}[]|[]}>({}); // cid (content-id / id unik gambar yang di generate auto)
  

  // Loading Status (button save dan cancel) -> {save:true, cancel:false}
  const [statusLoadingProses, setStatusLoadingProses] = useState<{save?:boolean; cancel?:boolean}>({})  // status loading pada button save dan cancel

  // *** State Show hide ConfirmDialog (e.g. hapus file upload single)
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  // **** close confirm dialog dari 'escape, click outside'
  const [statusCloseConfirmDialog, setStatusCloseConfirmDialog] = useState<boolean>(false);
  const statusCloseConfirmDialogRef = useRef<any>(true);

  const confirmDialog_ButtonReject = useRef<any>();

  // ---- References ----
  const outDataChange_StatusProses = useRef<StatusProsesDataChangeType|null>(null); // menyimpan status proses secara global saat onchange input
  const statusAwalRef = useRef<boolean>(true); // kondisi pertama kali render form template
  const configInputRef = useRef<any>({}); // berisi konfigurasi 'data_input' by 'index' (Object)
  const arrConfigInputRef = useRef<FormTemplateDataInputType[]>([]); // berisi konfigurasi 'data_input' (Array)

  // * Status apakah dalam konfigurasi ada fileupload untuk formData nantinya
  const statusConfigFileUpload = useRef<boolean>(false);

  // contoh : {0: 'Nomor Faktur is required'}
  const globalInvalidInput = useRef<any>({}); // global message input invalid (consume secara global)

  // *** Output Perubahan Data
  const refDataChange = useRef<any>({});  // data terisi yang di parsing keluar
  const formDataRef = useRef<FormData|null>(null);  // Form Data : menyimpan semua perubahan data jika terdapat input type 'file'
  const refDataEditChange = useRef<any>({});  // data berisi kondisi object edit (di buat seperti edit jika ada input change, tujuan utama nya untuk parsing data ke table)

  // Toast Message saat proses 'save' atau 'submit
  const toastProsesRef = useRef<any>(null);

  // Multi Select Variable
  // ---- kumpulan semua data array by index element pada multi select. contoh : {0: [{key:'abc', value:'abc', otherkey:...}]}  , 0 -> index
  const [objDataMultiSelect, setObjDataMultiSelect] = useState<{[index:number]:FormTemplate_MultiSelectType[]}>({});
  const objDataMultiSelectRef = useRef<{[index:number]:FormTemplate_MultiSelectType[]}>({});
  
  // contoh : {0: {type:'multi-select', name:'...', id:'..', ...rest}}
  const objDataMultiSelect_ConfigTypeAPI = useRef<{[index:number]:FormTemplateDataInputType}>({});  // khusus menampung data config multi select yang data source nya type 'api' by index

  // *** Kumpulan Detail Table By Name ***
  const [arrConfigDetail, setArrConfigDetail] = useState<{[name:string]:FormTemplate_DetailTable[]}>({});
  const arrConfigDetailRef = useRef<{[name:string]:FormTemplate_Detail}>({});

  const [statusWindowMobile, setStatusWindowMobile] = useState<boolean>(false);

  // *** Modal ***
  // ---- {'uuid': {show:true}}
  const [ modalProps, setModalProps ] = useState<{[uuid:string]:{show:boolean}}>({});

  useEffect(()=>{
    const windowFunc = () => {
      if (window.innerWidth < 768){
        setStatusWindowMobile(true);
      }
      else {
        setStatusWindowMobile(false);
      }
    }

    windowFunc();

    window.addEventListener('resize', windowFunc);

    return () => {
      window.removeEventListener('resize', windowFunc);
    }
  },[])

  const randomNumberArray = (repeat:number) => {
    // * only for testing
    let numbers:number[] = [];
    for(let i=0;i < repeat; i++){
      numbers.push(Math.floor(Math.random() * 1000));
    }
    return numbers;
  }

  // **** Data Detail Table by Name Detail
  const [rowListTable, setRowListTable] = useState<{[name:string]:any[]}>({
    'name_detail_transaksi':[
      {kode_produk:'shell', image_product:'https://wallpapers.com/images/hd/shell-logo-red-yellow-ylhb2f0hphp6ey09-ylhb2f0hphp6ey09.png', nama_produk:'Shell', code:'SHL', '1h':0.12, '1h_trend':'naik',  harga:125000, data_trend:randomNumberArray(30), status:'Failed'}
      ,{kode_produk:'pepsi', image_product:'https://awsimages.detik.net.id/community/media/visual/2019/11/22/5046d875-0493-4a5e-9057-0d402c1d841e.jpeg?w=600&q=90', nama_produk:'Pepsi', code:'PSI', '1h':'5.00', '1h_trend':'turun', data_trend:randomNumberArray(50), harga:500500.19, status:'Completed'}
      ,{kode_produk:'dior', image_product:'https(broken tes)://i.pinimg.com/736x/e0/08/c7/e008c74ffb23fdfcdf3ffdf39ba44b9b.jpg', nama_produk:'Dior', code:'DIR', '1h':10.58, '1h_trend':'turun', harga:75000, data_trend:randomNumberArray(50), status:'Process'}
      ,{kode_produk:'coca-cola', image_product:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4bYOCRGoYXnHFtxxvhouF4dffr6IbIFkyzg&s', nama_produk:'Coca Cola', code:'CCL',  '1h':97.23, '1h_trend':'naik', harga:15750, data_trend:randomNumberArray(50), status:'Other'}
    ]
  });



  const resetStateRef = () => {

    // * Clear item ter-select pada file upload
    if (arrConfigInputRef.current.length > 0){
      const arrUploadFile_ConfigInputRef = arrConfigInputRef.current.filter((item)=>item.type === 'fileupload-image-single');
      if (arrUploadFile_ConfigInputRef.length > 0){
        statusConfigFileUpload.current = true;

        for (let temp_file of arrUploadFile_ConfigInputRef) {
          if (inputRefs[temp_file?.['index']]?.current){
            inputRefs[temp_file?.['index']].current.clear();
          }
        }
      }

    }

    arrErrorConfigRef.current = []; // error config global
    configInputRef.current = {};
    arrConfigInputRef.current = [];
    globalInvalidInput.current = {};
    refDataChange.current = {};
    objDataMultiSelectRef.current = {};
    confirmUserPropsRef.current = null; // konfirmasi delete atau lainnya dari user
  
    setInvalidInput({});
    setArrErrorConfig([]);
    setLoading(true);
    setObjDataMultiSelect({});
  }

  // useEffect(()=>{
      // if (import.meta.hot){
      //     import.meta.hot.accept(()=>{
      //       alert('masuk')
      //     })
      // }
  // },[])

  useEffect(()=>{

    // ** Tes Logic Conditional dalam bentuk String
    // let a = 1;
    // let b = 1;

    // let tes = eval(`(${a}===1) && (${b}===1)`);
    // if (tes){
    //   alert(tes);
    // }
    getDataApi();
  },[])

  useEffect(()=>{
    // *** Resize Window, update clientHeight semua section
    const handleResize = (e) => {
      if (window.innerWidth) {
        if (sectionElementRef.current !== null && Object.keys(sectionElementRef.current).length > 0){

          for (let [key, value] of Object.entries(sectionElementRef.current)){
              const element = value?.element;
              if (typeof element !== 'undefined' && element !== null){
                const firstChild = element.firstChild as HTMLElement;
                
                // jika posisi nya terbuka, maka adjust tinggi clientHeight nya
                if (element.clientHeight !== 0) {
                  element.style.height = firstChild.clientHeight + 'px';
                }

              }
          }

        }
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  },[])


  useEffect(()=>{
    // *** Confirmation Dialog (Response from user)
    // *** Response jawaban dari user (Yes / No) terhadap dialog (delete, dst...) yang sedang waiting
    // confirmUserPropsRef.current  

    if (confirmUserPropsRef.current?.source === 'Form') {
      if (confirmUserPropsRef.current?.status_now === 'Delete File'){
          if (inConfirmDialog?.confirm === true) {
    
            // console.log(confirmUserPropsRef.current)s
            const input_type = confirmUserPropsRef.current?.obj_input?.type;
            
            if (input_type === 'fileupload-image-single'){
              
              const input_type_upload = confirmUserPropsRef.current?.obj_input?.type_upload;
    
              if (input_type_upload === 'single'){

                const index_input = confirmUserPropsRef.current?.index_input;
                const obj_input = confirmUserPropsRef.current?.obj_input;

                deleteUploadSingleFileHandler(confirmUserPropsRef.current?.index_input, confirmUserPropsRef.current?.obj_input);

                setStatusCloseConfirmDialog(true); // kunci tidak bisa close kecuali klik Reject No
                statusCloseConfirmDialogRef.current = true;
    
                openConfirm(index_input, obj_input, `File berhasil dihapus !`, null , true)

                toastProsesRef?.current.show({severity:'success', summary: 'Success'
                        , detail:`File berhasil dihapus !`, life:2000});
              }
              else if (input_type_upload === 'multiple'){
    
                const type = confirmUserPropsRef.current.multiple?.type;
                if (type === 'per-item')
                {
                    const file = confirmUserPropsRef.current.multiple?.file as File;
                    const props = confirmUserPropsRef.current.multiple?.props;
                    const multiple_type = confirmUserPropsRef.current.multiple?.type;
                    const index_input = confirmUserPropsRef.current?.index_input;
                    const obj_input = confirmUserPropsRef.current?.obj_input;
      
                    // * Hapus file item dari daftar terkait pada type multiple
                    props.onRemove(file);
  
                    deleteUploadMultipleFileHandler(file, props, confirmUserPropsRef.current?.obj_input)
      
                    const message_alert = `File ${file?.name || ''} berhasil dihapus !`;

                    setStatusCloseConfirmDialog(true); // kunci tidak bisa close kecuali klik Reject No
                    statusCloseConfirmDialogRef.current = true;

                    openConfirm(index_input, obj_input, `File <b>"${file?.name || ''}"</b> berhasil dihapus !`, {type:'per-item', file: file, props:props}, true)

                    toastProsesRef?.current.show({severity:'success', summary: 'Success'
                      , detail:`${message_alert}`, life:2000});

                    // setTimeout(()=>{
                    //   // *** Tutup Dialog Modal
                    //   setShowConfirmDialog(false);
                    // },3000)
                  }
                  else if (type === 'all')
                  {

                    // ------- logic CLEAR ALL
                    const index_input = confirmUserPropsRef.current?.index_input;
                    const obj_input = confirmUserPropsRef.current?.obj_input;

                    deleteUploadMultipleAllFileHandler(confirmUserPropsRef.current?.obj_input);

                    setStatusCloseConfirmDialog(true);  // izinkan close dahulu, baru bisa openConfirm
                    statusCloseConfirmDialogRef.current = true;

                    openConfirm(index_input, obj_input, `Semua File berhasil dihapus !`, {type:'all'}, true)

                    toastProsesRef?.current.show({severity:'success', summary: 'Success'
                      , detail:`Semua File berhasil dihapus !`, life:2000});
                    
                      // setTimeout(()=>{
                      //   // *** Tutup Dialog Modal
                      //   setShowConfirmDialog(false);
                      // },2000)
                  }
    
              }
    
            }
          }
          else if (inConfirmDialog?.confirm === false){
    
            // * Kondisi data tidak dapat dihapus (confirm false)
            
            toastProsesRef?.current.show({severity:'error', summary: 'Error'
              , detail:`File gagal dihapus !`, life:2000});
    
    
            setTimeout(()=>{
              setStatusCloseConfirmDialog(true);
              statusCloseConfirmDialogRef.current = true;
    
              if (confirmUserPropsRef.current?.status_now == 'Delete File')
              {
                if (confirmUserPropsRef.current?.index_input){
                  openConfirm(confirmUserPropsRef.current.index_input, confirmUserPropsRef.current.obj_input);
                }
              }
            },700)
            
          }
      }
    }
    
    
  },[inConfirmDialog])


  // *** Function Generate All Index Input, Update to Object
  const generateIndexAllInput = async(template:FormTemplateType[]) => {
    
    // *** Update Index All Input
    let idx_all_input = 0;

    // console.log(JSON.stringify(template))

    let temp_config:FormTemplateType[] = [...template];
    
    if (temp_config.length > 0) {
      
      // * Variabel penampung 'name' pada detail, e.g : [{'name': 'detail-transaksi'}, ...]
      let arr_temp_name_in_detail:{[name:string]:string}[] = [];

      temp_config.forEach((temp_section, idx_section)=>{
        
          if (temp_section?.['data_column'] && temp_section?.['data_column'].length > 0) {
    
              temp_section['data_column'].forEach((temp_column, idx_column)=>{
    
                  if (temp_column?.['data_input'] && temp_column?.['data_input'].length > 0) {
    
                      temp_column['data_input'].forEach((temp_input, idx_input)=>{
  
                          temp_input['index'] = idx_all_input++;
                          temp_input['uuid'] = uuidv7();
  
                          // isi konfigurasi semua data_input ke dalam 'configInputRef'
                          configInputRef.current = {
                              ...configInputRef.current,
                              [temp_input['index']]: {...temp_input}
                          }
  
                          arrConfigInputRef.current = [
                              ...arrConfigInputRef.current,
                              {...temp_input}
                          ]

                          if (temp_input?.['type'] === 'multi-select') {

                            // jika type nya 'hardcode', maka set data array langsung ke ref
                            // tapi jika 'api', maka set kosong terlebih dahulu, baru nanti akan hit api
                            if (temp_input?.['data_source']?.type === 'hardcode')
                            {
                              
                                objDataMultiSelectRef.current = {
                                  ...objDataMultiSelectRef.current,
                                  [temp_input['index']]: [...temp_input?.['data_source']?.['data']]
                                }
                            }
                            else if (temp_input?.['data_source']?.type === 'api') {

                                // simpan konfigurasi nya 'objDataMultiSelect_ConfigTypeAPI'
                                objDataMultiSelect_ConfigTypeAPI.current = {
                                  ...objDataMultiSelect_ConfigTypeAPI.current,
                                  [temp_input['index']]: {...temp_input}
                                }

                                // --- nanti di update lanjutan (isi data dari api)
                                // objDataMultiSelectRef.current = {
                                //   ...objDataMultiSelectRef.current,
                                //   [temp_input['index']]: []
                                // }

                            }

                          }
  
                      })
    
                  }
              })
          }

          // * Detail Table
          if (typeof temp_section?.detail !== 'undefined' && Array.isArray(temp_section?.detail))
          {


              let modalprops_temp = {}; // temporary dari setModalProps, (eg: {'uuid':{show:true}})

              let section_detail = [...temp_section?.detail];
              if (section_detail.length > 0){

                  temp_section?.detail.forEach((temp_detail:FormTemplate_Detail, idx_detail)=>{

                      const uuid_gen = uuidv7();
                      // * id unik setiap detail
                      temp_detail['uuid'] = uuid_gen;

                      // simpan property modal detail by uuid
                      if (typeof modalprops_temp?.['uuid'] === 'undefined'){
                        modalprops_temp = {
                            ...modalprops_temp,
                            [uuid_gen]: {show: false}
                        }
                      }
    
                      // simpan 'name' ke variabel untuk di cek duplikasi nya
                      if (temp_detail?.name){
                        arr_temp_name_in_detail = [
                          ...arr_temp_name_in_detail, 
                          {'name': temp_detail?.name}
                        ]
                      }

                      arrConfigDetailRef.current = {
                            ...arrConfigDetailRef.current,
                            [temp_detail?.['name']]: {...temp_detail}
                      }
                  });

                  setModalProps({...modalprops_temp});
                  // alert(JSON.stringify(modalprops_temp,null,2))

              }

          }
      })

      console.error('---------------- TEMP CONFIG -------------')
      console.error(temp_config)


      // * Check apakah duplikasi data 'name' pada detail,
      // ** Jika ada, nanti akan dieksekusi dalam function 'funcCheckInvalidConf'
      
      // let key_section_detail_name = section_detail;

      if (arr_temp_name_in_detail.length > 0){

        let check_duplicate = funcGetDuplicateData(arr_temp_name_in_detail, 'name');
  
        if (Array.isArray(check_duplicate) && check_duplicate.length > 0){
  
            let msg_inv_name = `Check duplicate config for 'detail.name' such as : "` + check_duplicate.join(', ') + `"`;
  
            arrErrorConfigRef.current = [
              ...arrErrorConfigRef.current,
              {type:`duplicate_name`, description: msg_inv_name}
            ]
        }
      }


      if (arrConfigInputRef.current.length > 0) {
        // simpan input yang terdisabled ke state 'setObjDisabled'
        let temp_disabled = Object.fromEntries(arrConfigInputRef.current.map((obj, idx)=>{
                                return [
                                  obj?.['index'], (obj?.['disabled'] ?? false)
                                ]
                            }))
                            || {};

        setObjDisabled({...temp_disabled})
      }


      
      // set data ke multi select

      // fetching data api multi-select 
      // alert(JSON.stringify(objDataMultiSelect_ConfigTypeAPI.current))
      // ** hanya kondisi di awal mem-fetching api yang tidak ada param dan bukan ('from_multi_select' pada conditional_array),
      // *** karena yang ada param, mesti ambil sumber data dari input-an yang lain dulu.
      await fetchingApi_MultiSelect(objDataMultiSelect_ConfigTypeAPI.current);

      if (Object.keys(objDataMultiSelectRef.current).length > 0){
        setObjDataMultiSelect({...objDataMultiSelectRef.current})
      }

      setInputRefs(prevInputRefs=>{
          const newRefs:any = Array.from({length: idx_all_input},(_,idx)=>prevInputRefs[idx] || React.createRef());
          return newRefs;
      });

      // generate Array untuk object disabled saat proses submit
      if (idx_all_input > 0){
        let arrDisabledInputWhenProcess = Object.fromEntries(Array.from({length: idx_all_input},(_,idx)=>[idx, false]));
        setObjDisabledForProses({...arrDisabledInputWhenProcess});
      }


      // console.log(JSON.stringify(temp_config))

      console.log('configInputRef');
      console.log(configInputRef);

      console.log('arrConfigInputRef');
      console.log(arrConfigInputRef);

      return [...temp_config];
    }
    else {
      return [];
    }
  }

  useEffect(()=>{

    resetStateRef();

    // *** Serialize file upload yang ada max_size_in_byte jadi {size:..., max_size:...}
    const generateObjSizeUpload = () => {

      if (arrConfigInputRef.current.length > 0) {

        arrConfigInputRef.current.forEach((obj_input, idx) =>{
  
          if (obj_input?.['type'] === 'fileupload-image-single') {
          
            // * Tampilan Size pada Header
            const max_size_in_byte = obj_input?.['max_size_in_byte'];
      
            if (typeof max_size_in_byte !== 'undefined' && max_size_in_byte !== null){

              let join_final = convertSizeToUnit(max_size_in_byte, 0);
      
              setObjUploadSizeLimit((prev:any)=>{
                if (prev !== null){
                  return {
                    ...prev,
                    [obj_input?.['name']]: {
                          size_in_byte:0,
                          size: 0,
                          size_unit: 'B',
                          max_size: join_final?.size ?? '',
                          max_size_unit: join_final?.unit ?? ''
                    }
                  }
                } 
                else {
                  return {
                    [obj_input?.['name']]: {
                          size_in_byte:0,
                          size: 0,
                          size_unit: 'B',
                          max_size: join_final?.size ?? '',
                          max_size_unit: join_final?.unit ?? ''
                    }
                  }
                }
              }); // 1 MB, dst...
            }

          }
          
        })

      }
    }
    
    const firstMethod = async() => {

      // if (Array.isArray(props) && props.length > 0) {

        if (props.type === 'Form' || props.type === 'Modal')
        {
          if (props?.config) {

            // Generate Index ke Semua Data Input
            // let tempGenIndexAllInput:any[] = await generateIndexAllInput(props);
            let tempGenIndexAllInput:any[] = await generateIndexAllInput(props.config);
            setPropertyConfig(tempGenIndexAllInput);
            // ... End

            // serialize split ukuran file ter-upload dan max size
            generateObjSizeUpload();
    
            // *** Periksa Configuration yang invalid
            funcCheckInvalidConf(arrConfigInputRef.current);

            const arrUploadFile_ConfigInputRef = arrConfigInputRef.current.filter((item)=>item.type === 'fileupload-image-single');
            if (arrUploadFile_ConfigInputRef.length > 0){
              statusConfigFileUpload.current = true;
            }

          }
        }

      // }
    }

    firstMethod();

  },[props, status])


  const columnDetailTable = useMemo(()=>{

      // * Table hanya khusus Form
      if (typeof props?.type !== 'undefined' && props?.type === 'Form'){

        let props_config = props?.config;
        if (Array.isArray(props_config)){

            let var_temp_table_column:{[name:string]:MRT_ColumnDef<any>[]} = {};
            
            props_config.forEach((obj_section, idx_section)=>{
              let section_detail = obj_section?.detail;
              if (typeof section_detail !== 'undefined' && Array.isArray(section_detail)){
                  if (section_detail.length > 0){
                    
                    section_detail.forEach((obj_detail, idx_detail)=>{

                        const detail_name:string = obj_detail?.name;
                        const detail_table_data_column:any[] = obj_detail?.table?.data_column || []; 
                        
                        if (detail_table_data_column.length > 0){

                          detail_table_data_column.forEach((obj_column:FormTemplate_DetailTable, idx_column)=>{
                            
                              let obj_column_def_for_mui_table:MRT_ColumnDef<any>;

                              const accessor_key = obj_column?.accessorKey;
                              const header = obj_column?.header || '';
                              const grow = obj_column?.grow ?? true;

                              obj_column_def_for_mui_table = {
                                    accessorKey: accessor_key,
                                    header: header,
                                    grow: grow,
                              }
                              
                              const custom_cell = obj_column?.custom_cell;
                              if (typeof custom_cell !== 'undefined'){

                                let cell_column: ({cell, column, row, table}:any) => JSX.Element;
                                let mui_table_bodycell_props: ({cell, column, row, table}:any) => {sx:{}};

                                if (custom_cell?.type === 'actions'){

                                    const arr_custom_cell_actions = custom_cell?.actions;
                                    const custom_cell_size = custom_cell?.size;
                                      
                                    cell_column = ({cell, column}) => {
                                      if (typeof arr_custom_cell_actions !== 'undefined')
                                      {
                                          return (
                                            <div className='d-flex gap-2'>
                                              {
                                                arr_custom_cell_actions.map((item, index)=>{
                                                  if (item?.type === 'custom_element_in_modal')
                                                  {
                                                    const uuid_style = uuidv7();
                                                    return (
                                                      <>
                                                        <style>
                                                        {
                                                          `
                                                            .fit-act-cust-ele-${uuid_style} { 
                                                                  display: flex;+
                                                                  align-items: center;
                                                                  justify-content: center;
                                                                  cursor:pointer;
                                                                  border-radius:50%;

                                                                  &:hover {
                                                                    background-color:${item?.style?.backgroundColorHover ?? 'transparent'};
                                                                    padding:5px;
                                                                  }
                                                            }
                                                          `
                                                        }
                                                        </style>

                                                        <span className={`fit-act-cust-ele-${uuid_style}`}>{item?.icon}</span>
                                                      </>
                                                    )
                                                  }
                                                })
                                              }

                                            </div>
                                          )
                                      }
                                      else 
                                      {
                                          return <></>
                                      }
                                    }

                                    mui_table_bodycell_props = ({cell, row, column}) => {
                                      return {
                                        sx:{
                                            '&.MuiTableCell-root.MuiTableCell-body':{
                                                display:'flex',
                                                justifyContent:'center'
                                          }
                                        }
                                      }
                                    }

                                    if (typeof custom_cell_size !== 'undefined')
                                    {
                                      obj_column_def_for_mui_table = {
                                          ...obj_column_def_for_mui_table,
                                          size: custom_cell_size
                                      }
                                    }

                                    obj_column_def_for_mui_table = {
                                        ...obj_column_def_for_mui_table,
                                        Cell: cell_column,
                                        enableSorting:false,
                                        
                                        muiTableHeadCellProps:({column, table})=>{
                                          return {
                                            sx:{
                                              '&.MuiTableCell-root.MuiTableCell-head .Mui-TableHeadCell-Content':{
                                                  display:'flex',
                                                  justifyContent:'center'
                                              }
                                            }
                                          }
                                        },
                                        muiTableBodyCellProps: mui_table_bodycell_props
                                    }

                                }
                                else if (custom_cell?.type === 'tag'){

                                    const custom_cell_rules = custom_cell?.rules;
                                    
                                    cell_column = ({cell, column}) => {
                                        
                                      // * periksa apakah rules ada di dalam object 'custom_cell_rules'
                                        const value_rules = custom_cell_rules?.[cell.getValue()];  // warning, success, danger, ...

                                        if (typeof value_rules === 'string'){

                                            return (
                                              <Tag value={cell.getValue()} severity={value_rules} rounded
                                                style={{
                                                  margin: custom_cell?.align === 'center' ? '0 auto' :
                                                          custom_cell?.align === 'left' ? '0 auto 0 0' :
                                                          custom_cell?.align === 'right' ? '0 0 0 auto' : ''
                                                }}
                                              ></Tag>
                                            )
                                          }
                                        else if (typeof value_rules === 'object'){
                                            const other_color = value_rules?.other_color;

                                            return (
                                              <Tag value={cell.getValue()} style={{
                                                      backgroundColor:`${other_color}`,
                                                      margin: custom_cell?.align === 'center' ? '0 auto' :
                                                              custom_cell?.align === 'left' ? '0 auto 0 0' :
                                                              custom_cell?.align === 'right' ? '0 0 0 auto' : ''
                                                  }} 
                                                  rounded
                                              ></Tag>
                                            )
                                        }
                                        else {
                                          return (
                                            <></>
                                          )
                                        }
                                        // <h1>{cell.getValue()}</h1>
                                        // <h1>{cell.row.original?.[column.columnDef.header.toLowerCase()]}</h1>
                                      
                                    }

                                    obj_column_def_for_mui_table = {
                                        ...obj_column_def_for_mui_table,
                                        Cell: cell_column
                                    }
                                }
                                else if (custom_cell?.type === 'image_with_label'){

                                  let cell_column: ({cell, column, row, table}:any) => JSX.Element;                                  

                                  cell_column = ({cell, row, column}) => {

                                      // const get_value = cell.getValue();

                                      const obj_value = cell?.row?.original;  // naik, turun, ...

                                      const url = custom_cell?.url?.key || null;
                                      const label = custom_cell?.label?.key || null;
                                      const suffix = custom_cell?.suffix?.key || null;
                                      
                                      const url_final = url !== null ? obj_value?.[url] : null;
                                      const label_final = label !== null ? obj_value?.[label] : null;
                                      const suffix_final = suffix !== null ? obj_value?.[suffix] : null;

                                      return (
                                        <div className='d-flex align-items-center gap-2'>
                                            {
                                              url_final !== null && (
                                                <div>
                                                    <img onError={(e:any)=>{
                                                      // jika error, maka pakai image yang 'image broken'
                                                      e.target.onerror = null;
                                                      e.target.src = "https://cdn-icons-png.flaticon.com/128/10300/10300986.png";
                                                      e.target.style.borderRadius = "0";
                                                    }} src={url_final.toString()} width={30} height={30} style={{borderRadius:'50%'}} />
                                                </div>
                                              )
                                            }

                                            <div>
                                              <span style={{fontWeight:'bold'}}>{label_final.toString()}</span>
                                            </div>

                                            {
                                              suffix_final !== null && (
                                                <div>
                                                    <span style={{fontWeight:800,fontSize:'15px',color:'darkgrey'}}>{suffix_final.toString()}</span>
                                                </div>
                                              )
                                            }

                                        </div>
                                      )
                                  };

                                  obj_column_def_for_mui_table = {
                                      ...obj_column_def_for_mui_table,
                                      Cell: cell_column
                                  }
                                }
                                else if (custom_cell?.type === 'trend_line'){
                                  
                                    cell_column = ({cell, row, column}) => {

                                      const get_value = cell.getValue();
                                      const rules_obj = custom_cell?.rules; // object : {'up': 'naik', 'down':'turun'}

                                      const comparison_start_end = custom_cell?.rules?.comparison_start_end;  // object key yang berisi text up dan down


                                      let up_down:string = '';

                                      if (typeof comparison_start_end !== 'undefined' && comparison_start_end === true)
                                      {
                                          if (Array.isArray(get_value)) 
                                          {
                                            if (get_value.length > 0){
                                              up_down = get_value[0] > get_value[get_value.length - 1] ? 'down':
                                                        get_value[0] < get_value[get_value.length - 1] ? 'up' :
                                                        get_value[0] === get_value[get_value.length - 1] ? 'draw' : '';
                                            }
                                          }
                                      }

                                      return (
                                              <Trend 
                                                data={Array.isArray(get_value) ? get_value : []} 
                                                strokeWidth={4}
                                                strokeLinecap={'butt'}

                                                height={40} 
                                  
                                                radius={0}
                                                smooth
                                  
                                                // gradient={['#0ff','#0F0', '#FF0']}
                                                gradient={typeof comparison_start_end !== 'undefined' ? 
                                                              up_down === 'down' ? ['orange','red', '#FF0'] :
                                                                  up_down === 'up' ? ['#0ff','#0F0', '#0F0'] : ['#000']
                                                              : ['#000']
                                                        }
                                  
                                                autoDraw
                                                autoDrawDuration={500}
                                                autoDrawEasing='ease-in'
                                                />
                                      )
                                    }

                                    obj_column_def_for_mui_table = {
                                      ...obj_column_def_for_mui_table,
                                      Cell: cell_column
                                    }

                                }
                                else if (custom_cell?.type === 'trend_arrow_up_down'){
                                  
                                    const style_type = custom_cell?.style?.type;

                                    let mui_table_bodycell_props: ({cell, column, row, table}:any) => {sx:{}};

                                    let muiTableBodyCellProps_temp:any;

                                    mui_table_bodycell_props = ({cell, row, column}) => {

                                          const get_value = cell.getValue();
                                          const rules_obj = custom_cell?.rules; // object : {'up': 'naik', 'down':'turun'}

                                          const rules_key = custom_cell?.rules?.key;  // key object yang berisi text up dan down
                                          const value_text_rules = cell?.row?.original?.[rules_key];  // naik, turun, ...

                                          if (value_text_rules === rules_obj['up']) {
                                            return {
                                              sx:{
                                                  '&.MuiTableCell-root.MuiTableCell-body':{
                                                    backgroundColor:'limegreen !important',
                                                    color:'white'
                                                }
                                              }
                                            }
                                          }
                                          else if (value_text_rules === rules_obj['down']) {
                                            return {
                                              sx:{
                                                  '&.MuiTableCell-root.MuiTableCell-body':{
                                                    backgroundColor:'orangered !important',
                                                    color:'white'
                                                }
                                              }
                                            }
                                          }
                                          else {
                                            return {sx:{}}
                                          }
                                    }

                                    cell_column = ({cell, row, column}) => {

                                        const get_value = cell.getValue();
                                        const rules_obj = custom_cell?.rules; // object : {'up': 'naik', 'down':'turun'}

                                        const rules_key = custom_cell?.rules?.key;  // object key yang berisi text up dan down
                                        const value_text_rules = cell?.row?.original?.[rules_key];  // naik, turun, ...

                                        return (
                                          <div className='d-flex align-items-center justify-content-end w-100'>

                                            {/* Icon */}
                                            {
                                              typeof style_type === 'undefined' && (
                                                  
                                                    typeof get_value !== 'undefined' &&
                                                    get_value !== null && 
                                                    get_value !== '' && (
    
                                                      <span className={`
                                                                  ${rules_obj?.['up'] === value_text_rules ? 'pi pi-arrow-up':
                                                                    rules_obj?.['down'] === value_text_rules ? 'pi pi-arrow-down': ''}
                                                              `}
                                                        style={{
                                                          marginRight:'5px',
                                                          fontSize:'small',
                                                          fontWeight:'bold',
                                                          color: rules_obj?.['up'] === value_text_rules ? 'limegreen':
                                                                  rules_obj?.['down'] === value_text_rules ? 'orangered': ''
                                                        }}
                                                      ></span>
    
                                                    )
                                              )
                                            }

                                            {/* Value */}
                                              <span 
                                                style={{
                                                  fontWeight:'bold',
                                                  color: typeof style_type !== 'undefined' && style_type === 'background-with-color' ? 'white' : 
                                                              rules_obj?.['up'] === value_text_rules ? 'limegreen':
                                                              rules_obj?.['down'] === value_text_rules ? 'orangered': ''
                                                }}
                                              >{get_value}</span>
                                              
                                              {/* Suffix */}
                                              {
                                                typeof get_value !== 'undefined' &&
                                                get_value !== null && 
                                                get_value !== '' && (
                                                  <>
                                                      {
                                                        typeof custom_cell?.suffix === 'string' && 
                                                        (
                                                          <span
                                                              style={{
                                                                fontWeight:'bold',
                                                                color: typeof style_type !== 'undefined' && style_type === 'background-with-color' ? 'white' :
                                                                        rules_obj?.['up'] === value_text_rules ? 'limegreen':
                                                                        rules_obj?.['down'] === value_text_rules ? 'orangered': ''
                                                              }}
                                                          >{custom_cell?.suffix}</span>
                                                        )
                                                      }

                                                      {
                                                        typeof custom_cell?.suffix === 'object' && 
                                                        (
                                                          <span
                                                              style={{
                                                                fontWeight:'bold',
                                                                color: typeof style_type !== 'undefined' && style_type === 'background-with-color' ? 'white' :
                                                                              rules_obj?.['up'] === value_text_rules ? 'limegreen':
                                                                              rules_obj?.['down'] === value_text_rules ? 'orangered': ''
                                                              }}
                                                          >{custom_cell?.suffix?.other_suffix || ''}</span>
                                                        )
                                                      }

                                                  </>

                                                )
                                              }

                                          </div>
                                        )
                                    }

                                    if (typeof style_type !== 'undefined' && style_type === 'background-with-color') 
                                    {
                                      obj_column_def_for_mui_table = {
                                          ...obj_column_def_for_mui_table,
                                          muiTableBodyCellProps: mui_table_bodycell_props
                                      }
                                    }

                                    obj_column_def_for_mui_table = {
                                        ...obj_column_def_for_mui_table,
                                        Cell: cell_column,
                                        // styling background jika true;
                                          // sx:{
                                          //     '&.MuiTableCell-root.MuiTableCell-body':{
                                          //       backgroundColor:'limegreen !important',
                                          //       color:'white'
                                          //   }
                                          // }
                                        
                                    }


                                }
                                else if (custom_cell?.type === 'currency'){
                                    cell_column = ({cell, column}) => {
                                        
                                        const get_value = cell.getValue();

                                        let first_text, last_text = '';

                                        if (!isNaN(get_value)){
                                            first_text = custom_cell?.prefix || '';
                                            last_text = Number(get_value).toLocaleString('id-ID', {style:'decimal'});
                                        }

                                        return (
                                          <div className={`w-100 ${custom_cell?.align === 'space-between' ? 'd-flex justify-content-between':
                                                    custom_cell?.align?.position === 'left' ? 'd-flex justify-content-start' :
                                                    custom_cell?.align?.position === 'right' ? 'd-flex justify-content-end':''
                                                  }`}
                                              style={{
                                                  gap: (
                                                          custom_cell?.type === 'currency' && 
                                                          custom_cell?.align !== 'space-between') 
                                                        && 
                                                          (custom_cell?.align?.position === 'left' ||
                                                          custom_cell?.align?.position === 'right'
                                                          )
                                                        ? 
                                                        typeof custom_cell?.align?.gap !== 'undefined' ? 
                                                                custom_cell?.align?.gap.toString() + 'px' : ''
                                                        : ''
                                                }}
                                          >

                                            {
                                              first_text !== '' && (
                                                  <>
                                                      {
                                                        typeof custom_cell?.vertical_align === 'undefined' && (
                                                          <span>{first_text}</span>
                                                        )
                                                      }

                                                      {
                                                        typeof custom_cell?.vertical_align !== 'undefined' && 
                                                          custom_cell?.vertical_align === 'sub' &&
                                                        (
                                                          <sub>{first_text}</sub>
                                                        )
                                                      }

                                                      {
                                                        typeof custom_cell?.vertical_align !== 'undefined' && 
                                                          custom_cell?.vertical_align === 'sup' &&
                                                        (
                                                          <sup>{first_text}</sup>
                                                        )
                                                      }

                                                  </>

                                              )
                                            }

                                              <span>{last_text}</span>
                                          </div>
                                        )
                                    }

                                    obj_column_def_for_mui_table = {
                                        ...obj_column_def_for_mui_table,
                                        Cell: cell_column
                                    }
                                }
                                
                              }

                                if (typeof obj_column?.align !== 'undefined'){
                                          
                                  let align_css = '';
                                  switch(obj_column?.align){
                                    case 'left': align_css = 'start';break;
                                    case 'right': align_css = 'end';break;
                                    case 'center': align_css = 'center';break;
                                  }

                                  obj_column_def_for_mui_table = {
                                      ...obj_column_def_for_mui_table,

                                      muiTableHeadCellProps: {
                                        sx:{
                                          '& .Mui-TableHeadCell-Content.MuiBox-root' :{
                                            display:'flex',
                                            justifyContent: align_css,
                                            alignItems:'center'
                                          }
                                        }
                                      }
                                      
                                  }
                              }

                              if (typeof var_temp_table_column?.[detail_name] === 'undefined'){
                                var_temp_table_column = {
                                  ...var_temp_table_column,
                                  [detail_name]: [
                                      {...obj_column_def_for_mui_table}
                                  ]
                                }
                              }
                              else {
                                var_temp_table_column = {
                                  ...var_temp_table_column,
                                  [detail_name]: [
                                      ...var_temp_table_column[detail_name],
                                      {...obj_column_def_for_mui_table}
                                  ]
                                }
                              }
                          })
                        }
                    })

                }
              }
            })

            return var_temp_table_column;
            // alert(JSON.stringify(var_temp_table_column,null,2))
        }
      }
      
      return null;
    }
  ,[props])

  useEffect(()=>{

    if (typeof final_session === 'undefined' || final_session === null) {
      setFinalSessionConfig(null)
    }
    else {
      setFinalSessionConfig({...final_session})
      // console.log(final_session)
    }

  },[final_session])

  const convertDocumentExtTypeShort = (file_type:string) => {

    let result:UploadFormatExtensionDocument|null = null;

    switch (file_type){
      case 'application/msword': result = '.doc'; break;
      case 'application/vnd.ms-excel': result = '.xls'; break;
      case 'application/vnd.ms-powerpoint': result = '.ppt'; break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': result = '.docx'; break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': result = '.xlsx'; break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': result = '.pptx'; break;
      case 'text/csv': result = '.csv'; break;
      case 'text/plain': result = '.txt'; break;
      default: result = null;
    }

    return result;

  }

  useEffect(()=>{

      const generatePropsDOMApiElement = () => {
        
        if (arrConfigInputRef.current.length > 0) {

          arrConfigInputRef.current.forEach((obj_input, idx) =>{

            if (obj_input?.type === 'fileupload-image-single') {

              if (obj_input?.type_upload === 'multiple'){
      
                // * Update Style Max Height pada upload Multiple
                const multiple_props_maxheight = obj_input?.multiple_props?.max_height;
                if (typeof multiple_props_maxheight !== 'undefined' && multiple_props_maxheight !== null){
                  if (typeof multiple_props_maxheight === 'number'){
      
                    const upload_content =  document.querySelector(`.fit-multiple-upload-container.fit-input-idx-${obj_input?.['index']}.fit-${obj_input?.['uuid']} .p-fileupload-content`) as HTMLElement;
                    // const upload_content:any = inputRefs?.[obj_input?.['index']];  // tidak jalan karena bentuknya object bukan element
      
                    if (typeof upload_content !== 'undefined' && upload_content !== null){
                      
                      if (upload_content instanceof HTMLElement){
                    
                        upload_content.style.overflow = 'auto';
                        upload_content.style.maxHeight = multiple_props_maxheight.toString() + 'px';
                      }

                    }
                  }
                }
      
              }
            }

          })
        }
      }

      // *** Parsing Value jika status Edit
      if (inputRefs.length > 0) 
      {

        generatePropsDOMApiElement();

        if (status =='edit')
        {
          if (edit_data && Object.keys(edit_data).length > 0) {
              console.log('---- Edit ----');

              let obj_date_temp = {};
              let obj_number_temp = {};
              let obj_password_temp = {};
              let obj_inputswitch_temp = {};
              let obj_othertext_temp = {};
              let obj_fileupload_temp = {}; // show image
              let obj_fileupload_desc_temp = {};  // deskripsi image

              for(let obj_key_edit of Object.keys(edit_data)) {
                
                  // parsing data value jika status edit
                  let tempFind:FormTemplateDataInputType|undefined = arrConfigInputRef.current.find(inputref=>inputref?.['edit']?.['key_name'] ===  obj_key_edit);
                  if (tempFind){

                    // parsing value ke input
                    // alert(edit_data[obj_key_edit])

                    let val_temp:any;

                    if (tempFind['type'] === 'text') {
                      
                        if (inputRefs[tempFind['index']]?.current) {
                          inputRefs[tempFind['index']].current.value = edit_data[obj_key_edit];
                        }
                        val_temp = edit_data[obj_key_edit];

                        // simpan perubahan data
                        refDataChange.current = {
                          ...refDataChange.current,
                          [tempFind['save']['key_name']]: val_temp
                        }
                    }
                    else if (tempFind['type'] === 'input-switch') {
                      
                        val_temp = edit_data[obj_key_edit];

                        obj_inputswitch_temp = {
                          ...obj_inputswitch_temp,
                          [tempFind?.['name']]: val_temp
                        };

                        // simpan perubahan data
                        refDataChange.current = {
                          ...refDataChange.current,
                          [tempFind['save']['key_name']]: val_temp
                        }
                    }
                    else if (tempFind['type'] === 'fileupload-image-single') {
                      
                        val_temp = edit_data[obj_key_edit];
                      
                     
                        // Ambil nama key untuk save
                        const type_upload = tempFind?.type_upload; 

                        const save_key_name = tempFind?.['save']?.key_name; 
                        const save_key_file_id = tempFind?.['save']?.obj_props?.key_file_id; 
                        const save_key_file_name = tempFind?.['save']?.obj_props?.key_file_name; 
                        const save_key_file_size = tempFind?.['save']?.obj_props?.key_file_size; 
                        const save_key_file_type = tempFind?.['save']?.obj_props?.key_file_type; 
                        const save_key_file_unit = tempFind?.['save']?.obj_props?.key_file_size_unit; 


                        if (type_upload === 'single')
                        {
                             // Akses Data Edit
                            const edit_props_id = tempFind?.['edit']?.obj_props?.id ? val_temp?.[tempFind?.['edit']?.obj_props?.id] : null;  // id image
                            const edit_props_name = tempFind?.['edit']?.obj_props?.file_name ? val_temp?.[tempFind?.['edit']?.obj_props?.file_name] : null; // nama image
                            const edit_props_size = tempFind?.['edit']?.obj_props?.file_size ? val_temp?.[tempFind?.['edit']?.obj_props?.file_size] : null;  // size image
                            const edit_props_type = tempFind?.['edit']?.obj_props?.file_type ? val_temp?.[tempFind?.['edit']?.obj_props?.file_type] : null;  // size image
                            const edit_props_unit = tempFind?.['edit']?.obj_props?.file_unit ? val_temp?.[tempFind?.['edit']?.obj_props?.file_unit] : null;  // satuan unit ('KB','MB',...)
                            const edit_props_url = tempFind?.['edit']?.obj_props?.file_url ? val_temp?.[tempFind?.['edit']?.obj_props?.file_url] : null;  // link url image
                        

                            // tampilkan image
                            if (edit_props_url !== null) {
                              obj_fileupload_temp = {...obj_fileupload_temp,
                                                      [tempFind?.['name']]: edit_props_url
                                                    }
                            }
    
                            // tampilkan deskripsi
                            if (edit_props_id !== null){
                              obj_fileupload_desc_temp = {...obj_fileupload_desc_temp,
                                              [tempFind?.['name']]:{
                                                                name: edit_props_name, 
                                                                size: edit_props_size,
                                                                type: edit_props_type,
                                                                unit: edit_props_unit
                                              }
                              }
                            }

                            refDataChange.current = {
                                ...refDataChange.current,
                                [save_key_name]: {
                                                  [save_key_file_id]: edit_props_id
                                                  , [save_key_file_name]: edit_props_name ?? null
                                                  , [save_key_file_size]: edit_props_size ?? null
                                                  , [save_key_file_type]: edit_props_type ?? null
                                                  , [save_key_file_unit]: edit_props_unit ?? null
                                            }
                            }

                            if (formDataRef && formDataRef.current === null) {
                              formDataRef.current = new FormData();
                              formDataRef.current.append('data', JSON.stringify(refDataChange.current))
                            }
                            else if (formDataRef.current !== null){
                              formDataRef.current.set('data', JSON.stringify(refDataChange.current))
                            }
                        }
                        else if (type_upload === 'multiple')
                        {
                          if (val_temp && Array.isArray(val_temp))
                          {

                              // * Jika semua key sudah lengkap, baru diproses
                                const edit_props_id = tempFind?.['edit']?.obj_props?.id;
                                const edit_props_file_name = tempFind?.['edit']?.obj_props?.file_name;
                                const edit_props_file_size = tempFind?.['edit']?.obj_props?.file_size;
                                const edit_props_file_type = tempFind?.['edit']?.obj_props?.file_type;
                                const edit_props_file_unit = tempFind?.['edit']?.obj_props?.file_unit;
                                const edit_props_file_url = tempFind?.['edit']?.obj_props?.file_url;
                            
                                let arr_files_to_set:File[] = [];
                                
                                // ** kalau ada await dalam Foreach, maka tidak akan ditunggu
                                // *** Solusinya menggunakan Promise.all atau for..of (dibungkus dengan anony function -> "(async ()=>{...})()" ))

                                // val_temp.forEach(async(obj_value, key)=>{

                                let total_size_in_bytes:number = 0;

                                const promises = val_temp.map(async(obj_value, key)=>{

                                    if (edit_props_id && edit_props_file_name && edit_props_file_size
                                        && edit_props_file_type && edit_props_file_unit && edit_props_file_url
                                    ){
                                        // Akses Data Edit
                                        const value_id = obj_value?.[edit_props_id] || null;  // id image
                                        const value_name = obj_value?.[edit_props_file_name] || null // nama image
                                        const value_size = obj_value?.[edit_props_file_size] || null;  // size image
                                        const value_type = obj_value?.[edit_props_file_type] || null;  // type image
                                        const value_unit = obj_value?.[edit_props_file_unit] || null;  // satuan unit ('KB','MB',...)
                                        const value_url = obj_value?.[edit_props_file_url] || null;  // link url image
                                        
                                        if (typeof value_size !== 'undefined' && value_size !== null
                                            && typeof value_unit !== 'undefined' && value_unit !== null
                                        )
                                        {
                                            if (isNaN(Number(value_size)) 
                                                || !['B','KB','MB','GB'].includes(value_unit))
                                            {
                                              toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`Periksa kembali Size (valid: Tipe Number) dan Unit (valid: 'B','KB','MB','GB') pada File "${value_name}" di "${tempFind?.['label']}" !`, life:2000});
                                              return false;
                                            }
                                            else {
                                              total_size_in_bytes += convertSizeToByte(Number(value_size), value_unit);
                                            }
                                        }

                                        if (value_id !== null && value_type !== null){

                                          // * Periksa semua kemungkinan baik document ataupun image
                                          let image_ext:any = null;

                                          if (!value_type.startsWith('image/')){
                                            const konversi_document = convertDocumentExtTypeShort(value_type) || null;

                                            switch(konversi_document){
                                              // case '.docx': image_ext = Ext_Docx;break;
                                              case '.docx': image_ext = Ext_Docx;break;
                                              case '.doc': image_ext = Ext_Doc;break;
                                              case '.xls': image_ext = Ext_Xls;break;
                                              case '.xlsx': image_ext = Ext_Xlsx;break;
                                              case '.csv': image_ext = Ext_Csv;break;
                                              case '.ppt': image_ext = Ext_Ppt;break;
                                              case '.pptx': image_ext = Ext_Pptx;break;
                                              case '.txt': image_ext = Ext_Txt;break;
                                              default: image_ext = null;
                                            }
                                          }
                                          else if (value_type.startsWith('image/'))
                                          {
                                              image_ext = value_url ?? null;
                                          }

                                          if (image_ext !== null){
                                              // Konversi jadi 'File' dari image extensi
                                              const response = await fetch(image_ext);
                                              const blob = await response.blob();
                                              let file_temp:File = new File([blob], value_name, {type: value_type});
                                              const objectURL = URL.createObjectURL(file_temp);
                                              file_temp['id'] = value_id;
                                              file_temp['objectURL'] = objectURL;
                                              file_temp['size_bytes_from_db'] = convertSizeToByte(Number(value_size), value_unit);
                                              file_temp['size_from_db'] = convertSizeToUnit(convertSizeToByte(Number(value_size), value_unit), 3)?.size;
                                              file_temp['size_unit_from_db'] = convertSizeToUnit(convertSizeToByte(Number(value_size), value_unit), 3)?.unit;


                                              arr_files_to_set = [
                                                ...arr_files_to_set,
                                                file_temp
                                              ]
                                              
                                              console.error("file_temp")
                                              console.log(file_temp)
                                          }
                                          
                                        }

                                        if (typeof refDataChange.current?.[save_key_name] === 'undefined')
                                        {
                                          
                                            refDataChange.current = {
                                                ...refDataChange.current,
                                                [save_key_name]: [
                                                            {
                                                                  [save_key_file_id]: value_id
                                                                  , [save_key_file_name]: value_name ?? null
                                                                  , [save_key_file_size]: value_size ?? null
                                                                  , [save_key_file_type]: value_type ?? null
                                                                  , [save_key_file_unit]: value_unit ?? null
                                                            }]
                                            }
                                        }
                                        else if (Array.isArray(refDataChange.current?.[save_key_name]))
                                        {
                                          
                                            refDataChange.current = {
                                                ...refDataChange.current,
                                                [save_key_name]: [
                                                            ...refDataChange.current[save_key_name]
                                                            ,{
                                                                  [save_key_file_id]: value_id
                                                                  , [save_key_file_name]: value_name ?? null
                                                                  , [save_key_file_size]: value_size ?? null
                                                                  , [save_key_file_type]: value_type ?? null
                                                                  , [save_key_file_unit]: value_unit ?? null
                                                            }]
                                            }
                                        }
                                    }

                                    return obj_value
                                  
                                  // alert(JSON.stringify(obj_value,null,2))
                                  // alert(obj_value?.[edit_props_id])
                              
                                })

                                Promise.all(promises).then((result)=>{
                                  if (arr_files_to_set.length > 0){
                                    
                                    // console.error("UPDATE")
                                    // console.log(refDataChange.current)

                                    const input_ref_index = inputRefs?.[tempFind?.['index']];
                                    if (input_ref_index?.current){
                                        inputRefs?.[tempFind?.['index']].current.clear();
                                        inputRefs?.[tempFind?.['index']].current.setFiles([...arr_files_to_set]);
                                    } 

                                    if (formDataRef && formDataRef.current === null) {
                                      formDataRef.current = new FormData();
                                      formDataRef.current.append('data', JSON.stringify(refDataChange.current))
                                    }
                                    else if (formDataRef.current !== null){
                                      formDataRef.current.set('data', JSON.stringify(refDataChange.current))
                                    }

                                    const input_name = tempFind?.['name'];
                                    if (typeof input_name !== 'undefined' && input_name !== null){

                                      setObjUploadSizeLimit((prev:any)=>{
                                        return {
                                          ...prev,
                                          [input_name]: {
                                            ...prev[input_name],
                                            size_in_byte: total_size_in_bytes,
                                            size: convertSizeToUnit(total_size_in_bytes, 0)?.size,
                                            size_unit: convertSizeToUnit(total_size_in_bytes, 0)?.unit
                                          }
                                        }
                                      })
                                    }

                                  }
                                })

                          }

                        }

                    }
                    else if (tempFind['type'] === 'email') {
                      
                        val_temp = edit_data?.[obj_key_edit];

                        obj_othertext_temp = {
                          ...obj_othertext_temp,
                          [tempFind?.['name']]: val_temp
                        };

                        if (typeof val_temp !='undefined' && val_temp !== null && val_temp !== '')
                        {
                          if (isEmail(val_temp)){
                            // simpan perubahan data
                            refDataChange.current = {...refDataChange.current,
                              [tempFind['save']['key_name']]: val_temp
                            }
                          }
                          else {
                            refDataChange.current = {...refDataChange.current,
                              [tempFind['save']['key_name']]: null
                            }
                          }
                        }

                    }
                    else if (tempFind['type'] === 'chips') {
                      
                        val_temp = edit_data?.[obj_key_edit];

                        // *** Save Out
                        let final_temp_save_out:string[]|string|null = null;

                        const save_format_type = tempFind?.['save']?.['format']?.['type'];
                        const edit_split_string = tempFind?.['edit']?.['split_string'];

                        if (save_format_type === 'array'){

                            // Jika sumber data nya array, maka di copy saja ke final_temp (untuk save keluar)
                            if (Array.isArray(val_temp)){
                              final_temp_save_out = [...val_temp];
                            }
                            else {
                              
                              // Jika sumber data selain array, maka di convert ke array (untuk save keluar)
                              // ** Output : 'abc, def' --> ['abc','def']
                              if (val_temp !== null){
                                final_temp_save_out = val_temp.toString().split(edit_split_string);
                              } else {final_temp_save_out = null;}

                            }
                        }
                        else if (save_format_type === 'string') {

                            if (val_temp !== null){
                              final_temp_save_out = val_temp.toString();
                            }
                            else {
                              final_temp_save_out = null;
                            }
                        }


                        if (
                            (typeof val_temp !='undefined' && val_temp !== null)
                        ) {

                            if (val_temp.toString().trim() !== '')
                            {
                                  // simpan perubahan data
                                  refDataChange.current = {...refDataChange.current,
                                    [tempFind['save']['key_name']]: final_temp_save_out
                                  }
                            }
                            else {
                              refDataChange.current = {...refDataChange.current,
                                [tempFind['save']['key_name']]: null
                              }
                            }
                        }
                        // ---- Save out

                        // *** Parsing ke dalam 'input Tags' berupa wajib Array
                        if (typeof val_temp !== 'undefined' && val_temp !== null)
                        {

                            let parsing_value_to_state:string[]|null = null;
    
                            if (Array.isArray(val_temp)){
                                parsing_value_to_state = val_temp.length > 0 ? [...val_temp] : null;
                            }
                            else {
                                if (typeof val_temp === 'string')
                                {
                                    if (val_temp.toString().trim() !== ''){
                                      const edit_split_string = tempFind?.['edit']?.['split_string'];
                                      if (edit_split_string){
                                        parsing_value_to_state = val_temp.toString().split(edit_split_string);
                                      }
                                    }
                                    else {
                                        // jika kosong, maka null
                                        parsing_value_to_state = null;
                                        
                                    }
                                }
                            }
                            
                            obj_othertext_temp = {...obj_othertext_temp,
                              [tempFind?.['name']]: parsing_value_to_state !== null ? [...parsing_value_to_state] : null
                            };
                            

                        }

                    }
                    else if (tempFind['type'] === 'number'){

                        val_temp = edit_data[obj_key_edit];

                        obj_number_temp = {
                          ...obj_number_temp,
                          [tempFind?.['name']]: val_temp
                        };

                        // simpan perubahan data
                        refDataChange.current = {
                          ...refDataChange.current,
                          [tempFind['save']['key_name']]: val_temp
                        }

                    }
                    else if (tempFind['type'] === 'password'){

                        val_temp = edit_data[obj_key_edit];

                        obj_password_temp = {
                          ...obj_password_temp,
                          [tempFind?.['name']]: val_temp
                        };

                        // simpan perubahan data
                        refDataChange.current = {
                          ...refDataChange.current,
                          [tempFind['save']['key_name']]: val_temp
                        }

                    }
                    else if (tempFind['type'] === 'date') {

                        let source_edit_format = tempFind?.['edit']?.['format'];
                        if (source_edit_format) {
                          let checkdate = checkIsDateFormat(edit_data[obj_key_edit], source_edit_format);
                          if (checkdate?.['valid_date']){

                            let date_value:any = checkdate?.['date'];

                            obj_date_temp = {
                              ...obj_date_temp,
                              [tempFind?.['name']]: date_value
                            };

                            val_temp = format(date_value, tempFind?.['save']?.['format']);
                            
                            // console.log("val_temp");
                            // console.log(val_temp);
                          }
                          else {
                            val_temp = null;
                          }
                          
                        }

                        // simpan perubahan data
                        refDataChange.current = {
                          ...refDataChange.current,
                          [tempFind['save']['key_name']]: val_temp
                        }
                    }
                    else if (tempFind?.type === 'multi-select') {

                        val_temp = edit_data[obj_key_edit];

                        let save_to_refDataChange:any = null;
                        let isInvalid:boolean = false;
                        let temp_data:any[] = [];

                        if (tempFind?.['select_item_type'] === 'multiple'){
                          if (!Array.isArray(val_temp)){
                            
                            toastProsesRef?.current.show({severity:'warn', summary: 'Warning', detail:`Data ${tempFind?.['label']} harus bertipe Array karena ber-Tipe 'Multiple' !`, life:2000});
                            isInvalid = true;
                          }
                          else {
                            temp_data = [...val_temp];
                          }
                        }
                        else if (tempFind?.['select_item_type'] === 'single'){
                          if (!(typeof val_temp === 'string' || typeof val_temp === 'number')){
                            toastProsesRef?.current.show({severity:'warn', summary: 'Warning', detail:`Data ${tempFind?.['label']} harus bertipe String karena ber-Tipe 'Single' !`, life:2000});
                            isInvalid = true;
                          }
                          else {
                            temp_data = [val_temp];
                          }
                        }

                        
                        if (!isInvalid){
                          if (tempFind?.['data_source']?.type === 'hardcode'){
  
                              let arr_data_temp:FormTemplate_MultiSelectType[] = [...tempFind?.['data_source']?.data];
                              if (arr_data_temp.length > 0){
                                if (Array.isArray(temp_data)){
                                    
                                    let temp_arrFindData:any[] = [];
                                    for (let data of temp_data){

                                        let findItem = arr_data_temp.find(item=>item?.['id'] === data);
                                        if (findItem){

                                          temp_arrFindData = [
                                            ...temp_arrFindData,
                                            {...findItem}
                                          ];
                                        }
                                    }

                                    switch(tempFind?.['select_item_type']){
                                      case 'single':  save_to_refDataChange = temp_arrFindData[0]?.['id'] ?? null;break;
                                      case 'multiple': save_to_refDataChange = [...temp_arrFindData.map(item=>item?.['id'])];break;
                                    }

                                    temp_objSelectedMultiSelect.current = {
                                        ...temp_objSelectedMultiSelect.current,
                                        [tempFind?.['index']]: [...temp_arrFindData]
                                    }

                                }
                              }
                          }
                          else if (tempFind?.['data_source']?.type === 'api'){

                            let datasource_fetching_filter = tempFind?.['data_source']?.['fetching']?.['filter'];
                            let statusKeyValueExists = checkKeyValueExists(datasource_fetching_filter, 'type', 'from_multi_select');
                            
                            let param = tempFind?.['data_source']?.['param'];

                            let index_input = tempFind?.['index'];
                            let edit_keyname:any = tempFind?.['edit']?.['key_name'] ?? null;
                            let edit_namekeyvalue:any = tempFind?.['edit']?.['key_value'];
                            
                            if (!param && !statusKeyValueExists){

                                    // ** kondisi list data array sudah di fetching di awal karena configurasi input yang tanpa parameter
                                    // ** sehingga di sini hanya parsing value ke object selected saja


                                    // akses data dalam edit_data
                                    let edit_keyvalue = edit_data?.[edit_namekeyvalue];
                                    let arr_edit_keyvalue:any[] = [];

                                    // Note ** key_name adalah 'id'
                                    // Note ** key_value adalah 'name'

                                    if (edit_keyvalue){
                                      // ***jadikan array pada edit -> key_value untuk multi-select
                                      // ***sebagai tujuan untuk mengisi 'name' jika id tidak ada dalam array
                                        if (Array.isArray(edit_keyvalue)){
                                          arr_edit_keyvalue = [...edit_keyvalue];
                                        }
                                        else {
                                          arr_edit_keyvalue = [edit_keyvalue];
                                        }
                                    }
                                    

                                    // *** akses array configurasi dalam 'objDataMultiSelectRef'
                                    let arrObjDataMultiSelect = objDataMultiSelectRef.current?.[index_input];

                                    if (arrObjDataMultiSelect && Array.isArray(arrObjDataMultiSelect)){

                                        // **jika multi-select multiple value, maka key-value harus array
                                        // **contoh di edit_data : 'topic_id': ['antara','news'], 'topic_name': ['Antara','News']
                                        // *** posisi index harus sama variable antara key dan value

                                          let temp_arrFindData:any[] = [];
                                          for (let [index, data] of Object.entries(temp_data)){

                                              let findItem = arrObjDataMultiSelect.find(item=>item?.['id'] === data);
                                              if (findItem){

                                                temp_arrFindData = [
                                                  ...temp_arrFindData,
                                                  {...findItem}
                                                ];
                                              }
                                              else {
                                                temp_arrFindData = [
                                                  ...temp_arrFindData,
                                                  {'id': data, 'name': arr_edit_keyvalue?.[index] ?? null}
                                                ];
                                              }
                                          }

                                          switch(tempFind?.['select_item_type']){
                                            case 'single':  save_to_refDataChange = temp_arrFindData[0]?.['id'] ?? null;break;
                                            case 'multiple': save_to_refDataChange = [...temp_arrFindData.map(item=>item?.['id'])];break;
                                          }
                                          
                                          temp_objSelectedMultiSelect.current = {
                                              ...temp_objSelectedMultiSelect.current,
                                              [index_input]: [...temp_arrFindData]
                                          }
                                        
                                    }
                                  

                                    // alert(JSON.stringify(objDataMultiSelectRef.current))
                                    // alert(tempFind?.['index'])

                            }
                            else {
                              // alert(tempFind?.['name'])

                              // Proses Data API input-an tujuan (multi-select) yang lain ketika onchange 

                              let objSelectedId:any[] = [];

                              let data_edit_key_by_name:any = edit_data?.[edit_keyname];
                              let data_edit_key_by_value:any = edit_data?.[edit_namekeyvalue];

                              if (Array.isArray(data_edit_key_by_name)){

                                if (Array.isArray(data_edit_key_by_value)){

                                  if (data_edit_key_by_name.length === data_edit_key_by_value.length){

                                    for (let [index_key, item_key] of Object.entries(data_edit_key_by_name)){
                                      objSelectedId = [
                                        ...objSelectedId,
                                        {'id': item_key, 'name': data_edit_key_by_value?.[index_key]}
                                      ]
                                    }
                                  }
                                  else {
                                    for (let [index_key, item_key] of Object.entries(data_edit_key_by_name)){
                                        objSelectedId = [
                                          ...objSelectedId,
                                          {'id': item_key, 'name': item_key}
                                        ]
                                    }
                                  }
                                }
                                else {
                                    for (let [index_key, item_key] of Object.entries(data_edit_key_by_name)){
                                        objSelectedId = [
                                          ...objSelectedId,
                                          {'id': item_key, 'name': item_key}
                                        ]
                                    }
                                }

                              }
                              else if (typeof data_edit_key_by_name === 'string' || typeof data_edit_key_by_name === 'number')
                              {
                                objSelectedId = [
                                  ...objSelectedId,
                                  {'id': data_edit_key_by_name, 'name': data_edit_key_by_value}
                                ]
                              }

                                // fetching API dengan status Edit
                                prosesMultiSelect_whenOnChange(objSelectedId, tempFind, true);
                                // ----

                                switch(tempFind?.['select_item_type']){
                                  case 'single':  save_to_refDataChange = objSelectedId[0]?.['id'] ?? null;break;
                                  case 'multiple': save_to_refDataChange = [...objSelectedId.map(item=>item?.['id'])];break;
                                }
                                
                                temp_objSelectedMultiSelect.current = {
                                    ...temp_objSelectedMultiSelect.current,
                                    [index_input]: [...objSelectedId]
                                }

                            }
                          }
                        }
                        else {
                          save_to_refDataChange = null;
                        }

                        // simpan perubahan data
                        refDataChange.current = {
                          ...refDataChange.current,
                          [tempFind['save']['key_name']]: save_to_refDataChange
                        }
                        
                        // console.log("temp_objSelectedMultiSelect.current")
                        // console.log(temp_objSelectedMultiSelect.current)

                    }

                  }
              }

              // set data edit 'date' ke semua element dom
              setObjInputDate({...obj_date_temp});  // date
              setObjInputNumber({...obj_number_temp});  // number
              setObjInputPassword({...obj_password_temp});  // password
              setObjInputSwitch({...obj_inputswitch_temp});  // input switch
              setObjInputTextOthers({...obj_othertext_temp}); // input others (email, chips)
              setObjSelected_MultiSelect({...temp_objSelectedMultiSelect.current}); // multi-select
              setObjFileUpload({...obj_fileupload_temp});
              setObjFileUploadDescription({...obj_fileupload_desc_temp});
              
          }
        }
        
        setTimeout(()=>{
          setLoading(false);

          setTimeout(()=>{
            if (inputRefs[0]?.current) {
              inputRefs[0].current.focus();
            }
          })
          
        },500)


        setTimeout(()=>{
          outDataChange_StatusProses.current = 'process_out_change';

          refDataEditChange.current = {
              ...edit_data
          }
  
          outDataChange({data:{...refDataChange.current}, data_with_key_edit: {...refDataEditChange.current}, posisi_name_input_when_onchange:null, status_proses:'process_out_change'}, formDataRef.current);
        },200)
        // alert(JSON.stringify(refDataChange.current))
      }

  },[inputRefs])


  useEffect(()=>{

    // jika tidak ada error, fokus ke input pertama

    if (arrErrorConfig.length === 0) {
      if (inputRefs[0]?.current) {
        inputRefs[0].current.focus();
      }
    }


  },[arrErrorConfig])

  
  const funcUrl_ParamBreakDown = (url:string|null) => {

    // *** Contoh : url = `https://www.api.master.com/v1/regencies/{province}/{city}?value={param3}`
    // *** Output : ["province", "city", "param3"]

    if (url === null){
      return [];
    }

    let url_temp = url;
    let pat = /{([a-zA-Z0-9\s.,*&+-_()\[\]]+)}/g;
    let match;
    let matches:any[] = [];

    while ((match = pat.exec(url_temp)) !== null) {
      // hasil dalam array : [0] => {province}, [1] => province
      matches.push(match[1])
    }
    return [...matches];
  }

  useEffect(()=>{
    if (!statusAwalRef.current) {

      if (outDataChange_StatusProses.current === 'not_enter_element')
      {
        return;
      }
      
      let status_change:boolean = false;

      // contoh ---> {"set":[{"type":"value_input","data":[{"name":"name_customer","value":"CUSTOMER IN data Change"}]}]}
      if (inDataChange?.['set']){
        inDataChange?.['set'].forEach((obj, idx)=>{

          if (obj?.['type'] === 'value_input' &&
              obj?.['data'] && obj?.['data'].length > 0
          ) {

            for (let data of obj?.['data']) {
                let data_name = data?.['name'];
                let data_value:any = data?.['value'];

                let findConfigInput:FormTemplateDataInputType|null = arrConfigInputRef.current.find(v=>v?.['name'] === data_name) || null;
                if (findConfigInput) {

                    let index_input = findConfigInput?.['index'];
                    let type_input = findConfigInput?.['type'];
                    let savekeyname_input = findConfigInput?.['save']?.['key_name'];
                    

                    if (inputRefs?.[index_input]) {
                      if (type_input === 'text') {
                        
                        inputRefs[index_input].current.value = data_value;

                        refDataChange.current = {
                          ...refDataChange.current,
                          [savekeyname_input]: data_value
                        }

                        let edit_keyname = findConfigInput?.edit?.key_name;
                        if (typeof edit_keyname !== 'undefined'){
                          refDataEditChange.current = {
                            ...refDataEditChange.current,
                            [edit_keyname]: data_value === "" ? null : data_value
                          }
                        }

                        // ** Handle Global Invalid Message
                        if (data_value != null && data_value != ""){
                          // jika data ada, maka hapus dari invalid global
                          delete globalInvalidInput.current?.[index_input];
                        }
                        else {

                          if (findConfigInput?.['required']) {
                            // jika tidak ada, maka set 'is required'
                            globalInvalidInput.current = {
                                ...globalInvalidInput.current,
                                [index_input]: (findConfigInput?.['label'] + ' is required')
                            }
                          }
                        }

                        status_change = true;
                      }
                      else if (type_input === 'number') {
                        if (!isNaN(data_value)) {

                          refDataChange.current = {
                            ...refDataChange.current,
                            [savekeyname_input]: parseFloat(data_value)
                          }

                          let edit_keyname = findConfigInput?.edit?.key_name;
                          if (typeof edit_keyname !== 'undefined'){
                            refDataEditChange.current = {
                              ...refDataEditChange.current,
                              [edit_keyname]: data_value === "" ? null : data_value
                            }
                          }

                          // ** Handle Global Invalid Message
                          if (data_value != null && data_value != ""){
                            // jika data ada, maka hapus dari invalid global
                            delete globalInvalidInput.current?.[index_input];
                          }
                          else {

                            if (findConfigInput?.['required']) {
                              // jika tidak ada, maka set 'is required'
                              globalInvalidInput.current = {
                                  ...globalInvalidInput.current,
                                  [index_input]: (findConfigInput?.['label'] + ' is required')
                              }
                            }
                          }

                          const config_name = findConfigInput?.name;
                          if (typeof config_name !== 'undefined')
                          {
                            // kumpulan input-an type 'number' by name
                            setObjInputNumber(prev=>{
                              return {
                                  ...prev,
                                  [config_name]: parseFloat(data_value)
                              }
                            });

                          }
                          
                          status_change = true;

                        }
                      }

                    }
                }
            }
            
          }
          else if (obj?.['type'] === 'date_input' &&
                  obj?.['data'] && obj?.['data'].length > 0) 
              {

                for (let data of obj?.['data']) {
                  
                  let data_name = data?.['name'];
                  let data_value:any = data?.['value'];

                  // let findConfigInput = {...arrConfigInputRef.current.find(v=>v?.['name'] === data_name)};
                  let findConfigInput:FormTemplateDataInputType|null = arrConfigInputRef.current.find(v=>v?.['name'] === data_name) || null;

                  if (findConfigInput && findConfigInput !== null && Object.keys(findConfigInput).length > 0) {

                      let index_input = findConfigInput?.['index'];
                      let type_input = findConfigInput?.['type'];
                      let savekeyname_input = findConfigInput?.['save']?.['key_name'];
                      let saveformat_input = findConfigInput?.['save']?.['format'];
                      
                      if (type_input === 'date') {

                          refDataChange.current = {
                            ...refDataChange.current,
                            [savekeyname_input]: data_value != null && data_value != "" ? format(data_value, saveformat_input) : null
                          }

                          // * Simpan dalam bentuk Edit (untuk Modal)
                          const edit_keyname = findConfigInput?.edit?.key_name;
                          let edit_value:string|null = null;

                          let edit_format = '';
                          if (findConfigInput?.type === 'date'){

                            edit_format = findConfigInput?.edit?.format ?? '';

                            if (edit_format !== ''){
                              if (data_value !== null && data_value !== "")
                                {
                                    edit_value = format(data_value, edit_format);
                                    if (typeof edit_keyname !== 'undefined')
                                    {
                                      refDataEditChange.current = {
                                        ...refDataEditChange.current,
                                        [edit_keyname]: edit_value != null && edit_value != "" ? edit_value : null
                                      }
                                    }
                                }
                            }
                          }

                          // broadcast keluar form
                          // outDataChange({data:{...refDataChange.current},
                          //   posisi_name_input_when_onchange: findConfigInput?.['name'],
                          //   status_proses:'process_out_change'})
                            
                          if (!isNaN(data_value) && data_value != null && data_value != ""){
                            // jika data ada, maka hapus dari invalid global
                            delete globalInvalidInput.current?.[index_input];
                          }
                          else {

                            if (findConfigInput?.['required']) {
                              // jika tidak ada, maka set 'is required'
                              globalInvalidInput.current = {
                                  ...globalInvalidInput.current,
                                  [index_input]: (findConfigInput?.['label'] + ' is required')
                              }
                            }
                          }

                          
                          const config_name = findConfigInput?.name;
                          if (typeof config_name !== 'undefined')
                          {
                            // kumpulan input-an type 'date' by name
                            setObjInputDate(prev=>{
                              return {
                                  ...prev,
                                  [config_name]: data_value
                              }
                            });
                            
                          }

                          status_change = true;
                      }
                  }
                }

              }
              else if (obj?.['type'] === 'multiselect_input' &&
                obj?.['data'] && obj?.['data'].length > 0) 
              {
                
                // simpan sementara ke temporary variabel (copy dari state objSelected_MultiSelect)
                  temp_objSelectedMultiSelect.current = {...objSelected_MultiSelect};

                  for (let data of obj?.['data']) {
                    
                      let data_name = data?.['name']; // name input
                      let data_value:any = data?.['value']; // berupa array baik satu atau lebih data, contoh: ['Male', 'Female']

                      // let findConfigInput:any = {...arrConfigInputRef.current.find(v=>v?.['name'] === data_name)};
                      let findConfigInput:FormTemplateDataInputType|null = arrConfigInputRef.current.find(v=>v?.['name'] === data_name) || null;

                      if (findConfigInput && findConfigInput !== null && Object.keys(findConfigInput).length > 0) {

                          let afterFindConfigInput:FormTemplateDataInputType = {...findConfigInput}

                          let index_input = afterFindConfigInput?.['index'];
                          let type_input = afterFindConfigInput?.['type'];
                          let label_input = afterFindConfigInput?.['label'];
                          let select_item_type = afterFindConfigInput?.['select_item_type'];  // single or multiple
                          let savekeyname_input = afterFindConfigInput?.['save']?.['key_name'];

                              let statusInvalid:boolean = false;
                            
                              if (Array.isArray(data_value))
                              {
                                  let temp_final_data:any = [...data_value];

                                  if (select_item_type === 'single') {
                                    
                                    if (data_value.length > 1){
    
                                        toastProsesRef?.current.show({severity:'warn', summary: 'Warning', detail:`${label_input} hanya dapat menerima satu data karena ber-Tipe 'Select Single',\nItem Pertama yang terpilih !`, life:2000});
                                        temp_final_data = [temp_final_data[0]];
                                    }
                                  }

                                  if (data_value.length === 0){
                                      statusInvalid = true;
                                  }

                                  if (select_item_type === 'single') {

                                    // looping semua data dalam `value: ['Male','Female']`
                                    for (let value_id of temp_final_data){
                                        let findDataMaster_Merge:string = ''; // 'Male, Female'

                                        // seharusnya hanya satu data untuk satu id saja
                                        let findDataMaster:any = objDataMultiSelectRef.current?.[index_input].filter(item=>item?.['id'] === value_id);                                      
                                        if (findDataMaster.length > 0){
                                          findDataMaster_Merge = findDataMaster.map(item=>item?.['id']).join(', ').trim();  // Male1, Male2
                                        }
  
                                        if (findDataMaster_Merge != null && findDataMaster_Merge != ""){
        
                                            // kondisi di output save
                                            refDataChange.current = {
                                              ...refDataChange.current,
                                              [savekeyname_input]: value_id
                                            }

                                            // * Update ke refDataEditChange (untuk Modal)
                                            if (findConfigInput?.type === 'multi-select')
                                            {
                                                let edit_keyname = findConfigInput?.edit?.key_name;
                                                let edit_keyvalue = findConfigInput?.edit?.key_value;
                                                
                                                if (typeof edit_keyname !== 'undefined' && 
                                                      typeof edit_keyvalue !== 'undefined')
                                                {
                                                  if (edit_keyname === edit_keyvalue)
                                                  {
                                                      // jika nama key 'name' dan 'value' sama, maka hanya pakai satu key 'name' saja
                                                      refDataEditChange.current = {...refDataEditChange.current,
                                                              [edit_keyname]: findDataMaster[0]?.['id']  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                      }
                                                  }
                                                  else {
                                                      // kondisi nama key 'name' dan 'value' berbeda, maka buat dua key dalam object
                                                      refDataEditChange.current = {...refDataEditChange.current,
                                                        [edit_keyname]: findDataMaster[0]?.['id'],  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                        [edit_keyvalue]: findDataMaster[0]?.['name']  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                      }
                                                  }
                                                }
                                            }
        
                                            temp_objSelectedMultiSelect.current = {
                                                ...temp_objSelectedMultiSelect.current,
                                                [index_input]:[{...findDataMaster[0]}]
                                            }
  
                                            if (globalInvalidInput.current?.[index_input]){
                                              delete globalInvalidInput.current?.[index_input];
                                            }
  
                                        }
      
                                    }
                                  }
                                  else if (select_item_type === 'multiple'){

                                    let temp_refDataChange:any[] = [];
                                    let temp2_objSelectedMultiSelect:any[] = [];

                                    // * Bersihkan data existing jika string, maka dibuat null
                                    if (findConfigInput?.type === 'multi-select')
                                    {
                                        let edit_keyname = findConfigInput?.edit?.key_name;
                                        let edit_keyvalue = findConfigInput?.edit?.key_value;
                                        
                                        // * Bersihkan data existing jika string, maka dibuat null
                                        if (typeof edit_keyname !== 'undefined')
                                        {
                                          if (typeof refDataEditChange.current?.[edit_keyname] !== 'undefined')
                                          {
                                              refDataEditChange.current = {...refDataEditChange.current, [edit_keyname]:null}
                                          }
                                        }
                                        if (typeof edit_keyvalue !== 'undefined')
                                        {
                                          if (typeof refDataEditChange.current?.[edit_keyvalue] !== 'undefined')
                                          {
                                              refDataEditChange.current = {...refDataEditChange.current, [edit_keyvalue]:null}
                                          }
                                        }
                                    }
                                    // -------------------
                                    
                                    for (let value_id of temp_final_data){
                                        let findDataMaster_Merge:string = ''; // 'Male, Female'
                                        let findDataMaster:any = objDataMultiSelectRef.current?.[index_input].filter(item=>item?.['id'] === value_id);                                      
                                        if (findDataMaster.length > 0){
                                          findDataMaster_Merge = findDataMaster.map(item=>item?.['id']).join(', ').trim();  // Male1, Male2
                                        }

                                        if (findDataMaster_Merge != null && findDataMaster_Merge != ""){

                                          // output when save : ['Male', 'Female']
                                            temp_refDataChange = [
                                              ...temp_refDataChange,
                                              value_id
                                            ]

                                            temp2_objSelectedMultiSelect = [
                                              ...temp2_objSelectedMultiSelect, 
                                              {...findDataMaster[0]}
                                            ]

                                            // * Update ke refDataEditChange (untuk Modal)

                                            if (findConfigInput?.type === 'multi-select')
                                            {
                                                let edit_keyname = findConfigInput?.edit?.key_name;
                                                let edit_keyvalue = findConfigInput?.edit?.key_value;
                                                

                                                if (typeof edit_keyname !== 'undefined' && 
                                                      typeof edit_keyvalue !== 'undefined')
                                                {
                                                  if (edit_keyname === edit_keyvalue)
                                                  {
                                                      // jika nama key 'name' dan 'value' sama, maka hanya pakai satu key 'name' saja
                                                      
                                                      if (typeof refDataEditChange.current?.[edit_keyname] === 'undefined' 
                                                            || refDataEditChange.current?.[edit_keyname] === null)
                                                      {
                                                        refDataEditChange.current = {...refDataEditChange.current,
                                                                [edit_keyname]: [
                                                                              findDataMaster[0]?.['id'],
                                                                  ]  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                        }
                                                      }
                                                      else {

                                                        refDataEditChange.current = {
                                                                ...refDataEditChange.current,
                                                                [edit_keyname]: [
                                                                              ...refDataEditChange.current?.[edit_keyname],
                                                                              findDataMaster[0]?.['id']
                                                                  ]  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                        }
                                                      }
                                                      

                                                  }
                                                  else {

                                                      // kondisi nama key 'name' dan 'value' berbeda, maka buat dua key dalam object
                                                      
                                                      // * key 'id'
                                                      if (typeof refDataEditChange.current?.[edit_keyname] === 'undefined')
                                                      {
                                                          refDataEditChange.current = {...refDataEditChange.current,
                                                            [edit_keyname]: [findDataMaster[0]?.['id']],  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                          }
                                                      }
                                                      else {
                                                          refDataEditChange.current = {...refDataEditChange.current,
                                                            [edit_keyname]: [...refDataEditChange.current?.[edit_keyname], findDataMaster[0]?.['id']],  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                          }
                                                      }

                                                      // kondisi nama key 'name' dan 'value' berbeda, maka buat dua key dalam object

                                                      // * key 'name'
                                                      if (typeof refDataEditChange.current?.[edit_keyvalue] === 'undefined')
                                                      {
                                                          refDataEditChange.current = {...refDataEditChange.current,
                                                            [edit_keyvalue]: [findDataMaster[0]?.['name']],  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                          }
                                                      }
                                                      else {
                                                          refDataEditChange.current = {...refDataEditChange.current,
                                                            [edit_keyvalue]: [...refDataEditChange.current?.[edit_keyvalue], findDataMaster[0]?.['name']],  // bisa string ('1') atau array jika multiple (['1',2','3'])
                                                          }
                                                      }

                                                  }
                                                }
                                            }


                                            if (globalInvalidInput.current?.[index_input]){
                                              delete globalInvalidInput.current?.[index_input];
                                            }

                                        }
                                    }

                                    // kondisi di output save
                                    refDataChange.current = {
                                      ...refDataChange.current,
                                      [savekeyname_input]: [...temp_refDataChange]
                                    }

                                    temp_objSelectedMultiSelect.current = {
                                        ...temp_objSelectedMultiSelect.current,
                                        [index_input]: [...temp2_objSelectedMultiSelect]
                                    }


                                  }
                              }
                              else {
                                statusInvalid = true;
                              }

                              if (statusInvalid){
                                  if (findConfigInput?.['required']) {
                                    // jika tidak ada, maka set 'is required'
                                    globalInvalidInput.current = {
                                        ...globalInvalidInput.current,
                                        [index_input]: (findConfigInput?.['label'] + ' is required')
                                    }
                                  }
                              }

                          

                      }

                  }


                  setObjSelected_MultiSelect(prev=>{
                    return {
                      ...prev,
                      ...temp_objSelectedMultiSelect.current
                    }
                  });

                  status_change = true;

              }

              
        })

        setInvalidInput({
            ...globalInvalidInput.current
        });
            
        if (status_change) {
          outDataChange_StatusProses.current = 'not_enter_element';
          outDataChange({data:{...refDataChange.current}, 
                        data_with_key_edit:{...refDataEditChange.current},
                        posisi_name_input_when_onchange:null, 
                        status_proses:'not_enter_element'}, formDataRef.current)
        }
      }

    }
    else {
      statusAwalRef.current = false;
    }
  },[inDataChange])


  const funcCheckInvalidConf = (arrConfigInputRef:any[]) => {

      let temp_sto:any[] = [];

      let keyChecks:any[] = ['name', 'id', 'save.key_name', 'fileupload-image-single.save.obj_props'];
      for (let key of keyChecks) {

        // Periksa apa terdapat data dalam keyChecks yang sama
        let tempArrDuplicate_Name = funcGetDuplicateData(arrConfigInputRef, key);
  
        let msg_inv_name = '';
        if (Array.isArray(tempArrDuplicate_Name) && tempArrDuplicate_Name.length > 0) {
            msg_inv_name = `Check duplicate config for 'data_input.` + key + `' such as : "` + tempArrDuplicate_Name.join(', ') + `"`;
            temp_sto = [...temp_sto, {type:`duplicate_`+ key, description: msg_inv_name}]
        }
        // ... End
      }

      
      setArrErrorConfig(err=>{
        let temp = [...err];
        let temp_ref = [...arrErrorConfigRef.current];
        // let temp:any[] = [];
        temp = temp.concat([...temp_ref]).concat([...temp_sto]);
        return [...temp];
      })



      // Periksa apa terdapat 'id' yang sama
      // let tempArrDuplicat_Id = funcGetDuplicateData(arrConfigInputRef, 'id');

      // let msg_inv_id = '';
      // if (Array.isArray(tempArrDuplicat_Id) && tempArrDuplicat_Id.length > 0) {
      //   msg_inv_id = `Check duplicate config for 'data_input.id' such as : "` + tempArrDuplicat_Id.join(', ') + `"`;
      //   temp_sto = [...temp_sto, {type:'duplicate_id', description: msg_inv_id}]
      // }
      // ... End

      // Periksa apa terdapat 'save.key_name' yang sama
      // let tempArrDuplicat_SaveKeyName = funcGetDuplicateData(arrConfigInputRef, 'save.key_name');

      // let msg_inv_savename = '';
      // if (Array.isArray(tempArrDuplicat_SaveKeyName) && tempArrDuplicat_SaveKeyName.length > 0) {
      //   msg_inv_savename = `Check duplicate config for 'save.key_name' such as : "` + tempArrDuplicat_SaveKeyName.join(', ') + `"`;
      //   temp_sto = [...temp_sto, {type:'duplicate_save_keyname', description: msg_inv_savename}]
      // }
      // ... End


  }

  const funcGetDuplicateData = (arrTemp:any[], keyIndicator:string) => {
    if (arrTemp.length === 0) {
        return [];
    }
    else {

      if (keyIndicator == '' || keyIndicator == null) {
        return null;
      }


      // let tempArr2:any[] = _(arrTemp)
      //                     .map(keyIndicator)  // contoh: 'save.key_name', 'name'

      // alert(JSON.stringify(tempArr2))
      console.log(arrTemp)


      if (keyIndicator === 'fileupload-image-single.save.obj_props'){
        // ** tidak boleh ada name yang sama pada semua value di dalam obj_props 
        if (arrTemp.length > 0) {

          let fileUploadImageSingle_ConfigArr = arrTemp.filter(temp=>temp?.['type'] === 'fileupload-image-single');
          for (let temp_fileUpload of fileUploadImageSingle_ConfigArr) {

              let save_objprops = temp_fileUpload?.['save']?.['obj_props'];

              if (typeof save_objprops !== 'undefined' && save_objprops !== null) {
                  let objValues = Object.values(save_objprops);

                  if (objValues.length > 0){
                      let tempArr:any[] = _(objValues)
                                          .filter((value, index, iterate)=>_.includes(iterate, value, index+1))
                                          .uniq()
                                          .value();
                      
                      if (tempArr.every(val=>val === null)){
                          return null;
                      }
                      else {
                          return [...tempArr];
                      }
                  }
              }
          }

        }
      }
      else {
        // output : ['name_nofakur', 'name_customer']
        let tempArr:any[] = _(arrTemp)
                            .map(keyIndicator)  // contoh: 'save.key_name', 'name'
                            .filter((value,index, iterate)=> _.includes(iterate, value, index+1)) // jika value ada di index posisi selanjutnya, maka return true
                            .uniq()
                            .value();
  
        // jika tidak ada key indicator yang dimaksud, maka return null
        if (tempArr.every(val=>val==null)){
            return null;
        }
        else {
          return [...tempArr];
        }
      }

      
    
    }
  }

  const funcBlurInput = (indexRef, objInput) => {

    
    let temp_value;
    if (objInput?.['type'] === 'text') {
      temp_value = inputRefs[indexRef].current.value;
    }
    else if (objInput?.['type'] === 'number') {
      temp_value = objInputNumber?.[objInput?.['name']]
    }
    else if (objInput?.['type'] === 'password') {
      temp_value = objInputPassword?.[objInput?.['name']]
    }
    else if (objInput?.['type'] === 'email') {
      temp_value = objInputTextOthers?.[objInput?.['name']]
    }

    // wajib harus di isi untuk required
    if (objInput?.['required']) {

      if (objInput?.['type'] === 'text') {
        if (temp_value == null || temp_value.toString().trim() == "") {
          globalInvalidInput.current = {
              ...globalInvalidInput.current,
              [indexRef]: (objInput?.['label'] + ' is required')
          }
        }
        else {
          // jika valid, maka kita hapus key nya dari globalInvalidInput (pesan di hide dari view)
          if (globalInvalidInput?.current?.[indexRef]) {
            delete globalInvalidInput.current[indexRef];
          }
        }
      }
      else if (objInput?.['type'] === 'password') {
        if (temp_value == null || temp_value == "") {
          globalInvalidInput.current = {
              ...globalInvalidInput.current,
              [indexRef]: (objInput?.['label'] + ' is required')
          }
        }
        else {
          // jika valid, maka kita hapus key nya dari globalInvalidInput (pesan di hide dari view)
          if (globalInvalidInput?.current?.[indexRef]) {
            delete globalInvalidInput.current[indexRef];
          }
        }
      }
      else if (objInput?.['type'] === 'number') {
        if (temp_value == null || temp_value.toString().trim() == "") {
          globalInvalidInput.current = {
              ...globalInvalidInput.current,
              [indexRef]: (objInput?.['label'] + ' is required')
          }
        }
        else {
          // jika valid, maka kita hapus key nya dari globalInvalidInput (pesan di hide dari view)
          if (globalInvalidInput?.current?.[indexRef]) {
            delete globalInvalidInput.current[indexRef];
          }
        }
      }
      else if (objInput?.['type'] === 'date') {
        let temp_value = objInputDate?.[objInput?.['name']];

        if (typeof temp_value === 'undefined' || temp_value === null) {
          globalInvalidInput.current = {
              ...globalInvalidInput.current,
              [indexRef]: (objInput?.['label'] + ' is required')
          }
        }
        else {
          if (globalInvalidInput?.current?.[indexRef]) {
            delete globalInvalidInput.current[indexRef];
          }
        }
      }
      else if (objInput?.['type'] === 'email') {
        let temp_value = objInputTextOthers?.[objInput?.['name']];

        if (typeof temp_value === 'undefined' || temp_value === '' || temp_value === null) {
          globalInvalidInput.current = {
              ...globalInvalidInput.current,
              [indexRef]: (objInput?.['label'] + ' is required')
          }
        }
        else {
          if (globalInvalidInput?.current?.[indexRef]) {
            delete globalInvalidInput.current[indexRef];
          }
        }
      }

    }
    else {
      // ** Not Required
      if (objInput?.['type'] === 'email') {
        let temp_value = objInputTextOthers?.[objInput?.['name']];

        if (typeof temp_value !== 'undefined' && temp_value !== '' && temp_value !== null) {
          if (!isEmail(temp_value)) {
            globalInvalidInput.current = {
                ...globalInvalidInput.current,
                [indexRef]: (objInput?.['label'] + ' is not valid email')
            }
          }
          else {
            if (globalInvalidInput?.current?.[indexRef]) {delete globalInvalidInput.current[indexRef];}
          }
        }
        else {
          if (globalInvalidInput?.current?.[indexRef]) {delete globalInvalidInput.current[indexRef];}
        }
      }
    }

    setInvalidInput({
      ...globalInvalidInput.current
    })
  }

  const isEmail = (value_input:string) => {
      
      if (value_input !== '' && value_input !== null) {
          let patt = /^([a-zA-Z0-9.,!#$%^&*\(\)]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){1,})$/gi
          let valid = patt.test(value_input);

          if (!valid){
              return false;
          }
          else {
              return true;
          }
      }
      else {
        return false;
      }

  }

  const setDataToFormData = (key:string, value:any) => {

    let value_rev:string;
    if (typeof value === 'object'){
        value_rev = JSON.stringify(value);
    }
    else {
      value_rev = value;
    }

    if (formDataRef && formDataRef.current === null)
    {
        formDataRef.current = new FormData();
        formDataRef.current.append(key, value_rev);
    }
    else if (formDataRef.current !== null)
    {

        const findKey = formDataRef.current.get(key);
        if (findKey !== null){

            formDataRef.current.set(key, value_rev)
        }
        else 
        {
            formDataRef.current.append(key, value_rev)
        }
    }
    

  }

  const changeControl = (index, save_key_name, obj_input:FormTemplateDataInputType, event?) => {

    let type_input = obj_input?.['type'] ?? null;
    if (type_input != null){

        if (type_input === 'text') {
          if (obj_input?.['save']?.['key_name']){

              let value_input = inputRefs[index].current.value;

              // simpan secara global pada form template
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: value_input === "" ? null : value_input
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined'){
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: value_input === "" ? null : value_input
                }
              }

              if (statusConfigFileUpload.current === true)
              {
                setDataToFormData('data', refDataChange.current);
              }

              // broadcast keluar form
              outDataChange_StatusProses.current = 'process_out_change';
              
              outDataChange({data:{...refDataChange.current},
                            data_with_key_edit:{...refDataEditChange.current},
                            posisi_name_input_when_onchange: obj_input?.['name'],
                            status_proses:'process_out_change'}
                          ,formDataRef.current)
              // outDataChange({
              //     ...refDataChange.current,
              //     [save_key_name]: value_input === "" ? null : value_input
              // })

          }
        }
        else if (type_input === 'email') {
          if (obj_input?.['save']?.['key_name']){

              let value_input = event.target?.value;

              let save_output:string|null = null;

              let checkIsEmail = isEmail(value_input);
              if (!checkIsEmail){
                save_output = null;
              }
              else {
                save_output = value_input;
              }

              setObjInputTextOthers(prev=>{
                return {
                    ...prev,
                    [obj_input?.['name']]: value_input
                }
              })

              // simpan secara global pada form template
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: save_output === "" ? null : save_output
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined'){
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: save_output === "" ? null : save_output
                }
              }

              if (statusConfigFileUpload.current === true)
              {
                setDataToFormData('data', refDataChange.current);
              }

              // broadcast keluar form
              outDataChange_StatusProses.current = 'process_out_change';
              
              outDataChange({data:{...refDataChange.current},
                            data_with_key_edit:{...refDataEditChange.current},
                            posisi_name_input_when_onchange: obj_input?.['name'],
                            status_proses:'process_out_change'}
                          ,formDataRef.current)

          }
        }
        else if (type_input === 'chips') {
          if (obj_input?.['save']?.['key_name']){

              let value_input = event.target?.value;
              // console.log(value_input)

              setObjInputTextOthers(prev=>{
                return {
                    ...prev,
                    [obj_input?.['name']]: value_input
                }
              })

              let save_output:string[]|string|null = null;
              const save_format_type = obj_input?.['save']?.['format']?.['type'];

              let edit_value:string|null = null;  // untuk parsing ke posisi edit (khusus untuk modal table)

              if (typeof save_format_type !== 'undefined' && save_format_type !== null) {
                if (save_format_type === 'array'){
                    save_output = [...value_input];
                    if (save_output.length === 0){
                          save_output = null;
                          edit_value = null;
                    } else {
                      edit_value = save_output.join(','); // jadikan string (eg: 'good,better')
                    }
                }
                else if (save_format_type === 'string') {
                  const save_format_join_sep = obj_input?.['save']?.['format']?.['join_separator'];
                  save_output = value_input.join(save_format_join_sep);
                  if (save_output === ""){
                    save_output = null;
                    edit_value = null;
                  }
                  else {
                    edit_value = value_input.join(save_format_join_sep);
                  }
                }
              }
              else {
                save_output = null;
                edit_value = null;
              }

              // simpan secara global pada form template
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: save_output ?? null
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined'){
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: edit_value ?? null
                }
              }

              if (statusConfigFileUpload.current === true)
              {
                setDataToFormData('data', refDataChange.current);
              }

              // broadcast keluar form
              outDataChange_StatusProses.current = 'process_out_change';
              
              outDataChange({data:{...refDataChange.current},
                            data_with_key_edit:{...refDataEditChange.current},
                            posisi_name_input_when_onchange: obj_input?.['name'],
                            status_proses:'process_out_change'}
                          ,formDataRef.current)

          }
        }
        else if (type_input === 'number') {
          if (obj_input?.['save']?.['key_name']){

            let value_input = event.target?.value;

            let value_toState:number|null = null;
            if (value_input) {
              let value_rep_thousand = value_input.replace(/\./g, '');
              let value_rep_dec = value_rep_thousand.replace(',', '.');
              let value_rep_zero = value_rep_dec.replace(/^-0$/, 0);

              let value_conv = parseFloat(value_rep_zero);
              console.log(value_conv)
              // simpan secara global pada form template
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: value_conv
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined'){
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: value_conv
                }
              }

              value_toState = value_conv;

            }
            else {
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: null
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined')
              {
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: null
                }
              }
              
              value_toState = null;
            }

            if (statusConfigFileUpload.current === true)
            {
              setDataToFormData('data', refDataChange.current);
            }

            setObjInputNumber(prev=>{
                return {
                    ...prev,
                    [obj_input?.['name']]: value_toState
                }
              })


            // broadcast keluar form
            outDataChange_StatusProses.current = 'process_out_change';
              
            outDataChange({data:{...refDataChange.current},
                          data_with_key_edit:{...refDataEditChange.current},
                          posisi_name_input_when_onchange: obj_input?.['name'],
                          status_proses:'process_out_change'}
                        ,formDataRef.current)

          }
        }
        else if (type_input === 'multi-select') {

          if (obj_input?.['save']?.['key_name']){
  
              let objSelected:any = [];
              let objSelected_Id:any = null;  // ambil id nya saja
              let objSelected_Name:any = null;  // ambil name (untuk refDataEditChange)
              if (event.value.length >= 1) {

                  if (obj_input?.['select_item_type'] === 'single'){

                    objSelected = [{...event.value[event.value.length-1]}];
                    objSelected_Id = objSelected[0]?.['id'] ?? null;
                    objSelected_Name = objSelected[0]?.['name'] ?? null;
                  }
                  else if (obj_input?.['select_item_type'] === 'multiple')
                  {
                    objSelected = [...event.value];

                    if (event.value.length > 1){
                      // jika lebih dari satu, maka output nya array ['Male','Female']
                      objSelected_Id = objSelected.map(item=>item?.['id']) ?? null;
                      objSelected_Name = objSelected.map(item=>item?.['name']) ?? null;
                    }
                    else if (event.value.length === 1){
                      // jika hanya satu, maka output nya string 'Male'
                      objSelected_Id = objSelected?.[0]?.['id'] ?? null;
                      objSelected_Name = objSelected?.[0]?.['name'] ?? null;
                    }
                    
                  }
              }
              else {
                objSelected = [];
                objSelected_Id = null;
              }

              // isi value sebelum pemeriksaan conditional_array 'prosesMultiSelect_whenOnChange'
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: objSelected_Id
              }

              if (obj_input?.type === 'multi-select')
              {
                  let edit_keyname = obj_input?.edit?.key_name;
                  let edit_keyvalue = obj_input?.edit?.key_value;
                  
                  if (typeof edit_keyname !== 'undefined' && 
                        typeof edit_keyvalue !== 'undefined')
                  {
                    if (edit_keyname === edit_keyvalue)
                    {
                        // jika nama key 'name' dan 'value' sama, maka hanya pakai satu key 'name' saja
                        refDataEditChange.current = {...refDataEditChange.current,
                                [edit_keyname]: objSelected_Id  // bisa string ('1') atau array jika multiple (['1',2','3'])
                        }
                    }
                    else {
                        // kondisi nama key 'name' dan 'value' berbeda, maka buat dua key dalam object
                        refDataEditChange.current = {...refDataEditChange.current,
                          [edit_keyname]: objSelected_Id,  // bisa string ('1') atau array jika multiple (['1',2','3'])
                          [edit_keyvalue]: objSelected_Name  // bisa string ('1') atau array jika multiple (['1',2','3'])
                        }
                    }
                  }
              }

              if (statusConfigFileUpload.current === true)
              {
                setDataToFormData('data', refDataChange.current);
              }

              // Proses Data API input-an tujuan (multi-select) yang lain ketika onchange 
              prosesMultiSelect_whenOnChange(objSelected_Id, obj_input, false);
              // ----
              
              temp_objSelectedMultiSelect.current = {
                ...temp_objSelectedMultiSelect.current,
                [index]: [...objSelected]
              }

              // di parsing ke attribute 'value' pada MultiSelect
              setObjSelected_MultiSelect(prev=>{
                return {
                  ...prev,
                  [index]: [...objSelected]
                }
              });

              outDataChange_StatusProses.current = 'process_out_change';

              outDataChange({data:{...refDataChange.current},
                data_with_key_edit:{...refDataEditChange.current},
                posisi_name_input_when_onchange: obj_input?.['name'],
                status_proses:'process_out_change'}
              ,formDataRef.current)

          }
        }
        else if (type_input === 'password') {
          if (obj_input?.['save']?.['key_name']){

            let value_input = event.target?.value;

              // simpan secara global pada form template
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: value_input === "" ? null : value_input
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined')
              {
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: value_input === "" ? null : value_input
                }
              }

              if (statusConfigFileUpload.current === true)
              {
                setDataToFormData('data', refDataChange.current);
              }

              setObjInputPassword(prev=>{
                return {
                    ...prev,
                    [obj_input?.['name']]: value_input
                }
              })

              // broadcast keluar form
              outDataChange_StatusProses.current = 'process_out_change';
              
              outDataChange({data:{...refDataChange.current},
                            data_with_key_edit:{...refDataEditChange.current},
                            posisi_name_input_when_onchange: obj_input?.['name'],
                            status_proses:'process_out_change'}
                          ,formDataRef.current)

          }
        }
        else if (type_input === 'input-switch') {
          if (obj_input?.['save']?.['key_name']){

            let value_input = event.value;

              // simpan secara global pada form template
              refDataChange.current = {
                ...refDataChange.current,
                [save_key_name]: value_input
              }

              let edit_keyname = obj_input?.edit?.key_name;
              if (typeof edit_keyname !== 'undefined')
              {
                refDataEditChange.current = {
                  ...refDataEditChange.current,
                  [edit_keyname]: value_input
                }
              }

              if (statusConfigFileUpload.current === true)
              {
                setDataToFormData('data', refDataChange.current);
              }

              setObjInputSwitch(prev=>{
                return {
                    ...prev,
                    [obj_input?.['name']]: value_input
                }
              })

              // broadcast keluar form
              outDataChange_StatusProses.current = 'process_out_change';
              
              outDataChange({data:{...refDataChange.current},
                            data_with_key_edit:{...refDataEditChange.current},
                            posisi_name_input_when_onchange: obj_input?.['name'],
                            status_proses:'process_out_change'}
                          ,formDataRef.current)

          }
        }
    }

      // console.log(index)
      // console.log(name)
      // console.log(event.target.value)

      // console.log(obj_input)
  }

  const prosesMultiSelect_whenOnChange = async(objSelectedId, obj_input:FormTemplateDataInputType, statusEdit:Boolean) => {

      // ** Nebeng Fungsi onChange multi select dan edit_data yang di render di awal

      // ** Fungsi untuk generate list data API khusus yang ada parameter dan type = 'deep-search'
      let obj_input_type = obj_input?.type;
      // let data_source_type = obj_input?.['data_source']?.['type'];
      // let data_source_fetching_type = obj_input?.['data_source']?.['fetching']?.['type'];
      let obj_on_change = obj_input?.['on_change'];  // harus ada untuk bisa di proses

      // *** validasi dahulu, jika tidak ada on_change, maka tidak diproses
      if (obj_input_type === 'multi-select') {

          // ** jika bukan berasal dari edit_data (yang di jalankan di awal render), maka baru diwajibkan harus ada 'on_change'
          // ** jika dari 'edit_data' tidak wajib ada on_change
          if (!statusEdit){
            if (!obj_on_change){
                return;
            }
          }
      }
      else {
        return;
      }

      // array tujuan input multi-select
      let to_arr_multi_select_name:string[] = [];

      if (!statusEdit){
        // ** jika bukan edit, maka yang di proses adalah tujuan input name nya waktu change
        to_arr_multi_select_name = obj_on_change?.['parse_value_to']?.['multi_select_name']
      }
      else {
        to_arr_multi_select_name = [obj_input?.['name']];
      }


      let statusInvalid:Boolean = false;
      to_arr_multi_select_name.forEach((input_name, index)=>{
          // check apakah ada input_name tujuan yang bersangkutan dan bertipe multi-select juga
          let findConfig = arrConfigInputRef.current.find(item=>item?.['name'] === input_name);
          if (!findConfig){
              // jika tidak ada, maka return
              toastProsesRef?.current.show({severity:'error', summary: 'Error'
                , detail:`Input Name Multi Select bernama '${input_name}' tidak ada !'  !`, life:2000});

              statusInvalid = true
              // return
          }
          else if (findConfig){
            // jika ada, check apakah type input tujuan nya adalah 'multi-select'
            if (findConfig?.['type'] !== 'multi-select'){

              toastProsesRef?.current.show({severity:'error', summary: 'Error'
                , detail:`Input Name '${input_name}' bukan ber-tipe 'Multi-Select' !`, life:2000});

              statusInvalid = true
              // return
            }
          }
      })

      if (statusInvalid){
        return;
      }

      
      // ** periksa apakah semua conditional_array untuk 'from_multi_select' sudah ada data dari sumber nya.
      // ** jika salah satu key data belum terisi, maka proses tidak dapat dilanjutkan

      const checkAll_ConditionArray_FromMultiSelect = (name_tertuju, obj:any, arrNameInvalid, arrNameDataNotComplete) => {
          // ** name_tertuju tidak boleh sama dengan name dirinya sendiri yang ada di conditional_array -> type:'from_multi_select'
            // alert(JSON.stringify(data_source_fetching_filter))
            Object.entries(obj).forEach(([k,v], index)=>{
                if (k === 'type' && v === 'from_multi_select'){

                    let source_input_name = obj?.['input_name']; // dari conditional_array

                    if (source_input_name === name_tertuju){
                      toastProsesRef?.current.show({severity:'error', summary: 'Error'
                        , detail:`Name yang dituju '${name_tertuju}' tidak boleh sama dengan Name pada conditional_array ber-tipe 'from_multi_select' !`, life:2000});

                        arrNameInvalid.push(source_input_name)
                        return;
                    }
                    else {
                      // *** check apakah 'input_name' sumber nya ada di arrConfigInputRef
                      let findSourceInputName = arrConfigInputRef.current.find((item, index)=>item?.['name'] === source_input_name);
                      if (!findSourceInputName){

                          toastProsesRef?.current.show({severity:'error', summary: 'Error'
                            , detail:`Name sumber input '${source_input_name}' tidak ada pada Konfigurasi !`, life:2000});
    
                            arrNameInvalid.push(source_input_name)
                            return;
                      }
                      else {
                          // jika ada input-an nya, maka check apakah data nya sudah terisi pada refDataChange
                          let save_key_name = findSourceInputName?.['save']?.['key_name'];
                          let data_content = refDataChange.current?.[save_key_name];

                          if (typeof data_content === 'undefined' || data_content === null || data_content === ''){
                            arrNameDataNotComplete.push(source_input_name);
                          }

                      }
                    }
                }
                else if (typeof v === 'object'){
                  checkAll_ConditionArray_FromMultiSelect(name_tertuju, v, arrNameInvalid, arrNameDataNotComplete);
                }
            })
      }
      // ----

      // ** fungsi melengkapi parameter url dengan value terkait
      const collect_param_url = (url:string|null, param_obj:any, statusEdit:Boolean):string|null => {

          let isInvalid:Boolean = false;

          if (Object.keys(param_obj).length > 0){

            let url_final_rev:string|null = url;

            for (let [k_param, v_param] of Object.entries(param_obj)){

                let param_type = v_param?.['type'];
                let param_input_name = v_param?.['input_name'];

                let findConfig = arrConfigInputRef.current.find(item => item?.['name'] === param_input_name);
                if (!findConfig){

                    toastProsesRef?.current.show({severity:'error', summary: 'Error'
                      , detail:`Name sumber input '${param_input_name}' tidak ada pada Konfigurasi !`, life:2000});
                      
                    isInvalid = true;
                }
                else {

                    // *** jika salah satu param saja nilai nya null, maka stop looping

                    let save_key_name = findConfig?.['save']?.['key_name'];
                    let edit_key_name:any = findConfig?.['edit']?.['key_name'];

                    let get_data = null;
                    if (!statusEdit){
                        get_data = refDataChange.current?.[save_key_name] ?? null;
                      }
                    else {
                        get_data = edit_data?.[edit_key_name] ?? null;
                    }

                    if (get_data === null){
                        isInvalid = true; 
                        break;
                    }
                    else if (get_data !== ""){

                        // jika data ada, replace ke url asli nya.
                        let key_param_str:string = "{" + k_param + "}";

                        let patt_url_param = new RegExp(`${key_param_str}`, 'gi')

                        if (url_final_rev !== null){

                            let test_url_param = patt_url_param.test(url_final_rev);
                            if (test_url_param){
                              url_final_rev = url_final_rev.replace(patt_url_param, get_data);
                            }
                            else {
                              toastProsesRef?.current.show({severity:'error', summary: 'Error'
                                , detail:`Parameter '${k_param}' tidak ada pada URL API !`, life:2000});
                      
                              isInvalid = true;
                            }

                            // let tess2 = "abcd woorld";
                            // let reptess2 = tess2.replace(/woorld/gi, "\\$&");  // output: "abcd \woorld" (escape)
                            // alert(reptess2)
                        }
                    }
                }
            }

            if (isInvalid) return null;

            return url_final_rev;

          }
          else {
            return url;
          }
          
      }
      // --- end function collect_param_url
    

      // ** Proses Value yang ter-select
      let arrId:any[] = [];
      let arrId_Join:any;
      if (typeof objSelectedId === 'string'){
        arrId = [objSelectedId];
      } else if (Array.isArray(objSelectedId)){
        arrId = [...objSelectedId];
      }

      if (arrId.length > 0) {
        arrId_Join = arrId.join(','); // hasil -> 'cnbc,jpnn'
        // alert(JSON.stringify(obj_input))
      }
      else {
        arrId_Join = null
        // alert('masuk')
      }


       // ** Looping semua tujuan input multi-select (berasal dari on_change -> parse_value_to sumber)
      //  to_arr_multi_select_name.forEach((item, index)=>{
       for (const item of to_arr_multi_select_name){

            let findObjInputName = arrConfigInputRef.current.find((subitem, index)=>subitem?.['name'] === item);
        
            if (findObjInputName){

                let index_input = findObjInputName?.['index'];
                let label = findObjInputName?.['label'];
                let datasource_fetching_filter = findObjInputName?.['data_source']?.['fetching']?.['filter'];
                let datasource_fetching_type = findObjInputName?.['data_source']?.['fetching']?.['type'];
                let datasource_param = findObjInputName?.['data_source']?.['param'];
                let datasource_url = findObjInputName?.['data_source']?.['url'] ?? null;
                let datasource_key_id = findObjInputName?.['data_source']?.['key_id'];
                let datasource_key_name = findObjInputName?.['data_source']?.['key_name'];
                let save_key_name = findObjInputName?.['save']?.['key_name'];
                
                let arrNameInvalid:any[] = [];
                let arrNameDataNotComplete:any[] = [];

                // ** findObjInputName?.['name'] -> nama yang di tuju;
                // ** validasi juga untuk nama yang dituju tidak boleh sama dengan conditional_array type 'from_multi_select'
                checkAll_ConditionArray_FromMultiSelect(findObjInputName?.['name'], datasource_fetching_filter, arrNameInvalid, arrNameDataNotComplete);

                // alert(JSON.stringify(arrNameDataNotComplete))

                // jika semua input-an sudah valid
                if (arrNameInvalid.length === 0){
                
                  // jika semua value terisi
                  if (arrNameDataNotComplete.length === 0){
                  
                      objDataMultiSelectRef.current = {
                        ...objDataMultiSelectRef.current,
                        [index_input]: []
                      }

                       // ** kosongkan selected tujuan input dahulu
                      temp_objSelectedMultiSelect.current = {
                        ...temp_objSelectedMultiSelect.current,
                        [index_input]: []
                      }

                      // Update output value tujuan untuk save
                      refDataChange.current = {
                        ...refDataChange.current,
                        [save_key_name]: null
                      }

                      // ** jika valid, maka lanjut fetching api
                      let url_final:string|null = null;
                      if (!datasource_param){
                        // ** jika tidak ada parameter pada url, maka langsung pakai url
                        url_final = datasource_url;
                      }
                      else {
                        // alert(JSON.stringify(datasource_param))
                        url_final = collect_param_url(datasource_url, datasource_param, statusEdit);
                        
                        if (url_final === null){
                          continue;
                        }
                        // ** jika ada parameter, maka harus di lengkapi dahulu
                        // url_final = datasource_url;
                      }


                      let data = await PPE_getApiSync(`${url_final}`
                                    ,null,'application/json','GET'
                                  ,null, true);

                      let status_api:number = data?.['http']?.['response']?.['status'];
                      let result_api:any = data?.['result'];

                      if (typeof status_api !== 'undefined' && status_api === 200){

                        if (datasource_fetching_type === 'deep-search') {
                          
                              let arr_final_data:any[] = [];
                              fetchingApi_GetDataArray(result_api, datasource_fetching_filter, arr_final_data, false);

                              // *** Data output ambil index ke-0 karena pakai push yang ada saling dependensi
                              if ((arr_final_data?.[0] ?? []).length > 0) {
                                
                                let result_map:any[] = arr_final_data[0].map((item, index)=>{
                                    return{
                                      'id':item?.[datasource_key_id],
                                      'name':item?.[datasource_key_name]
                                    }
                                })
                                // alert(JSON.stringify(result_map,null,2))
            
                                // simpan hasil data array ke dalam 'objDataMultiSelectRef'
                                objDataMultiSelectRef.current = {
                                  ...objDataMultiSelectRef.current,
                                  [index_input]: [...result_map]
                                }
            
                                // alert(JSON.stringify(result_map, null, 2))
                                // console.log("Data API")
                                // console.log(result_api)
                              }

                        }
                        else if (datasource_fetching_type === 'array-direct') {
  
                            if (result_api.length > 0) {
                              
                              let result_map:any[] = result_api.map((item, index)=>{
                                  return{
                                    'id':item?.[datasource_key_id],
                                    'name':item?.[datasource_key_name]
                                  }
                              })
      
                              // simpan hasil data array ke dalam 'objDataMultiSelectRef'
                              objDataMultiSelectRef.current = {
                                ...objDataMultiSelectRef.current,
                                [index_input]: [...result_map]
                              }
      
                              // alert(JSON.stringify(result_map, null, 2))
                              // console.log("Data API")
                              // console.log(result_api)
                            }
                        }


                      }
                      // --- end fetching api berhasil
                      else {
                        toastProsesRef?.current.show({severity:'error', summary: 'Error'
                          , detail:`Data API '${label}' bermasalah dengan Status Code '${status_api}'  !`, life:2000});
                      }

                      // setObjDataMultiSelect({...objDataMultiSelectRef.current});
                    
                  }
                  else {

                    // jika data tidak ada yang ter-pilih, maka kosongkan semua list input tujuan
                    
                    if (arrId_Join === null){

                        // simpan hasil data array ke dalam 'objDataMultiSelectRef'
                        objDataMultiSelectRef.current = {
                          ...objDataMultiSelectRef.current,
                          [index_input]: []
                        }

                        temp_objSelectedMultiSelect.current = {
                          ...temp_objSelectedMultiSelect.current,
                          [index_input]: []
                        }

                        refDataChange.current = {
                          ...refDataChange.current,
                          [save_key_name]: null
                        }

                        // return
                    }
                    
                  }
                }
                // alert(JSON.stringify(arrNameInvalid))
            }
            
            // alert(JSON.stringify(to_arr_multi_select_name))
            // alert(JSON.stringify(arrSimpan));

      //  })
        }

        setObjDataMultiSelect({...objDataMultiSelectRef.current});
        setObjSelected_MultiSelect({...temp_objSelectedMultiSelect.current}); // multi-select
      
  }


  const checkIsDateFormat = (date:string|number|null, sourceformatParam:FormatDateFormTemplate) => {
    // contoh date (string) : '2024-01-01', '1 Jan 2024', '1 Januari/January 2024', '1/1/2024' (dd/mm/yyyy)
    // contoh date (number) : 1733763600000 (miliseconds)

    if (date === null) {
      return {valid_date: false, date:null};
    }

    let arrMonthName = {"jan":1,"januari":1,"january":1, "feb":2,"february":2,"februari":2
                        ,"mar":3,"march":3,"maret":3, "apr":4,"april":4
                        ,"mei":5,"may":5
                        ,"jun":6,"june":6,"juni":6
                        ,"jul":7,"july":7,"juli":7
                        ,"agt":8,"aug":8,"august":8,"agustus":8
                        ,"sep":9,"sept":9,"september":9
                        ,"okt":10,"oct":10,"oktober":10,"october":10
                        ,"nov":11,"nop":11,"november":11,"nopember":11
                        ,"dec":12,"des":12,"december":12,"desember":12
                      }

    if (typeof date === 'string') {

      if (sourceformatParam === 'dd MMMM yyyy') {

          let pat = /^(\d+)\s*([a-zA-Z]+)\s*(\d+)$/i;
          let val = date;
          let test_date = pat.test(val);

          if (!test_date) {
            // bukan date yang valid
            return {valid_date: false, date:null};
          }
          else {

            // data keseluruhan length = 4,
            // eg -> [0] -> 01 Mei 2024, [1] -> 01, [2] -> Mei, [3] -> 2024
            let exec_date = pat.exec(val);

            if (exec_date !== null && exec_date.length === 4) {
              
              let tanggal_convert = new Date(`${exec_date[3].toString() + '-' + arrMonthName[exec_date[2].toLowerCase()].toString() + '-' + exec_date[1].toString()}`); // eg: 2024-01-01
              
              try{

                if (tanggal_convert.toString() === 'Invalid Date') {
                  return {valid_date: false, date: null}
                } else {
                  return {valid_date: true, date: tanggal_convert}
                }

              }catch(e){
                  return {valid_date: false, date: null}
              }

              // console.log(tanggal_convert);
              // console.log(format(tanggal_convert, 'dd/MMMM/yyyy, DDD dd EEE EEEE')); // 'EEE' -> Sun, Mon; 'EEEE' -> Monday
            }
          }

      }
      else if (sourceformatParam === 'yyyy-MM-dd') {
        
          let pat = /^(\d+)-(\d+)-(\d+)$/i;
          let val = date;
          let test_date = pat.test(val);

          if (!test_date) {
            // bukan date yang valid
            return {valid_date: false, date:null};
          }
          else {
            // data keseluruhan length = 4,
            // eg -> [0] -> 01 Mei 2024, [1] -> 01, [2] -> Mei, [3] -> 2024
            let exec_date = pat.exec(val);
            
            if (exec_date !== null && exec_date.length === 4) {
              
              // console.log(exec_date?.[0])
              
              try {
                  let tanggal_convert = new Date(exec_date?.[0]);

                  if (tanggal_convert.toString() === 'Invalid Date') {
                    return {valid_date: false, date: null}
                  } else {
                    return {valid_date: true, date: tanggal_convert}
                  }
              }
              catch(e) {
                  return {valid_date: false, date: null}
              }
              
              
            }
          }
      }

    }

  }

  const dateChangePeriod = (savekeyname, index, obj_input:FormTemplateDataInputType, date) => {
    
      // let isDateTemp = checkIsDateFormat('31 aug 2024', 'dd MMMM yyyy');
      // console.log(isDateTemp)
      // let isDateTemp2 = checkIsDateFormat('2024-10-15', 'yyyy-mm-dd');
      // console.log(isDateTemp2)
    
      // simpan secara global pada form template
      refDataChange.current = {
        ...refDataChange.current,
        [savekeyname]: date != null && date != "" ? format(date, obj_input?.['save']?.['format']) : null
      }

      const edit_keyname = obj_input?.edit?.key_name;
      let edit_value:string|null = null;

      let edit_format = '';
      if (obj_input?.type === 'date'){

        edit_format = obj_input?.edit?.format ?? '';

        if (edit_format !== ''){

            edit_value = format(date, edit_format);

            if (typeof edit_keyname !== 'undefined')
            {
              refDataEditChange.current = {
                ...refDataEditChange.current,
                [edit_keyname]: date != null && date != "" ? format(date, edit_format) : null
              }
            }
        }
      }


      // broadcast keluar form

      outDataChange_StatusProses.current = 'process_out_change';

      outDataChange({data:{...refDataChange.current},
        data_with_key_edit:{...refDataEditChange.current},
        posisi_name_input_when_onchange: obj_input?.['name'],
        status_proses:'process_out_change'}
      ,formDataRef.current)

      // kumpulan input-an type 'date' by name
      setObjInputDate(prev=>{
        return {
            ...prev,
            [obj_input?.['name']]: date
        }
      })

      // tampilkan message error jika date = null
      if (obj_input?.['required']) {
        // alert('masuk')
        if (date === null){
          globalInvalidInput.current = {
              ...globalInvalidInput.current,
              [index]: (obj_input?.['label'] + ' is required')
          }
        }
        else {
          if (globalInvalidInput?.current?.[index]) {
            delete globalInvalidInput.current[index];
          }
        }
        setInvalidInput({
          ...globalInvalidInput.current
        })
      }

  }

  const checkAllInvalidInput = () => {
    let arr_temp_config_inputs:FormTemplateDataInputType[] = [...arrConfigInputRef.current];

    for (let temp_config_input of arr_temp_config_inputs) {
      
      let temp_required = temp_config_input?.required;
      let temp_type = temp_config_input?.type;
      let temp_name = temp_config_input?.name;
      let temp_label = temp_config_input?.label;
      let temp_index = temp_config_input?.['index'];

      if (temp_required) {
        if (temp_type === 'text') {
          
            let temp_value = inputRefs?.[temp_index].current.value;

            if (temp_value === null || temp_value.toString().trim() === '') {
                globalInvalidInput.current = {
                    ...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }

        }
        else if (temp_type === 'number') {
          
            let temp_value = objInputNumber?.[temp_name];

            if (typeof temp_value === 'undefined' || temp_value === null || temp_value.toString().trim() === '') {
                globalInvalidInput.current = {
                    ...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }

        }
        else if (temp_type === 'fileupload-image-single') {

            let temp_value = objFileUpload?.[temp_name];

            if (typeof temp_value === 'undefined' || temp_value === null || temp_value.toString().trim() === '') {
                globalInvalidInput.current = {
                    ...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }

        }
        else if (temp_type === 'email' || temp_type === 'chips') {
          
            let temp_value = objInputTextOthers?.[temp_name];

            if (
                  (Array.isArray(temp_value) && temp_value.length === 0) ||
                  ((typeof temp_value === 'undefined' || temp_value === null || temp_value.toString().trim() === '')) 
                )
            {
                globalInvalidInput.current = {...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }

        }
        else if (temp_type === 'password') {
          
            let temp_value = objInputPassword?.[temp_name];

            if (typeof temp_value === 'undefined' || temp_value === null || temp_value === '') {
                globalInvalidInput.current = {
                    ...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }

        }
        else if (temp_type === 'date') {

            let temp_value = objInputDate?.[temp_name];

            if (typeof temp_value === 'undefined' || temp_value === null) {

                globalInvalidInput.current = {
                    ...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }
        }
        else if (temp_type === 'multi-select') {
          
            let temp_value = objSelected_MultiSelect?.[temp_index];

            if (typeof temp_value === 'undefined' || temp_value === null || temp_value.length === 0) {

                globalInvalidInput.current = {
                    ...globalInvalidInput.current,
                    [temp_index]: temp_label + ' is required'
                }
            }
            else {
              delete globalInvalidInput.current?.[temp_index];
            }
        }
      }


      if (temp_type === 'email') {
          
        let temp_value = objInputTextOthers?.[temp_name];

        if (typeof temp_value !== 'undefined' && temp_value !== null && temp_value.toString().trim() !== '') 
        {
            if (isEmail(temp_value) === false) {
              globalInvalidInput.current = {...globalInvalidInput.current,
                  [temp_index]: temp_label + ' is not valid email'
              }
            }
            else {
              delete globalInvalidInput.current?.[temp_index]
            }
        }
      }
      
    }

    setInvalidInput({
      ...globalInvalidInput.current
    });

    return arr_temp_config_inputs;
  }

  const handleProses = (type:'save'|'cancel') => {

    if (type === 'cancel'){

      // // set Loading Icon
      // setStatusLoadingProses(prev=>{
      //   return {
      //     ...prev,
      //     cancel: true
      //   }
      // })

      // // disabled semua input
      // setObjDisabledForProses(prev=>{
      //   let temp = Object.fromEntries(
      //                 Object.entries({...prev}).map((obj, idx)=>[obj?.[0], true])
      //             );
      //   return {...temp};
      // })

      // setTimeout(()=>{
      //   setStatusLoadingProses(prev=>{
      //     return {
      //       ...prev,
      //       cancel: false
      //     }
      //   })

      //   // ke kondisi semula disabled semua input
      //   setObjDisabledForProses(prev=>{
      //     let temp = Object.fromEntries(
      //                   Object.entries({...prev}).map((obj, idx)=>[obj?.[0], false])
      //               );

      //     return {...temp};
      //   })
        
      // },1000)

    }
    else if (type === 'save'){

      // Periksa semua input apa ada yang invalid
      let result_required = checkAllInvalidInput();

      // jika terdapat yang tidak valid, maka tidak diteruskan
      if (Object.keys(globalInvalidInput.current).length > 0){

        toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:'Periksa Validitas Input', life:2000});
        // alert(JSON.stringify(result_required));

        return;
      }
      else {

          // *** Proses Valid Input

          // set Loading icon
          setStatusLoadingProses(prev=>{
            return {
              ...prev,
              save: true
            }
          })

          // disabled semua input
          setObjDisabledForProses(prev=>{
            let temp = Object.fromEntries(
                          Object.entries({...prev}).map((obj, idx)=>[obj?.[0], true])
                      );

            return {...temp};
          })

          setTimeout(()=>{
            setStatusLoadingProses(prev=>{
              return {
                ...prev,
                save: false
              }
            })
    
            // ke kondisi semula disabled semua input
            setObjDisabledForProses(prev=>{
              let temp = Object.fromEntries(
                            Object.entries({...prev}).map((obj, idx)=>[obj?.[0], false])
                        );
    
              return {...temp};
            })
    
          },1000)

      }

      
    }
  }

  const fetchingApi_GetDataArray = (paramObj:any, filter:any, arrFinalData:any[], statusEdit:boolean) => {
    
      // paramObj -> Data Object / Array

      // let arr_final_data:any[] = [];
      // alert(JSON.stringify(paramObj,null,2))
    
      let indicator_key = filter?.['indicator_key']; 
      let conditional_array = filter?.['conditional_array']; 
      let filter_additional = filter?.['filter']; 

      if (typeof paramObj === 'undefined' || paramObj === null){
        return
      }

      Object.entries(paramObj).forEach(([k,v], index)=>{

          if (k === indicator_key){
            // value yang diproses adalah object atau array
            // untuk return, hanya value yang bertipe array tidak boleh object

            if (typeof v === 'object'){

                // cari key yang sama dengan indicator_key

                // variabel final tipe array
                let v_temp:any;
                if (Array.isArray(v)){
                  v_temp = [...v];
                } else {
                  v_temp = {...v}
                }
                // ...

                if (conditional_array){
                  // Filter Kondisi array
                  if (Array.isArray(v_temp)){

                      v_temp = v_temp.filter((item, index_temp)=>{

                            let temp_str_if:string = '';
                            
                            // looping semua key dalam additional_array;
                            Object.entries(conditional_array).forEach(([k_con, v_con], index_con)=>{
                                
                                // jika 'key' ada di dalam object, baru di proses
                                if (item?.[k_con]){
                                  if (v_con?.['type'] === 'equals_to'){
                                      if (v_con?.['value']?.['type'] === 'hardcode'){
  
                                          let content = v_con?.['value']?.['content'];
                                          temp_str_if += "&&" + (content === (item?.[k_con] ?? false)).toString()
                                      }
                                      else if (v_con?.['value']?.['type'] === 'from_multi_select'){

                                          let from_input_name = v_con?.['value']?.['input_name'];
                                          let findObjInputName = arrConfigInputRef.current.find((subitem, index)=>subitem?.['name'] === from_input_name);
                                          if (findObjInputName){
                                            let save_key_name = findObjInputName?.['save']?.['key_name'];
                                            let edit_key_name:any = findObjInputName?.['edit']?.['key_name'];
                                            
                                            let getData:any = null;
                                            if (!statusEdit){
                                              getData = refDataChange.current?.[save_key_name] ?? null;
                                            }
                                            else {
                                              getData = edit_data?.[edit_key_name] ?? null;
                                            }

                                            if (Array.isArray(getData) && getData !== null){
                                              // jika array, maka di gabung jadi satu string, contoh : 'cnbc,jpnn'
                                              getData = getData.join(',');
                                            }

                                            temp_str_if += "&&" + (getData === (item?.[k_con] ?? false)).toString()
                                          }

                                      }
                                  }
                                }
                            })
                            if (temp_str_if.startsWith("&&")){
                              temp_str_if = temp_str_if.slice(2);
                              if (eval(temp_str_if)){
                                return true;
                              }
                            }

                            return false;
                      })

                  }
                }

                if (!filter_additional){
                  if (Array.isArray(v_temp)){

                    // alert(JSON.stringify(v_temp,null,2))
                    // arr_final_data = [...v_temp];
                    // arrFinalData.push(v_temp);
                    arrFinalData.push(v_temp);  // saling dependensi
                    // return [...arrFinalData];
                  }
                  else {
                    // wajib harus array saja,
                    // jika object, return nya array kosong
                    // return [];
                  }
                }
                else {
                  // alert(JSON.stringify(v_temp))
                  fetchingApi_GetDataArray(v_temp, filter_additional, arrFinalData, statusEdit);
                }
            }
          }
          else {
            // jika tidak sama, maka hanya v yang bertipe object dan array yang di proses
            if (typeof v === 'object'){
              fetchingApi_GetDataArray(v, filter, arrFinalData, statusEdit);
            }
          }
          
      })
      
      // alert(JSON.stringify(arr_final_data))
      // return arr_final_data;
      // alert(JSON.stringify(arrFinalData))
      // return arrFinalData;

  }

  const fetchingApi_MultiSelect = async(objConfigApi:any) => {

      // ** hanya dijalankan pada kondisi awal
      
      // objConfigApi -> {0: {type:..., id:..., name:...}}  // kumpulan config yang hanya multi-select dengan tipe 'api'

      if (Object.keys(objConfigApi).length > 0){

        // looping index input yang multi-select punya config 'api'
        for (let [index_input, v] of Object.entries(objConfigApi)){

            let data_source = v?.['data_source'];
            let name_input = v?.['name'];
            let filter = data_source?.['fetching']?.['filter'] ?? null;
            let key_id = data_source?.['key_id'];
            let key_name = data_source?.['key_name'];
            let datasource_type = data_source?.['type'];  // hardcode atau api

            // hanya khusus yang tidak ada parameter di url
            if (!data_source?.['param']) {

              if (datasource_type === 'api'){
                

                // *** yang di fetching api nya yang tidak ada parameter api dan conditional array nya 'from_multi_select'
                if (!data_source?.['param'] && 
                  !checkKeyValueExists(filter, 'type', 'from_multi_select')
                ) {

                  
                  let fetching_type = data_source?.['fetching']?.['type'];
  
                  let url_api = data_source?.['url'] ?? null;
      
                  // let data = await PPE_getApiSync('https://api-berita-indonesia.vercel.app/'
                  let data = await PPE_getApiSync(`${url_api}`
                                ,null,'application/json','GET'
                              ,null, true);
  
                  let status_api:number = data?.['http']?.['response']?.['status'];
                  let result_api:any = data?.['result'];
                  
  
                  if (typeof status_api !== 'undefined' && status_api === 200){
  
                    // if (name_input === 'name_topic'){ // sementara dulu, nanti hapus
                    
                    if (fetching_type === 'deep-search') {
  
                      let arr_final_data:any[] = [];
                      fetchingApi_GetDataArray(result_api, filter, arr_final_data, false);
      
                      // console.log(index_input + ' -> ' + JSON.stringify(arr_final_data[0],null,2))
      
                      // *** Data output ambil index ke-0 karena pakai push yang ada saling dependensi
                      if ((arr_final_data?.[0] ?? []).length > 0) {
                        
                          let result_map:any[] = arr_final_data[0].map((item, index)=>{
                              return{
                                'id':item?.[key_id],
                                'name':item?.[key_name]
                              }
                          })
      
                          // simpan hasil data array ke dalam 'objDataMultiSelectRef'
                          objDataMultiSelectRef.current = {
                            ...objDataMultiSelectRef.current,
                            [index_input]: [...result_map]
                          }
      
                          // alert(JSON.stringify(result_map, null, 2))
                          // console.log("Data API")
                          // console.log(result_api)
                        }
                    }
                    else if (fetching_type === 'array-direct') {
  
                        if (result_api.length > 0) {
                          
                          let result_map:any[] = result_api.map((item, index)=>{
                              return{
                                'id':item?.[key_id],
                                'name':item?.[key_name]
                              }
                          })
  
                          // simpan hasil data array ke dalam 'objDataMultiSelectRef'
                          objDataMultiSelectRef.current = {
                            ...objDataMultiSelectRef.current,
                            [index_input]: [...result_map]
                          }
  
                          // alert(JSON.stringify(result_map, null, 2))
                          // console.log("Data API")
                          // console.log(result_api)
                        }
                    }
                    // }
  
                  }
                  else {
                    toastProsesRef?.current.show({severity:'error', summary: 'Error'
                              , detail:`Data API '${v?.['label']}' bermasalah dengan Status Code '${status_api}'  !`, life:2000});
                  }
                  // --- bagian LOGIC REKURSIF ---
                }
              }
            }
        }

        // set ke state untuk tampil di view multi-select
        setObjDataMultiSelect({...objDataMultiSelectRef.current});

      }

  }

  const checkKeyValueExists_DeepSearch = (obj:any, paramKey:any, paramValue:any, output?:Boolean[]) => {
    
    Object.entries(obj).forEach(([k,v], index)=>{
      // contoh -> if (k === 'type' && v === 'from_multi_select'){
      if (k === paramKey && v === paramValue){
        output?.splice(0,1,true);
        return true;
      }
      else if (typeof v === 'object'){
        checkKeyValueExists_DeepSearch(v, paramKey, paramValue, output);
      }
    })
  }

  const checkKeyValueExists = (obj:any, paramKey, paramValue) => {

      let varTempBool:any[] = [false];
      checkKeyValueExists_DeepSearch(obj, paramKey, paramValue, varTempBool);

      if (varTempBool.length > 0){
        return varTempBool[0];
      }
      else {
        return false;
      }
      // alert(JSON.stringify(varTempBool,null,2))
  }

  const getDataApi = async() => {

    // check apakah dalam suatu object terdapat key dan value tertentu,
    // misal : type = 'from_multi_select'
    let data = {
      indicator:'ind',
      conditional:{
        'gender':{type:'equals_to', value:{type:'hardcode',content:'male'}},
        'topic':{type:'equals_to', value:{type:'from_multi_select',input_name:'kelamin'}}
      },
      arr:["male","female"]
    }

    // console.log("JSON.stringify(data)")
    // console.log("\"" + JSON.stringify(data).replaceAll(/\"/g, "\\\"") + "\"")

    // alert(checkKeyValueExists(data,'type','equals_to'));

    
    // contoh data rekursif configurasi filter
      // const tesrekurint:FormTemplate_ConfigFilterRekursif = {
      //   status:'active',
      //   conditional:'halo-1',
      //   filter:{
      //     conditional:'subhalo-1-1',
      //     status:'active',
      //     filter:{
      //       conditional:'subhalo-1-1-1',
      //       status:'active'
      //     }
      //   }
      // }

      // alert(JSON.stringify(tesrekurint))


    // --- CORS localhost
    // let data = await PPE_getApiSync('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json'
    // let data = await PPE_getApiSync('https://alamat.thecloudalert.com/api/provinsi/get/'
    // let data = await PPE_getApiSync('https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=171'
    // let data = await PPE_getApiSync('https://ibnux.github.io/data-indonesia/provinsi.json'
    // ---

    // let data = await PPE_getApiSync('https://api-berita-indonesia.vercel.app/'
    // let data = await PPE_getApiSync('https://api-berita-indonesia.vercel.app/antara/terbaru'
    //             ,null,'application/json','GET'
    //           ,null)
    // alert(JSON.stringify(data))
  }


  const fileUploadSingle_Select = (event, index) => {
  
    const file = event.files;

    console.log("On SELECT----")
    console.log(file)
  }
  
  const convertSizeToUnit = (size:number, decimal:number = 3) => {

    const unit = ['B', 'KB', 'MB', 'GB', 'TB'];
    const calc = Math.log(size) / Math.log(1024);

    if (Math.floor(calc) < unit.length){

      const unit_pos = Math.floor(calc);
      const unit_size = unit[unit_pos];

      const decimal_thousand = Math.pow(10, decimal);  // 10^3 = 1000

      const final_count = Math.round((size / Math.pow(1024, unit_pos)) * decimal_thousand) / decimal_thousand;  // ambil 2 decimal
      
      return {size: final_count, unit: unit_size};
    }
    else {
      return null;
    }

    
  }

  const customUploadSingleFileHandler = (event, index, obj_input:FormTemplateDataInputType) => {

    if (obj_input['type'] === 'fileupload-image-single'){
        const file = event.files[0];
        if (inputRefs?.[index]){
          // ** Hapus dulu file sebelumnya
          inputRefs[index].current.clear();
        }
    
        if (file){
          
          // *** Validasi apakah ekstensi yang dimasukkan sudah sesuai dengan file terpilih
          let config_format_type = obj_input?.format?.type;
          if (config_format_type === 'Document'){
              // let arrCheckExt:UploadFormatExtensionDocument[] = ['.csv','.doc','.docx','.ppt','.pptx','.txt','.xls','.xlsx'];
              let final_ext = convertDocumentExtTypeShort(file.type);
              if (final_ext === null){
                toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`Extension '${file.type}' Tidak Valid untuk '${obj_input?.['label']}' !`, life:2000});
                return
              }
              else {
              
                let config_format_ext = obj_input?.format?.ext as UploadFormatExtensionDocument[]; // .csv, .doc, ...
                if (config_format_ext.length > 0){
                      
                      if (!config_format_ext.includes(final_ext)) {

                        toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`Extension '${file.type}' Tidak Valid untuk '${obj_input?.['label']}' !`, life:2000});
                        return
                      }
                }

              }
          }
          else if (config_format_type === 'Image'){
            let checkImage = (file.type).startsWith('image/');
    
            if (!checkImage){
              toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`Extension '${file.type}' Tidak Valid untuk '${obj_input?.['label']}' !`, life:2000});
              return
            }
            else {
    
              let config_format_type = obj_input?.format?.type; // Document or Image
              
              if (config_format_type === 'Image') {

                  let config_format_ext = obj_input?.format?.ext; // .jpg, .jpeg, .png, ...
                  if (config_format_ext !== 'image/*') {

                    if (Array.isArray(config_format_ext) && config_format_ext.length > 0){
  
                      // let arrCheckExt:UploadFormatExtensionImages[] = ['.apng','.avif','.bmp','.dib','.gif','.heic','.heif','.ico','.jfif','.jpeg','.jpg','.pjp','.pjpeg','.png','.svg','.svgz','.tif','.tiff','.webp','.xbm'];

                      // *** pastikan bahwa 'config_format_ext' untuk data nya di convert dalam 'UploadFormatExtensionImages'
                      let arr_config_format_type = config_format_ext as UploadFormatExtensionImages[];
                      if (arr_config_format_type.length > 0) {

                        let get_ext_selected_file = ('.' + file.type.toString().replace('image/','')) as UploadFormatExtensionImages;  // jpg, png .., bisa jadi ada ekstensi yang tidak ada dalam 'UploadFormatExtensionImages'
                        
                        if (!arr_config_format_type.includes(get_ext_selected_file)) {

                          toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`Extension '${file.type}' Tidak Valid untuk '${obj_input?.['label']}' !`, life:2000});
                          return
                        }
                      }

                    }
                  }
              }
    
            }
          }

          // * Validasi Size
          let max_size_req:any = obj_input?.max_size_in_byte;
          if (max_size_req && max_size_req !== null){
            if (file.size > max_size_req) {
      
              let obj_max_size = convertSizeToUnit(max_size_req);
              let obj_selected_file_size = convertSizeToUnit(file.size);
      
              // * tidak diizinkan jika melebihi permintaan max size per file
              toastProsesRef?.current.show({severity:'error', summary: 'Error', 
                        detail:`File terpilih (${obj_selected_file_size?.['size']} ${obj_selected_file_size?.['unit']}) tidak boleh melebihi batas maksimal 
                                '${parseFloat(max_size_req).toLocaleString('en-US', {style:'decimal'})}' Byte (${obj_max_size?.['size']} ${obj_max_size?.['unit']}) !`
                              , life:3000});
              return;
            }
          }

          const reader = new FileReader();
          reader.readAsDataURL(file);
      

          // *** Penamaan key ketika mau di emit keluar
          let save_key_name = obj_input?.['save']?.['key_name'];
              let save_key_file_id = obj_input?.['save']?.['obj_props']?.['key_file_id'];
              let save_key_file_cid = obj_input?.['save']?.['obj_props']?.['key_file_cid'];
              let save_key_file_name = obj_input?.['save']?.['obj_props']?.['key_file_name'];
              let save_key_file_size = obj_input?.['save']?.['obj_props']?.['key_file_size'];
              let save_key_file_type = obj_input?.['save']?.['obj_props']?.['key_file_type'];
              let save_key_file_status = obj_input?.['save']?.['obj_props']?.['key_file_status'];
              let save_key_file_size_unit = obj_input?.['save']?.['obj_props']?.['key_file_size_unit']; // B, KB, GB

          // *** Nama Versi Edit
          let edit_key_status = obj_input?.edit;  // apakah ada key edit
            let edit_key_name:any = obj_input?.edit?.key_name;
            let edit_props_id:any = obj_input?.edit?.obj_props?.id;
            let edit_props_name:any = obj_input?.edit?.obj_props?.file_name;
            let edit_props_size:any = obj_input?.edit?.obj_props?.file_size;
            let edit_props_type:any = obj_input?.edit?.obj_props?.file_type;
            let edit_props_unit:any = obj_input?.edit?.obj_props?.file_unit;
            let edit_props_url:any = obj_input?.edit?.obj_props?.file_url;
              
      
          // ** Edit
          let edit_value_file_id = refDataChange.current?.[save_key_name]?.[save_key_file_id] ?? null;
          // let save_key_file_name = obj_input?.['save']?.['key_file_name'];
          // let save_key_file_size = obj_input?.['save']?.['key_file_size'];

          setObjFileUpload(prev=>{
            return {
              ...prev,
              [obj_input?.['name']]: null
            }
          })
      
          setObjFileUploadDescription(prev=>{
            return {
              ...prev,
              [obj_input?.['name']]: null
            }
          })

          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              console.error("Progress")
              console.log(progress)
            }
          }

          reader.onloadend = async() => {
      
              let file_show_result:any; // variabel source file (image) yang akan di tampilkan 
              
              if (obj_input?.format?.type === 'Image') {
                  file_show_result = reader.result;
              }
              else if (obj_input?.format?.type === 'Document') {
                  let final_ext = convertDocumentExtTypeShort(file.type);
                  if (final_ext !== null){
                    // file_show_result = null;
                    switch (final_ext){
                      case '.csv': file_show_result = Ext_Csv;break;
                      case '.txt': file_show_result = Ext_Txt;break;
                      case '.doc': file_show_result = Ext_Doc;break;
                      case '.docx': file_show_result = Ext_Docx;break;
                      case '.ppt': file_show_result = Ext_Ppt;break;
                      case '.pptx': file_show_result = Ext_Pptx;break;
                      case '.xls': file_show_result = Ext_Xls;break;
                      case '.xlsx': file_show_result = Ext_Xlsx;break;
                      default: file_show_result = null;
                    }
                  }
              }

              let edit_objectURL:any = null;
              if (file_show_result !== null)
              {
                  const response = await fetch(file_show_result);
                  const blob = await response.blob();
                  let file_temp:File = new File([blob], file.name, {type: file.type});
                  edit_objectURL = URL.createObjectURL(file_temp);
              }


              // *** Pakai UUID v7 (Order Sort)
      
              const generateUUID = uuidv7();

              let obj_size = convertSizeToUnit(file.size);
      
              let objShowDesc = {cid:generateUUID, name:file.name, type: file.type, size: obj_size?.size ?? null, unit: obj_size?.unit ?? null};
              
      
              // *** Simpan perubahan data file dan refDataChange ke dalam FormData
              if (formDataRef && formDataRef.current === null)
              {
                // ** Kondisi pertama upload (masih kosong)
                  refDataChange.current = {
                      ...refDataChange.current,
                      [save_key_name]: {
                                        [save_key_file_id]:edit_value_file_id
                                      , [save_key_file_cid]:generateUUID
                                      , [save_key_file_name]: file.name
                                      , [save_key_file_size]: obj_size?.size ?? null
                                      , [save_key_file_type]: file?.type ?? null
                                      , [save_key_file_size_unit]: obj_size?.unit ?? null
                                      , [save_key_file_status]: edit_value_file_id !== null && edit_value_file_id !== '' ? 'UPDATE' : 'NEW'
                                  }
                  }

                  if (typeof edit_key_status !== 'undefined')
                  {
                      refDataEditChange.current = {
                          ...refDataEditChange.current,
                          [edit_key_name]:{
                                      ...refDataEditChange.current?.[edit_key_name]
                                      , [edit_props_id]:edit_value_file_id
                                      , [edit_props_name]: file.name
                                      , [edit_props_type]: file?.type
                                      , [edit_props_size]: obj_size?.size ?? null
                                      , [edit_props_unit]: obj_size?.unit ?? null
                                      , [edit_props_url]: edit_objectURL ?? null
                          }
                      }
                  }
      
                  formDataRef.current = new FormData();
                  formDataRef.current.append('data', JSON.stringify(refDataChange.current));
                  formDataRef.current.append(generateUUID.toString(), file);
                  
                  // *** formDataRef.current.entries() -> mesti update 'downlevelIteration' agar bisa dipakai
                  // *** formDataRef.current.entries() -> bisa juga update target di atas 'es5' yaitu 'ES2015'
      
                  // for (let [key, value] of formDataRef.current.entries())
                  // {
                  // }
      
              }
              else if (formDataRef.current !== null){
      
                  // ** Kondisi ketika sudah pernah upload (sudah ada isi)
      
      
                  // ** Jika ada CID nya, maka hapus file object terlebih dahulu...
                  // *** e.g. {'photo':{'cid':'123abc...'}}
                  let cid_exists = refDataChange.current?.[save_key_name]?.[save_key_file_cid];
      
                  // console.error("CEK SEBELUM HAPUS")
                  // formDataRef.current.forEach((value, key)=>{
                  //     if (value instanceof File){
                  //       console.log(key)
                  //     }
                  // })
      
                  if (cid_exists && cid_exists !== null){
                    if (formDataRef.current.has(cid_exists)){
                      formDataRef.current.delete(cid_exists);
                    }
                  }
      
                  refDataChange.current = {
                      ...refDataChange.current,
                      [save_key_name]: {
                                        ...refDataChange.current?.[save_key_name]
                                      , [save_key_file_id]:edit_value_file_id
                                      , [save_key_file_cid]:generateUUID
                                      , [save_key_file_name]: file.name
                                      , [save_key_file_type]: file?.type
                                      , [save_key_file_size]: obj_size?.size ?? null
                                      , [save_key_file_size_unit]: obj_size?.unit ?? null
                                      , [save_key_file_status]: edit_value_file_id !== null && edit_value_file_id !== '' ? 'UPDATE' : 'NEW'
                                    }
                  }

                  if (typeof edit_key_status !== 'undefined')
                  {
                      refDataEditChange.current = {
                          ...refDataEditChange.current,
                          [edit_key_name]:{
                                      ...refDataEditChange.current?.[edit_key_name]
                                      , [edit_props_id]:edit_value_file_id
                                      , [edit_props_name]: file.name
                                      , [edit_props_type]: file?.type
                                      , [edit_props_size]: obj_size?.size ?? null
                                      , [edit_props_unit]: obj_size?.unit ?? null
                                      , [edit_props_url]: edit_objectURL ?? null
                          }
                      }
                  }
      
                  formDataRef.current.set('data', JSON.stringify(refDataChange.current));
                  formDataRef.current.set(generateUUID, file);
              }
      
              outDataChange_StatusProses.current = 'process_out_change';
              outDataChange({data:{...refDataChange.current}, 
                          data_with_key_edit:{...refDataEditChange.current},
                          posisi_name_input_when_onchange: obj_input?.['name'], 
                          status_proses:'process_out_change'}, formDataRef.current);
      
      
              if (formDataRef.current !== null) {
              
                  console.log("Upload File Ref Data Change");
                  console.log(refDataChange.current);
      
                  console.log("-----LOOPING-----")
                  
                  formDataRef.current.forEach((value, key)=>{
      
                    if (typeof value === 'string'){
      
                        let convertToJSON = JSON.parse(value);
                        console.log(key)
                        console.log(convertToJSON)
      
                        if (formDataRef.current!.has(convertToJSON?.[save_key_name]?.[save_key_file_cid])) {
                              console.log(formDataRef.current?.get(convertToJSON?.[save_key_name]?.[save_key_file_cid]))
                        }
                    }
                    else if (value instanceof File) {
      
                      // console.log("----File----")
                      // console.log(key)
                      // console.log(value)
                    }
                  })
              }
      
            
      
              // *** Deskripsi nama, size,... 
              setObjFileUploadDescription((prev:any)=>{
                return {
                  ...prev,
                  [obj_input?.['name']]: {...objShowDesc}
                }
              })
      
              // *** Untuk di tampilkan ke tag "img"
              setObjFileUpload(prev=>{
                return {
                  ...prev,
                  [obj_input?.['name']]: file_show_result
                }
              })
          }
      
          reader.onerror = () => {
            setObjFileUpload(prev=>{
              return {
                ...prev,
                [obj_input?.['name']]: null
              }
            })
      
            setObjFileUploadDescription(prev=>{
              return {
                ...prev,
                [obj_input?.['name']]: null
              }
            })
          }
          
          console.log("On UPLOAD----");
          console.log(file);
        }

    }

  }

  const deleteUploadSingleFileHandler = (index, obj_input:FormTemplateDataInputType) => {
    if (index !== -1){

      const disabled_input = objDisabled?.[obj_input?.['index']];
      const disabled_for_process = objDisabledForProses?.[obj_input?.['index']];

      if (disabled_input || disabled_for_process) {
        return;
      }

      let save_key_name = obj_input?.['save']?.['key_name'];
      
          let save_key_file_id = obj_input?.['save']?.['obj_props']?.['key_file_id']; // nama key contoh 'id' (id dari edit_data)
          let save_key_file_cid = obj_input?.['save']?.['obj_props']?.['key_file_cid']; // nama key contoh 'cid' (id file berjalan)
          let save_key_file_name = obj_input?.['save']?.['obj_props']?.['key_file_name']; 
          let save_key_file_size = obj_input?.['save']?.['obj_props']?.['key_file_size'];
          let save_key_file_status = obj_input?.['save']?.['obj_props']?.['key_file_status'];
          let save_key_file_size_unit = obj_input?.['save']?.['obj_props']?.['key_file_size_unit']; // B, KB, GB

      let edit_value_file_id = refDataChange.current?.[save_key_name]?.[save_key_file_id] ?? null;
      let edit_value_file_cid = refDataChange.current?.[save_key_name]?.[save_key_file_cid] ?? null;

      
      if (edit_value_file_id !== null){

          // * Jika ada id berarti id existing dari database, maka di set status 'DELETE' agar nanti backend yang hapus ke database
          refDataChange.current = {
            ...refDataChange.current,
            [save_key_name]:{
              ...refDataChange.current[save_key_name],
              [save_key_file_status]: 'DELETE'
            }
          }
      }
      else if (edit_value_file_id === null) {
        
        // ** Status file gambar ini masih 'NEW' (bukan dari Edit jadi hapus permanen saja dari refDataChange)
        delete refDataChange.current?.[save_key_name];
      }

      // ** Hapus permanen key yang di delete untuk refDataChangeEdit (agar penampakannya tidak muncul di input)
      let edit_key_name = obj_input?.edit?.key_name;
      if (typeof edit_key_name !== 'undefined'){
        if (typeof refDataEditChange.current?.[edit_key_name] !== 'undefined')
        {
            delete refDataEditChange.current?.[edit_key_name];
        }
      }

      // * Clear dari show Image
      setObjFileUpload(prev=>{
        return {
          ...prev,
          [obj_input?.['name']]: null
        }
      })

      // * Clear dari Description Image
      setObjFileUploadDescription(prev=>{
        return {
          ...prev,
          [obj_input?.['name']]: null
        }
      })
      
      if (formDataRef.current && formDataRef.current !== null)  {

        // * Biasa kalau tidak null karena kondisi berjalan dengan di klik browse
        if (edit_value_file_cid !== null){
          if (formDataRef.current!.has(edit_value_file_cid)){
              // hapus dari FormData by 'cid'
              formDataRef.current.delete(edit_value_file_cid);
          }
        }

        formDataRef.current.set('data', JSON.stringify(refDataChange.current));
      }

      outDataChange_StatusProses.current = 'process_out_change';
      outDataChange({data:{...refDataChange.current}, 
                      data_with_key_edit:{...refDataEditChange.current},
                      posisi_name_input_when_onchange: obj_input?.['name'], 
                      status_proses:'process_out_change'}, formDataRef.current);

      console.log(refDataChange.current)

    }
  }

  const convertSizeToByte = (size:number, unit:'B'|'KB'|'MB'|'GB') => {
      let final_result:number = 0;
      switch(unit){
        case 'B':final_result = size * Math.pow(1024,0);break;
        case 'KB':final_result = size * Math.pow(1024,1);break;
        case 'MB':final_result = size * Math.pow(1024,2);break;
        case 'GB':final_result = size * Math.pow(1024,3);break;
        default: final_result = 0;
      }
      return final_result;
  }

  const deleteUploadMultipleAllFileHandler = (obj_input) => {

    if (inputRefs?.[obj_input?.['index']]){

      const save_key_name = obj_input?.['save']?.['key_name'];
      const save_key_file_status = obj_input?.['save']?.['obj_props']?.['key_file_status'];

      let total_size_in_byte:number = Number(objUploadSizeLimit?.[obj_input?.['name']]?.size_in_byte ?? 0) || 0;

      if (formDataRef.current){
        
          // * Variabel untuk file yang boleh ditampilkan ke dalam list
          // let data_files_for_list_final:File[] = [];

          const files_exist_in_list = inputRefs[obj_input?.['index']].current.getFiles(); // ambil file di list saat ini
          files_exist_in_list.forEach((file:File)=>{

              const cid_item = file?.['cid'] || null;
              const id_item = file?.['id'] || null; // file dari edit data

              let data_files_in_ref = refDataChange.current?.[save_key_name];

              // * Kumpulkan semua files yang tidak bisa dihapus karena ada 'id' (edit_data)
              // ** Kemudian isi files nya di set lagi pakai 'setFiles'

              
              // Hapus dari refDataEditChange
              const edit_key_name = obj_input?.edit?.key_name;

              let temp_data_edit_change:any[] = [];
              if (typeof edit_key_name !== 'undefined'){
                  temp_data_edit_change = refDataEditChange.current?.[edit_key_name];  // array file
              }
              if (temp_data_edit_change.length > 0)
              {
                if (cid_item !== null)
                {
                  let findIdxIdinEdit = temp_data_edit_change.findIndex((val,idx)=>val?.['cid'] === cid_item);
                  
                  if (findIdxIdinEdit !== -1){
                    temp_data_edit_change.splice(findIdxIdinEdit, 1)
                  }
                }
                else if (id_item !== null)
                {
                  let findIdxIdinEdit = temp_data_edit_change.findIndex((val,idx)=>val?.['id'] === id_item);
                  
                  if (findIdxIdinEdit !== -1){
                    temp_data_edit_change.splice(findIdxIdinEdit, 1)
                  }
                }
              }
              // ---

              if (cid_item !== null){

                if (formDataRef.current && formDataRef.current !== null){

                  // * Cek apa ada "cid" dalam 'refDataChange'

                  if (typeof data_files_in_ref !== 'undefined' && Array.isArray(data_files_in_ref)){

                    let find_index_in_ref = data_files_in_ref.findIndex(item_ref => item_ref?.['cid'] === cid_item);
                    if (find_index_in_ref !== -1){

                        // let get_item_in_ref = data_files_in_ref.indexOf(find_index_in_ref);

                        // * Hapus item dalam 
                        data_files_in_ref.splice(find_index_in_ref, 1);

                        // * Hapus dari formDataRef
                        console.error("----SITUASI PERUBAHAN DATA REF-----")
                        console.log(refDataChange.current)

                        formDataRef.current.set('data', JSON.stringify(refDataChange.current));

                        if (formDataRef.current.has(cid_item)){
                          formDataRef.current.delete(cid_item)
                        }
                        
                        // total_size_in_byte -= file.size;

                        if (typeof file?.['id'] !== 'undefined' && file?.['id'] !== null){
                          total_size_in_byte -= file?.['size_bytes_from_db'];
                        }
                        else {
                          total_size_in_byte -= file.size;
                        }


                      // else if (find_item_in_ref?.['id'] !== null){
                      //     // * Simpan data yang masih perlu di tampilkan ke list
                      //     data_files_for_list_final = [...data_files_for_list_final, file];
                      // }

                    }

                  }
                  
                }
              }
              else if (id_item !== null){

                  // * Kondisi Edit Data (jangan dihapus, tapi set status ke 'DELETE')

                  if (typeof data_files_in_ref !== 'undefined' && Array.isArray(data_files_in_ref)){

                    let find_index_in_ref = data_files_in_ref.findIndex(item_ref => item_ref?.['id'] === id_item);
                    if (find_index_in_ref !== -1){

                        // let get_item_in_ref = data_files_in_ref.indexOf(find_index_in_ref);

                        // * Update status ke 'DELETE'
                        data_files_in_ref[find_index_in_ref][save_key_file_status] = 'DELETE';

                        // * Hapus dari formDataRef
                        console.error("----(ID EDIT) SITUASI PERUBAHAN DATA REF-----")
                        console.log(refDataChange.current)

                        // total_size_in_byte -= file.size;

                        if (typeof file?.['id'] !== 'undefined' && file?.['id'] !== null){
                          total_size_in_byte -= file?.['size_bytes_from_db'];
                        }
                        else {
                          total_size_in_byte -= file.size;
                        }

                    }
                  }
              }

          })


          if (inputRefs?.[obj_input?.['index']].current){

            // * Hapus semua data dalam list
            inputRefs[obj_input?.['index']].current.clear();

            // * Set kembali file yang perlu disimpan (jika yang masih ada 'id' dipertahankan)
            // if (data_files_for_list_final.length > 0){
            //     inputRefs[obj_input?.['index']].current.setFiles([...data_files_for_list_final]);
            // }

            // ** Testing Konversi dari 'URL' jadikan tipe 'File'
            // let abc = new FileReader();
            // abc.readAsDataURL("https://img.freepik.com/free-photo/beautiful-natural-view-landscape_23-2150787996.jpg")
            // const url = "https://cors-anywhere.herokuapp.com/https://img.freepik.com/free-photo/beautiful-natural-view-landscape_23-2150787996.jpg";
            // const url = "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70";

            // const url = "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/42d517ea-0138-4995-98f4-06be82535331/5931c986-4e61-49e7-9b26-a172f01edc45.png";
            // const response = await fetch(url)
            // const blob = await response.blob(); 
            // let file_temp = new File([blob], url.split('/').pop() || 'down.jpg', {type:blob.type})
            // const objectURL = URL.createObjectURL(file_temp);
            // file_temp['objectURL'] = objectURL;
            // console.log("file_temp")
            // console.log(file_temp)

            if (statusConfigFileUpload.current === true)
            {
              setDataToFormData('data', refDataChange.current);
            }

            outDataChange_StatusProses.current = 'process_out_change';
            outDataChange({data:{...refDataChange.current}, 
                          data_with_key_edit:{...refDataEditChange.current},
                          posisi_name_input_when_onchange: obj_input?.['name'], 
                          status_proses:'process_out_change'}, formDataRef.current);
    
          }

        }
        
        
      // const aa =inputRefs[obj_input?.['index']].current.getFiles(); // ambil file di list saat ini
      // inputRefs[obj_input?.['index']].current.setFiles([aa[0]]);

      let obj_convert_size_to_unit = convertSizeToUnit(total_size_in_byte, 0);

      setObjUploadSizeLimit((prev:any)=>{
        return {
          ...prev,
          [obj_input?.['name']]: {
            ...prev[obj_input?.['name']],
            size_in_byte: total_size_in_byte,
            size: obj_convert_size_to_unit?.size,
            size_unit: obj_convert_size_to_unit?.unit
          }
        }
      })

      // if (formDataRef.current && formDataRef.current !== null ){
      //   formDataRef.current.forEach((value:any, key)=>{

      //     if (typeof value === 'string'){
      //       console.log("DARI DELETE JSON")
      //       console.log(JSON.parse(value))
      //     }
      //     else if (value instanceof File){
      //       console.log("DARI FILE-----")
      //       console.log(key)
      //       console.log(value)
      //     }
      //   })
      // }

    }
  }
  
  const deleteUploadMultipleFileHandler = (file, props, obj_input:FormTemplateDataInputType) => {

      const total_size:string = objUploadSizeLimit?.[obj_input?.['name']]?.size_in_byte ?? '0';

      if (typeof total_size !== 'undefined' && total_size !== null){
        if (formDataRef && formDataRef.current !== null){

          const save_key_name = obj_input?.['save']?.['key_name'];
          const edit_key_name = obj_input?.edit?.key_name;
          
          let temp_data_edit_change:any[] = [];
          if (typeof edit_key_name !== 'undefined'){
            temp_data_edit_change = refDataEditChange.current?.[edit_key_name];  // array file
          }

          let temp_data_change = refDataChange.current?.[save_key_name];  // array file

          if (typeof temp_data_change !== 'undefined' && temp_data_change !== null && Array.isArray(temp_data_change)){

            if (temp_data_change.length > 0){

              let status_find_item:boolean = false;
              let attr_key_selected_not_empty:'id'|'cid'|'' = '';
              let attr_value_selected_not_empty:any = null;

              let calculate_size:number;
              let obj_size_to_unit:any = {};

              const file_inlist_id = file?.['id'];
              const file_inlist_cid = file?.['cid'];

              if (typeof file_inlist_id !== 'undefined' && file_inlist_id !== null)
              {
                  attr_key_selected_not_empty = 'id';
                  attr_value_selected_not_empty = file_inlist_id;
              }
              else if (typeof file_inlist_cid !== 'undefined' && file_inlist_cid !== null)
              {
                  attr_key_selected_not_empty = 'cid'
                  attr_value_selected_not_empty = file_inlist_cid;
              }

              // Hapus dari refDataEditChange
              if (temp_data_edit_change.length > 0)
              {
                  let findIdxinEdit = temp_data_edit_change.findIndex((val,idx)=>val?.[attr_key_selected_not_empty] === attr_value_selected_not_empty);
                  
                  if (findIdxinEdit !== -1){
                    temp_data_edit_change.splice(findIdxinEdit, 1)
                  }
              }
              // ---

              // * Jika ada salah satu 'id' atau 'cid', maka di proses

              if (attr_key_selected_not_empty !== null && 
                  attr_key_selected_not_empty !== '')
              {
                  let find_item_byid = temp_data_change.find(item=>{
                  
                      const data_item = item?.[attr_key_selected_not_empty];

                      if (typeof data_item !== 'undefined' && data_item !== null && data_item !== '')
                      {
                        return data_item === attr_value_selected_not_empty ? true : false;
                      }
                      else {return false;}
                  });

                  if (find_item_byid){
    
                    let posisi_index_item = temp_data_change.indexOf(find_item_byid); // cari object yang sama pakai indexOf
                    if (posisi_index_item !== -1){

                      // * Hapus dari formDataRef
                      if (typeof attr_value_selected_not_empty !== 'undefined' && attr_value_selected_not_empty !== null)
                      {
                        if (attr_key_selected_not_empty === 'cid'){
                          if (formDataRef.current?.has(file?.['cid'])){
                            formDataRef.current?.delete(file?.['cid'])
                          }
                        }
                      }
    
                      
                      if (find_item_byid?.['id'] === null)
                      {
                          temp_data_change.splice(posisi_index_item, 1);  // hapus item dari array refDataChange

                          calculate_size = parseFloat(total_size) - parseFloat(file?.size ?? 0);
                          obj_size_to_unit = convertSizeToUnit(calculate_size, 0);
                      }
                      else if (find_item_byid?.['id'] !== null)
                      {
                          temp_data_change[posisi_index_item]["status"] = "DELETE";

                          calculate_size = parseFloat(total_size) - parseFloat(file?.size_bytes_from_db ?? 0);
                          obj_size_to_unit = convertSizeToUnit(calculate_size, 0);
                      }
    
                      status_find_item = true;
                    }
                  }
              }

              // * hanya id atau cid yang exists saja yang akan di proses
              if (status_find_item)
              {
                // * Hapus data per item dari daftar
                props.onRemove(file);

                // * Set ulang data JSON
                if (formDataRef.current && formDataRef.current !== null) {
                  formDataRef.current?.set('data', JSON.stringify(temp_data_change));
                }

                outDataChange_StatusProses.current = 'process_out_change';
                outDataChange({data:{...refDataChange.current}, 
                              data_with_key_edit:{...refDataEditChange.current},
                              posisi_name_input_when_onchange: obj_input?.['name'], 
                              status_proses:'process_out_change'}, formDataRef.current);
  

                setObjUploadSizeLimit((prev:any)=>{
                  return {
                    ...prev,
                    [obj_input?.['name']]: {
                      ...prev[obj_input?.['name']],
                      size_in_byte: calculate_size < 0 ? 0 : calculate_size,
                      size: obj_size_to_unit?.['size'],
                      size_unit: obj_size_to_unit?.['unit']
                    }
                  }
                })
              }


            }

          }


          // formDataRef.current.forEach((value:any, key)=>{

          //   if (typeof value === 'string'){
          //     console.log("DARI DELETE JSON")
          //     console.log(JSON.parse(value))
          //   }
          //   else if (value instanceof File){
          //     console.log("DARI FILE-----")
          //     console.log(key)
          //     console.log(value)
          //   }
          // })

        }
      }
  }

  
  const openConfirm = (index, obj_input:FormTemplateDataInputType, message?:string, 
                        multiple?:{type:'per-item', file:File, props:any}
                                    |{type:'all'}
                                    |null
                      ,showSuccess?:boolean // tampilkan icon check mark success jika proses berhasil dilakukan
                      ) => {

      const accept = async() => { 

        // setTimeout(()=>setShowConfirmDialog(false),3000)
        // statusCloseConfirmDialogRef.current = false;

        // ** Kunci semua fungsi close
        setStatusCloseConfirmDialog(false); // kunci tidak bisa close kecuali klik Reject No
        statusCloseConfirmDialogRef.current = false;

        
        if (multiple?.type === 'per-item'){

          if (multiple?.file && multiple?.props){
              const multiple_file = multiple?.file;
              const multiple_props = multiple?.props;

              let message_content = `Anda yakin menghapus File <b>"${multiple?.file?.name}"</b> </br>dari <b>"${obj_input?.['label']}"</b> ?`
              openConfirm(obj_input?.['index'], obj_input, message_content, {type:'per-item', file:multiple_file, props:multiple_props});
          }
        }
        else if (multiple?.type === 'all'){

              let message_content = `Anda yakin menghapus semua File </br>pada <b>"${obj_input?.['label']}"</b> ?`

              openConfirm(obj_input?.['index'], obj_input, message_content, {type:'all'});
        }
        else {
              openConfirm(index, obj_input);  // buka sekali lagi untuk merefresh useRef
        }


        
        // * Minta Konfirmasi dengan User
        if (formDataRef?.current && outConfirmDialog) {
          if (obj_input?.type === 'fileupload-image-single'){
            if (obj_input?.type_upload === 'single'){

              // props.type -> Form / Modal
              confirmUserPropsRef.current = {source: props.type, index_input:index, status_now:'Delete File', obj_input}
        
              outConfirmDialog?.({source: props.type, type:'Delete File', obj_input: obj_input}, formDataRef.current);
            }
            else if (obj_input?.type_upload === 'multiple'){

              // props.type -> Form / Modal
              if (multiple?.type === 'per-item'){
                confirmUserPropsRef.current = {source: props.type, index_input:index, status_now:'Delete File', obj_input, 
                        multiple:{type:'per-item', file: multiple.file, props: multiple.props}}
              }
              else if (multiple?.type === 'all'){
                confirmUserPropsRef.current = {source: props.type, index_input:index, status_now:'Delete File', obj_input, 
                        multiple:{type:'all'}}
              }
              
              outConfirmDialog?.({source: props.type, type:'Delete File', obj_input: obj_input}, formDataRef.current);
            }
          }


          // return
        }
        // await new Promise((resolve)=>setTimeout(resolve, 3000));
      }
    
      const reject = () => {

        statusCloseConfirmDialogRef.current = true;

        setStatusCloseConfirmDialog(true); // kunci close di izinkan
        
        setShowConfirmDialog(false);

        return;
      }

      confirmDialog({
          // trigger: event.currentTarget,
          // header:'Delete Confirmation',
          // closable:false, // hide icon close at header
          className:'fit-confirmdialog-delete-file',

          // closeOnEscape:statusCloseConfirmDialog, // close when press escape
          // closable:statusCloseConfirmDialog, // click icon x header
          // dismissableMask:statusCloseConfirmDialog, // close when click outside
          showHeader: typeof showSuccess === 'undefined' || !showSuccess ? true : false,    // jika tidak ada showSuccess, maka tampilkan
          headerClassName:'fit-confirmdialog-hide-x-icon',
          
          // headerStyle:{display:'block'},
          draggable:true,

          onHide:(e)=>{
            statusCloseConfirmDialogRef.current = true;  // kunci close di izinkan (update di message view)
            setStatusCloseConfirmDialog(true); // kunci close di izinkan
          },
          header:()=>(
            <div>
                <div
                  className='d-flex justify-content-center align-items-center'
                    style={{
                      position:'absolute',
                      left:'50%',
                      transform:'translateX(-50%)',
                      top:'-45px',
                      background:'#06b6d4',
                      borderRadius:'50%',
                      width:'80px',
                      height:'80px'
                    }}
                >
                    <i className='pi pi-question text-white anim-container-rotate' style={{fontSize:'40px'}}></i>
                </div>

            </div>
          ),
          message: (
              <div className='d-flex flex-column align-items-center mt-3'>

                    {
                        typeof showSuccess !== 'undefined' &&
                        showSuccess && (
                          <div className='mt--3 mb-3'>
                            <CheckMarkAnimate />
                          </div>
                        )
                    }
                
                  <span className='text-center' dangerouslySetInnerHTML={{__html: message || 'Anda yakin menghapus record ini ?' }}>
                    {/* {message || 'Anda yakin menghapus record ini ?'} */}
                    </span>

                  {
                    (typeof showSuccess === 'undefined' ||
                        showSuccess === false) && (

                          <div className='w-100 d-flex justify-content-end mt-4'>
                            <div>
                              {/* posisi  !statusCloseConfirmDialogRef.current (tidak boleh di close) berarti lagi dikunci karena sedang di proses */}
                                <ButtonPrime label="No" icon="pi pi-times" disabled={!statusCloseConfirmDialogRef.current} ref={confirmDialog_ButtonReject} className='p-button-text me-1' onClick={()=>reject()} />
                                  
                                <ButtonPrime label="Yes" icon="pi pi-check" loading={!statusCloseConfirmDialogRef.current} className='p-button-danger' onClick={()=>accept()} />
                            </div>
                          </div>
                    )
                  }

                  {
                    (typeof showSuccess !== 'undefined' &&
                      showSuccess === true) && (

                        <ButtonPrime label="OK" className='p-button-info mt-4 w-100' onClick={()=>{
                                setStatusCloseConfirmDialog(true); // kunci tidak bisa close kecuali klik Reject No
                                statusCloseConfirmDialogRef.current = true;

                                setShowConfirmDialog(false);
                        }}/>
                    )

                  }
              </div>
          ),
          
          // content:({closeRef,contentRef,footerRef,headerRef,hide,message})=>(
          //   <div className=' d-flex flex-column align-items-center gap-3'>
          //       <i className='pi pi-exclamation-circle text-danger' style={{fontSize:'30px'}}></i>
          //       <span>Anda yakin  ?</span>
          //   </div>
          // ),
          acceptIcon:'pi pi-check',
          rejectIcon:'pi pi-times',
          // icon:'pi pi-info-circle',
          defaultFocus: 'reject',
          acceptClassName:'p-button-danger ',
          acceptLabel:'Yes',
          rejectClassName:`p-button-text me-1`,
          // accept: accept,
          // reject: reject
        })
  }


  const showTemplateConfirm_UploadSingle = (event, index, obj_input) => {

      const disabled_input = objDisabled?.[obj_input?.['index']];
      const disabled_for_process = objDisabledForProses?.[obj_input?.['index']];

      if (disabled_input || disabled_for_process) {
        return;
      }

    
      if (index !== -1){

        statusCloseConfirmDialogRef.current = true;
        
        // Munculkan Confirm Dialog
        setShowConfirmDialog(true);

        setStatusCloseConfirmDialog(true); // kunci close di izinkan
        
        // statusCloseConfirmDialogRef.current = true;

        setTimeout(()=>{
          if (confirmDialog_ButtonReject?.current){
            confirmDialog_ButtonReject.current.focus();
          }
        },10)
      }


      // const openConfirmSuccess = () => {
      //     confirmDialog({
      //       // trigger: event.currentTarget,
      //       // header:'Delete Confirmation',
      //       // closable:false, // hide icon close at header
      //       className:'fit-confirmdialog-success-confirm',
    
      //       // closeOnEscape:statusCloseConfirmDialog, // close when press escape
      //       // closable:statusCloseConfirmDialog, // click icon x header
      //       // dismissableMask:statusCloseConfirmDialog, // close when click outside
    
      //       headerClassName:'fit-confirmdialog-hide-x-icon',
      //       // headerStyle:{display:'block'},
      //       draggable:true,
    
      //       header:()=>(
      //         <div>
      //             <div
      //               className='d-flex justify-content-center align-items-center'
      //                 style={{
      //                   position:'absolute',
      //                   left:'50%',
      //                   transform:'translateX(-50%)',
      //                   top:'30px',
      //                   background:'#00da01',
      //                   borderRadius:'50%',
      //                   width:'80px',
      //                   height:'80px'
      //                 }}
      //             >
      //                 <i className='pi pi-check text-white' style={{fontSize:'40px'}}></i>
      //             </div>
      //         </div>
      //       ),
      //       message: (
      //           <div className='d-flex flex-column justify-content-center align-items-center mt-5'>
    
      //               <div className='w-100 d-flex justify-content-center mt-4'>
      //                 <div>
      //                   {/* posisi  !statusCloseConfirmDialogRef.current (tidak boleh di close) berarti lagi dikunci karena sedang di proses */}
      //                     {/* <ButtonPrime label="No" icon="pi pi-times" disabled={!statusCloseConfirmDialogRef.current} ref={confirmDialog_ButtonReject} className='p-button-text me-1' onClick={()=>reject()} /> */}
                            
      //                     <ButtonPrime label="Yes" loading={!statusCloseConfirmDialogRef.current} className='p-button p-button-text' onClick={()=>accept()} />
      //                 </div>
      //               </div>
      //           </div>
      //       ),
            
      //     })
      // }

      openConfirm(index, obj_input);

      // openConfirmSuccess();
  }

  useEffect(()=>{
    
    // function accordion untuk sesuaikan height setiap section

    if (sectionElementRef?.current && Object.keys(sectionElementRef.current).length > 0){
      for (let [key, value] of Object.entries(sectionElementRef.current)){

        if (value?.['height'] !== 0){
          if (value?.['element']) {

            const ele = value.element;
            
            ele.style.height = value.height + 'px';

            // console.error('CEK SEMUA');
            // console.lo```g(key)
            // console.log(value)
            // alert('masuk')
          }

        }

      }
    }
  },[sectionElementRef.current])

  const handleSectionRender = (event, section_id_auto) => {
    if (event !== null) {

      // console.log(event.nextElementSibling)
      // console.log(next_sibling.clientHeight)

      const next_sibling = event.nextElementSibling as HTMLElement;
      
      // *** Atur perubahan height pada bagian total height ke 'fit-section-input-cont' (container input)
      if (typeof next_sibling !== 'undefined' && next_sibling !== null) {
          
        // *** firstChild menyimpan total height input per section
          const firstChild = next_sibling.firstChild as HTMLElement;

          // jika posisi nya terbuka, maka adjust tinggi clientHeight nya
          if (next_sibling.clientHeight !== 0) {
            next_sibling.style.height = firstChild.clientHeight + 'px';
          }
      }

      if (sectionElementRef.current !== null) {
        if (next_sibling.clientHeight !== 0) {

          sectionElementRef.current = {
            ...sectionElementRef.current,
            [section_id_auto]: {element:event.nextElementSibling}
          }
        }
      }
      else {
        sectionElementRef.current = {
          [section_id_auto]: {element:event.nextElementSibling}
        }
      }

    }
  }

  const handleClickSectionArrow = (e, item:string) => {
    
    const item_section = sectionElementRef.current?.[item];

    if (typeof item_section !== 'undefined' && item_section !== null) {

      const element_section = item_section?.element;
      // const height_max = item_section?.height;

      const firstChild = element_section?.firstChild;
      if (typeof firstChild !== 'undefined' && firstChild !== null){
        const firstChildHTMLEle = firstChild as HTMLElement;
        // console.error('ukuran asli : ' + firstChildHTMLEle.clientHeight);

        if (typeof element_section !== 'undefined' && element_section !== null) {
          
          element_section.style.transition = "all 0.3s ease-in-out";
  
          // *** Arrow Angle up and down
          const butTraget = e.currentTarget as HTMLElement;    // ButtonPrime Arrow
          const butTargetSpanArrow = butTraget.querySelector('span') as HTMLElement;
          if (butTargetSpanArrow){
            butTargetSpanArrow.style.transition = "all 0.3s ease-in-out";
            butTargetSpanArrow.style.transformOrigin = "center center";
          }

          if (element_section.clientHeight !== 0){
              item_section.element.style.height = '0px';

              // ** Panah ke atas (Tutup)
              if (butTargetSpanArrow){
                butTargetSpanArrow.style.transform = "rotate(-180deg)";
              }
              // if (butTargetSpanArrow?.classList.contains('pi-angle-down')) {
              //   butTargetSpanArrow.classList.replace('pi-angle-down', 'pi-angle-up');
              // }
              
          }
          else if (element_section.clientHeight === 0) {
              element_section.style.height = firstChildHTMLEle.clientHeight + 'px';

              // ** Panah ke bawah (Buka)
              if (butTargetSpanArrow){
                butTargetSpanArrow.style.transform = "rotate(0deg)";
              }
              // if (butTargetSpanArrow?.classList.contains('pi-angle-up')){
              //   butTargetSpanArrow.classList.replace('pi-angle-up', 'pi-angle-down');
              // }
  
          }
        }

      }
    
    }
  }

  const progressBarTemplateUploadMultiple = (progress, props, obj_input:FormTemplateDataInputType) => {

    let result:number = 0;

    if (typeof obj_input?.type !== 'undefined' && obj_input?.type !== null && obj_input?.type === 'fileupload-image-single'){
      if (obj_input?.type_upload === 'multiple'){
        if (typeof obj_input?.max_size_in_byte === 'undefined' || obj_input?.max_size_in_byte === null)
        {
          result = 100;
        }
        else {
          const size_in_byte = objUploadSizeLimit?.[obj_input?.['name']]?.size_in_byte;
          const max_size = obj_input?.max_size_in_byte;

          if (typeof size_in_byte !== 'undefined' && size_in_byte !== null &&
                typeof max_size !== 'undefined' && max_size !== null)
          {
              result = (Number(size_in_byte) / Number(max_size)) * 100;
          }
        }
      }
    }

    return (
      <ProgressBar value={result} showValue={false}></ProgressBar>
    )
  }


  const headerTemplateUploadMultiple = (options:FileUploadHeaderTemplateOptions, obj_input:FormTemplateDataInputType) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    const handleClearAllItem = async() => {

      const disabled_input = objDisabled?.[obj_input?.['index']];
      const disabled_for_process = objDisabledForProses?.[obj_input?.['index']];

      if (disabled_input || disabled_for_process) {
        return;
      }

      if (typeof obj_input?.['index'] !== 'undefined' && obj_input?.['index'] !== null && obj_input?.['index'] !== -1){
        
        statusCloseConfirmDialogRef.current = true;
  
        // Munculkan Confirm Dialog
        setShowConfirmDialog(true);
  
        setStatusCloseConfirmDialog(true); // kunci close di izinkan
  
        setTimeout(()=>{
          if (confirmDialog_ButtonReject?.current){
            confirmDialog_ButtonReject.current.focus();
          }
        },10)

        let message_content = `Anda yakin menghapus semua File </br>pada <b>"${obj_input?.['label']}"</b> ?`

        openConfirm(obj_input?.['index'], obj_input, message_content, {type:'all'});
      }

    }

    return (
      <div className={className} style={{backgroundColor:'transparent', display:'flex', alignItems:'center'}}>
        <div>
            {chooseButton}
            <ButtonPrime tooltip='Clear All' onClick={handleClearAllItem} 
                  disabled={Number(objUploadSizeLimit?.[obj_input?.['name']]?.size_in_byte) <= 0 ||
                          (objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']])
                  }
                  icon="pi pi-fw pi-times" style={{color:'#ff8f8f'}} className='p-button-outlined fit-multiple-upload' />
        </div>

        {
          obj_input?.['type'] === 'fileupload-image-single' && (
            typeof obj_input?.['max_size_in_byte'] !== 'undefined' &&
              obj_input?.['max_size_in_byte'] !== null && (

                  <div className='d-flex align-items-center flex-wrap justify-content-end gap-1 ms-auto' style={{width:'50%', fontFamily:'Nunito, Arial', fontSize:'0.875rem'}}>

                      <span>{objUploadSizeLimit !== null && !isNaN(Number(objUploadSizeLimit?.[obj_input?.['name']]?.['size'])) ? objUploadSizeLimit?.[obj_input?.['name']]?.['size'] : '0'}</span>
                      <span>{objUploadSizeLimit?.[obj_input?.['name']]?.['size_unit'] || 'B'}</span>

                      <span>/</span>

                      <span>
                          {objUploadSizeLimit !== null ? objUploadSizeLimit?.[obj_input?.['name']]?.['max_size'] : ''}
                      </span>
                      <span>
                          {objUploadSizeLimit !== null ? objUploadSizeLimit?.[obj_input?.['name']]?.['max_size_unit'] : ''}
                      </span>
                  </div>
              )
          )
        }
      </div>
    )
  }

  const emptyTemplateUploadMultiple = () => {
    return (
      <div className='d-flex align-items-center flex-column'>
          <i className='pi pi-image mt-1 p-5' style={{fontSize:'5em', opacity:0.3, borderRadius:'50%', backgroundColor:'lightgrey', color:'grey'}}></i>
          <span style={{fontSize:'1rem', fontFamily:'Nunito'}} className='my-3'>
              Drag and Drop Files Here
          </span>
      </div>
    )
  }

  const itemTemplateUploadMultiple = (file, props, obj_input:FormTemplateDataInputType) => {

    let ext_file:UploadFormatExtensionDocument|null = convertDocumentExtTypeShort(file.type)

    const handleOnRemoveFileUploadMultiple = (file:File, obj_input, callback) => {

      const disabled_input = objDisabled?.[obj_input?.['index']];
      const disabled_for_process = objDisabledForProses?.[obj_input?.['index']];

      if (disabled_input || disabled_for_process) {
        return;
      }

      if (typeof obj_input?.['index'] !== 'undefined' && obj_input?.['index'] !== null && obj_input?.['index'] !== -1){
        
        statusCloseConfirmDialogRef.current = true;
  
        // Munculkan Confirm Dialog
        setShowConfirmDialog(true);
  
        setStatusCloseConfirmDialog(true); // kunci close di izinkan
  
        setTimeout(()=>{
          if (confirmDialog_ButtonReject?.current){
            confirmDialog_ButtonReject.current.focus();
          }
        },10)

        let message_content = `Anda yakin menghapus File <b>"${file.name}"</b> </br>dari <b>"${obj_input?.['label']}"</b> ?`

        openConfirm(obj_input?.['index'], obj_input, message_content, {type:'per-item', file, props});
      }

      return
    
      // const total_size:string = objUploadSizeLimit?.[obj_input?.['name']]?.size_in_byte ?? '0';

      // if (typeof total_size !== 'undefined' && total_size !== null){

      //   if (formDataRef && formDataRef.current !== null){

      //     const save_key_name = obj_input?.['save']?.['key_name'];
          
      //     let temp_data_change = refDataChange.current?.[save_key_name];  // array file

      //     if (typeof temp_data_change !== 'undefined' && temp_data_change !== null && Array.isArray(temp_data_change)){

      //       if (temp_data_change.length > 0){
              
      //         let find_cid = temp_data_change.find(item=>item?.['cid'] === file?.['cid']);
      //         if (find_cid){
      //           let posisi_index_item = temp_data_change.indexOf(find_cid); // cari object yang sama pakai indexOf
      //           if (posisi_index_item !== -1){

      //             // * Hapus dari formDataRef
      //             if (formDataRef.current?.has(file?.['cid'])){
      //               formDataRef.current?.delete(file?.['cid'])
      //             }

      //             const calculate_size = parseFloat(total_size) - parseFloat(file?.size ?? 0);
      //             const obj_size_to_unit = convertSizeToUnit(calculate_size, 0);

      //             if (find_cid?.['id'] === null){

      //                 temp_data_change.splice(posisi_index_item, 1);  // hapus item dari array refDataChange
                    
      //             }
      //             else if (find_cid?.['id'] !== null)
      //             {
      //                 temp_data_change[posisi_index_item]["status"] = "DELETE";
      //             }

      //             // * Hapus data per item dari daftar
      //             props.onRemove(file);

      //             // * Set ulang data JSON
      //             if (formDataRef.current && formDataRef.current !== null) {
      //               formDataRef.current?.set('data', JSON.stringify(temp_data_change));
      //             }

      //             outDataChange_StatusProses.current = 'process_out_change';
      //             outDataChange({data:{...refDataChange.current}, posisi_name_input_when_onchange: obj_input?.['name'], status_proses:'process_out_change'}, formDataRef.current);
                            
                  
      //             setObjUploadSizeLimit((prev:any)=>{
      //               return {
      //                 ...prev,
      //                 [obj_input?.['name']]: {
      //                   ...prev[obj_input?.['name']],
      //                   size_in_byte: calculate_size,
      //                   size: obj_size_to_unit?.['size'],
      //                   size_unit: obj_size_to_unit?.['unit']
      //                 }
      //               }
      //             })

      //           }
      //         }
      //       }

      //     }


      //     // formDataRef.current.forEach((value:any, key)=>{

      //     //   if (typeof value === 'string'){
      //     //     console.log("DARI DELETE JSON")
      //     //     console.log(JSON.parse(value))
      //     //   }
      //     //   else if (value instanceof File){
      //     //     console.log("DARI FILE-----")
      //     //     console.log(key)
      //     //     console.log(value)
      //     //   }
      //     // })

      //   }

      //   // callback();

      // }
    }


    return (
      <div className='d-flex fit-upload-multiple-item-anim'
          style={{
            paddingTop:'10px'
            , paddingBottom:'0'
          }}
      >

          {
            obj_input?.['type'] === 'fileupload-image-single' && (
              // obj_input?.['format']?.['type'] === 'Image' && (
              file?.type && file?.type.startsWith('image/') && (

                  <div className='d-flex align-items-center w-100'
                      style={{
                        paddingInline:'4px'
                        , paddingLeft:'10px'
                        , paddingRight:'12px'
                        , paddingBottom:'4px'
                      }}
                  >

                    <div className='d-flex w-100'>
                      
                        <img alt={file.name} src={file.objectURL} width={50} />

                        <div className='d-flex w-100'>
                            <div className='d-flex flex-column align-items-start ms-3 w-100' style={{wordBreak:'break-all'}}>

                                <span style={{fontSize:'14px', textAlign:'left', lineHeight:'normal'}} className='fit-item-template-filename'>{file.name}</span>
                                <div className='d-flex align-items-center justify-content-between w-100'>
                                    <Tag value={props.formatSize} severity={'warning'} style={{fontSize:'11px', marginTop:'3px'}} />
                                </div>

                            </div>
                            
                            <div className='d-flex align-items-center ms-auto'>
                                <ButtonPrime style={{border:'none'}} className={`fit-item-template-delete-oneitem p-button-text p-button-custom-flat `+
                                                                `fit-upload-image-single ${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? 'fit-uploadsingle-image-disabled':''}`}
                                    icon="pi pi-trash" severity='danger' 
                                    disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                    onClick={()=>handleOnRemoveFileUploadMultiple(file, obj_input, props.onRemove)}
                                    // onClick={props.onRemove}
                                />
                            </div>
                        </div>

                    </div>

                  </div>
              // )
              )
            )
          }
          
          {
              obj_input?.['type'] === 'fileupload-image-single' && (
                // obj_input?.['format']?.['type'] === 'Document' && (
                  file?.type && !file?.type.startsWith('image/') && (
  
                    <div className='d-flex align-items-center w-100'
                          style={{
                            paddingInline:'12px',
                            paddingBlock:'10px',
                            borderRadius:'11px',
                            backgroundColor: ext_file === '.txt' ? '#67617342':
                                              ext_file === '.doc' ? '#4e92df42':
                                              ext_file === '.xls' ? '#4d9d7642':
                                              ext_file === '.xlsx' ? '#00733b42':
                                              ext_file === '.csv' ? '#31d68542':
                                              ext_file === '.docx' ? '#008bf542':
                                              ext_file === '.ppt' ? '#e9714f42':
                                              ext_file === '.pptx' ? '#e0330342':''
                          }}
                    >
  
                      <div className='d-flex align-items-center w-100'>
                        
                          <div style={{backgroundColor: ext_file === '.txt' ? '#676173a1':
                                                      ext_file === '.doc' ? '#4e92dfa1':
                                                      ext_file === '.xls' ? '#4d9d76a1':
                                                      ext_file === '.xlsx' ? '#00733ba1':
                                                      ext_file === '.csv' ? '#31d685a1':
                                                      ext_file === '.docx' ? '#008bf5a1':
                                                      ext_file === '.ppt' ? '#e9714fa1':
                                                      ext_file === '.pptx' ? '#e0330342':''

                                    ,borderRadius:'50%', width:'40px', height:'40px'
                                }}
                                className='d-flex justify-content-center align-items-center'
                          >
                            <img alt={file.name} src={
                                    ext_file === '.txt' ? Ext_Txt : 
                                    ext_file === '.doc' ? Ext_Doc : 
                                    ext_file === '.xls' ? Ext_Xls : 
                                    ext_file === '.xlsx' ? Ext_Xlsx : 
                                    ext_file === '.csv' ? Ext_Csv :
                                    ext_file === '.docx' ? Ext_Docx :
                                    ext_file === '.ppt' ? Ext_Ppt :
                                    ext_file === '.pptx' ? Ext_Pptx : undefined
                                } 
                                width={28} height={28} />
                          </div>
  
                          <div className='d-flex align-items-center w-100'>
                              <div className='d-flex flex-column align-items-start ms-3 w-100' style={{wordBreak:'break-all'}}>
  
                                  <span style={{fontSize:'14px', textAlign:'left', lineHeight:'normal'}} className='fit-item-template-filename'>{file.name}</span>
                                  <div className='d-flex align-items-center justify-content-between w-100'>
                                      {/* <Tag value={props.formatSize} severity={'warning'} style={{fontSize:'11px', marginTop:'3px'}} /> */}

                                      {
                                        (typeof file?.id !== 'undefined' && file?.id !== null) ?
                                        // data dari edit
                                          <Tag value={file.size_from_db + ' ' + file.size_unit_from_db} severity={'warning'} style={{fontSize:'11px', marginTop:'3px'}} />
                                          :
                                          // data baru
                                          <Tag value={props.formatSize} severity={'warning'} style={{fontSize:'11px', marginTop:'3px'}} />
                                      }
                                      
                                  </div>
  
                              </div>
                              
                              <div className='d-flex align-items-center ms-auto'>
                                  <ButtonPrime style={{border:'none'}} className={`fit-item-template-delete-oneitem p-button-text p-button-custom-flat `+
                                                                  `fit-upload-image-single ${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? 'fit-uploadsingle-image-disabled':''}`}
                                      icon="pi pi-trash" severity='danger' 
                                      tooltip='Delete Item'
                                      tooltipOptions={{position:'bottom'}}
                                      disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                      onClick={()=>handleOnRemoveFileUploadMultiple(file, obj_input, props.onRemove)}
                                      // onClick={props.onRemove}
                                  />
                              </div>
                          </div>
  
                      </div>
  
                    </div>
                  )
              )
              // )
          }

      </div>
    )
  }

  const handleBeforeSelectUploadMultiple = (e, obj_input:FormTemplateDataInputType) => {
    // console.log("BEFORE SELECT")

    // *** Validasi file yang invalid terlebih dahulu sebelum ke onSelect
    const input_type = obj_input?.['type'];

    if (input_type === 'fileupload-image-single') {
      const format_type = obj_input?.format?.type;
      const format_ext:any = obj_input?.format?.ext || [];
      
      const files = e.originalEvent.target.files;

      if (Array.from(files).length > 0)
      {

        const invalidFiles = Array.from(files as File[]).filter((file:File)=>{
  
            if (format_type === 'Image'){
              if (typeof format_ext === 'string' && format_ext === 'image/*'){

                let checkImage = (file.type).startsWith('image/');
                if (!checkImage){
                    return true;
                }
              }
              else if (Array.isArray(format_ext)) {
                  let get_ext_selected_file = ('.' + file.type.toString().replace('image/','')) as UploadFormatExtensionImages;  // jpg, png .., bisa jadi ada ekstensi yang tidak ada dalam 'UploadFormatExtensionImages'
                  if (!format_ext.includes(get_ext_selected_file)) {
                    return true
                  }
              }
            }
            else if (format_type === 'Document'){

              let final_ext:any = convertDocumentExtTypeShort(file.type);
              if (final_ext === null){
                return true
              }
              else {
              
                  let config_format_ext = format_ext as UploadFormatExtensionDocument[]; // .csv, .doc, ...
                  if (config_format_ext.length > 0){
                  
                      if (!config_format_ext.includes(final_ext)){
                        return true;
                      }
                  }

              }
            }

            return false; // sisa nya dianggap valid
        })

        // * Periksa ekstensi file yang invalid
        if (invalidFiles.length > 0){
          const invalidFilesJoin = invalidFiles.map((f:any)=>'"' + f.name + '"').join(', ') // gabung semua nama file invalid
          toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`File berikut tidak valid : '${invalidFilesJoin}' !`, life:2000});
          console.log(invalidFilesJoin)
          return false;
        }

        // * Maksimal Total size sebagai threshold
        const max_size_in_byte = obj_input?.['max_size_in_byte'];

        if (typeof max_size_in_byte !== 'undefined' && max_size_in_byte !== null)
        {
            // * Total size saat ini yang ada di daftar
            let current_total_size:number = Number(objUploadSizeLimit?.[obj_input?.['name']].size_in_byte ?? 0);
            
            // * Total Size dari Popup upload
            const total_size_from_popup = Array.from(files as File[])
                                            .reduce((acc:number, file:File)=>{
                                                  return acc + file.size;
                                          },0)
            
            const total_size_check = current_total_size + Number(total_size_from_popup);

            if (total_size_check > max_size_in_byte)
            {
                toastProsesRef?.current.show({severity:'error', summary: 'Error', detail:`Total Size terpilih `+
                                            `'${convertSizeToUnit(total_size_check, 1)?.size} ${convertSizeToUnit(total_size_check, 1)?.unit}' melebihi batas yaitu `+
                                            `'${convertSizeToUnit(max_size_in_byte, 1)?.size} ${convertSizeToUnit(max_size_in_byte, 1)?.unit}' !`
                                            , life:2000});
                return false;
            }
        }



        // * Periksa Total size tidak boleh melebihi threshold (max-size)
        // console.error("FilESSS")
        // console.log("ANgka sekarang : " + objUploadSizeLimit?.[obj_input?.['name']].size_in_byte)
        // console.log(files)



        return true;

        // *** Jika valid, akan di teruskan ke event onSelect

      }

    }

  }



  const handleFileUploadOnSelect = (e, obj_input:FormTemplateDataInputType) => {

    // *** Event setelah onBeforeSelect
    const files = e.files;
    
    // console.log('SELECT FILES')
    // console.log(files)

    // files.forEach(element => {
    //   console.log("Existing")
    //   console.log(element)
    // });

    const input_type = obj_input?.['type'];

    if (input_type === 'fileupload-image-single') {

        // const format_type = obj_input?.format?.type;
        // const format_ext = obj_input?.format?.ext;

        if (Array.isArray(files) && files.length > 0){

            let total_bytes:number = 0;

                // *** Penamaan key ketika mau di emit keluar
            let save_key_name = obj_input?.['save']?.['key_name'];
              let save_key_file_id = obj_input?.['save']?.['obj_props']?.['key_file_id'];
              let save_key_file_cid = obj_input?.['save']?.['obj_props']?.['key_file_cid'];
              let save_key_file_name = obj_input?.['save']?.['obj_props']?.['key_file_name'];
              let save_key_file_size = obj_input?.['save']?.['obj_props']?.['key_file_size'];
              let save_key_file_type = obj_input?.['save']?.['obj_props']?.['key_file_type'];
              let save_key_file_status = obj_input?.['save']?.['obj_props']?.['key_file_status'];
              let save_key_file_size_unit = obj_input?.['save']?.['obj_props']?.['key_file_size_unit']; // B, KB, GB

            // *** Nama Versi Edit
            let edit_key_status = obj_input?.edit;  // apakah ada key edit
              let edit_key_name:any = obj_input?.edit?.key_name;
              let edit_props_id:any = obj_input?.edit?.obj_props?.id;
              let edit_props_name:any = obj_input?.edit?.obj_props?.file_name;
              let edit_props_size:any = obj_input?.edit?.obj_props?.file_size;
              let edit_props_type:any = obj_input?.edit?.obj_props?.file_type;
              let edit_props_unit:any = obj_input?.edit?.obj_props?.file_unit;
              let edit_props_url:any = obj_input?.edit?.obj_props?.file_url;
      
              // *** Tambahan key value baru dalam files
            
              files.forEach((file)=>{
                
                const generateUUID = uuidv7();

                if ((typeof file?.['cid'] === 'undefined' || file?.['cid'] === null)
                    && (typeof file?.['id'] === 'undefined' || file?.['id'] === null) 
                  )
                {

                  file['cid'] = generateUUID;

                  const reader = new FileReader();
                  reader.readAsDataURL(file);
  
                  reader.onloadstart = () => {

                    let temp_data_change = refDataChange.current?.[save_key_name];
                    
                    let obj_size = convertSizeToUnit(file.size);
                  
    
                    if (typeof temp_data_change === 'undefined' || temp_data_change === null){
                      // * Karena key name nya belum pernah di simpan, maka set data awal
                      refDataChange.current = {
                        ...refDataChange.current,
                        [save_key_name]: [
                                            {
                                                  [save_key_file_id]:null
                                                , [save_key_file_cid]:generateUUID
                                                , [save_key_file_name]: file.name
                                                , [save_key_file_size]: obj_size?.size ?? null
                                                , [save_key_file_type]: file?.type ?? null
                                                , [save_key_file_size_unit]: obj_size?.unit ?? null
                                                , [save_key_file_status]: 'NEW'
                                            }
                                        ]
                      }
  
                    }
                    else {
    
                      refDataChange.current = {
                        ...refDataChange.current,
                        [save_key_name]: [
                                            ...refDataChange.current[save_key_name],
                                            {
                                                  [save_key_file_id]:null
                                                , [save_key_file_cid]:generateUUID
                                                , [save_key_file_name]: file.name
                                                , [save_key_file_size]: obj_size?.size ?? null
                                                , [save_key_file_type]: file?.type ?? null
                                                , [save_key_file_size_unit]: obj_size?.unit ?? null
                                                , [save_key_file_status]: 'NEW'
                                            }
                                        ]
                      }
  
                    }

                    if (typeof edit_key_status !== 'undefined')
                    {
                        
                        let edit_objectURL:any = null;
                        edit_objectURL = URL.createObjectURL(file);
                        
                        if (typeof refDataEditChange.current?.[edit_key_name] !== 'undefined')
                        {
                            refDataEditChange.current = {
                                ...refDataEditChange.current,
                                [edit_key_name]:[
                                            ...refDataEditChange.current?.[edit_key_name],
                                            {
                                                  [edit_props_id]: null // hanya sebagai pengenal id (untuk hapus)
                                                  , ['cid']: generateUUID // hanya sebagai pengenal id (untuk hapus)
                                                  , [edit_props_name]: file.name
                                                  , [edit_props_type]: file?.type
                                                  , [edit_props_size]: obj_size?.size ?? null
                                                  , [edit_props_unit]: obj_size?.unit ?? null
                                                  , [edit_props_url]: edit_objectURL ?? null
                                            }
                                ]
                            }
                        }
                        else {
                            refDataEditChange.current = {
                                ...refDataEditChange.current,
                                [edit_key_name]:[
                                            {
                                                  [edit_props_id]: null
                                                  , ['cid']: generateUUID
                                                  , [edit_props_name]: file.name
                                                  , [edit_props_type]: file?.type
                                                  , [edit_props_size]: obj_size?.size ?? null
                                                  , [edit_props_unit]: obj_size?.unit ?? null
                                                  , [edit_props_url]: edit_objectURL ?? null
                                            }
                                ]
                            }
                        }
                    }
  
                    // *** Lanjut Simpan ke FormDataRef
                    // ---type here---
                    if (formDataRef && formDataRef.current === null){
                      formDataRef.current = new FormData();
                      formDataRef.current.append('data', JSON.stringify(refDataChange.current));
                      formDataRef.current.append(generateUUID.toString(), file);
                    }
                    else if (formDataRef.current !== null) {
                      formDataRef.current.set('data', JSON.stringify(refDataChange.current));
                      formDataRef.current.set(generateUUID, file);
                    }
                    // ....
                    // console.log(file.size);
                  }
  
                  reader.onloadend = () => {
  
                    console.log("Data Upload")
                    console.log(refDataChange.current)

                    
                    // if (formDataRef && formDataRef.current) {
                    //   console.error("DARI SINI")
                    //   formDataRef.current.forEach((value, key)=>{
                    //     if (key === 'data' && typeof value === 'string'){
                    //       console.log(key)
                    //       console.log(value)
                    //     }
                    //     else {
                    //       console.log(value)
                    //     }
                    //   })
                    // }

                    outDataChange_StatusProses.current = 'process_out_change';
                    outDataChange({data:{...refDataChange.current}, 
                                  data_with_key_edit:{...refDataEditChange.current},
                                  posisi_name_input_when_onchange: obj_input?.['name'], 
                                  status_proses:'process_out_change'}, formDataRef.current);

                  }
                }

                if (typeof file?.id !== 'undefined' && file?.id !== null){
                  total_bytes += file.size_bytes_from_db;
                }
                else {
                  total_bytes += file.size;
                }
                
              })


              let obj_size_to_unit = convertSizeToUnit(total_bytes, 0)

              setObjUploadSizeLimit((prev:any)=>{
                return {
                  ...prev,
                  [obj_input?.['name']]: {
                    ...prev[obj_input?.['name']],
                    size_in_byte: total_bytes,
                    size: obj_size_to_unit?.['size'],
                    size_unit: obj_size_to_unit?.['unit']
                  }
                }
              })

            // console.log("total_bytes : ", convertSizeToUnit(total_bytes, 0))
            
        }

    }

  }


  return (
    <div className={`fit-container`}>
        
        {
            dataContext !== null && (
              <h1>{JSON.stringify(dataContext,null,2)}</h1>
            )
        }

        {loading && (
            <div className={`d-flex justify-content-center align-items-center ${styles['fit-loading']}`}>
              <Bars width='80' height='80' visible={loading} color='#4fa94d'/>
            </div>
        )}

        {/* *** Kondisi ---ERROR---  */}
        {
          !loading &&
          arrErrorConfig.length > 0 && (
            <div className={`d-flex justify-content-center align-items-center`}>
              <img src={Bug} width = {300} height={300}/>
            </div>  
          )
        }
        {
          !loading &&
          arrErrorConfig && arrErrorConfig.length > 0 && arrErrorConfig.map((obj, idx)=>{
            return (
              <div key={`err-config-${idx}`} className='mb-1 d-flex justify-content-center'>
                <Message severity='error' text={obj?.['description']} />
              </div>
            )
          })
        }
        {/* *** End ---ERROR--- */}


        {/* *** Kondisi --- TIDAK ERROR dan TIDAK LOADING --- */}

        {
          arrErrorConfig.length === 0 && (

              propertyConfig && Array.isArray(propertyConfig) && (

                  <>
                    {/* New Data */}
                    {
                      // * kalau selain Form seperti modal, tidak perlu tampilkan header Form
                      props?.type === 'Form' && (

                          <div className={`fit-header d-flex align-items-center justify-content-between `+
                                            `${loading ? 'fit-header-none':''}`}
                                  style={{marginBottom:'20px'}}>
                              <div>
                                  <h4 style={{fontFamily:'Nunito, Arial', fontWeight:700, fontSize:'18px', color:'#092C4C', marginBottom:'5px'}}>New Data</h4>
                                  <h6 style={{fontWeight:400, fontSize:'14px', color:'#495057'}}>Create New Data</h6>
                              </div>

                              <ButtonPrime style={{height:'38px', padding:'10px', boxShadow:'none', backgroundColor:'#092C4C', border:'transparent'}}>
                                  <IconField className='pi pi-arrow-left ' style={{marginLeft:'5px', marginRight:'10px', fontSize:'12px'}} />
                                  <span style={{fontSize:'14px',fontWeight:700, fontFamily:'Nunito'}}>Back to List</span>
                              </ButtonPrime>
                          </div>
                      )
                    }
                    {/* --- New Data */}

                    <div className={`${typeof style?.show_border === 'undefined' || style?.show_border === true ? 'fit-section' : ''} `}
                          style={{display:loading ? 'none' : 'block'}}>
                        
                      {
                        propertyConfig.map((obj_section, idx_section)=>{
          
                            return (
                              <div key={`fit-section-${idx_section}`} 
                                  // className={`${typeof obj_section?.['show_border'] === 'undefined' ? 'fit-section' : !obj_section?.['show_border'] ? '' : 'fit-section'} `}   
                                  // style={{display:loading ? 'none' : 'block'}}
                              >
                                    {
                                        obj_section['data_column'] && Array.isArray(obj_section['data_column']) && (
                                            <>
                                                {/* Banner Header Label Per Section */}
                                                {
                                                    typeof obj_section?.props?.header?.show !== 'undefined' &&
                                                    obj_section?.props?.header?.show && (

                                                          <div className='d-flex flex-column' 
                                                              style={{margin:'0 5px 20px 5px'}}
                                                              ref={(e)=>handleSectionRender(e, `ref-section-${idx_section}`)}
                                                          >

                                                                <div className='d-flex justify-content-between align-items-center'>

                                                                    <h5 className='d-flex align-items-center gap-2' style={{margin:0}}>
                                                                      {
                                                                        typeof obj_section?.props?.header?.icon !== 'undefined' && (

                                                                          // * Icon Title
                                                                          obj_section?.props?.header?.icon

                                                                          // <IconField className='pi pi-info-circle' style={{color:'#FF9F43'}} />
                                                                        )
                                                                      }


                                                                      {/* <span style={{fontSize:'16px', fontWeight:600}}>Product Information</span> */}
                                                                      
                                                                        <span style={{fontSize:'16px', fontWeight:600}}>{obj_section?.props?.header?.title || ''}</span>
                                                                      
                                                                    </h5>

                                                                    <ButtonPrime className='fit-button-custom-angle p-button-custom-flat p-button-outlined d-flex justify-content-center align-items-center'
                                                                              onClick={(e)=>handleClickSectionArrow(e, `ref-section-${idx_section}`)}>

                                                                        <span className='pi pi-angle-down' style={{fontSize:'15px', color:'#FF9F43', fontWeight:900}}></span>
                                                                    </ButtonPrime>
                                                                    
                                                                </div>

                                                                {/* garis border bottom sebagai divider */}
                                                                <div style={{borderBottom:'1px solid rgba(145, 158, 171, 0.3)', padding:'15px 0 0 0'}}></div>

                                                          </div>
                                                    )
                                                }

                                                {/* --- */}
                                                <div className='fit-section-input-cont' style={{overflow:'hidden', paddingInline:'5px'}}>

                                                    <div className={`row ${obj_section?.['class_add'] ?? ''}`}
                                                        >

                                                        {
                                                          obj_section['data_column'].map((obj_column, idx_column)=>{
                                                              return (
                                                                  <div key={`fit-column-${idx_column}`} className={`col-${obj_column['to']}` + 
                                                                            ` ${obj_column?.['breakpoint']?.['to_sm'] ? `col-sm-${obj_column['breakpoint']['to_sm']}` : ``}`+
                                                                            ` ${obj_column?.['breakpoint']?.['to_md'] ? `col-md-${obj_column['breakpoint']['to_md']}` : ``}`+
                                                                            ` ${obj_column?.['breakpoint']?.['to_lg'] ? `col-lg-${obj_column['breakpoint']['to_lg']}` : ``}`+
                                                                            ` ${obj_column?.['breakpoint']?.['to_xl'] ? `col-xl-${obj_column['breakpoint']['to_xl']}` : ``}`
                                                                        }
                                                                  >
                                                                      
                                                                        <div className={`row`}>
                  
                                                                            {
                                                                                  obj_column['data_input'] && Array.isArray(obj_column['data_input']) && (
                  
                                                                                      obj_column['data_input'].map((obj_input,idx_input)=>{
                  
                                                                                          return (
                                                                                            <div key={`fit-input-${idx_input}`} className={`col-12`}>
                                                                                                  {
                                                                                                    obj_input['type'] == 'text' && (
                  
                                                                                                        <Form.Group className={`mb-2`}>


                                                                                                              <div className={`${
                                                                                                                                    ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true) &&
                                                                                                                                    (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true)) 
                                                                                                                                        ? 'p-inputgroup':
                                                                                                                                    ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                      && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                      && !statusWindowMobile
                                                                                                                                    ) ? 'p-inputgroup' : ''
                                                                                                                                }`}

                                                                                                                  style={{height: 
                                                                                                                              ((typeof obj_input?.['style']?.input_group !== 'undefined' && obj_input?.['style']?.input_group?.enabled === true) &&
                                                                                                                              (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true))
                                                                                                                                  ? 'auto':
                                                                                                                              ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                        && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                        && !statusWindowMobile
                                                                                                                              ) ? 'auto':''
                                                                                                                          }}
                                                                                                              >

                                                                                                                <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                      ` ${
                                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true) &&
                                                                                                                                            (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true)) 
                                                                                                                                                ? 'p-inputgroup-addon':
                                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                              && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                              && !statusWindowMobile
                                                                                                                                            ) ? 'p-inputgroup-addon' : ''
                                                                                                                                        }` +
                                                                                                                                      ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                                                      
                                                                                                                <Form.Control type="text" className={`fit-modal-input-placeholder fit-input-text-theme-amber`}
                                                                                                                                  style={{
                                                                                                                                          backgroundColor: obj_input?.['style']?.['background_color'] ?? ''
                                                                                                                                          , color: (objDisabled?.[obj_input?.['index']] ? 'grey' : '') // jika required dan disabled maka warna 'grey'
                                                                                                                                  }}
                                                                                                                                  placeholder={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input['placeholder']?.toString()} // jika disabled, maka placeholder di kosongkan
                                                                                                                                  ref={inputRefs[obj_input?.['index']]}
                                                                                                                                  onBlur={()=>funcBlurInput(obj_input?.['index'], obj_input)}
                                                                                                                                  name={obj_input['name']}
                                                                                                                                  maxLength={obj_input?.['max_length'] ?? -1}
                                                                                                                                  disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                                  autoComplete={`off`}
                                                                                                                                  autoCapitalize='off'
                                                                                                                                  autoCorrect='off'
                                                                                                                                  spellCheck='false'
                                                                                                                                  onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)}
                                                                                                                                  />
                                                                                                            </div>
                  
                                                                                                              {
                                                                                                                  obj_input?.['required'] &&
                                                                                                                  invalidInput?.[obj_input?.['index']] && (
                                                                                                                      <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                          <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                      </div>
                                                                                                                  )
                                                                                                              }
                                                                                                        </Form.Group>
                  
                                                                                                    )
                                                                                                  }

                                                                                                  {
                                                                                                    obj_input['type'] === 'date' && (
                                                                                                      <Form.Group className={`mb-2`}>

                                                                                                        
                                                                                                          <div className={`${
                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true) &&
                                                                                                                            (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true)) 
                                                                                                                                ? 'p-inputgroup':
                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                              && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                              && !statusWindowMobile
                                                                                                                            ) ? 'p-inputgroup' : ''
                                                                                                                        }`}

                                                                                                                style={{height: 
                                                                                                                    ((typeof obj_input?.['style']?.input_group !== 'undefined' && obj_input?.['style']?.input_group?.enabled === true) &&
                                                                                                                    (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true))
                                                                                                                        ? 'auto':
                                                                                                                    ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                              && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                              && !statusWindowMobile
                                                                                                                    ) ? 'auto':''
                                                                                                                }}
                                                                                                            >
                                                                                                                  
                                                                                                              <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                        ` ${
                                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true) &&
                                                                                                                                            (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true)) 
                                                                                                                                                ? 'p-inputgroup-addon':
                                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                              && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                              && !statusWindowMobile
                                                                                                                                            ) ? 'p-inputgroup-addon' : ''
                                                                                                                                        }` +
                                                                                                                                      ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>


                                                                                                              <div className={`d-flex justify-content-start align-items-stretch ${styles['ppe-anly-datepicker-container']} w-100`}>

                                                                                                                      {/* <DateRangeRounded className={`${styles['ppe-anly-datepicker-icon']}`}/> */}
                                                                                                                      <span className={`pi pi-calendar-clock ${styles['ppe-anly-datepicker-icon']}`}></span>

                                                                                                                      <div className={`d-flex align-items-stretch ppe-anly-datepicker-parent fit-input-date-theme-amber`}>
                                                                                                                          <ReactDatePicker 
                                                                                                                                ref={inputRefs[obj_input?.['index']]}
                                                                                                                                // className={`${obj_input?.['index']}`}
                                                                                                                                selected={objInputDate?.[obj_input?.['name']]}
                                                                                                                                onChange={(date)=>dateChangePeriod(obj_input?.['save']?.['key_name'], obj_input?.['index'], obj_input, date)}
                                                                                                                                dateFormat={`${obj_input?.['show']?.['format'] ?? `dd MMMM yyyy`}`}
                                                                                                                                // startDate={startDate}
                                                                                                                                // minDate={startDate}
                                                                                                                                // title='End Date'
                                                                                                                                // includeDateIntervals={[
                                                                                                                                //   {start: subDays(new Date(),3), end: new Date()},
                                                                                                                                //   {start: new Date(2024, 10, 1), end: new Date(2024,10,5)}
                                                                                                                                // ]}
                                                                                                                                // excludeDates={[new Date(), new Date(2024,10,23)]}
                                                                                                                                maxDate={new Date(9999,11,31)}  // maksimal 12 desember 9999
                                                                                                                                
                                                                                                                                placeholderText={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                                shouldCloseOnSelect={true}
                                                                                                                                todayButton={`Today`}
                                                                                                                                filterDate={(date: Date)=> {
                                                                                                                                    if (date.getDay() === 0) {
                                                                                                                                      if (obj_input?.['disabled_days']?.['sunday']) 
                                                                                                                                      {
                                                                                                                                          return false;
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                    else if (date.getDay() === 6) {
                                                                                                                                      if (obj_input?.['disabled_days']?.['saturday']) 
                                                                                                                                        {
                                                                                                                                            return false;
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    return true;
                                                                                                                                    // obj_input?.['disabled']?.['sunday'] ? date.getDay() !== 0 : true
                                                                                                                                    // 0 -> Minggu, 6 -> Sabtu
                                                                                                                                }}
                                                                                                                                // renderDayContents={(day, date)=><div>{day}</div>}
                                                                                                                                onBlur={()=>funcBlurInput(obj_input?.['index'], obj_input)}
                                                                                                                                showMonthDropdown
                                                                                                                                showYearDropdown
                                                                                                                                showMonthYearPicker={obj_input?.['show']?.['month_year_picker'] ?? false}
                                                                                                                                disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                                // showDisabledMonthNavigation
                                                                                                                          />


                                                                                                                      </div>
                                                                                                              </div>

                                                                                                          </div>
                                                                                                                          
                                                                                                          
                                                                                                                                  
                                                                                                          {
                                                                                                              obj_input?.['required'] &&
                                                                                                              invalidInput?.[obj_input?.['index']] && (
                                                                                                                  <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                      <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                  </div>
                                                                                                              )
                                                                                                          }

                                                                                                      </Form.Group>
                                                                                                    )
                                                                                                  }

                                                                                                  {
                                                                                                        obj_input['type'] === 'number' && (
                                                                                                          <Form.Group className={`mb-2`}>
                                                                                                              <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                      ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                              <div>
                                                                                                                  <NumericFormat 
                                                                                                                    style={{background: objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '#e9ecef' : ''}}
                                                                                                                    className='fit-input-number fit-input-number-placeholder fit-input-number-theme-amber'
                                                                                                                    value={objInputNumber?.[obj_input?.name]}
                                                                                                                    decimalScale={obj_input?.rules?.decimal_scale ?? 7}
                                                                                                                    decimalSeparator=','
                                                                                                                    disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                    thousandSeparator={'.'}
                                                                                                                    placeholder={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                    isAllowed={(values)=>{
                                                                                                                      const {floatValue} = values;

                                                                                                                      let rules_min = obj_input?.rules?.min;
                                                                                                                      let rules_max = obj_input?.rules?.max;

                                                                                                                      if (typeof rules_min !== 'undefined'){
                                                                                                                        if ((floatValue??0) < rules_min){
                                                                                                                          return false;
                                                                                                                        }
                                                                                                                      }

                                                                                                                      if (typeof rules_max !== 'undefined'){
                                                                                                                        if ((floatValue??0) > rules_max) {
                                                                                                                          return false;
                                                                                                                        }
                                                                                                                      }

                                                                                                                      return true;
                                                                                                                    }}
                                                                                                                    onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)}
                                                                                                                    onBlur={()=>funcBlurInput(obj_input?.['index'], obj_input)}
                                                                                                                  />
                                                                                                              </div>
                                                                                                              {
                                                                                                                  obj_input?.['required'] &&
                                                                                                                  invalidInput?.[obj_input?.['index']] && (
                                                                                                                      <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                          <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                      </div>
                                                                                                                  )
                                                                                                              }

                                                                                                          </Form.Group>
                                                                                                        )
                                                                                                  }

                                                                                                  {
                                                                                                        obj_input['type'] === 'multi-select' && (
                                                                                                          <Form.Group className={`mb-2`}>

                                                                                                              <div className={`${
                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true) &&
                                                                                                                            (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true)) 
                                                                                                                                ? 'p-inputgroup':
                                                                                                                            ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                              && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                              && !statusWindowMobile
                                                                                                                            ) ? 'p-inputgroup' : ''
                                                                                                                        }`}

                                                                                                                  style={{height: 
                                                                                                                      ((typeof obj_input?.['style']?.input_group !== 'undefined' && obj_input?.['style']?.input_group?.enabled === true) &&
                                                                                                                      (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true))
                                                                                                                          ? 'auto':
                                                                                                                      ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                && !statusWindowMobile
                                                                                                                      ) ? 'auto':''
                                                                                                                  }}
                                                                                                              >

                                                                                                                  <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                          ` ${
                                                                                                                                                ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true) &&
                                                                                                                                                (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true)) 
                                                                                                                                                    ? 'p-inputgroup-addon':
                                                                                                                                                ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                                  && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                                  && !statusWindowMobile
                                                                                                                                                ) ? 'p-inputgroup-addon' : ''
                                                                                                                                            }` +
                                                                                                                                          ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                                
                                                                                                                  <div className='w-100'>
                                                                                                                          
                                                                                                                              <MultiSelect
                                                                                                                                  ref={inputRefs[obj_input?.['index']]}
                                                                                                                                  options={objDataMultiSelect?.[obj_input?.['index']]}
                                                                                                                                  value={objSelected_MultiSelect?.[obj_input?.['index']] || []}
                                                                                                                                  onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)}
                                                                                                                                  optionLabel='name'  // yang tampil di item 'id' atau 'name'
                                                                                                                                  disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                                  filter
                                                                                                                                  showClear
                                                                                                                                  loading={false}
                                                                                                                                  resetFilterOnHide   // reset filter ketika sudah hide
                                                                                                                                  className='w-100 fit-custom-multiselect-prime d-flex align-items-center' //custom-multiselect-prime
                                                                                                                                  showSelectAll={obj_input?.['select_item_type'] === 'multiple' ? true : false}
                                                                                                                                  maxSelectedLabels={3} // setelah 3 akan di rekap '3 items selected'
                                                                                                                                  placeholder={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                                  style={{
                                                                                                                                          // height:'37.78px'
                                                                                                                                          height: 
                                                                                                                                                  ((typeof obj_input?.['style']?.input_group !== 'undefined' && obj_input?.['style']?.input_group?.enabled === true) &&
                                                                                                                                                  (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true))
                                                                                                                                                      ? '100%':
                                                                                                                                                  ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                                            && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                                            && !statusWindowMobile
                                                                                                                                                  ) ? '100%':'37.78px'
                                                                                                                                          ,borderRadius: 
                                                                                                                                                  ((typeof obj_input?.['style']?.input_group !== 'undefined' && obj_input?.['style']?.input_group?.enabled === true) &&
                                                                                                                                                  (typeof obj_input?.style?.input_group?.display?.mobile !== 'undefined' && obj_input?.style?.input_group?.display?.mobile === true))
                                                                                                                                                      ? '0 0.375em 0.375em 0':
                                                                                                                                                  ((typeof obj_input?.style?.input_group?.enabled !== 'undefined' && obj_input?.style?.input_group?.enabled === true)
                                                                                                                                                            && (typeof obj_input?.style?.input_group?.display?.mobile === 'undefined' || obj_input?.style?.input_group?.display?.mobile === false) 
                                                                                                                                                            && !statusWindowMobile
                                                                                                                                                  ) ? '0 0.375em 0.375em 0':''
                                                                                                                                          
                                                                                                                                          , padding: '2px 0px'

                                                                                                                                        // , minWidth:'40px', maxWidth:'250px'
                                                                                                                                        // , lineHeight:'5px'
                                                                                                                                      }}
                                                                                                                              />

                                                                                                                  </div>
                                                                                                                    
                                                                                                                  

                                                                                                              </div>

                                                                                                              
                                                                                                              {
                                                                                                                  obj_input?.['required'] &&
                                                                                                                  invalidInput?.[obj_input?.['index']] && (
                                                                                                                      <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                          <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                      </div>
                                                                                                                  )
                                                                                                              }
                                                                                                          </Form.Group>
                                                                                                        )
                                                                                                  }
                                                                                                  
                                                                                                  {
                                                                                                      obj_input['type'] === 'password' && (
                                                                                                        <Form.Group className={`mb-2`}>
                                                                                                            <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                    ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                            <div>
                                                                                                                <Password 
                                                                                                                    ref={inputRefs[obj_input?.['index']]}
                                                                                                                    disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                    onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)}
                                                                                                                    onBlur={()=>funcBlurInput(obj_input?.['index'], obj_input)}
                                                                                                                    value={objInputPassword?.[obj_input?.['name']] ?? ''}
                                                                                                                    className='w-100 fit-custom-password'
                                                                                                                    toggleMask  // show icon eye
                                                                                                                    placeholder={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                    feedback={obj_input?.['feedback'] ?? false}  // meter (strong, weak, medium)
                                                                                                                />


                                                                                                            </div>
                                                                                                            
                                                                                                            {
                                                                                                                obj_input?.['required'] &&
                                                                                                                invalidInput?.[obj_input?.['index']] && (
                                                                                                                    <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                        <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }
                                                                                                        </Form.Group>
                                                                                                      )
                                                                                                  }

                                                                                                  {
                                                                                                      obj_input['type'] === 'input-switch' && (
                                                                                                        <Form.Group className={`mb-2`}>
                                                                                                            <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                    ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                            
                                                                                                            <div>
                                                                                                                <InputSwitch ref={inputRefs[obj_input?.['index']]} 
                                                                                                                        checked={objInputSwitch?.[obj_input?.['name']]} 
                                                                                                                        disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                        onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)} />
                                                                                                            </div>
                                                                                                            
                                                                                                            {
                                                                                                                obj_input?.['required'] &&
                                                                                                                invalidInput?.[obj_input?.['index']] && (
                                                                                                                    <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                        <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }
                                                                                                        </Form.Group>
                                                                                                      )
                                                                                                  }

                                                                                                  {
                                                                                                      obj_input['type'] === 'email' && (
                                                                                                        <Form.Group className={`mb-2 ${obj_input?.['class'] ?? ''}`}>
                                                                                                            <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                    ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                            
                                                                                                            <div>
                                                                                                                <IconField iconPosition='left'>
                                                                                                                    <InputIcon className='pi pi-inbox' />
                                                                                                                    <InputText
                                                                                                                        ref={inputRefs[obj_input?.['index']]}
                                                                                                                        className='w-100 fit-custom-inputtext'
                                                                                                                        value={objInputTextOthers?.[obj_input?.['name']] ?? ''}
                                                                                                                        disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                        onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)}
                                                                                                                        onBlur={()=>funcBlurInput(obj_input?.['index'], obj_input)}
                                                                                                                        placeholder={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                    />
                                                                                                                </IconField>
                                                                                                            </div>
                                                                                                            
                                                                                                            {
                                                                                                                // obj_input?.['required'] &&
                                                                                                                invalidInput?.[obj_input?.['index']] && (
                                                                                                                    <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                        <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }
                                                                                                        </Form.Group>
                                                                                                      )
                                                                                                  }

                                                                                                  {
                                                                                                      obj_input['type'] === 'chips' && (
                                                                                                        <Form.Group className={`mb-2 ${obj_input?.['class'] ?? ''}`}>
                                                                                                            <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                    ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                            
                                                                                                            <div>
                                                                                                                <IconField iconPosition='left'>
                                                                                                                    <InputIcon className='pi pi-tags' />
                                                                                                                    <Chips
                                                                                                                          ref={inputRefs[obj_input?.['index']]}
                                                                                                                          className='w-100 fit-custom-chips'
                                                                                                                          value={objInputTextOthers?.[obj_input?.['name']] ?? []} 
                                                                                                                          onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)} 
                                                                                                                          placeholder={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                          disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                    />
                                                                                                                </IconField>
                                                                                                            </div>
                                                                                                            
                                                                                                            {
                                                                                                                // obj_input?.['required'] &&
                                                                                                                invalidInput?.[obj_input?.['index']] && (
                                                                                                                    <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                        <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }
                                                                                                        </Form.Group>
                                                                                                      )
                                                                                                  }

                                                                                                  {
                                                                                                      obj_input['type'] === 'fileupload-image-single' && (
                                                                                                        <Form.Group className={`mb-2 ${obj_input?.['class'] ?? ''}`}>
                                                                                                            <Form.Label className={`mb-1 fit-dash-modal-form-label`+
                                                                                                                                    ` ${obj_input?.['required'] ? 'required' : ''}`}>{obj_input['label']}</Form.Label>
                                                                                                            
                                                                                                            <div>
                                                                                                              {
                                                                                                                obj_input?.['type_upload'] === 'single' && (

                                                                                                                  <div className='d-flex fit-uploadfile-custom-gap'>

                                                                                                                      <div style={{
                                                                                                                                  // width:'150px'
                                                                                                                                  // , height:'150px',
                                                                                                                                  backgroundColor:`${obj_input?.['format'].type === 'Document' ?  'transparent' : objFileUpload?.[obj_input?.['name']] !== null ? '#eae9e987' : 'transparent'} `
                                                                                                                                  // , border:`${objFileUpload?.[obj_input?.['name']] && objFileUpload?.[obj_input?.['name']] !== null ? '':'3px dashed lightgrey'}`
                                                                                                                                  , border:`${(objFileUpload?.[obj_input?.['name']] && objFileUpload?.[obj_input?.['name']] !== null) ? '':'3px dashed lightgrey'}`
                                                                                                                                  // , borderRadius: `${typeof obj_input?.['shape'] === 'undefined' || obj_input?.['shape'] === null || obj_input?.['shape'] === 'circle' ? '50%':'0'}`  // secara default 'circle'
                                                                                                                                  , borderRadius: `${obj_input?.['format'].type === 'Document' ? '0' : (typeof obj_input?.['shape'] === 'undefined' || obj_input?.['shape'] === null || obj_input?.['shape']) === 'circle' ? '50%':'0'}`  // secara default 'circle' (note: khusus document dibuat square karena pakai icon extension)
                                                                                                                                }}
                                                                                                                          className={`d-flex justify-content-center align-items-center fit-img-container ${obj_input?.['format'].type === 'Document' ? 'fit-file-document':''} `+
                                                                                                                                  `${(typeof obj_input?.['shape'] === 'undefined' || obj_input?.['shape'] === null || obj_input?.['shape']) === 'circle' ? 'fit-file-shape-circle':'fit-file-shape-square'}`}
                                                                                                                      >
                                                                                                                          {
                                                                                                                            objFileUpload?.[obj_input?.['name']] 
                                                                                                                            && objFileUpload?.[obj_input?.['name']] !== null
                                                                                                                            && (
                                                                                                                              <>
                                                                                                                                      {/* // width="250" height="150"  */}

                                                                                                                                {/* <img src={objFileUpload[obj_input?.['name']]} 
                                                                                                                                    style={{
                                                                                                                                      borderRadius:`${typeof obj_input?.['shape'] === 'undefined' || obj_input?.['shape'] === null || obj_input?.['shape'] === 'circle' ? '50%':'0'}`  // secara default 'circle'
                                                                                                                                    }} /> */}
                                                                                                                                
                                                                                                                                <Image src={objFileUpload[obj_input?.['name']]} alt="Image" 
                                                                                                                                    preview
                                                                                                                                    imageStyle={{borderRadius:`${typeof obj_input?.['shape'] === 'undefined' || obj_input?.['shape'] === null || obj_input?.['shape'] === 'circle' ? '50%':'0'}`}}
                                                                                                                                    loading='lazy'
                                                                                                                                    className='fit-p-image-upload-preview-custom'
                                                                                                                                    closeOnEscape={true}
                                                                                                                                    />
                                                                                                                              </>
                                                                                                                            )
                                                                                                                          }

                                                                                                                          {
                                                                                                                            (
                                                                                                                              ( !objFileUpload?.[obj_input?.['name']] 
                                                                                                                                  || objFileUpload?.[obj_input?.['name']] === null
                                                                                                                              ) && (obj_input?.['type_upload'] === 'single')
                                                                                                                            )
                                                                                                                            && (
                                                                                                                              <>
                                                                                                                              {/* Komponen dibawah terletak pada Image yang belum ada gambar agar pada saat diklik akan muncul file dialog choose file */}
                                                                                                                                    <FileUpload 
                                                                                                                                          ref={inputRefs[obj_input?.['index']]}
                                                                                                                                          mode='basic'
                                                                                                                                          name={`${obj_input?.['name']}[]`}
                                                                                                                                          // accept='image/*'
                                                                                                                                          accept={`${Array.isArray(obj_input?.format?.ext) ? obj_input?.format?.ext.join(',') : obj_input?.format?.ext}`}
                                                                                                                                          // accept='.csv, .txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx'

                                                                                                                                          auto  // agar tulisan button tidak tertimpa dengan nama file
                                                                                                                                          chooseLabel='Browse'
                                                                                                                                          
                                                                                                                                          chooseOptions={{className:'fit-icon-image-upload d-flex justify-content-center p-button-outlined'
                                                                                                                                                , icon:'pi pi-image', iconOnly: true}}
                                                                                                                                          
                                                                                                                                          className='fit-icon-image-upload'
                                                                                                                                          // maxFileSize={2979}
                                                                                                                                          customUpload  // agar tulisan button tidak tertimpa dengan nama file
                                                                                                                                          // chooseOptions={{icon:" ", iconOnly: false, className:''}} // hilangkan icon
                                                                                                                                          uploadHandler={(event)=>{customUploadSingleFileHandler(event, obj_input?.['index'], obj_input)}}
                                                                                                                                          // onSelect={(event)=>{fileUploadSingle_Select(event, obj_input?.['index'])}}
                                                                                                                                          disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                                      />

                                                                                                                              {/* <span className='pi pi-image' style={{fontSize:'60px', color:'darkgrey'}}></span> */}
                                                                                                                              </>
                                                                                                                            )
                                                                                                                          }
                                                                                                                      </div>

                                                                                                                      <div className='d-flex fit-uploadfile-cont' style={{border:'none', minWidth:0, width:'100%'}}>

                                                                                                                            {
                                                                                                                              (obj_input?.['type_upload'] === 'single') && (

                                                                                                                                  <div className='d-flex align-items-center fit-uploadfile-info-cont' style={{
                                                                                                                                          // width:'65%'
                                                                                                                                          overflow:'hidden'}}>

                                                                                                                                      <div className='d-flex flex-column' style={{width:'95%'}}>
                                                                                                                                          {/* Tombol Browse */}
                                                                                                                                            <FileUpload 
                                                                                                                                                ref={inputRefs[obj_input?.['index']]}
                                                                                                                                                mode='basic'
                                                                                                                                                // emptyTemplate={<p>Drag dan drop di sini </p>} // jangan set mode ke 'basic' jika aktifkan fitur ini 
                                                                                                                                                name={`${obj_input?.['name']}[]`}
                                                                                                                                                // accept='image/*'1
                                                                                                                                                accept={`${Array.isArray(obj_input?.format?.ext) ? obj_input?.format?.ext.join(',') : obj_input?.format?.ext}`}
                                                                                                                                                auto  // agar tulisan button tidak tertimpa dengan nama file
                                                                                                                                                chooseLabel='Browse'
                                                                                                                                                chooseOptions={{className:'p-button-outlined'}}
                                                                                                                                                // maxFileSize={2979}
                                                                                                                                                customUpload  // agar tulisan button tidak tertimpa dengan nama file
                                                                                                                                                // chooseOptions={{icon:" ", iconOnly: false, className:''}} // hilangkan icon
                                                                                                                                                uploadHandler={(event)=>{customUploadSingleFileHandler(event, obj_input?.['index'], obj_input)}}
                                                                                                                                                // onSelect={(event)=>{fileUploadSingle_Select(event, obj_input?.['index'])}}
                                                                                                                                                disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                                            />



                                                                                                                                            {
                                                                                                                                              objFileUploadDescription?.[obj_input?.['name']]?.name && (
                                                                                                                                                  <div style={{color:'grey', fontSize:'15px', fontStyle:'normal', fontFamily:'Nunito, Arial'}} className='mt-2'>
                                                                                                                                                      <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                                                                                                                                        <span style={{fontWeight:'bold'}}>Filename :</span> <span>{objFileUploadDescription?.[obj_input?.['name']]?.name ?? ''}</span></div>

                                                                                                                                                      <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                                                                                                                                            <span style={{fontWeight:'bold'}}>Size : </span> 
                                                                                                                                                            <span>{objFileUploadDescription?.[obj_input?.['name']]?.size ?? ''}</span>
                                                                                                                                                            <span> {objFileUploadDescription?.[obj_input?.['name']]?.unit ?? ''}</span>
                                                                                                                                                      </div>
                                                                                                                                                  </div>
                                                                                                                                              )
                                                                                                                                            }

                                                                                                                                      </div>
                                                                                                                                  </div>

                                                                                                                              )
                                                                                                                            }

                                                                                                                            {
                                                                                                                              objFileUpload?.[obj_input?.['name']] && 
                                                                                                                              objFileUpload?.[obj_input?.['name']] !== null && 
                                                                                                                              obj_input?.['type_upload'] === 'single' &&
                                                                                                                              (
                                                                                                                                  <div className='d-flex justify-content-center align-items-center ms-auto me-2'
                                                                                                                                  >
                                                                                                                                            <>   
                                                                                                                                              <div className={`fit-upload-image-single ${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? 'fit-uploadsingle-image-disabled':''}`} 
                                                                                                                                                    style={{padding:'8px', borderRadius:'50%'}} title="Delete"
                                                                                                                                                    // onClick={(event)=>{deleteUploadSingleFileHandler(event, obj_input?.['index'], obj_input)}}
                                                                                                                                                    onClick={(event)=>{showTemplateConfirm_UploadSingle(event, obj_input?.['index'], obj_input)}}
                                                                                                                                              >
                                                                                                                                                  <span className='pi pi-trash' style={{fontSize:'25px'}}></span>
                                                                                                                                              </div>
                                                                                                                                            </>
                                                                                                                                  </div>
                                                                                                                              )
                                                                                                                            }

                                                                                                                      </div>

                                                                                                                  </div>
                                                                                                                )
                                                                                                              }

                                                                                                              {
                                                                                                                obj_input?.['type_upload'] === 'multiple' && (

                                                                                                                  <div className='d-flex'>
                                                                                                                        <FileUpload 
                                                                                                                            ref={inputRefs[obj_input?.['index']]}
                                                                                                                            // mode='advanced'
                                                                                                                            className={`w-100 fit-multiple-upload-container fit-input-idx-${obj_input?.['index']} fit-${obj_input?.['uuid']}`}
                                                                                                                            multiple
                                                                                                                            name={`${obj_input?.['name']}[]`}
                                                                                                                            accept={`${Array.isArray(obj_input?.format?.ext) ? obj_input?.format?.ext.join(',') : obj_input?.format?.ext}`}
                                                                                                                            // accept="image/*"

                                                                                                                            // auto  // * bisa menyebabkan drag drop multiple tidak jalan, * agar tulisan button tidak tertimpa dengan nama file, * tidak menampilkan 'upload' dan 'cancel'
                                                                                                                            // chooseLabel='Browse' 
                                                                                                                            // cancelOptions={{icon:'pi pi-fw pi-times', iconOnly:true, className:'p-button-outlined p-button-danger fit-multiple-upload'}}

                                                                                                                            chooseOptions={{icon:'pi pi-fw pi-images', iconOnly:true, className:'p-button-outlined fit-multiple-upload'}}

                                                                                                                            // customUpload  // agar tulisan button tidak tertimpa dengan nama file
                                                                                                                            // uploadHandler={(event)=>{customUploadSingleFileHandler(event, obj_input?.['index'], obj_input)}}
                                                                                                                            disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}

                                                                                                                            headerTemplate={(options)=>headerTemplateUploadMultiple(options, obj_input)}
                                                                                                                            itemTemplate={(file, props)=>itemTemplateUploadMultiple(file, props, obj_input)}
                                                                                                                            emptyTemplate={emptyTemplateUploadMultiple} // jangan set mode ke 'basic' jika aktifkan fitur ini 
                                                                                                                            progressBarTemplate={({progress, props})=>progressBarTemplateUploadMultiple(progress, props, obj_input)}
                                                                                                                  
                                                                                                                            onBeforeSelect={(e)=>handleBeforeSelectUploadMultiple(e, obj_input)}
                                                                                                                            onSelect={(e)=>handleFileUploadOnSelect(e, obj_input)}
                                                                                                                            maxFileSize={obj_input?.['max_size_in_byte'] ?? undefined}
                                                                                                                            // chooseOptions={{icon:" ", iconOnly: false, className:''}} // hilangkan icon
                                                                                                                            // onSelect={(event)=>{fileUploadSingle_Select(event, obj_input?.['index'])}}
                                                                                                                        />
                                                                                                                  </div>
                                                                                                                )
                                                                                                              }

                                                                                                                    {/* <Chips
                                                                                                                          ref={inputRefs[obj_input?.['index']]}
                                                                                                                          className='w-100 fit-custom-chips'
                                                                                                                          value={objInputTextOthers?.[obj_input?.['name']] ?? []} 
                                                                                                                          onChange={(event)=>changeControl(obj_input?.['index'], obj_input?.['save']?.['key_name'], obj_input, event)} 
                                                                                                                          placeholder={`${objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']] ? '' : obj_input?.['placeholder']}`}
                                                                                                                          disabled={objDisabled?.[obj_input?.['index']] || objDisabledForProses?.[obj_input?.['index']]}
                                                                                                                    /> */}
                                                                                                            </div>
                                                                                                            
                                                                                                            {
                                                                                                                // obj_input?.['required'] &&
                                                                                                                invalidInput?.[obj_input?.['index']] && (
                                                                                                                    <div className={`d-flex justify-content-end mt-1`}>
                                                                                                                        <Message severity='error' text={`${invalidInput?.[obj_input?.['index']]}`} className='fit-message-custom' />
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }
                                                                                                        </Form.Group>
                                                                                                      )
                                                                                                  }
                                                                                            </div>
                                                                                          )
                  
                                                                                      })
                  
                                                                                  )
                                                                            }

                                                                        
                                                                        </div>
                  
                                                                  </div>
                                                              )
                                                          })
                                                        }
                                                        
                                                    </div>
                                                </div>

                                            </>
          
                                        )
                                    }

                                    {/* Render Detail Table */}
                                    {
                                        typeof obj_section?.detail !== 'undefined' && Array.isArray(obj_section?.detail) && (
                                            <>
                                              {
                                                  obj_section?.detail.map((obj_detail, obj_detail_index)=>(

                                                        <div className='d-flex flex-column' 
                                                            key={`fit-section-detail-${obj_detail_index}`}
                                                            style={{margin:'20px 5px 25px 5px'}}
                                                        >

                                                              <div className='d-flex justify-content-between align-items-center'>

                                                                  <h5 className='d-flex align-items-center gap-2' style={{margin:0}}>
                                                                    {
                                                                      typeof obj_detail?.icon !== 'undefined' && (

                                                                        // * Icon Title
                                                                        obj_detail?.icon

                                                                        // <IconField className='pi pi-info-circle' style={{color:'#FF9F43'}} />
                                                                      )
                                                                    }
                                                                    
                                                                      <span style={{fontSize:'16px', fontWeight:500}}>{obj_detail?.title || ''}</span>
                                                                    
                                                                  </h5>
                                                                  
                                                              </div>

                                                              {/* garis border bottom sebagai divider */}
                                                              <div className='mb-3' style={{borderBottom:'1px solid rgba(145, 158, 171, 0.3)', padding:'15px 0 0 0'}}></div>

                                                              {
                                                                typeof props?.type !== 'undefined' && 
                                                                    props?.type === 'Form' && (

                                                                      <LocalizationProvider 
                                                                          dateAdapter={AdapterDateFns}
                                                                      >
                                                                          <MaterialReactTable
                                                                              initialState={{
                                                                                density: obj_detail?.table?.density ?? 'comfortable'
                                                                              }}
                                                                              muiTableHeadCellProps={{style:{fontFamily:'Nunito'}}}
                                                                              muiTableBodyCellProps={{style:{fontFamily:'Nunito'}}}

                                                                              columns={columnDetailTable?.[obj_detail?.name]||[]}
                                                                              data={rowListTable?.[obj_detail?.name]||[]}
                                                                              muiTopToolbarProps={{
                                                                                // styling top Toolbar
                                                                                sx:{
                                                                                  // background:'linear-gradient(45deg, darkcyan, white)'
                                                                                  boxShadow:'0px 1px 10px -7px grey inset',    // shadow inset toolbar di atas
                                                                                  paddingTop:'7px',
                                                                                  // borderBottom:'1px solid lightgrey'
                                                                                }
                                                                              }}

                                                                              enableColumnResizing={obj_detail?.table?.enableColumnResizing || false}

                                                                              // styling body data
                                                                              muiTableBodyProps={{
                                                                                sx:{
                                                                                  // * hanya yang ada di record di highlight row ganjil
                                                                                  // * Jika record kosong, maka tidak di highlight (pembeda ada 'MuiTableRow-root' jika ada record)
                                                                                  '& tr.MuiTableRow-root:nth-of-type(odd) > td':{
                                                                                      backgroundColor:'aliceblue'
                                                                                  }
                                                                                }
                                                                              }}

                                                                              // custom if rows empty / kosong
                                                                              renderEmptyRowsFallback={({table})=>{
                                                                                  return (
                                                                                        <p style={{margin:0, fontFamily:'"Roboto", "Helvetica", "Arial",sans-serif', fontStyle:'italic',  letterSpacing:'0.00938em'
                                                                                                  , width:'100%', color:'rgba(0, 0, 0, 0.6)', lineHeight:'1.5'
                                                                                                  , textAlign:'center', paddingTop:'2rem', paddingBottom:'2rem'
                                                                                                  , fontWeight:400}}>
                                                                                            
                                                                                            {/* <div className='d-flex flex-column align-items-center'>
                                                                                                <img src={NoData} width={300} height={300} />
                                                                                            </div> */}
                                                                                            <span>No records to display</span>
                                                                                        </p>
                                                                                                
                                                                                  )
                                                                              }}
                                                                          />

                                                                          <Modal show={modalProps?.[obj_detail?.['uuid']]?.show ?? false} 
                                                                                backdrop={true}
                                                                                centered={true}
                                                                          >
                                                                               {/* <Modal.Header style={{backgroundColor:'lightblue'}}>
                                                                                   <Modal.Title>Welcome,</Modal.Title>
                                                                               </Modal.Header> */}
                                                                              <Modal.Body>
                                                                                  <h1>Teks</h1>
                                                                              </Modal.Body>
                                                                              {/* <Modal.Footer></Modal.Footer> */}
                                                                          </Modal>
                                                                      </LocalizationProvider>
                                                                    )
                                                              }
                                                              
                                                        </div>
                                                  ))
                                              }
                                            </>
                                        )
                                    }
                              </div>
                            )
                            
                          // return (
                          //     <div key={`ref-${idx}`}>
          
                          //         <Form.Group>
                          //             <Form.Label className={`mb-1 fit-dash-modal-form-label required`}>Input {idx}</Form.Label>
                          //             <Form.Control type="text" className={`fit-modal-input-placeholder`}
                          //                       placeholder='Placeholder'
                          //                       ref={inputRefs[idx]}
                          //                       name={`name`}
                          //                       maxLength={100}
                          //             />
                          //         </Form.Group>
          
                          //     </div>
                          // )
          
                        })
                      }
                    </div>
                  </>
              )

          )
        }

        {/* Section Cancel / Save */}
        {
          arrErrorConfig.length === 0 && (

            finalSessionConfig && finalSessionConfig !== null && (

                <div className={`fit-final-section d-flex justify-content-md-end`}
                        style={{display:loading ? 'none' : 'block'}}
                >
                      
                    {/* <Button className={`fit-btn-cancel fit-btn-cancel-bg fit-btn`} 
                        type='button'
                        style={{
                          position:'relative',
                          overflow:'hidden',
                          isolation:'isolate'
                        }}
                          // onClick={()=>handleSubmit()} 
                          // disabled={loaderStatus}
                    >
                      <Ripple />
                      Cancel
                    </Button> */}

                    {/* <Button className={`fit-btn-submit fit-btn-submit-bg ms-1 fit-btn`} 
                        type='submit'
                        style={{
                          position:'relative',
                          overflow:'hidden',
                          isolation:'isolate'
                        }}
                          // onClick={()=>handleSubmit()} 
                          // disabled={loaderStatus}
                    >
                      <Ripple />
                      Save
                    </Button> */}

                    <ButtonPrime className='fit-btn-prime fit-btn-prime-cancel fit-btn ms-1' style={{display: loading ? 'none':'block'}} disabled={Object.values(objDisabledForProses).every(temp=>temp)} label='Cancel' onClick={()=>handleProses('cancel')} loading={statusLoadingProses?.['cancel']} />
                    <ButtonPrime className='fit-btn-prime fit-btn-prime-save fit-btn ms-1' style={{display: loading ? 'none':'block'}} disabled={Object.values(objDisabledForProses).every(temp=>temp)} label='Save' onClick={()=>handleProses('save')} loading={statusLoadingProses?.['save']} severity={'warning'} />

                    
                </div>

            )

          )
        } 

        <Toast ref={toastProsesRef}
                className='fit-toast-position'/>
              
        {/* <ConfirmPopup closeOnEscape={false} dismissable={false}
            /> */}

          {/* closeOnEscape tidak bekerja jika closeable = false, arti nya escape no work */}
          {/* jadi harus di akalin header icon di display 'none' */}
          <ConfirmDialog  
                closeOnEscape={statusCloseConfirmDialog}
                closable={statusCloseConfirmDialog}
                dismissableMask={statusCloseConfirmDialog}
                visible={showConfirmDialog} 
            />

             {/* )
         }


        {/* <pre>
            {JSON.stringify(propertyConfig,null,4)}
        </pre> */}
    </div>
  )
}

export default FormTemplate