import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ApplicationDetails from "./ApplicationDetails";
import EmailIcon from "@mui/icons-material/Email";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

// for tabs
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && (
        <div style={{ height: "100%" }}>
          <Box sx={{ p: 3, height: "100%" }}>
            <Typography component="div" sx={{ height: "100%" }}>
              {children}
            </Typography>
          </Box>
        </div>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
  };
}

export default function ApplicationsDataTable() {
  const [value, setValue] = useState(0);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/apply/`)
      .then((response) => response.json())
      .then((data) => {
        const updatedApplications = data;
        setApplications(updatedApplications);
      })
      .catch((error) => {
        console.error("Error fetching applications", error);
      });
  }, []);

  const refreshData = () => {
    fetch(`${import.meta.env.VITE_BACKEND}/apply/`)
      .then((response) => response.json())
      .then((data) => {
        const updatedApplications = data;
        setApplications(updatedApplications);
        console.log("fetched applications", data);
      })
      .catch((error) => {
        console.error("Error fetching applications", error);
      });
  };

  const filteredApplications = (status) => {
    let filtered = applications;

    if (status !== "All") {
      filtered = filtered.filter((app) => app.status === status);
    }

    return filtered.map((app, index) => ({
      ...app,
      id: index + 1,
      slNo: index + 1,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRowClick = (params) => {
    if (isPanelOpen && params.row._id === selectedApplication?._id) {
      setIsPanelOpen(false);
    } else {
      setIsPanelOpen(true);
      setSelectedApplication(params.row);
    }
  };

  const tabs = [
    "All",
    "Applied",
    "Shortlisted",
    "Round 1",
    "Round 2",
    "Selected",
    "Rejected",
  ];

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
      flex: 23,
      headerAlign: "left",
      align: "left",
      valueGetter: (params) =>
        `${params.row.name.firstName || ""} ${
          params.row.name.middleName || ""
        } ${params.row.name.lastName || ""}`,
      renderHeader: () => <strong>{"Name"}</strong>,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 22,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Position"}</strong>,
    },
    {
      field: "city",
      headerName: "City",
      flex: 15,
      headerAlign: "left",
      align: "left",
      valueGetter: (params) => `${params.row.address.city || ""}`,
      renderHeader: () => <strong>{"City"}</strong>,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 10,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Gender"}</strong>,
    },

    {
      field: "age",
      headerName: "Age",
      flex: 10,
      headerAlign: "left",
      align: "left",
      renderHeader: () => <strong>{"Age"}</strong>,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 15,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params.row.emailSent && (
              <EmailIcon sx={{ fontSize: "1.3rem", marginRight: "5px" }} />
            )}
            {!params.row.emailSent && (
              <MailOutlineIcon
                sx={{ fontSize: "1.3rem", marginRight: "5px" }}
              />
            )}
            {params.row.forwardedTo != "" ? "Forwarded" : params.row.status}
          </>
        );
      },
      renderHeader: () => <strong>{"Status"}</strong>,
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "15%", width: "100%", alignItems: "flex-end" }}>
        <h1>Applications</h1>
      </div>
      <div style={{ height: "70%", width: "100%", alignItems: "flex-end" }}>
        <Grid container spacing={2} style={{ height: "100%" }}>
          <Grid
            item
            xs={isPanelOpen ? 8.5 : 12}
            style={{
              transition: "width 1s",
              padding: "1rem",
              height: "100%",
            }}
          >
            <Box
              sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
            >
              <Tabs value={value} onChange={handleTabChange}>
                {tabs.map((tab, index) => (
                  <Tab key={index} label={tab} {...a11yProps(index)} />
                ))}
              </Tabs>
            </Box>
            <Box sx={{ width: "100%", height: "100%", flexGrow: 1 }}>
              {tabs.map((tab, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                  <Box sx={{ width: "100%", height: "100%" }}>
                    <DataGrid
                      rows={filteredApplications(tab)}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 10 },
                        },
                      }}
                      pageSizeOptions={[10]}
                      onRowClick={handleRowClick}
                    />
                  </Box>
                </CustomTabPanel>
              ))}
            </Box>
          </Grid>
          {isPanelOpen && (
            <Grid
              item
              xs={12}
              md={3.5}
              style={{
                transition: "width 1s",
                borderRadius: "5px",
                padding: "1rem",
                paddingTop: "2rem",
                height: "130%",
                transform: "translateY(-7%)",
              }}
            >
              <ApplicationDetails
                data={selectedApplication}
                refreshData={refreshData}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}
