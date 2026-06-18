import { useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

function Admission() {

  const [formData, setFormData] = useState({

    studentName: "",
    phone: "",
    studentClass: "",
    course: "",
    address: ""

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

        `${process.env.REACT_APP_API_URL}/api/admissions`,

        formData

      );

      alert(res.data.message);

      setFormData({

        studentName: "",
        phone: "",
        studentClass: "",
        course: "",
        address: ""

      });

    } catch (error) {

      alert("Error submitting form");

    }

  };

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-blue-100
      via-indigo-100
      to-purple-100
      flex
      items-center
      justify-center
      p-6
    ">

      <motion.form

        initial={{
          opacity: 0,
          y: 50
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.7
        }}

        onSubmit={handleSubmit}

        className="
          bg-white/80
          backdrop-blur-lg
          shadow-2xl
          rounded-3xl
          p-10
          w-full
          max-w-2xl
          border
          border-white/30
        "
      >

        <h1 className="
          text-5xl
          font-extrabold
          text-center
          mb-10
          bg-gradient-to-r
          from-blue-700
          to-indigo-700
          bg-clip-text
          text-transparent
        ">

          Admission Form

        </h1>

        {/* Student Name */}

        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          className="
            w-full
            p-4
            rounded-2xl
            border
            border-gray-200
            mb-5
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          required
        />

        {/* Phone */}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="
            w-full
            p-4
            rounded-2xl
            border
            border-gray-200
            mb-5
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          required
        />

        {/* Class */}

        <select
          name="studentClass"
          value={formData.studentClass}
          onChange={handleChange}
          className="
            w-full
            p-4
            rounded-2xl
            border
            border-gray-200
            mb-5
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          required
        >

          <option value="">
            Select Class
          </option>

          <option value="10th">
            10th
          </option>

          <option value="11th">
            11th
          </option>

          <option value="12th">
            12th
          </option>

        </select>

        {/* Course */}

        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="
            w-full
            p-4
            rounded-2xl
            border
            border-gray-200
            mb-5
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          required
        >

          <option value="">
            Select Course
          </option>

          <option value="Mathematics">
            Mathematics
          </option>

          <option value="Science">
            Science
          </option>

          <option value="English">
            English
          </option>

        </select>

        {/* Address */}

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          rows="4"
          className="
            w-full
            p-4
            rounded-2xl
            border
            border-gray-200
            mb-6
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
          required
        />

        {/* Button */}

        <motion.button

          whileHover={{
            scale: 1.03
          }}

          whileTap={{
            scale: 0.97
          }}

          className="
            w-full
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            text-white
            py-4
            rounded-2xl
            font-bold
            text-lg
            shadow-xl
          "
        >

          Submit Admission

        </motion.button>

      </motion.form>

    </div>

  );
}

export default Admission;
