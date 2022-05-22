import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignInForm from "./auth/signInForm";
import SignOnForm from "./auth/signOnForm";
import DashBoard from "./pages/dashBoard";
import { UserAuthResponse } from "./models/userAuthModel";
import { User } from "./models/userModel";
import ResponsiveAppBar from "./main-page/responsiveAppBar";
import DocumentComponent from "./pages/components/documents/documentComponent";
import BillComponent from "./pages/components/bills/billComponent";
import Profile from "./pages/profile";
import { RentObject, RentObjectForNavBar } from "./models/rentObjectModel";
import { getRentObjectForNavBarByUserId } from "./service/rentObjectService";
import RentObjectComponent from "./pages/components/rentObject/rentObjectComponent";
import RentObjectForm from "./pages/components/rentObject/rentObjectForm";
import BillForm from "./pages/components/bills/billForm";
import DocumentForm from "./pages/components/documents/documentForm";

function App() {
  const [user, setUser] = useState<User | any>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [rentObject, setRentObject] = useState<RentObject>();

  useEffect(() => {
    let storage = window.localStorage.getItem("user");

    if (storage === null) return;

    setUser(JSON.parse(storage));

    if (!loginSuccess) setLoginSuccess(true);
  }, []);

  const cacheUser = (user: User | undefined) => {
    if (typeof user === "undefined" || user === null) return;

    let userString: string = JSON.stringify(user);

    const existingUser = window.localStorage.getItem("user");

    if (existingUser !== null && existingUser !== undefined) {
      localStorage.removeItem("user");
    }

    window.localStorage.setItem("user", userString);

    setUser(user);
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

  const handleRentObjectChange = (rentObject: RentObject) => {
    setRentObject(rentObject);
  };

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
  };

  const logOut = () => {
    window.localStorage.clear();
    setLoginSuccess(false);
  };

  return (
    <BrowserRouter>
      {loginSuccess ? <ResponsiveAppBar logOut={logOut} user={user} handleRentObjectChange={handleRentObjectChange}/> : <></>}
      <Routes>
        {user == null || typeof user === "undefined" ? (
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
        ) : (
          <></>
        )}
        <Route path="/signOn" element={<SignOnForm />} />
        <Route path="/documents" element={<DocumentComponent user={user} targetRentObject={rentObject} />} />
        <Route
          path="/home"
          element={
            <DashBoard user={user} updateLoginSucces={handleLoginSuccess} targetRentObject={rentObject}/>
          }
        />
        <Route
          path="/bills"
          element={
            <BillComponent user={user} updateLoginSucces={handleLoginSuccess} targetRentObject={rentObject}/>
          }
        />
        <Route
          path="/rentObjects"
          element={
            <RentObjectComponent
              user={user}
              updateLoginSucces={handleLoginSuccess}
            />
          }
        />
        <Route path="/tenants" element={<></>} />
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
          path="rentObjects/:id"
          element={<RentObjectForm user={user} />}
        />
        <Route path="bills/:id" element={<BillForm user={user} />} />
        <Route path="documents/:id" element={<DocumentForm user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
