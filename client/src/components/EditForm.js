import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const EditForm = ({
  accountHolder,
  fullNameCallback,
  emailAddressCallback,
  passwordValueCallback,
}) => {
  //List of form variables to control their state values
  const [fullName, setFullName] = useState(accountHolder.name);
  const [emailAddress, setEmailAddress] = useState(accountHolder.email);
  const [passwordValue, setPasswordValue] = useState(accountHolder.password);

  //Function controls the Full Name user input-
  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  //Function controls the Email Address user input-
  const handleEmailAddressChange = (event) => {
    setEmailAddress(event.target.value);
  };

  //Function controls the Password user input-
  const handlePasswordValueChange = (event) => {
    setPasswordValue(event.target.value);
  };

  //These three functions return the values being entered by the user to the Parent Component (AllData.js)...
  //These are the values that will be written to the database-
  fullNameCallback(fullName);
  emailAddressCallback(emailAddress);
  passwordValueCallback(passwordValue);

  return (
    <Form>
      {/* Input for the Account Name */}
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          value={fullName}
          type="text"
          onChange={handleFullNameChange}
        />
      </Form.Group>
      {/* Input for the Email Address */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          value={emailAddress}
          type="email"
          onChange={handleEmailAddressChange}
        />
      </Form.Group>
      {/* Input for the Password */}
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          value={passwordValue}
          type="password"
          onChange={handlePasswordValueChange}
        />
      </Form.Group>
    </Form>
  );
};

export default EditForm;
