/* eslint-disable @typescript-eslint/no-use-before-define */
import { KeyboardReturnOutlined } from "@mui/icons-material";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  SelectChangeEvent,
  Select,
  MenuItem,
  Table,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Alert,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BillForRow } from "../../../models/billModel";
import { DocumentTableItem } from "../../../models/documentModel";
import {
  RentObject,
  Rent,
  RentDetail,
  RentHistoryItem,
} from "../../../models/rentObjectModel";
import { User } from "../../../models/userModel";
import { getByRentIdForRows } from "../../../service/billService";
import { getDocumentsForList } from "../../../service/documentService";
import {
  getRentByObjectId,
  getRentDetailsById,
  getRentObjectById,
  getRentsHistoryByObjectId,
  updateRent,
  updateRentObject,
} from "../../../service/rentObjectService";

interface RentObjectFormProps {
  user: User;
}

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const RentObjectForm: React.FC<RentObjectFormProps> = (props) => {
  const [rentObject, setRentObject] = useState<RentObject | null>();
  const [rent, setRent] = useState<Rent | null>();
  const [rentDetail, setRentDetail] = useState<RentDetail | null>();
  const [price, setPrice] = useState<string | undefined>("");
  const { id } = useParams();
  const [currency, setCurrency] = useState<string | undefined>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogTurnOff, setOpenDialogTurnOff] = useState<boolean>(false);
  const [openDialogRent, setOpenDialogRent] = useState<boolean>(false);
  const [title, setTitle] = useState<string | undefined>("");
  const [documents, setDocuments] = useState<DocumentTableItem[] | null>([]);
  const [dateForUpdate, setDateForUpdate] = useState<string>(
    new Date().toDateString()
  );
  const [bills, setBills] = useState<BillForRow[] | null>([]);
  const [rentHistory, setRentHistory] = useState<RentHistoryItem[] | null>([]);
  const [updateOccur, setUpdateOccur] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [historyRent, setHistoryRent] = useState<RentDetail | null>(null);
  const [openDialogHistory, setOpenDialogHistory] = useState<boolean>(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (id: string | undefined) => {
      if (typeof id === "undefined") return;

      const rentObject = await getRentObjectById(id);

      if (rentObject !== null) {
        if (rentObject.rentExist) {
          setRent(await getRentByObjectId(id));
          setRentDetail(await getRentDetailsById(id));
        }
        setRentHistory(await getRentsHistoryByObjectId(id));
      }
      setRentObject(rentObject);
    };
    fetchData(id);
  }, [id]);

  useEffect(() => {
    if (rentObject === null || typeof rentObject === "undefined") return;
    setTitle(rentObject.title);
    setCurrency(rentObject.currency);
    setPrice(rentObject.price.toString());

    var today = new Date().toDateString();

    setDateForUpdate(formatDate(today));

    const fetchData = async () => {
      const documents = await getDocumentsForList(rentObject.id);
      setDocuments(documents);
    };
    fetchData();
  }, [rentObject, rent]);

  useEffect(() => {
    if (rent === null || typeof rent === "undefined") return;

    const fetchData = async () => {
      const bills = await getByRentIdForRows(rent.id);
      setBills(bills);
    };

    fetchData();
  }, [rent]);


  const handleOpenHistory = async(id: string) => {

    const rentHistory = await getRentDetailsById(id);
    setRentHistory(rentHistory);
    setOpenDialogHistory(true);
  }


  const handleOpenBill = (id: string) => {
    navigate(`/bills/${id}`);
  };

  const handleOpenRent = (id: string) => {
    navigate(`/rents/${id}`);
  };

  const handleOpenDocument = (id: string) => {
    navigate(`/documents/${id}`);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateForUpdate(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    //console.log(value);
    // const re = new RegExp('^[0-9]+(,[0-9]+)+');

    // if(re.test(value))
    // {
    //   console.log("testas");
    //   setPrice(value);
    // }
    setPrice(value);
  };

  const handleRentObjectUpdate = async () => {
    if (typeof rentObject === "undefined" || rentObject === null) return;
    if (typeof price === "undefined") return;
    if (typeof currency === "undefined") return;
    if (typeof title === "undefined") return;

    let update: RentObject = {
      id: rentObject.id,
      name: rentObject.name,
      title: title,
      price: parseFloat(price),
      currency: currency,
      landLordId: rentObject.landLordId,
      dimensions: rentObject.dimensions,
      type: rentObject.type,
      address: rentObject.address,
      rentExist: true,
    };

    try {
      await updateRentObject(update);
      setRentObject(update);

      setUpdateOccur(true);
      setUpdateSuccess(true);
      await timeout(5000);
      setUpdateOccur(false);
    } catch (error: any) {
      setUpdateOccur(true);
      setUpdateSuccess(false);
      await timeout(5000);
      setUpdateOccur(false);
    }
  };

  const handleRentUpdate = async () => {
    if (typeof dateForUpdate === "undefined") return;
    if (typeof rent === "undefined" || rent === null) return;

    let update: Rent = {
      id: rent.id,
      tenantId: rent.tenantId,
      rentObjectId: rent.rentObjectId,
      startingDate: rent.startingDate,
      endingDate: dateForUpdate,
      active: new Date(dateForUpdate) <= new Date() ? true : false,
    };

    try {
      await updateRent(update);

      setUpdateOccur(true);
      setUpdateSuccess(true);
      await timeout(5000);
      setUpdateOccur(false);

      setRent(update);
    } catch (error: any) {
      setUpdateOccur(true);
      setUpdateSuccess(false);
      await timeout(5000);
      setUpdateOccur(false);
    }

    setOpenDialogRent(false);
  };

  const handleTurnOffRent = async () => {
    if (typeof rent === "undefined" || rent === null) return;

    let update: Rent = {
      id: rent.id,
      tenantId: rent.tenantId,
      rentObjectId: rent.rentObjectId,
      startingDate: rent.startingDate,
      endingDate: new Date().toDateString(),
      active: false,
    };

    try {
      await updateRent(update);

      setUpdateOccur(true);
      setUpdateSuccess(true);
      await timeout(5000);
      setUpdateOccur(false);

      setRent(update);
    } catch (error: any) {
      setUpdateOccur(true);
      setUpdateSuccess(false);
      await timeout(5000);
      setUpdateOccur(false);
    }
  };

  const handleConfirm = async () => {
    setOpenDialog(false);
    await handleRentObjectUpdate();
  };

  const handleDecline = () => {
    setOpenDialog(false);
  };

  const handleConfirmTurnOff = async () => {
    setOpenDialogTurnOff(false);
    await handleTurnOffRent();
  };

  const formatDate = (date: string) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return (
    <div>
      <Grid
        container
        alignSelf={"center"}
        alignItems={"center"}
        sx={{ marginTop: 2, marginLeft: 2 }}
      >
        <Grid item xs={6} md={4} sx={{ marginRight: -5 }}>
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
              Objekto duomenys
            </Typography>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{ margin: 1 }}
            >
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pavadinimas: {rentObject?.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Adresas: {rentObject?.address}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Išmatavimai: {rentObject?.dimensions}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Tipas: {rentObject?.type}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Kaina: {rentObject?.price}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Valiuta: {rentObject?.currency}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Aprašymas: {rentObject?.title}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {openDialogHistory ? (
          <Dialog
            open={openDialogHistory}
            onClose={() => {
              setOpenDialogHistory(false);
            }}
          >
            <DialogTitle>Nuomos informacija</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ marginBottom: 5 }}>
                Negaliojančios nuomos informacija
              </DialogContentText>
              <Grid
                container
                direction="column"
                justifyItems={"center"}
                columnSpacing={3}
                sx={{ marginTop: -3 }}
              >
                <Grid item xs={12}>
                  <InputLabel>Nuomos objektas</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedRentObject}
                    onChange={handleRentObjectChange}
                    MenuProps={MenuProps}
                    sx={{ minWidth: 180 }}
                  >
                    {rentObjects?.map((object) => (
                      <MenuItem key={object.id} value={object.name}>
                        {object.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Nuomininkas</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedTenant}
                    onChange={handleTenantChange}
                    MenuProps={MenuProps}
                    sx={{ minWidth: 180 }}
                  >
                    {tenants?.map((object) => (
                      <MenuItem key={object.id} value={object.name}>
                        {object.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <InputLabel>Pradžios data</InputLabel>
                  <TextField
                    margin="dense"
                    id="startDate"
                    type="date"
                    fullWidth
                    onChange={handleStartDateChange}
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel>Pabaigos data</InputLabel>
                  <TextField
                    margin="dense"
                    id="endDate"
                    type="date"
                    fullWidth
                    onChange={handleEndDateChange}
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenDialogRent(false);
                }}
              >
                Uždaryti
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <></>
        )}
        <Grid item xs={6} md={4}>
          <Box
            sx={{
              width: 440,
              height: 420,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            <Grid
              container
              spacing={2}
              direction="column"
              sx={{ maxHeight: 400 }}
            >
              <Grid item xs={6} md={4}>
                <Typography variant="h5" component="div" gutterBottom>
                  Keisti nuomos objekto duomenis
                </Typography>
                <TextField
                  name="price"
                  label="Kaina"
                  type={"text"}
                  value={price}
                  variant="outlined"
                  onChange={handlePriceChange}
                  sx={{ maxHeight: 50, maxWidth: 200 }}
                />
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={currency}
                  onChange={handleChange}
                  autoWidth
                  label="Valiuta"
                  sx={{ marginLeft: 2, maxHeight: 50, maxWidth: 100 }}
                >
                  <MenuItem value={"EUR"} selected={true}>
                    EUR
                  </MenuItem>
                  <MenuItem value={"DKK"}>DKK</MenuItem>
                  <MenuItem value={"USD"}>USD</MenuItem>
                  <MenuItem value={"GBP"}>GBP</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  name="title"
                  label="Aprašymas"
                  maxRows={5}
                  minRows={5}
                  onChange={handleTitleChange}
                  multiline
                  value={title}
                  sx={{
                    minWidth: 400,
                    maxWidth: 400,
                    minHeight: 250,
                    maxHeight: 250,
                  }}
                ></TextField>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item>
                <Button onClick={handleDialogOpen} variant="contained">
                  Keisti objekto duomenis
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={handleDialogClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Nuomos objekto duomenų keitimas"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Ar tikrai norite pakeisti objekto duomenis?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleConfirm} autoFocus>
                      Patvirtinti{" "}
                    </Button>
                    <Button onClick={handleDecline}>Atšaukti</Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 480,
              height: 420,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            <TableContainer component={Paper}>
              <Typography variant="h5" component="div" gutterBottom>
                Dokumentai
              </Typography>
              <Table sx={{ minWidth: 450 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Pavadinimas</TableCell>
                    <TableCell align="left">Data</TableCell>
                    <TableCell align="left">&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents?.map((row) => {
                    return (
                      <TableRow>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.date}</TableCell>
                        <TableCell align="left">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              handleOpenDocument(row.id);
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
      </Grid>
      <Grid container sx={{ marginTop: 2, marginLeft: 2 }}>
        {rent !== null && typeof rent !== "undefined" ? (
          <>
            <Grid item xs={6} md={4} sx={{ marginRight: -5 }}>
              <Box
                sx={{
                  width: 400,
                  height: 250,
                  borderRadius: 5,
                  p: 2,
                  border: 0,
                  borderColor: "#646BF5",
                  boxShadow: 5,
                }}
              >
                <Typography variant="h5" component="div" gutterBottom>
                  Aktyvios nuomos duomenys
                </Typography>
                <Grid
                  container
                  direction="column"
                  rowSpacing={2}
                  sx={{ margin: 1 }}
                >
                  <Grid item>
                    <Typography variant="h6" component="div" gutterBottom>
                      Pradžia: {rent?.startingDate}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" component="div" gutterBottom>
                      Pabaiga: {rent?.endingDate}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" component="div" gutterBottom>
                      Nuomininkas: {rentDetail?.tenantName}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {rentDetail?.hasDebt ? (
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        color={"red"}
                      >
                        Skola: Yra
                      </Typography>
                    ) : (
                      <Typography variant="h6" component="div" gutterBottom>
                        Skola: Nėra
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6} md={4}>
              <Box
                sx={{
                  width: 350,
                  height: 250,
                  borderRadius: 5,
                  p: 2,
                  border: 0,
                  borderColor: "#646BF5",
                  boxShadow: 5,
                }}
              >
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  sx={{ maxHeight: 400 }}
                >
                  <Grid item xs={6} md={4}>
                    <Typography variant="h5" component="div" gutterBottom>
                      Keisti nuomos duomenis
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4} sx={{ marginBottom: 2 }}>
                    <TextField
                      id="startDate"
                      label="Pabaigos data"
                      type="date"
                      defaultValue={formatDate(new Date().toDateString())}
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                        required: true,
                      }}
                      onChange={handleDateChange}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row">
                  <Grid item>
                    <Button
                      onClick={() => {
                        setOpenDialogRent(true);
                      }}
                      variant="contained"
                    >
                      Keisti nuomos duomenis
                    </Button>
                    <Dialog
                      open={openDialogRent}
                      onClose={() => {
                        setOpenDialogRent(false);
                      }}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Nuomos duomenų keitimas"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Ar tikrai norite pakeisti nuomos duomenis?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleRentUpdate} autoFocus>
                          Patvirtinti{" "}
                        </Button>
                        <Button
                          onClick={() => {
                            setOpenDialogRent(false);
                          }}
                        >
                          Atšaukti
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => {
                        setOpenDialogTurnOff(true);
                      }}
                      variant="contained"
                      sx={{ backgroundColor: "red", marginTop: 2 }}
                    >
                      Užbaigti nuomą
                    </Button>
                    <Dialog
                      open={openDialogTurnOff}
                      onClose={() => {
                        setOpenDialogTurnOff(false);
                      }}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Nuomos užbaigimas"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Ar tikrai norite užbaigti nuomą?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleConfirmTurnOff} autoFocus>
                          Patvirtinti{" "}
                        </Button>
                        <Button
                          onClick={() => {
                            setOpenDialogTurnOff(false);
                          }}
                        >
                          Atšaukti
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6} md={4} sx={{ marginLeft: -11 }}>
              <Box
                sx={{
                  width: 570,
                  height: 450,
                  borderRadius: 5,
                  p: 2,
                  border: 0,
                  borderColor: "#646BF5",
                  boxShadow: 5,
                }}
              >
                <TableContainer component={Paper}>
                  <Typography variant="h5" component="div" gutterBottom>
                    Sąskaitos
                  </Typography>
                  <Table sx={{ minWidth: 450 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Pavadinimas</TableCell>
                        <TableCell align="left">Sumokėta</TableCell>
                        <TableCell align="left">&nbsp;&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bills?.map((row) => {
                        return (
                          <TableRow>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">
                              {row.paid === true ? "Taip" : "Ne"}
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  handleOpenBill(row.id);
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
          </>
        ) : (
          <></>
        )}
        <Grid item xs={6} md={4} sx={{ marginTop: rent != null ? -21 : 0 }}>
          <Box
            sx={{
              width: 820,
              height: 450,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            <TableContainer component={Paper}>
              <Typography variant="h5" component="div" gutterBottom>
                Nuomų istorija
              </Typography>
              <Table sx={{ minWidth: 450 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Nuomuotojas</TableCell>
                    <TableCell align="left">Nuomos pabaigos data</TableCell>
                    <TableCell align="left">&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rentHistory?.map((row) => {
                    return (
                      <TableRow>
                        <TableCell align="left">{row.tenantName}</TableCell>
                        <TableCell align="left">{row.endDate}</TableCell>
                        <TableCell align="left">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              handleOpenRent(row.id);
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
        {updateSuccess === false && updateOccur === true ? (
          <Alert severity="error">Atnaujinimas nesėkmingas.</Alert>
        ) : (
          <></>
        )}
        {updateSuccess === true && updateOccur === true ? (
          <Alert severity="success">Atnaujinimas sėkmingas.</Alert>
        ) : (
          <></>
        )}
      </Grid>
    </div>
  );
};

export default RentObjectForm;
