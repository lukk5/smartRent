import { useEffect, useState } from "react";
import { DocumentListItem, DocumentProps } from "../models/documentModel";
import { RentObjectForNavBar } from "../models/rentObjectModel";
import { User, UserProp } from "../models/userModel";
import { getDocumentsForList } from "../service/documentService";

const Documents: React.FC<DocumentProps> = (props) => {
  const [documentList, setDocumentList] = useState<DocumentListItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [errorOccur, setErrorOccur] = useState<boolean>(false);
  const [rentObject, setRentObject] = useState<RentObjectForNavBar | undefined>(
    props.rentObject
  );
  const [user, setUser] = useState<User>(props.user);

  useEffect(() => {
    loadUserIfNotExist();
  }, []);

  const loadUserIfNotExist = () => {
    const userString = window.localStorage.getItem("user");

    if (userString === null) return;

    setUser(JSON.parse(userString));
  };

  const fetchData = async () => {
    try {
      if (rentObject === null || rentObject === undefined) {
        throw new Error("Rent object not exists.");
      }

      const data = await getDocumentsForList(rentObject.id);

      setDataLoaded(true);
      setErrorOccur(false);
    } catch (error: any) {
      setDataLoaded(false);
      setErrorOccur(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataLoaded]);

  return (
    <main style={{ padding: "1rem" }}>
      <p>Documents!</p>
    </main>
  );
};

export default Documents;
