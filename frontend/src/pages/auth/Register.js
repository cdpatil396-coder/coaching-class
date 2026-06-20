import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaUser
} from "react-icons/fa";
import API_URL from "../../apiConfig";

function Register() {
  const navigate = useNavigate();
  const pendingAdmission = (() => {
    try {
      return JSON.parse(localStorage.getItem("pendingAdmission"));
    } catch (error) {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    name: pendingAdmission?.name || "",
    contact: pendingAdmission?.email || pendingAdmission?.phone || "",
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
      const contact = formData.contact.trim();
      const payload = {
        name: formData.name,
        password: formData.password
      };

      if (pendingAdmission?.email) {
        payload.admissionEmail = pendingAdmission.email;
      }

      if (pendingAdmission?.phone) {
        payload.admissionPhone = String(pendingAdmission.phone).replace(/\D/g, "");
      }

      if (contact.includes("@")) {
        payload.email = contact.toLowerCase();
      } else {
        payload.phone = contact.replace(/\D/g, "");
        if (!payload.phone) {
          alert("Please enter a valid phone number");
          setLoading(false);
          return;
        }
      }

      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        payload
      );

      alert(res.data.message);
      localStorage.removeItem("pendingAdmission");
      localStorage.removeItem("admissionSubmitted");
      navigate("/login");
    } catch (error) {
      const apiMessage = error.response?.data?.message || error.response?.data?.error;
      alert(apiMessage || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_45%,_#ecfccb_100%)] px-4 py-10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
            Create account
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">
            Student Register
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Register with email or phone number.
          </p>
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <div className="relative mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FaUser />
          </span>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            required
          />
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email or Phone
        </label>
        <div className="relative mb-5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {formData.contact.includes("@") ? <FaEnvelope /> : <FaPhoneAlt />}
          </span>
          <input
            type="text"
            name="contact"
            placeholder="Email or phone number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-4 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
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
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-4 pr-24 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-4 font-bold text-white shadow-xl transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
