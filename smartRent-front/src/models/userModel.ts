import { string } from "yup";
import { UserAuthResponse } from "./userAuthModel";

export type User = {
  id: string;
  name: string;
  lastName: string;
  userType: string;
  email: string;
  nickName: string;
  phone: string;
};

export interface UserProp {
  user : User | undefined;
  updateLoginSucces: ()=> void;
  updateUser?: (user: User) => void;
  logOut?: ()=> void;
};

export interface LoginProp {
  setUser: (user: User) => void;
  cacheUser: (user: User) => void;
  cacheToken: (auth: UserAuthResponse) => void;
  loginSuccess : () => void;
}

export type UserContactDetails = {
  phone: string;
  email: string;
  id?: string;
  type?: string;
}

export type UserPassword = {
  password: string;
  id?: string;
}