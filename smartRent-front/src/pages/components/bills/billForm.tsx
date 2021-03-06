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
import { Bill} from "../../../models/billModel";
import { FileModel } from "../../../models/fileModel";
import { User } from "../../../models/userModel";
import {
  getById,
  update
} from "../../../service/billService";
import { addFile, getFile, removeFile } from "../../../service/fileService";
import { DownloadFile } from "../../../utils/fileDownloader";
import PersonIcon from '@mui/icons-material/Person';
import { getUserById } from "../../../service/userService";
import { ProfileDialog } from "../profile/profileDialog";
import { translateBillTypeToLt } from "../../../utils/translator";
import AlertDialog from "../others/alertDialog";

interface BillFormProps {
  user: User;
}

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const BillForm: React.FC<BillFormProps> = (props) => {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill>();
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>();
  const [status, setStatus] = useState<number>(bill?.paid ? 0 : 1);
  const [endDate, setEndDate] = useState<string>(
    bill?.validTo ? bill?.validTo : ""
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [fileDeleted, setFileDeleted] = useState<boolean>();
  const [updateSuccess, setUpdateSuccess] = useState<boolean>();
  const [deleteOccur, setDeleteOccur] = useState<boolean>(false);
  const [updateOccur, setUpdateOccur] = useState<boolean>(false);
  const [uploadOccur, setUploadOccur] = useState<boolean>(false);
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const [targetUser, setTargetUser] = useState<User>(); 
  const [billType, setBillType] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  
  const handleProfileDialogClose = () =>
  {
    setOpenProfileDialog(false);
  }

  const handleBillTypeChange = (event: SelectChangeEvent) => {
    setBillType(event.target.value);
  }

  const handleOpenProfile = async(id: string | undefined) => {
    if(typeof id === "undefined") return;
    const user = await getUserById(id);
    if(user === null) return;
    setTargetUser(user);
    setOpenProfileDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getById(id);
      if (response !== null) setBill(response);
    };
    fetchData();
  }, [id, fileDeleted, uploadSuccess]);

  useEffect(() => {
    setData(bill);
  }, [bill]);

  const setData = (bill: Bill | undefined) => {
    if (bill === null || typeof bill === "undefined") return;
    setStatus(bill?.paid ? 0 : 1);
    setTitle(bill?.title);
    setPrice(bill?.amount.toString());
    setBillType(translateBillTypeToLt(bill?.billType));
    setEndDate(bill?.validTo);
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

  const handleDownload = async () => {

    if (typeof bill === "undefined") return;
    if(!bill.fileExist)
    {
      setAlertMessage("S??skaita neturi failo.");
      setAlertTitle("Failo per??i??ra.");
      setShowAlert(true);
      return;
    }

    try {
      const result = await getFile(bill.id, "bill");
      
      if(result === null) return;

      DownloadFile(result.file, result.fileName);

    } catch (error: any) {
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if(typeof bill === "undefined") return;

    if (typeof file === "undefined") 
    {
      setAlertMessage("Failas nepasirinktas.");
      setAlertTitle("Failo ??k??limas.");
      setShowAlert(true);
      return;
    }

    try {
      let uploadFile: FileModel = {
        fileName: "",
        id: bill.id,
        file: file,
        type: "bill"
      };

      await addFile(uploadFile);
      setUploadSuccess(true);
      setUploadOccur(true);
      await timeout(5000);
      setUploadOccur(false);
    } catch (error: any) {
      setUploadSuccess(false);
      setUploadOccur(true);
      await timeout(5000);
      setUploadOccur(false);
    }
  };

  const handleFileRemove = async () => {

    if (typeof bill === "undefined") return;
    
    if(!bill.fileExist)
    {
      setAlertMessage("S??skaita neturi failo.");
      setAlertTitle("Failo trinimas.");
      setShowAlert(true);
      return;
    }

    try {
      await removeFile(bill?.id, "bill");
      setDeleteOccur(true);
      setFileDeleted(true);
      await timeout(5000);
      setDeleteOccur(false);
    } catch (error: any) {
      setFileDeleted(false);
      setDeleteOccur(true);

      await timeout(5000);
      setDeleteOccur(false);
    }
  };

  const handleConfirm = async () => {
    try {
      if (typeof bill === "undefined") return;
      if (typeof price === "undefined") return;

      let updateBill: Bill = {
        id: bill?.id,
        amount: parseFloat(price),
        paid: status === 0 ? true : false,
        rentObjectId: bill.rentObjectId,
        validFrom: bill.validFrom,
        validTo: endDate,
        tenantName: bill.tenantName,
        tenantId: bill.tenantId,
        name: bill.name,
        title: title,
        paymentDate: status === 0 ? formatDate(new Date().toDateString()) : null,
        fileExist: bill.fileExist,
        objectName: bill.objectName,
        billType: ""
      };

      setOpenDialog(false);
      await update(updateBill);
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

  const handlePaidChange = (event: SelectChangeEvent) => {
    let value = event.target.value as string;
    setStatus(parseInt(value));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleAlerClose = () => {
    setShowAlert(false);
  }

  return (
    <div>
      <Grid
        container
        rowSpacing={1}
        alignSelf={"center"}
        sx={{ marginTop: 2, marginLeft: 15, marginBottom: 10 }}
      >
        {showAlert ? (<AlertDialog message={alertMessage} handleClose={handleAlerClose} open={showAlert} title={alertTitle}></AlertDialog>) : (<></>)}
        <Grid item xs={4} md={4} sx={{ marginLeft: ( props.user.userType === "tenant" ? 15 : 0 )}}>
          {openProfileDialog ? (<ProfileDialog user={targetUser} openDialog={openProfileDialog} setOpenDialogClose={handleProfileDialogClose} ></ProfileDialog>) : (<></>) }
          <Box
            sx={{
              width: 400,
              height: 710,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          >
            {" "}
            <Typography variant="h5" component="div" gutterBottom>
              S??skaitos duomenys
            </Typography>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{ margin: 1 }}
            >
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pavadinimas: {bill?.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Suma: {bill?.amount}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Apmok??ta: {bill?.paid ? "Taip" : "Ne"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Nuomininkas: {bill?.tenantName}
                  <Button onClick={()=> { handleOpenProfile(bill?.tenantId)}}>
                    <PersonIcon>
                    </PersonIcon>
                  </Button>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Tipas: {translateBillTypeToLt(bill?.billType)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Suk??rimo data: {bill?.validFrom}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Apmok??jimo terminas: {bill?.validTo}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Apmok??jimo data: {bill?.paymentDate}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Failas: {bill?.fileExist ? "Yra" : "N??ra"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Apra??ymas:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" component="div" gutterBottom>
                  {bill?.title}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={4} md={4} sx={{ marginLeft: 0 }}>
         {props.user.userType !== "tenant" ? ( <Box
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
                  Keisti s??skaitos duomenis
                </Typography>
                <InputLabel>Suma</InputLabel>
                <TextField
                  name="price"
                  type={"text"}
                  value={price}
                  variant="outlined"
                  onChange={handlePriceChange}
                  sx={{ maxHeight: 50, maxWidth: 200 }}
                />
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={status.toString()}
                  onChange={handlePaidChange}
                  autoWidth
                  label="S??skaitos b??sena"
                  sx={{ marginLeft: 2, maxHeight: 50, maxWidth: 300 }}
                >
                  <MenuItem value={0} selected={true}>
                    Apmok??ta
                  </MenuItem>
                  <MenuItem value={1}>Neapmok??ta</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  name="title"
                  label="Apra??ymas"
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
                <TextField
                  label="Apmok??jimo data"
                  name="endDate"
                  onChange={handleDateChange}
                  type={"date"}
                  value={endDate}
                ></TextField>
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
                    {"S??skaitos duomen?? keitimas"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Ar tikrai norite pakeisti s??skaitos duomenis?
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
                      At??aukti
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Box>) : (<></>) }
        </Grid>
        <Grid item xs={4} md={4} sx={{ marginLeft: ( props.user.userType === "tenant" ? -55 : 0 )}}>
            {props.user.userType !== "tenant" ? (
            <Box
            sx={{
              width: 330,
              height: 100,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
            }}
          > 
          <Grid container direction="column" alignItems={"left"} spacing={1}>
          <Typography variant="h6" component="div" gutterBottom>
                ??kelti s??skaitos fail??
              </Typography>
              <Grid item>
                <input
                  type="file"
                  name="fileInput"
                  onChange={handleFileSelect}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleFileUpload}>
                  ??kelti
                </Button>
              </Grid>
            </Grid>
            </Box>) : (<></>)}
          <Box
            sx={{
              width: 330,
              height: 100,
              borderRadius: 5,
              p: 2,
              border: 0,
              borderColor: "#646BF5",
              boxShadow: 5,
              marginTop: 2,
            }}
          >
            <Grid container direction="row" alignItems={"left"} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" component="div" gutterBottom>
                  S??skaitos valdymas
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleDownload}>
                  Per??i??r??ti s??skait?? PDF
                </Button>
              </Grid>
              {props.user.userType !== "tenant" ? ( <Grid item>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "red" }}
                  onClick={handleFileRemove}
                >
                  I??trinti
                </Button>
              </Grid>) : (<></>)}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {updateSuccess === false && updateOccur === true? (
        <Alert severity="error">Atnaujinimas nes??kmingas.</Alert>
      ) : (
        <></>
      )}
      {updateSuccess === true && updateOccur === true ? (
        <Alert severity="success">Atnaujinimas s??kmingas.</Alert>
      ) : (
        <></>
      )}
      {fileDeleted === false && deleteOccur === true ? (
        <Alert severity="error">I??trinimas nes??kmingas.</Alert>
      ) : (
        <></>
      )}
      {fileDeleted === true && deleteOccur === true ? (
        <Alert severity="success">I??trinimas s??kmingas.</Alert>
      ) : (
        <></>
      )}
      {uploadSuccess === false && uploadOccur === true ? (
        <Alert severity="error">??k??limas nes??kmingas.</Alert>
      ) : (
        <></>
      )}
      {uploadSuccess === true && uploadOccur === true  ? (
        <Alert severity="success">??k??limas s??kmingas.</Alert>
      ) : (
        <></>
      )}
    </div>
  );
};
export default BillForm;
