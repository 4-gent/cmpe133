import React, { useState, useEffect } from "react";
import "../styles/results.css";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  MdOutlinePlaylistAdd,
  MdOutlineAddCircleOutline,
} from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import SongCard from "../components/songcard.js";
import { useLocation } from "react-router-dom";
import MusicCard from "../components/musiccard.js";

export default function Results() {
  const [searchParams] = useSearchParams();
  // const [songs, setSongs] = useState([]);
  const location = useLocation();
  const query = location.state?.results?.query || ""; // Retrieve query if needed
  const albums = location.state?.results?.output?.albums || []; // Retrieve albums
  const songs = location.state?.results?.output?.songs || []; // Retrieve songs
  console.log(location);
  console.log(albums);
  console.log(songs);
  console.log(query);

  useEffect(() => {
    if (query) {
      console.log("Query:", query);
      axios
        .get(`http://localhost:4000/search/searchAll?q=${query}`)
        .then((response) => {
          //setSongs(response.data);
        })
        .catch((error) => {
          console.error("Error fetching songs: ", error);
        });
    }
  }, [query]);

  return (
    <div className="results-container">
      <div className="search-display">
        <h3>Results for: "{query}" </h3>
        <button className="search-button">
          {" "}
          <FaSearch />{" "}
        </button>
      </div>
      <div className="song-content">
        <h5> Songs </h5>
        {/* Container for Albums */}
        {/* Render Albums */}
        <div className="container albums-container">
          <h2>Albums</h2>
          <div className="cards">
            {albums.map((album, index) => (
              <MusicCard key={index} item={album} type="album" />
            ))}
          </div>
        </div>

        {/* Render Songs */}
        <div className="container songs-container">
          <h2>Songs</h2>
          <div className="cards">
            {songs.map((song, index) => (
              <MusicCard key={index} item={song} type="song" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
