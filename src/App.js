import React from 'react';
import './App.css';
import {
  BrowserRouter as Router, Routes, Route
} from "react-router-dom";
import './style/global.css'
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import PrivateRoutes from "./utils/PrivateRoutes"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home/>} path="/" exact/>
        </Route>
        <Route element={<Login/>} path="/login"/>
        <Route element={<Register/>} path="/register"/>
      </Routes>
    </Router>
  )
}

export default App;
