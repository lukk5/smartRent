import { RentObjectForNavBar } from "./rentObjectModel";
import { User } from "./userModel";

export type DocumentTableItem = {
  id: string;
  name: string;
  date: string;
  type: string;
  rentObjectId: string;
};

export type DocumentModel = {
  body: any;
  id: string;
  name: string;
  title: string;
  type: string;
  rentObjectId: string;
};

export type DocumentProps = {
  user: User;  
}

export type DocumentFile = {
  id: string;
  file: File;
}
