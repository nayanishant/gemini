import { useState } from "react";
import "./auth.css";
import axios from "axios";
import Loading from "../loading/loading";

const Signup = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    name: "",
    successMessage: "",
    conflictError: "",
    loading: false,
  });

  const setValues = (field, value) =>
    setState((prevState) => ({ ...prevState, [field]: value }));

  const URL = process.env.REACT_APP_NODE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    setValues("successMessage", "");
    setValues("conflictError", "");
    setValues("loading", true);
    try {
      const userData = { name: state.name, email: state.email, password: state.password };
      await axios.post(`${URL}/register`, userData);
      setValues(
        "successMessage",
        "Registration successful! Redirecting to login..."
      );
      if (state.successMessage) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      setValues(
        "conflictError",
        status === 409
          ? message || "User already exists."
          : "Signup failed, try again..."
      );

      setTimeout(() => {
        setValues("conflictError", "");
      }, 2000);
    } finally {
      setValues("loading", false);
    }
  };

  return (
    <div className="container-left">
      <h2 className="text-clr">Sign Up</h2>
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
      <form method="POST">
      <input
          type="text"
          placeholder="Name"
          value={state.name}
          onChange={(e) => setValues("name", e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={state.email}
          onChange={(e) => setValues("email", e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={state.password}
          onChange={(e) => setValues("password", e.target.value)}
          required
        />
        <button onClick={handleSignup} disabled={state.loading}>
          {state.loading ? "Signing Up..." : "Sign Up"}
        </button>
        {state.successMessage && (
          <p className="success-message">{state.successMessage}</p>
        )}
        {state.conflictError && (
          <p className="conflict-message">{state.conflictError}</p>
        )}
      </form>
      {state.loading && <Loading />}
    </div>
  );
};

export default Signup;
