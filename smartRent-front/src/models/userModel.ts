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
};

export interface LoginProp {
  setUser: (user: User) => void;
  cacheUser: (user: User) => void;
  cacheToken: (auth: UserAuthResponse) => void;
}