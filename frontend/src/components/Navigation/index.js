import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <div className="logo">
          <NavLink exact to="/">
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
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
