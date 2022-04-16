import React, { useCallback, useEffect, useState, MouseEvent } from "react";
import { register, validateInDB } from "../service/userAuthService";
import { useNavigate } from "react-router-dom";
import { RegisterUserBody } from "../models/userAuthModel";
import {
  Button,
  TextField,
  Box,
  Grid,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import logo from "../image/smartRent.png";
import "../image/logo.css";
import { isEmail, isPassword, isPasswordMatch, isPhone } from "../utils/validator";

const SignOnForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [regError, setRegError] = useState<boolean>(false);
  const [nickNameError, setNickNameError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [nickNameHasError, setNickNameHasError] = useState<boolean>(false);
  const [firsNameHasError, setFirstNameHasError] = useState<boolean>(false);
  const [lastNameHasError, setLastNameHasError] = useState<boolean>(false);
  const [phoneHasError, setPhoneHasError] = useState<boolean>(false);
  const [emailHasError, setEmailHasError] = useState<boolean>(false);
  const [passwordHasError, setPasswordHasError] = useState<boolean>(false);
  const [userTypeHasError, setUserTypeHasError] = useState<boolean>(false);
  const [userTypeError, setUserTypeError] = useState<string>("");

  const onChangeField = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      switch (event.target.name) {
        case "email":
          setEmail(event.target.value);
          break;
        case "password":
          setPassword(event.target.value);
          break;
        case "nickname":
          setUsername(event.target.value);
          break;
        case "repeatpassword":
          setRepeatPassword(event.target.value);
          break;
        case "lastName":
          setLastName(event.target.value);
          break;
        case "firstName":
          setFirstName(event.target.value);
          break;
        case "phone":
          setPhone(event.target.value);
          break;
      }
    },
    []
  );

  const handleTypeChange = (e: any) => {
    setUserType(e.target.value);
  };

  const navigate = useNavigate();

  const onClickButton = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      switch (event.currentTarget.name) {
        case "visible_password":
          setVisiblePassword(!visiblePassword);
          break;
      }
    },
    [visiblePassword]
  );

  useEffect(() => {
    (async () => {
      if (canSubmit) {
        try {
          const isLandLord: boolean = userType === "LandLord";

          const user: RegisterUserBody = {
            nickName: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            isLandLord: isLandLord,
          };

          await register(user);
          setEmail("");
          setPassword("");
          setCanSubmit(false);
        } catch (error) {
          setCanSubmit(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSubmit]);

  const goBack = () => {
    navigate("/");
  };

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

        if(password !== "")
        {
          if(!isPassword(password))
          {
            setPasswordHasError(true);
            setPasswordError("Blogai įvestas slaptažodis. Slaptažodis turi būti nuo 6 iki 20 simbolių ir turėti bent 1 raidę, skaičių ir simbolį.")
          }
        } else {
            setPasswordHasError(false);
            setPasswordError("");
        }
        break;
      case "nickname":
        if(username === "") {
          setNickNameError("Laukas negali būti tuščias.");
          setNickNameHasError(true);
        }
        break;
      case "repeatpassword":

        if(repeatPassword !== "")
        {
          if(!isPasswordMatch(password, repeatPassword))
          {
            setPasswordHasError(true);
            setPasswordError("Nesutampa slaptažodžiai.");
          }
        } 

        break;
      case "lastName":
        if(lastName === "") {
          setLastNameError("Pavardė negali būti tuščias.");
          setLastNameHasError(true);
        }
        break;
      case "firstName":
        if(firstName === "") {
          setNameError("Vardas negali būti tuščias.");
          setFirstNameHasError(true);
        }
        break;
      case "phone":
        if(phone !== "")
        {
          if(!isPhone(phone))
          {
            setPhoneHasError(true);
            setPhoneError("Blogai įvestas telefono numeris.")
          }
        } else {
            setPhoneHasError(false);
            setPhoneError("");
        }
        break;
        case "userType":
        
        if(userType === "")
        {
            setUserTypeHasError(true);
            setUserTypeError("Būtina pasirinkti tipą.");
        }

        break;
    }
  };

  const handleSubmit = async () => {
    if (regError) {
      setCanSubmit(false);
      return;
    }
    setCanSubmit(true);
  };

  setTimeout(() => {
    setRegError(false);
  }, 200);

  return (
    <Box>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <img src={logo} className="center" alt="logo" />
          <Grid
            container
            spacing={2}
            columnSpacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={8} md={4}>
              {regError ? (
                <Alert severity="error">Registracija nesėkminga</Alert>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="nickname"
                placeholder="Vartotojo vardas"
                type="text"
                value={username}
                onChange={onChangeField}
                variant="outlined"
                error={nickNameHasError}
                helperText={nickNameError}
                onBlur={() => {
                  validate("nickname");
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="firstName"
                placeholder="Vardas"
                type="text"
                value={firstName}
                onChange={onChangeField}
                error={firsNameHasError}
                helperText={nameError}
                onBlur={() => {
                  validate("firstName");
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                onBlur={() => {
                  validate("lastName");
                }}
                name="lastName"
                placeholder="Pavardė"
                type="text"
                value={lastName}
                onChange={onChangeField}
                error={lastNameHasError}
                helperText={lastNameError}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="email"
                placeholder="El.paštas"
                type="email"
                value={email}
                onChange={onChangeField}
                error={emailHasError}
                helperText={emailError}
                onBlur={() => {
                  validate("email");
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="phone"
                placeholder="Telefono numeris"
                type="tel"
                value={phone}
                onChange={onChangeField}
                error={phoneHasError}
                helperText={phoneError}
                onBlur={()=> { validate("phone"); }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="password"
                placeholder="Slaptažodis"
                type={visiblePassword ? "text" : "password"}
                value={password}
                onChange={onChangeField}
                error={passwordHasError}
                helperText={passwordError}
                onBlur={()=> { validate("password"); }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="repeatpassword"
                placeholder="Pakartoti slaptažodį"
                type={visiblePassword ? "text" : "password"}
                value={repeatPassword}
                onChange={onChangeField}
                onBlur={()=> { validate("repeatpassword"); }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl required sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-required-label">
                  Vartotojo tipas
                </InputLabel>
                <Select
                  name="userType"
                  label="Vartotojo tipas *"
                  value={userType}
                  onChange={handleTypeChange}
                >
                  <MenuItem defaultChecked value={"tenant"}>
                    Nuomininkas
                  </MenuItem>
                  <MenuItem value={"landLord"}>Nuomuotojas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <Button variant="contained" onClick={handleSubmit}>
                REGISTRUOTIS
              </Button>
            </Grid>
            <Grid item xs={6} md={4}>
              <Button variant="contained" onClick={goBack}>
                ATGAL
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignOnForm;
