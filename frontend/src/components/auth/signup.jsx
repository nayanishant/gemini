import "./auth.css";

const signup = () => {
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
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <a href={"/login"} className="text-clr">
          Already have an account? Log In
        </a>
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default signup;
