import React, { useState } from "react"
import axios from "axios"
import '../styles/home.css'
import { IoMdMusicalNote, IoMdBookmark } from "react-icons/io"
import MusicPlayer from "../components/musicplayer"
import { Outlet } from 'react-router-dom'


export default function Home() {
    
    return (
        <div> 
            <header className="home-header">
                <div className="nav-left">
                    <a href="/home/results" class="nav-item"><IoMdMusicalNote /></a> 
                    <a href="/home/library" class="nav-item"><IoMdBookmark /></a>
                </div>
                <MusicPlayer/>
            </header>
            <div> 
                <Outlet/>
            </div>
        </div>
    )
}
