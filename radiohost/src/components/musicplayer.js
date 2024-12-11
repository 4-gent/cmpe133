import React, { useState, useEffect } from "react"
import axios from "axios"
import '../styles/musicplayer.css'
import albumart from "../assets/musicplayerimg.png"
import defaultimg from "../assets/defaultalbum.png"
import SongCard from "../components/songcard.js"
import { IoIosPlayCircle } from "react-icons/io"
import { IoPlaySkipBackCircle, IoPlaySkipForwardCircle, IoPauseCircle  } from "react-icons/io5"

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

export default function MusicPlayer(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(true);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [deviceId, setDeviceId] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleControlClick = (e) => { 
        e.stopPropagation(); 
    };


    useEffect(() => {
        if (props.playlist && props.playlist.songs) {
            setQueue(props.playlist.songs); 
            setCurrentIndex(0);
            playTrack(props.playlist.songs[0]); 
        }
    }, [props.playlist]);

    //use effect songs

    // const query = "twice";
    // const [songs, setSongs] = useState([]);

    // useEffect(() => { 
    //     if (query) {
    //         console.log("Query:", query);  
    //         axios.get(`http://localhost:4000/search/searchAll?q=${query}`)
    //         .then(response => {
    //             setSongs(response.data); 
    //         })
    //         .catch(error => {
    //             console.error("Error fetching songs: ", error);
    //         });

    //     }
    // }, [query]);

    
    
    useEffect(() => {
        if (!window.Spotify) { 
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }

        let player;
        window.onSpotifyWebPlaybackSDKReady = () => {
            if (player) {
                console.log("Player already initialized");
                return;
            }
            player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb) => cb(props.token),
                volume: 0.5,
            });
            setPlayer(player);
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('player_state_changed', (state) => {
                if (!state) return;

                setTrack(state.track_window.current_track);
                setPaused(state.paused);
    
                player.getCurrentState().then((state) => {
                    setActive(!!state); 
                });
            });
            
            player.connect();
            player.setName("RadioHost")
        };
    
        return () => {
            if (player) {
                player.disconnect();
                setPaused(true);
                setActive(false);
                setTrack(null);
                console.log("State reset and player disconnected.");
            }
        };
    
    }, [props.token]);

    const playTrack = (song) => {
        const trackUri = `spotify:track:${song.songlink.split("/track/")[1]}`; // Extract URI from songlink
        console.log("URI:", trackUri);

        if (!deviceId) {
            console.error("Device ID is not set yet.");
            return;
        }
    
        const headers = {
            "Authorization": `Bearer ${props.token}`,
            "Content-Type": "application/json",
        };
    
        const body = {
            uris: [trackUri], // URI of the track to play
        };
    
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers,
        })
            .then(response => {
                if (response.ok) {
                    console.log("Playback started");
                } else {
                    console.error("Error starting playback:", response);
                }
            })
            .catch(err => console.error("Error:", err));
    };


    const skipToNext = () => {
        if (queue.length === 0) return;

        const nextIndex = (currentIndex + 1) % queue.length; // Loop back to the start if at the end
        setCurrentIndex(nextIndex);
        playTrack(queue[nextIndex]); // Play the next track
    };

    const skipToPrevious = () => {
        if (queue.length === 0) return;

        const previousIndex = (currentIndex - 1 + queue.length) % queue.length; // Wrap around to the end if at the start
        setCurrentIndex(previousIndex);
        playTrack(queue[previousIndex]); // Play the previous track
    };

    
    return (
        <>
            {is_active && (
            <div className = {`player-container ${isExpanded ? "expanded" : ""}`} onClick={toggleExpansion} >
            
                
                    <div className="upper-player" > 
                        <div className="cd-container">  
                            <img src ={is_active? current_track.album.images[2].url : defaultimg} className ="curr-img" />
                        </div>
                        <div className="curr-info">
                            <h6 className="curr-title"> {is_active? current_track.name : "" }</h6>
                            <p className="curr-artist">{is_active? current_track.artists[0].name : "" }</p>
                         </div>
                        <div className="controls" onClick={handleControlClick} >
                            <button onClick={skipToPrevious}><IoPlaySkipBackCircle /></button>
                             <button onClick={() => {player.togglePlay()}}>
                                {is_paused ? <IoIosPlayCircle /> : <IoPauseCircle />}
                            </button>
                            <button onClick={skipToNext}><IoPlaySkipForwardCircle /></button>
                        </div>   
                    </div>
                  
                        {isExpanded && (
                             <div className="queue" onClick={handleControlClick}>
                                <h3>Playing From:</h3>
                                <h3 style={{color: '#4F378B'}}> {props.playlist && props.playlist.title ? props.playlist.title : "Results"}</h3>
                            <div>
                                {queue.length > 0 ? (
                                    queue.map((song, index) => <SongCard 
                                        key={song.songId || song.id}
                                        song={song}
                                        showAddButton={false}
                                        showAlbum={true}
                                        showDeleteButton={false}
                                        onClick={() => { setCurrentIndex(index); playTrack(song); }}
                                    />)
                                    ) : (
                                        <p>No songs found</p>
                                    )}
                            </div>
                            </div>
                        )}
               </div>
            )}
            
        </>
        
        
    );
    
};