import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Cookies from "js-cookie";

function Home() {
  const cookie = Cookies.get();
  const name = cookie["name"] || "user";

  if (name === "user")
    window.location.href = `${import.meta.env.VITE_BACKEND}/login`;

  return (
    <Box>
      <Typography
        variant="h5"
        component="div"
        align="center"
        sx={{ flexGrow: 1 }}
      >
        Hello {name}, please select an option from the menu
      </Typography>
    </Box>
  );
}

export default Home;
