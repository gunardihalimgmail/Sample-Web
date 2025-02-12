import react from 'react'
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
// import { Navigate, Route, Routes } from 'react-router'
// import Login from '../../pages/login/index_style2'
import Login from '../../pages/login'
import DashboardTangki from '../../pages/Dashboard/tangki'
import MapsTangki from '../../pages/Dashboard/maps'
import { handleLogOutGlobal } from '../../services/functions'
import Main from '../../pages/main'
import ListUsers from '../../components/list/Users'
import ListCameras from '../../components/list/Cameras'
import ListFeatures from '../../components/list/Features'
import ListResults from '../../components/list/Results'
import ListSettings from '../../components/list/Settings'
import DashboardMain from '../../components/dashboard/Main'
import DashboardAnalitik from '../../components/dashboard/Analitik'
import DashboardVehicle from '../../components/dashboard/Vehicle'
import DashboardCameraOnline from '../../components/dashboard/CameraOnline'
import Task from '../../components/dashboard/Task'
import DashboardAnalitikAll from '../../components/dashboard/AnalitikAll'
import LiveView from '../../components/dashboard/LiveView'
import Recordings from '../../components/dashboard/Recordings'
import ROI from '../../components/others/ROI'
import Events from '../../components/dashboard/Events'
import ListSites from '../../components/list/Sites'
import ListPlaces from '../../components/list/Places'
import TransaksiPenjualan from '../../pages/transaksi/penjualan/form/penjualan_form'
import TransaksiPenjualanForm from '../../pages/transaksi/penjualan/form/penjualan_form'

const ProtectedRoute = ({ element, authenticated = false}) => {

		if (!authenticated){
			handleLogOutGlobal()
		}

		return authenticated ? (
					element
		):
		<Navigate to = "/login" replace = {true}/>
}


const Route_custom = () => (
    // <Route path = "/login" element = {<Login />} />
    
          <Routes>

                  <Route path="list" element={<Main />}>
                      <Route path="users" element={<ListUsers />}/>
                      <Route path="sites" element={<ListSites />} />
                      <Route path="places" element={<ListPlaces />} />
                      <Route path="cameras" element={<ListCameras />} />
                      <Route path="features" element={<ListFeatures />} />
                      <Route path="results" element={<ListResults />} />
                      <Route path="settings" element={<ListSettings />} />
                  </Route>

                  <Route path="other" element={<Main />}>
                      <Route path="roi" element={<ROI />} />
                  </Route>

                  <Route path="dashboard" element={<Main />}>
                      <Route index element = {<Navigate to = "analitik" />} />
                      {/* <Route path="main" element={<DashboardMain />} /> */}
                      
                      <Route path="analitik">

                          <Route index element = {<DashboardAnalitikAll />} />

                          {/* <Route index element = {<Navigate to = "ppe" />} /> */}

                          {/* <Route path="ppe" element={<DashboardAnalitik />} /> */}
                          {/* <Route path="vehicle" element={<DashboardVehicle />} /> */}
                      </Route>

                      <Route path="monitoring">
                          <Route index element = {<Navigate to = "camera-online" />} />

                          <Route path="camera-online" element={<DashboardCameraOnline />} />
                          <Route path="task" element={<Task />} />
                          <Route path="live-view" element={<LiveView />} />
                          <Route path="recordings" element={<Recordings />} />
                          <Route path="events" element={<Events />} />

                      </Route>

                      
                  </Route>

                  <Route path="transaksi" element={<Main />}>
                    <Route path="penjualan">
                        {/* <Route index element = {<Recordings />} /> */}
                        <Route index element = {<Navigate to="form" />} />
                        <Route path="form" element={<TransaksiPenjualanForm />} />
                    </Route>
                  </Route>

                  {/* <Route path = "/" element={<Main />} /> */}

                  {/* * Jika ada hash maka pakai yang terakhir setelah hash (kondisi github pages yang hanya support '#') */}
                  {/* Contoh output hash -> '#/list/users' */}
                  <Route path = "/" element={<Navigate to={window.location.hash.replace('#','') || "/transaksi/penjualan"} />} />
                  {/* <Route path = "/" element={<Navigate to={"/transaksi/penjualan"} />} /> */}

                  {/* Jika URL salah atau tidak ada */}
                  <Route path = "/*" element={<Navigate to={"/transaksi/penjualan"} />} /> 

                  {/* <Route path = "/" element={<Navigate to="/login" />}> */}
                        {/* <Route index element = {<Navigate to = "/dashboard" />} /> */}

                        {/* {/* <Route index element = {<Navigate to = "dashboard" />}/>

                        <Route path  = "dashboard">       

                            <Route index element = {<Navigate to = "tangki" />}/>

                            <Route path = "tangki"
                                  element={<DashboardTangki />}
                            />

                            <Route path = "tangki/maps" element = {<MapsTangki />} />
                        </Route> */}

                        {/* <Route path = "tangki"
                              element={<ProtectedRoute element={<DashboardTangki />} authenticated={true} />}
                        /> */}
                  {/* </Route> */}

                  <Route path = "/login" element = {<Login />} />

                  {/* halaman awal redirect ke dashboard -> tangki */}
                  {/* <Route path = "/*" element = {<Navigate to = "/login" />}/> */}
                
          </Routes>
)
    

export default Route_custom