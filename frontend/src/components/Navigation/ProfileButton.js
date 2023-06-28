// frontend/src/components/Navigation/ProfileButton.js
import React from 'react';

function ProfileButton({ user }) {
  return (
    <div>
      {/* Add your desired Font Awesome user icon */}
      <i className="fas fa-user"></i>
      {/* You can also include the user's name */}
      <span>{user.username}</span>
    </div>
  );
}

export default ProfileButton;
