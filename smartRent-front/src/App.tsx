
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from "./auth/signInForm";
import SignOnForm from "./auth/signOnForm";
import DashBoard from "./pages/dashBoard";
import { UserAuthResponse } from "./models/userAuthModel";
import { User } from "./models/userModel";
import  ResponsiveAppBar from "./main-page/responsiveAppBar";
import Documents from "./pages/documents";
import Bills from "./pages/bills";
import Messages from "./pages/messages";
import Profile from "./pages/profile";

function App() {
  
  const [user, setUser] = useState<User | any>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const cacheUser = (user : User | undefined) => {

    if(typeof(user) === "undefined" || user === null) return;

    let userString : string = JSON.stringify(user);

    const existingUser = window.localStorage.getItem("user");

    if(existingUser !== null && existingUser !== undefined)
    {
      localStorage.removeItem("user");
    }

    window.localStorage.setItem("user", userString);
  };

  const cacheToken = (auth: UserAuthResponse) => {

    if(typeof(auth) === "undefined" || auth === null) return;

    const existingAuth = window.localStorage.getItem("token");

    if(existingAuth !== null && existingAuth !== undefined)
    {
      localStorage.removeItem("token");
    }

    window.localStorage.setItem("token", auth.token);
  };

  const handleUserUpdate = (user: User) => 
  {
    window.localStorage.removeItem("user");
    cacheUser(user);
  };

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
  }

  const logOut = () => {
    window.localStorage.clear();
    setLoginSuccess(false);
  };

  return (
    <BrowserRouter>
      {loginSuccess ? (<ResponsiveAppBar logOut={logOut}/>) : (<></>)}
      <Routes>
        <Route path="/" element={<SignInForm setUser={setUser} cacheUser={cacheUser} cacheToken={cacheToken} loginSuccess={handleLoginSuccess}/>} />
        <Route path="/signOn" element={<SignOnForm />} />
        <Route path="/documents" element={ <Documents user={user} updateLoginSucces={handleLoginSuccess}/> }/>
        <Route path="/home" element={< DashBoard user={user} updateLoginSucces={handleLoginSuccess}/>} />
        <Route path="/bills" element={<Bills user={user} updateLoginSucces={handleLoginSuccess}/>} />
        <Route path="/messages" element={<Messages user={user} updateLoginSucces={handleLoginSuccess}/>} />
        <Route path="/profile" element={<Profile user={user} updateLoginSucces={handleLoginSuccess} updateUser={handleUserUpdate} logOut={logOut}/>} />
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
