import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../apiConfig";

function Register() {

  const navigate = useNavigate();
  const pendingAdmission = JSON.parse(
    localStorage.getItem("pendingAdmission")
  );

  const [formData, setFormData] = useState({
    name: pendingAdmission?.name || "",
    email: pendingAdmission?.email || "",
    password: ""
  });
  const [showPassword, setShowPassword] =
  useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (!localStorage.getItem("admissionSubmitted")) {
        alert("Please fill admission form first");
        navigate("/admission");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );

      alert(res.data.message);

      localStorage.removeItem("pendingAdmission");

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }

  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-blue-100
      to-indigo-200
      p-6
    ">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          shadow-2xl
          rounded-3xl
          p-10
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-4xl
          font-bold
          text-center
          mb-8
          text-blue-700
        ">

          Student Register

        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="
            w-full
            p-4
            border
            rounded-xl
            mb-5
          "
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="
            w-full
            p-4
            border
            rounded-xl
            mb-5
          "
          required
        />

        <div className="relative mb-5">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full
              p-4
              pr-24
              border
              rounded-xl
            "
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-sm
              font-bold
              text-blue-700
            "
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        <button
          type="submit"
          className="
            w-full
            bg-blue-700
            text-white
            py-4
            rounded-xl
            font-bold
            hover:bg-blue-800
            transition-all
          "
        >

          Register

        </button>

      </form>

    </div>

  );
}

export default Register;
