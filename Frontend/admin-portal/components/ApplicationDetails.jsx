import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { getEmailText } from "./TemplatePreview";
const adminUrl = import.meta.env.VITE_ADMIN_URL
  ? `${import.meta.env.VITE_ADMIN_URL}`
  : "";
const candPortalUrl = import.meta.env.VITE_CAND_URL
  ? `${import.meta.env.VITE_CAND_URL}`
  : "";

import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const params = (application) => {
  return {
    firstName: application.name.firstName,
    lastName: application.name.lastName,
    position: application.position,
    phone: application.phoneNumber.phNumber,
    email: application.email,
    dob: application.dob,
    status: application.status,
    reason: application.reasonToHire,
    pastExperience: application.pastExperience,
    techExperience: application.techExperience,
    refID: application._id,
    CANDIDATE_PORTAL: candPortalUrl,
    ADMIN_PORTAL: adminUrl,
  };
};

export default function ApplicationDetails({ data, refreshData }) {
  const [application, setApplication] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState({});

  const [anchorEl_forward, setAnchorEl_forward] = useState(null);
  const [anchorEl_email, setAnchorEl_email] = useState(null);

  useEffect(() => {
    setApplication(data);
    setPhotoUrl(`${import.meta.env.VITE_BACKEND}/apply/${data._id}/photo`);
    setResumeUrl(`${import.meta.env.VITE_BACKEND}/apply/${data._id}/resume`);
    fetch(`${import.meta.env.VITE_BACKEND}/templates`)
      .then((response) => response.json())
      .then((fetchedEmails) => {
        setTemplates(fetchedEmails.reverse());
      })
      .catch((error) => console.error("Error fetching emails: ", error));
  }, [data]);

  const sendEmail = async (application) => {
    if (Object.keys(selectedTemplate).length !== 0) {
      console.log("selectedTemplate", selectedTemplate);
      fetch(`${import.meta.env.VITE_BACKEND}/email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: application.email,
          subject: selectedTemplate.subject,
          body: getEmailText(
            params(application),
            selectedTemplate.content,
            true
          ),
          applicationID: application._id,
        }),
      })
        .then((response) => response.json())
        .then((d) => {
          console.log(d);
          setAlertMessage("Email sent successfully!");
          setAlertSeverity("success");
          setAlertOpen(true);
          refreshData();
          data["emailSent"] = true;
          handleClosePopover_email();
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setAlertMessage("Failed to send email!");
          setAlertSeverity("error");
          setAlertOpen(true);
        });
    }
  };

  const handleOpenPopover_forward = (event) => {
    setAnchorEl_forward(event.currentTarget);
  };

  const handleClosePopover_forward = () => {
    setAnchorEl_forward(null);
  };

  const handleOpenPopover_email = (event) => {
    setAnchorEl_email(event.currentTarget);
  };

  const handleClosePopover_email = () => {
    setAnchorEl_email(null);
  };

  const forwardApplication = () => {
    if (!departments.includes(selectedDept)) {
      setAlertMessage("Failed to forward application!");
      setAlertSeverity("error");
    }

    let emailTemplate =
      '<text data="Hello {name}.--br--I am unable to decide if the following candidate should be shortlisted. Hence, I am forwarding the same for your review. Please have a look at it" />' +
      '<button src="{ADMIN_PORTAL}/applications/{refID}" data="View Application" />' +
      '<text data="Regards,--br--Recruitment Team" />';

    const emailText = getEmailText(params(application), emailTemplate, true);

    fetch(`${import.meta.env.VITE_BACKEND}/apply/${data._id}/forward`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dept: selectedDept, body: emailText }),
    })
      .then((response) => response.json())
      .then((updatedApplication) => {
        setApplication(updatedApplication);

        setAlertMessage("Application has been forwarded!");
        setAlertSeverity("success");
        setAlertOpen(true);
        refreshData();
      })
      .catch((error) => {
        setAlertMessage("Failed to forward application!");
        setAlertSeverity("error");
        console.error("Error forwarding application:", error);
      });
    handleClosePopover_forward();
  };

  const handleAction = (action) => {
    fetch(`${import.meta.env.VITE_BACKEND}/apply/${data._id}/status`, {
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
        refreshData();
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/employees`)
      .then((response) => response.json())
      .then((data) => {
        setDepartments([
          ...new Set(data.map((employee) => employee.department)),
        ]);
      })
      .catch((error) => {
        console.error("Error fetching departments", error);
      });
  }, []);

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingTop: "0px",
      }}
    >
      <h2>Application Details</h2>
      <Paper
        sx={{
          border: "0px solid",
          boxShadow: "none",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ marginLeft: "10px" }}>
            <Avatar
              variant="rounded"
              alt="Applicant Photo"
              src={photoUrl}
              style={{
                width: 100,
                height: 150,
                border: "0.5px solid",
                marginTop: 10,
              }}
            />
          </Grid>
          <Grid
            item
            xs={7}
            textAlign={"left"}
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
            <Link
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              color={"#747bff"}
            >
              View Resume
            </Link>
          </Grid>

          <Grid
            item
            xs={12}
            textAlign={"left"}
            marginLeft={2}
            lineHeight={"1rem"}
          >
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
              {application.reasonToHire}
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
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="p" style={{ marginBottom: "0.5rem" }}>
        <strong>Current status:</strong> {application.status}
      </Typography>
      <br />
      {application.emailSent && (
        <Typography variant="p" style={{ marginBottom: "0.5rem" }}>
          Email has been sent.
        </Typography>
      )}
      {!application.emailSent && (
        <>
          <Typography variant="p" style={{ marginBottom: "0.5rem" }}>
            Email has not been sent
          </Typography>
          <Button
            style={{ margin: "10px" }}
            disabled={false}
            onClick={handleOpenPopover_email}
          >
            Send Email
          </Button>{" "}
        </>
      )}

      <Popover
        open={Boolean(anchorEl_email)}
        anchorEl={anchorEl_email}
        onClose={handleClosePopover_email}
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
          <TextField
            select
            name="Select Template"
            id="Select Template"
            label="Select Template"
            value={
              Object.keys(selectedTemplate).length ? selectedTemplate.name : ""
            }
            onChange={(event) =>
              setSelectedTemplate(
                templates.find((temp) => temp.name === event.target.value)
              )
            }
            sx={{ width: "200px" }}
          >
            {templates.map((temp, index) => (
              <MenuItem key={temp.id} value={temp.name}>
                {temp.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            style={{ margin: "10px" }}
            disabled={!Object.keys(selectedTemplate).length}
            onClick={() => {
              sendEmail(application);
            }}
          >
            Send
          </Button>
        </div>
      </Popover>
      <br />
      {application.forwardedTo != "" && (
        <Typography variant="p" style={{ marginBottom: "0.5rem" }}>
          Application has been forwared to {application.forwardedTo} department.
          <br />
        </Typography>
      )}
      <Button
        variant="contained"
        style={{ margin: "10px" }}
        disabled={
          application.status == "Rejected" ||
          application.status == "Selected" ||
          application.forwardedTo != ""
        }
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
        disabled={
          application.status == "Rejected" || application.forwardedTo != ""
        }
        onClick={() => handleAction("reject")} 
      >
        Reject
      </Button>
      {application.status == "Applied" && (
        <Button
          variant="contained"
          style={{ margin: "10px" }}
          disabled={application.forwardedTo != ""}
          onClick={handleOpenPopover_forward}
        >
          Forward
        </Button>
      )}
      <Popover
        open={Boolean(anchorEl_forward)}
        anchorEl={anchorEl_forward}
        onClose={handleClosePopover_forward}
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
          <TextField
            select
            name="Select Department"
            id="Select Department"
            label="Select Department"
            value={selectedDept}
            onChange={(event) => setSelectedDept(event.target.value)}
            sx={{ width: "200px" }}
          >
            {departments.map((dept, index) => (
              <MenuItem key={index + 1} value={dept}>
                {dept}
              </MenuItem>
            ))}
            ;
          </TextField>
          <Button
            variant="contained"
            style={{ margin: "10px" }}
            disabled={selectedDept == ""}
            onClick={forwardApplication}
          >
            Send
          </Button>
        </div>
      </Popover>

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
