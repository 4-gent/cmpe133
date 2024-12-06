import React, { useState, useEffect} from "react"
import '../styles/results.css'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { MdOutlinePlaylistAdd, MdOutlineAddCircleOutline } from "react-icons/md"
import { FaSearch } from "react-icons/fa"
import SongCard from "../components/songcard.js"



export default function Results() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')
    const [songs, setSongs] = useState([]);

    useEffect(() => {

        if (query) {
            // console.log("Query:", query);  
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
        <div className="results-container"> 
            <div className="search-display">
                <h3>Results for: "{query}" </h3>
                <button className="search-button"> <FaSearch /> </button>
            </div>
            <div className="song-content">
            <h5> Songs </h5> 
            {songs.length > 0 ? (
                songs.map((song) => <SongCard key={song.songId} song={song} />)
                ) : (
                <p>No songs found</p>
                )}
            </div>
        </div>
    )
}


