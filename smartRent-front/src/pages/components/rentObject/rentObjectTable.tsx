import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import { RentObjectTableItem } from "../../../models/rentObjectModel";
import Loading  from "../../components/loading";

interface RentObjectsTableProps 
{
    data: RentObjectTableItem[]
    handleClick: (event: React.MouseEvent<unknown>, name: string) => void;
    isSelected: (name: string) => boolean;
}


export default function RentObjectsTable(props: RentObjectsTableProps) {

  const [ rentObjects , setRentObjects ] = useState<RentObjectTableItem[]>(props.data);
  const [ loaded, setLoaded ] = useState<boolean>(false);
 
  useEffect(()=> {
    setRentObjects(props.data);
    setLoaded(true);
  },[loaded, props.data])

  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 450 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="right">&nbsp;&nbsp;</TableCell>
          <TableCell align="left">Adresas</TableCell>
          <TableCell align="left">Pavadinimas</TableCell>
          <TableCell align="left">Tipas</TableCell>
          <TableCell align="left">Išnuomuota</TableCell>
          <TableCell align="left">&nbsp;&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      {loaded ? (<TableBody>
            {rentObjects?.map((row) => {
              let isItemSelected = props.isSelected(row.id);
              const labelId = `enhanced-table-checkbox-1`;
              return (
                <TableRow
                  hover
                  onClick={(event) => props.handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.name}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">{row.address}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.rentExist}</TableCell>
                </TableRow>
              );
            })}
      </TableBody>): (<Loading/>) }
    </Table>
  </TableContainer>
  );
}
