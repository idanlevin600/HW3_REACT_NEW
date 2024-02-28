import React from "react";
import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import adminPic from '../images/admin.png';

export default function FC_LogIn(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const loginUser = (e) => {
    e.preventDefault();
    const formValues = {
      username: username,
      password: password,
    };

    if(formValues.username === 'admin' && formValues.password === 'ad12343211ad'){
      const adminUser = {
        username: "admin",
        email: "admin@gmail.com",
        password: "ad12343211ad",
        confirmPassword: "ad12343211ad",
        firstName: "Hello",
        lastName: "Mr. Admin",
        city: "admin",
        street: "admin",
        houseNumber: "0",
        image: adminPic, // State for the image file
        birthDate: null, // Add birthDate to your state
      }
      setValidationMessage("");
      props.onLogin(adminUser);

    } else{

    const validationError = validateForm(formValues);
    if (validationError) {
      setValidationMessage(validationError);
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("users")).find(
      (user) => user.username === username && user.password === password
    );

    if (loggedInUser) {
      setValidationMessage("");
      //sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      props.onLogin(loggedInUser);
      //onLogin(loggedInUser);
    } else setValidationMessage("Invalid username or password");
  }};

  const validateForm = (values) => {
    // username validation
    const usernameRegex = /^[A-Za-z0-9_.!?-]{5,60}$/;
    if (!usernameRegex.test(values.username)) {
      return `Username must be 5-60 characters long and 
                can only contain English 
                letters, numbers, and _.!?-`;
    }

    // Password must be 7-12 characters long and include at least one uppercase letter
    const passwordRegex = /^(?=.*[A-Z]).{7,12}$/;
    if (!passwordRegex.test(values.password)) {
      return "Password must be 7-12 characters long and include at least one uppercase letter.";
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "grey.200",
          padding: 2,
          borderRadius: "3px",
          boxShadow: 4,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Log In</h2>
        {validationMessage && (
          <p style={{ color: "red" }}>{validationMessage}</p>
        )}
        <form onSubmit={loginUser}>
          <Grid container spacing={2}>
            {" "}
            {/* Add spacing between grid items */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                variant="standard"
                name="username"
                //value="lirazicoh"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="standard"
                name="password"
                //value="Lizi12345"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            endIcon={<LoginIcon />}
            sx={{ marginTop: 2 }}
          >
            Log In
          </Button>
        </form>
      </Box>
    </>
  );
}
