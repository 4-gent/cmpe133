import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import "../styles/songcard.css";
import axios from "axios";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const MusicCard = ({ item, type = "song", showAddButton = true, onClick }) => {
  const isSong = type === "song";
  const [playlists, setPlaylists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleButtonClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      try {
        const response = await axios.get('http://localhost:4000/playlists/getAll', { withCredentials: true });
        setPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching playlists: ", error);
      }
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      console.log("Adding song to playlist: ", playlistId);
      const response = await axios.put('http://localhost:4000/playlists/addSong', { playlistId, item }, { withCredentials: true });
      if (response.status === 200) {
        NotificationManager.success("Song added to playlist", "Success", 2000);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error adding song to playlist: ", error);
      NotificationManager.error("Error adding song to playlist", "Error", 2000);
    }
  };

  return (
    <div className="song-card" onClick={onClick}>
      {/* Info */}
      <img src="https://st2.depositphotos.com/4441075/7805/v/450/depositphotos_78053068-stock-illustration-music-web-icon-with-note.jpg" />
      <div className="song-info">
        <h4 className="song-title">{isSong ? item.songName : item.albumName}</h4>
        <p className="song-artist">
          {isSong
            ? item.artist.map((artist, index) => (
                <span key={artist.id}>
                  {artist.name}
                  {index < item.artist.length - 1 && ", "}
                </span>
              ))
            : item.artist}
        </p>
      </div>

      {/* Actions */}
      {showAddButton && isSong && (
        <div className="song-actions">
          <button className="song-button" onClick={handleButtonClick}>
            <MdOutlineAddCircleOutline />
          </button>
          {showDropdown && (
            <div className="dropdown">
              <label className="dropdown-label">Your Playlists</label>
              <ul>
                {playlists.map((playlist) => (
                  <li key={playlist._id} onClick={() => handleAddToPlaylist(playlist._id)}>
                    {playlist.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <NotificationContainer />
    </div>
  );
};

export default MusicCard;