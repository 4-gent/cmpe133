import React, { useState } from 'react' // Importing the React library
import './styles/main.css' // Importing the CSS file
import { NotificationManager, NotificationContainer } from 'react-notifications' // Importing NotificationManager and NotificationContainer from 'react-notifications'
import 'react-notifications/lib/notifications.css' // Importing the CSS file for notifications
import MainNav from './components/mainnav'
import axios from 'axios'
import './styles/main.css'
import Fade from 'react-reveal/Fade'
import { FaSearch } from "react-icons/fa";

export default function Main(){ // Defining a default function component called Main
    const[query, setQuery] = useState('') // Creating a state variable 'query' and a setter function 'setQuery' using the useState hook, initial value is an empty string

    const handlePrompt = async(e) => {
        e.preventDefault()
        try {
            console.log(query)
        } catch (error) {
            console.log(error)
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
                        <h1 className='main-title'>Radio Host</h1> {/*Displaying the heading "Radio Host"*/}
                        <p className='main-subtitle'>What would you like to listen to?</p>
                        <form className='input-container' onSubmit={handlePrompt}>
                            <input className='main-prompt' type='text' placeholder='Music like...' onChange={(e) => setQuery(e.target.value)} />
                            <button className='main-submit' type='submit'><FaSearch /></button>
                        </form>
                    </div>
                </div>
            </Fade>
            <Fade bottom>
                <div className='main-body'>
                    <div className='main-body-left'>
                        <h3>What is RadioHost?</h3>
                        <p> Explain Here </p>
                    </div>
                    <div className='main-body-right'>
                        <h3>How does it work?</h3>
                        <p> Explain here </p>
                    </div>
                </div>
            </Fade>
        </div>
    )
}
