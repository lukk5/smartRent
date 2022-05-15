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
import { Bill, BillTableItem } from "../../../models/billModel";
import { RentObject } from "../../../models/rentObjectModel";
import { UserProp } from "../../../models/userModel";
import {
  create,
  getTableItemsByRentObjectId,
  getTableItemsByUserId,
  removeBill,
} from "../../../service/billService";
import { getRentObjectsListByLandLordId } from "../../../service/rentObjectService";
import { timeout } from "../../../utils/timeout";
import BillTable from "./billTable";
import { v4 as uuidv4 } from "uuid";
import { addFile } from "../../../service/fileService";
import { FileModel } from "../../../models/fileModel";
import { isDate } from "../../../utils/validator";

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

const BillComponent: React.FC<UserProp> = (props) => {
  const [tableItems, setTableItems] = useState<BillTableItem[] | null>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [deleteOccur, setDeleteOccur] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [createOccur, setCreateOccur] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [openDialogRemove, setOpenDialogRemove] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(new Date().toDateString());
  const [price, setPrice] = useState<string>("0");
  const [selectedRentObjectCreate, setSelectedRentObjectCreate] =
    useState<string>("");
  const [selectedRentObjectIdCreate, setSelectedRentObjectIdCreate] =
    useState<string>("");
  const [allRentObjects, setAllRentObjects] = useState<[string, string][]>([]);
  const [rentObjects, setRentObjects] = useState<RentObject[]>([]);
  const [file, setFile] = useState<File>();
  const [selectedRentObject, setSelectedRentObject] = useState<string>("");
  const [selectedRentObjectId, setSelectedRentObjectId] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [billType, setBillType] = useState<string>("");

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  let navigate = useNavigate();

  useEffect(() => {
    fetchRentObjects();
  }, [props]);

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

  useEffect(() => {
    if (hasError === true) {
      timeout(5000);
      setHasError(false);
    }
  }, [hasError]);

  useEffect(() => {
    let result: [string, string][] = [];
    rentObjects.forEach((item) => {
      result.push([item.id, item.name]);
    });

    setAllRentObjects(result);
  }, [rentObjects]);

  const handleRentObjectChangeCreate = (
    event: SelectChangeEvent<typeof selectedRentObjectCreate>
  ) => {
    let value = event.target.value;
    setSelectedRentObjectCreate(value);

    allRentObjects.forEach((item) => {
      if (item[1] === value) setSelectedRentObjectIdCreate(item[0]);
    });
  };

  const fetchRentObjects = async () => {
    try {
      if (typeof props.user === "undefined" || props.user.userType === "tenant")
        return;
      const result = await getRentObjectsListByLandLordId(props.user.id);
      if (result === null) return;
      setRentObjects(result);
    } catch (error: any) {}
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    fetchBills();
  }, [props.targetRentObject]);

  const handleRentObjectChange = (
    event: SelectChangeEvent<typeof selectedRentObjectCreate>
  ) => {
    let value = event.target.value;
    setSelectedRentObject(value);

    allRentObjects.forEach((item) => {
      if (item[1] === value) setSelectedRentObjectId(item[0]);
    });
  };

  useEffect(() => {
    if (allRentObjects.length === 0) return;
    setSelectedRentObject(allRentObjects[0][1]);
    setSelectedRentObjectId(allRentObjects[0][0]);
  }, [allRentObjects]);

  useEffect(() => {
    fetchBills();
  }, [createSuccess, deleteSuccess]);

  useEffect(() => {
    let result: [string, string][] = [];
    rentObjects.forEach((item) => {
      result.push([item.id, item.name]);
    });

    setAllRentObjects(result);
  }, [rentObjects]);

  const fetchBills = async () => {
    try {
      if (props.user === undefined) return;

      if (props.user.userType === "tenant") {
        if (
          props.targetRentObject === null ||
          typeof props.targetRentObject === "undefined"
        )
          return;
        const billTableItems = await getTableItemsByRentObjectId(
          props.targetRentObject?.id,
          "true"
        );
        console.log(props.targetRentObject?.id);
        setTableItems(billTableItems);
      } else {
        const billTableItems = await getTableItemsByUserId(
          props.user.id,
          "true"
        );
        setTableItems(billTableItems);
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchRentObjects();
    fetchBills();
  }, [props]);

  const handleOpen = () => {
    navigate(`/bills/${selected}`);
  };

  const handleCreateBill = async () => {
    try {
      let id = uuidv4();

      let createBill: Bill = {
        id: id,
        amount: parseFloat(price),
        paid: false,
        rentObjectId: selectedRentObjectIdCreate,
        validFrom: new Date().toDateString(),
        validTo: endDate,
        tenantName: "",
        tenantId: "",
        name: name,
        title: title,
        paymentDate: null,
        fileExist: typeof file !== "undefined" ? true : false,
        objectName: "",
        billType: "",
      };

      setOpenDialog(false);
      await create(createBill);

      if (typeof file !== "undefined") {
        let fileAdd: FileModel = {
          id: id,
          file: file,
          fileName: "",
          type: "bill",
        };
        await addFile(fileAdd);
      }
      setCreateSuccess(true);
      setCreateOccur(true);

      await timeout(5000);

      setCreateOccur(false);
    } catch (error: any) {
      setCreateOccur(true);
      setCreateSuccess(false);

      await timeout(5000);

      setCreateOccur(false);
    }
  };

  const handleRemove = async () => {
    setOpenDialogRemove(false);
    try {
      selected.forEach(async (item) => {
        await removeBill(item);
      });

      setDeleteOccur(true);
      setDeleteSuccess(true);
      await timeout(5000);
      setDeleteOccur(false);
    } catch (error: any) {
      setDeleteOccur(true);
      setDeleteSuccess(false);
      await timeout(5000);
      setDeleteOccur(false);
    }
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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleInputBlur = () => {
    validateInput();
  };

  const handleBillTypeChange = (event: SelectChangeEvent) => 
  {
    setBillType(event.target.value);
  }

  const validateInput = () => {};

  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction={"column"}
        sx={{ margin: 1, xs: "flex", md: "none", marginLeft: 15 }}
      >
        {props.user?.userType !== "tenant" ? (
          <Grid
            container
            alignItems={"center"}
            direction={"row"}
            spacing={2}
            sx={{ marginBottom: 2, marginTop: 2 }}
          >
            <Grid item xs={6} sx={{ marginLeft: 7 }}>
              <Box
                sx={{
                  width: 300,
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
                  Sukurti sąskaita
                </Button>
                <Button
                  sx={{ marginLeft: 2, backgroundColor: "red" }}
                  variant="contained"
                  onClick={() => {
                    setOpenDialogRemove(true);
                  }}
                >
                  Trinti
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ marginLeft: -35 }}>
              <Box
                sx={{
                  width: 340,
                  height: 40,
                  borderRadius: 5,
                  p: 2,
                  border: 0,
                  borderColor: "#646BF5",
                  boxShadow: 5,
                }}
              >
                <Grid container>
                  <InputLabel>Nuomos objektas: </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedRentObject}
                    onChange={handleRentObjectChange}
                    MenuProps={MenuProps}
                    sx={{ minWidth: 180, maxHeight: 40, marginLeft: 2 }}
                  >
                    {rentObjects.map((object) => (
                      <MenuItem key={object.id} value={object.name}>
                        {object.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
        {openDialog ? (
          <Dialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          >
            <DialogTitle>Sukurti sąskaitą</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ marginBottom: 5 }}>
                Užpildykite apačioje esančią formą sąskaitos sukūrimui.
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
                <Grid item>
                  <InputLabel id="demo-multiple-name-label">
                    Nuomos objektas
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedRentObjectCreate}
                    onChange={handleRentObjectChangeCreate}
                    MenuProps={MenuProps}
                    sx={{ minWidth: 180 }}
                  >
                    {rentObjects.map((object) => (
                      <MenuItem key={object.id} value={object.name}>
                        {object.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <InputLabel id="demo-multiple-name-label">
                    Sąskaitos tipas
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={billType}
                    onChange={handleBillTypeChange}
                    MenuProps={MenuProps}
                    sx={{ minWidth: 180 }}
                  >
                    <MenuItem value={"Nuomos"}> Nuomos </MenuItem>
                    <MenuItem value={"Kita"}> Kita </MenuItem>
                  </Select>
                  <Grid item>
                    <InputLabel>Suma</InputLabel>
                    <TextField
                      name="price"
                      type={"text"}
                      value={price}
                      variant="outlined"
                      onChange={handlePriceChange}
                      sx={{ maxHeight: 50, maxWidth: 200 }}
                    />
                  </Grid>
                  <Grid item sx={{ marginTop: 2 }}>
                    <InputLabel>Apmokėjimo data</InputLabel>
                    <TextField
                      name="endDate"
                      onChange={handleDateChange}
                      type={"date"}
                      value={endDate}
                    ></TextField>
                  </Grid>
                  <Grid item sx={{ marginTop: 2 }}>
                    <InputLabel id="demo-multiple-name-label">
                      Sąskaitos įkėlimas
                    </InputLabel>
                  </Grid>
                  <Grid item sx={{ marginTop: 2 }}>
                    <input type="file" onChange={handleFileSelect}></input>
                  </Grid>
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
                  handleCreateBill();
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
            <BillTable
              data={tableItems}
              isSelected={isSelected}
              handleClick={handleClick}
              handleOpen={handleOpen}
            />
          </Box>
        </Grid>
        <Box sx={{ align: "left", marginLeft: -25, marginTop: 15 }}>
          {createSuccess === false && createOccur === true ? (
            <Alert severity="error">Sukūrimas nesėkmingas.</Alert>
          ) : (
            <></>
          )}
          {createSuccess === true && createOccur === true ? (
            <Alert severity="success">Sukūrimas sėkmingas.</Alert>
          ) : (
            <></>
          )}
          {deleteSuccess === false && deleteOccur === true ? (
            <Alert severity="error">Ištrinimas nesėkmingas.</Alert>
          ) : (
            <></>
          )}
          {deleteSuccess === true && deleteOccur === true ? (
            <Alert severity="success">Ištrinimas sėkmingas.</Alert>
          ) : (
            <></>
          )}
          <Dialog
            open={openDialogRemove}
            onClose={() => {
              setOpenDialogRemove(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Sąskaitos trinimas"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Ar tikrai norite ištrinti sąskaitą?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenDialogRemove(false);
                }}
              >
                Atšaukti
              </Button>
              <Button onClick={handleRemove} autoFocus>
                Patvirtinti
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
    </div>
  );
};

export default BillComponent;
