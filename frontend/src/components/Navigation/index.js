import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormModal from '../LoginFormPage/LoginFormModal';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  const handleLogoClick = () => {
    history.push('/');
    window.location.reload();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <ul>
      <li>
        <div className="logo">
          <NavLink exact to="/" onClick={handleLogoClick}>
            <i className="fa-brands fa-airbnb"></i>
            airbnb
          </NavLink>
        </div>
      </li>
      {isLoaded && sessionUser && (
        <li>
          <NavLink to="/spots/new">Create a New Spot</NavLink>
        </li>
      )}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} openModal={openModal} />
        </li>
      )}

      {showModal && <LoginFormModal closeModal={closeModal} />}
    </ul>
  );
}

export default Navigation;
