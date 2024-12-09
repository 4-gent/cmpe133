import React, { useState, useEffect } from "react"
import '../styles/library.css'
import albumart from "../assets/musicplayerimg.png"
import defaultimg from "../assets/defaultalbum.png"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Library() {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:4000/playlists/getAll', { withCredentials: true });
                console.log("Playlists:", response.data);
            } catch (error) {
                console.error("Error fetching playlists: ", error);
            }
        };
        fetchData();
    }, [])

    const goToPlaylist = (id) => {
        navigate(`/home/playlist/${id}`);
    };

    const handleCreatePlaylist = async(e) => {
        e.preventDefault();
        try{
            setShowModal(false);
            const newPlaylist = {
                title: title,
                description: description
            }

            const response = await axios.post('http://localhost:4000/playlists/create', newPlaylist, { withCredentials: true });

            if (response.status === 200) {
                console.log(response);
                navigate(`/home/playlist/${response.data.id}`);
            }

        } catch (error){
            console.error("Error creating playlist: ", error);
        }
    }

    return (
        <div>
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
            <button className="create-playlist" onClick={() => setShowModal(true)}>+ Create</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="d-flex justify-content-around flex-row flex-wrap">
                            <h3>New Playlist</h3>
                            <button className="close-modal" onClick={() => setShowModal(false)}>X</button>
                        </div>
                        <form className="create-form" onSubmit={handleCreatePlaylist}> 
                            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} /> 
                            <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} /> 
                            <button className="create-button" type='submit'>Create</button> 
                        </form>
                    </div>
                </div>
            )}
        </div>
        
    )
}