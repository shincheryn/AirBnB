import React, { useContext } from 'react';
import { ModalContext } from '../../context/Modal';
import LoginFormPage from './index';

function LoginFormModal() {
  const { setModalContent } = useContext(ModalContext);

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <LoginFormPage onClose={closeModal} />
      </div>
    </div>
  );
}

export default LoginFormModal;
