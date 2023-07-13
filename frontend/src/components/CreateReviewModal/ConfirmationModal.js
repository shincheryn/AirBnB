import React from 'react';

const ConfirmationModal = ({ title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <h3>{title}</h3>
      <p>{message}</p>
      <button className="confirm-button" onClick={onConfirm}>
        {confirmText}
      </button>
      <button className="cancel-button" onClick={onCancel}>
        {cancelText}
      </button>
    </div>
  );
};

export default ConfirmationModal;
