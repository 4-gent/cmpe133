import React, { useState, useEffect } from "react"
import axios from "axios"
import '../styles/home.css'
import { IoMdMusicalNote, IoMdBookmark } from "react-icons/io"
import MusicPlayer from "../components/musicplayer"
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


export default function Home() {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('');
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const location = useLocation();
    const navigate = useNavigate(); 

    useEffect(() => {
      async function fetchData() {
          try {
            const response = await axios.get('http://localhost:4000/spotifyAuth/getAccessToken', { withCredentials: true });
            const accessToken = response.data.accessToken;
            setToken(accessToken);  
            setTimeout(async() => {
              const user_response = await axios.get('http://localhost:4000/user/getUser', { withCredentials: true });
              if (user_response.status === 200) {
                  const user_data = user_response.data;
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

    const handleQuery = async(e) => {
      e.preventDefault();
      try{
        const response = await axios.post('http://localhost:5002/query', { query: query }, { withCredentials: true })
        console.log("Query response: ", response.data);
        if (response.status === 200){
          navigate(`/home/results?q=${query}`, {state: { results: response.data }});
        }
        else
        {
          console.log("Error fetching songs: ", response.data);
        }
      } catch (err){
        console.error("Error fetching songs: ", err);
      }
    }

    return (
        <div> 
            <header className="home-header">
                <div className="nav-left">
                    <Link to="/home/results" className="nav-item"><IoMdMusicalNote /></Link> 
                    <Link to="/home/library" className="nav-item"><IoMdBookmark /></Link>
                </div>
                {token && <MusicPlayer token={token} playlist={currentPlaylist} />}
            </header>
            <div> 
                <Outlet context={{ setCurrentPlaylist }} token={token} />
                {user && location.pathname === '/home' && (
                  <div>
                    <h1>Welcome, {user.username}</h1>
                    <p>Email: {user.email}</p>
                    <form onSubmit={handleQuery}>
                      <input className="query-input" value={query} placeholder="Search...." onChange={(e) => setQuery(e.target.value)} />
                      <button type="submit">Search</button>
                    </form>
                  </div>
                )}
                {!user && <p>Loading...</p>}
            </div>
        </div>
    )
}
