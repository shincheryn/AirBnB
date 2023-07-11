import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (onModalClose) {
      onModalClose();
      setOnModalClose(null);
    }
  };

  return (
    <ModalContext.Provider value={{ modalContent, setModalContent, setOnModalClose }}>
      {children}
      {modalContent && (
        ReactDOM.createPortal(
          <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">
              {modalContent}
            </div>
          </div>,
          modalRef.current
        )
      )}
      <div ref={modalRef} />
    </ModalContext.Provider>
  );
}
