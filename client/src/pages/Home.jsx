import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }  
      try {
        const response = await axios.get("http://localhost:3000/api/home", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(response.data.email);
      } catch (error) {
        // window.location.href = "/";
        <Link to='/'/>
      }
    };
    fetchEmail();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Welcome, {email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
