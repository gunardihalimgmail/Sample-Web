import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { bindActionCreators } from 'redux';
import logo from '../assets/images/logo.svg';
import { Route_custom } from '../config';
import './App.css';
import FormTemplateContextProv from '../components/atoms/FormTemplate/FormTemplateContext';

function App() {

  return (
      <FormTemplateContextProv>
        <Route_custom />
      </FormTemplateContextProv>
  );
}

export default App;
