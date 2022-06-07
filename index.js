const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const path = require("path")
const PORT = process.env.PORT || 5000

// PROCESS.ENV.PORT
// PROCESS.ENV.NODE_ENV => PRODUCTION OR UNDEFINED

//MIDDLEWARE
app.use(cors())
app.use(express.json()) //req.body

if (process.env.NODE_ENV === "production") {
  //SERVER STATIC CONTENT
  //NPM RUN BUILD
  app.use(express.static(path.join(__dirname, "client/build")))
}

//ROUTES//

//INSERT INTO a new record into the table
app.post("/createaccount", async (req, res) => {
  try {
    const { fullName, emailAddress, passwordValue } = req.body
    const newAccount = await pool.query(
      //The below is a straight postgres database call
      "INSERT INTO rw_badbank_table_01 (name, email, password) VALUES($1, $2, $3)",
      [fullName, emailAddress, passwordValue]
    )
    res.json()
  } catch (err) {
    console.error(err.message)
  }
})

//SELECT all the account records from the table
app.get("/createaccount", async (req, res) => {
  try {
    const allAccounts = await pool.query(
      "SELECT * FROM rw_badbank_table_01 ORDER BY name"
    )
    res.json(allAccounts.rows)
  } catch (err) {
    console.error(err.message)
  }
})

//SELECT a specific record based on the id
app.get("/createaccount/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const account = await pool.query(
      "SELECT * FROM rw_badbank_table_01 WHERE id = $1",
      [id]
    )
    res.json(account.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//SELECT a specific balance from a record based on the id (response with only the balance)
app.get("/accountbalance/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const account = await pool.query(
      "SELECT * FROM rw_badbank_table_01 WHERE id = $1",
      [id]
    )
    res.json(account.rows[0].balance)
  } catch (err) {
    console.error(err.message)
  }
})

//UPDATE the BALANCE of a specific record based on the id
app.put("/updatebalance/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { newBalance } = req.body
    const updateBalance = await pool.query(
      "UPDATE rw_badbank_table_01 SET balance = $1 WHERE id = $2",
      [newBalance, id]
    )
    res.json("Balance was updated!")
  } catch (err) {
    console.error(err.message)
  }
})

//UPDATE the NAME, EMAIL, PASSWORD of a specific record based on the id
app.put("/updateaccount/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { fullName, emailAddress, passwordValue } = req.body
    const updateAccount = await pool.query(
      "UPDATE rw_badbank_table_01 SET name = $1, email = $2, password = $3 WHERE id = $4",
      [fullName, emailAddress, passwordValue, id]
    )
    res.json("Account was updated!")
  } catch (err) {
    console.error(err.message)
  }
})

//DELETE a specific record based on the id
app.get("/deleteaccount/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deleteAccount = await pool.query(
      "DELETE FROM rw_badbank_table_01 WHERE id = $1",
      [id]
    )
    res.json("Account was deleted!")
  } catch (err) {
    console.log(err.message)
  }
})

//This will redirect users if they type in anything other than a valid address
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"))
})

//Listening on the port
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})
