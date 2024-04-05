import { useParams } from "react-router-dom";
import { domen } from "../constants";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts//PieChart";

export default function FarmDetalesPage() {
  const { id } = useParams();
  const token = sessionStorage.getItem("token");
  const [farmStatistics, setFarmStatistics] = useState({});

  useEffect(() => {
    getFarmStatististics();
  }, []);

  async function getFarmStatististics() {
    const url = `https://${domen}/api/Farm/farm-statistics?farmId=${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responceData = await response.json();
        console.log("Response:", responceData);
        setFarmStatistics(responceData);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "50%", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: 10,
            marginLeft: 5,
            gap: 3,
          }}
        >
          <Typography variant="h4">
            Alive pets: {farmStatistics.petsAlive}
          </Typography>
          <Typography variant="h4">
            Dead pets: {farmStatistics.petsDead}
          </Typography>
        </Box>
        <Box sx={{ marginTop: 10 }}>
        { (farmStatistics.petsAlive > 0 || farmStatistics.petsDead > 0) && <PieChart
            series={[ 
              {
                data: [
                  {
                    id: 0,
                    value: farmStatistics.petsAlive,
                    label: "Alive pets",
                  },
                  { id: 1, value: farmStatistics.petsDead, label: "Dead pets" },
                ],
              },
            ]}
            width={600}
            height={400}
          /> }
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          width: "50%",
        }}
      >
        <Box sx={{ marginTop: 5, marginRight: 5 }}>
          <Typography variant="h4">{farmStatistics.farmName}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: 10,
            marginRight: 15,
            gap: 3,
          }}
        >
          <Typography variant="h4">
            Average feeding period: {farmStatistics.averageFeedPeriod}
          </Typography>
          <Typography variant="h4">
            Average thirsty quenching period:{" "}
            {farmStatistics.averageDrinkPeriod}
          </Typography>
          <Typography variant="h4">
            Average pet’s happiness days: {farmStatistics.averageHappinessDays}
          </Typography>
          <Typography variant="h4">
            Average pet’s age: {farmStatistics.averagePetsAge}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
