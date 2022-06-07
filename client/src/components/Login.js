// Imported React Modules
import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

// Imported Styles
import "./Login.css";

export const AllUsers = createContext();

const Login = (props) => {
  //This sets a variable to the function useNavigate(); When the user clicks the login button
  //if sucessful; the user is redirected to the home page- This is done in the loginHandler function-
  //This can be used in other locations and can direct to other pages-
  const navigate = useNavigate();

  //Get all the records in the account table and set users
  const [users, setUsers] = useState([]);

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

  //This controls the screen displayed if the username and password is not found
  const [showNotFound, setShowNotFound] = useState(false);
  //
  //This is used to search for the account by the name and password the user provided
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  //
  //Function that controls the form submission for LOGIN-
  const loginHandler = (event) => {
    //This prevents the page from reloading
    event.preventDefault();

    let usersID = "";
    let showNotFoundValue = true;
    let userLoginValue = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].name == name && users[i].password == password) {
        usersID = users[i].id;
        showNotFoundValue = false;
        userLoginValue = true;
        props.userLogin(userLoginValue);
        props.userid(usersID);
        navigate("/");
        break;
      }
    }
    showNotFoundValue ? setShowNotFound(true) : setShowNotFound(false);
  };
  //
  //Function controls the NAME from user input-
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  //
  //Function controls the PASSWORD from user input-
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  //
  //Function to reset the name and password fields if an account is not found (Try Again Button)
  const clearForm = () => {
    setName("");
    setPassword("");
    setShowNotFound(false);
  };
  //
  //Function that allows the user to login as Peter Parker if they don't already have an account
  const demoLogin = (event) => {
    //This prevents the page from reloading
    event.preventDefault();
    //
    let usersID = 1;
    let showNotFoundValue = false;
    let userLoginValue = true;
    props.userLogin(userLoginValue);
    props.userid(usersID);
    navigate("/");
    showNotFoundValue ? setShowNotFound(true) : setShowNotFound(false);
  };

  return (
    <div>
      {!showNotFound ? (
        <div className="container">
          <div className="card" style={{ maxWidth: 540 + "px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="bankicon.jpg"
                  className="img-fluid rounded-start"
                  alt="RW Bad Bank"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">RW Bad Bank</h5>
                  <p className="card-text">For all your banking needs.</p>
                  <p className="card-text demo-button-text">
                    <small className="text-muted">
                      Please Login to continue.
                    </small>
                  </p>
                  <p className="card-text demo-button-text">
                    <small className="text-muted">
                      Use the "Demo" button to enter as Peter Parker.
                    </small>
                  </p>
                </div>
              </div>
            </div>

            <div className="card-header">Login</div>
            <div className="card-body ">
              <div className="mb-3">
                <label className="form-label">Account Name:</label>
                <input
                  style={{ maxWidth: 250 + "px" }}
                  type="text"
                  className="form-control"
                  id="exampleInputName2"
                  aria-describedby="depositHelp"
                  onChange={handleNameChange}
                  value={name}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                  style={{ maxWidth: 125 + "px" }}
                  type="password"
                  className="form-control"
                  id="exampleInputPassword2"
                  aria-describedby="passwordHelp"
                  onChange={handlePasswordChange}
                  value={password}
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                //The login button is desabled if all the input fields are empty
                disabled={!name && !password}
                onClick={loginHandler}
              >
                Login
              </button>
              <button
                type="submit"
                className="btn btn-secondary demo-button"
                //The Demo button is always active-
                disabled={false}
                onClick={demoLogin}
              >
                Demo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="card" style={{ maxWidth: 540 + "px" }}>
            <div className="card-header">Login Error</div>
            <div className="card-text mt-3">
              <p>
                Sorry, no account was found for the Name and Password provided.
              </p>
            </div>
            <div className="card-body ">
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
