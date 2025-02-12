import React, { useEffect, useMemo, useState } from 'react'
import './Cameras.scss'
import { ToastContainer } from 'react-toastify';
import storeMenu from '../../../stores';
import { MRT_ColumnDef, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MaterialReactTable } from 'material-react-table';
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, handleSwal, handleSwalResult, notify } from '../../../services/functions';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, Chip } from '@mui/material';
import { ControlPointRounded, DeleteForever, ModeEdit, Refresh } from '@mui/icons-material';
import ModalCreateCameras from '../../modal/CreateCameras';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id'

type Cameras = {
  camera_name:string,
  camera_location:string,
  endpoint:string,
  site_id?:number,
  site_name?:string,
  place_id?: number,
  place_name?: string,
  is_active:boolean,
  created_at:number,
  created_at_format?:string,
  created_by:number,
  updated_at:number,
  updated_at_format?:string,
  updated_by:number,
  id:number
}

const ListCameras = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Create'); // title modal (eg. Create user)
    const [modalStatus, setModalStatus] = useState('');  // status modal (eg. create / edit)
    const [modalRow, setModalRow] = useState({});    // data parsing for edit
    const [modalLoader, setModalLoader] = useState(true);

    const [modalListSites, setModalListSites] = useState<any[]|null>([]); // list Sites
    const [modalListPlaces, setModalListPlaces] = useState<any[]|null>([]); // list Places (create -> kosongkan, Edit -> di isi sesuai site_id)

    const [showProgressBars, setShowProgressBars] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);

    const [rowList, setRowList] = useState<Cameras[]>([]);

    const [initialRender, setInitialRender] = useState(true);
    const [pagination, setPagination] = useState({pageIndex:0, pageSize:5});

    
    useEffect(()=>{
      
      // testing sementara tunggu ada data api baru di false
      setTimeout(()=>{
        // list data table
          setShowProgressBars(false);
          setShowSkeleton(false)
      },1000)

      // window.location.reload();

    },[])


    useEffect(()=>{

        setTimeout(()=>{
          // dispatch icon title
          storeMenu.dispatch({type:'titleicon', text: 'Cameras'})

          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Maintenance', value:'Maintenance'}, {key:'Cameras', value:'Cameras'}]})
          
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


    let columns = useMemo<MRT_ColumnDef<Cameras>[]>(
      ()=> 
        [
          {
            accessorKey: 'camera_name',
            header:'Camera Name',
            filterFn:'fuzzy',
            grow:true,
            size:250,
          },
          {
            accessorKey: 'camera_location',
            header:'Camera Location',
            filterVariant:'text',
            // filterSelectOptions:['tes@gmail.com'],
            filterFn:'fuzzy',
            grow:true,
            size:250,
            Header: ({column}) => {
                return <span>{column.columnDef.header}</span>
            },
            muiTableHeadCellProps:{
              align:'left'
            }
            ,Cell:({cell})=>{
                const latitude = cell.row.original?.['latitude'] ?? '';
                const longitude = cell.row.original?.['longitude'] ?? '';
                
                if (latitude != null && longitude != null) {

                    return `${latitude}, ${longitude}`;

                } else {
                  return '';
                }
            },
          },
          {
            accessorKey: 'site_name',
            header:'Site',
            filterVariant:'text',
            // filterSelectOptions:['tes@gmail.com'],
            filterFn:'fuzzy',
            grow:true,
            size:200,
            Header: ({column}) => {
                return <span>{column.columnDef.header}</span>
            },
            muiTableHeadCellProps:{
              align:'left'
            }
            // ,Cell:({cell})=>{
            //     return (
            //       <span></span>
            //     )
            // },
          },
          {
            accessorKey: 'place_name',
            header:'Place',
            filterVariant:'text',
            // filterSelectOptions:['tes@gmail.com'],
            filterFn:'fuzzy',
            grow:true,
            size:200,
            Header: ({column}) => {
                return <span>{column.columnDef.header}</span>
            },
            muiTableHeadCellProps:{
              align:'left'
            }
            // ,Cell:({cell})=>{
            //     return (
            //       <span></span>
            //     )
            // },
          },
          {
            accessorKey: 'endpoint',
            header:'Endpoint',
            filterVariant:'text',
            // filterSelectOptions:['tes@gmail.com'],
            filterFn:'fuzzy',
            grow:true,
            size:350,
            Header: ({column}) => {
                return <span>{column.columnDef.header}</span>
            },
            muiTableHeadCellProps:{
              align:'left'
            }
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
                      // <Chip color="error" label="No" size="small" sx={{width:'auto', boxShadow:'1px 1px 2px 1px grey'}}/>
                      <Chip color="error" label="No" size="small" sx={{minWidth:'auto', color:'#FF4C51', fontWeight:'500', height:'20px',
                            backgroundColor:'rgba(255, 76, 81,0.16)', borderRadius:'16px', fontSize:'0.8125rem'
                      }}/>
                    )
              )
            }
          },
          {
            accessorKey: 'created_at_format',
            header:'Created At',
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
            ,size:220
            ,Cell: ({cell, row, table}) => {
              try{
                  return `${cell.row.original?.['created_at_format']}`
                  // return format(new Date(cell.row.original.created_at * 1000),'dd MMM yyyy - hh:mm:ss', {locale:idLocale})
              }catch(e){
                return null;
              }
            }
          },
          {
            accessorKey: 'created_by',
            header:'Created By',
            filterVariant:'text',
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
            accessorKey: 'updated_at_format',
            header:'Updated At',
            filterVariant:'text',
            filterFn:'fuzzy',
            grow:true,
            Header: ({column}) => {
                return <span>{column.columnDef.header}</span>
            },
            muiTableHeadCellProps:{
              align:'left'
            }
            ,Cell: ({cell, row, table}) => {
              try{
                  // return format(new Date(cell.row.original.updated_at * 1000),'dd MMM yyyy - hh:mm:ss', {locale:idLocale})
                  return `${cell.row.original?.['updated_at_format']}`
              }catch(e){
                return null;
              }
            }
          },
          {
            accessorKey: 'updated_by',
            header:'Updated By',
            filterVariant:'text',
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
            accessorKey: 'site_id',
            header:'Site ID',
            filterFn:'contains',
            grow:true,
            visibleInShowHideMenu: false
          },
          {
            accessorKey: 'place_id',
            header:'Place ID',
            filterFn:'contains',
            grow:true,
            visibleInShowHideMenu: false
          }
        ],
      []
    )

      let data:Cameras[] = [
      // data dummy
        {
          camera_name:'Camera 1',
          camera_location:'Point A',
          endpoint:'http://www',
          is_active:true,
          created_at:0,
          created_by:0,
          updated_at:0,
          updated_by:0,
          id:0
        },
        {
          camera_name:'Camera 2',
          camera_location:'Point B',
          endpoint:'http://www',
          is_active:true,
          created_at:0,
          created_by:0,
          updated_at:0,
          updated_by:0,
          id:1
        },
    ]

    
    const getDataList = () => {

      setShowProgressBars(true);
      setShowSkeleton(true);

      console.log(getValueFromLocalStorageFunc("IOT_TOKEN"))
        PPE_getApiSync(`${URL_API_PPE}/v1/cameras/?skip=0&limit=1000`
              ,null
              , 'application/json'
              , 'GET'
              , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '')
        .then((response)=>{

            setTimeout(()=>{
              setShowProgressBars(false);
              setShowSkeleton(false);
            }, 77)
          

            let statusCodeError = response?.['statusCode']; // error dari internal
            let responseDetail = response?.['detail'] // error dari api
            
            // setTimeout(()=>{
              
                if (typeof statusCodeError != 'undefined'){
                    notify('error', response?.['msg'] ?? '', 'TOP_CENTER')
                    // setRowList([...data])
                    return
                }
                else if (typeof responseDetail != 'undefined'){
                    notify('error', response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? '', 'TOP_CENTER')
                    return
                }
                else {
                    if (Array.isArray(response)){

                      let _temp_arr = [...response];

                      let lat, lng:any;

                      _temp_arr = _temp_arr.map((obj, idx)=>{

                          if ( typeof obj?.['latitude'] != 'undefined' && obj?.['latitude'] != null
                                && typeof obj?.['longitude'] != 'undefined' && obj?.['longitude'] != null
                          ) {
                              lat = obj?.['latitude'].toString();
                              lng = obj?.['longitude'].toString();
                          } else {
                              lat = ''; lng = '';
                          }

                          return {
                            ...obj,
                            'camera_location': `${lat}, ${lng}`,
                            'created_at_format': `${obj?.['created_at'] ? format(new Date(obj?.['created_at'] * 1000),'dd MMM yyyy - HH:mm:ss', {locale:idLocale}) : ''}`,
                            'updated_at_format': `${obj?.['updated_at'] ? format(new Date(obj?.['updated_at'] * 1000),'dd MMM yyyy - HH:mm:ss', {locale:idLocale}) : ''}`
                          }
                      });

                      // setRowList([...response]);
                      setRowList([..._temp_arr]);

                    }
                }
            // },500)
        });
    }

    const getListPlaces = async(site_id) => {

        let temp_places_arr:any[] = [];

        let places_arr:any[] = await PPE_getApiSync(`${URL_API_PPE}/v1/places/filter/${site_id}`
                  ,null
                  , 'application/json'
                  , 'GET'
                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

        if (typeof places_arr?.['statusCode'] == 'undefined' &&
            typeof places_arr?.['detail'] == 'undefined')
        {
            // jika data ada
            temp_places_arr = [...places_arr.map((obj, idx)=>{
                return {
                  value: obj?.['id'],
                  label: obj?.['name']
                }
            })];
            return [...temp_places_arr];
        } else {
            return [];
        }
    }

    const toolbarButtonClick = async(status:'Create'|'Edit'|'Delete', title, row?) => {

      if (status == 'Delete'){
          handleSwal('Delete', row.original?.['camera_name'], (resultSwal:SweetAlertResult)=>{
              if (resultSwal.isConfirmed){
                  handleSwalResult('isConfirmed', row.original?.['camera_name']
                    ,{
                      endpoint:`${URL_API_PPE}/v1/cameras/${row.original?.['id']}`, obj:null, body_type:'application/json', method:'DELETE', token:getValueFromLocalStorageFunc("IOT_TOKEN")
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

          

          // render data sites ke dalam modal

          let temp_sites_arr:any[] = [];

          let sites_arr:any[] = await PPE_getApiSync(`${URL_API_PPE}/v1/sites/?skip=0&limit=1000`
                                ,null
                                , 'application/json'
                                , 'GET'
                                , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

          if (typeof sites_arr?.['statusCode'] == 'undefined' &&
              typeof sites_arr?.['detail'] == 'undefined')
          {
              // jika data ada
              temp_sites_arr = [...sites_arr.map((obj, idx)=>{
                            return {
                              value: obj?.['id'],
                              label: obj?.['name']
                            }
                    })];
          }

          
          let temp_places_arr:any[] = [];

          if (typeof row?.original?.['place_id'] != 'undefined' && 
                row?.original?.['place_id'] != null 
              && typeof row?.original?.['site_id'] != 'undefined'
              && row?.original?.['site_id'] != null 
          ){
              let listPlaces:any = await getListPlaces(row?.original?.['site_id']);
                if (Array.isArray(listPlaces) && listPlaces.length > 0) {
                  
                  temp_places_arr = [...listPlaces];

                } else {
                  temp_places_arr = [];
                  // setModalListPlaces([]);
                }
          }

          

          if (status == 'Edit'){
            // fetch api --later
            
            // setModalRow(row.original);
            setModalListSites([...temp_sites_arr]);
            
            setModalListPlaces([...temp_places_arr]);
            
            
            setTimeout(()=>{
              
              setModalRow(row.original);
              
              setTimeout(()=>{

                // row (data) edit ke modal

                setModalLoader(false);
              },300)

            },300)
            
          } 
          else if (status == 'Create') {

            setModalListSites([...temp_sites_arr]);

            setModalListPlaces([]);

            setModalRow({})

            setTimeout(()=>{
              setModalLoader(false);
            },100)
          }
      }
    }

    const handlePaginationChange = (newPage) => {
      // console.log(newPage.pageSize)
      // console.log(newPage.pageIndex)
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
                          'is_superuser',
                          // 'mrt-row-actions',
                        ],
                        columnVisibility:{'id': false, 'site_id':false, 'place_id': false, 'token_user':false}
                    }}
                    
                    renderTopToolbarCustomActions={({table})=>{

                        const modalEventOutChange = ({tipe, value, form}) => {
                            if (form == 'create') {
                              if (tipe == 'close_modal'){
                                setTimeout(()=>{
                                  setModalRow({});
                                  setShowModal(value);
                                },100);
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
                                        <Button color="info" onClick={()=>{toolbarButtonClick('Create','Create Cameras')}} variant='contained'
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

                              <ModalCreateCameras par_show={showModal ?? false} title={modalTitle} status={modalStatus} 
                                        par_statusLoader={modalLoader}
                                        row={modalRow} 
                                        listSites={modalListSites}
                                        listPlaces={modalListPlaces}
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
                              <div className='ppe-icon-actions edit' title="Edit" onClick={()=>{toolbarButtonClick('Edit','Edit Cameras', row)}}>
                                  <ModeEdit sx={{fill: 'mediumslateblue !important'}} />
                              </div>

                              <div className='ppe-icon-actions delete' title="Hapus" onClick={()=>{toolbarButtonClick('Delete','Delete Cameras', row)}}>
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

export default ListCameras