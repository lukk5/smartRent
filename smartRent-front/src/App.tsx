import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from "./auth/signInForm";
import SignOnForm from "./auth/signOnForm";
import DashBoard from "./pages/dashBoard";
import { UserAuthResponse } from "./models/userAuthModel";
import { User } from "./models/userModel";
import ResponsiveAppBar from "./main-page/responsiveAppBar";
import Documents from "./pages/documents";
import BillComponent from "./pages/components/bills/billComponent";
import Messages from "./pages/messages";
import Profile from "./pages/profile";
import { RentObjectForNavBar } from "./models/rentObjectModel";
import { getRentObjectForNavBarByUserId } from "./service/rentObjectService";
import RentObjectComponent from "./pages/components/rentObject/rentObjectComponent";
import RentObjectForm from "./pages/components/rentObject/rentObjectForm";
import BillForm from "./pages/components/bills/billForm";

function App() {
  const [user, setUser] = useState<User | any>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [rentObjects, setRentObjects] = useState<RentObjectForNavBar[]>();
  const [rentObject, setRentObject] = useState<RentObjectForNavBar>();
  const [meniuItems, setMeniuItems] = useState<string[]>([""]);

  useEffect(()=> {
    let storage = window.localStorage.getItem("user");

    if(storage === null) return;

    setUser(JSON.parse(storage));
    
    if(!loginSuccess) setLoginSuccess(true);
  },[])

  const cacheUser = (user: User | undefined) => {
    if (typeof user === "undefined" || user === null) return;

    let userString: string = JSON.stringify(user);

    const existingUser = window.localStorage.getItem("user");

    if (existingUser !== null && existingUser !== undefined) {
      localStorage.removeItem("user");
    }

    window.localStorage.setItem("user", userString);

    setUser(user);

    if (user !== undefined) {
      loadRentObjectsByUser();
    }
  };

  const loadRentObjectsByUser = async () => {
    try {
      const data = await getRentObjectForNavBarByUserId(user.id);

      if (data !== null && data !== undefined) {
        setRentObjects(data);
      }

      window.localStorage.setItem("rentObjects", JSON.stringify(data));
    } catch (error: any) {

    }
  };

  const cacheToken = (auth: UserAuthResponse) => {
    if (typeof auth === "undefined" || auth === null) return;

    const existingAuth = window.localStorage.getItem("token");

    if (existingAuth !== null && existingAuth !== undefined) {
      localStorage.removeItem("token");
    }

    window.localStorage.setItem("token", auth.token);
  };

  const handleUserUpdate = (user: User) => {
    window.localStorage.removeItem("user");
    cacheUser(user);
  };

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
  };

  const logOut = () => {
    window.localStorage.clear();
    setLoginSuccess(false);
  };

  const reloadRentObject = () => {
    const rentObjectsString = window.localStorage.getItem("rentObjects");

    if (rentObjectsString === null) return;
    setRentObjects(JSON.parse(rentObjectsString));
    const objects: RentObjectForNavBar[] = JSON.parse(rentObjectsString);
    setRentObjects(objects);
    setMeniu(objects);
    setRentObject(objects[0]);
  };

  const handleRentObjectChange = (rentObject: RentObjectForNavBar) => {
    setRentObject(rentObject);
    const rentObjectString = window.localStorage.getItem("rentObject");

    if (rentObjectString !== null) {
      window.localStorage.removeItem("rentObject");
    }

    window.localStorage.setItem("rentObject", JSON.stringify(rentObject));
  };


  const setMeniu = (items: RentObjectForNavBar[]) => {

    let itemsForMeniu: string[] = [];

    items.forEach((item) => {
      itemsForMeniu.push(item.name);
    });

    setMeniuItems(itemsForMeniu);
  };

  return (
    <BrowserRouter>
      {loginSuccess ? (
        <ResponsiveAppBar
          logOut={logOut}
          meniuItems={meniuItems}
          rentObjects={rentObjects}
          handleRentObjectChange={handleRentObjectChange}
          user={user}
        />
      ) : (
        <></>
      )}
      <Routes>
        {user == null || typeof user === "undefined" ? (  <Route
          path="/"
          element={
            <SignInForm
              setUser={setUser}
              cacheUser={cacheUser}
              cacheToken={cacheToken}
              loginSuccess={handleLoginSuccess}
            />
          }
        />) : (<></>)}
        <Route path="/signOn" element={<SignOnForm />} />
        <Route
          path="/documents"
          element={<Documents user={user} rentObject={rentObject} />}
        />
        <Route
          path="/home"
          element={
            <DashBoard
              user={user}
              updateLoginSucces={handleLoginSuccess}
              reloadRentObject={reloadRentObject}
            />
          }
        />
        <Route
          path="/bills"
          element={<BillComponent user={user} updateLoginSucces={handleLoginSuccess} />}
        />
        <Route
          path="/messages"
          element={
            <Messages user={user} updateLoginSucces={handleLoginSuccess} />
          }
        />
        <Route 
          path="/rentObjects"
          element={<RentObjectComponent user={user} updateLoginSucces={handleLoginSuccess}/>}
          />
        <Route
          path="/tenants"
          element={<></>}
          />
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              updateLoginSucces={handleLoginSuccess}
              updateUser={handleUserUpdate}
              logOut={logOut}
            />
          }
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
        <Route
        path="rentObjects/:id"
        element={<RentObjectForm user={user}/>}/>
        <Route
        path="bills/:id"
        element={<BillForm user={user}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
