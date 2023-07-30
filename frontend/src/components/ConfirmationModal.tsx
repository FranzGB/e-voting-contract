import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface IConfirmationModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  message: string;
}
const ConfirmationModal: React.FunctionComponent<IConfirmationModalProps> = ({
  show,
  handleClose,
  handleSubmit,
  message,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header className="bg-dark" closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark">
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer className="bg-dark">
        <Button
          variant="primary"
          onClick={() => {
            handleSubmit();
            handleClose();
          }}
        >
          Yes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
