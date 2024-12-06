import React, { useState, useEffect } from "react"
import axios from "axios"
import '../styles/musicplayer.css'
import albumart from "../assets/musicplayerimg.png"
import SongCard from "../components/songcard.js"
import { IoIosPlayCircle } from "react-icons/io"
import { IoPlaySkipBackCircle, IoPlaySkipForwardCircle   } from "react-icons/io5"

export default function MusicPlayer() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleControlClick = (e) => { // don't expand when controls are clicked
        e.stopPropagation(); 
    };

    const query = "twice";
    const [songs, setSongs] = useState([]);

    // i used search query for now to render the songs in the player
    // there's a get user playlist in the backend routes
    useEffect(() => { 
        if (query) {
            console.log("Query:", query);  
            axios.get(`http://localhost:4000/search/searchAll?q=${query}`)
            .then(response => {
                setSongs(response.data); 
            })
            .catch(error => {
                console.error("Error fetching songs: ", error);
            });

        }
    }, [query]);

    return (
        <div className = {`player-container ${isExpanded ? "expanded" : ""}`} onClick={toggleExpansion}>
            <div className="upper-player"> 
                <div className="cd-container">  
                    <img src ={albumart} className ="curr-img" />
                </div>
                <div className="curr-info">
                    <h6 className="curr-title">X-Factor</h6>
                    <p className="curr-artist">Ms. Lauryn Hill</p>
                </div>
                <div className="controls" onClick={handleControlClick} >
                    <button><IoPlaySkipBackCircle /></button>
                    <button><IoIosPlayCircle /></button>
                    <button><IoPlaySkipForwardCircle /></button>
                </div>
            
            </div>
            <div className="song-duration-bar" onClick={handleControlClick}>
                <input type="range" className="seek-slider" max="100" value="0"/>

            </div>
            
            {isExpanded && (
                <div className="queue" onClick={handleControlClick}>
                    <h3>Playing From:</h3>
                    <h3 style={{color: '#4F378B'}}> Your Playlist</h3>
                    <div>
                    {songs.length > 0 ? (
                        songs.map((song) => <SongCard key={song.songId} song={song}   showAddButton={false} 
                        showPlaylistButton={false} 
                        />)
                        ) : (
                        <p>No songs found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
        
    );
    
};