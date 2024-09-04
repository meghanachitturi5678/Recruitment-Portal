import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem, Grid } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";

const emptyData = {
  requirements: "",
  roleName: "",
  description: "",
  type: "Regular",
  responsibilities: "",
  salary: "",
  hiringDuration: "",
  startDate: "",
  endDate: "",
  postingDate: "",
  advtNo: "",
  status: "Open", // Default status for new positions
};

const defaultErrors = {
  requirements: false,
  roleName: false,
  description: false,
  type: true,
  responsibilities: false,
  salary: false,
  hiringDuration: false,
  startDate: false,
  endDate: false,
  postingDate: false,
  advtNo: false,
  status: true,
};

export default function EditPosition({ data, isNewPos, refreshData }) {
  const [isNewPosition, setIsNewPosition] = useState(isNewPos);
  const [formData, setFormData] = useState(isNewPosition ? emptyData : data);
  const [isEditing, setIsEditing] = useState(isNewPosition);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showErrors, setShowErrors] = useState(defaultErrors);
  const [pos_id, setPos_id] = useState(isNewPosition ? "" : data._id);

  useEffect(() => {
    setIsNewPosition(isNewPos);
    setIsEditing(isNewPos);
    setFormData(isNewPos ? emptyData : data);
    setPos_id(isNewPos ? "" : data._id);
    setShowErrors(defaultErrors);
  }, [data, isNewPos]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  function checkValidFields() {
    if (
      formData.roleName.trim() &&
      formData.roleName.trim() &&
      formData.description.trim() &&
      formData.type.trim() &&
      formData.responsibilities.trim() &&
      formData.hiringDuration.trim() &&
      formData.startDate.trim() &&
      formData.endDate.trim() &&
      formData.postingDate.trim() &&
      formData.advtNo.trim() &&
      formData.status.trim()
    ) {
      return true;
    } else {
      return false;
    }
  }

  const handleSave = () => {
    setIsEditing(false);
    if (!checkValidFields()) {
      setAlertMessage("Invalid Fields!");
      setAlertSeverity("error");
      setAlertOpen(true);
    } else if (isNewPosition) {
      setIsNewPosition(false);
      fetch(`${import.meta.env.VITE_BACKEND}/positions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            setAlertMessage("Failed to add new position!");
            setAlertSeverity("error");
            setAlertOpen(true);
          } else {
            setAlertMessage("Position added successfully!");
            setAlertSeverity("success");
            setAlertOpen(true);
            refreshData();
          }
          return response.json();
        })
        .then((data_p) => {
          setPos_id(data_p._id);
        })
        .catch((error) => {
          console.error("Error adding new position:", error);
          setAlertMessage("Failed to add new position!");
          setAlertSeverity("error");
          setAlertOpen(true);
        });
    } else {
      fetch(`${import.meta.env.VITE_BACKEND}/positions/edit/${pos_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            setAlertMessage("Failed to update position!");
            setAlertSeverity("error");
            setAlertOpen(true);
          } else {
            setAlertMessage("Position updated successfully!");
            setAlertSeverity("success");
            setAlertOpen(true);
            refreshData();
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error updatiog position:", error);
          setAlertMessage("Failed to update position!");
          setAlertSeverity("error");
          setAlertOpen(true);
        });
    }
  };

  const handleDelete = () => {
    fetch(`${import.meta.env.VITE_BACKEND}/positions/${pos_id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          setAlertMessage("Failed to delete position");
          setAlertSeverity("error");
          setAlertOpen(true);
        } else {
          setAlertMessage("Position deleted successfully!");
          setAlertSeverity("success");
          setAlertOpen(true);
          refreshData();
          setFormData(emptyData);
          setShowErrors(defaultErrors);
        }
      })
      .catch((error) => {
        setAlertMessage("Failed to delete position");
        setAlertSeverity("error");
        setAlertOpen(true);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClick = (e) => {
    const { name, value } = e.target;
    setShowErrors({ ...showErrors, [name]: true });
  };

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingTop: "5px",
      }}
    >
      <FormControl>
        <Grid container spacing={2} marginBottom={"1rem"}>
          <Grid item xs={12}>
            <TextField
              name="roleName"
              label="Role Name"
              value={formData.roleName}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.roleName && !formData.roleName}
              helperText={!formData.roleName && "Role Name is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              multiline
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.description && !formData.description}
              helperText={!formData.description && "Description is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="requirements"
              label="Requirements"
              id="requirements"
              value={formData.requirements}
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.requirements && !formData.requirements}
              helperText={!formData.requirements && "Requirements is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="responsibilities"
              label="Responsibilities"
              id="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.responsibilities && !formData.responsibilities}
              helperText={
                !formData.requirements && "Responsibilities is required"
              }
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              name="type"
              id="type"
              label="Type"
              value={formData.type}
              onChange={handleChange}
              disabled={!isEditing}
              InputLabelProps={{
                htmlFor: "type",
              }}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.type && !formData.type}
              helperText={!formData.type && "Type is required"}
              size="normal"
              variant="standard"
            >
              {["Regular", "Consolidated", "Outsourcing"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              name="status"
              id="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              disabled={!isEditing}
              InputLabelProps={{
                htmlFor: "status",
              }}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.status && !formData.status}
              helperText={!formData.status && "Status is required"}
              size="normal"
              variant="standard"
            >
              {["Open", "Closed"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="salary"
              label="Salary"
              value={formData.salary}
              onChange={handleChange}
              disabled={!isEditing}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rs.</InputAdornment>
                ),
              }}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.salary && !formData.salary}
              helperText={!formData.salary && "Salary is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="hiringDuration"
              label="Hiring Duration"
              value={formData.hiringDuration}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.hiringDuration && !formData.hiringDuration}
              helperText={
                !formData.hiringDuration && "Hiring Duration is required"
              }
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="startDate"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate?.split("T")[0]}
              onChange={handleChange}
              disabled={!isEditing}
              type="date"
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.startDate && !formData.startDate}
              helperText={!formData.startDate && "Start Date is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="endDate"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate?.split("T")[0]}
              onChange={handleChange}
              disabled={!isEditing}
              type="date"
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.endDate && !formData.endDate}
              helperText={!formData.endDate && "End Date is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="postingDate"
              label="Posting Date"
              InputLabelProps={{ shrink: true }}
              value={formData.postingDate?.split("T")[0]}
              onChange={handleChange}
              disabled={!isEditing}
              type="date"
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.postingDate && !formData.postingDate}
              helperText={!formData.postingDate && "Posting Date is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="advtNo"
              label="Advertisement Number"
              value={formData.advtNo}
              onChange={handleChange}
              disabled={!isEditing}
              fullWidth
              required
              onClick={handleClick}
              error={showErrors.advtNo && !formData.advtNo}
              helperText={!formData.advtNo && "Advt No is required"}
              size="normal"
              variant="standard"
            />
          </Grid>
        </Grid>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleEdit}
        disabled={isEditing}
        sx={{ margin: "0.5rem" }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        onClick={handleDelete}
        disabled={isEditing}
        sx={{ margin: "0.5rem" }}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!isEditing}
        sx={{ margin: "0.5rem" }}
      >
        Save
      </Button>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          onClose={handleCloseAlert}
          severity={alertSeverity}
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
