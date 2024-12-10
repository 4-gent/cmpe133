import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import "../styles/songcard.css";
import axios from "axios";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const SongCard = ({ song, showAddButton = true, showAlbum = true, onClick }) => {
  const [showDeleteButton, setShowDeleteButton] = useState(true);

  if (!song) return null;

  const albumImageUrl = song.albumImages && song.albumImages[2] ? song.albumImages[2].url : '';

  const handleDeleteSong = async (e) => {
    try {
      console.log("song: ", song);
      const response = await axios.delete(`http://localhost:4000/playlists/delete-song`, { data: { songlink: song.songlink }, withCredentials: true }, {withCredentials: true});
      if (response.status === 200) {
        NotificationManager.success("Song deleted", "Success", 2000);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting song: ", err);
      NotificationManager.error("Error deleting song", "Error", 2000);
    }
  };

  return (
    <div className="song-card" onClick={onClick}>
      {albumImageUrl && (
        <img className="album-art" src={albumImageUrl} alt={`${song.songName} album art`} />
      )}
      <div className="song-info">
        <h4 className="song-title" key={song.id}>{song.songName}</h4>
        <p className="song-artist">
          {song.artist.map((artist, index) => (
            <span key={artist.id || index}>
              {artist.name}
              {index < song.artist.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>
      {showAddButton && (
        <div className="song-actions">
          <button className="song-button"><MdOutlineAddCircleOutline /></button>
        </div>
      )}
      {showAlbum && (
        <div className="song-album">
          <p className="song-album-text">{song.album}</p>
        </div>
      )}
      {showDeleteButton && (
        <button className="delete-button" onClick={handleDeleteSong}>Delete</button>
      )}
    </div>
  );
};

export default SongCard;