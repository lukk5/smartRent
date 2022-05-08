import { RentObjectForNavBar } from "./rentObjectModel";
import { User } from "./userModel";

export type DocumentListItem = {
  id: string;
  name: string;
  date: string;
};

export type Document = {
  id: string;
  name: string;
  title: string;
  content: ArrayBuffer;
};

export type DocumentProps = {
  rentObject?: RentObjectForNavBar;
  user: User;  
}
