import React, { useCallback, useEffect, useState, MouseEvent } from "react";
import { authenticate } from "../service/userAuthService";
import { useNavigate } from "react-router-dom";
import { LoginUserBody } from "../models/userAuthModel";
import { User, LoginProp } from "../models/userModel";
import logo from "../image/smartRent.png";
import "../image/logo.css";
import { Button, TextField, Box, Grid, Alert } from "@mui/material";
import { getUserById } from "../service/userService";


const logInDataTenant = {
  name: "lukastestas2",
  password: "Zxcvbnm<>123"
}

const logInDataLandLord = {
  name: "lukBoss",
  password: "Zxcvbnm<>123"
}


const SignInForm: React.FC<LoginProp> = (props) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loginOccur, setLoginOccur] = useState<boolean>(false);

  const navigate = useNavigate();

  const onChangeField = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      switch (event.target.name) {
        case "nickName":
          setUserName(event.target.value);
          break;
        case "password":
          setPassword(event.target.value);
          break;
      }
    },
    []
  );

  const openRegForm = () => {
    navigate("/signOn");
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const moveToDashBoard = () => {
    navigate("/home");
  };

  const getUser = async (userId: string): Promise<User | null> => {
    return await getUserById(userId);
  };

  const loginSubmit = async () => {

    setLoginOccur(true);

    try {

      // mock user login

      const loginUser: LoginUserBody = {
        nickName: logInDataLandLord.name,
        password: logInDataLandLord.password,
      };

      // const loginUser: LoginUserBody = {
      //   nickName: userName,
      //   password: password,
      // };

      const response = await authenticate(loginUser);

      props.cacheToken(response);

      const user = await getUser(response.id);

      if (user === null) {
        throw new Error("user not exists.");
      }

      setLoginSuccess(true);

      await timeout(3000);

      props.cacheUser(user);
      props.loginSuccess();

      moveToDashBoard();
    } catch (error: any) {

      setLoginSuccess(false);

      await timeout(4000);

      setLoginOccur(false);
    }
  };

  return (
    <Box sx = {{ maxHeight: "100%" }}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ maxHeight: "100%" }}
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
            <Grid item xs={6} md={4}>
              <TextField
                name="nickName"
                placeholder="Prisijungimo vardas"
                type="text"
                value={userName}
                onChange={onChangeField}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                name="password"
                placeholder="Slaptažodis"
                type={"password"}
                value={password}
                onChange={onChangeField}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Button
                variant="contained"
                type="submit"
                onClick={loginSubmit}
                style={{ width: 150 }}
              >
                Prisijungti
              </Button>
            </Grid>
            <Grid item xs={6} md={4}>
              <Button
                variant="contained"
                onClick={openRegForm}
                style={{ width: 150 }}
              >
                Registracija
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loginOccur === true && loginSuccess === false ? (
        <Alert sx={{marginTop: 40 }} severity="error">Prisijungimas nesėkmingas</Alert>
      ) : (
        <></>
      )}
      {loginOccur === true && loginSuccess === true ? (
        <Alert sx={{marginTop: 40 }} severity="success">Prisijungimas sėkmingas</Alert>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default SignInForm;
