// Imported React Modules
import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter as BRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Imported Styles
import "./App.css";

// Imported Components
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import AllData from "./components/AllData";

//Create users context to share data in every component (works like having a global variable)
export const AllUsers = createContext();
export const UserLogged = createContext();
export const UserID = createContext();

function App() {
  //Get all the records in the account table and set users
  const [users, setUsers] = useState([]);

  //Captures the userid from the login page
  const [userId, setUserId] = useState("");

  //Get all the records in the array of objects
  const getAccounts = async () => {
    try {
      const response = await fetch("/createaccount");
      const jsonData = await response.json();

      setUsers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  //The will only run once when the app starts (it gets all the accounts located in the table)
  useEffect(() => {
    getAccounts();
  }, []);

  //Setup the login variable to control what is being displayed-
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //This sets the logged in status to true- When the users clicks the login button on the
  //login screen this function is called to change the state of the login-
  const userLogin = (userLoginValue) => {
    setIsLoggedIn(userLoginValue);
  };

  //This sets the user's id from the login screen- The id of the user is used to thoughout
  //the app to know what user is logged in-
  const userid = (id) => {
    setUserId(id);
  };

  return (
    <div>
      <AllUsers.Provider value={users}>
        <UserID.Provider value={userId}>
          <BRouter>
            <div>
              {/* if the user is logged in: show the navigation bar */}
              {isLoggedIn ? <Navbar userLogin={userLogin} /> : ""}
              <Routes>
                <Route
                  path="/"
                  // if the user is logged in: show the home component, else navigate to the login screen
                  element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                />
                <Route path="/createaccount" element={<CreateAccount />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/alldata" element={<AllData />} />
                <Route path="/redirect" element={<Navigate to="/" />} />
                <Route
                  path="/login"
                  // userLogin and userid is used to return the value of these variables to the two functions here
                  element={<Login userLogin={userLogin} userid={userid} />}
                />
              </Routes>
            </div>
          </BRouter>
        </UserID.Provider>
      </AllUsers.Provider>
    </div>
  );
}

export default App;
