import React, { useState } from 'react' // Importing React and useState hook from 'react' package
import axios from 'axios' // Importing axios library for making HTTP requests
import '../styles/login.css' // Importing CSS file for styling
import { NotificationManager, NotificationContainer } from 'react-notifications' // Importing NotificationManager and NotificationContainer from 'react-notifications'
import 'react-notifications/lib/notifications.css'

export default function Login() { // Defining a functional component called Login
    const [email, setEmail] = useState('') // Creating a state variable 'email' and a setter function 'setEmail' using useState hook, initial value is an empty string
    const [password, setPassword] = useState('') // Creating a state variable 'password' and a setter function 'setPassword' using useState hook, initial value is an empty string
    
    /*spotify test
        i coded it so that then you go to login page, it runs the spotify api calls to search, get playlists, etc
    */
   
    /*
    we need to take what ever we typed in in the search bar and send the request to search
    right now the search method has a hard coded input
    */ 
   
    const searchres = axios.get('http://localhost:4000/search/searchAll');
    //const playlistres = axios.get('http://localhost:4000/userPlaylists/UserPlaylists');
    //const createPlaylist = axios.post('http://localhost:4000/userPlaylists/Create');
    //const songToPlaylist = axios.put('http://localhost:4000/userPlaylists/AddSongToPlaylist');

    const handleLogin = async(e) => { // Defining an asynchronous function called handleLogin, which takes an event object as a parameter
        e.preventDefault() // Preventing the default form submission behavior

        try {
            const response = await axios.post('http://localhost:4000/login', { // Sending a POST request to 'http://localhost:4000/login' endpoint
                email, // Including the 'email' value in the request body
                password // Including the 'password' value in the request body
            })
            if (response.status === 200){
                console.log(response) // Logging the response data to the console
            }
        } catch (error) {
            console.log(error) // Logging any error that occurs during the request to the console
        }
    }

    return (
        <div className='login-page'> {/* Rendering a div element with a class name 'login-page' */}
            <a href='/' className='login-nav'>{'<'}</a>
            <div className='login-form-container'>
                <h4>Sign In</h4>
                <form className="login-form" onSubmit={handleLogin}> {/* Rendering a form element with handleLogin function as the submit event handler */}
                    <label>Email</label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} /> {/* Rendering an input element of type 'email' with a placeholder and value attribute bound to the 'email' state variable, and an onChange event handler to update the 'email' state */}
                    <label>Password</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} /> {/* Rendering an input element of type 'password' with a placeholder and value attribute bound to the 'password' state variable, and an onChange event handler to update the 'password' state */}
                    <button type='submit'>Login</button> {/* Rendering a button element with type 'submit' to submit the form */}
                </form>
            </div>
            <NotificationContainer /> {/* Rendering the NotificationContainer component */}
        </div>
    )
}
