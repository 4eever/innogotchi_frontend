import { Box, Button, IconButton, TextField } from "@mui/material";
import ArrowBackIosIconNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { domen } from "../constants";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function CreateInnogotchiPage() {
  const { id } = useParams();
  const [isBodyButton, setIsBodyButton] = useState(false);
  const [isEyesButton, setIsEyesButton] = useState(false);
  const [isNoseButton, setIsNoseButton] = useState(false);
  const [isMouthButton, setIsMouthButton] = useState(false);
  const [number, setNumber] = useState(0);
  const [bodyNumber, setBodyNumber] = useState(0);
  const [eyesNumber, setEyesNumber] = useState(0);
  const [noseNumber, setNoseNumber] = useState(0);
  const [mouthNumber, setMouthNumber] = useState(0);
  const [body, setBody] = useState("");
  const [eyes, setEyes] = useState("");
  const [nose, setNose] = useState("");
  const [mouth, setMouth] = useState("");
  const [innogotchiName, setInnogotchiName] = useState("");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state ? location.state.userId : null;

  const handleButtonClick = (buttonSetter) => {
    setIsBodyButton(false);
    setIsEyesButton(false);
    setIsNoseButton(false);
    setIsMouthButton(false);
    buttonSetter(true);
  };

  useEffect(() => {
    if (isBodyButton || isEyesButton || isNoseButton || isMouthButton) {
      if (number === 1) {
        getInnogotchiBodyPart(1);
      } else {
        setNumber(1);
      }
    }
  }, [isBodyButton, isEyesButton, isNoseButton, isMouthButton]);

  useEffect(() => {
    if (number > 0) {
      getInnogotchiBodyPart(number);
    }
  }, [number]);

  async function getInnogotchiBodyPart(bodyPartNumber) {
    let bodyPartName = "";
    if (isBodyButton) {
      bodyPartName = "Body";
      console.log("Body", { bodyPartNumber });
    } else if (isEyesButton) {
      bodyPartName = "Eyes";
      console.log("Eyes", { bodyPartNumber });
    } else if (isNoseButton) {
      bodyPartName = "Nose";
      console.log("Nose", { bodyPartNumber });
    } else if (isMouthButton) {
      bodyPartName = "Mouth";
      console.log("Mouth", { bodyPartNumber });
    }

    try {
      const url = `https://${domen}/api/Innogotchi/innogotchi-body-part-image?innogotchiBodyPartName=${bodyPartName}&innogotchiBodyPartNumber=${bodyPartNumber}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseUser = await response.text();
        if (responseUser === "") {
          setNumber(number - 1);
        } else {
          console.log("Response:", responseUser);

          if (isBodyButton) {
            setBody(responseUser);
            setBodyNumber(number);
          } else if (isEyesButton) {
            setEyes(responseUser);
            setEyesNumber(number);
          } else if (isNoseButton) {
            setNose(responseUser);
            setNoseNumber(number);
          } else if (isMouthButton) {
            setMouth(responseUser);
            setMouthNumber(number);
          }
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleArrowBackClick() {
    if (number > 0 && number !== 1) {
      setNumber(number - 1);
    }
  }

  function handleArrowForwardClick() {
    if (number > 0) {
      setNumber(number + 1);
    }
  }

  async function createInnogotchi() {
    const url = `https://${domen}/api/Innogotchi/create-innogotchi?farmId=${id}`;
    const data = {
      farmid: id,
      innogotchiName: innogotchiName,
      bodyNumber: bodyNumber,
      eyesNumber: eyesNumber,
      noseNumber: noseNumber,
      mouthNumber: mouthNumber,

    }

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
        const responceData = await response.json();
        console.log(responceData);
        navigate(`/farm/${id}`, { state: { userId: userId } })
      }else if(response.status === 400) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        if(errorData && Array.isArray(errorData)) {
          const errorMessages = errorData.map(error => error.errorMessage).join('\n');
          alert(errorMessages);
        }
      }else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }

  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ width: 150, height: 50, fontSize: 16, marginLeft: 20 }}
            onClick={() => handleButtonClick(setIsBodyButton)}
            disabled={isBodyButton}
          >
            Body
          </Button>
          <Button
            variant="contained"
            sx={{ width: 150, height: 50, fontSize: 16 }}
            onClick={() => handleButtonClick(setIsEyesButton)}
            disabled={isEyesButton}
          >
            Eyes
          </Button>
          <Button
            variant="contained"
            sx={{ width: 150, height: 50, fontSize: 16 }}
            onClick={() => handleButtonClick(setIsNoseButton)}
            disabled={isNoseButton}
          >
            Nose
          </Button>
          <Button
            variant="contained"
            sx={{ width: 150, height: 50, fontSize: 16, marginRight: 20 }}
            onClick={() => handleButtonClick(setIsMouthButton)}
            disabled={isMouthButton}
          >
            Mouth
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton onClick={handleArrowBackClick}>
            <ArrowBackIosIconNew sx={{ fontSize: 90 }} />
          </IconButton>
          <IconButton onClick={handleArrowForwardClick}>
            <ArrowForwardIosIcon sx={{ fontSize: 90 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", marginBottom: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
            <TextField
              id="standard-basic"
              label="Innogotchi Name"
              variant="standard"
              sx={{marginLeft: 20}}
              onChange={(event) => {
                setInnogotchiName(event.target.value);
              }}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ width: 150, height: 50, fontSize: 16, marginRight: 1}}
            onClick={createInnogotchi}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box>
        {body && (
          <img
            src={`data:image/svg+xml;base64,${body}`}
            alt="body"
            width="400"
            height="400"
            style={{ position: "absolute", top: 140, left: 550 }}
          />
        )}
        {eyes && (
          <img
            src={`data:image/svg+xml;base64,${eyes}`}
            alt="eyes"
            width="70"
            height="70"
            style={{ position: "absolute", top: 140, left: 710 }}
          />
        )}
        {nose && (
          <img
            src={`data:image/svg+xml;base64,${nose}`}
            alt="nose"
            width="75"
            height="75"
            style={{ position: "absolute", top: 183, left: 710 }}
          />
        )}
        {mouth && (
          <img
            src={`data:image/svg+xml;base64,${mouth}`}
            alt="noutyh"
            width="80"
            height="80"
            style={{ position: "absolute", top: 225, left: 707 }}
          />
        )}
      </Box>
    </Box>
  );
}
