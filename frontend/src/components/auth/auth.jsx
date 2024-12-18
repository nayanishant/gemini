import React, { useState } from "react";
import "./auth.css";
import SignUp from "./signup";
import LogIn from "./login";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        {isSignUp ? <LogIn /> : <SignUp />}
        <div className="container-right">
          <div>
            <h2 className="text-clr">Hello, Friend!</h2>
            <p className="text-clr">
              Register with your personal details to use all of our site
              features.
            </p>
            <button onClick={handleToggle}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
