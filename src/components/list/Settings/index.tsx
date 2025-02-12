import React, { useEffect, useMemo, useState } from 'react'
import './Settings.scss'
import { ToastContainer } from 'react-toastify';
import storeMenu from '../../../stores';
import { MRT_ColumnDef, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MaterialReactTable } from 'material-react-table';
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, handleSwal, handleSwalResult, notify } from '../../../services/functions';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, Chip, darken, lighten, useTheme } from '@mui/material';
import { ControlPointRounded, DeleteForever, ModeEdit, Refresh } from '@mui/icons-material';
import ModalCreateSettings from '../../modal/CreateSettings';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

type Settings = {
  // title:string,
  id_camera:number,
  storage_name:string,
  roi:string,
  created_at:number,
  created_by:number,
  updated_at:number,
  updated_by:number,
  id:number
}

const ListSettings = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Create'); // title modal (eg. Create user)
    const [modalStatus, setModalStatus] = useState('');  // status modal (eg. create / edit)
    const [modalRow, setModalRow] = useState({});    // data parsing for edit
    const [modalLoader, setModalLoader] = useState(true);
    const [modalListSettings, setModalListSettings] = useState<any[]|null>([]);

    const [showProgressBars, setShowProgressBars] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);

    const [rowList, setRowList] = useState<Settings[]>([]);

    const [initialRender, setInitialRender] = useState(true);
    const [pagination, setPagination] = useState({pageIndex:0, pageSize:5});

    useEffect(()=>{
      
      // testing sementara tunggu ada data api baru di false
      setTimeout(()=>{
        // list data table
          setShowProgressBars(false);
          setShowSkeleton(false)
      },1000)

    },[])


    useEffect(()=>{

        setTimeout(()=>{

          // storeMenu terhubung ke Menu Main

          // dispatch icon title
          storeMenu.dispatch({type:'titleicon', text: 'Settings'})

          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Maintenance', value:'Maintenance'}, {key:'Settings', value:'Settings'}]})
          
        },100)

        // console.log(modalRow)
    },[modalRow])

    useEffect(()=>{

    },[showModal])

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


    let columns = useMemo<MRT_ColumnDef<Settings>[]>(
      ()=> 
        [
          // {
          //   accessorKey: 'title',
          //   header:'Title',
          //   filterFn:'fuzzy',
          //   grow:true,
          //   size:200,
          // },
          {
            accessorKey: 'id_camera',
            header:'Id Camera',
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
          },
          {
            accessorKey: 'storage_name',
            header:'Storage Name',
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
          },
          {
            accessorKey: 'roi',
            header:'ROI',
            filterVariant:'text',
            // filterSelectOptions:['tes@gmail.com'],
            filterFn:'fuzzy',
            grow:true,
            size:450,
            Header: ({column}) => {
                return <span>{column.columnDef.header}</span>
            },
            muiTableHeadCellProps:{
              align:'left'
            }
          },
          {
            accessorKey: 'created_at',
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
                    return format(new Date(cell.row.original.created_at * 1000),'dd MMM yyyy - hh:mm:ss', {locale:idLocale})
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
            accessorKey: 'updated_at',
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
            ,size:220
            ,Cell: ({cell, row, table}) => {
                try{
                    return format(new Date(cell.row.original.updated_at * 1000),'dd MMM yyyy - hh:mm:ss', {locale:idLocale})
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
          }
        ],
      []
    )

      let data:Settings[] = [
      // data dummy
        {
          // title:'Title 1',
          id_camera:0,
          storage_name:'Storage 1',
          roi:'ROI 1',
          created_at:0,
          created_by:0,
          updated_at:0,
          updated_by:0,
          id:0
        },
        {
          // title:'Title 2',
          id_camera:1,
          storage_name:'Storage 2',
          roi:'ROI 2',
          created_at:0,
          created_by:0,
          updated_at:0,
          updated_by:0,
          id:0
        },
    
    ]

    
    const getDataList = () => {

      setShowProgressBars(true);
      setShowSkeleton(true);

      console.log(getValueFromLocalStorageFunc("IOT_TOKEN"))
        PPE_getApiSync(`${URL_API_PPE}/v1/settings/?skip=0&limit=1000`
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

                    // ***NANTI UBAH (hanya dummy)
                    setRowList([])
                    return
                }
                else if (typeof responseDetail != 'undefined'){
                    notify('error', response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? '', 'TOP_CENTER')
                    setRowList([])
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


    const toolbarButtonClick = async(status:'Create'|'Edit'|'Delete', title, row?) => {

      if (status == 'Delete'){
          // handleSwal('Delete', row.original?.['title'], (resultSwal:SweetAlertResult)=>{
          handleSwal('Delete', row.original?.['id_camera'], (resultSwal:SweetAlertResult)=>{
              if (resultSwal.isConfirmed){
                  // handleSwalResult('isConfirmed', row.original?.['title']
                  handleSwalResult('isConfirmed', row.original?.['id_camera']
                    ,{
                      endpoint:`${URL_API_PPE}/v1/settings/${row.original?.['id']}`, obj:null, body_type:'application/json', method:'DELETE', token:getValueFromLocalStorageFunc("IOT_TOKEN")
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

          // render data feature ke dalam modal
          // ***NANTI UPDATE data dummy
          
          let temp_camera_arr:any[] = [];

          let camera_arr:any[] = await PPE_getApiSync(`${URL_API_PPE}/v1/cameras/?skip=0&limit=1000`
                                ,null
                                , 'application/json'
                                , 'GET'
                                , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');
                          
          if (typeof camera_arr?.['statusCode'] == 'undefined' &&
              typeof camera_arr?.['detail'] == 'undefined')
          {
              // jika data ada
              temp_camera_arr = [...camera_arr.map((obj, idx)=>{
                            return {
                              value: obj?.['id'],
                              label: obj?.['camera_name']
                            }
                    })];
          }

          setModalListSettings([...temp_camera_arr]);

          // setModalListSettings([
          //     {value:0, label:'Camera Label 0'},
          //     {value:1, label:'Camera Label 1'}
          // ]);

          if (status == 'Edit'){
            // fetch api --later
            setTimeout(()=>{
              // isi data ke modal
              setModalRow(row.original)
              // tutup loader
              setModalLoader(false);
            },100)

          }
          else if (status == 'Create') {

            setModalRow({
              'Feature': null,
              'Raw Data': ''
            });

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

    const theme = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(theme.palette.mode === 'dark');

    const handleSwitchMode = () => {
      setIsDarkMode((prevMode)=>!prevMode);
    }

    const baseBackgroundColor = isDarkMode
        ? 'rgba(3, 44, 43, 1)'
        : 'rgba(255, 255, 255, 1)';



    return (
      <>
        <div className={`${isDarkMode ? 'dark-mode':'light-mode'}`}>
            <LocalizationProvider 
                dateAdapter={AdapterDateFns}
              >
                {/* <button className='btn btn-outline-primary' onClick={handleSwitchMode}>Mode Dark / Light</button> */}

                <MaterialReactTable columns={columns} data={rowList} 
                        // enableColumnPinning
                        // manualPagination={true}  // record tidak berubah jika page berubah
                        paginationDisplayMode='pages'   // pages->tampilkan per nomor halaman (1,2,3,...)
                        muiPaginationProps={{
                          size:'medium',
                          // color:'primary',
                          sx:({
                            '& .MuiButtonBase-root':{
                              color: isDarkMode ? 'rgba(255,255,255,1)' :'rgba(0, 0, 0, 0.87)',
                              border:'1px solid grey'
                            },
                            
                            '& .MuiPaginationItem-page.Mui-selected': {
                              // kondisi selected page nya
                              color: isDarkMode ? 'white' :'black',
                            },
                            '& .MuiInputBase-root .MuiInputLabel-root':{
                              color: 'blue',
                            },
                          }),

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
                              'mrt-row-numbers'
                              // 'mrt-row-actions',
                            ],
                            columnVisibility:{'id': false, 'token_user':false}
                        }}
                        
                        renderTopToolbarCustomActions={({table})=>{

                            const modalEventOutChange = async ({tipe, value, form}) => {
                                if (form == 'create') {

                                  if (tipe == 'close_modal'){

                                    setModalRow({
                                      'Feature': null,
                                      'Raw Data': ''
                                    });

                                    // setShowModal(value);
                                    setTimeout(()=>{
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
                                                <Button color="info" onClick={()=>{toolbarButtonClick('Create','Create Settings')}} variant='contained'
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

                                  <ModalCreateSettings par_show={showModal ?? false} title={modalTitle} status={modalStatus} 
                                            par_statusLoader={modalLoader}
                                            row={modalRow} 
                                            listSettings={modalListSettings}
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
                                <MRT_ToggleGlobalFilterButton sx={{color:isDarkMode ? 'white':'rgba(0, 0, 0, 0.54)'}} table={table}/> 
                                <MRT_ToggleFiltersButton sx={{color:isDarkMode ? 'white':'rgba(0, 0, 0, 0.54)'}} table={table}/>
                                <MRT_ShowHideColumnsButton sx={{color:isDarkMode ? 'white':'rgba(0, 0, 0, 0.54)'}} table={table} />
                                <MRT_ToggleDensePaddingButton sx={{color:isDarkMode ? 'white':'rgba(0, 0, 0, 0.54)'}} table={table} />
                                <MRT_ToggleFullScreenButton sx={{color:isDarkMode ? 'white':'rgba(0, 0, 0, 0.54)'}} table={table} />
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
                            // odd ganjil
                            '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
                            {
                              // backgroundColor: darken(baseBackgroundColor, 0.1),
                              backgroundColor: darken(isDarkMode ? 'rgba(3, 44, 43, 1)' : 'rgb(240, 248, 255)',0),
                              color: isDarkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'
                            },
                            '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
                            {
                              // backgroundColor: darken(baseBackgroundColor, 0.2),
                              backgroundColor: darken(isDarkMode ? 'rgba(3, 44, 43, 1)' : 'rgb(240, 248, 255)',0.1),
                              color: isDarkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'
                            },

                            // even genap
                          '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
                            {
                              // backgroundColor: lighten(baseBackgroundColor, 0.7),
                              backgroundColor: lighten(isDarkMode ? 'rgba(3, 44, 43, 1)' : 'rgb(255,255,255)',0.1),
                              color: isDarkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'
                            },
                          '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
                            {
                              backgroundColor: lighten(isDarkMode ? 'rgba(3, 44, 43, 1)' : 'rgb(255,255,255)',0.3),
                              color: isDarkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'
                            },

                            // '& tr:nth-of-type(odd) > td':{
                            //     backgroundColor:'aliceblue'
                            // }
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
                            color:isDarkMode ? 'white' : 'black'
                          }
                        }}
                        
                        columnFilterDisplayMode='subheader'
                        enableColumnFilterModes   // fuzzy, contains, so on...
                        enableColumnOrdering
                        enableColumnResizing

                        enableRowNumbers
                        rowNumberDisplayMode='static' // row number follow sort or not (static = fix 1,2,3,..; original = flexible when sort 2,1,3,...)

                        enableRowActions={true}
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
                                  <div className='ppe-icon-actions edit' title="Edit" onClick={()=>{toolbarButtonClick('Edit','Edit Settings', row)}}>
                                      <ModeEdit sx={{fill: 'mediumslateblue !important'}} />
                                  </div>

                                  <div className='ppe-icon-actions delete' title="Hapus" onClick={()=>{toolbarButtonClick('Delete','Delete Settings', row)}}>
                                      <DeleteForever sx={{fill: 'red !important'}}/>
                                  </div>

                              </div>
                            )
                        }}

                        mrtTheme={{
                          baseBackgroundColor: baseBackgroundColor,
                          draggingBorderColor: theme.palette.secondary.main
                        }}
                  />
            </LocalizationProvider>

                  {/* {baseBackgroundColor}
                  {theme.palette.mode} */}

            <ToastContainer 
              draggable
              pauseOnHover
            />
        </div>
        {/* <LocalizationProvider dateAdapter={AdapterDate}  */}

      </>
    )
}

export default ListSettings