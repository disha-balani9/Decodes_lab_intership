import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    axios.get("http://localhost:3000/dashboard", {

      headers: {
        authorization: localStorage.getItem("token")
      }

    })

    .then(res => {
      setMessage(res.data.message);
    })

    .catch(err => {
      console.log(err);
    });

  }, []);

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (

    <div className="container">

      <h2>Dashboard</h2>

      <p>{message}</p>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Dashboard;