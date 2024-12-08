import React, { useState, useEffect } from "react"
import axios from "axios"
import '../styles/home.css'
import { IoMdMusicalNote, IoMdBookmark } from "react-icons/io"
import MusicPlayer from "../components/musicplayer"
import { Link, Outlet } from 'react-router-dom'


export default function Home() {
    const [token, setToken] = useState('');

    useEffect(() => {
        async function getToken() {
            try {
              const response = await axios.get('http://localhost:4000/spotifyAuth/getAccessToken');
              const accessToken = response.data.accessToken;
              console.log("Access Token:", accessToken);
              setToken(accessToken);
            } catch (error) {
              console.error("Error fetching access token:", error);
            }
          };
        getToken(); 
      }, []);
    

    return (
        <div> 
            <header className="home-header">
                <div className="nav-left">
                    <Link to="/home/results" class="nav-item"><IoMdMusicalNote /></Link> 
                    <Link to="/home/library" class="nav-item"><IoMdBookmark /></Link>
                </div>
                <MusicPlayer token={token}/>
            </header>
            <div> 
                <Outlet/>
            </div>
        </div>
    )
}
