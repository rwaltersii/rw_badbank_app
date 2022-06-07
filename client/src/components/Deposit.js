// Imported React Modules
import React, { useState, useContext, useEffect } from "react";
import { UserID } from "../App";

const Deposit = () => {
  //This is the id of the user from the App component - shared by useContext Hook (id of currently logged in user)
  const idOfUser = useContext(UserID);

  //List of form variables and function to control their state values
  const [depositAmount, setDepositAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  //This controls whether to show the input form or the Make another deposit message
  const [show, setShow] = useState(true);

  //Get the balance of the currently logged in user by their id
  const getBalance = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/accountbalance/${idOfUser}`
      );
      const jsonData = await response.json();

      setCurrentBalance(jsonData);
    } catch (err) {
      console.log(err.message);
    }
  };

  //The will only run once when the app mounts (calls the function to get the database balance)
  useEffect(() => {
    getBalance();
  }, []);

  //Function that controls the amount deposited by the user and updates the database table-
  const submitHandler = async (event) => {
    //Prevents the page from reloading when the function is called
    event.preventDefault();
    //Calculates the new balance and sets the new value to the current balance
    let newBalance = Number(currentBalance) + Number(depositAmount);
    setCurrentBalance(newBalance);
    //Use the id of the user's account to update the balance in the database
    console.log("Writing to the Database...");
    console.log(idOfUser, newBalance);
    try {
      const body = { newBalance, idOfUser };
      const response = await fetch(
        `/updatebalance/${idOfUser}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      ).then(() => {
        console.log("Write Complete");
      });
    } catch (err) {
      console.log(err.message);
    }
    setShow(false);
  };

  //Function controls the Deposit amount the user inputs-
  const handleDepositAmountChange = (event) => {
    const amount = event.target.value;
    //Checks if the user tries to enter a negitive value
    let firstCharacter = event.target.value.charAt(0);
    if (firstCharacter === "-") {
      return alert("Deposit amount cannot be negitive. Please try again.");
    }
    //This code prevents the user from entering characters that are not numbers..
    //no more than two decimal places - then sets the State of the Deposit Amount
    if (amount.match(/^\d*(\.\d{0,2})?$/)) {
      setDepositAmount(amount);
    }
  };

  //Function to reset the input field back to default (blank)
  const resetFields = () => {
    setDepositAmount("");
    setShow(true);
  };

  return (
    <div>
      {show ? (
        <div className="container">
          <div className="card" style={{ maxWidth: 540 + "px" }}>
            <div className="card-header">Deposit</div>

            <div className="card-body ">
              <div className="mb-3">
                <p>{`Account Balance: $${currentBalance.toFixed(2)}`}</p>
              </div>

              <div className="mb-3">
                <label className="form-label">Deposit Amount:</label>
                <input
                  style={{ maxWidth: 125 + "px" }}
                  type="text"
                  placeholder="0.00"
                  min=".01"
                  step="0.01"
                  className="form-control"
                  id="exampleInputDeposit1"
                  aria-describedby="depositHelp"
                  onChange={handleDepositAmountChange}
                  value={depositAmount}
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                //The deposit button is desabled if the deposit amount is equal to zero
                disabled={depositAmount === ""}
                onClick={submitHandler}
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="card" style={{ maxWidth: 540 + "px" }}>
            <div className="card-header">Deposit</div>
            <div className="card-text mt-3">
              <p>{`Updated Account Balance: $${currentBalance.toFixed(2)}`}</p>
              <p>Success! Deposit was received. Thank you.</p>
            </div>
            <div className="card-body ">
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={resetFields}
              >
                Make another Deposit?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;
