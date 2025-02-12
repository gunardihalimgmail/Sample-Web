import React, { useEffect, useMemo, useState } from 'react'
import './Results.scss'
import { ToastContainer } from 'react-toastify';
import storeMenu from '../../../stores';
import { MRT_ColumnDef, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MaterialReactTable } from 'material-react-table';
import { PPE_getApiSync, URL_API_PPE, getValueFromLocalStorageFunc, handleSwal, handleSwalResult, notify } from '../../../services/functions';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, Chip } from '@mui/material';
import { ControlPointRounded, DeleteForever, ModeEdit, Refresh } from '@mui/icons-material';
import ModalCreateResults from '../../modal/CreateResults';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id'
import { ColorRing } from 'react-loader-spinner';

type Results = {
  id_camera:number,
  id_feature:number,
  raw_data:string,
  created_at:number,
  created_by:number,
  updated_at:number,
  updated_by:number,
  id:number
}

const ListResults = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('Create'); // title modal (eg. Create user)
    const [modalStatus, setModalStatus] = useState('');  // status modal (eg. create / edit)
    const [modalRow, setModalRow] = useState({});    // data parsing for edit
    const [modalLoader, setModalLoader] = useState(true);
    const [modalListFeatures, setModalListFeatures] = useState<any[]|null>([]);
    const [modalListCamera, setModalListCamera] = useState<any[]|null>([]);

    const [showProgressBars, setShowProgressBars] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);

    const [rowList, setRowList] = useState<Results[]>([]);

    const [initialRender, setInitialRender] = useState(true);
    const [pagination, setPagination] = useState({pageIndex:0, pageSize:5});
    const [loadMoreProgShow, setLoadMoreProgShow] = useState(false);

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
          storeMenu.dispatch({type:'titleicon', text: 'Results'})

          // dispatch breadcrumb path
          storeMenu.dispatch({type:'breadcrumbs', text:[{key:'Maintenance', value:'Maintenance'}, {key:'Results', value:'Results'}]})
          
        },100)

        // console.log(modalRow)
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


    let columns = useMemo<MRT_ColumnDef<Results>[]>(
      ()=> 
        [
          {
            accessorKey: 'id_camera',
            header:'Id Camera',
            filterFn:'fuzzy',
            grow:true,
            size:200
          },
          {
            accessorKey: 'id_feature',
            header:'Id Feature',
            filterFn:'fuzzy',
            grow:true,
            size:200,
          },
          {
            accessorKey: 'raw_data',
            header:'Raw Data',
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

      let data:Results[] = [
      // data dummy
        {
          id_camera:0,
          id_feature:0,
          raw_data:'Raw Data 1',
          created_at:0,
          created_by:0,
          updated_at:0,
          updated_by:0,
          id:0
        },
        {
          id_camera:1,
          id_feature:1,
          raw_data:'Raw Data 2',
          created_at:0,
          created_by:0,
          updated_at:0,
          updated_by:0,
          id:1
        },
    ]

    
    const getDataList = (loadmore?:true|false) => {

      // !loadmore -> kondisi dari loadmore atau bukan
      if (!loadmore)
      {
          setShowProgressBars(true);
          setShowSkeleton(true);
    
          console.log(getValueFromLocalStorageFunc("IOT_TOKEN"))
            PPE_getApiSync(`${URL_API_PPE}/v1/results/?skip=0&limit=1000`
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
                        // setRowList([...data]) // data dummy for test
                        return
                    }
                    else if (typeof responseDetail != 'undefined'){
                        notify('error', response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? '', 'TOP_CENTER')
                        // setRowList([...data]) // data dummy for test
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
      else
      {
          // kondisi load more / tambah data
          setLoadMoreProgShow(true);
          PPE_getApiSync(`${URL_API_PPE}/v1/results/?skip=${rowList.length}&limit=1000`
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
                      return
                  }
                  else if (typeof responseDetail != 'undefined'){
                      notify('error', response?.['detail']?.[0]?.['msg'] ?? response?.['detail'] ?? '', 'TOP_CENTER')
                      return
                  }
                  else {
                      if (Array.isArray(response)){
                        if (response.length > 0)
                        {
                          setRowList((prev)=>{
                            return [
                                ...prev,
                                ...response
                            ];
                          })
                        }
                        
                        setTimeout(()=>{
                          setPagination(pagination)
                          setLoadMoreProgShow(false);
                        },100)
                      }
                  }
              // },500)
          });

      }
    }


    const toolbarButtonClick = async(status:'Create'|'Edit'|'Delete', title, row?) => {

      if (status == 'Delete'){
          handleSwal('Delete', row.original?.['raw_data'], (resultSwal:SweetAlertResult)=>{
              if (resultSwal.isConfirmed){
                  handleSwalResult('isConfirmed', row.original?.['raw_data']
                    ,{
                      endpoint:`${URL_API_PPE}/v1/results/${row.original?.['id']}`, obj:null, body_type:'application/json', method:'DELETE', token:getValueFromLocalStorageFunc("IOT_TOKEN")
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

          // render data camera ke dalam modal
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
          setModalListCamera([...temp_camera_arr]);

          // DATA CAMERAS FOR TEST
          // setModalListCamera([
          //     {value:0, label:'Camera Label 1'},
          //     {value:1, label:'Camera Label 2'}
          // ]);

          // render data feature ke dalam modal
          // ***NANTI UPDATE data dummy

          let temp_feature_arr:any[] = [];

          let feature_arr:any[] = await PPE_getApiSync(`${URL_API_PPE}/v1/features/?skip=0&limit=1000`
                                  ,null
                                  , 'application/json'
                                  , 'GET'
                                  , getValueFromLocalStorageFunc("IOT_TOKEN") ?? '');

          if (typeof feature_arr?.['statusCode'] == 'undefined' &&
              typeof feature_arr?.['detail'] == 'undefined')
          {
              // jika data ada
              temp_feature_arr = [...feature_arr.map((obj, idx)=>{
                            return {
                              value: obj?.['id'],
                              label: obj?.['feature_name']
                            }
                    })];
          }

          setModalListFeatures([...temp_feature_arr]);

          // DATA FEATURES FOR TEST
          // setModalListFeatures([
          //     {value:0, label:'Feature Label 1'},
          //     {value:1, label:'Feature Label 2'}
          // ]);

          if (status == 'Edit'){
            // fetch api --later
            setTimeout(()=>{
              // isi data ke modal
              setModalRow(row.original);
              // tutup loader
              setModalLoader(false);
            },100)

          }
          else if (status == 'Create') {

            setModalRow({
              'Camera': null,
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
                        pagination,
                        // columnPinning:{left:['mrt-row-actions','mrt-row-numbers']},
                        density:'comfortable',  // tinggi setiap row (spacious, comfortable, compact)
                        columnOrder:[
                          'mrt-row-numbers'
                          // 'mrt-row-actions',
                        ],
                        columnVisibility:{'id': false, 'token_user':false}
                    }}
                    
                    renderBottomToolbarCustomActions={({table})=>(
                        <Box>
                            {/* table.getPrePaginationRowModel().rows.length '-> Jumlah data sebelun pagination di render */}
                            {/* table.getSelectedRowModel().rows.length '-> Jumlah data yang ter-select */}
                            
                            {/* <span>Page : {pagination.pageIndex+1} of {table.getPageCount()}</span> */}
                            <Button variant='outlined' color='success'
                                    onClick={()=>{getDataList(true)}}
                                    className='d-flex align-items-end'
                                    disabled={loadMoreProgShow}>

                                <span>Load More</span>
                                <div>
                                    <ColorRing 
                                      width={30}
                                      height={30}
                                      visible={loadMoreProgShow}
                                    />
                                </div>
                            </Button>
                        </Box>
                    )}

                    renderTopToolbarCustomActions={({table})=>{

                        const modalEventOutChange = ({tipe, value, form}) => {
                          
                            if (form == 'create') {
                              if (tipe == 'close_modal'){

                                setModalRow({
                                  'Camera': null,
                                  'Feature': null,
                                  'Raw Data': ''
                                });

                                setShowModal(value);
                              }
                              else if (tipe == 'close_after_success_save') {
                                setModalRow({
                                  'Camera': null,
                                  'Feature': null,
                                  'Raw Data': ''
                                });
                                
                                setShowModal(value);
                                getDataList(false);
                              }
                            }
                        }

                        return (
                          <Box>
                              <div className='d-flex gap-1'>
                                  {/* <Button color="info" onClick={()=>{toolbarButtonClick('Create','Create Results')}} variant='contained'
                                      className='d-flex justify-content-between' style={{paddingLeft:'5px', paddingRight:'10px'}} > 
                                      <ControlPointRounded titleAccess='Create'/>
                                      <span className='ms-1' title="Create">Create</span> 
                                  </Button> */}

                                  <Button color="secondary" onClick={()=>{getDataList()}} variant='outlined'
                                      className='d-flex justify-content-center align-items-center' style={{paddingLeft:'5px', paddingRight:'5px', minWidth:'0'}} > 
                                      <Refresh titleAccess='Refresh' />
                                      {/* <span className='ms-1'>Refresh</span>  */}
                                  </Button>
                              </div>

                              <ModalCreateResults par_show={showModal ?? false} title={modalTitle} status={modalStatus} 
                                        par_statusLoader={modalLoader}
                                        row={modalRow} 
                                        listFeatures={modalListFeatures}
                                        listCameras={modalListCamera}
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
                              {/* <div className='ppe-icon-actions edit' title="Edit" onClick={()=>{toolbarButtonClick('Edit','Edit Results', row)}}>
                                  <ModeEdit sx={{fill: 'mediumslateblue !important'}} />
                              </div> */}

                              <div className='ppe-icon-actions delete' title="Hapus" onClick={()=>{toolbarButtonClick('Delete','Delete Results', row)}}>
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

export default ListResults