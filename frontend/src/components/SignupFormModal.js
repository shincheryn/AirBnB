import React from 'react';
import SignupFormPage from './SignupFormPage';

const SignupFormModal = ({ closeModal }) => {

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <div>
      <SignupFormPage onClose={handleModalClose} />
    </div>
  );
};

export default SignupFormModal;
