import React from 'react';
import SignupFormPage from './index';

const SignupFormModal = ({ onClose }) => {
  const handleModalClose = () => {
    onClose();
  };

  return (
    <div>
      <SignupFormPage onClose={handleModalClose} />
    </div>
  );
};

export default SignupFormModal;
