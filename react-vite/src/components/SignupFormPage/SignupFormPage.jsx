import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css"; 

export default function SignupForm() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("instructor");
  const [errors, setErrors] = useState({});
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.course_id) {
      setErrors({ general: "Cannot find your course. Please try again." });
      return;
    }

    const newUser = {
      username,
      email,
      password,
      role,
      course_id: currentUser.course_id,
    };

    const result = await dispatch(thunkSignup(newUser));

    if (result?.error) {
      setErrors(result.error);
      setSuccessInfo(null);
    } else {
      setSuccessInfo({ username, email, password });
      setErrors({});
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("instructor");
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      {errors.general && <p className="error">{errors.general}</p>}
      {errors.username && <p className="error">{errors.username[0]}</p>}
      {errors.email && <p className="error">{errors.email[0]}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="instructor">Instructor</option>
        <option value="Golf Shop Attendent">Golf Shop Attendent</option>
      </select>

      <button type="submit">Sign Up</button>

      {successInfo && (
        <div className="success-info">
          <p>User created successfully! Please share this info with your staff to log in:</p>
          <p><strong>Username:</strong> {successInfo.username}</p>
          <p><strong>Email:</strong> {successInfo.email}</p>
          <p><strong>Password:</strong> {successInfo.password}</p>
        </div>
      )}
    </form>
  );
}
