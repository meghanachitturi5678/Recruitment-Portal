import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import EditPosition from "./EditPosition";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newPosition, setNewPosition] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/positions`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching positions", error);
      });
  }, []);

  const refreshData = () => {
    fetch(`${import.meta.env.VITE_BACKEND}/positions`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching positions", error);
      });
  };

  const handleRowClick = (params) => {
    setNewPosition(false);
    if (isPanelOpen && params.row._id === selectedPosition?._id) {
      setIsPanelOpen(false);
    } else {
      setIsPanelOpen(true);
      setSelectedPosition(params.row);
    }
  };

  const handleCreateNewPosition = () => {
    if (isPanelOpen && newPosition == true) {
      setIsPanelOpen(false);
    } else {
      setNewPosition(true);
      setSelectedPosition({});
      setIsPanelOpen(true);
    }
  };

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
      field: "roleName",
      headerName: "Role Name",
      flex: 10,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Role Name"}</strong>,
      minWidth: 150,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 25,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Description"}</strong>,
      minWidth: 250,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 10,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Type"}</strong>,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 10,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Status"}</strong>,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "salary",
      headerName: "Salary",
      type: "number",
      flex: 10,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Salary"}</strong>,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 10,
      headerAlign: "left",
      align: "left",
      valueGetter: (params) => `${params.row.postingDate.split("T")[0] || ""}`,
      renderHeader: () => <strong>{"Posting Date"}</strong>,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "advtNo",
      headerName: "Advertisement No",
      flex: 15,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Advertisement No"}</strong>,
      minWidth: 100,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-line",
            textAlign: "left",
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  const rows = data.map((row, index) => {
    const { _id, ...rest } = row;
    return { id: index + 1, _id: _id, ...rest };
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "10%", width: "100%", alignItems: "flex-end" }}>
        <h1>Positions</h1>
      </div>
      <div
        style={{
          height: "5%",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleCreateNewPosition}
          style={{ margin: "1rem" }}
        >
          Add Position
        </Button>
      </div>
      <div style={{ height: "80%", width: "100%", alignItems: "flex-end" }}>
        <Grid container spacing={2} style={{ height: "100%" }}>
          <Grid
            item
            xs={isPanelOpen ? 9 : 12}
            style={{ transition: "width 1s", padding: "1rem", height: "100%" }}
          >
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
              getRowHeight={(params) => {
                let maxLines = 1;
                Object.values(params.model).forEach((value) => {
                  if (typeof value === "string") {
                    const lines = value.split("\n").length;
                    maxLines = Math.max(maxLines, lines);
                  }
                });
                return 25 + maxLines * 20;
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              onRowClick={handleRowClick}
            />
          </Grid>
          {isPanelOpen && (
            <Grid
              item
              xs={12}
              md={3}
              style={{
                transition: "width 1s",
                borderRadius: "5px",
                padding: "1rem",
                paddingTop: "2rem",
                height: "100%",
              }}
            >
              <EditPosition
                data={selectedPosition}
                isNewPos={newPosition}
                refreshData={refreshData}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}
