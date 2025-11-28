import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css'
import {Home} from "./pages/Home.tsx";
import {Login} from "./pages/Login.tsx";
import {Planets} from "./pages/Planets.tsx";
import {Request} from "./pages/Request.tsx";
import {Vote} from "./pages/Vote.tsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/planets" element={<Planets/>}/>
            <Route path="/request" element={<Request/>}/>
            <Route path="/vote" element={<Vote/>}/>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
