// Imported React Modules
import React, { useState, useContext, useEffect } from "react";
import { UserID } from "../App";

const Withdraw = () => {
  //This is the id of the user from the App component - shared by useContext Hook (id of currently logged in user)
  const idOfUser = useContext(UserID);

  //List of form variables to control their state values
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  //This controls whether to show the input form or the Make another withdraw message
  const [show, setShow] = useState(true);

  //Get the balance of the currently logged in user by their id
  const getBalance = async () => {
    try {
      const response = await fetch(
        `/accountbalance/${idOfUser}`
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

  //Function that controls the amount withdrawn by the user and updates the database table-
  const submitHandler = async (event) => {
    event.preventDefault();
    //Calculates the new balance and sets the new value to the current balance
    let newBalance = Number(currentBalance) - Number(withdrawAmount);
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

  //Function controls the Deposit user input-
  const handleWithdrawAmountChange = (event) => {
    const amount = event.target.value;
    const formatedBalance = currentBalance.toFixed(2);
    //Checks if the user tries to enter a negitive value and if the withdraw amount is over the current balance
    let firstCharacter = event.target.value.charAt(0);
    if (firstCharacter === "-") {
      return alert("Withdraw amount cannot be negitive. Please try again.");
    } else if (event.target.value > currentBalance) {
      return alert(
        `Withdraw amount exceeds balance of $${formatedBalance} . Please reduce withdraw amount to less than or equal to your current balance.`
      );
    }
    if (amount.match(/^\d*(\.\d{0,2})?$/)) {
      setWithdrawAmount(amount);
    }
  };

  //Function to reset all the input fields back to their defaults
  const resetFields = () => {
    setWithdrawAmount("");
    setShow(true);
  };

  return (
    <div>
      {show ? (
        <div className="container">
          <div className="card" style={{ maxWidth: 540 + "px" }}>
            <div className="card-header">Withdraws</div>

            <div className="card-body ">
              <div className="mb-3">
                <p>{`Account Balance: $${currentBalance.toFixed(2)}`}</p>
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputWithdraw1" className="form-label">
                  Withdraw Amount:
                </label>
                <input
                  style={{ maxWidth: 125 + "px" }}
                  type="text"
                  placeholder="0.00"
                  min=".01"
                  step="0.01"
                  className="form-control"
                  id="exampleInputWithdraw1"
                  aria-describedby="withdrawHelp"
                  onChange={handleWithdrawAmountChange}
                  value={withdrawAmount}
                />
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                //The deposit button is desabled if the deposit amount is equal to zero
                disabled={withdrawAmount === ""}
                onClick={submitHandler}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="card" style={{ maxWidth: 540 + "px" }}>
            <div className="card-header">Withdraw</div>
            <div className="card-text mt-3">
              <p>{`Updated Account Balance: $${currentBalance.toFixed(2)}`}</p>
              <p>Success! Withdraw was received. Thank you.</p>
            </div>
            <div className="card-body ">
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={resetFields}
              >
                Make another Withdraw?
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
