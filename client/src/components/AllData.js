// Imported React Modules
import React, { useState, useEffect } from "react"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
import { IconContext } from "react-icons/lib"
import { Modal, Button } from "react-bootstrap"
import EditForm from "./EditForm"

// Imported Styles
import "./AllData.css"

const AllData = () => {
  //
  //Get all the records in the account table and set users
  const [users, setUsers] = useState([])

  //Sets the id of the user if the edit or the delete icons are clicked
  const [idUser, setIdUser] = useState("")

  //Sets the Full Name, Email Address, and Password from the id
  const [arrayUser, setArrayUser] = useState([])

  //This will control the open and close of the delete confirmation modal
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  //This will control the open and close of the successful account delete modal
  const [showSuccess, setShowSuccess] = useState(false)
  const handleShowSuccess = () => setShowSuccess(true)
  const handleCloseSuccess = () => setShowSuccess(false)

  //This will control the open and close of the successful account delete modal
  const [showEdit, setShowEdit] = useState(false)
  const handleShowEdit = () => setShowEdit(true)
  const handleCloseEdit = () => setShowEdit(false)

  //List of form variables to control their state values
  const [fullName, setFullName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  //Get all the records in the array of objects
  //https://robert-walters-badbank.herokuapp.com/createaccount
  const getAccounts = async () => {
    try {
      const response = await fetch("/createaccount")
      const jsonData = await response.json()

      setUsers(jsonData)
    } catch (err) {
      console.error(err.message)
    }
  }

  //The will only run once when the app starts (it gets all the accounts located in the table)
  useEffect(() => {
    getAccounts()
  }, [])

  //When the user clicks the delete icon; the confirmation modal will show and ...
  //the id of the user is set (setIdUser)
  const deleteHandler = (id) => {
    console.log("ID to Delete:", id)
    handleShow()
    setIdUser(id)
  }

  //Delete the account if the user confirms to delete
  const deleteAccount = async (id) => {
    try {
      const deleteAccount = await fetch(`/deleteaccount/${id}`, {
        method: "GET",
      })
      console.log(`Account ${id} was Deleted`)
      //This will update the table once the account has been removed-
      setUsers(users.filter((user) => user.id !== id))
      //Close the Delete Account Modal
      handleClose()
      //Show the successful account deleted modal
      handleShowSuccess()
    } catch (err) {
      console.error(err.message)
    }
  }

  //When the user clicks the edit icon; the arrayUser is set and the editing modal will show
  const editHandler = (user) => {
    console.log("User to Edit:", user)
    setArrayUser(user)
    setIdUser(user.id)
    handleShowEdit()
  }

  //When the user clicks the Update Button; the new data is recorded to the database
  const editAccount = async () => {
    console.log("Updating the Database...")
    console.log(idUser, fullName, emailAddress, passwordValue)
    try {
      const body = { fullName, emailAddress, passwordValue, idUser }
      const response = await fetch(`/updateaccount/${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(() => {
        console.log("Update Complete")
        handleCloseEdit()
        getAccounts()
      })
    } catch (err) {
      console.log(err.message)
    }
  }

  //These three functions write the updated data to the console
  //The information is coming from the Child Component (EditForm.js)
  const fullNameCallbackFunction = (fullNameData) => {
    setFullName(fullNameData)
    console.log(fullNameData)
  }
  const emailAddressCallbackFunction = (emailAddressData) => {
    setEmailAddress(emailAddressData)
    console.log(emailAddressData)
  }
  const passwordValueCallbackFunction = (passwordValueData) => {
    setPasswordValue(passwordValueData)
    console.log(passwordValueData)
  }

  return (
    <div>
      <div className="container">
        <div className="card" style={{ maxWidth: 750 + "px" }}>
          <table className="table  table table-striped table-hover ">
            <thead className="table-light">
              <tr className="">
                <th className="th-main" colSpan="6">
                  All Data Table
                </th>
              </tr>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Full Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">Password</th>
                <th scope="col">Balance</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>${user.balance.toFixed(2)}</td>
                  <IconContext.Provider value={{ color: "darkgray" }}>
                    <td>
                      <FaEdit
                        className="editicon"
                        // This captures the full object of the account when the user clicks the edit icon
                        onClick={() => editHandler(user)}
                      />
                      <FaTrashAlt
                        className="deleteicon"
                        onClick={() => deleteHandler(user.id)}
                      />
                    </td>
                  </IconContext.Provider>
                </tr>
              ))}
            </tbody>
          </table>

          {/* This is the Delete Confirmation Modal */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you wish to delete this account?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="dark" onClick={() => deleteAccount(idUser)}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          {/* This is the Confirmation of the Delete Modal */}
          <Modal show={showSuccess} onHide={handleCloseSuccess}>
            <Modal.Header closeButton>
              <Modal.Title>Success! Account Deleted.</Modal.Title>
            </Modal.Header>

            <Modal.Footer>
              <Button variant="dark" onClick={handleCloseSuccess}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>

          {/* This is the Edit Modal */}
          <Modal show={showEdit} onHide={handleCloseEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditForm
                //This sends the array data from the Parent (AllData.js) component to the Child (EditForm.js) component-
                accountHolder={arrayUser}
                // These are the (3) callback functions that receive data from the child (EditForm.js) Component
                fullNameCallback={fullNameCallbackFunction}
                emailAddressCallback={emailAddressCallbackFunction}
                passwordValueCallback={passwordValueCallbackFunction}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="dark" onClick={editAccount}>
                Update
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default AllData
