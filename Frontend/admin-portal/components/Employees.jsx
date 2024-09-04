import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

export default function Employees() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/employees`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching employees", error);
      });
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "S. No.",
      width: 70,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"S. No"}</strong>,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 30,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Name"}</strong>,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 35,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Email"}</strong>,
      minWidth: 250,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 30,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Department"}</strong>,
      minWidth: 100,
    },
  ];

  const rows = data.map((row, index) => {
    const { _id, ...rest } = row;
    return { id: index + 1, _id: _id, ...rest };
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "15%", width: "100%", alignItems: "flex-end" }}>
        <h1>Employees</h1>
      </div>
      <div style={{ height: "80%", width: "100%", alignItems: "flex-end" }}>
        <DataGrid
          rows={rows}
          columns={columns.map((column) => ({
            ...column,
            renderCell: (params) => (
              <div style={{ whiteSpace: "pre-line", textAlign: "left" }}>
                {params.value}
              </div>
            ),
          }))}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
        />
      </div>
    </div>
  );
}
