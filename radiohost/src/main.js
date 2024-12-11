import React, { useState } from 'react' // Importing the React library
import './styles/main.css' // Importing the CSS file
import { NotificationManager, NotificationContainer } from 'react-notifications' // Importing NotificationManager and NotificationContainer from 'react-notifications'
import 'react-notifications/lib/notifications.css' // Importing the CSS file for notifications
import MainNav from './components/mainnav'
import axios from 'axios'
import './styles/main.css'
import Fade from 'react-reveal/Fade'
import { FaSearch, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Main(){ // Defining a default function component called Main
    const[query, setQuery] = useState('') // Creating a state variable 'query' and a setter function 'setQuery' using the useState hook, initial value is an empty string
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePrompt = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
          const response = await axios.post('http://localhost:5002/query', { query: query }, { withCredentials: true })
          console.log("Query response: ", response.data);
          if (response.status === 200){
            navigate(`/home/results?q=${query}`, {state: { results: response.data, query: query }});
          }
          else
          {
            console.log("Error fetching songs: ", response.data);
          }
        } catch (err){
          console.error("Error fetching songs: ", err);
        } finally{
          setLoading(false);
        }
      }

    
    return(
        <div className='main-page'>
            <Fade top>
                <div className='main-header'>
                    <nav>
                        <MainNav />
                    </nav>
                    <div className='main-header-internal'>
                        <h1 className='main-title'>RadioHost</h1> {/*Displaying the heading "Radio Host"*/}
                        <p className='main-subtitle'>What would you like to listen to?</p>
                        {!loading && (
                            <form className='input-container' onSubmit={handlePrompt}>
                            <input className='main-prompt' type='text' placeholder='Music like...' onChange={(e) => setQuery(e.target.value)} />
                            <button className='main-submit' type='submit'><FaSearch /></button>
                        </form>
                        )}
                        {loading && <FaSpinner className="loading-icon" />}
                    </div>
                </div>
            </Fade>
            <Fade top>
                <div className='main-body'>
                    <div className='main-body-left'>
                        <h3>What is RadioHost?</h3>
                        <p> 
                            RadioHost is an application that personalizes your music taste.
                            It uses advanced algorithms to recommend songs based on your preferences.
                            Discover new music and enjoy a tailored listening experience.
                        </p>
                    </div>
                    <div className='main-body-right'>
                        <h3>How does it work?</h3>
                        <p>
                            Simply enter a song or artist you like and RadioHost will give you recommendations.
                            You can save your favorite playlists and listen to what you want.
                            Start exploring new music today!
                        </p>
                    </div>
                </div>
            </Fade>
        </div>
    )
}
