import React, { useState, useEffect, useRef } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, TextField, IconButton, InputAdornment, Alert } from '@mui/material';
import { Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { domen, createBase64FromImage } from "../constants";

export default function AccountDetalesPage() {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const url = `http://${domen}/api/User/account-detales`;
    const fileInput = useRef(null);
    const [errorMessages, setErrorMessages] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userId: '',
        userEmail: '',
        userPassword: '',
        userFirstName: '',
        userLastName: '',
        userAvatar: ''
    });

    useEffect(() => {
        getUser();
    }, []);

    function handleUserChange(event) {
        setUser({...user, [event.target.name]: event.target.value});
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function handleUserDetales(event) {
        event.preventDefault();
    
        const data = {
            userId: user.userId,
            userEmail: user.userEmail,
            userPassword: user.userPassword,
            userFirstName: user.userFirstName,
            userLastName: user.userLastName,
            userAvatar: user.userAvatar
        };
        console.log('Data:', data);
    
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Response:', responseData);
                navigate(`/farm-overview/${id}`);
            }else if(response.status === 400){
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

    const handleChangePassword = (event) => {
        const oldPassword = event.target.value;

        if(oldPassword === user.userPassword) {
            setIsDisabled(false)
        }
    }

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    }

    const handleButtonClick = () => {
        setUser({...user, userPassword: newPassword});
        handleClose();
    }

    const handleAvatarClick = () => {
        fileInput.current.click();
    }
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            createBase64FromImage(file)
                .then(base64 => {
                    setUser({...user, userAvatar: base64});
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }else {
            console.log('No file selected');
        }
    }

    async function getUser() {
        try {
            const url = `http://${domen}/api/User/?userId=${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const responseUser = await response.json();
                console.log('Response:', responseUser);
                setUser(responseUser);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return(
        <div style={{ position: 'relative', height: '97vh'}}>
            <Box style={{ position: 'absolute', top: 30, left: 30 }}>
            <img 
                src={user.userAvatar ? `data:image/jpeg;base64,${user.userAvatar}` : '/avatar.jpg'} 
                alt="avatar" 
                width="200" 
                height="200" 
                style={{marginBottom: '10px'}}
            /><br />
                <Button style={{width: '200px'}} onClick={handleAvatarClick}>Change Avatar</Button>
                <input type="file" ref={fileInput} style={{display: 'none'}} onChange={handleFileChange} />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', top: 10}}>
                {errorMessages && <Alert severity="error" >{errorMessages}</Alert>}
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
                <Box className="user-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px'}}>
                    <Typography variant="h6" style={{ marginRight: '10px'}}>First Name</Typography>
                    {user.userFirstName && (<TextField name="userFirstName" id="standard-basic" variant="standard" defaultValue={user.userFirstName} onChange={handleUserChange}/>)} <br />
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px'}}>
                    <Typography variant="h6" style={{ marginRight: '10px'}}>Last Name</Typography>
                    {user.userLastName && (<TextField name="userLastName" id="standard-basic" variant="standard" defaultValue={user.userLastName} onChange={handleUserChange}/>)} <br />
                </Box>
                <Typography variant="h6" style={{ marginBottom: '20px'}}>{user.userEmail}</Typography>
                <Button variant="outlined" style={{width: '20%'}} onClick={handleClickOpen}>Change Password</Button>
                <Dialog open={open} onClose={ () => {handleClose(); setIsDisabled(true);}}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <TextField 
                            margin="dense" 
                            label="Old Password" 
                            type={showPassword ? "text" : "password"} 
                            fullWidth
                            onChange={handleChangePassword} 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField 
                            disabled={isDisabled} 
                            autoFocus 
                            margin="dense" 
                            label="New Password" 
                            type="password" 
                            fullWidth 
                            value={newPassword} 
                            onChange={handleNewPasswordChange}/>
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button disabled={isDisabled} onClick={handleButtonClick}>OK</Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
            <Box style={{ position: 'absolute', bottom: 30, right: 30 }}>
                <Button onClick={handleUserDetales}>Save Changes</Button>
            </Box>               
        </div>
    );
}