import { useEffect, useState } from "react";
import { User, UserProp } from "../models/userModel";

const DashBoard: React.FC<UserProp> = (props) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    loadUserIfNotExist();
  }, []);

  const getDashBoardData = () => {
  };

  const loadUserIfNotExist = () => {
    if (user !== undefined) return;

    const userString = window.localStorage.getItem("user");

    if (userString === null) throw Error("User not exist in local storage.");

    let userr = JSON.parse(userString);

    setUser(userr);
    props.updateLoginSucces();

    if(props.reloadRentObject !== undefined)
    {
      props.reloadRentObject();
    }

  };

  getDashBoardData();


  const returnTenantBoard = () => {
    return <></>;
  };


  const returnLandLordBoard = () => {
    return <></>;
  };

  getDashBoardData();

  if (user?.userType === "landLord") {
    return returnLandLordBoard();
  } else {
    return returnTenantBoard();
  }
};

export default DashBoard;
