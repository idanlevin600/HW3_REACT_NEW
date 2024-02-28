import { useEffect, useState } from 'react'
import './App.css'
import { Grid } from '@mui/material';
import FC_Register from './FuncComps/FC_Register'
import FC_Login from './FuncComps/FC_Login';
import FC_Profile from './FuncComps/FC_Profile';
import FC_Systemdmin from './FuncComps/FC_Systemdmin';
import FC_EditDetails from './FuncComps/FC_EditDetails';

function App() {
  
  const [users , setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(JSON.parse(sessionStorage.getItem('loggedInUser')) || null);
  
  const [userToEdit, setUserToEdit] = useState({
    username: '',
    email: "",
    password:'',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    houseNumber: '',
    image: null, 
    birthDate: new Date(), 
  });

  useEffect(() =>{
    setUsers(loadUsers()); 
    
  },)

  const loadUsers = () =>{
    return (JSON.parse(localStorage.getItem('users')) || []);
  }

  

  const handleLogin = (user) => {
    setLoggedInUser(user);
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
  };
  //**** */
  const handleEditUser = (user) => {
    setUserToEdit(user);
    console.log(user);
  };
  //*** */
  const handleLogout = () => {
    setLoggedInUser(null);
    sessionStorage.removeItem('loggedInUser');
  };

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
       
        <FC_Register users={users} />
        {/* <FC_EditDetails users={users} loggedInUser={loggedInUser}/> */}

      </Grid>
      <Grid item xs={12} sm={6}>
        {/* {loggedInUser && <FC_EditDetails users={users} loggedInUser={loggedInUser}/>} */}
        {loggedInUser && <FC_EditDetails users={users} userToEdit={userToEdit}/>}

      </Grid>
      <Grid item xs={12} sm={6}>
      
        <FC_Login users={users} onLogin={handleLogin}/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FC_Profile users={users} onLogout={handleLogout} editUserFunc={handleEditUser} />
        {/* <FC_Systemdmin user={users} /> */}

      </Grid>
      <Grid item xs={12}>

        {loggedInUser && 
         loggedInUser.username === "admin" && 
         loggedInUser.password === "ad12343211ad" && 
         <FC_Systemdmin user={users} 
         editUserFunc={handleEditUser}/>}
      </Grid>
    </Grid>
      
    </>
  )
}

export default App
