import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../apiConfig";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
        `${API_URL}/api/auth/register`,
        formData
      );

      alert(res.data.message);

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
          type="password"
          name="password"
          placeholder="Password"
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
