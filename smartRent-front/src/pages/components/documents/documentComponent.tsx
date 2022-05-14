import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentTableItem,
  DocumentProps,
  DocumentModel,
  DocumentFile,
} from "../../../models/documentModel";
import { RentObject } from "../../../models/rentObjectModel";
import {
  createDocument,
  getDocumentsForList,
  RemoveDocument,
} from "../../../service/documentService";
import { getRentObjectsListByLandLordId } from "../../../service/rentObjectService";
import { v4 as uuidv4 } from "uuid";
import DocumentTable from "./documentTable";
import { addFile } from "../../../service/fileService";
import { FileModel } from "../../../models/fileModel";


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

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const DocumentComponent: React.FC<DocumentProps> = (props) => {
  const [documentList, setDocumentList] = useState<DocumentTableItem[] | null>(
    []
  );

  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [createOccur, setCreateOccur] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [deleteOccur, setDeleteOccur] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [selectedRentObjectCreate, setSelectedRentObjectCreate] =
    useState<string>("");
  const [selectedRentObjectIdCreate, setSelectedRentObjectIdCreate] =
    useState<string>("");
  const [allRentObjects, setAllRentObjects] = useState<[string, string][]>([]);
  const [selectedRentObject, setSelectedRentObject] = useState<string>("");
  const [selectedRentObjectId, setSelectedRentObjectId] = useState<string>("");
  const [rentObjects, setRentObjects] = useState<RentObject[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

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

  const handleRentObjectChange = (
    event: SelectChangeEvent<typeof selectedRentObjectCreate>
  ) => {
    let value = event.target.value;
    setSelectedRentObject(value);

    allRentObjects.forEach((item) => {
      if (item[1] === value) setSelectedRentObjectId(item[0]);
    });
  };

  const handleRentObjectChangeCreate = (
    event: SelectChangeEvent<typeof selectedRentObjectCreate>
  ) => {
    let value = event.target.value;
    setSelectedRentObjectCreate(value);

    allRentObjects.forEach((item) => {
      if (item[1] === value) setSelectedRentObjectIdCreate(item[0]);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;
    setFile(event.target.files[0]);
  };

  const fetchRentObjects = async () => {
    try {
      if (typeof props.user === "undefined") return;
      const result = await getRentObjectsListByLandLordId(props.user.id);
      if (result === null) return;
      setRentObjects(result);
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchRentObjects();
    fetchDocuments();
  }, [createSuccess]);

  useEffect(() => {
    let result: [string, string][] = [];
    rentObjects.forEach((item) => {
      result.push([item.id, item.name]);
    });

    setAllRentObjects(result);
  }, [rentObjects]);

  useEffect(() => {
    if (allRentObjects.length === 0) return;
    setSelectedRentObject(allRentObjects[0][1]);
    setSelectedRentObjectId(allRentObjects[0][0]);
  }, [allRentObjects]);

  const fetchDocuments = async () => {
    try {
      const response = await getDocumentsForList(selectedRentObjectId);
      setDocumentList(response);
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedRentObjectId]);

  useEffect(() => {
    fetchRentObjects();
  }, [props]);

  const handleOpen = (id: string) => {
    navigate(`/documents/${id}`);
  };

  const handleRemove = async () => {
    setConfirmDialogOpen(false);
    try{

      selected.forEach(async()=> 
      {

      });

      await RemoveDocument(selected[0]);
      setDeleteOccur(true);
      setDeleteSuccess(true);
      await timeout(5000);
      setDeleteOccur(false);
    } catch(error: any)
    {
      setDeleteOccur(true);
      setDeleteSuccess(false);
      await timeout(5000);
      setDeleteOccur(false);
    }
  };

  useEffect(()=> {
    fetchDocuments();
  },[deleteOccur])

  const handleCreate = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleConfirmCreate = async () => {
    try {
      let id = uuidv4();

      let document: DocumentModel = {
        id: id,
        name: name,
        title: title,
        type: type,
        rentObjectId: selectedRentObjectIdCreate,
        body: undefined
      };

      let result = await createDocument(document);

      if (typeof file !== "undefined") {
        let documentFile: FileModel = {
          id: id,
          file: file,
          fileName: "",
          type: "document"
        };
        let fileResult = await addFile(documentFile);
      }

      setCreateSuccess(true);
      setCreateOccur(true);

      await timeout(5000);

      setCreateOccur(false);
    } catch (error: any) {
      setCreateSuccess(false);
      setCreateOccur(true);
      await timeout(5000);
      setCreateOccur(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const hanldeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction={"column"}
        sx={{ margin: 1, xs: "flex", md: "none", marginLeft: 15 }}
      >
        <Grid item xs={4}>
          <Grid
            container
            alignItems={"center"}
            direction={"row"}
            spacing={-29}
            sx={{ marginBottom: 2, marginTop: 2 }}
          >
            <Grid item xs={6}>
              <Box
                sx={{
                  width: 310,
                  height: 40,
                  borderRadius: 5,
                  p: 2,
                  border: 1,
                  borderColor: "#646BF5",
                  boxShadow: 3,
                }}
              >
                <Button
                  sx={{ marginLeft: 2 }}
                  variant="contained"
                  onClick={handleCreate}
                >
                  Sukurti dokumentą
                </Button>
                <Button
                  sx={{ marginLeft: 2, backgroundColor: "red" }}
                  variant="contained"
                  onClick={() => {
                    setConfirmDialogOpen(true);
                  }}
                >
                  Trinti
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  width: 340,
                  height: 40,
                  borderRadius: 5,
                  p: 2,
                  border: 1,
                  borderColor: "#646BF5",
                  boxShadow: 3,
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
          {openDialog ? (
            <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>Sukurti dokumentą</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ marginBottom: 5 }}>
                  Užpildykite apačioje esančią formą dokumento sukūrimui.
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
                      onChange={hanldeNameChange}
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
                    <InputLabel id="demo-simple-select-standard-label">
                      Dokumento tipas
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={type}
                      onChange={handleTypeChange}
                      sx={{ minWidth: 180 }}
                    >
                      <MenuItem value={"Contract"}>Sutartis</MenuItem>
                      <MenuItem value={"InventoryList"}>
                        Inventorizacija
                      </MenuItem>
                      <MenuItem value={"Other"}>Kita</MenuItem>
                    </Select>
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
                    <Grid item sx={{ marginTop: 2 }}>
                      <InputLabel id="demo-multiple-name-label">
                        Dokumento įkėlimas
                      </InputLabel>
                    </Grid>
                    <Grid item sx={{ marginTop: 2 }}>
                      <input type="file" onChange={handleFileSelect}></input>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleDialogClose}>
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
          <Grid item xs={6} md={4} sx={{ marginRight: 40 }}>
            <Box
              sx={{
                width: 960,
                height: 800,
                borderRadius: 5,
                p: 2,
                border: 1,
                borderColor: "#646BF5",
                boxShadow: 3,
              }}
            >
              {
                <DocumentTable
                  data={documentList}
                  handleClick={handleClick}
                  isSelected={isSelected}
                  handleOpen={handleOpen}
                />
              }
            </Box>
          </Grid>
        </Grid>
        <Box sx={{align: "left", marginLeft: -25 , marginTop: 15}}>
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
        </Box>
        <Dialog
          open={confirmDialogOpen}
          onClose={()=>{ setConfirmDialogOpen(false);}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Dokumento trinimas"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Ar tikrai norite ištrinti dokumentą?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{ setConfirmDialogOpen(false);}}>Atšaukti</Button>
            <Button onClick={handleRemove} autoFocus>
              Patvirtinti
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};

export default DocumentComponent;
