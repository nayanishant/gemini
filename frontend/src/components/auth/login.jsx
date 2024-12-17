import React, { useState } from "react";
import "./auth.css";
import SignUp from "./signup";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => {
    setIsSignUp(false);
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        {isSignUp ? (
          <div className="container-left">
            <h2 className="text-clr">Sign In</h2>
            <div className="social-btn">
              <button>
                <i className="fab fa-google"></i>
              </button>
              <button>
                <i className="fab fa-facebook"></i>
              </button>
              <button>
                <i className="fab fa-linkedin"></i>
              </button>
            </div>
            <p className="text-clr">or use your email account:</p>
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <a href="www.google.com" className="text-clr">
                Forgot Your Password?
              </a>
              <button>Sign In</button>
            </form>
          </div>
        ) : (
          <SignUp />
        )}
        <div className="container-right">
          <div>
            <h2 className="text-clr">Hello, Friend!</h2>
            <p className="text-clr">
              Register with your personal details to use all of our site
              features.
            </p>
            <button onClick={handleToggle}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
