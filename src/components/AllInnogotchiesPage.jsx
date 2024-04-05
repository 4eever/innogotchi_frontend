import { domen } from "../constants";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, Typography, Pagination } from "@mui/material";

export default function AllInnogotchiesPage() {
    const {id} = useParams();
    const [innogotchiesbeforeSort, setInnogotchiesBeforeSort] = useState([]);
    const [innogotchies, setInnogotchies] = useState([]);
    const [happinessDaysButton, setHappinessDaysButton] = useState(false);
    const [ageButton, setAgeButton] = useState(false);
    const [hungerLevelButton, setHungerLevelButton] = useState(false);
    const [thirstyLevelButton, setThirstyLevelButton] = useState(false);
    const pagesCount = Math.ceil(innogotchies.length/16);
    const [currentPage, setCurrentPage] = useState(1);
    console.log("Page", currentPage);

    useEffect(() => {
        getAllInnogotchies();
        setHappinessDaysButton(true);
    }, []);

    useEffect(() => {
      sortInnogotchies();
      setCurrentPage(1);
    }, [innogotchiesbeforeSort]);

    const handleButtonClick = (buttonSetter) => {
      setHappinessDaysButton(false);
      setAgeButton(false);
      setHungerLevelButton(false);
      setThirstyLevelButton(false);
      buttonSetter(true);

      getAllInnogotchies()
    };

    function levelToNumber(level) {
      switch (level) {
        case "Full": return 1;
        case "Normal": return 2;
        case "Hunger": return 3;
        case "Dead": return 4;
        default: return 5;
      }
    }

    function sortInnogotchies() {
      if(happinessDaysButton) {
        setInnogotchies([...innogotchiesbeforeSort].sort((a, b) => b.happinessDays - a.happinessDays));
        console.log("1");
      } else if(ageButton) {
        setInnogotchies([...innogotchiesbeforeSort].sort((a, b) => b.age - a.age));
        console.log("2");
      } else if(hungerLevelButton) {
        setInnogotchies([...innogotchiesbeforeSort].sort((a, b) => levelToNumber(a.hungerLevel) - levelToNumber(b.hungerLevel)));
        console.log("3");
      }
      else if(thirstyLevelButton) {
        setInnogotchies([...innogotchiesbeforeSort].sort((a, b) => levelToNumber(a.thirstLevel) - levelToNumber(b.thirstLevel)));
        console.log("4");
      }
    }

    function innogotchiCard(innogotchiName, age, happinessDays, hungerLevel, thirstLevel, body, eyes, mouth, nose, ) {
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
        <Card sx={{display: 'flex', flexDirection: 'column', width: 410, height: 300, border: 1, position: 'relative'}}>
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
        </Card>
      );
    }

    async function getAllInnogotchies() {
        const url = `http://${domen}/api/Innogotchi/all-innogotchies?userId=${id}`;
    
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (response.ok) {
            const responceData = await response.json();
            console.log("Response:", responceData);
            setInnogotchiesBeforeSort(responceData);
          } else {
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }

    return (
      <Box  sx={{ display: "flex" }}>
        <Box sx={{display: 'flex', flexDirection: 'row', overflow: 'scroll', width: '70%', height: '100vh',flexWrap: "wrap", justifyContent: 'space-evenly', gap: 8, overflowX: 'hidden', top: 4}}>
          {innogotchies
            .slice((currentPage - 1) * 16, currentPage * 16)
            .map((innogotchi, index) => (
              <div key={index} style={{margin: 7}}>
                {innogotchiCard(innogotchi.innogotchiName, innogotchi.age, innogotchi.happinessDays, innogotchi.hungerLevel, innogotchi.thirstLevel, innogotchi.body, innogotchi.eyes, innogotchi.mouth, innogotchi.nose)}
              </div>
            ))}
            <Box sx={{display: 'flex', width: "100%", justifyContent: 'center', alignItems: 'center'}}>
              {pagesCount > 1 && <Pagination count={pagesCount} size="large" page={currentPage} onChange={(event, value) => setCurrentPage(value)} />}
            </Box>
        </Box>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-end", width: '30%', justifyContent: "space-evenly", marginRight: 10, height: "100vh"}}>
          <Button variant="contained" sx={{ width: 200, height: 50, fontSize: 16 }} disabled={happinessDaysButton} onClick={() => handleButtonClick(setHappinessDaysButton)}>Нappiness Days</Button>
          <Button variant="contained" sx={{ width: 200, height: 50, fontSize: 16 }} disabled={ageButton} onClick={() => handleButtonClick(setAgeButton)}>Age</Button>
          <Button variant="contained" sx={{ width: 200, height: 50, fontSize: 16 }} disabled={hungerLevelButton} onClick={() => handleButtonClick(setHungerLevelButton)}>Hunger Level</Button>
          <Button variant="contained" sx={{ width: 200, height: 50, fontSize: 16 }} disabled={thirstyLevelButton} onClick={() => handleButtonClick(setThirstyLevelButton)}>Thirsty Level</Button>
        </Box>
      </Box>
    );
}