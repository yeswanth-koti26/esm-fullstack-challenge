import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { fetchUtils } from "react-admin";
import { API_BASE_URL } from "../utils/common";

const WinsPerNationalityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const url = `${API_BASE_URL}/dashboard/wins_per_nationality`;
        const { json } = await fetchUtils.fetchJson(url);
        console.log("WinsPerNationality response:", json);
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load chart data", err);
      }
    };

    fetchChartData();
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return <p>Loading chart...</p>;
  }

  return (
    <Plot
      data={[
        {
          type: "bar",
          x: data.map((d) => d.nationality),
          y: data.map((d) => d.total_wins),
          marker: { color: "blue" },
        },
      ]}
      layout={{
        title: "Wins Per Nationality",
        xaxis: { title: "Nationality" },
        yaxis: { title: "Total Wins" },
      }}
    />
  );
};

export default WinsPerNationalityChart;
