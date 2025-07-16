import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Plot from "react-plotly.js";
import axios from "axios";
import { Title } from "react-admin";

// ✅ Reusable chart components
import TopDriversByWins from "../components/TopDriversByWins";
import WinsPerNationalityChart from "../components/WinsPerNationalityChart";
import RacesPerYearChart from "../components/RacesPerYearChart";

const PolePositionsChart = () => {
  const [poleData, setPoleData] = useState<{ driver: string; pole_positions: number }[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard/pole_positions_per_driver")
      .then((res) => setPoleData(res.data))
      .catch((err) => console.error("Error fetching pole positions:", err));
  }, []);

  const driverNames = poleData.map((d) => d.driver);
  const poleCounts = poleData.map((d) => d.pole_positions);

  return (
    <Plot
      data={[
        {
          x: driverNames,
          y: poleCounts,
          type: "bar",
          marker: { color: "orange" },
        },
      ]}
      layout={{
        title: { text: "Pole Positions Per Driver" },
        xaxis: {
          title: "Driver",
          tickangle: -45,
        },
        yaxis: {
          title: "Pole Positions",
        },
        margin: { t: 60, b: 140 },
      }}
    />
  );
};

export const Dashboard = () => (
  <Card sx={{ m: 2, p: 2 }}>
    <Title title="F1 Dashboard" />
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "left" }}>
            Top Drivers by Wins
          </Typography>
          <TopDriversByWins />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "left" }}>
            Wins Per Nationality
          </Typography>
          <WinsPerNationalityChart />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "left" }}>
            Races Per Year
          </Typography>
          <RacesPerYearChart />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "left" }}>
            Pole Positions Per Driver
          </Typography>
          <PolePositionsChart />
        </Grid>
      </Grid>
    </Box>
  </Card>
);
