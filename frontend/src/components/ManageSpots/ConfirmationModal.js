import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ title, message, onAction }) => {
  const handleConfirm = () => {
    onAction(true);
  };

  const handleCancel = () => {
    onAction(false);
  };

  return (
    <div className="confirmation-modal">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-buttons">
        <button className="confirm-button" onClick={handleConfirm}>
          Yes (Delete Review)
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
