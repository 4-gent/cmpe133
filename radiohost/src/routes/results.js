import React, { useState, useEffect } from "react";
import "../styles/results.css";
import { Link, useSearchParams, useOutletContext  } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import SongCard from "../components/songcard.js";
import { useLocation } from "react-router-dom";
import MusicCard from "../components/musiccard.js";

export default function Results(props) {
  const [searchParams] = useSearchParams();
  const [albumImages, setAlbumImages] = useState([]);
  const [songImages, setSongImages] = useState([]);
  const {  setCurrentPlaylist } = useOutletContext();

  const location = useLocation();
  const query = searchParams.get("q") || location.state?.query || ""; // Retrieve query from search parameters or state
  const albums = location.state?.results?.output?.albums || []; // Retrieve albums
  const songs = location.state?.results?.output?.songs || []; // Retrieve songs
  
  console.log(location);
  console.log(albums);
  console.log(songs);
  console.log(query);

  const fetchAlbumImages = async (albumLink) => {
    const albumId = albumLink.split("/album/")[1]; // Extract album ID
    try {
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        }
      });
      return response.data.images[0]?.url; // Get the first image (high-res)
    } catch (error) {
      console.error("Error fetching album image", error);
      return null;
    }
  };

  // Fetch song images using the song ID
  const fetchSongImages = async (songLink) => {
    const songId = songLink.split("/track/")[1]; // Extract track ID
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        }
      });
      return response.data.album.images[0]?.url; // Get the album image
    } catch (error) {
      console.error("Error fetching song image", error);
      return null;
    }
  };

  // Load album and song images when the component mounts or when albums/songs change
  useEffect(() => {
    const loadImages = async () => {
      const albumImages = await Promise.all(albums.map(album => fetchAlbumImages(album.albumlink)));
      const songImages = await Promise.all(songs.map(song => fetchSongImages(song.songlink)));
      setAlbumImages(albumImages);
      setSongImages(songImages);
    };
    
    loadImages();
  }, [albums, songs]);


  const handleSongClick = (song) => {
    setCurrentPlaylist({ songs: [song] });
  }
  return (
    <div className="results-container">
      <div className="search-display">
        <h3>Results for: "{query}" </h3>
        <Link to='/home'><button className="search-button">
          {" "}
          <FaSearch />{" "}
        </button></Link>
      </div>
      <div className="song-content">
        <h5> Songs </h5>
        {/* Container for Albums */}
        {/* Render Albums */}
        <div className="container albums-container">
          <h2>Albums</h2>
          <div className="cards">
            {/*needs to be album card */}
            {albums.map((album, index) => (
              <MusicCard key={index} item={album} image={albumImages[index]} type="album" />
            ))}
          </div>
        </div>

        {/* Render Songs */}
        <div className="container songs-container">
          <h2>Songs</h2>
          <div className="cards">
            {songs.map((song, index) => (
              <MusicCard key={index} item={song} image={songImages[index]} onClick={() => handleSongClick(song)} type="song" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
