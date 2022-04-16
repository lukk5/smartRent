import React, { useCallback, useEffect, useState, MouseEvent } from "react";
import { authenticate } from "../service/userAuthService";
import { useNavigate } from "react-router-dom";
import { LoginUserBody } from "../models/userAuthModel";
import { User, LoginProp } from "../models/userModel";
import logo from "../image/smartRent.png";
import "../image/logo.css";
import { Button, TextField, Box, Grid, Alert } from "@mui/material";
import  getUserById  from "../service/userService";

const SignInForm: React.FC<LoginProp> = (props) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

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

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const moveToDashBoard = () => {
    navigate("/dashBoard");
  };

  const getUser = async (userId: string, landLord: boolean) : Promise<User | null> => {
      return await getUserById(userId,landLord);
  };


  setTimeout(() => {
    setLoginError(false)
  }, 5000);

  useEffect(() => {
    (async () => {
      if (canSubmit) {
        try {

          const loginUser: LoginUserBody = {
            nickName: userName,
            password: password,
          };

          const response = await authenticate(loginUser);

          props.cacheToken(response);

          setCanSubmit(false);
          setLoginSuccess(true);

          const user = await getUser(response.id, response.userType === "landLord");

          if(user === null)
          {
            throw new Error("user not exists.");
          }

          props.cacheUser(user);
          await timeout(1000);

          moveToDashBoard();
        } catch (error: any) {
          setCanSubmit(false);
          setLoginError(true);
          setLoginSuccess(false);
        }
      }
    })();
  }, [canSubmit, userName, password]);


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
            <Grid item xs={8} md={2}>
              {loginError ? (
                <Alert severity="error">Prisijungimas nesėkmingas</Alert>
              ) : (
                <></>
              )}
              {loginSuccess ? (
                <Alert severity="success">Prisijungimas sėkmingas</Alert>
              ) : ( <></>)}
            </Grid>
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
                type={visiblePassword ? "text" : "password"}
                value={password}
                onChange={onChangeField}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <Button
                variant="contained"
                type="submit"
                onClick={() => {
                  setCanSubmit(true);
                }}
              >
                Prisijungti
              </Button>
            </Grid>
            <Grid item xs={6} md={4}>
              <Button variant="contained" onClick={openRegForm}>
                Registracija
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignInForm;
