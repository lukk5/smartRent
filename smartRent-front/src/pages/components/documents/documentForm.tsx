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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentModel } from "../../../models/documentModel";
import { FileModel } from "../../../models/fileModel";
import { User } from "../../../models/userModel";
import {
  getDocumentById,
  updateDocument,
} from "../../../service/documentService";
import { getFile } from "../../../service/fileService";
import { DownloadFile } from "../../../utils/fileDownloader";
import { timeout } from "../../../utils/timeout";
import {
  translateDocumentTypeToEn,
  translateDocumentTypeToLt,
} from "../../../utils/translator";


interface DocumentFormProps {
  user: User;
}

const DocumentForm: React.FC<DocumentFormProps> = (props) => {
  const { id } = useParams();
  const [documentModel, setDocument] = useState<DocumentModel>();
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [fileDeleted, setFileDeleted] = useState<boolean>();
  const [updateSuccess, setUpdateSuccess] = useState<boolean>();
  const [deleteOccur, setDeleteOccur] = useState<boolean>(false);
  const [updateOccur, setUpdateOccur] = useState<boolean>(false);
  const [uploadOccur, setUploadOccur] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDocumentById(id);
      if (response !== null) setDocument(response);
    };
    fetchData();
  }, [id, fileDeleted, uploadSuccess]);

  useEffect(() => {
    setData(documentModel);
  }, [documentModel]);

  const setData = (document: DocumentModel | undefined) => {
    if (document === null || typeof document === "undefined") return;
    setTitle(document.title);
    setType(translateDocumentTypeToLt(document.type));
  };

  const handleDownload = async () => {
    try {
      if (typeof documentModel === "undefined") return;

      const result = await getFile(documentModel.id, "document");

      if (result === null) return;

      DownloadFile(result.file, result.fileName);
    } catch (error: any) {}
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;
    setFile(event.target.files[0]);
  };

  const handleConfirm = async () => {
    try {
      if (typeof documentModel === "undefined") return;
      if (typeof file === "undefined") return;

      let documentUpdate: DocumentModel = {
        body: undefined,
        id: documentModel.id,
        name: documentModel.name,
        title: title,
        type: translateDocumentTypeToEn(type),
        rentObjectId: documentModel.rentObjectId,
      };

      let fileUpdate: FileModel = {
        fileName: "",
        id: documentModel.id,
        file: file,
        type: "document",
      };
      setOpenDialog(false);
      await updateDocument(documentUpdate, fileUpdate);
      setUpdateSuccess(true);
      setUpdateOccur(true);
      await timeout(5000);
      setUpdateOccur(false);
    } catch (error: any) {
      setUpdateOccur(true);
      setUpdateSuccess(false);
      await timeout(5000);
      setUpdateOccur(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  return (
    <div>
      <Grid
        container
        rowSpacing={1}
        alignSelf={"center"}
        sx={{ marginTop: 2, marginLeft: 15, marginBottom: 10 }}
      >
        <Grid item xs={4} md={4} sx={{ marginRight:  0 , marginLeft: props.user.userType !== "tenant" ? 0 : 45}}>
          <Box
            sx={{
              width: 400,
              height: 310,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            {" "}
            <Typography variant="h5" component="div" gutterBottom>
              Dokumento duomenys
            </Typography>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{ margin: 1 }}
            >
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pavadinimas: {documentModel?.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Tipas: {translateDocumentTypeToLt(documentModel?.type)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Aprašymas:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" component="div" gutterBottom>
                  {documentModel?.title}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {props.user.userType !== "tenant" ? (  <Grid item xs={4} md={4} sx={{ marginLeft: 0 }}>
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
            <Grid
              container
              spacing={2}
              direction="column"
              sx={{ maxHeight: 500 }}
            >
              <Grid item xs={6} md={4}>
                <Typography variant="h5" component="div" gutterBottom>
                  Keisti dokumento duomenis
                </Typography>
                <InputLabel>Dokumento tipas</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={type}
                  onChange={handleTypeChange}
                  autoWidth
                  sx={{ maxHeight: 50, maxWidth: 300 }}
                >
                  <MenuItem value={"Sutartis"} selected={true}>
                    Sutartis
                  </MenuItem>
                  <MenuItem value={"Inventorizacija"}>Inventorizacija</MenuItem>
                  <MenuItem value={"Kita"}>Kita</MenuItem>
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
                    minHeight: 160,
                    maxHeight: 160,
                  }}
                ></TextField>
                <InputLabel sx={{ marginBottom: 2 }}>
                  Dokumento įkėlimas
                </InputLabel>
                <input type="file" onChange={handleFileSelect} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  Atnaujinti duomenis
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={() => {
                    setOpenDialog(false);
                  }}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Sąskaitos duomenų keitimas"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Ar tikrai norite pakeisti sąskaitos duomenis?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleConfirm} autoFocus>
                      Patvirtinti{" "}
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                      }}
                    >
                      Atšaukti
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Box>
        </Grid>) : (<></>)}
        <Grid item xs={4} md={4}>
          <Box
            sx={{
              width: 200,
              height: 100,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            <Grid container direction="row" alignItems={"left"} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" component="div" gutterBottom>
                  Dokumento valdymas
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleDownload}>
                  Peržiūrėti PDF
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
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
      {fileDeleted === false && deleteOccur === true ? (
        <Alert severity="error">Ištrinimas nesėkmingas.</Alert>
      ) : (
        <></>
      )}
      {fileDeleted === true && deleteOccur === true ? (
        <Alert severity="success">Ištrinimas sėkmingas.</Alert>
      ) : (
        <></>
      )}
      {uploadSuccess === false && uploadOccur === true ? (
        <Alert severity="error">Įkėlimas nesėkmingas.</Alert>
      ) : (
        <></>
      )}
      {uploadSuccess === true && uploadOccur === true ? (
        <Alert severity="success">Įkėlimas sėkmingas.</Alert>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DocumentForm;
