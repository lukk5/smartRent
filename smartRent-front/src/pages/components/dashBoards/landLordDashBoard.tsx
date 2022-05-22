import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bill } from "../../../models/billModel";
import { ProfitModel } from "../../../models/profitModel";
import { User } from "../../../models/userModel";
import { getNotPaidBillsByLandLordId, getProfit } from "../../../service/dashboardService";

interface DashBoardProps {
  user: User | undefined;
}

export const LandLordDashBoard = (props: DashBoardProps) => {
  const [notPaidBills, setNotPaidBills] = useState<Bill[] | null>([]);
  const [profitModel, setProfitModel] = useState<ProfitModel | null>();
  const [inCome, setIncome ] = useState<number>(0);
  const [outCome, setoutCome ] = useState<number>(0);

  let navigate = useNavigate();

  useEffect(() => {
    getNotPaidBills();
    getProfitData();
  }, [props]);

  const getNotPaidBills = async () => {
    if (typeof props.user === "undefined") return;
    const data = await getNotPaidBillsByLandLordId(props.user.id);

    if (data === null) return;

    setNotPaidBills(data);
  };

  const getProfitData = async () => {
    if (typeof props.user === "undefined") return;
    const data = await getProfit(props.user.id);

    if (data === null) return;

    setProfitModel(data);
    setIncome(data.allIncome);
    setoutCome(data.allBillsOutcome);
  }

  const handleOpen = (id: string) => {
    navigate(`/bills/${id}`);
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 2, marginLeft: 4 }}>
      <Grid item xs={6}>
        <Box
          sx={{
            width: 620,
            height: 400,
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
            <Table sx={{ minWidth: 450, maxHeight: 280 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Pavadinimas</TableCell>
                  <TableCell align="left">Nuomininkas</TableCell>
                  <TableCell align="left">Atmokėjimo pabaigos data</TableCell>
                  <TableCell align="right">&nbsp;&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notPaidBills?.map((row) => {
                  return (
                    <TableRow hover>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.tenantName}</TableCell>
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
            width: 580,
            height: 300,
            borderRadius: 5,
            p: 2,
            border: 0,
            borderColor: "#646BF5",
            boxShadow: 5,
          }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            Pelnas
          </Typography>
          <Grid container>
            <Box>
            <Typography variant="h3" component="div" gutterBottom sx={{marginTop: 4, color: profitModel?.positive ? "0a0a0a" : "#cf1f2e"}}>
            { inCome - outCome  } EUR
          </Typography>
            <Typography variant="body1" component="div" gutterBottom sx={{marginTop: 6}}>
            Gautos pajamos iš nuomų: {profitModel?.allIncome} Eur
          </Typography>
          <Typography variant="body1" component="div" gutterBottom sx={{marginTop: 1}}>
            Mokesčiai už komunalines paslaugas ir kitą: {profitModel?.allBillsOutcome} Eur
          </Typography>
          <Typography variant="body1" component="div" gutterBottom sx={{marginTop: 1}}>
           Nesumokėtos sąskaitos: {profitModel?.countNotPaid} 
          </Typography>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
