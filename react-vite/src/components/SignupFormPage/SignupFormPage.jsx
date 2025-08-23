import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkSignup } from "../../redux/session";

export default function SignupForm() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user); // current logged-in user

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [errors, setErrors] = useState({});

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
      course_id: currentUser.course_id, // automatically use current user's course
    };

    const signupErrors = await dispatch(thunkSignup(newUser));
    if (signupErrors) {
      setErrors(signupErrors);
    } else {
      // optionally show a success message or redirect
      console.log("User signed up successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("student");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
      
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
        <option value="admin">Golf Pro</option>
        <option value="instructor">Instructor</option>
        <option value="student">Golf Shop Attendent</option>
      </select>

      <button type="submit">Sign Up</button>
    </form>
  );
}
