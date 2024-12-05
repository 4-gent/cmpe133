import React, { useState } from "react";
import '../styles/home.css';
import Navbar from "../components/homenav";
import { Outlet } from 'react-router-dom';


export default function Home() {
    
    return (
        <div> 
            <Navbar/>
             {/* music player here  */}
             <div className="home-content"> 
                <Outlet/>
            </div>
        </div>
    )
}
