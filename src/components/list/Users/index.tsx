import { MRT_ColumnDef, MRT_GlobalFilterTextField, MRT_ShowHideColumnsButton, MRT_ShowHideColumnsMenuItems, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react'
import './Users.scss'
import { ControlPointRounded, Delete, DeleteForever, ModeEdit, Print, Refresh } from '@mui/icons-material';
import { Box, Button, Chip, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es'
import idLocale from 'date-fns/locale/id' // untuk indonesia
import { Col, Row } from 'react-bootstrap';
import BreadcrumbsCustom from '../../atoms/BreadcrumbsCustom';
import storeMenu from '../../../stores';
import ModalCreateUser from '../../modal/CreateUser';
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, handleSwal, handleSwalResult, notify } from '../../../services/functions';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastContainer } from 'react-toastify';

// import LocalizationProvider from '@mui/lab/LocalizationProvider'
// import AdapterDateFns from '@mui/lab/AdapterDateFns';


// type Users = {
//   tanggal:string,
//   name: {
//     firstName: string,
//     lastName: string,
//   },
//   address: string,
//   city: string,
//   state: string,
// }

type Users = {
  email:string,
  is_active:boolean,
  is_superuser:boolean,
  full_name:string,
  token_user:string,
  id:number
}

const ListUsers = () => {

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Create'); // title modal (eg. Create user)
  const [modalStatus, setModalStatus] = useState('');  // status modal (eg. create / edit)
  const [modalRow, setModalRow] = useState({});    // data parsing for edit
  const [modalLoader, setModalLoader] = useState(true);

  const [showProgressBars, setShowProgressBars] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [rowList, setRowList] = useState<Users[]>([]);

  const [initialRender, setInitialRender] = useState(true);
  const [pagination, setPagination] = useState({pageIndex:0, pageSize:5});

  useEffect(()=>{
    
    // testing sementara tunggu ada data api baru di false
    setTimeout(()=>{
      // list data table
        setShowProgressBars(false);
        setShowSkeleton(false);
    },1000)

  },[])


  useEffect(()=>{

      setTimeout(()=>{
        // dispatch icon title
        storeMenu.dispatch({type:'titleicon', text: 'Users'})

        // dispatch breadcrumb path
        storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Maintenance', value:'Maintenance'}, {key:'Users', value:'Users'}]})
        
      },100)

      console.log(modalRow)
  },[showModal, modalRow])

  useEffect(()=>{
    setTimeout(()=>{
        getDataList();
    },150)

  },[])
  
  useEffect(()=>{
    // jika waktu pertama kali render, maka tidak jalan alert nya
    if (!initialRender){
      console.log(JSON.stringify(pagination))
    }
    else {
      setInitialRender(false);
    }
  },[pagination])


  let columns = useMemo<MRT_ColumnDef<Users>[]>(
    ()=> 
      [
        {
          accessorKey: 'full_name',
          header:'Full Name',
          filterFn:'fuzzy',
          grow:true
        },
        {
          accessorKey: 'email',
          header:'Email',
          filterVariant:'text',
          // filterSelectOptions:['tes@gmail.com'],
          filterFn:'fuzzy',
          grow:true,
          Header: ({column}) => {
              return <span>{column.columnDef.header}</span>
          },
          muiTableHeadCellProps:{
            align:'left'
          }
        },
        {
          accessorKey: 'id',
          header:'ID',
          filterFn:'contains',
          grow:true,
          visibleInShowHideMenu: false
        },
        {
          accessorKey: 'is_active',
          header:'Active',
          filterVariant:'checkbox',
          filterFn:'contains',
          grow:true,
          Cell: ({cell}) => {
            return (
              cell.row.original.is_active ? 
                  (
                    // <Chip color="success" label="Yes" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>

                    <Chip color="success" label="Yes" size="small" className='d-flex justify-content-center align-items-center ' sx={{minWidth:'auto', color:'#56CA00', fontWeight:'500', height:'20px',
                          backgroundColor:'rgba(86,202,0,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
                    }}/>
                  ) : 
                  (
                    <Chip color="error" label="No" size="small" sx={{minWidth:'auto', color:'#FF4C51', fontWeight:'500', height:'20px',
                          backgroundColor:'rgba(255, 76, 81,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
                    }}/>

                    // <Chip color="error" label="No" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>
                  )
              // <span>{cell.row.original.is_active ? 'Yes':'No'}</span>
            )
          }
        },
        {
          accessorKey: 'is_superuser',
          header:'Superuser',
          filterVariant:'checkbox',
          filterFn:'contains',
          grow:true,
          Cell: ({cell}) => {
            return (
              cell.row.original.is_superuser ? 
                  (
                    // <Chip color="success" label="Yes" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>
                    <Chip color="success" label="Yes" size="small" className='d-flex justify-content-center align-items-center ' sx={{minWidth:'auto', color:'#56CA00', fontWeight:'500', height:'20px',
                          backgroundColor:'rgba(86,202,0,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
                    }}/>
                  ) : 
                  (
                    // <Chip color="error" label="No" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>
                    <Chip color="error" label="No" size="small" sx={{minWidth:'auto', color:'#FF4C51', fontWeight:'500', height:'20px',
                          backgroundColor:'rgba(255, 76, 81,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
                    }}/>
                  )
              // <span>{cell.row.original.is_active ? 'Yes':'No'}</span>
            )
          }
        },
        {
          accessorKey: 'token_user',
          header:'Token User',
          filterFn:'contains',
          grow:true,
          visibleInShowHideMenu: false
        },
      ],
    []
  )

  // let columns = useMemo<MRT_ColumnDef<Users>[]>(
  //     ()=>
  //     [
  //       {
  //         // accessorKey:'tanggal',
  //         accessorFn:(row)=>new Date(row.tanggal),  // for sorting and filtering
  //         id:'tanggal',
  //         header:'Tanggal',
  //         filterFn:'equals',
  //         Cell: ({cell})=>{
  //             return (
  //               <div>{format(new Date(cell.row.original.tanggal),"dd MMMM yyyy HH:mm:ss")}</div>
  //             )
  //         },
  //         sortingFn:'datetime',
  //         filterVariant:'datetime',
  //         minSize:250,
  //         grow:true
  //       },
  //       {
  //         accessorKey: 'name.firstName',
  //         header:'First Name',
  //         enableColumnDragging:true,
  //         enableColumnOrdering:true,
  //         grow:true,
  //         Cell: ({cell}) => {
  //           return (
  //               <div>{cell.row.original.name.firstName}</div>
  //           )
  //         },
  //         muiTableHeadCellProps: {
  //           align:'left'
  //         },
  //         muiTableBodyCellProps: {
  //           align:'left',
  //         }
  //       },
  //       {
  //         accessorKey: 'name.lastName',
  //         header:'Last Name',
  //         // size: 150,
  //         enableColumnDragging:true,
  //         enablePinning:true,
  //         grow:true
  //       },
  //       {
  //         accessorKey: 'address',
  //         header:'Address',
  //         grow:true
  //       },
  //       {
  //         accessorKey: 'city',
  //         header: 'City',
  //         grow:true
  //         // size: 150,
  //       },
  //       {
  //         accessorKey: 'state',
  //         header: 'State',
  //         grow:true
  //         // size: 150,
  //       }
  //     ],
  //     []
  // )

    let data:Users[] = [
    // data dummy
      {
        email:'tes@gmail.com',
        full_name:'tesname',
        is_active:true,
        is_superuser:false,
        token_user:'aaabbcctoken---',
        id:0
      },
      {
        email:'qa@gmail.com',
        full_name:'qaName',
        is_active:false,
        is_superuser:true,
        token_user:'aaabbccdddtoken---',
        id:1
      },
      {
        email:'tes@gmail.com',
        full_name:'tesname',
        is_active:true,
        is_superuser:false,
        token_user:'aaabbcctoken---',
        id:0
      },
      {
        email:'qa@gmail.com',
        full_name:'qaName',
        is_active:false,
        is_superuser:true,
        token_user:'aaabbccdddtoken---',
        id:1
      },
      {
        email:'tes@gmail.com',
        full_name:'tesname',
        is_active:true,
        is_superuser:false,
        token_user:'aaabbcctoken---',
        id:0
      },
      {
        email:'goooo@gmail.com',
        full_name:'qaName',
        is_active:false,
        is_superuser:true,
        token_user:'aaabbccdddtoken---',
        id:1
      },
  ]

  
  const getDataList = () => {

    console.log(getValueFromLocalStorageFunc("IOT_TOKEN"))

    setShowProgressBars(true);
    setShowSkeleton(true);

      PPE_getApiSync(`${URL_API_PPE}/v1/users/?skip=0&limit=1000`
            ,null
            , 'application/json'
            , 'GET'
            , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '')
      .then((response)=>{

          let statusCodeError = response?.['statusCode']; // error dari internal
          let responseDetail = response?.['detail'] // error dari api

          // setTimeout(()=>{

              setTimeout(()=>{
                setShowProgressBars(false);
                setShowSkeleton(false);
              }, 77)
            
              if (typeof statusCodeError != 'undefined'){
                  notify('error', response?.['msg'] ?? '', 'TOP_CENTER')
                  // setRowList([...data])   // data dummy
                  return
              }
              else if (typeof responseDetail != 'undefined'){
                  notify('error', responseDetail, 'TOP_CENTER')
                  
                  return
              }
              else {
                  if (Array.isArray(response)){
                    setRowList([...response]);
                  }
              }
          // },500)
      });
  }


  const toolbarButtonClick = (status:'Create'|'Edit'|'Delete', title, row?) => {

    if (status == 'Delete'){
        handleSwal('Delete', row.original?.['email'], (resultSwal:SweetAlertResult)=>{
            if (resultSwal.isConfirmed){
                handleSwalResult('isConfirmed', row.original?.['email']
                  ,{
                    endpoint:`${URL_API_PPE}/v1/users/${row.original?.['id']}`, obj:null, body_type:'application/json', method:'DELETE', token:getValueFromLocalStorageFunc("IOT_TOKEN")
                  }
                  , (res)=>{

                    // setelah success hapus, maka fetching data kembali
                    if (res?.['tipe'] == 'close_after_success_save') {
                      getDataList();
                    }
                  }
                );
            } 
            else if (resultSwal.dismiss == Swal.DismissReason.cancel){
                handleSwalResult('cancelled');
            }
        })

    }
    else {
        setModalStatus(status);
        setModalTitle(title);
        // setModalStatus('Create');
        // setModalTitle('Create User');
        setShowModal(true);
    
        setModalLoader(true);

        if (status == 'Edit'){
          // fetch api --later
          setTimeout(()=>{
            setModalLoader(false);

            setModalRow(row.original)
          },500)
        } 
        else if (status == 'Create') {
          setTimeout(()=>{
            setModalLoader(false);
          },0)
        }
    }
  }

  const handlePaginationChange = (newPage) => {
    console.log(newPage.pageSize)
    console.log(newPage.pageIndex)
  }

  return (
    <>

      <LocalizationProvider 
          dateAdapter={AdapterDateFns}
        >
          <MaterialReactTable columns={columns} data={rowList} 
                  // enableColumnPinning
                  // manualPagination={true}  // record tidak berubah jika page berubah
                  paginationDisplayMode='pages'   // pages->tampilkan per nomor halaman (1,2,3,...)
                  muiPaginationProps={{
                    size:'medium',
                    color:'primary',
                    shape:'rounded',
                    variant:'outlined', 
                    // showRowsPerPage:true, // [5,10,15,All] show or not
                    rowsPerPageOptions:[{value:5, label:'5'},{value:10, label:'10'},{value:15, label:'15'},{value:rowList.length, label:'All'}],
                    // rowsPerPageOptions:[5,10,15],
                    showFirstButton:true,
                    showLastButton:true
                  }}
                  onPaginationChange={setPagination}  // harus set 'state -> pagination' juga
                  // rowCount={100} //you can tell the pagination how many rows there are in your back-end data

                  state={{
                    pagination:pagination,
                    showAlertBanner: false,
                    showProgressBars: showProgressBars,
                    showSkeletons: showSkeleton
                  }}
                  // muiToolbarAlertBannerProps={{color:'error', children:'Network error'}}
                  // positionToolbarAlertBanner='top'

                  initialState={{
                      // columnPinning:{left:['mrt-row-actions','mrt-row-numbers']},
                      density:'comfortable',  // tinggi setiap row (spacious, comfortable, compact)
                      columnOrder:[
                        'mrt-row-numbers',
                        'full_name',
                        'email',
                        'is_active',
                        'is_superuser'
                        // 'mrt-row-actions',
                      ],
                      columnVisibility:{'id': false, 'token_user':false}
                  }}
                  
                  renderTopToolbarCustomActions={({table})=>{

                      const modalEventOutChange = ({tipe, value, form}) => {
                          if (form == 'createUser') {
                            if (tipe == 'close_modal'){
                              setTimeout(()=>{
                                setShowModal(value);
                              },5);
                            }
                            else if (tipe == 'close_after_success_save') {
                              setShowModal(value);
                              getDataList();
                            }
                          }
                      }

                      return (
                        <Box>
                            <div className='d-flex gap-1'>
                                {
                                  getValueFromLocalStorageFunc("IOT_IS_SPUSR") == "true" && (
                                      <Button color="info" onClick={()=>{toolbarButtonClick('Create','Create User')}} variant='contained'
                                          className='d-flex justify-content-between' style={{paddingLeft:'5px', paddingRight:'10px'}} > 
                                          <ControlPointRounded titleAccess='Create'/>
                                          <span className='ms-1' title="Create">Create</span> 
                                      </Button>
                                  )
                                }

                                <Button color="secondary" onClick={()=>{getDataList()}} variant='outlined'
                                    className='d-flex justify-content-center align-items-center' style={{paddingLeft:'5px', paddingRight:'5px', minWidth:'0'}} > 
                                    <Refresh titleAccess='Refresh' />
                                    {/* <span className='ms-1'>Refresh</span>  */}
                                </Button>
                            </div>

                            <ModalCreateUser par_show={showModal ?? false} title={modalTitle} status={modalStatus} 
                                      par_statusLoader={modalLoader}
                                      row={modalRow} 
                                      outChange={modalEventOutChange} />
                        </Box>
                      )
                  }}

                  enableFacetedValues // untuk filterVariant = 'multi-select' hanya terambil data unik otomatis

                  renderToolbarInternalActions={({table})=>{
                    return (
                      <Box>
                          {/* <IconButton onClick={()=>window.print()}>
                            <Print />
                          </IconButton> */}
                          <MRT_ToggleGlobalFilterButton table={table}/> 
                          <MRT_ToggleFiltersButton table={table}/>
                          <MRT_ShowHideColumnsButton table={table} />
                          <MRT_ToggleDensePaddingButton table={table} />
                          <MRT_ToggleFullScreenButton table={table} />
                      </Box>
                    )
                  }}

                  // custom if rows empty / kosong
                  renderEmptyRowsFallback={({table})=>{
                      return (
                            <p style={{margin:0, fontFamily:'"Roboto", "Helvetica", "Arial",sans-serif', fontStyle:'italic',  letterSpacing:'0.00938em'
                                      , width:'100%', color:'rgba(0, 0, 0, 0.6)', lineHeight:'1.5'
                                      , textAlign:'center', paddingTop:'2rem', paddingBottom:'2rem'
                                      , fontWeight:400}}>No records to display</p>
                      )
                  }}

                  
                  muiTableBodyProps={{
                    // styling body data
                    sx:{
                      '& tr:nth-of-type(odd) > td':{
                          backgroundColor:'aliceblue'
                      }
                    }
                  }}

                  muiTableBodyCellProps={{
                    // styling semua cell dalam body data
                    sx:{
                      // borderRight:'1px solid #e0e0e0'
                    }
                  }}

                  // enableRowSelection

                  enableTopToolbar={true} 
                  muiTopToolbarProps={{
                    // styling top Toolbar
                    sx:{
                      // background:'linear-gradient(45deg, darkcyan, white)'
                      boxShadow:'0px 1px 12px -7px grey inset',    // shadow inset toolbar di atas
                      paddingTop:'7px',
                      // borderBottom:'1px solid lightgrey'
                    }
                  }}
                  muiTableHeadCellProps={{
                    // styling head cell / nama column
                    sx:{
                      backgroundColor:'transparent',
                      textAlign:'left',
                      paddingTop:'10px',
                      paddingBottom:'10px',
                      display:'flex',
                      justifyContent:'center',
                    }
                  }}
                  
                  columnFilterDisplayMode='subheader'
                  enableColumnFilterModes   // fuzzy, contains, so on...
                  enableColumnOrdering
                  enableColumnResizing

                  enableRowNumbers
                  rowNumberDisplayMode='static' // row number follow sort or not (static = fix 1,2,3,..; original = flexible when sort 2,1,3,...)

                  enableRowActions={getValueFromLocalStorageFunc("IOT_IS_SPUSR") != "true" ? false : true}
                  positionActionsColumn='first'

                  displayColumnDefOptions={{
                      'mrt-row-numbers':{

                        // Cell: ({staticRowIndex}) => {  // menyebabkan nomor ter-reset jadi 1 setiap page berubah
                        //     return <span>{(staticRowIndex??0) + 1}</span>
                        // },

                        visibleInShowHideMenu:true, // show this column in "show/hide columns"
                        enableHiding:true   // can hide or not menu "show/hide columns"
                        // ,Cell:({cell, staticRowIndex})=>{
                        //     console.log(cell)
                        //     return (
                        //       <span>{(staticRowIndex??0) + 1}</span>
                        //     )
                        // }
                        , Header:'#'
                      },
                      'mrt-row-actions':{
                        header:'Actions',
                        size: 100
                      }
                    }
                  }
                  

                  renderRowActions={({cell, row, table}) => {
                      let cellContent = row.original?.['name']?.['firstName'];
                      // console.log("cellContent")
                      // console.log("ID : ", cell.row.id)
                      // console.log("Index : ", cell.row.index)
                      // console.log("Address : ", row.original?.['address'])
                      return (
                        <div className='d-flex align-items-center gap-2'>
                            <div className='ppe-icon-actions edit' title="Edit" onClick={()=>{toolbarButtonClick('Edit','Edit User', row)}}>
                                <ModeEdit sx={{fill: 'mediumslateblue !important'}} />
                            </div>

                            <div className='ppe-icon-actions delete' title="Hapus" onClick={()=>{toolbarButtonClick('Delete','Delete User', row)}}>
                                <DeleteForever sx={{fill: 'red !important'}}/>
                            </div>

                        </div>
                      )
                  }}
            />
      </LocalizationProvider>

      <ToastContainer 
        draggable
        pauseOnHover
      />
      {/* <LocalizationProvider dateAdapter={AdapterDate}  */}

    </>
  )
  
}

export default ListUsers