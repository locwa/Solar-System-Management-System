import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css'
import {DashboardTemplate} from "./templates/DashboardTemplate.tsx";
import {Login} from "./pages/Login.tsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<DashboardTemplate/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
