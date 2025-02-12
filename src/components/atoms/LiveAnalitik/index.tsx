import React, { useState } from 'react';
import './LiveAnalitik.scss';
import { format } from 'date-fns';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

const LiveAnalitik = () => {
  const [page, setPage]  = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <div className='my-3 h-100 live-parent'>

        <div className={`d-flex flex-column flex-sm-column flex-md-row h-100
                          live-container overflow-hidden`}>

            <div className='col-12 col-md-6 p-5'>

                <img src={`https://png.pngtree.com/thumb_back/fw800/background/20230803/pngtree-cars-crossing-busy-road-on-city-street-at-dusk-image_12994576.jpg`}
                  width={`100%`}
                  height={'100%'}
                  className='live-img'
                />
            </div>

            <div className='col-12 col-md-6 p-3 h-100 d-flex justify-content-center align-items-center'>

                <div className=' h-100 w-100 d-flex justify-content-center align-items-center'>

                  <Paper sx={{width:'100%', overflow:'auto'}}>
                      <TableContainer sx={{maxHeight: '450px'}} className='custom-mui-table-container'>
                          <Table stickyHeader size="small">
                              <TableHead>
                                  <TableRow>
                                      <TableCell>TANGGAL</TableCell>
                                      <TableCell>SEPEDA</TableCell>
                                      <TableCell>MOTOR</TableCell>
                                      <TableCell>MOBIL</TableCell>
                                      <TableCell>BUS</TableCell>
                                      <TableCell>TRUK</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {
                                      Array.from({length:5}).map((obj, idx)=>(
                                        <TableRow
                                          hover
                                          key={`${idx}`}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{`name-${idx}`}</TableCell>
                                            <TableCell>{`12`}</TableCell>
                                            <TableCell>{`15`}</TableCell>
                                            <TableCell>{`30`}</TableCell>
                                            <TableCell>{`19`}</TableCell>
                                            <TableCell>{`22`}</TableCell>
                                        </TableRow>
                                      ))
                                  }
                              </TableBody>

                          </Table>
                      </TableContainer>
                      {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={15}
                        rowsPerPage={5}
                        page={0}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      /> */}
                  </Paper>

                 
                   

                </div>
            </div>
        </div>

    </div>
  )
}

export default LiveAnalitik