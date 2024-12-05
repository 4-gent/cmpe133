import React, { useState } from "react";
import axios from "axios";
import '../styles/homenav.css';
import { IoMdMusicalNote, IoMdBookmark } from "react-icons/io";
import { FaRadio } from "react-icons/fa6";
import MusicPlayer from "./musicplayer";

export default function Navbar() {
    return (
        <header className="home-header">
            <div className="nav-left">
                <a href="/home/results" class="nav-item"><IoMdMusicalNote /></a>
                <a href="/library" class="nav-item"><IoMdBookmark /></a>
            </div>
            <div>
                <MusicPlayer/>
            </div>
        </header>
    
    );
    
};