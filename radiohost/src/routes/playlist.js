import React, { useState, useEffect }  from "react"
import { useParams } from "react-router-dom";  // To fetch params from the URL
import "../styles/playlist.css"
import { IoIosArrowBack } from "react-icons/io";
import { IoIosPlayCircle } from "react-icons/io"
import SongCard from "../components/songcard.js"
import axios from "axios"
import { Link, Outlet } from 'react-router-dom'


export default function Playlist(){
    const { id } = useParams();  

    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState({});

    // Fetch songs for the playlist
    useEffect(() => {
        async function fetchSongs() {
            try {
                const response = await axios.get(`http://localhost:4000/playlists/get-songs/${id}`, { withCredentials: true });
                setTimeout(() => {
                    setSongs(response.data);
                }, 1000);
            } catch (error) {
                console.error("Error fetching songs: ", error);
            }
        }
        fetchSongs();
    }, [id]);

    // Fetch playlist details
    useEffect(() => {
        async function fetchPlaylist() {
            try {
                const response = await axios.get(`http://localhost:4000/playlists/get-playlist/${id}`, { withCredentials: true });
                console.log("Playlist: ", response.data);
                setTimeout(() => {
                    setPlaylist(response.data);
                }, 1000);
            } catch (error) {
                console.error("Error fetching playlist: ", error);
            }
        }
        fetchPlaylist();
    }, [id]);

    const handleDeletePlaylist = async(e) => {
        e.preventDefault();
        try{
            await axios.delete(`http://localhost:4000/playlists/delete/${id}`, { withCredentials: true });
            window.location.href = '/home/library';
        } catch(err){
            console.error("Error deleting playlist: ", err);
        }
    }

    return (
        <div className="playlist-page">
            <Link to='/home/library' className='playlist-nav'><IoIosArrowBack /></Link>
            <div className="playlist-container">
                <div className="playlist-header">
                    <img className="playlist-art" />
                    <Outlet />
                    {playlist ? (
                        <div className="playlist-info" key={playlist.id}>
                            <p id="identifier">Playlist</p>
                            <h1>{playlist.title}</h1>
                            <p>{playlist.description}</p>
                            <button className="play-button"><IoIosPlayCircle /></button>
                            <button className="delete-button" onClick={handleDeletePlaylist}>Delete Playlist</button>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="song-container">
                    <div className="song-table-header">
                        <span>Title</span>
                        <span>Album</span>
                    </div>
                    {songs.length > 0 ? (
                        songs.map((song) => (
                            <SongCard
                                key={song.songId || song.id}
                                song={song}
                                showAddButton={false}
                                showAlbum={true}
                                showDeleteButton={true}
                            />
                        ))
                    ) : (
                        <p>No songs found</p>
                    )}
                </div>
            </div>
        </div>
    );
}