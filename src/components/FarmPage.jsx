import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Fab,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { domen } from "../constants";
import { useState, useEffect } from "react";

export default function FarmPage() {
  const { id } = useParams();
  const location = useLocation();
  const userId = location.state ? location.state.userId : null;
  const [collaborators, setCollaborators] = useState([]);
  const token = sessionStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [collName, setCollName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [innogotchies, setInnogotchies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    logInFarm();
    getRole();
    getFarmName();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCollaborators();
      getFarmInnogotchies();
    }
  }, [isAuthenticated]);

  async function getCollaborators() {
    try {
      const url = `http://${domen}/api/Farm/collaborators?farmId=${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseCollaborators = await response
          .json()
          .then((data) => data.map((email) => email.split("@")[0]));
        console.log("Responce:", responseCollaborators);
        setCollaborators(responseCollaborators);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function logInFarm() {
    const url = `http://${domen}/api/Farm/log-in-farm`;
    const data = {
      userId: userId,
      farmId: id,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responceData = await response.text();
        sessionStorage.setItem("token", responceData);
        setIsAuthenticated(true);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getRole() {
    const url = `http://${domen}/api/Farm/get-role?userId=${userId}&farmId=${id}`;
    console.log("Id:", userId, "FarmId:", id);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        const responceData = await response.text();
        const number = parseInt(responceData, 10);
        if (number === 1) {
          setIsAdmin(true);
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleCollNameChange() {
    const url = `http://${domen}/api/Farm/add-collaborator?farmId=${id}`;
    const data = {
      userEmail: collName,
      farmId: id,
    };

    setCollName("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        getCollaborators();
        const responceData = await response.json();
        console.log("Responce:", responceData);
      } else if(response.status === 400) {
        alert("User not found. Enter correct user email.");
      }
      else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getFarmName() {
    const url = `http://${domen}/api/Farm/farm-name?farmId=${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        const responceData = await response.text();
        setFarmName(responceData);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function deadInnogotchi(innogotchiId) {
    const url = `http://${domen}/api/Innogotchi/dead?InnogotchiId=${innogotchiId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        console.log("Dead Confirmed");
        getFarmInnogotchies();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function innogotchiCard(innogotchiId, innogotchiName, age, happinessDays, hungerLevel, thirstLevel, body, eyes, mouth, nose, ) {
    let hungerColor = '';
    let thirstColor = '';

    if(hungerLevel === "Full") {hungerColor = 'green'}
    else if(hungerLevel === "Normal") {hungerColor = '#DDDD00'}
    else if(hungerLevel === "Hunger") {hungerColor = 'orange'}
    else if(hungerLevel === "Dead") {hungerColor = 'red'}

    if(thirstLevel === "Full") {thirstColor = 'green'}
    else if(thirstLevel === "Normal") {thirstColor = '#DDDD00'}
    else if(thirstLevel === "Thirst") {thirstColor = 'orange'}
    else if(thirstLevel === "Dead") {thirstColor = 'red'}

    return (
      //410, 360
      <Card sx={{display: 'flex', flexDirection: 'column', width: 410, height: 360, border: 1, position: 'relative'}}>
        <Box display="flex" flexDirection="row">
        <div style={{overflow: "hidden", width: 120, height: 170, display: "flex", justifyContent: "center", alignItems: "center"}}>
          {body && <img src={`data:image/svg+xml;base64,${body}`} style={{width: 100, height: 160, marginLeft: 20}}/>}
        </div>
        <img src={`data:image/svg+xml;base64,${eyes}`} style={{position: "absolute", width: 27, height: 27, marginLeft: 55, marginTop: 4}}/>
        <img src={`data:image/svg+xml;base64,${mouth}`} style={{position: "absolute", width: 27, height: 27, marginLeft: 55, marginTop: 21}}/>
        <img src={`data:image/svg+xml;base64,${nose}`} style={{position: "absolute", width: 29, height: 29, marginLeft: 53, marginTop: 37}}/>
        <CardContent sx={{fontSize: '30px', marginLeft: 'auto'}}>
          <Typography sx={{fontSize: '30px'}}>{innogotchiName}<br/></Typography>
            {age===0 ?
            <Typography sx={{fontSize: '30px'}}><span style={{backgroundColor: 'blue', color: 'white', padding: '0 5px', borderRadius: '5px'}}>newborn</span><br/></Typography>
            :
            <Typography sx={{fontSize: '30px'}}>Age: {age}<br/></Typography>}
          <Typography sx={{fontSize: '30px'}}>Happiness Days: {happinessDays}<br/></Typography>
        </CardContent>
        </Box>
        <CardContent >
          <Typography sx={{fontSize: '30px'}}>Hunger level: <span style={{backgroundColor: hungerColor, color: 'white', padding: '0 5px', borderRadius: '5px'}}>{hungerLevel}</span> <br/> </Typography>
          <Typography sx={{fontSize: '30px'}}>Thirst level: <span style={{backgroundColor: thirstColor, color: 'white', padding: '0 5px', borderRadius: '5px'}}> {thirstLevel}</span> <br/> </Typography>
        </CardContent>
        <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
          {hungerLevel === "Dead" || thirstLevel === "Dead" ?
          <Button variant="contained" onClick={() => deadInnogotchi(innogotchiId)}>OK</Button>
          :
          <Box sx={{display: 'flex', justifyContent: "space-evenly", width: '100%'}}>
            <Button variant="contained"onClick={() => {feedInnogotchi(innogotchiId)}} disabled={hungerLevel === "Full"}>Feed</Button>
            <Button variant="contained" onClick={() => {drinkInnogotchi(innogotchiId)}} disabled={thirstLevel === "Full"}>Drink</Button>
          </Box>
          }
        </CardActions>
      </Card>
    );
  }

  async function feedInnogotchi(innogotchiId) {
    const url = `http://${domen}/api/Innogotchi/feed?innogotchiId=${innogotchiId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        getFarmInnogotchies();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function drinkInnogotchi(innogotchiId) {
    const url = `http://${domen}/api/Innogotchi/drink?innogotchiId=${innogotchiId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        getFarmInnogotchies();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getFarmInnogotchies() {
    const url = `http://${domen}/api/Innogotchi/farm-innogotchies?farmId=${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const responceData = await response.json();
        console.log("Innogotchies:", responceData);
        setInnogotchies(responceData);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Box sx={{height: '100vh'}}>
    <Box sx={{display: 'flex', flexDirection: 'row', overflow: 'scroll', width: '70%', height: '100vh',flexWrap: "wrap", justifyContent: 'space-evenly', gap: 8, overflowX: 'hidden', top: 4}}>
      {innogotchies.map((innogotchi, index) => (
        <div key={index} style={{margin: 7}}>
          {innogotchiCard(innogotchi.innogotchiId, innogotchi.innogotchiName, innogotchi.age, innogotchi.happinessDays, innogotchi.hungerLevel, innogotchi.thirstLevel, innogotchi.body, innogotchi.eyes, innogotchi.mouth, innogotchi.nose)}
        </div>
      ))}
    </Box>
    <Box>
      {isAdmin && (<Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1,
          position: "absolute",
          bottom: 1,
          right: 1,
          height: "100vh",
        }}
      >
        <Button
          variant="contained"
          sx={{ marginTop: 1, width: 200, height: 50, fontSize: 16 }}
          onClick={() => (navigate(`/farm-detales/${id}`, { state: { userId: userId } }))}
        >
          {farmName}
        </Button>
        <Button
          variant="contained"
          sx={{ marginBottom: 15, width: 200, height: 50, fontSize: 16 }}
          onClick={() => (navigate(`/create-innogotchi/${id}`, { state: { userId: userId } }))}
        >
          Create Innogotchi
        </Button>
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
          <Box sx={{ marginBottom: 1 }}>
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              sx={{ marginRight: 1 }}
            >
              <AddIcon onClick={handleCollNameChange} />
            </Fab>
            <TextField
              value={collName}
              variant="outlined"
              size="small"
              sx={{ width: 200 }}
              onChange={(event) => {
                setCollName(event.target.value);
              }}
            />
          </Box>
          <List
            sx={{
              width: 200,
              height: 250,
              bgcolor: "background.paper",
              overflow: "auto",
              "& ul": { padding: 0 },
              border: 1,
              borderColor: "divider",
            }}
          >
            {collaborators.map((item, index) => (
              <li key={`section-${index}`}>
                <ul>
                  <ListItem>
                    <ListItemText primary={item} />
                  </ListItem>
                </ul>
              </li>
            ))}
          </List>
        </div>
      </Box>)}
    </Box>
    </Box>
  );
}
