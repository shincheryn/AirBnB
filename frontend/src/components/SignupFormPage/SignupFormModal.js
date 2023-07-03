import React from 'react';
import SignupFormPage from '.';

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
