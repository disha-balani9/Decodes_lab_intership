import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Signup() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const signup = () => {
    axios.post("http://localhost:3000/signup", user)
      .then(res => {
        alert(res.data.message);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container">
      <h2>Signup</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />

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

      <button onClick={signup}>Signup</button>

      <Link to="/login" className="link">
        Already have an account? Login
      </Link>
    </div>
  );
}

export default Signup;