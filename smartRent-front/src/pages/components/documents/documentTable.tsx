import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DocumentTableItem } from "../../../models/documentModel";
import { translateDocumentTypeToLt } from "../../../utils/translator";

interface DocumentTableProps {
  data: DocumentTableItem[] | null;
  handleClick: (event: React.MouseEvent<unknown>, name: string) => void;
  isSelected: (name: string) => boolean;
}

export default function DocumentTable(props: DocumentTableProps) {
  const [tableItems, setTableItems] = useState<DocumentTableItem[] | null>(props.data);
  useEffect(() => {
    setTableItems(props.data);
  }, [props]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">&nbsp;&nbsp;</TableCell>
            <TableCell align="left">Pavadinimas</TableCell>
            <TableCell align="left">Tipas</TableCell>
            <TableCell align="center">Sukūrimo data</TableCell>
          </TableRow>
        </TableHead>
          <TableBody>
            {tableItems?.map((row) => {
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
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{translateDocumentTypeToLt(row.type)}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
      </Table>
    </TableContainer>
  );
}
