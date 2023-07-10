import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { ModalProvider } from "./context/Modal";
import LandingPage from "./components/LandingPage";
import Spots from "./components/Spots/index";
import SpotDetail from "./components/SpotDetail/index";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ModalProvider>
        <Navigation isLoaded={isLoaded} />
        {isLoaded && (
          <Switch>
            <Route path="/login">
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route exact path="/">
              <LandingPage />
              <Spots />
            </Route>
            <Route path="/spots/:id">
              <SpotDetail />
            </Route>
          </Switch>
        )}
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
