import { User } from "./userModel";

export type UserAuthResponse = {
  token: string;
  tokenExpirationTime: Number;
  id: string;
  userType: string;
};

export type LoginUserBody = {
    nickName: string;
    password: string;
}

export type RegisterUserBody = {
  nickName: string;
  email: string;
  firstName: string;
  password: string;
  lastName: string;
  phone: string;
  isLandLord: boolean;
};



