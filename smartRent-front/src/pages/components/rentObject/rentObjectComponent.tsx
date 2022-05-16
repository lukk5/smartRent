import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Rent,
  RentDetail,
  RentObject,
  RentObjectTableItem,
} from "../../../models/rentObjectModel";
import { User, UserProp } from "../../../models/userModel";
import {
  createRent,
  createRentObject,
  deleteRentObjectById,
  getRentDetailsById,
  getRentObjectsListByLandLordId,
} from "../../../service/rentObjectService";
import { timeout } from "../../../utils/timeout";
import RentObjectsTable from "./rentObjectTable";
import { v4 as uuidv4 } from "uuid";
import { getAllTenants } from "../../../service/userService";
import AlertDialog from "../others/alertDialog";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const RentObjectComponent: React.FC<UserProp> = (props) => {
  const [rentObjects, setRentObjects] = useState<RentObject[] | null>([]);
  const [rentObjectsTableItems, setRentObjectsTableItems] = useState<
    RentObjectTableItem[]
  >([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogRent, setOpenDialogRent] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [removeOccur, setRemoveOccur] = useState<boolean>(false);
  const [removeSuccess, setRemoveSuccess] = useState<boolean>(false);
  const [createOccur, setCreateOccur] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [allRentObjects, setAllRentObjects] = useState<[string, string][]>([]);
  const [selectedRentObject, setSelectedRentObject] = useState<string>("");
  const [selectedRentObjectId, setSelectedRentObjectId] = useState<string>("");
  const [allTenants, setAllTenants] = useState<[string, string][]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [tenants, setTenants] = useState<User[]>([]);
  const [startingDate, setStartingDate] = useState<string>("");
  const [endingDate, setEndingDate] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  useEffect(() => {
    let result: [string, string][] = [];

    if (rentObjects === null) return;

    rentObjects.forEach((item) => {
      result.push([item.id, item.name]);
    });

    setAllRentObjects(result);
  }, [rentObjects]);


  useEffect(()=> {
    let result: [string, string][] = [];

    if (rentObjects === null) return;

    tenants.forEach((item) => {
      result.push([item.id, item.nickName]);
    });
    setAllTenants(result);
  },[tenants]);

  useEffect(() => {
    if (allTenants.length === 0) return;
    setSelectedTenant(allTenants[0][1]);
    setSelectedTenantId(allTenants[0][0]);
  }, [allTenants]);

  useEffect(() => {
    if (allRentObjects.length === 0) return;
    setSelectedRentObject(allRentObjects[0][1]);
    setSelectedRentObjectId(allRentObjects[0][0]);
  }, [allRentObjects]);

  const handleRentObjectChange = (
    event: SelectChangeEvent<typeof selectedRentObject>
  ) => {
    let value = event.target.value;
    setSelectedRentObject(value);
    allRentObjects.forEach((item) => {
      if (item[1] === value) setSelectedRentObjectId(item[0]);
    });
  };

  const handleTenantChange = (
    event: SelectChangeEvent<typeof selectedRentObject>
  ) => {
    let value = event.target.value;
    setSelectedTenant(value);
    allTenants.forEach((item) => {
      if (item[1] === value) setSelectedTenantId(item[0]);
    });
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  let navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const fetchRentObjects = async () => {
    const data = await getRentObjectsListByLandLordId(props.user?.id);
    setRentObjects(data);
  };

  const fetchTenants = async () => {
    const tenants = await getAllTenants();
    setTenants(tenants);
  };

  useEffect(() => {
    fetchRentObjects();
    fetchTenants();
  }, []);

  useEffect(() => {
    fetchRentObjects();
  }, [createSuccess]);

  useEffect(() => {
    fetchRentObjects();
  }, [removeSuccess]);

  useEffect(() => {
    convertAndSetData();
  }, [rentObjects]);

  const convertAndSetData = () => {
    let result: RentObjectTableItem[] = [];
    rentObjects?.forEach((item) => {
      const temp: RentObjectTableItem = {
        id: item.id,
        name: item.name,
        title: item.title,
        type: item.type,
        address: item.address,
        rentExist: item.rentExist === true ? "Taip" : "Ne",
      };
      result.push(temp);
    });
    setRentObjectsTableItems(result);
  };

  const handleRemove = async () => {
    
    setOpenConfirmDialog(false);

    if(selected.length === 0)
    {
      setAlertMessage("Būtina pasirinkti bent vieną nuomos objektą.");
      setAlertTitle("Nuomos objekto trinimas.");
      setShowAlert(true);
      return;
    }

    setRemoveOccur(true);
    

    try {
      selected.forEach(async (item) => {
        await deleteRentObjectById(item);
      });

      setRemoveSuccess(true);
      await timeout(5000);
      setRemoveOccur(false);
    } catch (error: any) {
      setRemoveSuccess(false);
      await timeout(5000);
      setRemoveOccur(false);
    }
  };

  const handleOpen = (id: string) => {
    navigate(`/rentObjects/${id}`);
  };

  const handleCreateRent = async () => {
    setOpenDialogRent(false);
    setCreateOccur(true);
    try 
    {
      let rentForCreate: Rent = {
        id: uuidv4(),
        tenantId: selectedTenantId,
        rentObjectId: selectedRentObjectId,
        startingDate: startingDate,
        endingDate: endingDate,
        active: true
      };

      await createRent(rentForCreate);
      setCreateSuccess(true);
      await timeout(5000);
      setCreateOccur(false);

    } catch
    {
      setCreateSuccess(false);
      await timeout(5000);
      setCreateOccur(false);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDimensionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDimensions(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartingDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndingDate(event.target.value);
  };

  const handleConfirmCreate = async () => {
    setOpenDialog(false);
    setCreateOccur(true);
    try {
      if (props.user === undefined) return;

      let rentObjectForCreate: RentObject = {
        id: uuidv4(),
        name: name,
        title: title,
        price: parseFloat(price),
        currency: currency,
        landLordId: props.user?.id,
        dimensions: parseFloat(dimensions),
        type: type,
        address: address,
        rentExist: false,
      };

      console.log(rentObjectForCreate);

      await createRentObject(rentObjectForCreate);

      setCreateSuccess(true);
      await timeout(5000);
      setCreateOccur(false);
    } catch (error: any) {
      setCreateSuccess(false);
      await timeout(5000);
      setCreateOccur(false);
    }
  };

  const handleAlertClose = () => 
  {
    setShowAlert(false);
  }

  return (
    <Grid
      container
      alignItems="center"
      direction={"column"}
      justifyContent="center"
      sx={{ margin: 1, xs: "flex", md: "none", marginLeft: 15 }}
    >
       {showAlert ? (<AlertDialog message={alertMessage} handleClose={handleAlertClose} open={showAlert} title={alertTitle}></AlertDialog>) : (<></>)}
      <Grid item xs={6} md={4} sx={{ marginRight: 45, marginBottom: 1 }}>
        <Box
          sx={{
            width: 515,
            height: 40,
            borderRadius: 5,
            p: 2,
            border: 0,
            borderColor: "#646BF5",
            boxShadow: 5,
          }}
        >
          <Button
            sx={{ marginLeft: 2 }}
            variant="contained"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Sukurti nuomos objektą
          </Button>
          <Button
            sx={{ marginLeft: 2 }}
            variant="contained"
            onClick={() => {
              setOpenDialogRent(true);
            }}
          >
            Sukurti nuomą
          </Button>
          <Button
            sx={{ marginLeft: 2, backgroundColor: "red" }}
            variant="contained"
            onClick={() => {
              setOpenConfirmDialog(true);
            }}
          >
            Trinti
          </Button>
        </Box>
      </Grid>
      <Grid item xs={6} md={4} sx={{ marginRight: 40 }}>
        <Box
          sx={{
            width: 960,
            height: 800,
            borderRadius: 5,
            p: 2,
            border: 0,
            borderColor: "#646BF5",
            boxShadow: 5,
          }}
        >
          <RentObjectsTable
            data={rentObjectsTableItems}
            isSelected={isSelected}
            handleClick={handleClick}
            handleOpen={handleOpen}
          />
        </Box>
      </Grid>
      <Grid item>
        {openDialog ? (
          <Dialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          >
            <DialogTitle>Sukurti nuomos objektą</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ marginBottom: 5 }}>
                Užpildykite apačioje esančią formą nuomos objekto sukūrimui.
              </DialogContentText>
              <Grid
                container
                direction="column"
                justifyItems={"center"}
                columnSpacing={2}
                sx={{ marginTop: -3 }}
              >
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Pavadinimas"
                    type="text"
                    onChange={handleNameChange}
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="name"
                    label="Aprašymas"
                    type="text"
                    fullWidth
                    onChange={handleTitleChange}
                    multiline
                    maxRows={5}
                    minRows={5}
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    id="address"
                    label="Adresas"
                    type="text"
                    fullWidth
                    onChange={handleAddressChange}
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Nuomos objekto tipas
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={type}
                    onChange={handleTypeChange}
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value={"Apartment"}>Butas</MenuItem>
                    <MenuItem value={"House"}>Namas</MenuItem>
                    <MenuItem value={"Vila"}>Vila</MenuItem>
                    <MenuItem value={"Garage"}>Garažas</MenuItem>
                    <MenuItem value={"ParkingPlace"}>Parkavimo vieta</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Apmokėjimo valiuta
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={currency}
                    onChange={handleCurrencyChange}
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value={"EUR"}>EUR</MenuItem>
                    <MenuItem value={"DKK"}>DKK</MenuItem>
                    <MenuItem value={"US"}>US</MenuItem>
                    <MenuItem value={"GBP"}>GBP</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    id="price"
                    label="Kaina"
                    type="number"
                    fullWidth
                    onChange={handlePriceChange}
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    id="dimesion"
                    label="Išmatavimai"
                    type="number"
                    fullWidth
                    onChange={handleDimensionsChange}
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Atšaukti
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleConfirmCreate();
                  setOpenDialog(false);
                }}
              >
                Sukurti
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <></>
        )}
        {openDialogRent ? (
          <Dialog
            open={openDialogRent}
            onClose={() => {
              setOpenDialogRent(false);
            }}
          >
            <DialogTitle>Sukurti nuomą</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ marginBottom: 5 }}>
                Užpildykite apačioje esančią formą nuomos sukūrimui.
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
                      <MenuItem key={object.id} value={object.nickName}>
                        {object.nickName}
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
                Atšaukti
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCreateRent();
                  setOpenDialog(false);
                }}
              >
                Sukurti
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <></>
        )}
      </Grid>
      {createSuccess === false && createOccur === true ? (
        <Alert sx={{ marginTop: 25 }} severity="error">
          Sukūrimas nesėkmingas.
        </Alert>
      ) : (
        <></>
      )}
      {createSuccess === true && createOccur === true ? (
        <Alert sx={{ marginTop: 25 }} severity="success">
          Sukūrimas sėkmingas.
        </Alert>
      ) : (
        <></>
      )}
      {removeSuccess === false && removeOccur === true ? (
        <Alert sx={{ marginTop: 25 }} severity="error">
          Ištrinimas nesėkmingas.
        </Alert>
      ) : (
        <></>
      )}
      {removeSuccess === true && removeOccur === true ? (
        <Alert sx={{ marginTop: 25 }} severity="success">
          Ištrinimas sėkmingas.
        </Alert>
      ) : (
        <></>
      )}
      <Dialog
        open={openConfirmDialog}
        onClose={() => {
          setOpenConfirmDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Nuomos objektų trinimas"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ar tikrai norite ištrinti nuomos objektą\us?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenConfirmDialog(false);
            }}
          >
            Atšaukti
          </Button>
          <Button onClick={handleRemove} autoFocus>
            Patvirtinti
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RentObjectComponent;
