import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { ModalContext } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormPage({ onClose }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalContent } = useContext(ModalContext);

  if (sessionUser) return <Redirect to="/" />;

  const shouldDisableSignUp = () => {
    if (
      !email ||
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      username.length < 4 ||
      password.length < 6 ||
      password !== confirmPassword
    )
      return true;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      if (password.length < 6) {
        setErrors((prevState) => ({
          ...prevState,
          password: "Password must be 6 characters or more",
        }));
        return;
      }
      const user = {
        email,
        username,
        firstName,
        lastName,
        password,
      };
      let res = {};
      await dispatch(sessionActions.signup(user)).catch(async (response) => {
        res = await response.json();
      });

      if (res.errors) {
        setErrors(res.errors);
      } else {
        onClose(); // Close the modal
      }
    } else {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      }));
    }
  };

  // Close Modal
  const handleModalClose = () => {
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setModalContent(null);
  };

  return (
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>
        <button disabled={shouldDisableSignUp()} type="submit">
          Sign Up
        </button>
        <button type="button" onClick={handleModalClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SignupFormPage;
