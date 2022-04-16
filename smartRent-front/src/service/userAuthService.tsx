import unfetch from "unfetch";
import {
  RegisterUserBody,
  LoginUserBody,
  UserAuthResponse,
} from "../models/userAuthModel";
import { User } from "../models/userModel";
import { validationResult } from "../models/validationResul";


async function validateInDB(user: any): Promise<validationResult[]> {
  const response = await unfetch("http://localhost:27604/api/user/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user)
  });

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }

  return data as validationResult[];
}


async function authenticate(user: LoginUserBody): Promise<UserAuthResponse> {
  const response = await unfetch("http://localhost:27604/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as UserAuthResponse;
}

async function logOut(): Promise<boolean> {
  const response = await unfetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (response.status !== 200) throw new Error(data.error);

  return true;
}

async function register(user: RegisterUserBody): Promise<UserAuthResponse> {
  const response = await unfetch("http://localhost:27604/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (response.status !== 200) throw new Error(data.error);

  return data as UserAuthResponse;
}

export { authenticate, register, logOut, validateInDB };
