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
import {
  isEmail,
  isPassword,
  isPasswordMatch,
  isPhone,
} from "../utils/validator";

const SignOnForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [regOccur, setRegOccur] = useState<boolean>(false);
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

  const submitReg = async () => {
    try {
      if (!validateSubmit()) return;

      const isLandLord: boolean = userType === "landLord";

      const user: RegisterUserBody = {
        nickName: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        isLandLord: isLandLord,
      };
      setRegOccur(true);

      await register(user);

      setRegError(false);

      await timeout(4000);
      goBack();
    } catch (error) {
      setRegError(true);
      await timeout(4000);
      setRegOccur(false);
      setRegError(false);
    }
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const goBack = () => {
    navigate("/");
  };

  const validateSubmit = (): boolean => {
    let result = true;

    if (username === "") {
      setNickNameHasError(true);
      setNickNameError("Laukas negali b??ti tu????ias");
      result = false;
    }

    if (firstName === "") {
      setFirstNameHasError(true);
      setNameError("Laukas negali b??ti tu????ias.");
      result = false;
    }

    if (lastName === "") {
      setLastNameHasError(true);
      setLastNameError("Laukas negali b??ti tu????ias.");
      result = false;
    }

    if (phone === "") {
      setPhoneHasError(true);
      setPhoneError("Laukas negali b??ti tu????ias.");
      result = false;
    }

    if (email === "") {
      setEmailHasError(true);
      setEmailError("Laukas negali b??ti tu????ias.");
      result = false;
    }

    if (password === "") {
      setPasswordHasError(true);
      setPasswordError("Laukas negali b??ti tu????ias.");
      result = false;
    }
    return result;
  };

  const validate = (property: string) => {
    switch (property) {
      case "email":
        if (email !== "") {
          if (!isEmail(email)) {
            setEmailHasError(true);
            setEmailError("Blogas el.pa??to adresas");
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
              "Blogai ??vestas slapta??odis. Slapta??odis turi b??ti nuo 6 iki 20 simboli?? ir tur??ti bent 1 raid??, skai??i?? ir simbol??."
            );
          }
        } else {
          setPasswordHasError(false);
          setPasswordError("");
        }
        break;
      case "nickname":
        setNickNameError("");
        setNickNameHasError(false);

        break;
      case "repeatpassword":
        if (repeatPassword !== "") {
          if (!isPasswordMatch(password, repeatPassword)) {
            setPasswordHasError(true);
            setPasswordError("Nesutampa slapta??od??iai.");
          }
        }

        break;
      case "lastName":
        setLastNameError("");
        setLastNameHasError(false);

        break;
      case "firstName":
        setNameError("");
        setFirstNameHasError(false);

        break;
      case "phone":
        if (phone !== "") {
          if (!isPhone(phone)) {
            setPhoneHasError(true);
            setPhoneError("Blogai ??vestas telefono numeris.");
          }
        } else {
          setPhoneHasError(false);
          setPhoneError("");
        }
        break;
    }
  };

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
              {regError === true && regOccur === true ? (
                <Alert severity="error">Registracija nes??kminga</Alert>
              ) : (
                <></>
              )}
              {regError === false && regOccur === true? (
                <Alert severity="success">Registracija s??kminga</Alert>
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
                placeholder="Pavard??"
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
                placeholder="El.pa??tas"
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
                onBlur={() => {
                  validate("phone");
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="password"
                placeholder="Slapta??odis"
                type={"password"}
                value={password}
                onChange={onChangeField}
                error={passwordHasError}
                helperText={passwordError}
                onBlur={() => {
                  validate("password");
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="repeatpassword"
                placeholder="Pakartoti slapta??od??"
                type={"password"}
                value={repeatPassword}
                onChange={onChangeField}
                onBlur={() => {
                  validate("repeatpassword");
                }}
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
              <Button
                variant="contained"
                onClick={submitReg}
                style={{ width: 150 }}
              >
                REGISTRUOTIS
              </Button>
            </Grid>
            <Grid item xs={6} md={4}>
              <Button
                variant="contained"
                onClick={goBack}
                style={{ width: 150 }}
              >
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
