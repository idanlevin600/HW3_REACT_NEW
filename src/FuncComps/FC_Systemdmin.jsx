import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { TableCell, TableContainer, TableHead, TableRow, Table, TableBody, TablePagination } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function FC_Systemdmin(props) {
  const columns = [
    {id:'username', name:'Username'},
    {id:'fullName', name:'Full Name'},
    {id:'birthDate', name:'Birth Date'},
    {id:'address', name:'Address'},
    {id:'email', name:'Email'},
    {id:'actions', name:''},
  ]

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  
  useEffect(()=>{
    setRows(props.user);
  });

 const handlePageChange = (event, newPage) =>{
  setPage(newPage);
 }

 const handleChangePage = (event, ) =>{
  setRowPerPage(+event.target.value);
  setPage(0);
 }

  //Format the date to make it readable
  const formatedDate = (dateStr) =>{
    // Create a Date object
    const date = new Date(dateStr);
    // Use Intl.DateTimeFormat to format the date (without time)
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(date);

    return formattedDate;
  }

  //Handle Delete Click
  const handleDeleteClick = (emailToDelete) =>{
    // Filter out the row with the email to delete
    const updatedRows = rows.filter(row => row.email !== emailToDelete);
    // Update the state with the filtered rows
    localStorage.setItem('users', JSON.stringify(updatedRows))
    setRows(updatedRows);
  }

  const handleEditClick = (emailToEdit) => {    
    const userToEdit = rows.find(row => row.email === emailToEdit);   
    props.editUserFunc(userToEdit)   
  };

  

  return (
    <Box sx={{
                marginTop: "20px",
                backgroundColor: "grey.200",
                padding: 2,
                borderRadius: "3px",
                boxShadow: 4,
          }}            
    >
      <TableContainer>
        <Table>
          <TableHead style={{backgroundColor:'white'}}>
            <TableRow >
              {columns.map((cloumn)=>(
                <TableCell key={cloumn.id} style={{fontWeight:'bold'}}>{cloumn.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows
              .slice(page*rowPerPage, page*rowPerPage + rowPerPage)
              .map((row , i)=>{
              return(
                <TableRow key={i}>
                 
                      <TableCell>
                       {row.username}
                      </TableCell>
                      <TableCell>
                       {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell>
                       {formatedDate(row.birthDate)}
                      </TableCell>
                      <TableCell>
                       {row.city}, {row.street} {row.houseNumber}
                      </TableCell>
                      <TableCell style={{color:"blue"}}>
                      {row.email}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="submit"
                          variant="contained"
                          endIcon={<EditOutlinedIcon/>}
                          onClick={() => handleEditClick(row.email)} 
                          sx={{ marginTop: 2 }}
                        />                          
                        
                        <Button
                          
                          type="submit"
                          variant="contained"
                          color="error"
                          endIcon={<DeleteForeverIcon />}
                          onClick={(e) => {
                            handleDeleteClick(row.email)
                          }}
                          sx={{ marginTop: 2 }}
                        />
                                                
                      </TableCell>
                   
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[5,10,25,50,100]}
       page={page}
       count={rows.length}
       rowsPerPage={rowPerPage}
       component="div"
       onPageChange={handlePageChange}
       onRowsPerPageChange = {handleChangePage}>

      </TablePagination>
    </Box>
  )
}
