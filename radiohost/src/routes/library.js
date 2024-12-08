import React from "react"
import '../styles/library.css'
import albumart from "../assets/musicplayerimg.png"
import defaultimg from "../assets/defaultalbum.png"
import { useNavigate } from "react-router-dom"

export default function Library() {

    const navigate = useNavigate();

    const playlists = [
        { title: "Hip Hop", description: "Rappers Delight", image: null, id: "1"},
        { title: "Playlist Name", description: "Description", image: null, id: "2" },
        { title: "Playlist Name", description: "Description", image: null, id: "3" },
        { title: "Playlist Name", description: "Description", image: null, id: "4" },
        { title: "Playlist Name", description: "Description", image: null, id: "5" },
        { title: "Playlist Name", description: "Description", image: null, id: "6" },
        { title: "Playlist Name", description: "Description", image: null, id: "7" },
        { title: "Playlist Name", description: "Description", image: null, id: "8" },
        { title: "Playlist Name", description: "Description", image: null, id: "9" },
        { title: "Playlist Name", description: "Description", image: null, id: "10" },
        { title: "Playlist Name", description: "Description", image: null, id: "11" },
        { title: "Playlist Name", description: "Description", image: null, id: "12" },
      ];

    const goToPlaylist = (id) => {
        navigate(`/home/playlist/${id}`);
    };
    
    return (
        <>
            <div className="library-page"> 
                <h3>My Collection </h3>
                <div className="library-grid">
                {playlists.map((playlist, index) => (
                    <div className="library-card" 
                        key={playlist.id}
                        onClick={() => goToPlaylist(playlist.id)} 
                    >
                        {playlist.image ? (
                        <img src={playlist.image} alt={playlist.title} className="card-image" /> 
                        ) : (
                            <img src={defaultimg} alt={playlist.title} className="card-image" /> 
                        )}
                        <div className="card-info">
                            <h4 className="card-title">{playlist.title}</h4>
                            <p className="card-description">{playlist.description}</p>
                        </div>
                    </div>
                    ))}
                    
                </div>
            </div>
            <button className = "create-playlist">+ Create</button>
        </>
        
    )
}