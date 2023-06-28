import React from 'react';
import { useHistory } from 'react-router-dom';

const OpenModalMenuItem = ({ itemText, itemPath }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(itemPath);
  };

  return (
    <button onClick={handleClick}>{itemText}</button>
  );
};

export default OpenModalMenuItem;
