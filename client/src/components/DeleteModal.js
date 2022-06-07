import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = (props) => {
  const [show, setShow] = useState(props.show);
  const handleClose = () => setShow(false);
  //If the isopen state is false; do not show the modal
  console.log("Delete Modal Status:", props.show);
  if (!props.show) {
    console.log("Right after IF");
    return null;
  }
  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this account?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default DeleteModal;
