import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import {
  User,
  UserContactDetails,
  UserPassword,
  UserProp,
} from "../models/userModel";
import {
  isEmail,
  isPassword,
  isPasswordMatch,
  isPhone,
} from "../utils/validator";

import {
  changeUserPassword,
  changeUserContactInfo,
  checkOldPassword,
} from "../service/userService";
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile: React.FC<UserProp> = (props) => {
  const [user, setUser] = useState<User | undefined>(props.user);
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneHasError, setPhoneHasError] = useState<boolean>(false);
  const [emailHasError, setEmailHasError] = useState<boolean>(false);
  const [passwordHasError, setPasswordHasError] = useState<boolean>(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [updateSuccess, setUpdateSucces] = useState<boolean>();
  const [updateOccur, setUpdateOccur] = useState<boolean>();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [oldPasswordHasError, setOldPasswordHasError] =
    useState<boolean>(false);
  const [oldPasswrodError, setOldPasswordError] = useState<string>("");

  const navigate = useNavigate();

  const loadUserAfterRefresh = () => {
    let stringUser = window.localStorage.getItem("user");

    if (stringUser === null) return;

    setUser(JSON.parse(stringUser));
    props.updateLoginSucces();
  };

  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadUserAfterRefresh();
  }, []);

  const onChangeField = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      switch (event.target.name) {
        case "password":
          setPassword(event.target.value);
          break;
        case "repeatpassword":
          setRepeatPassword(event.target.value);
          break;
        case "phone":
          setPhone(event.target.value);
          break;
        case "email":
          setEmail(event.target.value);
          break;
        case "oldpassword":
          setOldPassword(event.target.value);
          break;
      }
    },
    []
  );

  const validate = (property: string) => {
    switch (property) {
      case "email":
        if (email !== "") {
          if (!isEmail(email)) {
            setEmailHasError(true);
            setEmailError("Blogas el.pašto adresas");
          }
        } else {
          setEmailError("");
          setEmailHasError(false);
        }

        break;
      case "password":
        if (password !== "") {
          if (!isPassword(password)) {
            setPasswordHasError(true);
            setPasswordError(
              "Blogai įvestas slaptažodis. Slaptažodis turi būti nuo 6 iki 20 simbolių ir turėti bent 1 raidę, skaičių ir simbolį."
            );
          }
        } else {
          setPasswordHasError(false);
          setPasswordError("");
        }
        break;
      case "repeatpassword":
        if (repeatPassword !== "") {
          if (!isPasswordMatch(password, repeatPassword)) {
            setPasswordHasError(true);
            setPasswordError("Nesutampa slaptažodžiai.");
          }
        }

        break;
      case "phone":
        if (phone !== "") {
          if (!isPhone(phone)) {
            setPhoneHasError(true);
            setPhoneError("Blogai įvestas telefono numeris.");
          }
        } else {
          setPhoneHasError(false);
          setPhoneError("");
        }
        break;
    }
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleChangeContactData = async () => {
    const userData: UserContactDetails = {
      phone: phone,
      email: email,
      id: user?.id,
      type: user?.userType,
    };

    setUpdateOccur(false);

    try {
      const response = await changeUserContactInfo(userData);

      if (props.updateUser !== undefined) {
        props.updateUser(response);
      }

      setUser(response);

      setUpdateOccur(true);
      setUpdateSucces(true);
      await timeout(4000);
      setUpdateOccur(false);
      setEmail("");
      setPhone("");
    } catch (error: any) {
      setUpdateOccur(true);
      setUpdateSucces(false);
      await timeout(4000);
      setUpdateOccur(false);
    }
  };

  const handleChangePassword = async () => {
    const userData: UserPassword = {
      password: password,
      id: user?.id,
    };

    setUpdateOccur(false);

    try {
      await changeUserPassword(userData);

      setUpdateOccur(true);
      setUpdateSucces(true);

      await timeout(4000);
      setUpdateOccur(false);

      if (props.logOut !== undefined) {
        props.logOut();
      } else {
          throw new Error("No logOut prop.");
      }

      navigate("/");
    } catch (error: any) {
      setUpdateOccur(true);
      setUpdateSucces(false);
      await timeout(4000);
      setUpdateOccur(false);
    }
  };

  const handlePasswordDialogOpen = () => {
    if (password === "" || repeatPassword === "") {
      setPasswordError("Laukas negali būti tuščias.");
      setPasswordHasError(true);
      return;
    }

    if (oldPassword === "") {
      setOldPasswordError("Laukas negali būti tuščias.");
      setOldPasswordHasError(true);
      return;
    }

    if (passwordHasError || oldPasswordHasError) return;

    setOpenPassword(true);
  };

  const handleContactDialogOpen = () => {
    if (email === "" && phone === "") {
      setEmailError("Laukas negali būti tuščias.");
      setEmailHasError(true);
      setPhoneError("Laukas negali būti tuščias.");
      setPhoneHasError(true);
      return;
    }

    if (emailHasError && email !== "") return;
    if (phoneHasError && phone !== "") return;

    setOpenContact(true);
  };

  const handleConfirmPassword = () => {
    setOpenPassword(false);
    handleChangePassword();
  };

  const handleConfirmContact = () => {
    setOpenContact(false);
    handleChangeContactData();
  };

  const handlePasswordClose = () => {
    setOpenPassword(false);
  };

  const handleContactClose = () => {
    setOpenContact(false);
  };

  const validateOldPassword = async () => {
    if (oldPassword === "") {
      setOldPasswordError("");
      setOldPasswordHasError(false);
      return;
    }

    const userCheck: UserPassword = {
      password: oldPassword,
      id: user?.id,
    };

    const result = await checkOldPassword(userCheck);

    setOldPasswordHasError(!result);

    if (!result) {
      setOldPasswordError("Dabartinis slaptažodis neteisingas.");
    } else {
      setOldPasswordError("");
    }
  };

  return (
    <div>
      <Grid container sx={{ margin: 5 }}>
        <Grid item xs={6} md={4} sx={{ marginRight: 15 }}>
          <Box
            sx={{
              width: 400,
              height: 400,
              borderRadius: 5,
              p: 2,
              border: 1,
              borderColor: "#646BF5",
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Vartotojo duomenys
            </Typography>
            <Grid
              container
              direction="column"
              rowSpacing={2}
              sx={{ margin: 1 }}
            >
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Vardas: {user?.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Pavardė: {user?.lastName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  Telefono numeris: {user?.phone}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" gutterBottom>
                  El.pašto adresas: {user?.email}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box
            sx={{
              width: 550,
              height: 400,
              borderRadius: 5,
              p: 2,
              border: 1,
              borderColor: "#646BF5",
              boxShadow: 3,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab
                value={0}
                label="Pakeisti kontaktinius duomenis"
                {...a11yProps(0)}
              />
              <Tab value={1} label="Pakeisti slaptažodį" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Grid
                container
                spacing={1}
                direction="column"
                sx={{ marginBottom: 30, maxHeight: 160 }}
              >
                <Grid item xs zeroMinWidth>
                  <TextField
                    name="email"
                    placeholder="El.paštas"
                    type={"email"}
                    value={email}
                    onChange={onChangeField}
                    variant="outlined"
                    onBlur={() => {
                      validate("email");
                    }}
                    error={emailHasError}
                    helperText={emailError}
                    sx={{ maxHeight: 50, maxWidth: 200 }}
                  />
                  <TextField
                    name="phone"
                    placeholder="Telefono numeris"
                    type={"text"}
                    value={phone}
                    onChange={onChangeField}
                    variant="outlined"
                    onBlur={() => {
                      validate("phone");
                    }}
                    error={phoneHasError}
                    helperText={phoneError}
                    sx={{ marginLeft: 2, maxHeight: 50, maxWidth: 200 }}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item>
                  <Button onClick={handleContactDialogOpen} variant="contained">
                    Keisti kontaktinius duomenis
                  </Button>
                  <Dialog
                    open={openContact}
                    onClose={handleContactClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Kontaktinių duomenų keitimas"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Ar tikrai norite pakeisti kontaktinius duomenis?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleConfirmContact} autoFocus>
                        Patvirtinti{" "}
                      </Button>
                      <Button onClick={handleContactClose}>Atšaukti</Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid
                container
                spacing={1}
                direction="column"
                sx={{ marginBottom: 22, maxHeight: 160 }}
              >
                <Grid item>
                  <TextField
                    name="password"
                    placeholder="Slaptažodis"
                    type={"password"}
                    value={password}
                    onChange={onChangeField}
                    onBlur={() => {
                      validate("password");
                    }}
                    variant="outlined"
                    error={passwordHasError}
                    helperText={passwordError}
                    sx={{ maxHeight: 50, maxWidth: 200 }}
                  />
                  <TextField
                    name="repeatpassword"
                    placeholder="Pakartoti slaptažodį"
                    type={"password"}
                    value={repeatPassword}
                    onChange={onChangeField}
                    variant="outlined"
                    onBlur={() => {
                      validate("repeatpassword");
                    }}
                    sx={{ marginLeft: 2, maxHeight: 50, maxWidth: 200 }}
                  />
                  <TextField
                    name="oldpassword"
                    placeholder="Senas slaptažodis"
                    type={"password"}
                    value={oldPassword}
                    onChange={onChangeField}
                    onBlur={() => {
                      validateOldPassword();
                    }}
                    variant="outlined"
                    error={oldPasswordHasError}
                    helperText={oldPasswrodError}
                    sx={{
                      marginTop: 2,
                      marginLeft: 27,
                      maxHeight: 50,
                      maxWidth: 200,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item>
                  <Button
                    onClick={handlePasswordDialogOpen}
                    variant="contained"
                  >
                    Keisti slaptažodį
                  </Button>
                  <Dialog
                    open={openPassword}
                    onClose={handlePasswordClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Slaptažodžio keitimas"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Ar tikrai norite pakeisti slaptažodį?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleConfirmPassword} autoFocus>
                        Patvirtinti{" "}
                      </Button>
                      <Button onClick={handlePasswordClose}>Atšaukti</Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </TabPanel>
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
    </div>
  );
};

export default Profile;
