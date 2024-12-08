import React, { useState, useEffect }  from "react"
import { useParams } from "react-router-dom";  // To fetch params from the URL
import "../styles/playlist.css"
import { IoIosArrowBack } from "react-icons/io";
import { IoIosPlayCircle } from "react-icons/io"
import SongCard from "../components/songcard.js"
import axios from "axios"
import { Link } from "react-router-dom"


export default function Playlist(){
    const { id } = useParams();  

    const query = "twice";
    const [songs, setSongs] = useState([]);

    // i used search query for now to render the songs in the player
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
        <div className="playlist-page">
            <Link to='/home/library' className='playlist-nav'><IoIosArrowBack /></Link>
            <div className="playlist-container" >
                <div className="playlist-header">
                    <img className="playlist-art"></img>
                    <div className="playlist-info">
                        <p id="identifier">Playlist</p>
                        <h1>Playlist: {id}</h1>
                        <p>Description: Details for playlist with ID {id}</p>
                        <button className="play-button"><IoIosPlayCircle/></button>
                    </div>
                </div>
                <div className="song-container">
                    <div className="song-table-header">
                        <span>Title</span>
                        <span>Album</span>
                    </div>
                    {songs.length > 0 ? (
                    songs.map((song) => <SongCard key={song.songId} 
                        song={song} 
                        showAddButton={false}
                        showAlbum={true}/>)
                    ) : (
                    <p>No songs found</p>
                    )}
                </div>
            </div>
        </div>
    );
}