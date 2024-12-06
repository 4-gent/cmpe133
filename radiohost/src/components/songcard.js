import React from "react"
import { MdOutlinePlaylistAdd, MdOutlineAddCircleOutline } from "react-icons/md"
import "../styles/songcard.css"

const SongCard = ({ song, showAddButton = true, showPlaylistButton = true }) => {
    const areControlsVisible = showAddButton || showPlaylistButton;

  return (
    <div className="song-card">
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
        {areControlsVisible && (
            <div className="song-actions">
            {showAddButton && (
                <button className="song-button"><MdOutlineAddCircleOutline /></button>
            )}
            {showPlaylistButton && (
                <button className="song-button"><MdOutlinePlaylistAdd /></button>
                )}
            </div>
         )}
    </div>
  );
};

export default SongCard;