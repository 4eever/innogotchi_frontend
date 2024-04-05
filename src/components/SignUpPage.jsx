import { TextField, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { domen } from "../constants";

export default function SignUpPage() {
    const [user, setUser] = useState({email: '', password: '', firstName: '', lastName: ''});
    const url = `https://${domen}/api/User/sing-up`;
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState('');

    function handleUserChange(event) {
        setUser({...user, [event.target.name]: event.target.value});
    }

    async function handleSignUp(event) {
        event.preventDefault();
    
        const data = {
            userEmail: user.email,
            userPassword: user.password,
            userFirstName: user.firstName,
            userLastName: user.lastName
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Response:', responseData);
                navigate(`/farm-overview/${responseData.userId}`);
            } else if(response.status === 400) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                if (errorData && Array.isArray(errorData)) {
                    const errorMessages = errorData.map(error => error.errorMessage).join('\n');
                    setErrorMessages(errorMessages);
                }
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return(
        <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h1>Innogotchi</h1>
            <TextField name="email" style={{marginBottom: '10px'}} label="Email" variant="outlined" onChange={handleUserChange}/><br />
            <TextField name="password" style={{marginBottom: '10px'}} label="Password" variant="outlined" onChange={handleUserChange}/><br />
            <TextField name="firstName" style={{marginBottom: '10px'}} label="First Name" variant="outlined" onChange={handleUserChange}/><br />
            <TextField name="lastName" style={{marginBottom: '10px'}} label="Last Name" variant="outlined" onChange={handleUserChange}/><br />
            <Button variant="text" onClick={handleSignUp}>Sign Up</Button>
            {errorMessages && <Alert severity="error">{errorMessages}</Alert>}
        </form>
    );
}