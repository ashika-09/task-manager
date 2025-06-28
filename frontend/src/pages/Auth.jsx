import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // Automatically include cookies

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => setIsLogin(!isLogin);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const emailID = form.emailID.value;
    const password = form.password.value;

    if (!firstName || !lastName || !emailID || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        firstName,
        lastName,
        emailID,
        password,
      });

      if (res.status === 200) {
        alert("Account created!");
        form.reset();
        setIsLogin(true);
      }
    } catch (err) {
      alert(err?.response?.data || "Registration failed.");
      console.error("Registration error:", err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const emailID = form.emailID.value;
    const password = form.password.value;

    if (!emailID || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        emailID,
        password,
      });

      if (res.status === 200) {
        alert("Login successful");
        navigate("/home");
      }
    } catch (err) {
      alert(err?.response?.data || "Login failed.");
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <div className="flex justify-center gap-6 mb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-full font-semibold ${
              isLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-full font-semibold ${
              !isLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h2>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="w-full p-3 border rounded-md"
              />
            </>
          )}
          <input
            type="email"
            name="emailID"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={handleToggle}
            className="text-blue-500 font-semibold underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
