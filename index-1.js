const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//MIDDLEWARE
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//INSERT INTO a record into a table
app.post("/createaccount", async (req, res) => {
  try {
    const { fullName, emailAddress, passwordValue } = req.body;
    const newAccount = await pool.query(
      //The below is a straight postgres database call
      "INSERT INTO rw_badbank_table_01 (name, email, password) VALUES($1, $2, $3)",
      [fullName, emailAddress, passwordValue]
    );
    res.json();
  } catch (err) {
    console.error(err.message);
  }
});

//SELECT all the account records from the table
app.get("/createaccount", async (req, res) => {
  try {
    const allAccounts = await pool.query(
      "SELECT * FROM rw_badbank_table_01 ORDER BY name"
    );
    res.json(allAccounts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//SELECT a specific record based on the id
app.get("/createaccount/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const account = await pool.query(
      "SELECT * FROM rw_badbank_table_01 WHERE id = $1",
      [id]
    );
    res.json(account.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//SELECT a specific balance from a record based on the id
app.get("/accountbalance/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const account = await pool.query(
      "SELECT * FROM rw_badbank_table_01 WHERE id = $1",
      [id]
    );
    res.json(account.rows[0].balance);
  } catch (err) {
    console.error(err.message);
  }
});

//UPDATE a specific record based on the id
app.put("/updatebalance/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { newBalance } = req.body;
    const updateBalance = await pool.query(
      "UPDATE rw_badbank_table_01 SET balance = $1 WHERE id = $2",
      [newBalance, id]
    );

    res.json("Balance was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//DELETE a specific record based on the id
app.delete("/deleteaccount/:id", async (req, res) => {
  try {
    const {id}  = req.params;
    const deleteAccount = await pool.query(
      "DELETE FROM rw_badbank_table_01 WHERE id = $1",
      [id]
    );
    res.json("Account was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

//Listening on the port
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
