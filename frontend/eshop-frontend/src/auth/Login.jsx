import { useState } from "react";
import { login } from "../service/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ email, password });
      loginUser(data);
      if (data.user.is_admin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-700 via-blue-600 to-purple-700 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-8 md:p-10 lg:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">Welcome to E-Shop</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">© 2025 AssureShop. All rights reserved.</p>
      </div>
    </div>
  );
}
