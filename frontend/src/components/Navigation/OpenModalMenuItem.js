// frontend/src/components/Navigation/OpenModalMenuItem.js
import React from 'react';
import { ModalContext } from '../../context/Modal';

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const modalContext = React.useContext(ModalContext);

  const onClick = () => {
    if (onModalClose) modalContext.setOnModalClose(onModalClose);
    modalContext.setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <li onClick={onClick}>{itemText}</li>
  );
}

export default OpenModalMenuItem;
