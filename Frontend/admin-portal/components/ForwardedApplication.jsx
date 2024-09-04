import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function ApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/apply/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setApplication(data);
        setPhotoUrl(`${import.meta.env.VITE_BACKEND}/apply/${id}/photo`);
        setResumeUrl(`${import.meta.env.VITE_BACKEND}/apply/${id}/resume`);
      })
      .catch((error) => console.error("Error fetching application:", error));
  }, [id]);

  const handleAction = (action) => {
    fetch(`${import.meta.env.VITE_BACKEND}/apply/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: action }),
    })
      .then((response) => response.json())
      .then((updatedApplication) => {
        setApplication(updatedApplication);

        setAlertMessage("Candidate status updated successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage("Failed to update status!");
        setAlertSeverity("error");
        console.error("Error updating application status:", error);
      });
  };
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "15%", width: "100%", alignItems: "flex-end" }}>
        <h1>Application Details</h1>
      </div>
      <div style={{ height: "70%", width: "100%", alignItems: "flex-end" }}>
        <Paper
          sx={{
            p: 3,
            border: "0px solid",
            boxShadow: "none",
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Avatar
                variant="rounded"
                alt="Applicant Photo"
                src={photoUrl}
                style={{
                  width: 150,
                  height: 200,
                  border: "0.5px solid",
                  marginTop: 10,
                }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              textAlign={"left"}
              marginLeft={2}
              lineHeight={"1rem"}
            >
              <h2 style={{ lineHeight: "1.5rem" }}>
                <strong>
                  {`${application.name.firstName} ${
                    application.name.middleName || ""
                  } ${application.name.lastName}`}{" "}
                </strong>
              </h2>
              <p>{application.email} </p>

              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                <strong>Phone Number:</strong>{" "}
                {`${application.phoneNumber.countryCode} ${application.phoneNumber.phNumber}`}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                <strong>Date of Birth:</strong> {application.dob}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                <strong>Age:</strong> {application.age}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                <strong>Gender:</strong> {application.gender}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                <strong>Nationality:</strong> {application.nationality}
              </Typography>
              <Typography
                variant="body1"
                style={{ wordWrap: "break-word", marginBottom: "0.5rem" }}
              >
                <strong>Address:</strong>
                <br />
                {`${application.address.building}, ${application.address.addressLine1}, ${application.address.addressLine2}, ${application.address.city}, ${application.address.state}, ${application.address.country}, ${application.address.pincode}`}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "0.5rem" }}>
                <strong>Position Applied For:</strong> {application.position}
              </Typography>
              <Typography
                variant="body1"
                style={{ wordWrap: "break-word", marginBottom: "0.5rem" }}
              >
                <strong>Reason to apply:</strong>
                <br />
                {application.whyShouldWeHireYou}
              </Typography>
              <Typography
                variant="body1"
                style={{ wordWrap: "break-word", marginBottom: "0.5rem" }}
              >
                <strong>Past Experience:</strong> <br />
                {application.pastExperience}
              </Typography>
              <Typography
                variant="body1"
                style={{ wordWrap: "break-word", marginBottom: "0.5rem" }}
              >
                <strong>Technical Experience:</strong>
                <br />
                {application.techExperience}
              </Typography>
              <Link
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                color={"#747bff"}
              >
                View Resume
              </Link>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="p" style={{ marginBottom: "0.5rem" }}>
          <strong>Current status:</strong> {application.status}
        </Typography>
        <br />
        <Button
          variant="contained"
          style={{ margin: "10px" }}
          disabled={application.status != "Applied"}
          onClick={() => handleAction("select")}
        >
          {(() => {
            switch (application.status) {
              case "Applied":
                return "Shortlist";
              case "Round 2":
                return "Select";
              case "Selected":
                return "Select";
              default:
                return "Next Round";
            }
          })()}
        </Button>
        <Button
          variant="contained"
          style={{ margin: "10px" }}
          disabled={application.status != "Applied"}
          onClick={() => handleAction("reject")}
        >
          Reject
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
    </div>
  );
}
