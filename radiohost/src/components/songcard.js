import React from "react"
import { MdOutlinePlaylistAdd, MdOutlineAddCircleOutline } from "react-icons/md"
import "../styles/songcard.css"

const SongCard = ({ song, showAddButton = true, showAlbum = true, onClick }) => {
 

  return (
    <div className="song-card" onClick={onClick}>
        <img className="album-art" src={song.albumImages[2]?.url} alt={`${song.songName} album art`} />
        <div className="song-info">
            <h4 className="song-title">{song.songName}</h4>
            <p className="song-artist">
            {song.artist.map((artist, index) => (  //duration needed
                <span key={artist.id}>
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
    </div>
  );
};

export default SongCard;