import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaPhoneAlt
} from "react-icons/fa";
import API_URL from "../../apiConfig";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");
      navigate(res.data.user?.role === "admin" ? "/admin" : "/dashboard", {
        replace: true
      });
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_45%,_#ecfeff_100%)] px-4 py-10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-700">
            Welcome back
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">
            Student Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Use your email or phone number to sign in.
          </p>
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email or Phone
        </label>
        <div className="relative mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {formData.identifier.includes("@") ? <FaEnvelope /> : <FaPhoneAlt />}
          </span>
          <input
            type="text"
            name="identifier"
            placeholder="Enter email or phone number"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            required
          />
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>
        <div className="relative mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-4 pr-24 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 py-4 font-bold text-white shadow-xl transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
