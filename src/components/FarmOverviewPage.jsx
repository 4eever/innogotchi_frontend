import { 
    Button,
    Avatar,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { 
    Link, 
    useParams,
    useNavigate
} from 'react-router-dom';
import { domen } from "../constants";

export default function FarmOverviewPage() {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [roleId1Data, setRoleId1Data] = useState({});
    const [roleId2Data, setRoleId2Data] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
        getFarms();
    }, []);

    console.log('User:', user);

    async function getFarms() {
        try {
            const url = `http://${domen}/api/Farm/all-user-farms?userId=${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Response:', responseData);
                filterDataByRoleId(responseData);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function filterDataByRoleId(data) {
        const roleId1Data = data.find(item => item.roleId === 1);
        const roleId2Data = data.filter(item => item.roleId === 2);
        setRoleId1Data(roleId1Data);
        setRoleId2Data(roleId2Data);
        console.log('roleId 1 data:', roleId1Data);
        console.log('roleId 2 data:', roleId2Data);
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
                const data = await response.json();
                console.log('Response:', data);
                setUser(data);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div style={{ height: '100vh',position: 'relative'}}>
            <Button style={{ position: 'absolute', top: 3, right: 3 }} onClick={() => navigate(`/account-detales/${user.userId}`)}>
                <Avatar alt="avatar" src={`data:image/jpeg;base64,${user.userAvatar}`} style={{ marginRight: '10px' }}/>
                {user.userEmail ? user.userEmail.split('@')[0] : ''}
            </Button>
            <div style={{ borderLeft: '2px solid black', borderRight: '2px solid black', textAlign: 'center', height: '100vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                <h1 style={{marginBottom: '15%', marginTop: 0, paddingTop: 25}} >Welcome back to Innogotchi</h1>
                <form style={{border: '2px solid black',height: '20%', width: '20%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '5%' }}>
                    <h2>My Farm</h2>
                    {roleId1Data  ? (
                        <a 
                            href={`/farm/${roleId1Data.farmId}`} 
                            style={{ fontSize: '20px', textDecoration: 'none' }}
                            onClick={(event) => {
                                event.preventDefault();
                                navigate(`/farm/${roleId1Data.farmId}`, { state: { userId: user.userId } });
                            }}
                        >
                            {roleId1Data.farmName}: {roleId1Data.petsAlive}
                        </a>                    
                        ) : (
                        <Link to={`/create-farm/${user.userId}`}>
                            <Button style={{fontSize: '100%'}}>Create Farm</Button>
                        </Link>
                    )}
                </form>
                <form style={{ display: "flex", flexDirection: 'column', border: '2px solid black',height: '20%', width: '20%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '5%', overflow: "auto", overflowX: 'hidden'}}>
                    <div style={{height: '25%'}}>
                        <h2 style={{ margin: 0, padding: 0}}>My collabs</h2>
                    </div>
                    <div style={{height: '75%', overflow: "auto", overflowX: 'hidden',display: 'flex', flexDirection: 'column', gap: 7}}>
                    {roleId2Data.length > 0 ? (
                        roleId2Data.map((item, index) => 
                            <div key={index}>
                                <a
                                    href={`/farm/${roleId1Data ? roleId1Data.farmId : ''}`}
                                    style={{ fontSize: '20px', textDecoration: 'none'}}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/farm/${item.farmId}`, { state: { userId: user.userId } });
                                   }}
                                >
                                    {item.farmName}: {item.petsAlive}
                                </a>
                            </div>
                        )
                    ) : (
                        <p>You don't have any collabs yet :(</p>
                    )}
                    </div>
                </form>
                <Button style={{fontSize: '89%', width: '20%'}} onClick={() => navigate(`/all-innogotchies/${user.userId}`)}>All Innogotchies</Button>
            </div>
        </div>
    );
}
