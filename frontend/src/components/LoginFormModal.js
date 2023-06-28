import React from 'react';
import LoginFormPage from './LoginFormPage';

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
