import React, { useState, useEffect } from "react"
import axios from "axios"
import '../styles/home.css'
import { IoMdMusicalNote, IoMdBookmark } from "react-icons/io"
import MusicPlayer from "../components/musicplayer"
import { Link, Outlet } from 'react-router-dom'


export default function Home() {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
      async function fetchData() {
          try {
            const response = await axios.get('http://localhost:4000/spotifyAuth/getAccessToken', { withCredentials: true });
            const accessToken = response.data.accessToken;
            console.log("Access Token:", accessToken);
            setToken(accessToken);  
            setTimeout(() => {
              const user_response = axios.get('http://localhost:4000/getUser', { withCredentials: true });
              if (user_response.status === 200) {
                  const user_data = user_response.data;
                  console.log("User:", user_data);
                  setUser(user_data); // Store user information in state
              } else {
                  console.log(user_response.data);
              }
            }, 1500);
          } catch (error) {
              console.error("Error fetching access token or user data:", error);
          }
      };
      fetchData();
    }, []); // Empty dependency array ensures this runs only once when the component mount

    return (
        <div> 
            <header className="home-header">
                <div className="nav-left">
                    <Link to="/home/results" className="nav-item"><IoMdMusicalNote /></Link> 
                    <Link to="/home/library" className="nav-item"><IoMdBookmark /></Link>
                </div>
                <MusicPlayer token={token}/>
            </header>
            <div> 
                <Outlet/>
                {user ? (
                  <div>
                    <h1>Welcome, {user.username}</h1>
                    <p>Email: {user.email}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
            </div>
        </div>
    )
}
