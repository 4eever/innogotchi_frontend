import { TextField, Button, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { domen } from "../constants";

export default function CreateFarmPage() {
    const[farmName, setFarmName] = useState("");
    const url = `http://${domen}/api/Farm/create-farm`;
    const { id } = useParams();
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState('');

    function handleFarmNameChange(event) {
        setFarmName(event.target.value);
    }

    async function handlerSubmit(event) {
        event.preventDefault();

        const data = {
            userId: id,
            farmName: farmName
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
                const data = await response.json();
                console.log('Response:', data);
                navigate(`/farm/${data.farmId}`, { state: { userId: id } });
            } else if(response.status === 400) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                if (errorData && Array.isArray(errorData)) {
                    const errorMessages = errorData.map(error => error.errorMessage).join('\n');
                    setErrorMessages(errorMessages);
                }
            }else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <h2>Enter farm name</h2>
        <TextField name="Farm name" style={{marginBottom: '10px'}} label="Farm name" variant="outlined" onChange={handleFarmNameChange}/><br />
        <Button variant="text" onClick={handlerSubmit}>Submit</Button>
        {errorMessages && <Alert severity="error">{errorMessages}</Alert>}
    </form>
  );
}