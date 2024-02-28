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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Functional component
const FC_EditDetails = (props) => {
  // Single state object for form values
  const cities = ['Tel Aviv', 'Bat Hefer', 'Netanya', 
                   'Rishon Letzion', 'Hadera','Rehovot'];

  

  const [userEdit, setUserEdit] = useState({
    // username: props.loggedInUser.username,
    // email: props.loggedInUser.email,
    // password: props.loggedInUser.password,
    // confirmPassword: props.loggedInUser.confirmPassword,
    // firstName: props.loggedInUser.firstName,
    // lastName: props.loggedInUser.lastName,
    // city: props.loggedInUser.city,
    // street: props.loggedInUser.street,
    // houseNumber: props.loggedInUser.houseNumber,
    // image: props.loggedInUser.image, 
    // birthDate: new Date(props.loggedInUser.birthDate), 
    // username: props.userToEdit.username,
    // email: props.userToEdit.email,
    // password: props.userToEdit.password,
    // confirmPassword: props.userToEdit.confirmPassword,
    // firstName: props.userToEdit.firstName,
    // lastName: props.userToEdit.lastName,
    // city: props.userToEdit.city,
    // street: props.userToEdit.street,
    // houseNumber: props.userToEdit.houseNumber,
    // image: props.userToEdit.image, 
    // birthDate: new Date(props.userToEdit.birthDate),
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    houseNumber: '',
    image: '', 
    birthDate: new Date(), 
  });

  useEffect(() => {
    // Check if props.userToEdit has values before setting them
    if (props.userToEdit && Object.keys(props.userToEdit).length) {
      setUserEdit({
        username: props.userToEdit.username || '',
        email: props.userToEdit.email || '',
        password: props.userToEdit.password || '',
        confirmPassword: props.userToEdit.confirmPassword || '',
        firstName: props.userToEdit.firstName || '',
        lastName: props.userToEdit.lastName || '',
        city: props.userToEdit.city || '',
        street: props.userToEdit.street || '',
        houseNumber: props.userToEdit.houseNumber || '',
        image: props.userToEdit.image || '', 
        birthDate: props.userToEdit.birthDate ? new Date(props.userToEdit.birthDate) : new Date(), 
      });
    }
  }, [props.userToEdit]); 
  
  // State for validation message
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (values) => {
    
    console.log(values);
    console.log(userEdit);
    // username validation
    const usernameRegex = /^[A-Za-z0-9_.!?-]{5,60}$/;
    if (!usernameRegex.test(values.username)) {
      return `Username must be 5-60 characters long and 
                can only contain English 
                letters, numbers, and _.!?-`;
    } 

    // Email validation
    const emailRegex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+\.[c][o][m]$/;
    if (!emailRegex.test(values.email)) {
      return 'Email must only contain English letters and special signs, have "@" not at the start or end, and end with ".com".';
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
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/jpg"){
        const reader = new FileReader();
        reader.onloadend = () => {
          // Update state with the read data URL        
          setUserEdit({ ...userEdit, image: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        setValidationMessage("Image format has to be .jpg or .jpeg")
      }
      
    }
  };

  // const handleDateChange = (event) =>{
  //   const newDate = new Date(event.target.birthDate.value);
  //   setUserEdit({ ...userEdit, birthDate: newDate });
  // }
  const handleDateChange = (newDate) =>{
    //const newDate = new Date(event.target.birthDate.value);
    setUserEdit({ ...userEdit, birthDate: newDate });
  }

  const editUser = (event) => {
    event.preventDefault();
    //const reader = new FileReader();

    // const formValues = {
    //   username: event.target.username.value,
    //   email: event.target.email.value,
    //   password: event.target.password.value,
    //   confirmPassword: event.target.confirmPassword.value,
    //   firstName: event.target.firstName.value,
    //   lastName: event.target.lastName.value,
    //   city: userRegister.city,
    //   street: event.target.street.value,
    //   houseNumber: event.target.houseNumber.value * 1,
    //   //image: event.target.image.files[0],
    //   image: userRegister.image,
    //   birthDate: new Date(event.target.birthDate.value),
    // };

    const validationError = validateForm(userEdit);
    if (validationError) {
      setValidationMessage(validationError);
      return; // Stop form submission if validation fails
    }
    else{
     //setIsSubmitted(true); 
     //setUserRegister({ ...formValues }); 
     const newUsersArr = JSON.parse(localStorage.getItem('users')) || [];
     const userIndexToUpdate = newUsersArr.findIndex((user) => user.email === userEdit.email);
     if(userIndexToUpdate !==-1){
        newUsersArr[userIndexToUpdate] = {...userEdit};
        localStorage.setItem('users' ,JSON.stringify(newUsersArr));
        const currUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if(currUser.username !== 'admin' && currUser.password !== 'ad12343211ad'){
          console.log("now user" , currUser)
          sessionStorage.setItem('loggedInUser', JSON.stringify(userEdit));
        }
          setValidationMessage('');
        alert('User detail updated successfully');
     }
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
        <h2 style={{ textAlign: "center" }}>Edit Details</h2>
        {validationMessage && (
          <p style={{ color: "red" }}>{validationMessage}</p>
        )}
        <form onSubmit={editUser}>
          <Grid container spacing={2}>
            {" "}
            {/* Add spacing between grid items */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                variant="standard"
                name="username"
                value={userEdit.username}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, username: e.target.value });
                }}

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                name="email"
                value={userEdit.email}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="standard"
                name="password"
                value={userEdit.password}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, password: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="standard"
                name="confirmPassword"
                value={userEdit.confirmPassword}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, confirmPassword: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="standard"
                name="firstName"
                value={userEdit.firstName}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, firstName: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="standard"
                name="lastName"
                value={userEdit.lastName}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, lastName: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={cities}
              // value={userEdit.city}
              onChange={(event, newValue) => {
                setUserEdit({ ...userEdit, city: newValue });
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
                value={userEdit.street}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, street: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="House Number"
                variant="standard"
                name="houseNumber"
                value={userEdit.houseNumber}
                onChange={(e) =>{
                    setUserEdit({ ...userEdit, houseNumber: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Birth Date"
                  value={userEdit.birthDate}
                  name="birthDate"
                  onChange={handleDateChange}
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
            endIcon={<EditOutlinedIcon />}
            sx={{ marginTop: 2 }}
          >
            Edit 
          </Button>
        </form>
      </Box>
    </>
  );
};

export default FC_EditDetails;
