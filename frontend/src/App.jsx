import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Logs from './pages/Logs/Logs';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="logs" element={<Logs/>}/> 
      </Route>
    </Routes>

    </BrowserRouter>
  )
}

export default App
