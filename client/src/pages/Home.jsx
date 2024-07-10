import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setEmail(response.data.email);
        setName(response.data.name);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchEmail();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800">
        <div className="space-y-4 text-center divide-y dark:divide-gray-300">
          <div className="my-2 space-y-1">
            <h2 className="text-xl font-semibold sm:text-2xl">{name}</h2>
          </div>
          <div className="pt-2 space-y-4">
            <p className="text-sm dark:text-gray-600">{email}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-semibold text-sm text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
