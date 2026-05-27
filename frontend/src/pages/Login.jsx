import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Login() {

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const login = () => {
    axios.post("http://localhost:3000/login", user)
      .then(res => {
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button onClick={login}>Login</button>

      <Link to="/signup" className="link">
        Don't have an account? Signup
      </Link>
    </div>
  );
}

export default Login;