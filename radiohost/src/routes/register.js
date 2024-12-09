import React, { useState } from "react"
import axios from "axios"
import { NotificationManager, NotificationContainer } from 'react-notifications' // Importing NotificationManager and NotificationContainer from 'react-notifications'
import 'react-notifications/lib/notifications.css'

export default function Registration() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            if (response.status === 201) {
                console.log(response);
                NotificationManager.success('You are registered!', 'Success', 2000);
                setTimeout(() => {
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
        <div className='entry-page'> {/* Rendering a div element with a class name 'login-page' */}
            <a href='/' className='entry-nav'>{'<'}</a>
            <div className='entry-form-container'>
                <h4> Create an Account</h4>
                <form className="entry-form" onSubmit={handleRegister}>
                    <label>Email</label>
                    <input type='email' onChange={(e) => setEmail(e.target.value)} />
                    <label>Username</label>
                    <input type='text' onChange={(e) => setUsername(e.target.value)} />
                    <label>Password</label>
                    <input type='password'  onChange={(e) => setPassword(e.target.value)} />
                    <button className = "entry-submit" type='submit'>Register</button>
                </form>    
            </div>
            
            <NotificationContainer />
        </div>
    )
}