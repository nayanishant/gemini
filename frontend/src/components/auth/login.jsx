import "./auth.css"

const Login = () => {
  return (
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
  )
}

export default Login