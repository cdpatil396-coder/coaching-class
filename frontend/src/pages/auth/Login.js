import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../apiConfig";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
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

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      /* Save Token */

      localStorage.setItem(
        "token",
        res.data.token
      );

      /* Save User */

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      /* Redirect */

      navigate(
        res.data.user?.role === "admin" ? "/admin" : "/dashboard"
      );

      /* Auto Refresh Website */

      window.location.reload();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
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

          Student Login

        </h1>

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

          Login

        </button>

      </form>

    </div>

  );
}

export default Login;
