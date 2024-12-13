import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUsername } from "../features/username/usernameSlice";
import { setUserId } from "../features/userID/userIdSlice";
import { useNavigate } from "react-router";
import { setToken } from "../features/authentication/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [roastMessage, setRoastMessage] = useState(""); // Roast message state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoints = !isRegister ? "/api/auth/register" : "/api/auth/login";
    try {
      const response = await axios.post(
        `http://localhost:3009${endpoints}`,
        formData
      );

      if (!isRegister) {
        console.log("Registered Successfully", response.data);
        toast.success("Registered successfully!");
      } else {
        console.log("Logged in Successfully", response.data);
        dispatch(setToken(response.data.token));
        toast.success("Logged in successfully!");
      }
      dispatch(setUsername(formData.username));
      dispatch(setUserId(response.data.id));

      navigate("/home");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        setRoastMessage(error.response.data.message); // Set the roast message on error
      } else {
        toast.error("Something went wrong. Please try again.");
        setRoastMessage("Are you even trying? Fix this and try again!"); // Default roast
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearRoastMessage = () => {
    setRoastMessage(""); // Clear the roast message
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Roast Container */}
      {roastMessage && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <p>{roastMessage}</p>
            <button
              onClick={clearRoastMessage}
              className="ml-4 bg-red-700 px-2 py-1 rounded-lg hover:bg-red-800 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative w-[90%] max-w-5xl h-[80vh] grid grid-cols-2 bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Cover Section */}
        <div
          className={`absolute top-0 h-full w-1/2 z-20 bg-purple-500 text-white flex flex-col items-center justify-center transition-transform duration-500 ${
            isRegister ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="text-center px-6">
            <h3 className="text-3xl font-bold mb-4">
              {!isRegister
                ? "Already have an account? Login Now!!!"
                : "Don't have an account? Register Now!!!"}
            </h3>
            <p className="text-white text-lg">
              {isRegister
                ? "Continue where you left off!"
                : "Join us today and enjoy exclusive benefits!"}
            </p>
            <button
              onClick={() => {
                setIsRegister(!isRegister); // Toggle the registration state
                setFormData({ username: "", password: "", email: "" }); // Reset the form fields
              }}
              className="mt-6 px-6 py-3 bg-white text-purple-500 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              {!isRegister ? "Go to Login" : "Go to Register"}
            </button>
          </div>
        </div>

        {/* Login Section */}
        <div className="relative z-10 flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-4">LOGIN</h2>
          <p className="text-gray-500 mb-6 text-center">
            How to get started lorem ipsum dolor at?
          </p>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none"
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
            >
              Login Now
            </button>
          </form>
          <div className="text-center mt-6">
            <p>Or Login with Others</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="flex items-center px-4 py-2 border rounded-lg shadow-md hover:bg-gray-100">
                <FcGoogle className="w-5 h-5 mr-2" />
                Google
              </button>
              <button className="flex items-center px-4 py-2 border rounded-lg shadow-md hover:bg-gray-100">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Register Section */}
        <div className="relative z-10 flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-4">REGISTER</h2>
          <p className="text-gray-500 mb-6 text-center">
            Join us today and get started!
          </p>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none"
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
            >
              Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
