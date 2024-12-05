import React, { useState } from "react";
import axios from "axios";
import '../styles/musicplayer.css';
import logo from "../assets/musicplayerimg.png";

export default function MusicPlayer() {
    return (
        <div className = "player-container">
            <div className="cd-container">  
                <img src ={logo} className ="cd-img" />
            </div>
        </div>
        
    );
    
};