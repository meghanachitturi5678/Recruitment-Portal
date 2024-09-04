import React, { useEffect } from "react";
import { useState } from "react";

import {
  List,
  ListItemText,
  ListItemButton,
  Button,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import Grid from "@mui/material/Grid";
import TemplatePreviewer from "./TemplatePreview";

const dummyUserDetails = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@gmail.com",
  phone: "1234567890",
  position: "Software Engineer",
  dob: "01/01/1990",
  status: "Hired",
  reason: "Good candidate",
  pastExperience: "Software Engineer at Microsoft",
  techExperience: "Java, Python, React",
  refID: "123456",

  CANDIDATE_PORTAL: import.meta.env.VITE_CAND_URL,
  ADMIN_PORTAL: import.meta.env.VITE_ADMIN_URL,
};

const Templates = () => {
  const [data, setData] = useState([]);
  const [dummyUser, setDummyUser] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/templates`)
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData.reverse());
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleListItemClick = (event, index) => setSelectedIndex(index);

  const genList = data.map((item) => {
    return (
      <ListItemButton
        key={item.id}
        selected={selectedIndex === item.id}
        onClick={(event) => handleListItemClick(event, item.id)}
        divider={true ? item.id !== data.length : false}
      >
        <div>
          <ListItemText primary={item.name} />
          <ListItemText primary={item.desc} sx={{ color: "grey" }} />
        </div>
      </ListItemButton>
    );
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "15%", width: "100%", alignItems: "flex-end" }}>
        <h1>Email Templates</h1>
      </div>

      <div style={{ height: "80%", width: "100%", alignItems: "flex-end" }}>
        <Grid container style={{ height: "100%" }}>
          <Grid
            item
            xs={4}
            style={{
              transition: "width 1s",
              padding: "1rem",
              height: "100%",
            }}
          >
            <Grid
              container
              direction="column"
              style={{
                height: "100%",
              }}
            >
              <Grid item>
                <Button
                  href="/templates/add"
                  variant="contained"
                  color="primary"
                  style={{ marginBottom: "5px" }}
                >
                  Add Template
                </Button>
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dummyUser}
                      onChange={(e) => setDummyUser(e.target.checked)}
                    />
                  }
                  label="Use dummy user details"
                />
              </Grid>
              <Grid
                item
                sx={{
                  height: "85%",
                  overflowY: "auto",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    width: "5px",
                    borderRadius: "10px",
                    backgroundColor: "#F5F5F5",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#C5C5C5",
                    borderRadius: "10px",
                  },
                }}
              >
                <List key={data.id} sx={{}}>
                  {genList}
                </List>
              </Grid>
            </Grid>
          </Grid>

          {selectedIndex != null && (
            <Grid
              item
              xs={8}
              style={{
                transition: "width 2s",
                padding: "1rem",
                height: "100%",
              }}
            >
              {selectedIndex != -1 && (
                <>
                  <Typography variant="h6">Email Preview</Typography>
                  <div
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      maxHeight: "85vh",
                      overflowY: "auto",
                    }}
                    id="email-preview"
                  >
                    <TemplatePreviewer
                      user={dummyUser ? dummyUserDetails : null}
                      emailText={
                        data.find((item) => item.id === selectedIndex).content
                      }
                      subject={
                        data.find((item) => item.id === selectedIndex).subject
                      }
                    />
                  </div>
                </>
              )}
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Templates;
