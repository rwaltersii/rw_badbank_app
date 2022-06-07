// Imported React Modules
import React, { useContext } from "react";
import { AllUsers, UserID } from "../App";

// Imported Styles
import "./Home.css";

const Home = () => {
  //This is the database table data from the App component - shared by useContext Hook
  const users = useContext(AllUsers);
  //This is the id of the user from the App component - shared by useContext Hook
  const idOfUser = useContext(UserID);
  //Get the name of the user from the id (this will be used in the welcome message)
  let userName = "";
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === idOfUser) {
      userName = users[i].name;
      break;
    }
  }
  return (
    <div className="container">
      <div className="card mb-3" style={{ maxWidth: 540 + "px" }}>
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
              <h5 className="card-title">
                Hello {userName} & Welcome to the RW Bad Bank
              </h5>
              <p className="card-text">For all your banking needs.</p>
              <p className="card-text">
                <small className="text-muted">
                  Select an option from the menu to continue.
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
