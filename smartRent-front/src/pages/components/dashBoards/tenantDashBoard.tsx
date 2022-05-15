import {
  Grid,
  Box,
  TableContainer,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bill } from "../../../models/billModel";
import { Rent, RentDetail, RentObject } from "../../../models/rentObjectModel";
import { User } from "../../../models/userModel";
import { getNotPaidBillsByRentObjectId } from "../../../service/dashboardService";
import { getRentByObjectId, getRentDetailsByRentObjectId } from "../../../service/rentObjectService";
import { translateObjectTypeToLt } from "../../../utils/translator";

interface DashBoardProps {
  user: User;
  targetRentObject: RentObject | undefined
}

export const TenantDashBoard = (props: DashBoardProps) => {
  const [notPaidBills, setNotPaidBills] = useState<Bill[] | null>();
  const [rent, setRent] = useState<RentDetail | null>();

  let navigate = useNavigate();

  useEffect(() => {
      getNotPaidBills();
      getRent();
  }, [props.targetRentObject]);

  const getRent = async () => {
    if (typeof props.targetRentObject === "undefined") return;
    const data = await getRentDetailsByRentObjectId(props.targetRentObject.id);
    if (data === null) return;
    setRent(data);
  };

  const getNotPaidBills = async () => {
    if (typeof props.targetRentObject === "undefined") return;
    const data = await getNotPaidBillsByRentObjectId(props.targetRentObject.id);
    console.log(data);
    if (data === null) return;

    setNotPaidBills(data);
  };

  const handleOpen = (id: string) => {
    navigate(`/bills/${id}`);
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 2, marginLeft: 4 }}>
      <Grid item xs={6}>
        <Box
          sx={{
            width: 580,
            height: 300,
            borderRadius: 5,
            p: 2,
            border: 0,
            borderColor: "#646BF5",
            boxShadow: 5,
          }}
        >
          <TableContainer component={Paper}>
            <Typography variant="body1" component="div" gutterBottom>
              Vėluojamos apmokėti sąskaitos
            </Typography>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Pavadinimas</TableCell>
                  <TableCell align="left">Nuomos objektas</TableCell>
                  <TableCell align="left">Atmokėjimo pabaigos data</TableCell>
                  <TableCell align="right">&nbsp;&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notPaidBills?.map((row) => {
                  return (
                    <TableRow hover>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.objectName}</TableCell>
                      <TableCell align="left">{row.validTo}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          onClick={() => {
                            handleOpen(row.id);
                          }}
                        >
                          Atidaryti
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Grid item xs={6}>
      <Box
            sx={{
              width: 400,
              height: 410,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Nuomuojamo objekto duomenys
            </Typography>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{ margin: 1 }}
            >
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pavadinimas: {props.targetRentObject?.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Adresas: {props.targetRentObject?.address}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Išmatavimai: {props.targetRentObject?.dimensions} m2
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Tipas: {translateObjectTypeToLt(props.targetRentObject?.type)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Kaina: {props.targetRentObject?.price}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Valiuta: {props.targetRentObject?.currency}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Aprašymas: {props.targetRentObject?.title}
                </Typography>
              </Grid>
            </Grid>
          </Box>
      </Grid>
      <Grid item xs={6} sx={{marginTop: -10}}>
      <Box
            sx={{
              width: 400,
              height: 200,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Nuomos duomenys
            </Typography>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{ margin: 1 }}
            >
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pradžios data: {rent?.startDate}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pabaigos data: {rent?.endDate}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Skolos: {rent?.hasDebt ? "Yra" : "Nėra"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
      </Grid>
    </Grid>
  );
};
