import React, { useState, useEffect } from "react"
import '../styles/library.css'
import albumart from "../assets/musicplayerimg.png"
import defaultimg from "../assets/defaultalbum.png"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { NotificationManager, NotificationContainer } from 'react-notifications' // Importing NotificationManager and NotificationContainer from 'react-notifications'
import 'react-notifications/lib/notifications.css'

export default function Library() {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:4000/playlists/getAll', { withCredentials: true });
                console.log("Playlists:", response.data);
                setPlaylists(response.data);
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
            const newPlaylist = {
                title: title,
                description: description
            }

            console.log("New Playlist: ", newPlaylist);

            const response = await axios.post('http://localhost:4000/playlists/create', newPlaylist, { withCredentials: true });
            if (response.status === 200) {
                console.log(response);
                setShowModal(false);
                // navigate(`/home/playlist/${response.data.id}`);
                window.location.reload();
            }
        } catch (error){
            if (error.response) {
                if (error.response.status === 401) { // Checking if the response status is 400 (Bad Request)
                    NotificationManager.error(error.response.data, 'Error', 2000); // Displaying an error notification
                } else if (error.response.status === 400) { // Checking if the response status is 401 (Unauthorized)
                    NotificationManager.error(error.response.data, 'Error', 2000); // Displaying an error notification
                } else {
                    NotificationManager.error(error.response.data, 'Error', 2000); // Displaying a generic error notification
                }
            } else {
                NotificationManager.error(error.response.data, 'Error', 2000); // Displaying a generic error notification
            }
        }
    }

    return (
        <div>
            <div className="library-page"> 
                <h3>My Collection </h3>
                <div className="library-grid">
                {playlists.map((playlist, index) => (
                    <div className="library-card" 
                        key={playlist._id}
                        onClick={() => goToPlaylist(playlist._id)} 
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
                {!playlists.length && <p>Loading...</p>}
                </div>
            </div>
            <button className="create-playlist" onClick={() => setShowModal(true)}>+ Create</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="d-flex flex-row justify-content-around">
                            <h3>New Playlist</h3>
                            <button className="close-modal" onClick={() => setShowModal(false)}>X</button>
                        </div>
                        <form className="create-form" onSubmit={handleCreatePlaylist}> 
                            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required /> 
                            <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required /> 
                            <button className="create-button" type='submit'>Create</button> 
                        </form>
                    </div>
                </div>
            )}
            <NotificationContainer />
        </div>
    )
}