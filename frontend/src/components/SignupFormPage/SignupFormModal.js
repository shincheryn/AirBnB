import React, { useContext } from 'react';
import { ModalContext } from '../../context/Modal';
import SignupFormPage from './index';

const SignupFormModal = () => {
  const { setModalContent } = useContext(ModalContext)

  const closeModal = () => {
    setModalContent(null);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <SignupFormPage onClose={closeModal} />
      </div>
    </div>
  );
}

export default SignupFormModal;
