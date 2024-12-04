import React, { useState } from "react";
import axios from "axios";
import { NotificationManager, NotificationContainer } from 'react-notifications' // Importing NotificationManager and NotificationContainer from 'react-notifications'
import 'react-notifications/lib/notifications.css'

export default function Registration() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    /*testing spotify
    i coded it so that when you go to the registration page, it authenticates the user
    we need to do this first then we can access all of spotify api's features.
    */
    window.location.href = 'http://localhost:4000/SpotifyAuth/auth';

    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            const data = {
                email,
                username,
                password
            };
            console.log(data);
            const response = await axios.post('http://localhost:4000/register', data, { withCredentials: true });
            if (response.status === 200) {
                console.log(response);
                setTimeout(() => {
                    NotificationManager.success('You are registered!', 'Success', 2000);
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error.response);
                setTimeout(() => {
                    NotificationManager.error('This user already exists, please try again.', 'Error', 2000);
                }, 1000);
            } else {
                console.log(error);
                setTimeout(() => {
                    NotificationManager.error('Registration failed, please try again.', 'Error', 2000);
                }, 1000);
            }
        }
    }

    return (
        <div className='register-page'>
            <form onSubmit={handleRegister}>
                <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                <input type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Register</button>
            </form>
            <NotificationContainer />
        </div>
    )
}