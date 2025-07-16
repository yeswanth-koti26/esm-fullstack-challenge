import React, { useEffect, useState } from "react";
import {
  useList,
  ListContextProvider,
  DataTable,
  fetchUtils,
} from "react-admin";
import { stringify } from "query-string";
import { API_BASE_URL } from "../utils/common";

const httpClient = async (url, options = {}) => {
  const { json } = await fetchUtils.fetchJson(url, options);
  return json;
};

const TopDriversByWins = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopDrivers = async () => {
      try {
        const url = `${API_BASE_URL}/dashboard/top_drivers_by_wins?${stringify({
          range: "[0, 9]",
        })}`;
        const drivers = await httpClient(url);
        console.log("TopDriversByWins response:", drivers);
        if (Array.isArray(drivers)) {
          setData(drivers);
        }
      } catch (error) {
        console.error("Failed to load top drivers", error);
      }
    };

    fetchTopDrivers();
  }, []);

  const listContext = useList({ data });

  return Array.isArray(data) && data.length > 0 ? (
    <ListContextProvider value={listContext}>
      <DataTable resource="drivers" sx={{ boxShadow: 1 }}>
        <DataTable.Col source="id" />
        <DataTable.Col source="full_name" />
        <DataTable.Col source="nationality" />
        <DataTable.Col source="number_of_wins" />
      </DataTable>
    </ListContextProvider>
  ) : (
    <p>Loading...</p>
  );
};

export default TopDriversByWins;
