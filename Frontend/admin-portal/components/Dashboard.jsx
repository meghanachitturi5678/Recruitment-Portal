import React, { useState, useEffect, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Table from "@mui/material/Table";
import Grid from "@mui/material/Grid";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PieChart } from "@mui/x-charts/PieChart";
import { MenuItem, Button, Popover, TextField } from "@mui/material";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

const StatCard = ({ title, count, icon: Icon }) => {
  return (
    <Card
      sx={{
        border: 1,
        padding: "1rem",
        boxShadow: "none",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Icon sx={{ fontSize: "3rem", color: "#040b0a" }} />
        </Grid>
        <Grid item xs={9}>
          <Typography component="div" variant="h5" sx={{ margin: 0 }}>
            {count}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{ margin: 0 }}
          >
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [positionNames, setPositionNames] = useState([]);
  const statuses = [
    "Applied",
    "Shortlisted",
    "Round 1",
    "Round 2",
    "Selected",
    "Rejected",
  ];
  const [PositionsRoundData, setPositionsRoundData] = useState({});
  const [PositionsTypeData, setPositionsTypeData] = useState([]);
  const [PositionsStatusData, setPositionsStatusData] = useState([]);
  const [ApplicationStatusData, setApplicationStatusData] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [startMonth, setStartMonth] = useState(1);
  const [startYear, setStartYear] = useState(2000);
  const [endMonth, setEndMonth] = useState(12);
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const handleStartMonthChange = (event) => {
    setStartMonth(event.target.value);
  };

  const handleStartYearChange = (event) => {
    setStartYear(Number(event.target.value));
  };

  const handleEndMonthChange = (event) => {
    setEndMonth(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setEndYear(Number(event.target.value));
  };

  const handleAllResults = () => {
    setStartMonth(1);
    setEndMonth(12);
    setStartYear(2000);
    setEndYear(new Date().getFullYear());
  };

  function checkDateRange(date) {
    const applicationDate = new Date(date);
    const applicationYear = applicationDate.getFullYear();
    const applicationMonth = applicationDate.getMonth() + 1;

    if (
      (applicationYear > startYear ||
        (applicationYear === startYear && applicationMonth >= startMonth)) &&
      (applicationYear < endYear ||
        (applicationYear === endYear && applicationMonth <= endMonth))
    ) {
      return true;
    }

    return false;
  }

  const generatePositionsRoundData = () => {
    const data = {};
    applications.forEach((application) => {
      const { position, status } = application;
      if (positionNames.includes(position)) {
        data[position] = data[position] || { Total: 0 };
        data[position][status] = (data[position][status] || 0) + 1;
        data[position]["Total"]++;
      }
    });
    return data;
  };

  const generatePositionsTypeData = () => {
    return [
      {
        id: 0,
        value: positions.filter((position) => position.type === "Regular")
          .length,
        label: "Regular",
      },
      {
        id: 1,
        value: positions.filter((position) => position.type === "Consolidated")
          .length,
        label: "Consolidated",
      },
      {
        id: 2,
        value: positions.filter((position) => position.type === "Outsourcing")
          .length,
        label: "Outsourcing",
      },
    ];
  };

  const generatePositionsStatusData = () => {
    const openRegular = positions.filter(
      (position) => position.type === "Regular" && position.status === "Open"
    ).length;

    const closedRegular = positions.filter(
      (position) => position.type === "Regular" && position.status === "Closed"
    ).length;

    const openConsolidated = positions.filter(
      (position) =>
        position.type === "Consolidated" && position.status === "Open"
    ).length;

    const closedConsolidated = positions.filter(
      (position) =>
        position.type === "Consolidated" && position.status === "Closed"
    ).length;

    const openOutsourcing = positions.filter(
      (position) =>
        position.type === "Outsourcing" && position.status === "Open"
    ).length;

    const closedOutsourcing = positions.filter(
      (position) =>
        position.type === "Outsourcing" && position.status === "Closed"
    ).length;

    return [
      {
        label: "Open",
        data: [openRegular, openConsolidated, openOutsourcing],
      },
      {
        label: "Closed",
        data: [closedRegular, closedConsolidated, closedOutsourcing],
      },
    ];
  };

  const generateApplicationStatusData = () => {
    const data = [];
    statuses.forEach((status) => {
      const filteredApps = applications.filter((app) => app.status === status);
      data.push(filteredApps.length);
    });

    return [
      {
        label: "Applications",
        data: data,
      },
    ];
  };

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND}/apply/`).then((response) =>
        response.json()
      ),
      fetch(`${import.meta.env.VITE_BACKEND}/positions`).then((response) =>
        response.json()
      ),
      fetch(`${import.meta.env.VITE_BACKEND}/templates/`).then((response) =>
        response.json()
      ),
      fetch(`${import.meta.env.VITE_BACKEND}/employees/`).then((response) =>
        response.json()
      ),
    ])
      .then(([applicationsData, positionsData, templatesData, employeesData]) => {
        setApplications(
          applicationsData.filter((application) =>
            checkDateRange(application.createdAt)
          )
        );
        setPositions(
          positionsData.filter((position) =>
            checkDateRange(position.postingDate)
          )
        );
        setPositionNames(
          positionsData
            .filter((position) => checkDateRange(position.postingDate))
            .map((position) => position.roleName)
        );
        setTemplates(
          templatesData
        );
        setEmployees(employeesData);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [startMonth, endMonth, startYear, endYear]);

  useEffect(() => {
    setPositionsRoundData(generatePositionsRoundData());
    setPositionsTypeData(generatePositionsTypeData());
    setPositionsStatusData(generatePositionsStatusData());
    setApplicationStatusData(generateApplicationStatusData());
  }, [applications, positions]);

  const renderFilterOptions = () => {
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            paddingTop: "50px",
            height: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            variant="contained"
            style={{ margin: "1rem" }}
            onClick={handleOpenPopover}
          >
            Filters
          </Button>
        </div>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div style={{ width: "300px", padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  select
                  name="Start Month"
                  id="Start Month"
                  label="Start Month"
                  value={startMonth}
                  onChange={handleStartMonthChange}
                  sx={{ width: "100%" }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                  ;
                </TextField>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Start Year"
                  value={startYear}
                  onChange={handleStartYearChange}
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  inputProps={{ min: 2000, max: new Date().getFullYear() }}
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  select
                  name="End Month"
                  id="End Month"
                  label="End Month"
                  value={endMonth}
                  onChange={handleEndMonthChange}
                  sx={{ width: "100%" }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                  ;
                </TextField>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="End Year"
                  value={endYear}
                  onChange={handleEndYearChange}
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  inputProps={{ min: 2000, max: new Date().getFullYear() }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  style={{ margin: "1rem" }}
                  onClick={handleAllResults}
                >
                  All Results
                </Button>
              </Grid>
            </Grid>
          </div>
        </Popover>
      </div>
    );
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "10%", width: "100%" }}>
        <h1>Dashboard</h1>
      </div>
      <div
        style={{
          height: "85%",
          width: "100%",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <>
          <Grid container spacing={2}>
            <Grid item xs={8} container spacing={0}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <StatCard
                    title="Applications"
                    count={applications.length}
                    icon={GroupsIcon}
                  />
                </Grid>
                <Grid item xs={3}>
                  <StatCard
                    title="Positions"
                    count={positions.length}
                    icon={WorkIcon}
                  />
                </Grid>
                <Grid item xs={3}>
                  <StatCard title="Employees" count={employees.length} icon={BadgeIcon} />
                </Grid>
                <Grid item xs={3}>
                  <StatCard
                    title="Templates"
                    count={templates.length}
                    icon={AttachEmailIcon}
                  />
                </Grid>
              </Grid>

              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: statuses,
                    label: "Status",
                  },
                ]}
                yAxis={[
                  {
                    label: "Number of Applications",
                    tickMinStep: 1,
                  },
                ]}
                series={ApplicationStatusData}
                height={350}
                slotProps={{ legend: { hidden: true } }}
              />

              <TableContainer
                component={Paper}
                sx={{ border: "0.5px solid", boxShadow: 0, margin: "30px" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Positions</strong>
                      </TableCell>
                      <TableCell key="Total" align="center">
                        <strong>Total</strong>
                      </TableCell>
                      {statuses.map((status) => (
                        <TableCell key={status} align="center">
                          <strong>{status}</strong>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positionNames.map((position) => (
                      <TableRow key={position}>
                        <TableCell>
                          <strong>{position} </strong>
                        </TableCell>
                        <TableCell key="Total" align="center">
                          {PositionsRoundData[position]?.["Total"] || 0}
                        </TableCell>
                        {statuses.map((status) => (
                          <TableCell key={status} align="center">
                            {PositionsRoundData[position]?.[status] || 0}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={4}>
              {renderFilterOptions()}
              <Typography variant="h5" sx={{ marginTop: "100px" }}>
                Positions
              </Typography>
              <PieChart
                series={[
                  {
                    id: "status",
                    data: PositionsTypeData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                    innerRadius: 20,
                    outerRadius: 90,
                  },
                ]}
                height={300}
              />

              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Regular", "Consolidated", "Outsourcing"],
                    label: "Type",
                  },
                ]}
                yAxis={[
                  {
                    label: "Number of Positions",
                    tickMinStep: 1,
                  },
                ]}
                series={PositionsStatusData}
                height={350}
              />
            </Grid>
          </Grid>
        </>
      </div>
    </div>
  );
};

export default Dashboard;
