import React from 'react';

const OpenModalButton = ({ buttonText, onButtonClick, modalComponent }) => {

  const handleClick = () => {
    onButtonClick();
  };

  return (
    <button onClick={handleClick}>{buttonText}</button>
  );
};

export default OpenModalButton;
