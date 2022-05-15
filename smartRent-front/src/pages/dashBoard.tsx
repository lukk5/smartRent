import { useEffect, useState } from "react";
import { User, UserProp } from "../models/userModel";
import { LandLordDashBoard } from "./components/dashBoards/landLordDashBoard";
import { TenantDashBoard } from "./components/dashBoards/tenantDashBoard";

const DashBoard: React.FC<UserProp> = (props) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    setUser(props.user);
  }, [props]);

  useEffect(()=> {
    getDashBoardData();
  }, [user]);

  const getDashBoardData = async () => {

  };

  return (<div>
    {user?.userType === "tenant" ? (<TenantDashBoard user={user} targetRentObject={props.targetRentObject} />) : (<LandLordDashBoard user={user}></LandLordDashBoard>)}
  </div>);
};

export default DashBoard;
