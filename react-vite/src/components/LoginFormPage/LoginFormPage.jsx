import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/teetimes/all" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({ email, password })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/teetimes/all");
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = "demo@aa.io";
    const demoPassword = "password"; // replace with your demo user's password
    const serverResponse = await dispatch(
      thunkLogin({ email: demoEmail, password: demoPassword })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/teetimes/all");
    }
  };

  return (
    <div className="login-page">
      <h2 className="teelogic-name">TeeLogic</h2>
      <div className="login-card">
        <h1>Log In</h1>

        {errors.general && <p className="error">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
        <button onClick={handleDemoLogin} id="demo-btn">
          Log in as Demo User
        </button>
      </div>
    </div>
  );
}

export default LoginFormPage;
