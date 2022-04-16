
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInForm from "./auth/signInForm";
import SignOnForm from "./auth/signOnForm";
import DashBoard from "./main-page/dashBoard";
import { UserAuthResponse } from "./models/userAuthModel";
import { User } from "./models/userModel";

function App() {
  
  const [user, setUser] = useState<User | any>();

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


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<App />} />
        <Route path="/" element={<SignInForm setUser={setUser} cacheUser={cacheUser} cacheToken={cacheToken}/>} />
        <Route path="/signOn" element={<SignOnForm />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
        <Route path="/dashBoard" element={<DashBoard user={user}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
