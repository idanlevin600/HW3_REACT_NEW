import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import blankImage from '../images/blank-profile-picture.jpg';

export default function FC_Profile(props) {
     // State to keep track of the logged-in user
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('loggedInUser')));
  

    useEffect(() => {
        const handleStorageChange = () => {
          setUser(JSON.parse(sessionStorage.getItem('loggedInUser')));
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        // Cleanup listener
        return () => window.removeEventListener('storage', handleStorageChange);
      }, []); 

  // Retrieve the logged-in user's information from sessionStorage
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  //console.log(loggedInUser.image);
  
  //Opens the game
  const handleGameClick = () =>{
    window.open(`https://games.yo-yoo.co.il/games_play.php?game=735`, 
    `_blank`);
  }
  
  //Log Out Logic
  const handleLogOutClick = () =>{
    // sessionStorage.removeItem(`loggedInUser`)
    // setUser(null);
    props.onLogout();
  }

  //Update Logic

  // Determine what to display based on whether a user is logged in
  const displayContent = loggedInUser ? (
    <div><img style= {{width:"100px", 
                       height:"100px", 
                       borderRadius:"60px", 
                       border:"3px solid #44f533", 
                       padding:"2px"}} 
                       src={loggedInUser.image ? loggedInUser.image : blankImage}/>

        <div>{loggedInUser.firstName} {loggedInUser.lastName}</div>
        <div>{loggedInUser.street} {loggedInUser.houseNumber}, {loggedInUser.city} </div>
        <div>
        {loggedInUser.username !== 'admin' && (
            <Button
            type="submit"
            variant="contained"
            onClick={()=>props.editUserFunc(loggedInUser)}
            sx={{ marginTop: 2 }}
            >
            Update 
            </Button>
        )}
          <Button
            type="submit"
            color="success"
            variant="contained"
            onClick={handleGameClick}
            //endIcon={<LoginIcon />}
            sx={{ marginTop: 2 }}
          >
            Game
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            onClick={handleLogOutClick}
            //endIcon={}
            sx={{ marginTop: 2 }}
          >
            Log Out
          </Button>
        </div>
    </div>
  ) : (
    <div>Please log in.</div>
  );


  return <Box
            sx={{
                marginTop: "20px",
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: "3px",
                boxShadow: 4,
            }}
        >{displayContent}
        </Box>
}
