import React, { useState, useContext } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { ModalContext } from '../../context/Modal';
import './LoginForm.css';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { setModalContent } = useContext(ModalContext);

  const handleLogin = async (cred, pass) => {
    setCredential(cred);
    setPassword(pass);
    setErrors({});
    setIsLoading(true);

    //Checking Credentials (Should err if not)
    if (cred.length < 4 || pass.length < 6) {
      setErrors({credential: "Username is less than 4 characters or the password is less than 6 characters"});
      setIsLoading(false);
      return;
    }

    let res = {};
    await dispatch(sessionActions.login({ credential: cred, password: pass }))
    .catch(
      async (response) => {
        res = await response.json();
      }
    );

    if (res.errors) {
      setErrors(res.errors);
      setIsLoading(false);
    } else {
      setModalContent(null);
    }
  };

  //Demo Login
  const handleDemoLogin = () => {
    handleLogin('Demo-lition', 'password');
  };

  //Close Modal
  const handleModalClose = () => {
    setCredential('');
    setPassword('');
    setErrors({});
    setIsLoading(false);
    setModalContent(null);
  };

  if (sessionUser) return <Route to="/" />;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>Log In</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(credential, password);}}>
          <label>
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.credential && <p>{errors.credential}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          <button type="button" onClick={handleDemoLogin}>
            Log in as Demo User
          </button>
          <button type="button" onClick={handleModalClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
