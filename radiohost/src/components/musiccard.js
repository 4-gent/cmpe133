import React from "react";
import { MdOutlinePlaylistAdd, MdOutlineAddCircleOutline } from "react-icons/md";
import "../styles/songcard.css";

const MusicCard = ({ item, type = "song", showAddButton = true, onClick }) => {
  const isSong = type === "song";

  return (
    <div className="song-card" onClick={onClick}>
     

      {/* Info */}
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
          <button className="song-button">
            <MdOutlineAddCircleOutline />
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicCard;
