
import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import API_URL from "../apiConfig";

import {
  FaUserGraduate,
  FaUsers,
  FaBookOpen,
  FaChalkboardTeacher,
  FaTrash,
  FaEdit,
  FaSignOutAlt
} from "react-icons/fa";

function AdminDashboard() {

  const navigate = useNavigate();

  const [admissions, setAdmissions] =
  useState([]);

  /* Edit States */

  const [editingStudent, setEditingStudent] =
  useState(null);

  const [formData, setFormData] =
  useState({
    studentName: "",
    phone: "",
    email: "",
    studentClass: "",
    course: "",
    address: ""
  });

  const batchClasses = [
    "10th",
    "11th",
    "12th"
  ];

  const getBatchAdmissions = (batch) =>
    admissions.filter((student) =>
      student.studentClass === batch
    );

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();

  };

  useEffect(() => {

    fetchAdmissions();

  }, []);

  /* Fetch Admissions */

  const fetchAdmissions =
  async () => {

    try {

      const token =
      localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/admissions`,
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setAdmissions(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* Delete Student */

  const deleteStudent =
  async (id) => {

    const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

      const token =
      localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/admissions/${id}`,
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      fetchAdmissions();

    } catch (error) {

      console.log(error);

    }

  };

  /* Edit Student */

  const editStudent = (student) => {

    setEditingStudent(student._id);

    setFormData({

      studentName:
      student.studentName,

      phone:
      student.phone,

      email:
      student.email || "",

      studentClass:
      student.studentClass,

      course:
      student.course,

      address:
      student.address

    });

  };

  /* Update Student */

  const updateStudent =
  async () => {

    try {

      const token =
      localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/admissions/${editingStudent}`,
        formData,
        {
          headers: {
            Authorization:
            `Bearer ${token}`
          }
        }
      );

      setEditingStudent(null);

      fetchAdmissions();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-100
      via-blue-50
      to-indigo-100
      p-6
      md:p-10
    ">

      {/* Heading */}

      <motion.div

        initial={{
          opacity: 0,
          y: -50
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.7
        }}

        className="
          mb-12
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
        "
      >

        <div>

          <h1 className="
            text-4xl
            md:text-5xl
            font-extrabold
            bg-gradient-to-r
            from-blue-700
            to-indigo-700
            bg-clip-text
            text-transparent
            mb-3
          ">

            Admin Dashboard

          </h1>

          <p className="
            text-gray-600
            text-lg
          ">

            Welcome to Swami Coaching Classes Admin Panel

          </p>

        </div>

        <button
          onClick={logout}
          className="
            inline-flex
            items-center
            justify-center
            gap-3
            bg-red-500
            hover:bg-red-600
            text-white
            px-6
            py-3
            rounded-xl
            font-bold
            shadow-lg
            transition
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </motion.div>

      {/* Dashboard Cards */}

      <div className="
        grid
        md:grid-cols-3
        gap-8
        mb-14
      ">

        <motion.div

          whileHover={{
            scale: 1.03
          }}

          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            text-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-lg
                mb-2
              ">
                Total Admissions
              </p>

              <h2 className="
                text-5xl
                font-bold
              ">
                {admissions.length}
              </h2>

            </div>

            <FaUserGraduate className="
              text-6xl
              opacity-80
            " />

          </div>

        </motion.div>

        <motion.div

          whileHover={{
            scale: 1.03
          }}

          className="
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-lg
                mb-2
              ">
                Total Courses
              </p>

              <h2 className="
                text-5xl
                font-bold
              ">
                4
              </h2>

            </div>

            <FaBookOpen className="
              text-6xl
              opacity-80
            " />

          </div>

        </motion.div>

        <motion.div

          whileHover={{
            scale: 1.03
          }}

          className="
            bg-gradient-to-r
            from-pink-500
            to-rose-600
            text-white
            rounded-3xl
            shadow-2xl
            p-8
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-lg
                mb-2
              ">
                Expert Teachers
              </p>

              <h2 className="
                text-5xl
                font-bold
              ">
                5
              </h2>

            </div>

            <FaChalkboardTeacher className="
              text-6xl
              opacity-80
            " />

          </div>

        </motion.div>

      </div>

      {/* Batch Sections */}

      <div className="
        grid
        lg:grid-cols-3
        gap-6
        mb-14
      ">

        {batchClasses.map((batch) => {

          const batchAdmissions =
          getBatchAdmissions(batch);

          return (

            <motion.div
              key={batch}
              whileHover={{
                y: -4
              }}
              className="
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-blue-100
                overflow-hidden
              "
            >

              <div className="
                bg-gradient-to-r
                from-cyan-600
                to-blue-700
                text-white
                p-5
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="text-sm opacity-90">
                    Batch Section
                  </p>

                  <h3 className="
                    text-2xl
                    font-bold
                  ">
                    {batch} Batch
                  </h3>

                </div>

                <div className="
                  text-3xl
                  flex
                  items-center
                  gap-2
                ">
                  <FaUsers />
                  <span className="font-bold">
                    {batchAdmissions.length}
                  </span>
                </div>

              </div>

              <div className="p-5 space-y-4">

                {batchAdmissions.length ? (

                  batchAdmissions.map((student) => (

                    <div
                      key={student._id}
                      className="
                        border
                        border-gray-100
                        rounded-2xl
                        p-4
                        bg-gray-50
                      "
                    >

                      <h4 className="
                        font-bold
                        text-gray-900
                      ">
                        {student.studentName}
                      </h4>

                      <p className="text-sm text-gray-600">
                        {student.course} | {student.phone}
                      </p>

                      <p className="text-sm text-gray-500">
                        {student.email}
                      </p>

                    </div>

                  ))

                ) : (

                  <p className="
                    text-gray-500
                    text-sm
                    py-4
                  ">
                    No admissions in this batch yet.
                  </p>

                )}

              </div>

            </motion.div>

          );

        })}

      </div>

      {/* Admissions Table */}

      <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-x-auto
      ">

        <div className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-700
          text-white
          p-6
        ">

          <h2 className="
            text-3xl
            font-bold
          ">

            Student Admissions

          </h2>

        </div>

        <table className="
          w-full
          text-left
        ">

          <thead className="
            bg-blue-50
          ">

            <tr>

              <th className="p-5">
                #
              </th>

              <th className="p-5">
                Name
              </th>

              <th className="p-5">
                Phone
              </th>

              <th className="p-5">
                Email
              </th>

              <th className="p-5">
                Class
              </th>

              <th className="p-5">
                Course
              </th>

              <th className="p-5">
                Address
              </th>

              <th className="p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {admissions.map((item, index) => (

              <tr
                key={item._id}
                className="
                  border-b
                  hover:bg-blue-50
                "
              >

                <td className="p-5">
                  {index + 1}
                </td>

                <td className="p-5">
                  {item.studentName}
                </td>

                <td className="p-5">
                  {item.phone}
                </td>

                <td className="p-5">
                  {item.email}
                </td>

                <td className="p-5">
                  {item.studentClass}
                </td>

                <td className="p-5">
                  {item.course}
                </td>

                <td className="p-5">
                  {item.address}
                </td>

                <td className="
                  p-5
                  flex
                  gap-3
                ">

                  <button

                    onClick={() =>
                      editStudent(item)
                    }

                    className="
                      bg-blue-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      hover:bg-blue-600
                      transition
                    "
                  >

                    <FaEdit />

                  </button>

                  <button

                    onClick={() =>
                      deleteStudent(item._id)
                    }

                    className="
                      bg-red-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      hover:bg-red-600
                      transition
                    "
                  >

                    <FaTrash />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Edit Modal */}

      {editingStudent && (

        <div className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
          z-50
        ">

          <div className="
            bg-white
            p-8
            rounded-3xl
            w-full
            max-w-lg
          ">

            <h2 className="
              text-3xl
              font-bold
              mb-6
            ">

              Edit Student

            </h2>

            <input
              type="text"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  studentName:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <select
              value={formData.studentClass}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  studentClass:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
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

            <input
              type="text"
              placeholder="Course"
              value={formData.course}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  course:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address:
                  e.target.value
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-6
              "
            />

            <div className="
              flex
              gap-4
            ">

              <button

                onClick={updateStudent}

                className="
                  bg-blue-600
                  text-white
                  px-6
                  py-3
                  rounded-xl
                "
              >

                Update

              </button>

              <button

                onClick={() =>
                  setEditingStudent(null)
                }

                className="
                  bg-gray-400
                  text-white
                  px-6
                  py-3
                  rounded-xl
                "
              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default AdminDashboard;
