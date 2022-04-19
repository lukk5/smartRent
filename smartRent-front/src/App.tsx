import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from "./auth/signInForm";
import SignOnForm from "./auth/signOnForm";
import DashBoard from "./pages/dashBoard";
import { UserAuthResponse } from "./models/userAuthModel";
import { User } from "./models/userModel";
import ResponsiveAppBar from "./main-page/responsiveAppBar";
import Documents from "./pages/documents";
import Bills from "./pages/bills";
import Messages from "./pages/messages";
import Profile from "./pages/profile";
import { RentObjectForNavBar } from "./models/rentObjectModel";
import { getRentObjectForNavBarByUserId } from "./service/rentObjectService";

function App() {
  const [user, setUser] = useState<User | any>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [rentObjects, setRentObjects] = useState<RentObjectForNavBar[]>();
  const [rentObject, setRentObject] = useState<RentObjectForNavBar>();
  const [meniuItems, setMeniuItems] = useState<string[]>([""]);

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
      console.log(user);

      const data = await getRentObjectForNavBarByUserId(user.id);

      console.log(data);

      if (data !== null && data !== undefined) {
        setRentObjects(data);
      }

      window.localStorage.setItem("rentObjects", JSON.stringify(data));
    } catch (error: any) {
      console.log(error);
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

  // useEffect(() => {
  //   setMeniu();
  // }, [rentObjects]);

  const handleRentObjectChange = (rentObject: RentObjectForNavBar) => {
    setRentObject(rentObject);

    console.log("veikia");

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
        />
      ) : (
        <></>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <SignInForm
              setUser={setUser}
              cacheUser={cacheUser}
              cacheToken={cacheToken}
              loginSuccess={handleLoginSuccess}
            />
          }
        />
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
          element={<Bills user={user} updateLoginSucces={handleLoginSuccess} />}
        />
        <Route
          path="/messages"
          element={
            <Messages user={user} updateLoginSucces={handleLoginSuccess} />
          }
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
