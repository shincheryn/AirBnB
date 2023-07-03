import React from 'react';
import LoginFormPage from '.';

const LoginFormModal = ({ closeModal }) => {

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <div>
      <LoginFormPage onClose={handleModalClose} />
    </div>
  );
};

export default LoginFormModal;
