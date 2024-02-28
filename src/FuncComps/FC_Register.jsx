import React, { useEffect } from "react";
import { useState } from "react";
import { parseISO } from "date-fns";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Autocomplete from '@mui/material/Autocomplete';


import ImageIcon from "@mui/icons-material/Image";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// Functional component
const FC_Register = (props) => {
  // Single state object for form values
  const cities = ['Tel Aviv', 'Bat Hefer', 'Netanya', 
                   'Rishon Letzion', 'Hadera','Rehovot'];
  const [userRegister, setUserRegister] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    houseNumber: "",
    image: null, // State for the image file
    birthDate: null, // Add birthDate to your state
  });
  
  // State for validation message
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
   if(isSubmitted){
    const existingUsers = props.users;
    // Check if the username already exists
    const isUserExist = existingUsers.find(
      (existingUser) => existingUser.email === userRegister.email
    );

    if (isUserExist) {
      setValidationMessage('User already exists. Please choose a different email.')
      return;
    } else {
      // If validation passes, log or handle the form data here
      existingUsers.push(userRegister);
      
      localStorage.setItem('users', JSON.stringify(existingUsers))
      alert('User registered successfully.')
      console.log('User registered:', userRegister)
      setIsSubmitted(false);
    }
   }
   
}, [userRegister]);

  const validateForm = (values) => {
    // username validation
    const usernameRegex = /^[A-Za-z0-9_.!?-]{5,60}$/;
    if (!usernameRegex.test(values.username)) {
      return `Username must be 5-60 characters long and 
                can only contain English 
                letters, numbers, and _.!?-`;
    } else{
      const users = JSON.parse(localStorage.getItem('users'));
      if (users) {
        const usernameExists = users.some(user => user.username === values.username);
        if (usernameExists) {
          return 'This username is already in use.';
        }
      }
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+\.[c][o][m]$/;
    if (!emailRegex.test(values.email)) {
      return 'Email must only contain English letters and special signs, have "@" not at the start or end, and end with ".com".';
    }else {
      const users = JSON.parse(localStorage.getItem('users'));
      if (users) {
        const emailExists = users.some(user => user.email === values.email);
        if (emailExists) {
          return 'This email is already in use.';
        }
      }
    }

    // Password must be 7-12 characters long and include at least one uppercase letter
    const passwordRegex = /^(?=.*[A-Z]).{7,12}$/;
    if (!passwordRegex.test(values.password)) {
      return "Password must be 7-12 characters long and include at least one uppercase letter.";
    }

    // Check if password and confirm password match
    if (values.password !== values.confirmPassword) {
      return "Passwords do not match.";
    }

    // First and Last Name validation
    const nameRegex = /^[A-Za-z]{2,}$/;

    if (!nameRegex.test(values.firstName)) {
      return "First name must only contain at least 2 letters.";
    }

    if (!nameRegex.test(values.lastName)) {
      return "Last name must only contain at least 2 letters.";
    }

    //City name validation
    if(values.city === ''){
      return "You should insert city"
    }

    //Street name validation
    const streetRegex = /^[\u05d0-\u05ea\s]{2,}$/;

    if (!streetRegex.test(values.street)) {
      return "Street name should be with hebrew letters.";
    }

    // Check if house number is not negative
    if (values.houseNumber < 0) {
      return "House number is not valide.";
    }

    // //image validation{
    // if (values.image) {
    //   const imageType = values.image.name.split(".");
    //   if (
    //     imageType[imageType.length - 1] !== "jpg" &&
    //     imageType[imageType.length - 1] !== "jpeg"
    //   )
    //     return `Image format has to be "jpg" or "jpeg"`;
    // } else values.image = "../images/blank-profile-picture.jpg";

    //image validation


    //date birth validation
    const currentDate = new Date();
    if (values.birthDate > currentDate) {
      return "Date of birth cannot be in the future.";
    }

    let age = currentDate.getFullYear() - values.birthDate.getFullYear();

    // Check if birthday has occurred this year
    const birthMonth = values.birthDate.getMonth();
    const currentMonth = currentDate.getMonth();
    const birthDay = values.birthDate.getDate();
    const currentDay = currentDate.getDate();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    // Check if the person is under 18 years old
    if(!age){
      return "You should insert your birth date"
    }else if (age < 18) {
      return "Person is under 18 years old";
    } else if (age > 120) {
      return "person cant be older than 120 age";
    }
  };
  
  //Handle file selection and read the file
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     if (file.type === "image/jpeg" || file.type === "image/jpg"){
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         // Update state with the read data URL        
  //         setUserRegister({ ...userRegister, image: reader.result });
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       setValidationMessage("Image format has to be .jpg or .jpeg")
  //     }
      
  //   }
  // };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
            // Create an object URL for the file
            const objectURL = URL.createObjectURL(file);

            // Store the object URL instead of the base64 string
            setUserRegister({ ...userRegister, image: objectURL });
        } else {
            setValidationMessage("Image format has to be .jpg or .jpeg");
        }
      }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const reader = new FileReader();

    const formValues = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      confirmPassword: event.target.confirmPassword.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      city: userRegister.city,
      street: event.target.street.value,
      houseNumber: event.target.houseNumber.value * 1,
      //image: event.target.image.files[0],
      image: userRegister.image,
      birthDate: new Date(event.target.birthDate.value),
    };

    const validationError = validateForm(formValues);
    if (validationError) {
      setValidationMessage(validationError);
      return; // Stop form submission if validation fails
    }
    else{
     setIsSubmitted(true); 
     setUserRegister({ ...formValues }); 
    }

    // Reset form fields and validation message
    setValidationMessage("");
    event.target.reset();
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
        <h2 style={{ textAlign: "center" }}>Registration</h2>
        {validationMessage && (
          <p style={{ color: "red" }}>{validationMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {" "}
            {/* Add spacing between grid items */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                variant="standard"
                name="username"
                value="idanssss"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                name="email"
                value="idanssss@walla.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="standard"
                name="password"
                value="Lizi12345"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="standard"
                name="confirmPassword"
                value="Lizi12345"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="standard"
                name="firstName"
                value="Lizi"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="standard"
                name="lastName"
                value="cohen"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={cities}
              onChange={(event, newValue) => {
                setUserRegister({ ...userRegister, city: newValue });
              }}
              renderInput={(params) => <TextField {...params} label="City" />}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                variant="standard"
                name="street"
                value="אמנון ותמר"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="House Number"
                variant="standard"
                name="houseNumber"
                value="3"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Birth Date"
                  value={userRegister.birthDate}
                  name="birthDate"
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="standard" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: 2 }}
                endIcon={<ImageIcon />}
              >
                Upload Image
                <input
                  type="file"
                  name="image"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
};

export default FC_Register;
